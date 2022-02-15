const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const MyTimer = require("./MyTimer");
var cors = require('cors');
router.use(fileUpload());
router.use(cors());
router.use(bodyParser.json());     
router.use(bodyParser.urlencoded({extended: true}));

const json_dot = ".json";
var listPlayer = [];
var groupRanking = {};
var singleRaking = {};
var deviceK = 0;

router.get('/changePermit/:nomecartella', function(req,res){
	fs.chmodSync(__dirname + "/savedStories/json/" + req.params.nomecartella, 0o777);
})

router.put('/:publish/:nomeStory', function (req, res) {
  var jsonParsed = JSON.parse(req.body.jsonData);
  var save = req.params.publish;
  var url = __dirname + '/' + save+ '/json/' + req.params.nomeStory.replace(/\s+/g, '');
  fs.mkdir(url, (err) => {
    let bgStories = req.files.backgroundFile; 
    bgStories.mv(__dirname + "/publishedStories/bgStories/"  + bgStories.name); 
    if(req.files){
      let images = req.files.immagini;  
      if(req.files.immagini){
        if(req.files.immagini.length == null && req.files.immagini){    
          images.mv(__dirname + "/images/"  + images.name); 
        }
        for(var i = 0; i < images.length; i ++){    
          images[i].mv(__dirname + "/images/"  + images[i].name); 
        }
      }
    }
    for(var i in jsonParsed.widget){  
      var name =  "widget" + i + ".json";
      var tmp = JSON.stringify(jsonParsed.widget[i], null, "\t");
      fs.writeFile(__dirname + '/' + save+ '/json/' + req.params.nomeStory+ "/" + name, tmp,  function(err, result) {
        if(err) console.log('error', err);
      });
    } 
    var nomeJson = "/" + jsonParsed.selectedAge + jsonParsed.selectedType + json_dot;
    var json_base = {
      title: jsonParsed.title,
      desc: jsonParsed.desc,
      background: bgStories.name,
      accessibility : jsonParsed.accessibility
    }
    var json_schema = {
      title: jsonParsed.title,
      desc: jsonParsed.desc,
      storyMissions: jsonParsed.missions,
      background: bgStories.name,
      activities: jsonParsed.activities,      
      accessibility : jsonParsed.accessibility,
      totalActivity:  jsonParsed.totalActivity
    } ;
    if(jsonParsed.selectedType == 2){
      json_schema['gruppo1'] = jsonParsed.gruppo1;
      json_schema['gruppo2'] = jsonParsed.gruppo2;
      json_schema['gruppo3'] = jsonParsed.gruppo3;
      json_schema['gruppo4'] = jsonParsed.gruppo4;
    }
    json_base = JSON.stringify(json_base, null, "\t");
    var json_base_name = "/" + req.params.nomeStory + ".json";
    json_schema = JSON.stringify(json_schema, null, "\t");
    fs.writeFile(url + nomeJson, json_schema,  function (err) {
      if (err) {
        res.status(400);
        res.send('error');
      } else {
        fs.writeFile(url + json_base_name, json_base, function (err) {
          if (err) {
            res.status(400);
            res.send('error');
          } else {
            res.status(200);
            res.send('all right');
          }
        })
      }
    })
  }); 
})

router.post('/publishedStories/story/:nomeStory', function(req, res){
  var url = __dirname + "/publishedStories/json/"+ req.params.nomeStory + "/" + req.body.selectedAge + req.body.selectedType + ".json";
  fs.readFile(url, (err, data) => {    
    if (err){
      res.status(400);
      res.send('error');
    } else {
      res.status(200);
      res.send(data);
    };
  });
});

