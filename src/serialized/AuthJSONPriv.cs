using System;
using Newtonsoft.Json;

namespace ChattyNotifier.src.serialized
{
    internal class AuthJSONPriv
    {
        public long created = DateTimeOffset.Now.ToUnixTimeMilliseconds();

        public AuthJSONPriv(string auth)
        {
            token = auth;
        }

        public string token { get; set; }

        public string AsJSON()
        {
            return JsonConvert.SerializeObject(this, Formatting.None,
                new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
        }
    }
}