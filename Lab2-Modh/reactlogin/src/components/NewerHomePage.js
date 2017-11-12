import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import Signup from "./Signup"
import Profile from "./Profile";
import UserActivity from "./UserActivity";

class NewerHomePage extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        username: '',
        userid:''
    };

    handleSubmit = (userdata) => {
        alert(JSON.stringify(userdata));
        API.doLogin(userdata)
            .then((res) => {
                if (res.status === '201') {
                    localStorage.setItem("root", res.root);
                    localStorage.setItem( "userid", res.userid );
                   //alert("In newerhomepage" +JSON.stringify(res));
                    this.setState({
                        isLoggedIn: true,
                        message: "",
                        username: res.username,
                        //filelist:res.filelist,
                        root:res.userid,
                        userid: res.userid
                    });
                    localStorage.setItem("username", res.username);
                    this.props.history.push("/welcome");
                } else if (res.status === '401') {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };
    handleSignUp = (userdata) => {
        //alert("in signup");
        API.doSignup(userdata)
            .then((res) => {
               // alert("back in handle signup response : "+JSON.stringify(res));
                if (res.status === '201') {
                    this.setState({
                        message: ""
                    });
                    this.props.history.push("/login");
                }
                else if(res.status==='401')
                {
                    this.setState({
                        message: JSON.stringify(res.errors)
                    });
                    console.log(this.state.message);

                }

            })};

    handleLogout = () => {
        console.log('logout called');
        API.logout()
            .then((status) => {
                if(status === 200){
                    this.setState({
                        isLoggedIn: false
                    });
                    this.props.history.push("/");
                }
            });
    };

    handleProfile = (userdata) =>
    {
        //alert("Here " +JSON.stringify(userdata));
        API.dohandleProfile(userdata)
            .then((res) => {
            //alert(JSON.stringify(res));
                if (res.status === '201') {
                    this.setState({
                    message: ""
                    });
                    this.props.history.push("/welcome");
                }
                else if(res.status === '401')
                {
                    this.setState({
                        message: JSON.stringify(res.errors)
                    });
                    console.log(this.state.message);

                }
            })
    };


    render() {
        return (
            <div className="container-fluid">
                <Route exact path="/" render={() => (
                    <div>

                        <button className="btn btn-primary" onClick={() => {
                            this.props.history.push("/login");
                        }}>
                            DropBox !
                        </button>
                    </div>
                )}/>

                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/welcome" render={() => (
                    <Welcome handleLogout={this.handleLogout} username={this.state.username}/>
                )}/>
                <Route exact path="/signup" render={() => (
                    <div>
                        <Signup handleSignUp={this.handleSignUp}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>

                <Route exact path="/profile" render={() => (
                    <div>
                        <Profile handleProfile={this.handleProfile}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/userActivity" render={() => (
                    <div>
                        <UserActivity handleUserActivity={this.props.handleUserActivity}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>

            </div>
        );
    }
}

export default withRouter(NewerHomePage);