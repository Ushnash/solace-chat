/**
 */
$(document).ready(function() {

  //call back function to handle alerting
  function alertHandler(bResult, sMessage) {

    if (bResult) {
      //show success alert
    } else {
      //show failure alert
    }
  }

  //get an instance of our broker
  //var broker = new PubSubPlusBroker();

  //try to connect
  //broker.connect(alertHandler);

   //broker.subscribe(alertHandler);

  function messageHandler(sMessage){
    console.debug("message handler called with text: "+sMessage);
    updateChatArea("Broker: " + sMessage);
  }

  //register our callback for when we have a topic message
  broker.onTopicMessage(messageHandler);

  //updates the chat window with new text
  function updateChatArea(sText) {
    var sCurrentText = $("#chatArea").val() + "\n" + sText;
    $("#chatArea").val(sCurrentText);
  }

  /*
   *Called when a user sends a message
   */
  $("#buttonSend").click(function() {
    console.debug("Caught send button event");

    //the text that the user just typed.
    var sChatText = $("#chatInput").val();

    console.debug(sChatText);

    //attempt a publish to the broker topic
    broker.publish(sChatText, alertHandler)
    updateChatArea(sChatText);

    //reset the text input box
    $("#chatInput").val("");
  })


}) //end ready
