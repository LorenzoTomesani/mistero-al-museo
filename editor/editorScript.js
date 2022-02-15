Vue.component('qrcodediv', {
  name: 'qrcodediv',
  props: ['val'],
  template: '<div><qrcode :value="val" :options="{ width: 400 }"></qrcode> \
  </div>'
})


new Vue({
  el: '#editor',
  mounted() {  
    axios.get('/server/PublishedStories/')
    .then((response) => {
      this.PublishedStories = response.data;  
      axios.get('/server/SavedStories/')
      .then((response) => {
        this.SavedStories = response.data;
      })
    });       
    axios.get('/server/names/publishedStories')
    .then((response) => {      
      this.publishedStoriesQrNames= response.data;
    })
    setInterval(() => {
    axios.get('/server/PublishedStories/')
    .then((response) => {
      this.PublishedStories = response.data;  
      axios.get('/server/SavedStories/')
      .then((response) => {
        this.SavedStories = response.data;
      })
    });       
    axios.get('/server/names/publishedStories')
    .then((response) => {      
      this.publishedStoriesQrNames= response.data;
    })  }, 3000)
    
  },
  data: {
    jumbotronMessage: "Autore",
    onlyOne: 1,
    isQrCodeVisible: false,
    isVisibleUpButton: true,
    isVisibleDownButton: false,
    isVisibleInput: false,
    isVisibleSelect: false,
    isVisibleMissionBlock: false,
    isVisibleActivityBlock: false,
    isVisibleActivityText: false,
    isVisibleActivityQuestion: false,
    isVisibleQuestionValue: false,
    isVisibleQuestionRange: false,
    isVisibleActivityOpen: false,
    isVisibleActivity: [true],
    areMissedForms: false,
    editing: false,
    isVisibleModal: false,
    isPublishedStories: false,
    isSavedStories:false,
    createStoryButton: false,
    TypeStories: 2,
    operationIndex: 0,
    ShowRadio: false,
    ShowRadioDelete: false,
    editWidget: false,
    showEditWidget: false,
    isDelete: 0,
    isVisibleGraph: false,
    
    inputFields: false,
    selectFields: false,
    missionFields: false,
    isNotEmptyMission: false,
    storyBackground: [],
    
    missedForms: [],
    
    inputMissions: [],
    SavedStories: [],
    PublishedStories: [],
    
    publishedStoriesQrNames:[],
    
    SavedStoryChosen:'',
    PublishedStoryChosen:'',
    
    selectedAge: 0,
    selectedType: 0,
    copy: '',
    buttonBack:0,
    openGraph : false,
    immagine: '',
    imageNeeded: false,
    /* added */
    editStory: '',
    editMissionStories: '',
    editActStories: '',
    copiedMission: '',
    copiedActivity: '',
    /* end */
    storyData: {
	  idStory: '',
      immagini: [],
      storyTitle: '',
      storyDescription: '',
      background: '',
      selectedAge: 0,
      selectedType: 0,
      accessibility: 'false',
      totalActivity: 0,
      storyWidget: [],
      storyMissions: [],
      storyActivities: []
    }
  },
  methods: {   
    /* added */
    showEdit: function(){
      this.openGraph= true; 
    },
    hideEdit: function(){
      this.openGraph= false;	  
      this.editStory = '';         		  
      this.editMissionStories =  '';
      this.editActStories =  '';
    },
    getStory: function(nomeStoria){
      this.checkType(nomeStoria, true);
      /**/
      this.isVisibleGraph = true;
      axios.post('/server/savedStory/story/' + this.SavedStoryChosen,
      {          
        "selectedAge" : this.selectedAge,
        "selectedType" : this.selectedType + this.copy
      }
    ).then((data) => {
      this.editStory = data.data;         		  
      this.editMissionStories = this.editStory.storyMissions;
      this.editActStories = this.editStory.activities;
      this.createGraph();
    })	  
  },
  moveActivity: function(){
    var i = 0;
    var tmp1 = document.getElementById("moveAct").value;
    var tmp2 = document.getElementById("toAct").value;
	if(tmp1 != tmp2 && tmp1 && tmp2){
     if(this.selectedType != 2){
       if(tmp1 !=0){
         var toMove = "";
         var found = false;
         var k = 0;
         while(!found){
           if(tmp2 == this.editActStories[i].idActivity){  
             var tmp = '';
             var j = 0;
             var y = 0;
             while(!found && j < this.editActStories.length){
               if(this.editActStories[j].nextActivity == tmp1){  
                 while(!found && y < this.editActStories.length){              
                   if(this.editActStories[y].idActivity == tmp1 && this.editActStories[i].type != "4" && this.editActStories[y].type != "4"){  
                     this.editActStories[j].nextActivity = this.editActStories[y].nextActivity;
                     this.editActStories[y].nextActivity = this.editActStories[i].nextActivity;
                     this.editActStories[i].nextActivity = this.editActStories[y].idActivity;
					 found = true;
                   }
                   y++;
                 }   
               }       
               j++;
             }   
           }
           i++;
         }
       }
     } else {      
       var group = document.getElementById("group").value;
       var tmp = this.editStory[group];
       for(var i = 0; i< this.editStory[group].length;i++){
         if(this.editStory[group][i] == tmp1){
           for(var j = 0; j< this.editStory[group].length; j++){
             if(this.editStory[group][j] == tmp2){
               this.editStory[group].splice(j, 0, tmp1);
               this.editStory[group].splice(i,1);
             }
           } 
         }
       }      
     }
	}
    document.getElementById("moveAct").value = "";
    document.getElementById("toAct").value = "";
    this.createGraph();
  },
  emptyGraph: function(){	  
    var graph = document.getElementById("graph");
    graph.innerHTML = '';
	this.openGraph= false;
  },
  takeMission: function(){
    var value = document.getElementById("choose-mission").value;
    this.copiedMission = value;
  },
  pasteMission: function(){
	if(this.copiedMission){
		if(this.editMissionStories.indexOf(this.copiedMission) == -1){
			this.editMissionStories.push(this.copiedMission);
		}
		this.copiedMission = '';
	}
  },
  deleteMission: function(){
    var value = document.getElementById("deleteMission").value;
	if(value){
		if( typeof value != "number"){
		  var index = this.editMissionStories.indexOf(value);
		  if(index != -1){
			this.editMissionStories.splice(index, 1);
		  }
		}    
		document.getElementById("deleteMission").value = ""; 
	}
  },
  deleteActivity: function(){
    var value = document.getElementById("deleteActivity").value;
    var i = 0;
    var found = false;
    document.getElementById("deleteActivity").value = "";
	if(value){
		if(this.selectedType != 2){
		  while(!found && i < this.editActStories.length){
			if(value == this.editActStories[i].nextActivity){  
			  var tmp = '';
			  var found2 = false;
			  var j = 0;
			  while(!found2 && j < this.editActStories.length){
				if(this.editActStories[j].idActivity == this.editActStories[i].nextActivity){  
				  this.editActStories[i].nextActivity = this.editActStories[j].nextActivity;            
				  this.editActStories.splice(j, 1);
				  found2 = true;
				}
				j++;
			  }   
			  found = true;
			}
			i++;
		  }
		} else {
		  var group = document.getElementById("group").value;
		  var tmp = this.editStory[group];
		  while(!found && i < this.editStory[group].length){
			if(tmp[i] == value){
			  this.editStory[group].splice(i, 1);
			  found = true;
			}
			i++;
		  }
		}
		if(found){
			this.editStory.totalActivity--;
			this.createGraph();
		}
	}
  },
  copyActivity: function(){
    var val = document.getElementById("copyActivity").value;
	var found = false;
	var i = 0;
	if(val){
		while(i < this.editActStories.length && !found){
			if(this.editActStories[i].idActivity == val){	
				if(this.editActStories[i].type != "4"){
					this.copiedActivity = JSON.parse(JSON.stringify(this.editActStories[i]));
				}
				found = true;
			}
			i++;
		}
	} 
	document.getElementById("copyActivity").value = '';
  },
  pasteActivity: function(){
    var val = document.getElementById("positionActivity").value; 
    document.getElementById("positionActivity").value = "";
    if(val != '' && this.copiedActivity != '' && val < this.editActStories.length){
	  var tmp_length = this.editActStories.length;
      this.copiedActivity.idActivity = this.editActStories[tmp_length-1].idActivity + 1;
      if(this.selectedType != 2){
        var j = 0;
        var y = 1;
        var found = false;		
        while(!found && y < this.editActStories.length){
          if(y==parseInt(val)){
            this.copiedActivity.nextActivity = this.editActStories[j].nextActivity;
            this.editActStories[j].nextActivity = this.copiedActivity.idActivity;
            found = true;
          }
          y++;
		  var k = 0;
		  var found2 = false;
		  var nextActivity = this.editActStories[j].nextActivity;
		  while(k < this.editActStories.length && !found2){
			  if(this.editActStories[k].idActivity == nextActivity){				  
				j = k;
				found2 = true;
			  }
			  k++;
		  }
        }      
        this.editActStories.push(this.copiedActivity);  
		var i = 0;
		var k = 0;
		var found = false;
        while(i < this.editActStories && !found){
		  k = i;
          while(k < this.editActStories && !found){          
            if(this.editActStories[i].idActivity == this.editActStories[k].nextActivity ){        
              this.editActStories[i].idActivity = i;
              this.editActStories[k].nextActivity = i;
			  found = true;
            }
			k++;
          }
		  i++;
        } 
      } else {        
        var group = document.getElementById("group").value;
        for(var i = 0; i< this.editStory[group].length;i++){
          if(i == val){
            this.editStory[group].splice(i, 0, this.editStory[group].length);
          }
        } 
        this.editActStories.push(this.copiedActivity);  
      }
    }
    this.editStory.totalActivity++;
	this.copiedActivity = '';
    this.createGraph();
  },
  /* end */
  saveFile: function(){
    if(document.getElementById("story-background")){
      this.storyBackground = document.getElementById("story-background").files[0];
      this.storyData.background = this.storyBackground.name;
    }
  },
  checkType: function(stories, isSaved){     
    var tmp = stories.split(" ");
    if(this.TypeStories){
      this.SavedStoryChosen = tmp[0];
    } else {
      this.PublishedStoryChosen = tmp[0];
    }
    if(tmp[1] == '7-10'){
      this.selectedAge=0;
    } else if(tmp[1] == '11-14') {     
      this.selectedAge=1;
    } else if(tmp[1]== '15-10'){
      this.selectedAge=2;
    }            
    if(tmp[2] == 'singolo'){                
      this.selectedType=0;
    } else if(tmp[2] == 'gruppo') {             
      this.selectedType=1;
    } else if(tmp[2]== 'classe'){        
      this.selectedType=2;
    } 
	var i = 3;
	this.copy = '';
	while(tmp[i] == '-Copy'){	
      this.copy += "Copy";
		i++;	
	}
  },
  closeQrCode: function(){
    this.isQrCodeVisible = false;
  },
  showModal: function(index){
    this.buttonBack = true;
    this.isVisibleModal = true;
    this.operationIndex= index;    
    if(index == 2){        
      this.ShowRadioDelete=true,
      this.isSavedStories = true;
    }else if(index == 3 || index == 4){
      this.isPublishedStories= true;    
    }  
  },
  /* added - TODO */
  translateType: function(index){
	let toReturn = '';
    switch (index) {
      case '0':     
      toReturn = "spiegazione";
      break;
      case '1':      
      toReturn = "domanda con valore";
      break;
      case '2':        
      toReturn = "domanda aperta";
      break;
      case '3':
      toReturn = "widget memory";
      break;
      case '4':        
      toReturn = "finale"; 
      break;        
    }
	return toReturn;
  },
  createGraph: function(){
    var graph = document.getElementById("graph");
    graph.innerHTML = '';
    if(this.selectedType !=2){
      let type = this.translateType(this.editActStories[0].type)
      graph.innerHTML = '<div class="activity"> <div class="text-center mt-2"><p class = "header-text">Id:' + this.editActStories[0].idActivity + '</p><hr><p>'  + type + '<p></div>'; 
      var idNextActivity = parseInt(this.editActStories[0].nextActivity);
	  var i = 0;
      while( typeof i != undefined && i!=null){   
		i = 0;
		var found = false;
		while(i < this.editActStories.length && !found){
			if(this.editActStories[i].idActivity == idNextActivity){
				found = true;
			} else {
				i++;
			}
		}
        type = this.translateType(this.editActStories[i].type);
        graph.innerHTML += '<div class="activity"> <div class="text-center mt-2"><p class = "header-text">Id:' + this.editActStories[i].idActivity + '</p><hr><p>'  + type + '</p></div>'; 
        var k = 0;
        if(this.editActStories[i].nextActivity !=undefined){
          idNextActivity = this.editActStories[i].nextActivity;
        } else {
			i = null;
		}
      }
    } else {
      graph.innerHTML = '<p class = "mt-2">Gruppo 1:</p>' ;       
      let type;
      for(var i = 0; i < this.editStory.gruppo1.length; i++){
        for(var j = 0; j < this.editActStories.length; j++){ 
          if(this.editActStories[j].idActivity == this.editStory.gruppo1[i]){         
            type = this.translateType(this.editActStories[j].type);
          }
        }
        graph.innerHTML += '<div class="activity"> <div class="text-center mt-2"><p class = "header-text">Id:' + this.editStory.gruppo1[i]   + '</p><hr><p>' + type + '</p></div>'; 
      }  
      graph.innerHTML += "<br>";
      graph.innerHTML += '<p>Gruppo 2:</p>' ; 
      for(var i = 0; i < this.editStory.gruppo2.length; i++){     
        for(var j = 0; j < this.editActStories.length;j++){
          if(this.editActStories[j].idActivity == this.editStory.gruppo2[i]){            
            type = this.translateType(this.editActStories[j].type);
          }
        }     
        graph.innerHTML +='<div class="activity"> <div class="text-center mt-2"><p class = "header-text">Id:' + this.editStory.gruppo2[i]  + '</p><hr><p>'  + type + '</p></div>'; 
      }
      graph.innerHTML += "<br>";
      graph.innerHTML += '<p>Gruppo 3:</p>' ; 
      for(var i = 0; i <  this.editStory.gruppo3.length; i++){          
        for(var j = 0; j < this.editActStories.length; j++){
          if(this.editActStories[j].idActivity == this.editStory.gruppo3[i]){            
            type = this.translateType(this.editActStories[j].type);
          }
        } 
        graph.innerHTML +='<div class="activity"> <div class="text-center mt-2"><p class = "header-text">Id:' + this.editStory.gruppo3[i]  + '</p><hr><p>'  + type + '</p></div>'; 
      }
      graph.innerHTML += "<br>";
      graph.innerHTML += '<p>Gruppo 4:</p>' ; 
      for(var i = 0; i <  this.editStory.gruppo4.length; i++){  
        for(var j = 0; j < this.editActStories.length; j++){
          if(this.editActStories[j].idActivity == this.editStory.gruppo4[i]){            
            type = this.translateType(this.editActStories[j].type);
          }
        }         
        graph.innerHTML += '<div class="activity"> <div class="text-center mt-2"><p class = "header-text">Id:' + this.editStory.gruppo4[i]   + '</p><hr><p>' + type + '</p></div>'; 
      }
    }
  },
  setValueStory: function(){
    this.editing = true;
    this.storyData.storyTitle= this.editStory.title;
    this.storyData.storyDescription= this.editStory.desc;
    this.storyData.background=  this.editStory.background;
    this.storyData.accessibility= this.editStory.accessibility;
    this.storyData.totalActivity= this.editStory.totalActivity;
    this.storyData.storyMissions= this.editMissionStories;
    this.storyData.storyActivities= this.editActStories;
    this.storyData.selectedType = this.selectedType;
    this.storyData.selectedAge = this.selectedAge;
    if(this.selectedType == 2){        
      this.storyData.gruppo1 = this.editStory.gruppo1.toString();
      this.storyData.gruppo2 = this.editStory.gruppo2.toString();
      this.storyData.gruppo3 = this.editStory.gruppo3.toString();
      this.storyData.gruppo4 = this.editStory.gruppo4.toString();
    }
  },
  /* end */
  pushImages: function(index){
    this.storyData.storyActivities[index].widget = "widget" + (this.storyData.storyWidget.length == 0? 0 : this.storyData.storyWidget.length - 1) + ".json";
    for(var i = 0; i < document.getElementById("cards").files.length; i++ ){
      this.storyData.immagini.push(document.getElementById("cards").files[i]);
    }        
    this.storyData.immagini.push(document.getElementById("back-card").files[0]);
    var back = document.getElementById("back-card").files[0];
    var json = {
      "memory": []
    };
    var url = '/images/' + back.name;
    var tmp = {
      "name": back.name,
      "value": url
    };   
    json.memory.push(tmp);               
    for(var i = 0; i < document.getElementById("cards").files.length; i++ ){
      var tempCard = document.getElementById("cards").files[i];
      var urlCard = '/images/' + tempCard.name;
      var tmp ={
        "name": tempCard.name,
        "value": urlCard
      };
      json.memory.push(tmp);          
    }
    this.storyData.storyWidget.push(json);
  },
  copyMissions: function(){
    this.storyData.storyMissions = [];
    for (var i = 0; i < this.inputMissions.length; i++) {
      this.storyData.storyMissions.push('');
      this.storyData.storyMissions[i] = this.inputMissions[i].storyMission;
    }
  },
  nextOperation: function(){
    if(this.operationIndex==1){
      var tmp = (this.TypeStories==0? "publishedStories" : "SavedStories");
      var tmp2 = (this.TypeStories==0? this.PublishedStoryChosen : this.SavedStoryChosen);
      this.checkType(tmp2);     
      axios.post('/server/'+tmp+'/story/'+ (this.TypeStories==0? this.PublishedStoryChosen : this.SavedStoryChosen),
      {         
        "selectedAge": this.selectedAge,
        "selectedType": this.selectedType + this.copy
      })
      .then((response) => {
        this.SavedStories = response.data;
      })
      this.openGraph = true;
      this.createGraph();
    } else if(this.operationIndex == 2){   
      this.checkType(this.SavedStoryChosen); 
      if(this.isDelete == 0){          
        axios.put('/server/SavedStories/' + this.SavedStoryChosen + '/copy',
        {         
          "selectedAge": this.selectedAge,
          "selectedType": this.selectedType + this.copy
        })  
      } else if(this.isDelete == 1){          
        axios.post('/server/SavedStories/' + this.SavedStoryChosen + '/delete',
        {         
          "selectedAge": this.selectedAge,
          "selectedType": this.selectedType + this.copy
        }) 
      } 
    } else if(this.operationIndex == 3){    
      this.isQrCodeVisible = true;
    }
    this.hideModal();
    if(this.operationIndex != 0 && this.operationIndex != 1 && this.operationIndex != 3){
      this.showUpButton();
    }
  },
  hideModal: function(){
    this.ShowRadioDelete = false;
    this.buttonBack = false;
    this.ShowRadio = false;
    this.TypeStories = 2;
    this.isVisibleModal = false;
    this.isPublishedStories= false;   
    this.isSavedStories = false; 
  },
  hideUpButton: function(){
    this.isVisibleUpButton = false;
  },
  showUpButton: function(){
    this.isVisibleUpButton = true;  
  },
  hideDownButton: function(){
    this.isVisibleDownButton = false;
  },
  showDownButton: function(){
    this.isVisibleDownButton = true;
  },
  hideInput: function(){
    this.isVisibleInput = false;
  },
  showInput: function(){
    this.isVisibleInput = true;
  },
  hideSelect: function(){
    this.isVisibleSelect = false;
  },
  showSelect: function(){
    this.isVisibleSelect = true;
  },
  hideMissionBlock: function(){
    this.isVisibleMissionBlock = false;
  },
  showMissionBlock: function(){
    this.isVisibleMissionBlock = true;
  },
  hideActivityBlock: function(){
    this.isVisibleActivityBlock = false;
  },
  checkMissionEmpty: function(){
    if(this.storyData.storyMissions.length > 0 && this.storyData.storyMissions[0].storyMission && this.storyData.storyMissions[0].storyMission != ''){
      this.hideDownButton(); 
      this.hideMissionBlock();
      this.showActivityBlock();
      this.pushNewActivity();
      this.isNotEmptyMission = true;
    }
  },
  showActivityBlock: function(){
    this.isVisibleActivityBlock = true;
  },
  hideActivity: function(index){
    this.isVisibleActivity[index] = false;
  },
  showActivityText: function(index){
    this.isVisibleActivityText = true;
    this.isVisibleActivityQuestion = false;
    this.isVisibleActivityOpen = false;
    this.removeActivityQuestion(index);
    this.removeActivityOpen(index);    
  },
  showActivityQuestion: function(index){
    this.isVisibleActivityText = false;
    this.isVisibleActivityQuestion = true;
    this.isVisibleActivityOpen = false;
    this.removeActivityText(index);
    this.removeActivityOpen(index);
  },
  showQuestionValue: function(index){
    this.isVisibleQuestionValue = true;
    this.isVisibleQuestionRange = false;
    this.isWidgetVisible = false;
    
  },
  showActivityOpen: function(index){
    this.isVisibleActivityText = false;
    this.isVisibleActivityQuestion = false;
    this.isVisibleActivityOpen = true;
    this.isWidgetVisible = false;
    this.removeActivityText(index);
    this.removeActivityQuestion(index);
    this.removeActivityQuestionValue(index);
    
  },
  showActivityWidget: function(index){
    this.isVisibleActivityText = true;
    this.isVisibleActivityQuestion = false;
    this.isVisibleActivityOpen = false;
    this.isWidgetVisible = true;
    this.removeActivityText(index);
    this.removeActivityQuestion(index);
    this.removeActivityQuestionValue(index);
    
  },
  hideGraph: function(){
    this.isVisibleGraph = false;
  },
  removeActivityText: function(index){
    if(this.storyData.storyActivities[index].activityText){
      delete this.storyData.storyActivities[index].activityText;
    }
  },
  removeActivityQuestion: function(index){
    if(this.storyData.storyActivities[index].activityQuestion){
      delete this.storyData.storyActivities[index].activityQuestion;
    }
  },
  removeActivityQuestionValue: function(index){
    if(this.storyData.storyActivities[index].questionValue){
      delete this.storyData.storyActivities[index].questionValue;
    }
  },
  removeActivityOpen: function(index){
    if(this.storyData.storyActivities[index].activityOpen){
      delete this.storyData.storyActivities[index].activityOpen;
    }
    if(this.storyData.storyActivities[index].activityOpenFile){
      delete this.storyData.storyActivities[index].activityOpenFile;
    }
  },
  clearActivityValues: function(){
    this.isVisibleActivityText = false;
    this.isVisibleActivityQuestion = false;
    this.isVisibleQuestionValue = false;
    this.isVisibleQuestionRange = false;
    this.isVisibleActivityOpen = false;
  },
  checkActivities: function(){
    if(this.storyData.storyActivities.length >= 1){
      this.createStoryButton = true;
    }
  },
  pushNewMission:function(){
    this.inputMissions.push({});
  },
  removeMission: function(index){
    if(index != 0){
      this.inputMissions.splice(index, 1);
    }
  },
  pushNewActivity: function(index){
    if(this.editing && index == this.storyData.storyActivities.length-1  || !this.editing){
      this.storyData.storyActivities.push({});
      this.storyData.totalActivity = this.storyData.totalActivity + 1;
      this.storyData.storyActivities[this.storyData.storyActivities.length-1]['idActivity'] = this.storyData.storyActivities.length-1;
    }
  },
  pushNewActivityIndex: function(){
    this.isVisibleActivity.push(true);
  },
  onlyNumber: function(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
      event.preventDefault();
    } else {
      return true;
    }
  },
  
  showType: function(){        
    this.isVisibleActivityText = true;
    this.isVisibleActivityQuestion = false;
    this.isVisibleActivityOpen = false;
    this.isWidgetVisible = false;
  },
  checkActivityForms: function(index){
    this.missedForms = [];     
    if(this.storyData.storyActivities[index].type == 0 && this.imageNeeded && document.getElementById("story-images").files.length < 1){
      this.missedForms.push("Inserisci l'immagine");
    }    
    if(this.storyData.storyActivities[index].type == 0 && this.imageNeeded && !this.storyData.storyActivities[index].alt){
      this.missedForms.push("Inserisci la descrizione");
    }
    if(!this.storyData.storyActivities[index].activityMission){
      this.missedForms.push('Seleziona una missione');
    }
    
    if(this.storyData.storyActivities[index].type == null || typeof this.storyData.storyActivities[index].type == undefined){     
      this.missedForms.push('Seleziona il tipo di attività');
    }
    else{
      if(!this.storyData.storyActivities[index].text && !this.storyData.storyActivities[index].request && !this.storyData.storyActivities[index].text){
        this.missedForms.push("Inserisci la spiegazione");
      }
      if(!this.storyData.storyActivities[index].accept && this.storyData.storyActivities[index].type == 2){
        this.missedForms.push('Seleziona la tipologia dei file');
      }
      if(!this.storyData.storyActivities[index].value && this.onlyOne == 1 && this.storyData.storyActivities[index].type == 1){
        this.missedForms.push("Inserisci un valore");
      }
      if((!this.storyData.storyActivities[index].firstValue ||
        !this.storyData.storyActivities[index].firstValue ||
        !this.storyData.storyActivities[index].firstValue ||               
        !this.storyData.storyActivities[index].rightAnswer) &&
        this.onlyOne == 0 && this.storyData.storyActivities[index].type == 1){
          this.missedForms.push("Inserisci i valori");
        }
        
        
        if(!this.storyData.storyActivities[index].nextActivity && this.storyData.storyActivities[index].type != 4 && this.storyData.selectedType !=2 ){
          this.missedForms.push('Inserisci la prosima attività');
        }  
        if(this.editing == false){  
          if(this.storyData.storyActivities[index].type == 3 && document.getElementById("cards").files.length != 10 ){       
            this.missedForms.push('Devono esserci 10 immagini');
          }     
        }
        if(!this.storyData.storyActivities[index].points && (this.storyData.storyActivities[index].type ==1 || this.storyData.storyActivities[index].type == 3)){
          this.missedForms.push('Inserisci il punteggio con la risposta giusta');
        }
      }     
      if(this.missedForms.length > 0){
        this.areMissedForms = true;
      } else{        
        if(this.imageNeeded && this.storyData.storyActivities[index].type==0){
          this.immagine = document.getElementById("story-images").files[0];
          this.storyData.immagini.push(this.immagine);
          this.storyData.storyActivities[index].urlImage = this.immagine.name; 
        }        
        if(this.editing == false){
          if(this.storyData.storyActivities[index].type == 3 && document.getElementById("cards").files.length == 10 ){
            this.pushImages(index);
          }
        }
        this.areMissedForms = false;
        this.pushNewActivity(index);
        this.pushNewActivityIndex();
        this.hideActivity(index);
        this.clearActivityValues();
        this.checkActivities();
        this.showActivityType(index);
      }
    },
    showActivityType: function(index){      
      switch (this.storyData.storyActivities[index+1].type) {
        case 0:        
        this.isVisibleActivityText = true;
        break;
        case 1:
        this.isVisibleActivityQuestion = true;
        break;
        case 2:        
        this.isVisibleActivityOpen = true;
        break;
        case 3:
        this.showEditWidget = true; 
        break;
        case 4:        
        this.isVisibleActivityText = true;     
        break;        
      }
    },
    /* end */
    clearValues: function(){  
      this.isVisibleActivity = [true];
      this.inputFields= false; 
      this.inputMissions = [];   
      this.storyData.idStory= '';	  
      this.storyData.storyTitle= '';
      this.storyData.storyTitle= '';
      this.storyData.storyDescription= '';
      this.storyData.background= '';
      this.storyData.selectedAge= 0;
      this.storyData.selectedType= 0;
      this.storyData.accessibility= 'false';
      this.storyData.totalActivity= 0;
      this.storyData.storyWidget= [];
      this.storyData.storyMissions= [];
      this.storyData.storyActivities = [];
      this.missionFields = false;
      this.showEditWidget = false;
      this.editing = false;
    },
    isDisabledInputButton: function(){
      if(this.storyData.storyTitle && this.storyData.storyDescription && this.storyData.idStory){
        this.inputFields = true;
      }
    },    
    isDisabledMissionButton: function(){
      var j = 0;
      for (var i = this.inputMissions.length - 1; i >= 0; i--) {
        if(!this.inputMissions[i].storyMission){
          j = j + 1;
        }
      }
      
      if(this.inputMissions.length > 1){
        this.inputMissions.splice(this.inputMissions.length - j, j);
      }
      else{
        this.inputMissions.splice(this.inputMissions.length - j + 1, j);  
      }
      
      if(this.inputMissions[0].storyMission){
        this.missionFields = true;
      }
    },
    
    createStory: function(isSaved){
      if(this.storyData.selectedType==2){
        var g1 = this.storyData.gruppo1.split(",");      
        var g2 = this.storyData.gruppo2.split(",");      
        var g3 = this.storyData.gruppo3.split(",");      
        var g4 = this.storyData.gruppo4.split(",");
      }
      let formData = new FormData();
	  var length = this.storyData.storyActivities.length;
	  if(Object.keys(this.storyData.storyActivities[length - 1]).length == 1){
		  this.storyData.storyActivities.splice(length-1, 1);
	  }
      let tmp = {         
        "title": this.storyData.storyTitle,
        "desc": this.storyData.storyDescription,
        "selectedAge": this.storyData.selectedAge,
        "selectedType": this.storyData.selectedType,
        "missions": this.storyData.storyMissions,
        "activities": this.storyData.storyActivities,
        "background": this.storyData.background,
        "accessibility" : this.storyData.accessibility,
        "totalActivity": this.storyData.totalActivity,
        "widget": this.storyData.storyWidget
      };
      if(g1){
        tmp.gruppo1 = g1;
        tmp.gruppo2 = g2;
        tmp.gruppo3 = g3;
        tmp.gruppo4 = g4
      }
      formData.append("jsonData", JSON.stringify(tmp));
      formData.append("backgroundFile",this.storyBackground);
      for(var i = 0; i < this.storyData.immagini.length; i ++){        
        formData.append("immagini", this.storyData.immagini[i]);
      }
      var whichOp = ((!isSaved)? 'publishedStories':'savedStories');
      axios.put('/server/'+ whichOp + '/' + this.storyData.idStory, formData, 
		{
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})   
    this.storyData.storyActivities = [];
    this.storyData.storyMission = [];
    this.inputMissions = [];
  },
  
  SaveStory: function(flag){  
    if(this.storyData.selectedType==2){
      var g1 = this.storyData.gruppo1.split(",");      
      var g2 = this.storyData.gruppo2.split(",");      
      var g3 = this.storyData.gruppo3.split(",");      
      var g4 = this.storyData.gruppo4.split(",");
    }
    let formData = new FormData();
    let tmp = {         
      "title": this.storyData.storyTitle,
      "desc": this.storyData.storyDescription,
      "selectedAge": this.storyData.selectedAge,
      "selectedType": this.storyData.selectedType + this.copy,
      "missions": this.storyData.storyMissions,
      "activities": this.storyData.storyActivities,
      "background": this.storyData.background,
      "accessibility" : this.storyData.accessibility,
      "totalActivity": this.storyData.totalActivity,
      "widget": this.storyData.storyWidget,
      "background": this.storyData.background 
    };
    if(g1){
      tmp.gruppo1 = g1;
      tmp.gruppo2 = g2;
      tmp.gruppo3 = g3;
      tmp.gruppo4 = g4
    }
    for(var i = 0; i < this.storyData.immagini.length; i ++){        
      formData.append("immagini", this.storyData.immagini[i]); 
    }
    formData.append("jsonData", JSON.stringify(tmp));
    if(flag==0){
      axios.post('/server/savedStory/' + this.SavedStoryChosen + '/save', formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else{
      axios.post('/server/savedStories/' + this.SavedStoryChosen + '/publish', formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  }  
}
})