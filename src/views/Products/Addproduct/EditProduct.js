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
    this.editproduct = this.editproduct.bind(this);
    this.namechange = this.namechange.bind(this);
    this.descriptionchange = this.descriptionchange.bind(this);
    this.costpricechange = this.costpricechange.bind(this);
    this.spchange = this.spchange.bind(this)
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      name:'',
      description:'',
      cost_price:0.00,
      selling_price:0,
      id:this.props.match.params.id
    };
  }
  componentDidMount(){
    axios.post(`https://kalpatharu-backend.herokuapp.com/showbyid`,{id:this.state.id}).then((result)=>{
        console.log(result.data)
   this.setState({name:result.data.productname})
   this.setState({description:result.data.description})
   this.setState({cost_price:result.data.cost_price})
   this.setState({selling_price:result.data.selling_price})
    
      })
  }
  editproduct(event){
    event.preventDefault();
    console.log(this.state)
    let payload = {}
    payload.productname = this.state.name;
    payload.description = this.state.description;
    payload.cost_price = this.state.cost_price;
    payload.selling_price = this.state.selling_price;
    payload.id = this.state.id
    axios.post(`https://kalpatharu-backend.herokuapp.com/update`,payload).then((result)=>{
      console.log(result)
      if(result.status == 200)
      {
        this.setState({name:result.productname})
        this.setState({description:result.description})
        this.setState({cost_price:result.cost_price})
        this.setState({selling_price:result.selling_price})
        
        this.props.history.push('/list/products')
      }
      console.log(result)
    })
  }
  namechange(event){
    this.setState({name:event.target.value})
  }
  descriptionchange(event){
    this.setState({description:event.target.value})
  }
  costpricechange(event){
    this.setState({cost_price: event.target.value})
  }
  spchange(event){
    this.setState({selling_price: event.target.value})
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
                <strong> Edit a product</strong>
              </CardHeader>
              <CardBody>
                <Form  onSubmit={this.editproduct}  encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Name of the product</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" value={this.state.name} onChange={this.namechange} id="text-input" name="text-input" placeholder="Product Name" />
                      <FormText color="muted">Enter the name of the product</FormText>
                    </Col>
                  </FormGroup>
                                   
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" name="textarea-input" value={this.state.description} onChange={this.descriptionchange} id="textarea-input" rows="9"
                             placeholder="Description of the product" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Cost price of the product</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number" id="text-input" name="text-input" value={this.state.cost_price} onChange={this.costpricechange} placeholder="Cost Price" />
                      <FormText color="muted">Enter the cost price of the product</FormText>
                    </Col>
                  </FormGroup>
                  
                  
                  <FormGroup>
                        <Label htmlFor="appendedPrependedInput">Selling Price of the product</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                           
                            <Input  id="appendedPrependedInput" size="16" type="number" value={this.state.selling_price} onChange={this.spchange} />
                            
                          </InputGroup>
                        </div>
                      </FormGroup>
                  <FormGroup row hidden>
                    <Col md="3">
                      <Label className="custom-file" htmlFor="custom-file-input">Custom file input</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Label className="custom-file">
                        <Input className="custom-file" type="file" id="custom-file-input" name="file-input" />
                        <span className="custom-file-control"></span>
                      </Label>
                    </Col>
                  </FormGroup>
                  
              <CardFooter>
                        <Button type="submit" color="primary">Edit</Button>
                        
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
