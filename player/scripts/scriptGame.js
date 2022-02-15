var arrayActivities;
var activity;
var progress = 0;
var point = 0;
var idDevice;
var jsonTotal = [];
var group = false;
var posCurrent = 0;
var answerToEvaluate = 0;
var groupActivity;
var story = '';
var activityDone= 0;
var hint = 0;
function checkType(type){
	$("#firstL").hide();
	$("#secondL").hide();
	$("#thirdL").hide();
	$("#firstValue").hide();
	$("#secondValue").hide();
	$("#thirdValue").hide();
	$("#answerLong").hide();
	$("#answertext").hide();
	$("#nextButton").hide();
	$("#answerfile").hide();
	$('#myModal').modal().hide();
	$("#hints_box").hide();
	$("#text_box").show();
	$("#upperPart").show();
	if(type==0 || type==4){
		$(".open-button").hide();
		$("#upperPart").hide();
		
		if(type == 0){
			$('body').addClass("modal-open");
			if(!$('#myModal').hasClass('in')){
				$('#myModal').modal().show();
			}
			$(".modal-body").empty();
		}
	} else if(type==1){
		$("#nextButton").show();
		$("#hints_box").show();
	} else if(type==2){
		$('#myModal').modal().hide();
		$("#nextButton").show();
		$("#hints_box").show();
	}else if(type==3){		
		$("#hints_box").show();
	} 
}


function toRepeat(){
	$.ajax({
		type: "GET",
		url: "/server/players/" + idDevice + "/totalpoints"
	}).done(function(data){
		if(data.answerDone < answerToEvaluate){
			point = parseInt(data.points);
			answerToEvaluate--;
		}
		if(data.answerDone > 0){
			setTimeout(toRepeat, 1000);
		}

	})
}

