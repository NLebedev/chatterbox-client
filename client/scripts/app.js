////////////////////
//GLOBAL VARIABLES
////////////////////

//object with all message Ids
var app = {};
app.idStorage = {};
//objet with all roomnames
app.roomNames = {};
//
app.roomFilter = ''; 
app.allMessages = {};
app.friends = {};

app.server = 'https://api.parse.com/1/classes/messages';
app.init = function() {
  
};

////////////////////
//WORKING WITH api
////////////////////

// var query = new Parse.Query(roomname);
// query.equaljTo()


//send data to chatroom
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
////////////////////

//receive data with all the messages from chat room
app.fetch = function(roomname) {
  var data = roomname !== undefined ? '' : { where: { roomname: roomname } }; 
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
   
    data: data,
    success: function(data) {
      console.log(data);
      appendDataToDOM(data.results);
    },
    error: function (data) {
      console.error('chatterbox: Failed to fetch data', data);
    }
  });
};
////////////////////

//convert message id to usrname
app.idToName = function(id) {
  return this.allMessages[id].username;
};
////////////////////

//
app.createLink = function(id) {
  $('.' + id).click(function() {
    var secondClass = $(this).attr('class').split(' ')[1];
    
    //if the user is not a friend yet
    if ( !app.friends[app.idToName(secondClass)] ) {
      //add friend
      app.addFriend(id);
      //update font weight in other nodes
      $('.message-class').each(function() {
        var secondClass = $(this).attr('class').split(' ')[1];
        
        if (app.friends[app.idToName(secondClass)]) {
        //make this element bold
          $(this).css('font-weight', 'bold');
        } 
      });
    } else {
      //dO SOMETHING ELSE
      //remove him from friends
      app.removeFriend(id);
      //change back font weight
      $('.message-class').each(function() {
        var secondClass = $(this).attr('class').split(' ')[1];
        
        if (!app.friends[app.idToName(secondClass)]) {
        //make this element bold
          $(this).css('font-weight', 'normal');
        } 
      }); 

    }

  


    
    


  });
};


var appendDataToDOM = function(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    // console.log(i);
    if (
      //there is no filter
      app.roomFilter === '' || 
      //there is filter that is equal to our current message roomname
      app.roomFilter === encodeURI(arr[i].roomname) ) {



      app.addMessage(arr[i]);
    } 
  }
};


app.clearMessages = function() {
  $('.actual-messages').empty();
  this.idStorage = {};
};

app.addMessage = function(message) {
  //deal with date
  var myDate = new Date(message.createdAt);
  var minutes = myDate.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var hours = myDate.getHours();
  //
  var messageText = message.text;
  var roomName = message.roomname;
  var objId = message.objectId;
  
  this.allMessages[objId] = {
    message: message.text,
    roomname: message.roomname,
    username: message.username
  };

  if (!app.roomNames[message.roomname] && message.roomname !== undefined) {
    app.addRoom(message.roomname);
    app.roomNames[message.roomname] = message.roomname;
  }
 
  //NEW NODES!!!
  if (!app.idStorage[objId]) {
    $('.actual-messages').append('<div class="message-class ' + objId + '"></div>');
    $('.' + objId).text(hours + ':' + minutes + ' | ' + message.roomname + ' | ' + message.username + ': ' + message.text );
    app.idStorage[objId] = objId;
    app.createLink(objId);
    if (app.friends[message.username]) {
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
  var messageObj = this.allMessages[id];
  var myUser = messageObj.username;
  //find message with this id in all messages,
  app.friends[myUser] = myUser;
    //find username
    //add username to our friends object

};

app.removeFriend = function(id) {
  delete app.friends[this.allMessages[id].username]; 
};



$(document).ready(function() {
  
  
  $('.btn-send').click(function() {
    var temp = {};
    temp.text = $('#message-field').val();
    temp.username = $('#username-field').val();
    temp.roomname = $('#roomname-field').val();
    app.send(temp);
    console.log(temp);
  });
  
  $('.room-select').change(function() {
    app.roomFilter = this.value;
    app.clearMessages();
  });

  
  // init();
}); 

var updateRoomNames = function() {
  $('.room-select').append();
};

setInterval(function() { app.fetch(); }, 1000);