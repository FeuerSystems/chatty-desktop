using System.Collections.Generic;

namespace ChattyNotifier.src.serialized
{
    public class NotificationComboBox
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string DefaultSelection { get; set; }

        public List<NotificationComboBoxChoice> Choices { get; set; }
    }
}