router.post('/savedStories/:nomeStory/publish', function (req, res) {  
  var jsonParsed = JSON.parse(req.body.jsonData);    
  if(req.files){
    let images = req.files.immagini;  
    if(req.files.immagini){
      if(req.files.immagini.length == null && req.files.immagini){    
        images.mv(__dirname + "/images/"  + images.name); 
      }
      for(var i = 0; i < images.length; i ++){    
        images[i].mv(__dirname + "/images/"  + images[i].name); 
      }
    }
  }
  for(var i in jsonParsed.widget){  
    var name =  "widget" + i + ".json";
    var tmp = JSON.stringify(jsonParsed.widget[i], null, "\t");
    fs.writeFile(__dirname + '/savedStories/json/' + req.params.nomeStory+ "/" + name, tmp, function(err, result) {
      if(err) console.log('error', err);
    });
  }    
  var json_schema = {
    title: jsonParsed.title,
    desc: jsonParsed.desc,
    storyMissions: jsonParsed.missions,
    background: jsonParsed.background,
    activities: jsonParsed.activities,      
    accessibility : jsonParsed.accessibility,
    totalActivity:  jsonParsed.totalActivity
  } ;
  if(jsonParsed.selectedType == 2  || jsonParsed.selectedType.startsWith(2)){
    json_schema['gruppo1'] = jsonParsed.gruppo1;
    json_schema['gruppo2'] = jsonParsed.gruppo2;
    json_schema['gruppo3'] = jsonParsed.gruppo3;
    json_schema['gruppo4'] = jsonParsed.gruppo4;
  }
  json_schema = JSON.stringify(json_schema, null, "\t");
  var url = __dirname + '/savedStories/json/' + req.params.nomeStory ;
  var newUrl =__dirname + '/publishedStories/json/' + req.params.nomeStory;
  
  var nomeStory = "/" + jsonParsed.selectedAge + jsonParsed.selectedType + json_dot;
  fs.mkdir(newUrl, (err) => {
    fs.rename(url + nomeStory , newUrl + nomeStory, (err) => {
      fs.rename(url +"/"+ req.params.nomeStory+ ".json",newUrl +"/"+ req.params.nomeStory + ".json", (err)=>{
        console.log(err)
      })
      var i = 0;      
      const files = fs.readdirSync(url);      
      files.forEach(jsonfile => {
        var tmp = jsonfile.split(".");
        if(tmp[0].startsWith("widget")){
          fs.readFile(url + "/" + jsonfile, (err, data) => {    
            fs.writeFile(newUrl + "/" + jsonfile, data, function(err, result) {
              if(err) console.log('error', err);
            });
          });
        }
      })
      if (err){
        res.status(400);
        res.send('error');
      } else {
        res.status(200);
        res.send('all right');
      };
    });
  })
})

router.put('/savedStories/:nomeStory/copy', function (req, res) {  
  var url = __dirname + '/savedStories/json/' + req.params.nomeStory + '/'+ req.body.selectedAge + req.body.selectedType + ".json";
  var newUrl = __dirname + '/savedStories/json/' + req.params.nomeStory +'/' + req.body.selectedAge + req.body.selectedType + 'Copy'+ ".json";
  fs.copyFile(url,newUrl, function(err){
    if (err){
      res.status(400);
      res.send('error');
    } else {
      res.status(200);
      res.send('all right');
    };
  });
});

router.post('/savedStories/:nomeStory/delete', function (req, res) {  
  var url = __dirname + '/savedStories/json/' + req.params.nomeStory + "/" + req.body.selectedAge + req.body.selectedType + ".json";
  fs.unlink(url, function(err){
    if (err){
		console.log(err)
      res.status(400);
      res.send('error');
    } else {
      res.status(200);
      res.send('all right');
    };
  })
});

router.post('/savedStory/story/:nomeStory', function(req, res){
  var url = __dirname + "/savedStories/json/"+ req.params.nomeStory + "/" + req.body.selectedAge + req.body.selectedType + ".json";
  fs.readFile(url, (err, data) => {    
    if (err){
      console.log(err)
      res.status(400);
      res.send('error');
    } else {
      res.status(200);
      res.send(data);
    };
  });
});

