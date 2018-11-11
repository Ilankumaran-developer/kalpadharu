import React, { Component } from 'react';
import { Button,Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';

class Products extends Component {
  constructor(props)
  {
    super(props);
    this.state={
      products:[]
    }
  }
  componentDidMount(){
    axios.get(`http://localhost:2018/show`).then((result)=>{
      console.log(result)
      this.setState({
        products:result
      })

    })
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
                  <tr>
                    <td>Coconut Oil</td>
                    <td>2012/01/01</td>
                    <td>10</td>
                    <td>10 %</td>
                    <td><Button block color="primary">edit</Button><Button block color="secondary">Delete</Button></td>
                    <td>
                      <Badge color="success">Active</Badge>
                    </td>
                  </tr>
                  
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
