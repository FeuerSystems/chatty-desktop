using System.Collections.Generic;

namespace ChattyNotifier.src.serialized
{
    public class ChattyToast
    {
#nullable enable
        public List<NotificationButton>? Buttons;
        public List<ToastTextBox>? TextBoxes;
        public ChattyToastAudio? Audio;
        public string? Attributes;
        public List<string>? Texts;
        public List<NotificationComboBox>? ComboBoxes;
        public NotificationLogo? Logo;
        public List<NotificationHeader>? Headers;
        public string? InlineImage;
        public string? HeaderImage;
        public string ID;
        public int? queuePos;

        public ChattyToast(string id)
        {
            ID = id;
        }
    }
}