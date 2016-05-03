// YOUR CODE HERE:

var app = {};
app.server = 'https://api.parse.com/1/classes/messages';

var idToName = function(id) {
  return allMessages[id].username;
};

app.createLink = function(id) {
  $('.' + id).click(function() {
    
    app.addFriend(id);
    
    $('.message-class').each(function() {
      var secondClass = $(this).attr('class').split(' ')[1];
      
      if (friends[idToName(secondClass)]) {
      //make this element bold
        $(this).css('font-weight', 'bold');
      }
    });

  });
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
    if (
      //there is no filter
      window.roomFilter === '' || 
      //there is filter that is equal to our current message roomname
      window.roomFilter === encodeURI(arr[i].roomname) ) {



      app.addMessage(arr[i]);
    } 
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
  $('.actual-messages').empty();
  idObj = {};
};

window.idObj = {};
window.roomNames = {};
window.roomFilter = ''; 
window.allMessages = {};
window.friends = {};

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
  
  allMessages[objId] = {
    message: messageText,
    roomname: roomName,
    username: user
  };



  if (!roomNames[message.roomname] && message.roomname !== undefined) {
    app.addRoom(message.roomname);
    roomNames[message.roomname] = message.roomname;
  }
 
    
  //NEW NODES!!!
  if (!idObj[objId]) {
    $('.actual-messages').append('<div class="message-class ' + objId + '"></div>');
    $('.' + objId).text(hours + ':' + minutes + ' ' + roomName + ' | ' + user + ': ' + messageText );
    idObj[objId] = objId;
    app.createLink(objId);
    if (friends[user]) {
      app.applyCssToFriends(objId);
    }
  }


};

app.applyCssToFriends = function(id) {
  $('.' + id).css('font-weight', 'bold');
};


app.addRoom = function(roomName) {
  $('.room-select').append('<option value=' + encodeURI(roomName) + '>' + roomName + '</option>');
};
        
app.addFriend = function(id) {
  var messageObj = allMessages[id];
  var myUser = messageObj.username;
  //find message with this id in all messages,
  friends[myUser] = myUser;
    //find username
    //add username to our friends object

};




$(document).ready(function() {
  
  
  $('.btn-send').click(function() {
    var temp = {};
    temp.text = $('#message-field').val();
    temp.username = $('#username-field').val();
    app.send(temp);
    console.log(temp);
  });
  
  $('.room-select').change(function() {
    roomFilter = this.value;
    app.clearMessages();
  });

  
  // init();
}); 

var updateRoomNames = function() {
  $('.room-select').append();
};

setInterval(function() { app.fetch(); }, 1000);