function next(){
	var current_activity={};
	if(!group){
		for(var i = 0; i < arrayActivities.length; i++){
			if(arrayActivities[i].idActivity == activity){
				current_activity = arrayActivities[i];
			}
		}
	} else {
		for(var i = 0; i < arrayActivities.length; i++){
			if(arrayActivities[i].idActivity == activity){
				current_activity = arrayActivities[i];
			}
		}
		for(var i = 0; i < arrayActivities.length; i++){
			if(arrayActivities[i].idActivity == groupActivity[posCurrent]){
				current_activity = arrayActivities[i]
			}
		}
	}
	var type = current_activity["type"];
	var flag = false;
	//0=spiegazione 1=valore esatto 2=risposta aperta, 3 = widget, 4 final
	if(type==0){
		flag = true;
	} else if(type==1){
		if(current_activity["value"]){
			var temp = $("#answertext").val();
			var value = current_activity["value"];
			if(temp==value){
				flag = true;
				$("#answertext").val('');
			}
		} else{
			var checked = $('input[name="answermulti"]:checked').val();
			var rightAnswer = current_activity["rightAnswer"];
			if(checked == rightAnswer){
				$('input[name="answermulti"]:checked').prop('checked',false);
				$("#firstValue").val('');
				$("#secondValue").val('');
				$("#thirdValue").val('');
				flag = true;
			}
		}
		if(flag==false){
			if($("#hints_box").text().split(":")[1] > 0){
				alert("Errorre ... Riprova, ti ricordo che puoi chiedere un indizio premendo sulla lampadina");
			}
			else {
				alert("RIPROVA, ma questa volta nessun indizio");
			}
		}
	} else if(type==2){
		if($("#answerfile").val() || $("#answerLong").val().trim()){
			var data =
			{
				question: current_activity['request']
			};
			let formData = new FormData();
			if(current_activity['accept'] == "image"){
				if($("#answerfile").val()){
					formData.append("file", document.getElementById("answerfile").files[0]);
					data.urlFile = document.getElementById("answerfile").files[0].name;
				}
			} else if(current_activity['accept']=="text"){
				$("#answerLong").val()
				if($("#answerLong").val().trim().length > 0){
					answer = $("#answerLong").val();
					data.answer = answer;
					$("#answerLong").val("");
				}
			}
			formData.append("data", JSON.stringify(data));
			$.ajax({
				type: "POST",
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				url: "/server/players/" + idDevice + "/answer",
				data: formData
			})
			answerToEvaluate++;
			toRepeat();
			flag = true;
		}
	} else if(type == 3){
		flag = true;
	}
	if(flag){
		if(type==0){
			$.ajax({
				type: "POST",
				url: "/server/players/"+ idDevice +"/activity",
				data: { "currentActivity": activity, "point": point	}
			})
		}
		if(type==1 || type==3){
			point += parseInt(current_activity["points"]);
			$.ajax({
				type: "POST",
				url: "/server/players/"+ idDevice +"/activity",
				data: { "currentActivity": activity, "point": point}
			})
		}
		if(!group){
			activity = current_activity["nextActivity"];
		} else {
			posCurrent = posCurrent + 1;
			activity = groupActivity[posCurrent];
		}
		var nextA = '';
		for(var i = 0; i < arrayActivities.length; i++){
			if(arrayActivities[i].idActivity == activity){
				nextA = arrayActivities[i];
			}
		}
		type = nextA["type"];
		checkType(type);
		if(type==1 && nextA['value']){
			$("#answertext").show();
		} else if(type==1 && nextA['firstValue']) {
			$("#firstValue").show();
			$("#secondValue").show();
			$("#thirdValue").show();
			$("#firstL").show();
			$("#secondL").show();
			$("#thirdL").show();
			$("#firstValue").val(nextA["firstValue"]);
			$("#secondValue").val(nextA["secondValue"]);
			$("#thirdValue").val(nextA["thirdValue"]);
			$("#firstL").text(nextA["firstValue"]);
			$("#secondL").text(nextA["secondValue"]);
			$("#thirdL").text(nextA["thirdValue"]);
		} else if(type==2 && nextA['accept']=="text" ){
			$("#answerLong").show();
		} else if(type==2 && nextA['accept']=="image"){
			$("#answerfile").attr("accept", "image/*");
			$("#answerfile").show();
		} else if(type==3){
			createBoard('/stories/json/' + story + '/' + nextA["widget"]);
		}
		if(type ==0 || type ==4){
			var add = '';
			if(type==4){
				$("#text_box").html("");
				fine(nextA);
			} else if(type==0){
				if(nextA["urlImage"]){
					$('#modal-body').append('<img class="talker" src="/images/' + nextA["urlImage"] + '" alt="'+ nextA["alt"]+ '"/>');
				}
				$('#modal-body').append('<p id="text-changer" class="text-center story">' +nextA["text"] + '<br>' + add + '<button onclick="closeModal()" aria-label="avanti">X</button></p>');
				$('body').append('<div class="modal-backdrop fade show"></div>');
			}
		} else {
			$("#text_box").text(nextA["request"]);
		}
		activityDone++;
		progress = Math.round((activityDone/arrayActivities.length)*100);
		$('.progress-bar').css('width', progress+"%");
		$('.progress-bar').text(progress+'%');		
	}
}


function fine(nextA){
	if(answerToEvaluate == 0){
		$("#waiting").hide();		
		$(".modal-body").empty();
		var tmpPoints= (point < 18? " andrà meglio la prossima volta!" : (point>= 18 && point<= 24? " non male, ma si può migliorare" : " bravissimo!"))
		add = "sei riuscito ad ottenere: "+ point + " punti.." + tmpPoints;
		if(nextA["urlImage"]){
			$('#modal-body').append('<img class="talker" src="/images/' + nextA["urlImage"] + '" alt="'+ nextA["alt"]+ '"/>');
		}
		$('#modal-body').append('<p id="text-changer" class="text-center story">' +nextA["text"] + '<br>' + add + '<button onclick="end()" aria-label="avanti">X</button></p>');
		$('body').append('<div class="modal-backdrop fade show">');
	    $('#myModal').modal().show();
	} else {
		$("#waiting").show();
		setTimeout(fine, 2000, nextA);
	}
}

