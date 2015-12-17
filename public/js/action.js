$(document).ready(function(){
	$("#profile-form").on("submit", function(e){
	  // prevent form submission
	  e.preventDefault();
	  var formData = $(this).serialize();
	  //console.log('form data is: ', formData);
	  $.post("/profile", formData, function(data){
	    // append new chatroom to the page
	    var newEvent = event;
	    $("#profile-form")[0].reset();
	    window.location.assign("/eventcenter");
	});
	});

	$('#org').tab('show')

	$(".dropdown-toggle").dropdown();
	
	$("#organizationForm").on("submit", function(e){
	  // prevent form submission
	  e.preventDefault();
	  var formData = $(this).serialize();
	  //console.log('form data is: ', formData);
	  $.post("/organizationprofile", formData, function(data){
	    // append new chatroom to the page
	    window.location.assign("/profile");
	  });
	});

	$("#volunteerForm").on("submit", function(e){
	  // prevent form submission
	  e.preventDefault();
	  var formData = $(this).serialize();
	  //console.log('form data is: ', formData);
	  $.post("/volunteerprofile", formData, function(data){
	    // append new chatroom to the page
	    window.location.assign("/profile");
	  });
	});
	

























});