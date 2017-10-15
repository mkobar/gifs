var app = new Clarifai.App({apiKey: 'c58641c2cf8447c2a584daca501d9d88'});

var emotion = 'none';
var sadAudio = new Audio('sad.mp3');
var happyAudio = new Audio('happy.mp3');
var scaryAudio = new Audio('scary.mp3');
var confusedSudio = new Audio('confused.mp3');
var angryAudio = new Audio('angry.mp3');

document.addEventListener('DOMContentLoaded', function () {

    // References to all the element we will need.
    var video = document.querySelector('#camera-stream'),
        image = document.querySelector('#snap'),
        start_camera = document.querySelector('#start-camera'),
        controls = document.querySelector('.controls'),
        take_photo_btn = document.querySelector('#take-photo');
    
    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    if(!navigator.getMedia){
        displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
    }
    else{

        // Request the camera.
        navigator.getMedia(
            {
                video: true
            },
            // Success Callback
            function(stream){

                // Create an object URL for the video stream and
                // set it as src of our HTLM video element.
                video.src = window.URL.createObjectURL(stream);

                // Play the video element to start the stream.
                video.play();
                video.onplay = function() {
                    showVideo();
                };
         
            },
            // Error Callback
            function(err){
                displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
            }
        );

    }

    // Mobile browsers cannot play video without user input,
    // so here we're using a button to start it manually.
    start_camera.addEventListener("click", function(e){

        e.preventDefault();

        // Start video playback manually.
        video.play();
        showVideo();

    });

    take_photo_btn.addEventListener("click", setInterval(function(e){

//        e.preventDefault();

        var snap = takeSnapshot();
        app.models.predict("emotions", snap.substring(22)).then(
  function(response) {
      console.log(response.outputs[0].data.concepts[0].name);
      document.getElementById("test").innerHTML = response.outputs[0].data.concepts[0].name;
		  
	  	q = response.outputs[0].data.concepts[0].name; 
		console.log(q);// search query
	
	  	request = new XMLHttpRequest;
	  	request.open('GET', 'http://api.giphy.com/v1/gifs/search?api_key=JedLzyE2QOop3FlqoYYM1PPEVmPayZMI&q='+ q +'&limit=1&offset='+ Math.floor(Math.random() * 5) +'&rating=G&lang=en', true);
	
	  	request.onload = function() {
	  		if (request.status >= 200 && request.status < 400){
	  			data = JSON.parse(request.responseText).data[0].images.original.url;
	  			console.log(data);
	  			document.getElementById("giphyme").innerHTML = '<center><img src = "'+data+'"  title="GIF via Giphy"></center>';
	  		} else {
	  			console.log('reached giphy, but API returned an error');
	  		 }
	  	};
		
		
		
		if (q == "sadness" && emotion != q){
			emotion = q;
			happyAudio.pause();
			scaryAudio.pause();
			confusedSudio.pause();
			angryAudio.pause();
			sadAudio.play();
			console.log("sadmusic");
		}
		
		else if (q == "anger" && emotion != q){
			emotion = q;
			happyAudio.pause();
			scaryAudio.pause();
			confusedSudio.pause();
			sadAudio.pause();
			angryAudio.pause();
			console.log("angermusic");
		}
		
		else if (q == "confused" && emotion != q){
			emotion = q;
			happyAudio.pause();
			scaryAudio.pause();
			angryAudio.pause();
			sadAudio.pause();
			confusedSudio.play();
			console.log("confusedmusic");
		}
		
		else if (q == "fear" && emotion != q){
			emotion = q;
			happyAudio.pause();
			confusedSudio.pause();
			angryAudio.pause();
			sadAudio.pause();
			scaryAudio.play();
			console.log("scarymusic");
		}
		
		else if (q == "happy" && emotion != q){
			emotion = q;
			scaryAudio.pause();
			confusedSudio.pause();
			angryAudio.pause();
			sadAudio.pause();
			happyAudio.play();
			console.log("happymusic");
		}
		else {
			console.log(q + '  ' + emotion);
		}
	  	request.onerror = function() {
	  		console.log('connection error');
	  	};
		

	  	request.send();
  },
  function(err) {
    // there was an error
  }
);
    }, 5000));
  
    function showVideo(){
        // Display the video stream and the controls.

        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }


    function takeSnapshot(){
        // Here we're using a trick that involves a hidden canvas element.  

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        var width = video.videoWidth,
            height = video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            
            return hidden_canvas.toDataURL();
        }
    }
   
    function hideUI(){
        // Helper function for clearing the app UI.

        controls.classList.remove("visible");
        start_camera.classList.remove("visible");
        video.classList.remove("visible");
        snap.classList.remove("visible");
    }

});