function end(){	
	progress = 100;
	$('.progress-bar').css('width', "100%");
	$('.progress-bar').text('100%');
	$.ajax({
		type: "POST",
		url: "/server/players/"+ idDevice +"/activity/end"
	})
	window.location.href = "/player?story=" + story;
}

function getInfo(){
	$.ajax({
		type: "GET",
		url: "/server/players/"+ idDevice +"/hint",
		dataType: "json",
		success: function(data){
			if(data.length > 0){
				hint++;
				$("#hints_text").append(hint + ". " + data +"<br>");
			}
		}
	})
	$.ajax({
		type: "GET",
		url: "/server/players/" + idDevice + "/msg",
		success: function(datad){
			if(datad != [] && datad != 0 && datad != null){
				for(var i =0; i < datad.length; i++){
					$("#textToReceive").append("valutatore: " + datad[i] +"\n");
				}
				openForm();
			}
		}
	})
}
function openForm() {
	$(".open-button").hide();
	$("#myForm").show();
}

function closeForm() {
	$(".open-button").show();
	$("#myForm").hide();
	$(".open-button").show();
}

function sendtoserver(){
	$.ajax({
		type: "POST",
		url: "/server/players/" + idDevice + "/msg",
		dataType: "text",
		data: { 'msg': $("#textToSend").val() }
	})
	$("#textToReceive").append("player: " + $("#textToSend").val() +"\n"  );

	$("#textToSend").val("");
}

$(document).ready(function(){
	$("#myForm").hide();
	$("#upperPart").hide();
	$("#answertext").hide();
	$("#answerfile").hide();
	$("#firstL").hide();
	$("#secondL").hide();
	$("#thirdL").hide();
	$("#firstValue").hide();
	$("#secondValue").hide();
	$("#thirdValue").hide();
	$("#answerLong").hide();
	$("#waiting").hide();
	$(".open-button").hide();
	next1();
	//next1();
	setInterval(getInfo,1000);
});

function closeModal() {
	$('#myModal').modal().hide();
	$('.modal-backdrop').remove();
	$('body').removeClass("modal-open");
	$('.open-button').show();	
	next();
};

function next1(){
	$.getScript("/player/scripts/scriptGeneral.js").done(function() {
		story = retrieveParValue("story");
		var eta = retrieveParValue("age");
		var type = retrieveParValue("tipologia");
		var url = "/stories/json/" + story  + "/" + eta + type + ".json";
		getJson(url).then(function(json) {
			jsonTotal = json;
			arrayActivities = json.activities;
			storyPlaying = story;
			$.ajax({
				type: "POST",
				url: "/server/players",
				dataType: "text",
				data: {'isGroup': type, 'story': storyPlaying, 'activities': json.totalActivity },
				success: function(data){
					idDevice = data;
				}
			})
			var background = "/stories/bgStories/" + json.background;
			var title = json.title;
			var first_activity = arrayActivities[0];
			activity = first_activity["idActivity"];
			checkType(first_activity["type"]);
			var first_text = first_activity["text"];
			var first_img = first_activity['urlImage']
			if(type==2){
				group = true;
				var groupTmp = 'gruppo' + Math.floor((Math.random() * 4) + 1);
				groupActivity = json[groupTmp];
			}
			$("#story-title").text(title);
			$("#nav_image").css("background-image", "url('" + background + "')");
			if(first_img){
				$('#modal-body').prepend('<img class="talker" src="/images/'+ first_img + '" alt="' + first_activity['alt']+ '" />');
			}
			$('#modal-body').append('<p id="text-changer" class="text-center story">' +first_text + '<button onclick="closeModal()" aria-label="avanti">X</button></p>');
		});
	});

}

function hintRequest(){

	var hintRimasti = $("#hints_box").text().split(":");

	if(hintRimasti[1] > 0){
		$.ajax({
			type: "POST",
			url: "/server/players/"+ idDevice +"/hint"
		})
		hintRimasti[1]--;

		$("#hints_box").text(hintRimasti[0] + ": " + hintRimasti[1]);
	} else {
		alert("Gli aiuti sono finiti, cerca di cavartela da solo :D"); //al posto dell'alert sarebbe bello usare il modal
	}
}
