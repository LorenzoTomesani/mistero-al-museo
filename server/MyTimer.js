var Timers = [];

module.exports = {
	start : function(id){
		Timers[id] = Date.now();	
	},

	log : function(id){ 
		var tmp = Date.now();	
		return (Math.floor((tmp - Timers[id])/1000));
	},
		
	reset: function(id){
		Timers[id] = Date.now();
	},
	stop: function(id){
		var tmp = Date.now();	
		Timers[id] = Math.floor((tmp - Timers[id])/1000);	
	}
}


