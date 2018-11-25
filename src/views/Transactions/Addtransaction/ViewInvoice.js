import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Button, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import '../../../Invoice.scss';

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.constructTransation = this.constructTransation.bind(this)
        this.state = {
            id: this.props.match.params.id,
            transaction : [],
            user:'',
            date_created:'',
            ids : [],
            subtotal:'',
            products:[]
        }
    }
    componentDidMount() {
        axios.post(`https://kalpatharu-backend.herokuapp.com/showtransbyid`, { id: this.state.id }).then((result) => {
            console.log(result.data)
            this.setState({transaction:result.data.transaction})
            this.setState({user:result.data.user})
            this.setState({date_created:result.data.date_created})
            this.setState({ids:result.data.product_ids})
            this.setState({subtotal:result.data.total})
            this.setState({service_tax:result.data.service_tax})
            this.setState({grand_total:result.data.grand_total})
            axios.post(`https://kalpatharu-backend.herokuapp.com/getProdDetails`,{ids:this.state.ids}).then((result1)=>{
                console.log(result1)
                this.setState({products:result1.data})
            })
            
        })
        
    }
    constructTransation(event){
        let clone = this.state.products;
        let trans = this.state.transaction;
        let transactions = []
        for(var i  in clone)
        {
          let temp = []
          temp.push(<td>{clone[i].productname}</td>)
          temp.push(<td>{clone[i].selling_price}</td>)
          for(let j in trans)
          {
              if(trans[j].product_id == clone[i]._id)
              {
                  temp.push(<td>{trans[j].unit}</td>)
                  temp.push(<td>{trans[j].selling_price}</td>)
              }
          }
          
          transactions.push(<tr>{temp}</tr>)
        }
        return transactions
    }
    render() {
        return (
            <div className="animated fadeIn">
                <div className="container">
                    <Row>
                        <Col xs="12" md="6">
                            <div className="invoice-title">
                                <h2>Invoice</h2><h3 className="pull-right">Order # {this.state.id}</h3>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xs-6">
                                    <address>
                                        <strong>Billed To:</strong><br />
                                        {this.state.user}<br />
                                         {this.state.date_created}<br />
                                        {/* Apt. 4B<br />
                                        Springfield, ST 54321  */}
    				</address>
                                </div>
                         
                            </div>
                            
                        </Col>
                    </Row>

                    <Row>
                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title"><strong>Order summary</strong></h3>
                                </div>
                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <table className="table table-condensed">
                                            <thead>
                                                <tr>
                                                    <td><strong>Item</strong></td>
                                                    <td className="text-center"><strong>Price</strong></td>
                                                    <td className="text-center"><strong>Quantity</strong></td>
                                                    <td className="text-right"><strong>Totals</strong></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.constructTransation()}
                                                <tr>
                                                    <td className="thick-line"></td>
                                                    <td className="thick-line"></td>
                                                    <td className="thick-line text-center"><strong>Subtotal</strong></td>
                                                    <td className="thick-line text-right">{this.state.subtotal}</td>
                                                </tr>
                                                <tr>
                                                    <td className="no-line"></td>
                                                    <td className="no-line"></td>
                                                    <td className="no-line text-center"><strong>Service Tax(GST)</strong></td>
                                                    <td className="no-line text-right">{this.state.service_tax}</td>
                                                </tr>
                                                <tr>
                                                    <td className="no-line"></td>
                                                    <td className="no-line"></td>
                                                    <td className="no-line text-center"><strong>Total</strong></td>
                                                    <td className="no-line text-right">{this.state.grand_total}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Invoice;
