using System;
using System.Threading.Tasks;

namespace ChattyNotifier.src
{
    public class Utils
    {
        public static async Task SetInterval(Action action, TimeSpan timeout)
        {
            await Task.Delay(timeout).ConfigureAwait(false);
            action();
            Console.WriteLine("Finished Recurring Job");
#pragma warning disable CS4014
            // Not awaiting this causes 0 issues, so its not needed.
            SetInterval(action, timeout);
        }
    }
}