router.post('/savedStory/:nomeStory/save', function(req, res){
  var jsonParsed = JSON.parse(req.body.jsonData);
  var url = __dirname + "/savedStories/json/"+ req.params.nomeStory;
  if(req.files){
    let images = req.files.immagini;  
    if(req.files.immagini.length == null && req.files.immagini){    
      images.mv(__dirname + "/images/"  + images.name); 
    }
    for(var i = 0; i < images.length; i ++){    
      images[i].mv(__dirname + "/images/"  + images[i].name); 
    }
  }
  for(var i in jsonParsed.widget){  
    var name =  "widget" + i + ".json";
    var tmp = JSON.stringify(jsonParsed.widget[i], null, "\t");
    fs.writeFile(__dirname + '/' + save+ '/json/' + req.params.nomeStory+ "/" + name, tmp, function(err, result) {
      if(err) console.log('error', err);
    });
  }
  var nomeJson = "/" + jsonParsed.selectedAge + jsonParsed.selectedType + json_dot;
  var json_schema = {
    title: jsonParsed.title,
    desc: jsonParsed.desc,
    storyMissions: jsonParsed.missions,
    background: jsonParsed.background,
    activities: jsonParsed.activities,      
    accessibility : jsonParsed.accessibility,
    totalActivity:  jsonParsed.totalActivity
  } ;
  if(jsonParsed.selectedType == 2 || jsonParsed.selectedType.startsWith(2)){
    json_schema['gruppo1'] = jsonParsed.gruppo1;
    json_schema['gruppo2'] = jsonParsed.gruppo2;
    json_schema['gruppo3'] = jsonParsed.gruppo3;
    json_schema['gruppo4'] = jsonParsed.gruppo4;
  }
  json_schema = JSON.stringify(json_schema, null, "\t");
  fs.writeFile(url + nomeJson, json_schema, function (err) {
    if (err) {
      console.log(err)
      res.status(400);
      res.send('error');
    } else {
      res.status(200);
      res.send('all right');
    }
  })
});

router.get('/publishedStories', function(req, res){
  var url = __dirname + "/publishedStories/json";
  var stories = [];
  const files = fs.readdirSync(url);
  files.forEach(file => {
    var tempUrl = url+'/'+file;
    const files2 = fs.readdirSync(tempUrl);
    files2.forEach(jsonfile => {
      var tmp = jsonfile.split(".");
      if(tmp[0] != 'widget'){
        tmp = tmp[0];
        var str = file;
        if(tmp[0] == '0'){
          str+=" 7-10";
        } else if(tmp[0] == '1') {     
          str+=" 11-14";
        } else if(tmp[0]== '2'){
          str+=" 15-10";
        }            
        if(tmp[1] == '0'){                
          str+=" singolo";
        } else if(tmp[1] == '1') {                
          str+=" gruppo";
        } else if(tmp[1]== '2'){
          str+=" classe";
        }		
        var i = 2;
		while(tmp[i] == 'C'){	
			str+=" -Copy";
			i = i + 4;
		}
        if(str != ''){          
          stories.push(str);
        }
      }
    });
  });          
  res.send(stories);
  res.status(200);
})

router.get('/names/publishedStories', function(req, res){
  var url = __dirname + "/publishedStories/json";
  var tmp = [];
  fs.readdir(url, (err, files) => {
    files.forEach(file => {
      tmp.push(file);
    });
    if (err){
      res.status(400);
      res.send('error');
    } else {
      res.status(200);
      res.send(tmp);
    };
  });
})


