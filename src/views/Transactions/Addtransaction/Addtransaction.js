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
  Table,
} from 'reactstrap';
import axios from 'axios';
import { Redirect, Route, Switch } from 'react-router-dom';
import Tables from '../../Base/Tables/Tables';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.addproduct = this.addproduct.bind(this);
    this.namechange = this.namechange.bind(this);
    this.unitchange = this.unitchange.bind(this);
    this.constructTransaction = this.constructTransaction.bind(this);
    
   
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
     products:[],
     transaction:[],
     product_id:'',
     unit_price:'',
     selling_price_per_kg:0,
     selling_price:0
    };
  }
  componentDidMount(){
    axios.get(`http://localhost:2018/show`).then((result)=>{
      
      this.setState({
        products:result.data
      })
      //console.log(this.state.products)

    })
  }
  constructTransaction(){
    let trans = []
    let clone = this.state.transaction
    for(var i  in clone)
    {
      let temp = []
      temp.push(<td>{clone[i].product_id}</td>)
      temp.push(<td>{clone[i].unit}</td>)
      
      temp.push(<td>{clone[i].selling_price}</td>)
    
    }
    return trans;
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
  addproduct(event){
    event.preventDefault();
    let temp = [];
    temp.push({
        product_id : this.state.product_id,
        unit:this.state.unit_price,
        selling_price:this.state.selling_price
    })
    this.setState({transaction:temp})
    
  }
  unitchange(event)
  {
      event.preventDefault();
      this.setState({
        unit_price : event.target.value
      })
      let sp = this.selling_price_per_kg * parseFloat(this.state.unit_price) 
      this.setState({
          selling_price: sp
      })
  }
  namechange(event){
    event.preventDefault();
    console.log(event.target.value)
    for(let i in this.state.products)
    {
        if(this.state.products[i]._id == event.target.value)
        {
            this.setState({selling_price_per_kg:this.state.products[i].selling_price})
        }
    }
    this.setState({product_id:event.target.value})
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
                <strong>Add a new item into transaction</strong>
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
                            <span></span>
                        </div>
                      </FormGroup>
                  
                  
              <CardFooter>
                        <Button type="submit" color="primary">Add Item</Button>
                        
                      </CardFooter>
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
                    {this.constructTransaction()}
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
