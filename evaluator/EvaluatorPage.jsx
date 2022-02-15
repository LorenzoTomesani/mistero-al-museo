const Alert = ReactBootstrap.Alert;
const Button = ReactBootstrap.Button;
const Card = ReactBootstrap.Card;
const ProgressBar = ReactBootstrap.ProgressBar;
const Form =  ReactBootstrap.Form;
const FileSaver  = FileSaver;

class EvaluatorPage extends React.Component{
	constructor(props) {		
		super(props);
		this.state = {
			showChat: false,
			stories : [],
			showNavbar: false,
			showFormName: false,
			id: null,
			CardId:null,
			showAllCards:true,
			showModal: true,
			chosenStory : '',
			toPrint:[],
			PlayersLocked:[],
			ShowModalHint: false,
			chosenPlayer: '',
			profiloId: ''
		};		
		axios.get('/server/players')
		.then((response) => {
			this.setState({
				stories: response['data']
			})
		});
		this.chatVisibility = this.chatVisibility.bind(this);
		this.delete = this.delete.bind(this);
		this.showNavBar = this.showNavBar.bind(this);
		this.closeChat = this.closeChat.bind(this);
		this.changeName = this.changeName.bind(this);
		this.openForm = this.openForm.bind(this);		
		this.showProfilo = this.showProfilo.bind(this);	
		this.closeProfilo = this.closeProfilo.bind(this);
		this.CloseModal = this.CloseModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.downloadPdf = this.downloadPdf.bind(this);
		this.ShowModHint = this.ShowModHint.bind(this);
		this.ChangeHint = this.ChangeHint.bind(this);
		this.sendHint = this.sendHint.bind(this);	
	}
	
	chatVisibility(event){	
	var tmp = this.state.stories;
		var id = event.target.id.split("t")[1];
		var idPlayer = '';
		for(var i = 0; i < tmp.length; i++){
			if(tmp[i]['id'] == 'device' +id){				
				this.setState({
					id: tmp[i]['id']
				})
			} 
		}
		if(!(this.state.showChat == true && this.state.id !=null)){			
			this.setState({
				showChat: !this.state.showChat
			})
		}
	}	
	
	delete(event){
		var tmp = this.state.stories;
		var id = event.target.id.split("s")[1];
		var idPlayer = '';
		for(var i = 0; i < tmp.length; i++){
			if(tmp[i]['id'] == 'device' +id){				
				idPlayer = tmp[i]['id'];	
			} 
		}
		axios.delete('/server/players/'+ idPlayer);
	}	
	
	closeChat(){
		this.setState({
			showChat: !this.state.showChat
		})		
	}
	
	showNavBar(){
		this.setState({
			showNavbar: !this.state.showNavbar
		})
	}
	
	changeName(){
		var newName = document.getElementById('nomeNuovo').value;
		if(newName.length > 0){
			var tmp = this.state.stories;
			var id = this.state.CardId.split("y")[1];
			var idPlayer = '';
			for(var i = 0; i < tmp.length; i++){
				if(tmp[i]['id'] == 'device' +id){				
					idPlayer = tmp[i]['id'];					
					tmp[i]['nickname'] = newName;
				} 
			}
			axios.post('/server/players/'+ idPlayer+ '/name/'+ newName);
			this.setState({
				stories : tmp
			})	
		}		
		this.setState({
			showFormName: !this.state.showFormName
		})			
	}
	
	openForm(e){
		this.setState({
			CardId: e.target.parentNode.parentNode.id,
			showFormName: !this.state.showFormName
		})
	}
	
	showProfilo(event){
		this.setState({
			showAllCards: !this.state.showAllCards,
			profiloId : event.target.id.split("e")[1]
		})
	}
	
	closeProfilo(){
		this.setState({
			showAllCards: !this.state.showAllCards
		})
	}
	
	handleChange(e){	
		this.setState({
			chosenStory: e.target.value
		})
	}
	
	ShowModHint(){		
		var key = this.state.stories[event.target.id]['id'];
		console.log(key)
		this.setState({
			showAllCards: !this.state.showAllCards,
			ShowModalHint: !this.state.ShowModalHint,
			chosenPlayer: key
		})
		
	}
	
	ChangeHint(e){
		this.setState({
			hint: e.target.value
		})	
	}
	
	sendHint(){		
		if(this.state.hint != null){
			this.setState({
				ShowModalHint: !this.state.ShowModalHint,
				showAllCards: !this.state.showAllCards			
			})
			axios.post('/server/players/'+this.state.chosenPlayer+'/evaluator/hint', {
				hint: this.state.hint,
			});
		}
	}
	
