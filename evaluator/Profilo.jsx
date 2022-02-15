const Alert = ReactBootstrap.Alert;
const ProgressBar = ReactBootstrap.ProgressBar;
const Form = ReactBootstrap.Form;
const Card = ReactBootstrap.Card;

class Profilo extends React.Component{
	constructor(props) {	
		super(props);
	    for(var i = 0; i < this.props.data.length; i++){
			if(this.props.data[i]['id'] == 'device' + this.props.id){				
				this.state ={
					data: this.props.data[i]
				}
			}
		}
		this.sendAnswer = this.sendAnswer.bind(this);
	}
	
	componentDidUpdate(prevProps, prevState) {
		if(prevProps.data != this.props.data ){
			for(var i = 0; i < this.props.data.length; i++){
				if(this.props.data[i]['id'] == 'device' + this.props.id){				
					this.setState({
						data: this.props.data[i]
					})
				}
			}
		}
	}
	
	sendAnswer(e){
		var idQuestion = e.target.id;
		var point = document.getElementById("scoreToSend").value;
		console.log(idQuestion);
		axios.post('/server/players/device'+ this.props.id +'/points',
		{
			idQ: idQuestion,
			points: point
		}
		)
	}

render() {
	let Element = [];	
	var complete = 0;
	var tmp = this.state.data['answerToEvaluate'];		
	complete= Math.round(this.state.data['activitiesDone']/this.state.data['activities'] * 100);
	if(this.state.data['isFinished']){ complete = 100;}
	for(var j in tmp ){		
		Element.push(
			<Card className="text-center">
			<Card.Header>Valuta</Card.Header>
			<Card.Body>
			<Card.Title className="colorRed"><h6> Domanda: {tmp[j]['question']} </h6></Card.Title>	
			<b> Risposta: </b>
			{
			tmp[j]['answer']? tmp[j]['answer'] : 
			<a href={'/server/file/' + tmp[j]['urlFile']} target="_blank">
			<button type="button "className="btn btn-primary"><i className="fa fa-download">Download</i></button>
			</a>
			}
			<Form.Group>
			<Form.Label>Scegli il punteggio</Form.Label>
			<input type="number" id="scoreToSend" defaultValue="0" step="1"/>			
			</Form.Group>
			<Button variant="primary" id={tmp[j]['idQ']} onClick={(e)=>this.sendAnswer(e)}>Ok</Button>
			</Card.Body>
			</Card>);
		}
		return (	
			<div>			
			<Alert className="jumbotron text-center infobar alert blueBorder profile" role="alert">{this.state.data['id']}</Alert>			
			<div className="BarProfile mt-5"> 
			<span className="spanPercentuale">
			Percentuale Completata:
			</span>
			<ProgressBar variant="success" className="progressWidth mt-2" now={complete} label={complete+"%"} />
			</div>
			<div className="mt-4 BarProfile"> 
			<span className="spanPercentuale">
			Tempo impiegato: {this.state.data['totalTime'] + "s"}
			</span>	
			</div>					
			<div className="mt-4 BarProfile"> 	
			<span className="spanPercentuale">
			Attività corrente: {this.state.data['currentActivity']}
			</span>					
			</div>	
			<div className="mt-4 BarProfile"> 		
			<span className="spanPercentuale">
				Punti ottenuti: {this.state.data['totalPoints']}
			</span>					
			</div>		
			{this.state.data['answerToEvaluate'].length > 0? <div className="mt-4 BarProfile"> 
			<span className="spanPercentuale">
			Risposte Da valutare:
			</span>
			<div className="AnswerToEval mt-3">
			{Element}
			</div>
			</div> : 
			null}
			</div>								
		) 
	}	
}