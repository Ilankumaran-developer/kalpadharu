import React, { Component } from 'react';
import {
  Alert,
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
  Table,
} from 'reactstrap';
import axios from 'axios';
import { Redirect, Route, Switch } from 'react-router-dom';
import Tables from '../../Base/Tables/Tables';
import { parse } from 'path';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.addproduct = this.addproduct.bind(this);
    this.namechange = this.namechange.bind(this);
    this.unitchange = this.unitchange.bind(this);
    this.generateBill = this.generateBill.bind(this);
    this.userchange = this.userchange.bind(this);
    this.service_charge_change = this.service_charge_change.bind(this)
    this.onDismiss = this.onDismiss.bind(this);
   // this.removeitem = this.removeitem.bind(this)
    
    
   
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
     products:[],
     transaction:[],
     product_id:'',
     unit_price:0,
     selling_price_per_kg:0,
     selling_price:0,
     productname:'',
     user:'',
     service_charge:0,
     grand_total:0,
     cost_price:0,
     alert:false
    };
  }
  componentDidMount(){
    axios.get(`http://localhost:2018/show`).then((result)=>{
      console.log(result)
      this.setState({
        products:result.data
      })
      //console.log(this.state.products)

    })
  }
  onDismiss(){
    this.setState({alert:false})
  }
 
  constructProduct(){
    let products = []
    let clone = this.state.products
    for(var i  in clone)
    {
      let temp = []
      products.push(<option value={clone[i]._id} >{clone[i].productname}</option>)
      
    }
    return products;
  }
  removeitem(index){
    console.log(index)
    let temp = [];
    temp = this.state.transaction;
    delete temp[index];
    this.setState({
      transaction:temp
    })
  }
  addproduct(event){
    event.preventDefault();
    let temp = [];
    temp = this.state.transaction;
    let profit  = parseFloat(this.state.selling_price) - parseFloat(this.state.cost_price);
    temp.push({
        product_name : this.state.productname,
        unit:this.state.unit_price,
        selling_price:this.state.selling_price,
        cost_price:this.state.cost_price,
        profit:profit,
        product_id:this.state.product_id
    })
    
    this.setState({transaction:temp})
  this.setState({product_id:''})
  this.setState({unit_price:0})
  this.setState({selling_price:0});
  this.setState({cost_price:0});
  let tot = 0;
  for(let i in this.state.transaction)
  {
    tot = parseFloat(tot) + parseFloat(this.state.transaction[i].selling_price)
  }
  tot = parseFloat(tot).toFixed(2)
    this.setState({grand_total:tot})
  }
  unitchange(event)
  {
      event.preventDefault();
      this.setState({
        unit_price : event.target.value
      })
      console.log(this.state.selling_price_per_kg)
      let sp = this.state.selling_price_per_kg * parseFloat(event.target.value) 
      this.setState({
          selling_price: sp
      })
  }
  namechange(event){
    event.preventDefault();
   
    for(let i in this.state.products)
    {
        if(this.state.products[i]._id == event.target.value)
        {
            this.setState({selling_price_per_kg:this.state.products[i].selling_price})
            this.setState({cost_price:this.state.products[i].cost_price});
            this.setState({productname:this.state.products[i].productname})
        }
    }
    this.setState({product_id:event.target.value})
    }
    userchange(event){
      this.setState({user:event.target.value})
    }
    generateBill(event)
    {
      event.preventDefault();
      
      let payload ={};
      payload.user = this.state.user;
      payload.transaction = this.state.transaction;
      payload.service_tax = parseFloat(this.state.service_charge).toFixed(2);
      payload.total = parseFloat(this.state.grand_total) - parseFloat(this.state.service_charge);
      let totprofit = 0;
      payload.product_ids = [];
      for(let i in this.state.transaction)
      {
        totprofit = parseFloat(totprofit) + parseFloat(this.state.transaction[i].profit)
        payload.product_ids.push(this.state.transaction[i].product_id)

      }
      payload.profit = totprofit;
      payload.grand_total = parseFloat(this.state.grand_total).toFixed(2);
      console.log(payload)
      axios.post('http://localhost:2018/saveTransaction',payload).then((result)=>{
      this.setState({alert:true})
      })

    }
    service_charge_change(event){
      if(event.target.value && !isNaN(event.target.value))
      {
        this.setState({service_charge:event.target.value})
        let grtot = 0;
        for(let i in this.state.transaction)
        {
          grtot = parseFloat(grtot) + parseFloat(this.state.transaction[i].selling_price)
        }
        grtot = parseFloat(grtot) + parseFloat(event.target.value)
        grtot = parseFloat(grtot).toFixed(2);
        this.setState({grand_total:grtot});
      }
   
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
                <strong>Add a new line item into transaction</strong>
              </CardHeader>
              <CardBody>
                <Form  onSubmit={this.addproduct}  encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Select the name of the product</Label>
                    </Col>
                    <Col xs="12" md="9" size="lg">
                      <Input onChange={this.namechange} type="select" name="selectLg" id="selectLg" bsSize="lg">
                        <option value="0">Please Select</option>
                        {this.constructProduct()}
                      </Input>
                    </Col>
                  </FormGroup>
                                   
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Unit (kg/l)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number"  id="text-input" name="text-input" value={this.state.unit_price} onChange={this.unitchange} placeholder="Unit" />
                      <FormText color="muted">Select the number of kg or litre</FormText>
                    </Col>
                  </FormGroup>
                  
                  
                  <FormGroup>
                        <Label htmlFor="appendedPrependedInput">Selling Price of the product</Label>
                        <div className="controls">
                            <span>{this.state.selling_price}</span>
                        </div>
                      </FormGroup>
                  
                  
              <CardFooter>
                        <Button type="submit" color="primary">Add Item</Button>
                        
                      </CardFooter>
                </Form>
              </CardBody>
              
            </Card>
            <Card>
              <CardHeader>
                <strong>User Info</strong>
              </CardHeader>
              <CardBody>
                <Form  onSubmit={this.generateBill}  encType="multipart/form-data" className="form-horizontal">
                  
                  
                                   
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Name/Mobile/Email of the user</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text"  id="text-input" name="text-input" value={this.state.user} onChange={this.userchange} placeholder="username/mobile/email" />
                      <FormText color="muted">Enter mobile number/name/email of user</FormText>
                    </Col>
                  </FormGroup>


                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Service charge (GST) if any</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number"  id="text-input" min="0" name="text-input" value={this.state.service_charge} onChange={this.service_charge_change} placeholder="Service charge" />
                      <FormText color="muted">Enter the service charge</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Grand Total</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <span>{this.state.grand_total}</span>
                    </Col>
                  </FormGroup>
                  
                  
                 
                  
                  
              <CardFooter>
                        <Button type="submit" color="primary">Generate Bill</Button>
                        
                      </CardFooter>
                      <Alert color="info" isOpen={this.state.alert} toggle={this.onDismiss}>
                  Transaction successfully saved!
                </Alert>
                </Form>
              </CardBody>
              
            </Card>
            
          </Col>
          <Col xs="12" md="6">
          <Card>
              <CardHeader>
                <strong>Consolidated list of product</strong>
              </CardHeader>
              
              <CardBody>
                <Table>
                <thead>
                    <tr>
                      <th>Items</th>
                    
                      <th>Unit </th>
                      <th>Selling Price</th>
                      
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.transaction.map((item,i)=>{
                      return[
                        <tr>
                          <td>{item.product_name}</td>
                          <td>{item.unit}</td>
                          <td>{item.selling_price} <Button  color="danger" onClick={this.removeitem.bind(this,i)} size="sm" className="btn-pill">Remove</Button></td>
                        </tr>
                      ]
                    })}
                        </tbody>
                </Table>
               
                  </CardBody>
                  </Card>
          </Col>
          
        </Row>
      
               
      </div>
    );
  }
}

export default Forms;
