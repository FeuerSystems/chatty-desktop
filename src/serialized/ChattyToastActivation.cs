using Windows.Foundation.Collections;
using Microsoft.Toolkit.Uwp.Notifications;

namespace ChattyNotifier.src.serialized
{
    public class ChattyToastActivation
    {
        public ToastArguments  Args { get; set; }
        public ValueSet Input { get; set; }

        public ChattyToastActivation(ToastArguments args, ValueSet input)
        {
            Args = args;
            Input = input;
        }
    }
}