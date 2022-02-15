//using ajax, import scripts 

//change page design by choosing age
$(document).ready(function(){		
	$.getScript("/player/scripts/scriptGeneral.js").done(function() {
		var story = retrieveParValue("story");    
		var url = "/stories/json/" + story + "/"+ story + ".json";
		getJson(url).then(function(json) {
			var background = "/stories/bgStories/" + json.background;
			var title = json.title;
			var desc = json.desc; 
			var accessible= "storia " + (!json.accessibility? "non" : "") + " accessibile";
			$(".jumbotron").css("background-image", "url('" + background + "')");
			$("#story-title").text(title);
			$("#story-description").text(desc);
			$("#story-accessible").text(accessible);
		});    
	});
	
	$("#submit-button").click(function(){
		var story = retrieveParValue("story");
		var age = document.getElementById("age").value;
		var tipologia = document.getElementById("tipologia").value;	
		if(age >= "0" && tipologia >= "0"){
			$.getScript("/player/scripts/scriptGeneral.js").done(function() {
				var eta = retrieveParValue("age");
				var type = retrieveParValue("tipologia");
				var url = "/stories/json/" + story  + "/" + age + tipologia + ".json";
				getJson(url).then(function(json) {			
					window.location.href = "game.html?story=" + story + "&age=" + age + "&tipologia=" + tipologia;				
				}).catch(function(){				
					window.location.href = "error.html";
				});
			});
		} else {
			window.location.href = "error.html";
		}
	});
});
