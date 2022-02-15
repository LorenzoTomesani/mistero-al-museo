var Form = ReactBootstrap.Form;

class FormName extends React.Component{
  constructor(props) {		
    super(props);
    this.state = {
      name: this.props.name
    }	
  }
render() {
      return (
        <Form.Group>
        <Form.Control type="text" placeholder={this.state.name} id="nomeNuovo"/>
        <i className="fa fa-check" onClick={this.props.onChange}></i>
        </Form.Group>
      )
  } 
}
