var Button = ReactBootstrap.Button;
var Form = ReactBootstrap.Form;

class Chat extends React.Component{
	constructor(props) {	
		super(props);
		this.state ={
			idAcc: this.props.idAcc,
			show: this.props.show,
			newMsg: ""
		}
		this.sendMessage = this.sendMessage.bind(this);
	}
	
	componentDidUpdate(prevProps, prevState) {
		if(prevProps.show != this.props.show ){
			this.setState({
				show: this.props.show
			})
		}
		if(prevProps.idAcc != this.props.idAcc ){
			this.setState({
				idAcc: this.props.idAcc
			})
			if(prevProps.idAcc != '' && prevProps.idAcc != null){
				document.getElementById("history").value = "";
			}
		}
	}
	
	componentDidMount() {
		setInterval(
			() => {
				axios.get('http://site192031.tw.cs.unibo.it/server/players/'+ this.props.idAcc + "/evaluator/msg")
				.then((data) => {			
					if(data.data != null || data.data.length > 0){
						for(var i = 0; i < data.data.length; i++){
							document.getElementById("history").value += "player:" +data.data[i] +"\n";    
						}
					}					
				});
			} , 1000); 
		} 
		
		async sendMessage(){
			await this.setState({
				newMsg: document.getElementById("msgToSend").value
			});
			document.getElementById("history").value += "valutatore:" +  this.state.newMsg + "\n"; 		
			document.getElementById("msgToSend").value="";
			const data = axios({
				method: 'post',
				type: 'text',
				url: '/server/players/'+ this.props.idAcc + "/evaluator/msg",
				data: { 'msg': this.state.newMsg}
			})
			
		}
		
		render() {	
			if(this.state.show){
				return (	
					<div className="chat-container colorObject text-center">
					<h2>{this.state.idAcc}</h2>	
					<Form.Control as="textarea" id="history" readOnly/>
					<Form.Control as="textarea" id="msgToSend" name="msgToSend" />	
					<Button variant="success" className="buttonMsg" onClick={this.sendMessage}>Send</Button>
					<Button variant="danger" className="buttonMsg" onClick={this.props.onChange}>Close</Button>
					</div>				
				) 
			} else {
				return null;
			}
		}	
	}