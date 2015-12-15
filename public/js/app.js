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
      $("#newEvent")[0].reset();
      $("#eventName").focus();
      window.location.assign("/eventcenter");
    });
  });

//Delete listener, but should be a move to archive 
$('.events').on('click', '.glyphicon', function(e) {
  e.preventDefault();
//console.log("deleteing");
var eventId = $(this).data().id;
console.log(eventId);
var chat = $(this).closest('p');

$.ajax({
  type: "DELETE",
  url: '/events/' + eventId
})
.done(function(data) {
  console.log(data);
  $(event).remove();
})
.fail(function(data){
        //  console.log("Failed to terminate a chat !")
      });
});

function buildSearchedEvent(data) {
  var html = "<p><a href='/events/'" + data._id + "'>Title:" + data.title + "<br>Detail:" + data.detail 
  + "Date:" + data.event_date + "</a><span data-id=" + data._id 
  + " class='glyphicon glyphicon-calendar pull-right'></span></p>";
  return html;
}

  $( "#datepicker" ).datepicker({
    numberOfMonths: 1,
    showButtonPanel: true,
    onSelect: function(dateSelected) {
      console.log(dateSelected);
      // console.log(this.value);
      $.ajax({
        type: "POST",
        url: '/events-date',
        data: {event_date: dateSelected} 
      })
      .done(function(data){
        console.log(data);
        $('#events-ul').empty();
        for (var i = 0; i < data.length; i++) {
          console.log(data[i])
          var html = buildSearchedEvent(data[i])
          console.log(html)
          $('#events-ul').append(html)
        };
      })
    }
  });

  $( "#datepickerInput" ).datepicker({
    changeMonth: true,
    changeYear: true
  });
});


