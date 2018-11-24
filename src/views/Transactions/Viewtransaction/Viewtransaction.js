import React, { Component } from 'react';
import { Button,Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';

class Products extends Component {
  constructor(props)
  {
    super(props);
    this.state={
      transactions:[],
      currentpage:0 
    }
    this.constructHistory = this.constructHistory.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.editTransaction = this.editTransaction.bind(this);
    this.viewInvoice  = this.viewInvoice.bind(this);
  }
  componentDidMount(){
    axios.get(`http://localhost:2018/showtransactions`).then((result)=>{
      console.log(result)
      this.setState({
        transactions:result.data
      })
      //console.log(this.state.products)

    })
  }
  editTransaction(id){
    this.props.history.push('/edit/transaction/'+id)
  }
  viewInvoice(id){
    this.props.history.push('/view/Invoice/'+id)
  }
  deleteTransaction(val,e){
    console.log(val,e)
    let url = process.env.url+'/deleteTransaction';
    axios.post(url,val).then((result)=>{
      console.log(result)
      this.setState({
        transactions:result.data
      })
    })
  }
  constructHistory(){
    let transactions = []
    let clone = this.state.transactions
    for(var i  in clone)
    {
      let temp = []
      temp.push(<td>{clone[i].user}</td>)
      temp.push(<td>{clone[i].date_created}</td>)
      temp.push(<td>{clone[i].grand_total}</td>)
      temp.push(<td>{clone[i].profit}</td>)
      temp.push(<td>{clone[i].service_tax}</td>)
      temp.push(<td><Button onClick={this.editTransaction.bind(this,clone[i]._id)} color="info">View Transaction</Button><Button onClick={this.viewInvoice.bind(this,clone[i]._id)}  color="info">View Invoice</Button></td>)
      
      transactions.push(<tr>{temp}</tr>)
    }
    return transactions;
  }
  render() {
    if(this.state.transactions.length > 0)
    {
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
                      <th>User</th>
                      <th>Date Added</th>
                      <th>Grand total</th>
                      <th>
                        Profit
                      </th>
                      <th>Service Tax</th>
                      <th>Action</th>
                     
                    </tr>
                    </thead>
                    <tbody>
                    {this.constructHistory()}
                    
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
    else{
      return (
        <div className="animated fadeIn">
          <Row>
            <h1>No Transactions Found</h1>
            </Row>
        </div>
      )
    }
   
  }
}

export default Products;
