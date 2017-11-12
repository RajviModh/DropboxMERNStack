import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, Link } from 'react-router-dom';
//import Signup from "./Signup";

import logo from '../images/logo.png';
import loginImage from '../images/loginImage.png';
import or from '../images/or.png';
import buisness from '../images/buisness.png';

class Login extends Component {

    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    state = {
        username: '',
        password: ''
    };

    componentWillMount(){
        this.setState({
            username: '',
            password: ''
        });
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
                    <form>
                        <div className="row">
                        <div className="col-md-6" style={{textAlign:"left", width:200}}>
                           Sign In
                        </div>
                        <div className="col-md-6" style={{textAlign:"right"}}>
                           or <Link to='/signup'>create an account</Link>
                        </div>
                        </div>
                        <br/>
                        <div className="form-group">
                            <button
                                style={{height:40, width:460}}
                                className="btn btn-primary"
                                disabled={true}>Sign in with Google</button>
                        </div>
                        <div className="form-group">
                            <img src={or} style={{width:460, height:20}}/>
                        </div>

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Username"
                                placeholder="Enter Username"
                                value={this.state.username}
                                onChange={(event) => {
                                    this.setState({
                                        username: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="password"
                                label="password"
                                placeholder="Enter Password"
                                value={this.state.password}
                                onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group" style={{textAlign:"right"}}>
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => this.props.handleSubmit(this.state)}>
                                Sign in
                            </button>
                            &nbsp; &nbsp;
                        </div>
                    </form>
                </div>
                <div className="col-md-2"></div>
            </div>
        );
    }
}

export default withRouter (Login);