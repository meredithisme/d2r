$(document).ready(function() {
    //sign-up ajax
    $('#signup-form').on('submit', function(e) {
      e.preventDefault();
      var user = $(this).serialize();
      console.log(user);

      $.post('/user', user, function (data){
      })
      .success(function (data) {
        console.log("logged in" , data);
        $('.logged-out').hide();
        window.location.href = '/eventcenter';
      })
      .error(function (data) {
        console.log("failed to create a new user");

      })
    })
    //log-in ajax
    $('#login-form').on('submit', function(e) {
      e.preventDefault();
      var user = $(this).serialize();
      console.log(user);

      $.post('/sessions', user, function (data){

      })
      .success(function (data) {
        console.log("logged in" , data);
        $('.logged-out').hide();
        window.location.href = '/eventcenter';


      })
      .error(function (data) {
        console.log(data);
        alert("sign up failed");
      })
    })
    $('#logout').click(function (e) {
      e.preventDefault();

      $.get('/logout', function (data) {
        window.location.href = '/';
      })
    });
});