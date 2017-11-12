import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as API from '../api/API';
import sidebar from '../images/sidebar.png';
import cat from '../images/cat.png';

class UserActivity extends Component {

    handleUserActivity=()=>{
        var userid = localStorage.getItem("userid");
        var data ={'userid':userid};
        alert("in handleactivity" + data);
        API.dohandleUserActivity(data)
            .then((res) =>{
                if(res.status === '201'){
                    //alert("Response in welcome " + JSON.stringify(res));
                    this.setState({
                        userActivityList: res.userActivityList
                    });
                    //alert("in user activity show state : "+ JSON.stringify(this.state.userActivityList));
                }
                else if(res.status ==='501'){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                }
            });
    };

    state = {
        username:'',
        userActivityList:[],

    };
    componentWillMount(){
        var username = localStorage.getItem("username");
        this.setState({
            username: username
        });
        this.handleUserActivity();
    }

    render() {
        var userActivity=this.state.userActivityList;
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-3"> <img src={sidebar} height="715" width="300"/></div>
                <div className="col-md-6">
                    <br/>
                    <h3 style={{color:"grey"}}> User Activity</h3>
                    <br/>
                <table>
                    <tr>
                        <th>UserId</th>
                        <th> </th><th></th><th></th><th></th>
                        <th>TimeStamp</th>
                        <th> </th><th></th><th></th><th></th>
                        <th>Action Performed</th>
                    </tr>
                    {userActivity.map((files,i) =>
                        <tr key={i}>

                        <td>{files.userid}</td>
                            <td></td>
                            <td></td> <td></td> <td></td>
                            <td>{files.timestamp}</td>
                            <td></td><td></td> <td></td> <td></td>
                            <td>{files.Action}</td>
                    </tr>
                    )}
                </table>
                </div>
                <div className="col-md-3" >

                    <img src={cat} style={{marginTop:"400"}} height="280" width="200"/>
                </div>
            </div>
        );
    }
}
export default withRouter(UserActivity);