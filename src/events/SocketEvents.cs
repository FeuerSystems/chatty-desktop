using System.Collections.Generic;
using ChattyNotifier.src.scopes;
using TinyMessenger;

namespace ChattyNotifier.src.events
{
    public class SocketEvents : ITinyMessage
    {
        public List<ChattySocket> Sockets;

        public SocketEvents(List<ChattySocket> sockets)
        {
            Sockets = sockets;
        }

        public SocketEvents()
        {
        }

        public object Sender { get; private set; }
    }
}