router.get('/savedStories', function(req, res){
  var url = __dirname + "/savedStories/json";
  var stories = [];
  const files = fs.readdirSync(url);
  files.forEach(file => {
    var tempUrl = url+'/'+file;
    const files2 = fs.readdirSync(tempUrl);
    files2.forEach(jsonfile => {
      var tmp = jsonfile.split(".");
      if(tmp[0] != 'widget'){
        tmp = tmp[0];
        var str = file;
        if(tmp[0] == '0'){
          str+=" 7-10";
        } else if(tmp[0] == '1') {     
          str+=" 11-14";
        } else if(tmp[0]== '2'){
          str+=" 15-10";
        }            
        if(tmp[1] == '0'){                
          str+=" singolo";
        } else if(tmp[1] == '1') {                
          str+=" gruppo";
        } else if(tmp[1]== '2'){
          str+=" classe";
        }
        var i = 2;
		while(tmp[i] == 'C'){	
			str+=" -Copy";
			i = i + 4;
		}
        if(str != '' && str != file){  
          stories.push(str);
        }
      }
    });
  });          
  res.send(stories);
  res.status(200);
})

router.post('/players', function(req,res){
  var tmp = {};
  tmp['id'] = 'device'+deviceK;
  tmp['activitiesDone'] = 0;
  tmp['nickname'] = "";
  tmp['type'] = req.body.isGroup;
  tmp['timeOnActivity'] = 0;
  tmp['totalTime'] = 0;
  tmp['totalPoints'] = 0;
  tmp['story'] = req.body.story;
  tmp['currentActivity'] = 0;
  tmp['activities'] = req.body.activities;
  tmp['answerToEvaluate'] = [];
  tmp['newMsg'] = [];
  tmp['isHintReq'] = false; 
  tmp['isFinished'] = false;
  tmp['hint'] = [];
  tmp['msgSent'] = [];
  /*{
  question:
  answer: risposta lunga o simile URL in caso di download
  punti massimo
}*/
MyTimer.start(tmp['id'] + "total");
MyTimer.start(tmp['id']);
listPlayer.push(tmp); 	
deviceK++;
res.send(tmp['id']);
res.status(200);
})

router.get('/players', function(req,res){   
  for(var i = 0; i < listPlayer.length; i++){
    listPlayer[i]['timeOnActivity'] = MyTimer.log(listPlayer[i]['id']);
    if(!listPlayer[i]['isFinished']){    
      listPlayer[i]['totalTime'] = MyTimer.log(listPlayer[i]['id']+"total");
    }
  }
  res.send(listPlayer);
})

router.post('/players/:idPlayer/name/:newName', function(req,res){  
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      listPlayer[i]['nickname'] = req.params.newName;     
    }
  }    
  res.status(200);
  res.send('all right'); 
})

router.post('/players/:idPlayer/activity', function(req,res){ 
  MyTimer.reset(req.params.idPlayer);  
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      listPlayer[i]['currentActivity'] = req.body.currentActivity;   
      listPlayer[i]['timeOnActivity'] = 0;
      listPlayer[i]['activitiesDone']++;
      listPlayer[i]['totalPoints'] = req.body.point;
    }
  }  
  res.status(200);
  res.send('all right'); 
})

router.delete('/players/:idPlayer', function(req,res){ 
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      listPlayer.splice(i, 1);  
    }
  }  
  res.status(200);
  res.send('all right'); 
})


router.post('/players/:idPlayer/activity/end', function(req,res){ 
  MyTimer.reset(req.params.idPlayer);  
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      listPlayer[i]['isFinished'] = true;  
      listPlayer[i]['totalTime'] = MyTimer.log(listPlayer[i]['id']+'total')
      MyTimer.stop(listPlayer[i]['id']+'total')
    }
  }  
  res.status(200);
  res.send('all right'); 
})

router.post('/players/:idPlayer/answer', function(req,res){    
  var tmp ={};
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){   
      listPlayer[i]['activitiesDone']++;
      var data = JSON.parse(req.body.data);
      tmp['question'] = data.question;
      if(data.urlFile != null){
        let answerfile = req.files.file;
        answerfile.mv(__dirname + "/answerTypeTwo/"  + answerfile.name); 
        tmp['urlFile'] = data.urlFile;
      } else {
        tmp['answer'] = data.answer;
      }      
	  var tmp_length = listPlayer[i]['answerToEvaluate'].length;
	  tmp['idQ'] = ( tmp_length== 0 ?
					0 : 
					listPlayer[i]['answerToEvaluate'][tmp_length-1]['idQ'] + 1);
      listPlayer[i]['answerToEvaluate'].push(tmp);    
    }
  }  
  res.status(200);
  res.send('all right'); 
})

