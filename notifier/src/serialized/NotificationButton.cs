using Microsoft.Toolkit.Uwp.Notifications;

namespace ChattyNotifier.src.serialized
{
    public class NotificationButton
    {
        public ToastActivationType ActivationType = ToastActivationType.Background;

        public string Content { get; set; }
        public ToastActivationOptions ActivationOptions { get; set; }
        public string Arguments { get; set; }
        public string Icon { get; set; }
        public string ID { get; set; }
        public string HintID { get; set; }
    }
}