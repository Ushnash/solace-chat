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
    this.sPublishTopic = "my/test/topic/send";
    this.sSubscribeTopic = "my/test/topic/send";
    this.sReceiveQueue = "my.queue";

    /*Topic Subscriber Parameters*/
    this.BLOCK_SUBSCRIBER_TIMEOUT_MS = 10000;
    this.GENERATE_SUBSCRIBE_EVENT = true;

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
   */
  authenticate(sUsername, sPassword) {
    return true;
  }

  /**
   * @param   oResultCallback
   *          callback function to execute on function completion.
   * @returns
   *          Nothing
   */
  connect(oResultCallback) {

    var sFullURI = this.sUSERNAME + ":" + this.sPASSWORD + "@" + this.sBROKERURL + "/" + this.sVPN;
    console.debug("Establishing session to " + sFullURI);

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

    /*
     *Since we want to access our callback function inside our event
     *handlers, we first assign "this" to a variable, thereby
     *forcing it to follow regular scoping rules i.e. we can actually access it,
     *and any related properties, inside the event handler lambda.
     */
    var parent = this;
    parent.oResultCallback = oResultCallback;
    parent.sFullURI = sFullURI;

    //setup an event listener for a successful connection
    //Pass in the callback function to execute on successs.
    this.broker.session.on(solace.SessionEventCode.UP_NOTICE, (sessionEvent) => {
      console.debug(sessionEvent);
      parent.oResultCallback(true, "Connected to " + parent.sFullURI);
    });

    //setup an event listener for connection failures
    //Pass in the callback function to execute on failure.
    this.broker.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (sessionEvent) => {
      console.error(sessionEvent);
      parent.oResultCallback(false, "Could not connect to " + parent.sFullURI + " error -> " + sessionEvent);
    });

    /*actually attempt a connection to the broker
     *Note that we don't declare a successful connection here
     *since the API specifically indicates that we should wait for the
     *UP_NOTICE (above) before performing any post-connection logic.
     */
    try {
      console.debug("connecting to broker...");
      this.broker.session.connect();
    } catch (error) {
      console.error("Could not connect to broker:" + error.message);
    }
  }



  /**
   * Publishes a message to the PubSub+ broker using the Publish/subscribe
   * paradigm.
   * @param sBody
   *           message body to send as a String
   *
   * @param oResultCallback
   *           Callback function used to handle the result
   *
   * @returns
   *          Nothing
   */
  publish(sBody, oResultCallback) {

    //ensure that we have a session to play with
    if (this.broker.session === null) {
      oResultCallback(false, "No session! You're probably not connected to the broker.");
    } else {

      /*We create a message object, provide it with a destination, and
       *establish the delivery mode. After this, we assign our text message (the "body")
       *to said object*/
      var message = solace.SolclientFactory.createMessage();
      message.setDestination(solace.SolclientFactory.createTopicDestination(this.sPublishTopic));
      message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
      message.setBinaryAttachment(sBody);

      console.debug("Publishing message " + sBody + " to topic " + this.sPublishTopic);

      //attempt the actual publication of our message object
      //success or failure, issue a message stating the fact.
      try {
        //send the actual message and log a successful send
        this.broker.session.send(message);
        oResultCallback(true, "message published!");
        console.debug("message published");
      } catch (error) {

        //there was an error with the send()
        oResultCallback(false, "Could not publish message to topic. -> " + error.message);
        console.error("Could not publish message to topic. -> " + error.message);
      }
    }
  }


  /**
   * @param oResultCallback
   *           Callback function to be executed to relay subscription state
   */
  subscribe(oResultCallback) {

    //ensure that we have a session to play with
    if (this.broker.session === null) {
      oResultCallback(false, "No session! You're probably not connected to the broker.");
    } else {
      /*This block establishes our subscription.
       *We defer actually recieving the message to the event
       *handler designated for that purpose.
       */
      try {
        /*
         *@params:
         *-Topic to receive on.
         *-Should we generate an event when the subscription succeeds?
         *-CorrelationKey that is used in events
         *-How long to block the execution thread, in milliseconds
         */
        this.broker.session.subscribe(
          solace.SolclientFactory.createTopic(this.sSubscribeTopic),
          this.GENERATE_SUBSCRIBE_EVENT,
          this.sSubscribeTopic,
          this.BLOCK_SUBSCRIBER_TIMEOUT_MS
        );
      } catch (error) {
        console.error("Could not subscribe to topic. ->" + error.message);
      }
    }

    /*
     *Rescope 'this' to be our current method, permitting access to
     *the callback function inside our event handler lambda (below)
     *For a more detailed explanation see the connect() method.
     */
    var parent = this;
    parent.oResultCallback = oResultCallback;
    parent.topic = this.sSubscribeTopic;

    //What to do when subscription succeeds
    this.broker.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, (sessionEvent) => {
      parent.oResultCallback(true, "Successfully subscribed to " + this.topic);
      console.debug("Successfully subscribed to " + parent.topic);
    });

    //What to do when a sub fails
    this.broker.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent) => {
      parent.oResultCallback(false, "Could not subscribe to " + parent.topic);
    });
  }

  onTopicMessage(oResultCallback) {
    var parent = this;
    parent.oResultCallback = oResultCallback;

    this.broker.session.on(solace.SessionEventCode.MESSAGE, (sMessage) => {
      this.oResultCallback(sMessage.dump());
      console.debug(sMessage.dump());
    });
  }

} //End class
