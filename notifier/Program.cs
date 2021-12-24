using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Xml;
using Windows.Foundation.Collections;
using Windows.Graphics.Display;
using Windows.UI.Notifications;
using ABI.Windows.ApplicationModel.Activation;
using ChattyNotifier;
using ChattyNotifier.src;
using ChattyNotifier.src.events;
using ChattyNotifier.src.Managers;
using ChattyNotifier.src.scopes;
using ChattyNotifier.src.serialized;
using Fleck;
using Microsoft.Toolkit.Uwp.Notifications;
using Microsoft.WindowsAPICodePack.Shell.PropertySystem;
using MS.WindowsAPICodePack.Internal;
using Newtonsoft.Json;
using TinyMessenger;
using ToastTextBox = ChattyNotifier.src.serialized.ToastTextBox;

namespace ChattyNotifier
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            ShortCutCreator.TryCreateShortcut("ChattyNotifier.App", "ChattyNotifier");
            const int version = 1;
            var stopwatch = new Stopwatch();
            Console.WriteLine("[Server -> Start]: Starting Server...");
            stopwatch.Start();
            var sockets = new List<ChattySocket>();
            var server = new WebSocketServer("ws://0.0.0.0:6789");
            var messageHub = new TinyMessengerHub();
            var authManager = new AuthenticationManager(messageHub);
            var toastManager = ToastNotificationManagerCompat.CreateToastNotifier();
            authManager.ProcessCompleted += SocketEvent;

            void SocketEvent(object sender, SocketEvents e)
            {
                Console.WriteLine("Event received From Child");
                sockets = e.Sockets;
            }

            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    Console.WriteLine($"[Socket -> {socket.GetHashCode()} -> Connect]: Socket Opened");
                    socket.Send(new ChattyJSONPayload().AsJSON());
                    sockets.Add(new ChattySocket(socket, true));
                    // Disabled auth for now.. waiting for more stable release.
                    /* messageHub.Publish(new SocketEvents(sockets));*/
