class PubSubPlusBroker {

  /*
   * Basic constructor to create an object for interacting with
   * PubSub+.
   *
   * Member variables in JavaScript are declared inside constructors.
   */
  constructor() {

    /**INITIALIZE YOUR BROKER PARAMETERS HERE**/
    this.sBROKERURL = "ws://vmr-mr8v6yiwiawh.messaging.solace.cloud:20003";
    this.sVPN = "msgvpn-34x0j4seuv";
    this.sUSERNAME = "solace-cloud-client";
    this.sPASSWORD = "2i4ll7mv1g54vu84enlfdck88o";
    this.sChannel = "my/test/topic";

    this.broker = {};
    this.broker.session = null;
    /******************************************/

    //standard init
    var factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);

    //Enable debug logging
    solace.SolclientFactory.setLogLevel(solace.LogLevel.DEBUG);
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
   * @param
   *          none
   * @returns Boolean
   *            Success of failure of the connection attempt
   */
  connect(callback) {

    console.debug("Establishing session to " + this.sUSERNAME + ":" + this.sPASSWORD + "@" + this.sBROKERURL + "/" + this.sVPN);

    try {
      this.broker.session = solace.SolclientFactory.createSession({
        // solace.SessionProperties
        url: this.sBROKERURL,
        vpnName: this.sVPN,
        userName: this.sUSERNAME,
        password: this.sPASSWORD
      });
    } catch (error) {
      console.error(error.message);
    }

    this.broker.session.on(solace.SessionEventCode.UP_NOTICE, callback);

    //TODO: pass in a callback that reacts to failure
    //this.broker.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR,failureCallback);

    try {
      console.debug("connecting to broker");
      this.broker.session.connect();
    } catch (error) {
      console.error("Could not connect to broker:" + error.message);
    }
  }


  /**
   * Sends a message to the PubSub+ broker and returns a boolean value
   * indicating success/failure of the send.
   *
   * @param sBody
   *           message body to send as a String
   *
   * @param oResultCallback
   *           Callback function used to handle the result
   */
  sendMessage(sBody, oResultCallback) {

    //ensure that we have a session to play with
    if (this.broker.session === null) {
      oResultCallback(false, "No session! You're probably not connected to the broker.");
    } else {

      /*We create a message object, provide it with a destination, and
       *establish the delivery mode. After this, we assign our text message (the "body")
       *to said object*/
      var message = solace.SolclientFactory.createMessage();
      message.setDestination(solace.SolclientFactory.createTopicDestination(this.sChannel));
      message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
      message.setBinaryAttachment(sBody);

      console.debug("Publishing message " + sBody + " to topic " + this.sChannel);

      //attempt the actual publication of our message object
      //success or failure, issue a message stating the fact.
      try {
        this.broker.session.send(message);
        console.debug("message published");
        oResultCallback(true, "message published!");
      } catch (error) {
        oResultCallback(false, error.message);
        console.error(error.message);
      }
    }
  }
}
