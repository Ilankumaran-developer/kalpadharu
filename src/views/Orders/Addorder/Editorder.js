import React, { Component } from 'react';
import {
    Alert,
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
import { parse } from 'path';

class Forms extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.onDismiss = this.onDismiss.bind(this);
        // this.removeitem = this.removeitem.bind(this)
        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            products: [],
            line_items: [],
            product_id: '',
            unit_price: 0,
            selling_price_per_kg: 0,
            selling_price: 0,
            productname: '',
            user: '',
            service_charge: 0,
            grand_total: 0,
            cost_price: 0,
            alert: false,
            id: this.props.match.params.id,
            err:false
        };
    }
    componentDidMount() {

        axios.post(`http://localhost:2018/showordersbyid`, { id: this.state.id }).then((result) => {
            console.log(result.data)
            if(result.status == 200)
            {
                this.setState({ line_items: result.data.line_items })
                this.setState({ grand_total: result.data.grand_total })
                this.setState({ service_charge: result.data.service_tax })
                this.setState({ user: result.data.user })
            }
            else{
                this.setState({err: true});
            }
            

        })
    }
    onDismiss() {
        this.setState({ alert: false })
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        return (
            <div className="animated fadeIn">
                 <Alert color="danger" isOpen={this.state.err}>
         There is some error occured in server...Sorry for that
      </Alert>
                <Row>
                    <Col xs="12" md="6">

                        <Card>
                            <CardHeader>
                                <strong>User Info</strong>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={this.generateBill} encType="multipart/form-data" className="form-horizontal">




                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Name/Mobile/Email of the user</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="text-input" name="text-input" value={this.state.user} onChange={this.userchange} placeholder="username/mobile/email" />
                                            <FormText color="muted">Enter mobile number/name/email of user</FormText>
                                        </Col>
                                    </FormGroup>


                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Service charge (GST) if any</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="number" id="text-input" min="0" name="text-input" value={this.state.service_charge} onChange={this.service_charge_change} placeholder="Service charge" />
                                            <FormText color="muted">Enter the service charge</FormText>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Grand Total</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <span>{this.state.grand_total}</span>
                                        </Col>
                                    </FormGroup>





                                    <CardFooter>


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
                                        {this.state.line_items.map((item, i) => {
                                            return [
                                                <tr>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.unit}</td>
                                                    <td>{item.selling_price} <Button color="danger" size="sm" className="btn-pill">Remove</Button></td>
                                                </tr>
                                            ]
                                        })}
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
