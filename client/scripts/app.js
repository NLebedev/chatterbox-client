////////////////////
//GLOBAL VARIABLES
////////////////////

//object with all message Ids
let app = {};
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
app.send = message => {
  $.ajax({
    url: app.server,
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
app.fetch = roomname => {
  let data = roomname === undefined ? '' : { where: { roomname: roomname } }; 
  // console.log("THIS: ", this);
  $.ajax({
    url: app.server,
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
////////////////////s

//convert message id to usrname
app.idToName = id => {
  return app.allMessages[id].username;
};
////////////////////

//  
app.createLink = id => {
  $('.' + id).click(function() {
    let secondClass = $(this).attr('class').split(' ')[1];
    
    //if the user is not a friend yet
    if ( !app.friends[app.idToName(secondClass)] ) {
      //add friend
      app.addFriend(id);
      //update font weight in other nodes
      $('.message-class').each(function() {
        let secondClass = $(this).attr('class').split(' ')[1];
        
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
        let secondClass = $(this).attr('class').split(' ')[1];
        
        if (!app.friends[app.idToName(secondClass)]) {
        //make this element bold
          $(this).css('font-weight', 'normal');
        } 
      }); 

    }
  });
};

var appendDataToDOM = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
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

app.clearMessages = () => {
  $('.actual-messages').empty();
  app.idStorage = {};
};

app.addMessage = message => {
  //deal with date
  let myDate = new Date(message.createdAt);
  let minutes = myDate.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let hours = myDate.getHours();
  //
  const messageText = message.text;
  const roomName = message.roomname;
  const objId = message.objectId;
  
  app.allMessages[objId] = {
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

app.applyCssToFriends = id => {
  $('.' + id).css('font-weight', 'bold');
};


app.addRoom = roomName => {
  $('.room-select').append('<option value=' + encodeURI(roomName) + '>' + roomName + '</option>');
};
        
app.addFriend = id => {
  const messageObj = app.allMessages[id];
  const myUser = messageObj.username;
  //find message with this id in all messages,
  app.friends[myUser] = myUser;
    //find username
    //add username to our friends object

};

app.removeFriend = id => {
  delete app.friends[app.allMessages[id].username]; 
};



$(document).ready(function() {
  
  
  $('.btn-send').click(function() {
    let temp = {};
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