router.post('/players/:idPlayer/hint', function(req,res){  
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      listPlayer[i]['isHintReq'] = true;     
    }
  }  
  res.status(200);
  res.send('all right'); 
})

router.post('/players/:idPlayer/evaluator/hint', function(req,res){
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      listPlayer[i]['hint'].push(req.body.hint);     
      listPlayer[i]['isHintReq'] = false;
    }
  }  
  res.status(200);
  res.send('all right'); 
})

router.get('/players/:idPlayer/hint', function(req,res){
  var tmp= '';
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      tmp = listPlayer[i]['hint'];
      listPlayer[i]['hint'] = [];
    }
  }  
  res.send(tmp);
  res.status(200); 
})

/* MSG SENT DA PLAYER. NEW MSG DA VALUTATORE!!! */
router.post('/players/:idPlayer/msg', function(req,res){  
  for(var i = 0; i < listPlayer.length; i++){      
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      listPlayer[i]['msgSent'].push(req.body.msg);  
    }
  }  
  res.status(200);
  res.send('all right');
})

router.get('/players/:idPlayer/msg', function(req,res){	  
  var tmp =[];
  for(var i = 0; i < listPlayer.length; i++){       
    if(listPlayer[i]['id'] == req.params.idPlayer){    
      tmp = listPlayer[i]['newMsg'];         
      listPlayer[i]['newMsg'] = [];      
    }
  }  
  res.status(200);
  res.send(tmp);
})

router.post('/players/:idPlayer/evaluator/msg', function(req,res){
  for(var i = 0; i < listPlayer.length; i++){
    if(listPlayer[i]['id'] == req.params.idPlayer){             
      listPlayer[i]['newMsg'].push(req.body.msg);   
    }
  }
  res.status(200);
  res.send('all right');
})

router.get('/players/:idPlayer/evaluator/msg', function(req,res){	  
  var tmp =[];
  for(var i = 0; i < listPlayer.length; i++){       
    if(listPlayer[i]['id'] == req.params.idPlayer){    
      tmp = listPlayer[i]['msgSent'];         
      listPlayer[i]['msgSent'] = [];      
    }
  }  
  res.status(200);
  res.send(tmp);
})

router.post('/players/:idPlayer/points', function(req,res){
  for(var i = 0; i < listPlayer.length; i++){     
    if(listPlayer[i]['id'] == req.params.idPlayer){  
	  var length = listPlayer[i]['answerToEvaluate'].length;
	  for(var j = 0; j < length; j ++){
		if(listPlayer[i]['answerToEvaluate'][j]['idQ'] == req.body.idQ){
			listPlayer[i]['totalPoints'] = parseInt(listPlayer[i]['totalPoints']) 
										 + parseInt(req.body.points);    
			listPlayer[i]['answerToEvaluate'].splice(j, 1);  
		}
	  }
    }
  }  
  res.status(200);   
})

router.get('/players/:idPlayer/totalpoints', function(req,res){
  var points;
  var answer;
  for(var i = 0; i < listPlayer.length; i++){     
    if(listPlayer[i]['id'] == req.params.idPlayer){      
      points = listPlayer[i]['totalPoints']; 
      answer = listPlayer[i]['answerToEvaluate'].length; 
    }
  }  
  var tmp = {
    "points": points,
    "answerDone": answer
  }
  res.send(tmp);
})

router.get('/file/:nameFile',function(req,res){
  res.sendFile(__dirname + '/answerTypeTwo/' + req.params.nameFile);
})

module.exports = router;