	downloadPdf(){
		var tmp = [];
		for(var i = 0; i < this.state.stories.length; i++){
			if(this.state.stories[i]['story'] == this.state.chosenStory){
				tmp.push(this.state.stories[i]);
			}
		}
		
		for(var i = 0; i < tmp.length; i++){
			delete tmp[i].answerToEvaluate;
			delete tmp[i].newMsg;
			delete tmp[i].hint;				
			delete tmp[i].msgSent;
			delete tmp[i].isHintReq;
		}
		const replacer = (key, value) => value === null ? '' : value;
		const header = Object.keys(tmp[0]);
		let csv = tmp.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));		
		csv.unshift(header.join(';'));
		csv = csv.join('\r\n');		
		var a=document.createElement('a');
		a.textContent='download';
		a.download="dataStory.csv";
		a.href='data:text/csv;charset=utf-8,'+escape(csv);
		a.click();
	}
	
	CloseModal(){
		this.setState({			
			showModal: false
		})		
	}
	
	componentDidMount(){
		setInterval(() => {
			axios.get('/server/players')
			.then((response) => {
				
				if((this.state.chosenStory == "" || typeof this.state.chosenStory == "undefined") && response['data'][0]){
					this.setState({
						chosenStory: response['data'][0]['story']
					})
				}
				this.setState({
					stories: response['data']
				},
				function(){
					var tmp = this.state.stories;
						for(var i = 0; i < tmp.length; i++){	
							if(tmp[i]['story'] == this.state.chosenStory){
								if(tmp[i]['timeOnActivity']>=300){
									var addPlayer = this.state.PlayersLocked;
									addPlayer.push(tmp[i]['id']);
									this.setState({
										PlayersLocked: addPlayer,
									});
								}
							}
						}
				})
			});		
		}, 1000);
	}
	
	render() {			
		let FinalElement = [];
		if(this.state.showAllCards && !this.state.showModal)	{
			FinalElement.push(
				<Alert className="jumbotron text-center infobar alert" role="alert">
				{this.state.chosenStory}			
				<i className="far fa-file-csv filePosition"  onClick={() => this.downloadPdf()}></i>
				</Alert>
			)			
			var tmp = this.state.stories;
			var j = 0;
			for(var i = 0; i < tmp.length; i++){	
				if(tmp[i]['story'] == this.state.chosenStory){
					FinalElement.push(
						<Card key={i} className="card colorObject">
						<Card.Body>
						{tmp[i]['isFinished']?<div className="text-center colorRed"><b>Gioco finito <br/> <i className="fas fa-times" id={'Cards'+this.state.stories[i]['id'].split("e")[2]} onClick={(e) => this.delete(e)}>Elimina</i></b></div> : null}	
						{this.state.PlayersLocked[i] && !tmp[i]['isFinished']?<div className="text-center"><i className="fas fa-exclamation-triangle fa-sm mb-3 colorRed ml-3">5 minuti passati</i></div> : null}	
						<Card.Title className="text-center cardTitle" id={'CardKey' + this.state.stories[i]['id'].split("e")[2]}> 
						{ !(this.state.showFormName && document.getElementsByClassName("cardTitle")[j].id == this.state.CardId) ? 
						<div> {tmp[i]['nickname'].length == 0 ? tmp[i]["id"] : tmp[i]['nickname']}
						<i className="fa fa-pencil" id="editicon" onClick={(e) => this.openForm(e)}></i>  </div>  : 
						<FormName name={tmp[i]['nickname'].length == 0 ? tmp[i]["id"] :tmp[i]['nickname']} onChange={this.changeName}/>} 
						{tmp[i]['answerToEvaluate'].length > 0?<div className="colorViolet">risposte da valutare<i className="fas fa-exclamation"></i></div>:<div className="colorViolet">niente da valutare</div>}
						<div className="mt-2"><i className="fa fa-user-circle colorViolet" id={'profile'+this.state.stories[i]['id'].split("e")[2]} onClick={(e) => this.showProfilo(e)}></i></div>
						</Card.Title>				
						<ProgressBar variant="success" className="mb-5 mt-4" id="ProgressBar" now={tmp[i]['isFinished']? 100 : ((tmp[i]['activitiesDone']/tmp[i]['activities'])* 100)}/>
						<div className="text-center">
						<Button variant="warning" className="mr-2" id={'chat'+this.state.stories[i]['id'].split("e")[2]} onClick={(e) => this.chatVisibility(e)} >chat</Button>
						<Button id={i} variant={tmp[i]['isHintReq']? "danger" : "info" } onClick={(e)=>this.ShowModHint(e)}>hint</Button>
						</div>
						</Card.Body>
						</Card>
					)
					j++;
				}
			} 
		} else {
			FinalElement = null;
		}			
		return (	
			<div>		
			<div id="main">
			<div className="page-header  infobar text-center">
			{!(this.state.showModal || this.state.ShowModalHint) && !this.state.showAllCards?<i className="fas fa-arrow-left fa-2x toLeft" onClick={() => this.closeProfilo()}></i>:null}
			<h1 className="noPadding">Valutatore</h1>
			</div>
			<ModalHint show={this.state.ShowModalHint} onClick={this.sendHint} handleChange={this.ChangeHint}/>
			<MyModal show={this.state.showModal} stories={this.state.stories} onClick={this.CloseModal} handleChange={this.handleChange}/>
			{this.state.showAllCards? <div id="cards">{FinalElement}</div> : <div id="infoPlayer">{!(this.state.showModal || this.state.ShowModalHint)?  <Profilo data={this.state.stories}  id={this.state.profiloId}/>  : null} </div>}
			<Chat idAcc={this.state.id} id="chat" onChange={this.closeChat} show={this.state.showChat}/>
			</div>			
			</div>	
		)
	}
}