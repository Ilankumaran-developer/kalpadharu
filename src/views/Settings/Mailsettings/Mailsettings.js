import React, { Component } from 'react';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import axios from 'axios';
import { Redirect, Route, Switch } from 'react-router-dom';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.fromAddressChange = this.fromAddressChange.bind(this);
    this.serviceNameChange = this.serviceNameChange.bind(this);
    this.hostChange = this.hostChange.bind(this);
    this.usernameChange = this.usernameChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
    this.addmailsettings = this.addmailsettings.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      fromAddress:'',
      service_name:'',
      host_name:'',
      user_name:'',
      password: ''
    };
  }
  componentDidMount()
  {
    axios.get('http://localhost:2018/getConfig').then((result)=>{
      console.log(result)
      if(result.status == 200)
      {
        if(result.data.length > 0)
        {
          let data = result.data[result.data.length-1]
          this.setState({
          fromAddress: data.from,
          service_name : data.service,
          host_name : data.host,
          user_name : data.username,
          password : data.password
        })
        }
        else{
          this.setState({
            fromAddress:result.data.from,
            service_name : result.data.service,
            host_name : result.data.host,
            user_name : result.data.username,
            password : result.data.password
          })
        }
        
      }
    })
  }
 
  fromAddressChange(event){
    this.setState({fromAddress:event.target.value})
  }
  serviceNameChange(event){
    this.setState({service_name:event.target.value})
  }
  hostChange(event){
    this.setState({host_name: event.target.value})
  }
  usernameChange(event){
    this.setState({user_name: event.target.value})
  }
  passwordChange(event){
    this.setState({password: event.target.value})
  }
  addmailsettings(event){
    event.preventDefault();
    let payload = {};
    payload.from = this.state.fromAddress;
    payload.service = this.state.service_name;
    payload.host = this.state.host_name;
    payload.username = this.state.user_name;
    payload.password = this.state.password;
    console.log(payload);
    axios.post('http://localhost:2018/saveMailsettings',payload).then((result)=>{
      
      console.log(result)
    })
  }


  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    return (
      <div className="animated fadeIn">
        
        <Row>
          <Col xs="12" md="6">
            <Card>
              <CardHeader>
                <strong>Mail Settings</strong>
              </CardHeader>
              <CardBody>
                <Form  onSubmit={this.addmailsettings}  encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">From Mail</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" value={this.state.fromAddress} onChange={this.fromAddressChange} id="text-input" name="text-input" placeholder="From Mail" />
                      <FormText color="muted">Ex: ilan@gmail.com</FormText>
                    </Col>
                  </FormGroup>
                                   
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Service Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" value={this.state.service_name} onChange={this.serviceNameChange} id="text-input" name="text-input" placeholder="Service Name" />
                    <FormText color="muted">Ex: gmail</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Host</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" value={this.state.host_name} onChange={this.hostChange} id="text-input" name="text-input" placeholder="host name" />
                      <FormText color="muted">Ex: smtp.gmail.com</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Username</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" value={this.state.user_name} onChange={this.usernameChange} id="text-input" name="text-input" placeholder="Username" />
                      <FormText color="muted">Ex: ilan@gmail.com</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="password" value={this.state.password} onChange={this.passwordChange} id="text-input" name="text-input" placeholder="Password" />

                    </Col>
                  </FormGroup>
                  
               
                  
              <CardFooter>
                        <Button type="submit" color="primary">Submit</Button>
                        
                      </CardFooter>
                </Form>
              </CardBody>
              
            </Card>
            
          </Col>
          
        </Row>
      
               
      </div>
    );
  }
}

export default Forms;
