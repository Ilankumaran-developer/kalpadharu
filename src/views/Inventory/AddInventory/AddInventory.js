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
import {HashLoader} from 'react-spinners';
import {css} from '@emotion/core';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.skuChange = this.skuChange.bind(this);
    this.listSKUs = this.listSKUs.bind(this);
    this.quantityChange = this.quantityChange.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.statusChange = this.statusChange.bind(this);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      loading:true,
      products: [],
      err: false,
      sku:'',
      listStatus : '',
      quantity : 0,
      total_sales: 0,
      inventoryId : 0,
      productID:0
    };
  }
  componentDidMount(){
    axios.get(`http://localhost:2018/show`).then((result)=>{
        this.setState({loading: false})
        console.log(result)
        if(result.data.length != 0){

            this.setState({products : result.data});
        }
        
    })
  }
  statusChange(event){
      //event.preventDefault();
      this.setState({listStatus: event.target.value})
  }
  updateInventory(event){
    event.preventDefault();
    this.setState({loading:true})
    console.log(this.state.sku, this.state.listStatus, this.state.quantity)
    if(this.state.listStatus != '' && this.state.sku != ''){
        let payload = {};
        payload.id = this.state.inventoryId;
        payload.status = this.state.listStatus;
        payload.sku = this.state.sku;
        payload.quantity = this.state.quantity;
        payload.productID = this.state.productID;
        axios.post('http://localhost:2018/updateInventory',payload).then((result)=>{
            this.setState({loading:false})
            if(result.status == 200){
                alert('Updated Successfully');
            }
            else{
                alert('There should be some issue with system...sorry for inconvenience');
            }
        })
    }
    else{
      alert('Kindly select the status')
    }
  }
  quantityChange(event){
    event.preventDefault();
    this.setState({quantity: event.target.value});
  }
  setOptions(){
 
    let statuses = [{'name':"in_stock", "value":"In Stock"},{'name':"out_of_stock", "value":"Out Of Stock"}]
               let optionItems = statuses.map((status) =>
                <option value={status.name}>{status.value}</option>
                );
             return optionItems;
  }
  skuChange(event){
      if(!event.target.value == "0"){
        let products = this.state.products
        this.setState({sku : event.target.value})
        for(var i  in products)
        {
        
          if(products[i].sku == event.target.value)
            this.setState({productID:products[i]._id})
          
        }
        axios.get(`http://localhost:2018/get/Inventory?sku=${event.target.value}`).then((result)=>{
            console.log('inventory data',result)
            if(result.data.length != 0)
            {   
                this.setState({quantity: result.data[0].quantity});
               this.setState({total_sales:result.data[0].total_sales});
               this.setState({listStatus:result.data[0].status}) 
               this.setState({inventoryId: result.data[0]._id})
            }else{
               
               this.setState({quantity: 0});
               this.setState({total_sales:0})
               this.setState({listStatus:''})
               
            }
        })
      }
      
      
  }
  listSKUs(){
    let skus = []
    let products = this.state.products
    for(var i  in products)
    {
    
      skus.push(<option value={products[i].sku} >{products[i].sku}</option>)
      
    }
    return skus;
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
      if(!this.state.loading && this.state.products.length > 0){
    return (
      <div className="animated fadeIn">
        <Alert color="danger" isOpen={this.state.err}>
         There is some error occured in server...Sorry for that
      </Alert>
        <Row>
          <Col xs="12" md="6">
            <Card>
              <CardHeader>
                <strong>Add or Edit Inventory</strong>
              </CardHeader>
              <CardBody>
                <Form  onSubmit={this.updateInventory}  encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Choose SKU</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input  id="text-input" name="text-select" type="select" value={this.state.sku} onChange={this.skuChange} placeholder="Choose SKU" >
                    <option value="0">Please Select</option>
                    
                      {this.listSKUs()}
                      </Input>
                    </Col>
                  </FormGroup>
                                   
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="textarea-input">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                    {this.listStatus}
                    <Input  id="text-input" name="text-select" value={this.listStatus} onChange={this.statusChange} type="select"  placeholder="Choose Status" >
                    <option value="">Please Select</option>
                    
                      {this.setOptions()}
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Quantity</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number" id="text-input" name="text-input" value={this.state.quantity} onChange={this.quantityChange} placeholder="Quantity" />
                     
                    </Col>
                  </FormGroup>

                  <FormGroup>
                        <Label htmlFor="appendedPrependedInput">Total Sales since the product added</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                          <Label >{this.state.total_sales}</Label>
                            
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
      }else if(this.state.loading){
        return (
            <div className="animated fadeIn">
             <HashLoader
                css={override}
                sizeUnit={"px"}
                size={150}
                color={'#123abc'}
                loading={this.state.loading}
              /> 
            </div>
            )
      }
      else if(!this.state.loading && this.state.products.length == 0){
          return(
            <div className="animated fadeIn">
          <h3>Hey Buddy, there seems to be no products are added into system yet.., can you please add products and get back here ??? sorry for inconvenience</h3>
           </div>
          )
      }
  }
}

export default Forms;
