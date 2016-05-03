// YOUR CODE HERE:

var app = {};
app.server = 'https://api.parse.com/1/classes/messages';
app.init = function() {
   // $()
};

app.send = function(message) {
  $.ajax({
    url: this.server,
    data: JSON.stringify(message),  
    type: 'POST',
    success: function(data) {
      // console.log(message);
      console.log('We sent message!!!');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

var appendDataToDOM = function(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    // console.log(i);
    app.addMessage(arr[i]);
  }
};

// setInterval(function(){ 
app.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      appendDataToDOM(data.results);
     // / $("#chats").text(data.results[0].roomname);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch data', data);
    }
  });
};

// }); 

app.clearMessages = function() {
  $('#chats').empty();
};

window.idObj = {};

app.addMessage = function(message) {
  var myDate = new Date(message.createdAt);
  var minutes = myDate.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var hours = myDate.getHours();

  // var user = encodeURI(message.username);
  // var messageText = encodeURI(message.text);
  // var roomName = encodeURI(message.roomname);

  var user = message.username;
  var messageText = message.text;
  var roomName = message.roomname;

  var objId = message.objectId;
  
  
  //var node = '<div>' + '/<div>';
  if (!idObj[objId]) {
    $('#chats').append('<div id="' + objId + '"></div>');
    $('#' + objId).text(hours + ':' + minutes + ' ' + roomName + ' | ' + user + ': ' + messageText );
    idObj[objId] = objId;
  }

};

app.addRoom = function(roomName) {
  $('#roomSelect').append('<div>' + roomName + '</div>');

};

app.addFriend = function(username) {
};

$(document).ready(function() {
  
  $('.get-btn').click(function() {
    app.fetch();
  });

  $('.user-link').click(function() {
    console.log('inside');
    //seond class
    var secondClass = $(this).attr('class').split(' ')[1];
    app.addFriend(secondClass);
  });
  // init();
}); 

setInterval(function() { app.fetch(); }, 1000);