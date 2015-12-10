$(document).ready(function() {

function checkAuth(){
        $.get('/signup', function(data){
            console.log(data);
            if (data.user){    
                $('.sign-up').hide();
                $('.log-out').show();
            } else {
                $('.sign-up').show();
                $('.log-out').hide();            }
            });
        }

    checkAuth();

    //Sign Up
    $('#signup-form').on('submit', function(e){
        e.preventDefault();
        var userData = ($(this).serialize());
        console.log('Logging user data', userData);

        $.ajax({
        	url: '/signupUser',
        	type: "POST",
        	data: userData
        })

        .done(function (data) {
        	console.log("HERE IS THE NEW USER", data);
        	 window.location.href='/';
        })
        .fail (function (data) {
        	console.log("YOU HAVE FAILED");
        });
    });

    //Logout
    $('#logout').on('click', function(e){
        e.preventDefault();

        $.get('/logout', function(data){
        console.log(data.msg);
        window.location.href ='/login';
        });
    });

    //Login
    $('#login-form').submit(function(e){
        e.preventDefault();
        var login = $(this).serialize();

        $.post('/sessions', login, function(data){
            window.location.href ='/';
        });

    });


});