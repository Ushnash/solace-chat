var broker = new PubSubPlusBroker();

function doConnect() {
  console.log("Pressed");

  broker.connect(setupSubscriber);
}

function setupSubscriber(result, resultMessage) {

  if (result) {
    broker.subscribe(setupMessageListener);
  }
}

function setupMessageListener(result, resultMessage) {

  if (result) {
    broker.onTopicMessage(printMessage);
  }
}

function printMessage(message) {
  alert(message);
}

function send() {
  broker.publish("Hello World", (result, message) => {});
}
