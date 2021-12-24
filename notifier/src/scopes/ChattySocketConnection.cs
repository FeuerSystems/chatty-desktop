using Fleck;

namespace ChattyNotifier.src.scopes
{
    public class ChattySocket
    {
        public ChattySocket(IWebSocketConnection socket, bool authenicated)
        {
            Socket = socket;
            Authenicated = authenicated;
        }

        public IWebSocketConnection Socket { get; set; }
        public bool Authenicated { get; set; }
    }
}