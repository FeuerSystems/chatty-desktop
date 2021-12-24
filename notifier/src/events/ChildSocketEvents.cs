using System.Collections.Generic;
using ChattyNotifier.src.scopes;
using TinyMessenger;

namespace ChattyNotifier.src.events
{
    internal class ChildSocketEvents : ITinyMessage
    {
        public List<ChattySocket> Sockets;

        public ChildSocketEvents(List<ChattySocket> sockets)
        {
            Sockets = sockets;
        }

        public ChildSocketEvents()
        {
        }

        public object Sender { get; private set; }
    }
}