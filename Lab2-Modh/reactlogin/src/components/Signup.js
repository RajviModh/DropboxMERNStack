import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, Link } from 'react-router-dom';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import logo from '../images/logo.png';
import loginImage from '../images/loginImage.png';
import or from '../images/or.png';

class Signup extends Component {

    state = {
        fname : '',
        lname : '',
        email : '',
        pass : '',
        fields: {},
        errors: {}
    };

    componentWillMount(){
        this.setState({
            fname : '',
            lname : '',
            email : '',
            pass : ''
        });
    }
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.contactSubmit = this.contactSubmit.bind(this);
    }

    handleChange(e) {
        this.form.validateFields(e.currentTarget);
        this.setState({[e.target.name]: e.target.value})
    }

    contactSubmit(e) {
        e.preventDefault();

        this.form.validateFields();

        if (!this.form.isValid()) {
            console.log('form is invalid: do not submit');
        } else {
            console.log('form is valid: submit');
        }
    }

    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-12">
                    <img src={logo} height="80" width="300"/>
                    <hr/>
                </div>
                <div className="row">
                    <div className="col-md-12" style={{height:"200"}}>
                    </div></div>

                <div className="col-md-2">
                </div>
                <div className="col-md-4">
                    <img src={loginImage} style={{width:300, height:300}}/>
                </div>
                <div className="col-md-4">
                <FormWithConstraints ref={form => this.form = form} onSubmit={this.contactSubmit} noValidate>
                    <div className="row">
                        <div className="col-md-6" style={{textAlign:"left", width:200}}>
                            Create an account
                        </div>
                        <div className="col-md-6" style={{textAlign:"right"}}>
                            or <Link to='/login'>log in</Link>
                        </div>
                    </div>
                    <br/>
                    <div className="form-group">

                    <input name="fname" size="30" placeholder="First Name" className="form-control"
                           value={this.state.fname}
                           required onChange={this.handleChange}

                    />
                        <FieldFeedbacks for="fname">
                            <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                        </FieldFeedbacks>

                    </div>
                    <div className="form-group">

                    <input name="lname" size="30" placeholder="Last Name" className="form-control"
                           value={this.state.lname}
                           required onChange={this.handleChange}

                    />
                    <FieldFeedbacks for="lname">
                        <FieldFeedback when="*"/>
                    </FieldFeedbacks>
                    </div>
                    <div className="form-group">
                    <input type="email" name="email" size="30" id="email" placeholder="Email" className="form-control"
                           value={this.state.email}
                           onChange={this.handleChange}
                           required minLength={3} />
                    <FieldFeedbacks for="email">
                        <FieldFeedback when="tooShort">Too short</FieldFeedback>
                        <FieldFeedback when="*" />
                    </FieldFeedbacks>
                    </div>
                    <div className="form-group">

                <input type="password" name="pass" size="30" id="pass" placeholder="Password" className="form-control"
                       value={this.state.pass} onChange={this.handleChange}
                       required pattern=".{5,}" />
                <FieldFeedbacks for="pass" show="all">
                    <FieldFeedback when="valueMissing" />
                    <FieldFeedback when="patternMismatch">
                        Should be at least 5 characters long
                    </FieldFeedback>
                    <FieldFeedback when={value => !/\d/.test(value)} warning>
                        Should contain numbers
                    </FieldFeedback>
                    <FieldFeedback when={value => !/[a-z]/.test(value)} warning>
                        Should contain small letters
                    </FieldFeedback>
                    <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>
                        Should contain capital letters
                    </FieldFeedback>
                    <FieldFeedback when={value => !/\W/.test(value)} warning>
                        Should contain special characters
                    </FieldFeedback>
                </FieldFeedbacks>

                    </div>
                    <div className="form-group" style={{textAlign:"right"}}>
                    <button className="btn btn-primary" type="button"
                            onClick={() => this.props.handleSignUp(this.state)}>
                        Create an account
                    </button>
                        <div className="form-group">
                            <img src={or} style={{width:460, height:20}}/>
                        </div>
                        <div className="form-group">
                            <button
                                style={{height:40, width:460}}
                                className="btn btn-primary" disabled={true}>Sign up with Google</button>
                        </div>
                </div>
            </FormWithConstraints>
                </div>

                <div className="col-md-2"></div>
            </div>
        );
    }
}

export default Signup;