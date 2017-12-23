  //$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDPz8tquL8Et990MTkd8e9_JCxz5AC7ySg",
    authDomain: "train-scheduler-74a20.firebaseapp.com",
    databaseURL: "https://train-scheduler-74a20.firebaseio.com",
    projectId: "train-scheduler-74a20",
    storageBucket: "train-scheduler-74a20.appspot.com",
    messagingSenderId: "551892233696"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
  var database = firebase.database();
// Initial Values
    var iTrainName = "";
	var iDestination ="";
	var iTrainTime = "";
	var iFrequency = 0;

  $("#add-Train").on("click", function(){
	event.preventDefault();
	var iTrainName = $("#input-TrainName").val();
	var iDestination = $("#input-Destination").val();
	var iTrainTime = $("#input-TrainTime").val();
	var iFrequency = $("#input-Frequency").val();

	//console.log(iTrainName);
	//console.log(iDestination);
	//console.log(iTrainTime);
	//console.log(iFrequency);

	//Push user input to firebase database
	  database.ref().push({
		 trainName: iTrainName,
		 destination: iDestination,
		 trainTime: iTrainTime,
		 frequency: iFrequency,
	  });

	//Clear text-boxes

	$("#input-TrainName").val("");
	$("#input-Destination").val("");
	$("#input-TrainTime").val("");
	$("#input-Frequency").val("");

//On Click childSnapshot using val() to return value

    database.ref().limitToLast(5).on("child_added", function(childSnapshot){
	// console.log(childSnapshot.val());
	  var iTrainName = childSnapshot.val().trainName;
	  var iDestination = childSnapshot.val().destination;
	  var iTrainTime = childSnapshot.val().trainTime;
	  var iFrequency = childSnapshot.val().frequency;

	  console.log("Name: " + iTrainName);
	  console.log("Destination: " + iDestination);
	  console.log("Time: " + iTrainTime);
	  console.log("Frequency: " + iFrequency);

// Convert train Time
	//First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(iTrainTime, "HH:mm").subtract(1, "years");
    console.log("Time converted: " + firstTimeConverted);
    // using mmoment.js plugin "duration" to handle in minutes
    var diffTime = moment.duration(moment().diff(moment(iTrainTime, "HH:mm")), 'milliseconds').asMinutes();
    console.log("Difference in time: " + diffTime);
    // logic to calculate remainig minutes for next train
    var timeRemaining = iFrequency - (Math.floor(diffTime) % iFrequency);
    console.log(timeRemaining);
    // Arrival times logic
    var nextTrain = diffTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(iTrainTime, "HH:mm") ;
    console.log("Arrival time: " + moment(nextTrain).format("HH:mm"));
  	// 
    var minTilTrain = Math.ceil(moment.duration(moment(nextTrain).diff(moment()), 'milliseconds').asMinutes());
    console.log("minutes until next train: " + minTilTrain);	  

	$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().trainName + "</td>"+
		"<td id='destinatioDisplay'>" + childSnapshot.val().destination + "</td>"+
		"<td id='frequencyDisplay'>" + childSnapshot.val().frequency + "</td>"+
		"<td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") + "</td>"+
		"<td id='awayDisplay'>" + minTilTrain  + "</td>"+
		"</td></tr>");
   });
});

