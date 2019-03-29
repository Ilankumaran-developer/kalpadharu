import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Button, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import '../../../Invoice.scss';
import {Alert} from 'reactstrap';

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.constructOrder = this.constructOrder.bind(this)
        this.state = {
            id: this.props.match.params.id,
            line_items : [],
            user:'',
            date_created:'',
            ids : [],
            subtotal:'',
            products:[],
            order_id:'',
            err:false
        }
    }
    componentDidMount() {
        axios.post(`http://localhost:2018/showordersbyid`, { id: this.state.id }).then((result) => {
            console.log(result.data)
            if(result.status == 200){
                this.setState({line_items:result.data.line_items})
            this.setState({user:result.data.user})
            this.setState({date_created:result.data.date_created})
            this.setState({ids:result.data.product_ids})
            this.setState({subtotal:result.data.total})
            this.setState({service_tax:result.data.service_tax})
            this.setState({grand_total:result.data.grand_total})
            this.setState({order_id:result.data.order_id})
            /* axios.post(`http://localhost:2018/getProdDetails`,{ids:this.state.ids}).then((result1)=>{
                if(result1.status == 200)
                {
                    console.log(result1)
                this.setState({products:result1.data})
                }
                else{
                    this.setState({err:true});
                }
                
            }) */
            }
            else{
                this.setState({err: true});
            }
            
            
        })
        
    }
    constructOrder(){
        
         let line_item_product = this.state.line_items;
        let line_items = []
       
         
          console.log()
          for(let i = 0; i <  line_item_product.length ; i++)
          {
            let temp = [];
              console.log(i, line_item_product[i])
                  temp.push(<td>{line_item_product[i].product_name}</td>)
                  temp.push(<td>{parseFloat(line_item_product[i].sku_min_sp)} per ({parseFloat(line_item_product[i].sku_min_unit) * 1000}) grams</td>)
                  temp.push(<td>{parseFloat(line_item_product[i].unit) * 1000} grams</td>)
                  temp.push(<td>{parseFloat(line_item_product[i].selling_price).toFixed(2)}</td>)
                  line_items.push(<tr>{temp}</tr>)
            }
        return line_items 
    }
    render() {
        return (
            <div className="animated fadeIn">
             <Alert color="danger" isOpen={this.state.err}>
         There is some error occured in server...Sorry for that
      </Alert>
                <div className="container">
                    <Row>
                        <Col xs="12" md="6">
                            <div className="invoice-title">
                                <h2>Invoice</h2><h3 className="pull-right">Order # {this.state.order_id}</h3>
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
                                            {this.constructOrder()}
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
