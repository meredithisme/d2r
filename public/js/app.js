$(document).ready(function(){
  console.log('Hey, Earth!');

  $('#username').focus();
  // io is listening
  // var socket = io();

  // socket.on('message', function(msg){
  //   //console.log("this msg is ", msg)
  //   $('#messages').append($('<p>').text(msg.Body));
  // });

  $("#newEvent").on("submit", function(e){
    // prevent form submission
    e.preventDefault();
    var formData = $(this).serialize();
    //console.log('form data is: ', formData);
    $.post("/events", formData, function(data){
      // append new chatroom to the page
      var newEvent = event;
      // clear new food form
      var eventName = "<p><a href='/events/" + data._id + "'>" + "Title: "+ data.title + "<br>"+ "Detial: " + data.detail + "<br>" + "Date:"+ data.event_date + "</a><span data-id='<%= event._id %>' class='glyphicon glyphicon-calendar pull-right'></span><p>"
     
      $("#events-ul").append(eventName);
      // reset the form 
      $("#newEvent")[0].reset();
      $("#eventName").focus();
    });
  });

  $('#new-message').on('submit', function(e) {
    e.preventDefault();

    var messageData = $("[name='messagebody']", this).val();
    console.log("t is ",messageData);
    var input = { "message" : messageData,
    chatId : $(this).data().id
  };
  console.log("input is ", input);

  var url = "/chats/" + $(this).data().id + "/messages";
  $.post(url, input, function(message) {
          // make HTML string to append to page
          var newMessage = "<p>" + message.Body + "</p>";
          
          $('#message-list').append(newMessage);
          $("#new-message")[0].reset();
          $("#textbody").focus();
        });
});
//Delete listener, but should be a move to archive 
$('.chatrooms').on('click', '.glyphicon', function(e) {
  e.preventDefault();
//        console.log("deleteing");

var chatId = $(this).data().id;
console.log(chatId);
var chat = $(this).closest('p');

$.ajax({
  type: "DELETE",
  url: '/chats/' + chatId
})
.done(function(data) {
  console.log(data);
  $(chat).remove();
})
.fail(function(data){
        //  console.log("Failed to terminate a chat !")
      });
});

  $( "#datepicker" ).datepicker({
    numberOfMonths: 1,
    showButtonPanel: true
  });
  $( "#datepickerInput" ).datepicker({
        changeMonth: true,
        changeYear: true
      });

});
