import React, { Component } from 'react';
import { Button,Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';

class Products extends Component {
  constructor(props)
  {
    super(props);
    this.state={
      products:[],
      currentpage:0 
    }
    this.constructProduct = this.constructProduct.bind(this);
  }
  componentDidMount(){
    axios.get(`http://localhost:2018/show`).then((result)=>{
      
      this.setState({
        products:result.data
      })
      console.log(this.state.products)

    })
  }
  constructProduct(){
    let products = []
    let clone = this.state.products
    for(var i  in clone)
    {
      let temp = []
      temp.push(<td>{clone[i].productname}</td>)
      temp.push(<td>{clone[i].date_created}</td>)
      temp.push(<td>{clone[i].cost_price}</td>)
      temp.push(<td>{clone[i].percentage}</td>)
      temp.push(<td><Button color="info">Edit</Button></td>)
      temp.push(<td><Button color="danger">Delete</Button></td>)
      products.push(<tr>{temp}</tr>)
    }
    return products;
  }
  render() {
    
    return (
      <div className="animated fadeIn">
       

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
                    <th>Date Added</th>
                    <th>Cost price (per kg)</th>
                    <th>Profit Percentage</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.constructProduct()}
                  
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
}

export default Products;
