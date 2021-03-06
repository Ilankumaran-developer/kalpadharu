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
import { Alert } from 'reactstrap';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.addproduct = this.addproduct.bind(this);
    this.namechange = this.namechange.bind(this);
    this.descriptionchange = this.descriptionchange.bind(this);
    this.costpricechange = this.costpricechange.bind(this);
    this.percentagechange = this.percentagechange.bind(this)
    this.unitChange = this.unitChange.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      name:'',
      description:'',
      cost_price:0.00,
      percentage:0,
      min_unit:0,
      err: false
    };
  }
  componentDidMount(){
    let fn = {
      cors: function(){
        
        if(this.state.loading)
          alert('seems like CORS is stopping you to contact server....kindly turn on or reset the CORS plugin on your browser and reload')
      }
    }
    let c = fn.cors.bind(this)
    setTimeout(function(){
      c()
    }, 4000)
  }
  addproduct(event){
    event.preventDefault();
    console.log(this.state)
    let payload = {}
    payload.productname = this.state.name;
    payload.description = this.state.description;
    payload.cost_price = this.state.cost_price;
    payload.selling_price = this.state.percentage;
    payload.min_unit = this.state.min_unit;
    payload.status = "out_of_stock";
    axios.post(`http://localhost:2018/save`,payload).then((result)=>{
      console.log(result)
      if(result.status == 200)
      {
        this.props.history.push('/list/products');
      }
      else{
        this.setState({err:true});
      }
        
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
  percentagechange(event){
    this.setState({percentage: event.target.value})
  }
  unitChange(event){
    this.setState({min_unit: event.target.value})
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
        <Alert color="danger" isOpen={this.state.err}>
         There is some error occured in server...Sorry for that
      </Alert>
        <Row>
          <Col xs="12" md="6">
            <Card>
              <CardHeader>
                <strong>Add a new product</strong>
              </CardHeader>
              <CardBody>
                <Form  onSubmit={this.addproduct}  encType="multipart/form-data" className="form-horizontal">
                  
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
                        <Label htmlFor="appendedPrependedInput">Minimum unit of the product</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                           
                            <Input  id="appendedPrependedInput" size="16" type="number" value={this.state.min_unit} step="0.1" onChange={this.unitChange} />
                            
                          </InputGroup>
                        </div>
                      </FormGroup>
                  
                  
                  <FormGroup>
                        <Label htmlFor="appendedPrependedInput">Selling Price of the product</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                           
                            <Input  id="appendedPrependedInput" size="16" type="number" value={this.state.percentage} onChange={this.percentagechange} />
                            
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
