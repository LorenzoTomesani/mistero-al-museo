var Modal = ReactBootstrap.Modal;

class ModalHint extends React.Component{
  constructor(props) {	
    super(props);
    this.state ={
      show: this.props.show
    }  
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.show != this.props.show ){
      this.setState({
        show: this.props.show
      })
    }
  }
  
  render() {	
    if(this.state.show){
      return (	
        <Modal.Dialog>
        <Modal.Header className="text-center">
        <Modal.Title >inserisci suggerimento</Modal.Title>
        </Modal.Header>      
        <Modal.Body>
        <Form.Group>
        <Form.Label column sm="2">
        tips
        </Form.Label>
        <Form.Control type="text" placeholder="suggerimento..." onChange={this.props.handleChange} />
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