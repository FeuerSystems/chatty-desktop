using System;
using System.Diagnostics;
using Newtonsoft.Json;

namespace ChattyNotifier.src.serialized
{
    internal class ChattyJSONPayload
    {
        /** Ack Payload*/
        public ChattyJSONPayload()
        {
            op = 1;
        }

        /**
         * Error Payload
         */
        public ChattyJSONPayload(int Op, string Type, string Reason)
        {
            op = Op;
            type = Type;
            reason = Reason;
        }

        /**
         * Response Payload
         */
        public ChattyJSONPayload(int Op, string Type, object Data)
        {
            op = Op;
            type = Type;
            d = Data;
        }

        /**
         * All Payload
         */
        public ChattyJSONPayload(int Op = 1, string Type = null, string Reason = null, object Data = null)
        {
            op = Op;
            type = Type;
            reason = Reason;
            d = Data;
        }

        public int op { get; set; }
        public string type { get; set; }
        public string reason { get; set; }
        public object d { get; set; }

        public string AsJSON()
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();
            var payload = JsonConvert.SerializeObject(this, Formatting.None,
                new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
            stopwatch.Stop();
            Console.WriteLine(
                $"[ChattyJSON -> Serialization]: Took {stopwatch.ElapsedMilliseconds}ms\n  Payload: {payload}");
            return payload;
        }
    }
}