#pragma warning disable CS4014
                    /*  Utils.SetInterval(() => authManager.RefreshToken(sockets), TimeSpan.FromMinutes(5));*/
                };
                socket.OnClose = () =>
                {
                    Console.WriteLine($"[Socket -> {socket.GetHashCode()} -> Disconnect]: Socket Closed ");
                    sockets.Remove(sockets.Find(c => c.Socket == socket));
                    messageHub.Publish(new SocketEvents(sockets));
                };
                socket.OnMessage = msg =>
                {
                    Console.WriteLine($"[Socket -> {socket.GetHashCode()} -> Message]: {msg}");
                    try
                    {
                        stopwatch.Restart();
                        var message = JsonConvert.DeserializeObject<ChattyJSONPayload>(msg);
                        stopwatch.Stop();
                        Console.WriteLine($"[ChattyJSON -> Deserialization]: Took {stopwatch.ElapsedMilliseconds}ms");
                        if (message.op == 1) Console.WriteLine($"[Socket -> ACK]: From {socket.GetHashCode()}");

                        if (message.op != 2) return;
                        switch (message.type)
                        {
                            case "authenticate":

                                var data = (TokenRepresentation) message.d;
                                if (data.Token != authManager.Token)
                                {
                                    socket.Close(4003);
                                }
                                else
                                {
                                    sockets.Remove(new ChattySocket(socket, false));
                                    sockets.Add(new ChattySocket(socket, true));
                                    messageHub.Publish(new SocketEvents(sockets));
                                }

                                break;
                            case "notify":
                            {
                                // try
                                // {
                                InterpretDataToToast(socket, message.d);
                                // } catch(Exception e)
                                // // {
                                // //     socket.Send(new ChattyJSONPayload(2, "MALFORMED_DATA", $"This data was malformed: {e.Message}").AsJSON());
                                // // }
                                break;
                            }
                        }
                    }
                    catch (Exception err)
                    {
                        stopwatch.Stop();
                        Console.WriteLine(
                            $"[ChattyJSON -> Deserialization -> Error]: Took {stopwatch.ElapsedMilliseconds}ms");
                        Console.WriteLine($"[Socket -> {socket.GetHashCode()} -> Error]: {err.Message}");
                        Console.WriteLine(err);
                    }
                };
            });


            stopwatch.Stop();
            var audio = new ToastAudio
            {
                Silent = true
            };
            Console.WriteLine($"[Server -> Start]: Started in {stopwatch.ElapsedMilliseconds}ms (Version {version})");
            new ToastContentBuilder()
                .AddText("Chatty Notifier Server Online.")
                .AddText($"Started in {stopwatch.ElapsedMilliseconds}ms (v{version})")
                .AddAudio(audio)
                .Show();


            var input = Console.ReadLine();
            while (input != "exit")
            {
                foreach (var socket in sockets.ToList()) socket.Socket.Send(input);
                input = Console.ReadLine();
            }

            void InterpretDataToToast(IWebSocketConnection socket, object data)
            {
                var toast = new ToastContentBuilder();
                var audio = new ToastAudio
                {
                    Silent = true
                };
                toast.AddAudio(audio);
                var dynamicToast = new ChattyToast(Guid.NewGuid().ToString());
                var toastTexts = new List<string>();
                var toastTextBoxes = new List<ToastTextBox>();
                var toastButtons = new List<NotificationButton>();
                var notification = (dynamic) data;
                if (notification.texts != null)
                    foreach (var text in notification.texts)
                    {
                        Console.WriteLine(text);
                        toast.AddText((string) text);
                        toastTexts.Add((string) text);
                    }

                if (notification.buttons != null)
                    foreach (var button in notification.buttons)
                    {
                        var superButton = new ToastButton();
                        NotificationButton dynamicButton =
                            JsonConvert.DeserializeObject<NotificationButton>(JsonConvert.SerializeObject(button));
                        toastButtons.Add(dynamicButton);
                        if (dynamicButton.Content != null)
                        {
                            superButton.SetContent(dynamicButton.Content);
                        }

                        if (dynamicButton.Arguments != null)
                            superButton.AddArgument(dynamicButton.Arguments);

                        if (dynamicButton.ActivationOptions != null)
                            superButton.ActivationOptions = dynamicButton.ActivationOptions;
                        if (dynamicButton.HintID != null) superButton.SetTextBoxId(dynamicButton.HintID);
                        
                        if (dynamicButton.Icon != null) superButton.SetImageUri(new Uri(dynamicButton.Icon));

                        superButton.ActivationType = dynamicButton.ActivationType;
                        Console.WriteLine(toast);
                        toast.AddButton(superButton);
                    }

                if (notification.attribute != null)
                {
                    toast.AddAttributionText((string) notification.attribute);
                }

                if (notification.textboxes != null)
                {
                    foreach (var textbox in notification.textboxes)
                    {
                        var dynamicTextBox = new ToastTextBox();
                        if (textbox.input != null)
                        {
                            dynamicTextBox.Input = (string) textbox.input;
                        }

                        if (textbox.id != null)
                        {
                            dynamicTextBox.Id = (string) textbox.id;
                        }

                        if (textbox.placeholder != null)
                        {
                            dynamicTextBox.Placeholder = (string) textbox.placeholder;
                        }

                        if (textbox.title != null)
                        {
                            dynamicTextBox.Title = (string) textbox.title;
                        }

                        toastTextBoxes.Add(dynamicTextBox);
                        toast.AddInputTextBox(dynamicTextBox.Id, dynamicTextBox.Placeholder, dynamicTextBox.Title);
                    }
                }

                if (notification.comboboxes != null)
                {
                    foreach (var combobox in notification.comboboxes)
                    {
                        var dynamicComboBox = new NotificationComboBox();
                        var comboBoxChoices = new List<NotificationComboBoxChoice>();
                        if (combobox.id != null)
                        {
                            dynamicComboBox.Id = (string) combobox.id;
                        }

                        if (combobox.title != null)
                        {
                            dynamicComboBox.Title = (string) combobox.title;
                        }

                        if (combobox.defaultSelection != null)
                        {
                            dynamicComboBox.DefaultSelection = (string) combobox.defaultSelection;
                        }

                        if (combobox.choices == null) continue;
                        foreach (var choice in notification.choices)
                        {
                            var dynamicChoice = new NotificationComboBoxChoice();
                            if (choice.id != null)
                            {
                                dynamicChoice.Id = choice.id;
                            }

                            if (choice.content != null)
                            {
                                dynamicChoice.Content = choice.content;
                            }

                            comboBoxChoices.Add(dynamicChoice);
                        }

                        // object[] comboBoxChoicesParam = {new {"", ""} };
                        toast.AddComboBox(combobox.id, combobox.title, combobox.defaultSelection);
                    }
                }

                if (notification.logo != null)
                {
                    var logo = new NotificationLogo();
                    if (notification.logo.src != null)
                    {
                        logo.Source = (string) notification.logo.src;
                    }

                    if (notification.logo.circle != null || notification.logo.circle == true)
                    {
                        logo.CircleCrop = true;
                    }

                    toast.AddAppLogoOverride(new Uri(logo.Source),
                        logo.CircleCrop ? ToastGenericAppLogoCrop.Circle : ToastGenericAppLogoCrop.Default);
                }

                if (notification.images != null)
                {
                    if (notification.images.inline != null)
                    {
                        toast.AddInlineImage(new Uri((string) notification.images.inline));
                    }

                    if (notification.images.header != null)
                    {
                        toast.AddHeroImage(new Uri((string) notification.images.header));
                    }
                }
                // toast.Show();
                var abstractToast = new ToastNotification(toast.GetXml());
                ToastEvents events = new ToastEvents(socket);
                abstractToast.Dismissed += events.ToastDismissed;
                abstractToast.Failed += events.ToastFailed;
                ToastNotificationManagerCompat.OnActivated += toastArgs =>
                {
                    // Obtain the arguments from the notification
                    ToastArguments args = ToastArguments.Parse(toastArgs.Argument);

                    // Obtain any user input (text boxes, menu selections) from the notification
                    ValueSet userInput = toastArgs.UserInput;
                    socket.Send(new ChattyJSONPayload(3, "activated", new ChattyToastActivation(args, userInput)).AsJSON());
                };
                ToastNotificationManager
                    .CreateToastNotifier("ChattyNotifier.App")
                    .Show(abstractToast);
                dynamicToast.Texts = toastTexts;
                dynamicToast.Buttons = toastButtons;
                dynamicToast.TextBoxes = toastTextBoxes;
                dynamicToast.queuePos = toastManager.GetScheduledToastNotifications().Count + 1;
                Console.WriteLine($"[WS -> DEBUG]: {dynamicToast}");
                socket.Send(new ChattyJSONPayload(3, "create", dynamicToast).AsJSON());

                void ToastActivation(ToastNotification orig, object respondingEventArgs)
                {
                    Console.WriteLine("hurr durr");
                    ToastNotificationActivatedEventArgs toastArgs =
                        (ToastNotificationActivatedEventArgs) respondingEventArgs;
                    Console.WriteLine(new ChattyJSONPayload(3, "input", toastArgs).AsJSON());
                    var doc = new XmlDocument();
                    doc.LoadXml(orig.Content.GetElementsByTagName("toast")[0].GetXml());
                    socket.Send(new ChattyJSONPayload(3, "input", respondingEventArgs).AsJSON().Replace("@", ""));
                }
            }
        }


        public static string GetXMLAsString(XmlDocument myxml)
        {
            using (var stringWriter = new StringWriter())
            {
                using (var xmlTextWriter = XmlWriter.Create(stringWriter))
                {
                    myxml.WriteTo(xmlTextWriter);
                    return stringWriter.ToString();
                }

            }
        }
    }
    class ToastEvents
      
    {
        private IWebSocketConnection Socket { get; set;}
        public ToastEvents(IWebSocketConnection socket)
        {
            this.Socket = socket;
        }

        internal void ToastDismissed(ToastNotification sender, ToastDismissedEventArgs e)
        {
            String outputText = "";
            switch (e.Reason)
            {
                case ToastDismissalReason.ApplicationHidden:
                    outputText = "The app hid the toast using ToastNotifier.Hide";
                    break;
                case ToastDismissalReason.UserCanceled:
                    outputText = "The user dismissed the toast";
                    break;
                case ToastDismissalReason.TimedOut:
                    outputText = "The toast has timed out";
                    break;
            }

            Console.WriteLine(outputText);
        }

        internal void ToastFailed(ToastNotification sender, ToastFailedEventArgs e)
        {
            Console.WriteLine("The toast encountered an error.");
        }
    }
      static class ShortCutCreator
        {
            // In order to display toasts, a desktop application must have
            // a shortcut on the Start menu.
            // Also, an AppUserModelID must be set on that shortcut.
            // The shortcut should be created as part of the installer.
            // The following code shows how to create
            // a shortcut and assign an AppUserModelID using Windows APIs.
            // You must download and include the Windows API Code Pack
            // for Microsoft .NET Framework for this code to function

            internal static bool TryCreateShortcut(string appId, string appName)
            {
                String shortcutPath = Environment.GetFolderPath(
                    Environment.SpecialFolder.ApplicationData) +
                    "\\Microsoft\\Windows\\Start Menu\\Programs\\" + appName + ".lnk";
                Console.WriteLine($"Shortcut path {shortcutPath}");
                if (!File.Exists(shortcutPath))
                {
                    InstallShortcut(appId, shortcutPath);
                    return true;
                }
                return false;
            }

            static void InstallShortcut(string appId, string shortcutPath)
            {
                // Find the path to the current executable
                String exePath = Process.GetCurrentProcess().MainModule.FileName;
                Console.WriteLine($"Installing shortcut {exePath}");
                IShellLinkW newShortcut = (IShellLinkW)new CShellLink();
                Console.WriteLine($"new shortcut {newShortcut}");
                // Create a shortcut to the exe
                VerifySucceeded(newShortcut.SetPath(exePath));
                VerifySucceeded(newShortcut.SetArguments(""));

                // Open the shortcut property store, set the AppUserModelId property
                IPropertyStore newShortcutProperties = (IPropertyStore)newShortcut;

                using (PropVariant applicationId = new PropVariant(appId))
                {
                    VerifySucceeded(newShortcutProperties.SetValue(
                        SystemProperties.System.AppUserModel.ID, applicationId));
                    VerifySucceeded(newShortcutProperties.Commit());
                }

                // Commit the shortcut to disk
                IPersistFile newShortcutSave = (IPersistFile)newShortcut;
                Console.WriteLine($"perm shortcut {newShortcutSave}");
                VerifySucceeded(newShortcutSave.Save(shortcutPath, true));
            }

            static void VerifySucceeded(UInt32 hresult)
            {
                if (hresult <= 1)
                    return;

                throw new Exception("Failed with HRESULT: " + hresult.ToString("X"));
            }
        }
}



    
    