namespace ChattyNotifier.src.serialized
{
    public class NotificationQueue
    {
        public NotificationQueue()
        {
        }

        public NotificationQueue(int queue)
        {
            Queue = queue;
        }

        public int Queue { get; set; }
    }
}