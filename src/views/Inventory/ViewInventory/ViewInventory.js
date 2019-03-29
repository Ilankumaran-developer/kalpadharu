import React, { Component } from 'react';
import { Button,Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import { Alert } from 'reactstrap';
import {HashLoader} from 'react-spinners';
import { css } from '@emotion/core';

class Inventory extends Component {
  constructor(props)
  {
    super(props);
    this.state={
      products:[],
      currentpage:0 ,
      err:false,
      loading:true
    }
    this.constructInventory = this.constructInventory.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.editInventory = this.editInventory.bind(this);
  }
  
  componentDidMount(){
      try{
        axios.get(`http://localhost:2018/list/Inventory`).then((result)=>{
      console.log('show result',result)
      if(result.status == 200)
      { 

        this.setState({products:result.data, loading: false}) 
      }
      else{
          this.setState({err:true, loading:false});
        }
    })
      } catch(e){
          console.log(e)
      }
    
  }
  editInventory(id){
    this.props.history.push('/add/inventory')
  }
  deleteProduct(val,e){
    console.log(val,e)
    axios.post('http://localhost:2018/deleteProduct',val).then((result)=>{
      console.log(result)
      if(result.status == 200)
      {
        this.setState({products:result.data})
      }
      else{
        this.setState({err:true});
      }
      
        
    })
  }
  constructInventory(){
    let products = []
    let clone = this.state.products
    for(var i  in clone)
    {
      let temp = []
      temp.push(<td>{clone[i].sku}</td>)
      temp.push(<td>{clone[i].quantity}</td>)
      temp.push(<td>{clone[i].total_sales}</td>)
      temp.push(<td>{clone[i].status}</td>)
      temp.push(<td><Button onClick={this.editInventory.bind(this,clone[i]._id)}  color="info">Edit</Button></td>)
      products.push(<tr>{temp}</tr>)
    }
    return products;
  }
  render() {
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
    if(this.state.products.length > 0 && !this.state.loading)
    {
      return (
        <div className="animated fadeIn">
         
         <Alert color="danger" isOpen={this.state.err}>
         There is some error occured in server...Sorry for that
      </Alert>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i>Inventory List
                </CardHeader>
                <CardBody>
                  <Table hover bordered striped responsive size="sm">
                    <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Quantity</th>
                      <th>Total sales</th>
                      <th>Status</th>
                      <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.constructInventory()}
                    
                    </tbody>
                  </Table>
                  <nav>
                    <Pagination>
                      <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                      <PaginationItem active>
                        <PaginationLink tag="button">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                    </Pagination>
                  </nav>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
  
      );
      
    }
    else if(this.state.products.length == 0 && !this.state.loading){
      return (
        <div className="animated fadeIn">
        <Alert color="danger" isOpen={this.state.err}>
         There is some error occured in server...Sorry for that
      </Alert>
          <Row>
            <h1>No Inventory Found</h1>
            </Row>
        </div>
      )
    }
    else if(this.state.loading)
    {
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
   
  }
}

export default Inventory;
