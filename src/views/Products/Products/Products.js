import React, { Component } from 'react';
import { Button,Badge, Card, CardBody, CardHeader, Col,  Row, Table } from 'reactstrap';
import axios from 'axios';
import { Alert } from 'reactstrap';
import {HashLoader} from 'react-spinners';
import { css } from '@emotion/core';
import Pagination from '../../common/Pagination/pagination';

class Products extends Component {
  constructor(props)
  {
    super(props);
    this.state={
      products:[],
      currentpage:0 ,
      err:false,
      loading:true,
      pageOfItems : []
    }
    this.constructProduct = this.constructProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
  }
  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
}
  componentDidMount(){
    axios.get(`http://localhost:2018/show`).then((result)=>{
      console.log('show result',result)
      if(result.status == 200)
      { 

        this.setState({products:result.data, loading: false}) 
      }
      else{
          this.setState({err:true, loading:false});
        }
    })
  }
  editProduct(id){
    this.props.history.push('/edit/product/'+id)
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
  constructProduct(){
    let products = []
    let clone = this.state.pageOfItems
    for(var i  in clone)
    {
      let temp = []
      temp.push(<td>{clone[i].productname}</td>)
      temp.push(<td>{clone[i].sku}</td>)
      temp.push(<td>{clone[i].status}</td>)
      temp.push(<td>{clone[i].date_created}</td>)
      temp.push(<td>{clone[i].cost_price}</td>)
      temp.push(<td>{clone[i].selling_price}</td>)
      temp.push(<td><Button onClick={this.editProduct.bind(this,clone[i]._id)}  color="info">Edit</Button></td>)
      temp.push(<td><Button onClick={this.deleteProduct.bind(this,clone[i])} color="danger">Delete</Button></td>)
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
                  <i className="fa fa-align-justify"></i>Products List
                </CardHeader>
                <CardBody>
                  <Table hover bordered striped responsive size="sm">
                    <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>status</th>
                      <th>Date Added</th>
                      <th>Cost price (per kg)</th>
                      <th>Selling Price (per kg)</th>
                      <th>Action</th>
                      <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.constructProduct()}
                    
                    </tbody>
                  </Table>
                  <nav>
                    <Pagination items={this.state.products} onChangePage={this.onChangePage} />
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
            <h1>No Products Found</h1>
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

export default Products;
