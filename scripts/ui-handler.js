/**
 */

function onSend(event) {
  var chatinputbox = document.getElementById('chatinput');
  updateChatArea('me: ' + chatinputbox.value);
  chatinputbox.value = '';
}

function updateChatArea(text) {
  document.getElementById('chatarea').value += '' + text + '\n';
}
