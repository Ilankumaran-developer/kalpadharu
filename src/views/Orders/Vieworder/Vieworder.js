import React, { Component } from 'react';
import { Alert, FormGroup, Label, Input, Button, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import { css } from '@emotion/core';


class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      currentpage: 0,
      err: false,
      loading: true,
      grandSum: 0,
      from_date: '',
      to_date: ''

    }
    this.constructHistory = this.constructHistory.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.editOrder = this.editOrder.bind(this);
    this.viewInvoice = this.viewInvoice.bind(this);
    this.getOrdersInfo = this.getOrdersInfo.bind(this);
    this.fromDateChange = this.fromDateChange.bind(this);
    this.toDateChange = this.toDateChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.getPDF = this.getPDF.bind(this);
    
  }
  componentDidMount() {
    axios.get(`http://localhost:2018/showorders`).then((result) => {
      console.log(result)
      if (result.status == 200) {
        this.setState({
          orders: result.data,
          loading: false
        })
      }
      else {
        this.setState({ err: true, loading: false });
      }

      //console.log(this.state.products)

    })
  }
  sendEmail(id) {
    console.log('asdasd')
    axios.post('http://localhost:2018/sendEmail', {}).then((result) => {
      console.log(result)
      if (result.status == 200) {
        this.setState({ alert: true })
      }
      else {
        this.setState({ err: true })
      }
    })
  }
  setDateRanges() {
    let queryString = '';
    if (this.state.from_date)
      queryString = queryString + `from=${this.state.from_date}&`;
    if (this.state.to_date)
      queryString = queryString + ''
  }
  getPDF(id) {
   axios.get(`http://localhost:2018/makePDF?id=${id}`).then((result) => {
      window.location.assign(`http://localhost:2018/downloadPDF?filename=${result.data}`);
    }) 
  }
  fromDateChange(event) {
    this.setState({ from_date: event.target.value });

    axios.get(`http://localhost:2018/showorders?from=` + event.target.value).then((result) => {
      console.log(result)
      if (result.status == 200) {
        this.setState({
          orders: result.data,
          loading: false
        })
      }
      else {
        this.setState({ err: true, loading: false });
      }
    })
  }
  toDateChange(event) {
    this.setState({ to_date: event.target.value });
    console.log(event.target.value)
    axios.get(`http://localhost:2018/showorders?to=` + event.target.value).then((result) => {
      console.log(result)
      if (result.status == 200) {
        this.setState({
          orders: result.data,
          loading: false
        })
      }
      else {
        this.setState({ err: true, loading: false });
      }
    })
  }
  editOrder(id) {
    this.props.history.push('/edit/order/' + id)
  }
  viewInvoice(id) {
    this.props.history.push('/view/Invoice/' + id)
  }
  deleteOrder(val, e) {
    console.log(val, e)
    let url = process.env.url + '/deleteOrder';
    axios.post(url, val).then((result) => {
      console.log(result)
      this.setState({
        orders: result.data
      })
    })
  }
  getOrdersInfo(state) {
    let clone = this.state.orders
    let grand_total = 0.00;
    let sales_total = 0.00;
    let service_tax_paid = 0.00;
    for (var i in clone) {
      grand_total = grand_total + parseFloat(clone[i].grand_total);
      sales_total = sales_total + parseFloat(clone[i].profit);
      if (clone[i].service_tax)
        service_tax_paid = service_tax_paid + parseFloat(clone[i].service_tax);
    }
    grand_total = parseFloat(grand_total).toFixed(2);
    sales_total = parseFloat(sales_total).toFixed(2);
    service_tax_paid = parseFloat(service_tax_paid).toFixed(2);
    switch (state) {
      case "grand_total":
        let response = <p><Badge>Total Grand Total :</Badge> {grand_total}</p>
        return response;
      case "sales_total":
        let responseSales = <p><Badge>Total Sales Total :</Badge> {sales_total}</p>
        return responseSales;
      case "service_tax_total":
        let service_tax = <p><Badge>Total Service Tax Paid:</Badge>{service_tax_paid}</p>
        return service_tax;
      default:
        break;
    }
  }
  constructHistory() {
    let orders = []
    let clone = this.state.orders

    for (var i in clone) {


      let temp = []
      temp.push(<td>{clone[i].user}</td>)
      temp.push(<td>{clone[i].date_created}</td>)
      temp.push(<td>{clone[i].grand_total}</td>)
      temp.push(<td>{clone[i].profit}</td>)
      temp.push(<td>{clone[i].service_tax}</td>)
      temp.push(<td><Button onClick={this.editOrder.bind(this, clone[i]._id)} color="info">Edit</Button>&nbsp;<Button onClick={this.viewInvoice.bind(this, clone[i]._id)} color="info">View Invoice</Button>&nbsp;<Button onClick={this.sendEmail.bind(this, clone[i]._id)} color="danger">Email to user</Button>&nbsp;<Button onClick={this.getPDF.bind(this, clone[i]._id)} color="success">Download as PDF</Button></td>)

      orders.push(<tr>{temp}</tr>)

    }

    return orders;
  }
  render() {
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    `;
    

    if (this.state.orders.length > 0 && !this.state.loading) {
      return (
        <div className="animated fadeIn">


          <Row>
            <Col>
              <Card>
                <Alert color="danger" isOpen={this.state.err}>
                  There is some error occured in server...Sorry for that
      </Alert>
                <p><Badge>Total Orders Placed : </Badge>{this.state.orders.length}</p>
                {this.getOrdersInfo("grand_total")}
                {this.getOrdersInfo("sales_total")}
                {this.getOrdersInfo("service_tax_total")}
                <FormGroup>
                  <p> <Label htmlFor="date-input">From :</Label>

                    <Col xs="3" md="3">
                      <Input type="date" id="date-input" name="date-input" value={this.state.from_date} onChange={this.fromDateChange} placeholder="From" />
                    </Col>
                    <Label htmlFor="date-input">To :</Label>
                    <Col xs="3" md="3">
                      <Input type="date" id="date-input" name="date-input" value={this.state.to_date} onChange={this.toDateChange} placeholder="To" />
                    </Col></p>

                </FormGroup>
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
                          Sales Amount
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
    else if (this.state.orders.length == 0 && !this.state.loading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <h1>No Orders Found</h1>
          </Row>
        </div>
      )
    }
    else if (this.state.loading) {
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
