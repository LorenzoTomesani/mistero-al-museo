var Modal = ReactBootstrap.Modal;

class MyModal extends React.Component{
  constructor(props) {	
    super(props);
    this.state ={
      show: this.props.show,
      stories: this.props.stories,
      FinalOption:[],
    }  
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.show != this.props.show ){
      this.setState({
        show: this.props.show
      })
    }
    if(prevProps.stories != this.props.stories ){
      this.setState({
        stories: this.props.stories
      })
    }
  }

render() {	
  if(this.state.show){
    let stories = this.state.stories;
    let FinalOption = [];
    let tmp = [];
	  stories.forEach(function(value){
		    if (tmp.indexOf(value['story'])==-1) tmp.push(value['story']);
	     });
     
    for(var i = 0; i < tmp.length; i++){
      FinalOption.push(
          <option key={"value"+i}>{tmp[i]}</option>
      )
    }
    return (	
      <Modal.Dialog>
      <Modal.Header className="text-center">
      <Modal.Title >Scegli Storia</Modal.Title>
      </Modal.Header>      
      <Modal.Body>
      <Form.Group >
      <Form.Label>Storie</Form.Label>
      <Form.Control id="selectStories" as="select" onChange={this.props.handleChange}>
        {FinalOption}
      </Form.Control>
      </Form.Group>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="success" onClick={this.props.onClick}>Ok</Button>
      </Modal.Footer>
      </Modal.Dialog>
    ) 
  } else {
    return null;
  }
}	
}