module.exports = {
  /**
    * 0: Dispatch (An event was dispatched) // SERVER
    * 1: Heartbeat (Heartbeat (Pong/Ping)) // CLIENT and SERVER
    * 2: Identify (Send the indentifying payload) // CLIENT
    * 3: Presence Update (If your online/idle/dnd is updated) // CLIENT
    * 4: Voice State (If moving between channels, make sure to send this event) // CLIENT
    * 5: Resume (Resume a connection newer then expiry date (Defined by HELLO Payload)) // SERVER
    * 6: Invalid Session (Your session turned invalid or was invalid grab a new token and send a new payload) // SERVER
    * 7: HELLO (The hello payload sent to you when you have connected to our WS) // SERVER
    * 8: ACK (Acknowledge your ping/pong has been receieved) // SERVER
    * 9: Recieve (An event of some type was recieved) // SERVER
    */
  op: {
    Dispatch: 0,
    Heartbeat: 1,
    Identify: 2,
    Presence_Update: 3,
    Voice_State: 4,
    Resume: 5,
    Invalid_Session: 6,
    HELLO: 7,
    ACK: 8,
    Recieve: 9,
  },
  /**
     * 0: Message (A message was recieved)
     * 1: Presence Update (A friend, or member set a new presence (Text or IMG))
     * 2: Profile Update (A friend, or member set a new profile avatar, about me OR name)
    */
  Recieve_Event: {
    Message: 0,
    Presence: 1,
    Profile: 2,
    SELF_MESSAGE: 3
  },

  Internal_Events: {
    CONNECTED: 'connected',
    CLOSED: 'closed',
    MESSAGE: 'message',
    RESTART: 'restart',
    AUTHENICATED: 'auth',
  },
};
