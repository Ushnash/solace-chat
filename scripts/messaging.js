class PubSubPlusBroker {

  /*
   * Basic constructor to create an object for interacting with
   * PubSub+.
   *
   * Member variables in JavaScript are declared inside constructors.
   */
  constructor() {
    this.sBROKERURL = null;
    this.sUSERNAME = null;
    this.sPASSWORD = null;
  }

  /**
   * * Uses a Solace PubSub+ topic to authenticate against a backend RESTful
   * service. This method demonstrates the RDP (REST Delivery Point) feature
   * of PubSub+, which lets a RESTful service be exposed across PubSub+ in a
   * publish/subscribe manner.
   *
   * Note: The credentials need to be entered into the backend service
   * *beforehand*
   *
   * @param sUsername
   *            Username to RESTfully authenticate against the broker
   * @param sPassword
   *            Password associated with the username
   * @returns Boolean indicating success or failure of the authentication
   */
  authenticate(sUsername, sPassword) {
    return true;
  }

  /**
   * @param sChannel
   *            The channel (i.e. queue/topic) to connect to.
   * @returns Boolean
   *            Success of failure of the connection attempt
   */
  connect(sChannel) {

  }

  /**
   * Sends a message to the PubSub+ broker and returns a boolean value
   * indicating success/failure of the send.
   *
   * @param sBody
   *           message body to send as a String
   *
   * @returns Boolean
   *           indicating whether the send succeeded or not.
   */
  send(sBody) {
    return true;
  }
}
