using System;
using System.Collections.Generic;
using System.IO;
using ChattyNotifier.src.events;
using ChattyNotifier.src.scopes;
using ChattyNotifier.src.serialized;
using TinyMessenger;

namespace ChattyNotifier.src.Managers
{
    public sealed class AuthenticationManager
    {
        private readonly string _currentPath = Directory.GetCurrentDirectory() + @"\s-cache";
        private List<ChattySocket> _sockets;
        public string Token = Guid.NewGuid().ToString();

        public AuthenticationManager(ITinyMessengerHub messengerHub)
        {
            var workingDir = Directory.CreateDirectory(_currentPath);
            Console.WriteLine($"[AuthManager -> Directory -> Working]: {workingDir.FullName}");
            var file = File.Create(workingDir.FullName + @"\auth.json");
            file.Close();
            File.WriteAllText(file.Name, new AuthJSONPriv(Token).AsJSON());

            messengerHub.Subscribe<SocketEvents>(e =>
            {
                var terminology = e.Sockets.Count == 0 ? "" :
                    e.Sockets.Count > 1 ? " sockets total" :
                    e.Sockets.Count == 1 ? " socket" : " sockets";
                Console.WriteLine($"[AuthManager -> Socket]: Received Socket Event ({e.Sockets.Count}{terminology})");
                _sockets = e.Sockets;
            });
        }

        public event EventHandler<SocketEvents> ProcessCompleted;

        public void RefreshToken(List<ChattySocket> chattySockets)
        {
            Token = Guid.NewGuid().ToString();
            File.WriteAllText(@$"{_currentPath}\auth.json", new AuthJSONPriv(Token).AsJSON());
            chattySockets?.ForEach(socket =>
            {
                if (!socket.Authenicated)
                {
                    socket.Socket.Send(new ChattyJSONPayload(2, "FORBIDDEN", "You must fufill authentication")
                        .AsJSON());
                    socket.Socket.Close(4000);
                    _sockets.Remove(socket);
                    OnProcessCompleted(new SocketEvents(_sockets));
                }
                else
                {
                    socket.Authenicated = false;
                    socket.Socket.Send(new ChattyJSONPayload(2, "refresh", new TokenRepresentation(Token))
                        .AsJSON());
                }
            });
        }

        private void OnProcessCompleted(SocketEvents e)
        {
            ProcessCompleted?.Invoke(this, e);
        }
    }
}