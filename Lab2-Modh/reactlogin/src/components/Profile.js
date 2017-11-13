import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as API from '../api/API';
import sidebar from '../images/sidebar.png';

import cat from '../images/cat.png';

class Profile extends  Component{

    static propTypes = {
        // handleProfile: PropTypes.func.isRequired
    };


    state = {
        fname: '',
        lname: '',
        contact: '',
        work: '',
        education: '',
        music:'',
        sports:'',
        shows:'',
        userid:localStorage.getItem("userid")

    };

    getProfile=(data)=>{
       //alert("getProfile data : " + JSON.stringify(data));
        API.getProfile(data)
            .then((res) => {
            alert("in react show profile : " + JSON.stringify(res));
                if (res.status === '201') {
                    this.setState({
                        fname: res.user.firstname,
                        lname: res.user.lastname,
                        contact: res.user.contact,
                        work: res.user.work,
                        education: res.user.education,
                        music: res.user.music,
                        sports: res.user.sports,
                        shows: res.user.shows
                        //isSelfCall: true
                    });
                    //alert("state : "+  JSON.stringify(this.state));
                }else if(res.status==='501'){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                }
            })
    };

    componentWillMount(){
        var uid = localStorage.getItem("userid");
        console.log("Userid in profile" +uid);
        this.getProfile(this.state);
        /*this.setState({
            fname: '',
            lname: '',
            contact: '',
            work: '',
            education: '',
            music:'',
            sports:'',
            shows:'',
            userid:uid

        });*/
    }


    render(){
        return(
            <div className="container-fluid">
                <div className="row justify-content-md-center">
                    <div className="col-md-3">
                        <img src={sidebar} height="715" width="300"/>
                        {/* <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#news">Files</a></li>
                            <li><a href="#contact">Paper</a></li>
                        </ul>*/}
                    </div>

                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6" style={{height:"50"}}>
                            </div></div>
                   <form>
                       <table style={{width:670, color:"grey"}}>
                           <tr><td><h2 style={{color:"grey", textAlign:"center"}}>Profile</h2></td></tr>
                           <tr>

                            <td> First Name : </td>
                            <td>
                                <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Firstname"
                                placeholder="Enter Firstname"
                                value={this.state.fname}
                                onChange={(event) => {
                                    this.setState({
                                        fname: event.target.value
                                    });
                                }}
                            />
                                </div>
                            </td>

                           </tr>
                           <tr>

                               <td> Last Name : </td>
                               <td>
                                   <div className="form-group">

                            <input
                                className="form-control"
                                type="text"
                                label="Lastname"
                                placeholder="Enter Lastname"
                                value={this.state.lname}
                                onChange={(event) => {
                                    this.setState({
                                        lname: event.target.value
                                    });
                                }}
                            />


                        </div>
                               </td>

                           </tr>
                           <tr>

                               <td> Contact Info : </td>
                               <td>
                                   <div className="form-group">
                           <input
                               className="form-control"
                               type="text"
                               label="ContactInfo"
                               placeholder="Enter ContactInfo"
                               value={this.state.contact}
                               onChange={(event) => {
                                   this.setState({
                                       contact: event.target.value
                                   });
                               }}
                           />
                       </div>

                               </td>

                           </tr>
                           <tr>

                               <td> Education : </td>
                               <td>
                                   <div className="form-group">
                               <input
                                   className="form-control"
                                   type="text"
                                   label="Education"
                                   placeholder="Enter Education"
                                   value={this.state.education}
                                   onChange={(event) => {
                                       this.setState({
                                           education: event.target.value
                                       });
                                   }}
                               />
                           </div>
                               </td>

                           </tr>
                           <tr>

                               <td> Work : </td>
                               <td>
                                   <div className="form-group">

                                   <input
                                       className="form-control"
                                       type="text"
                                       label="Work"
                                       placeholder="Enter Work"
                                       value={this.state.work}
                                       onChange={(event) => {
                                           this.setState({
                                               work: event.target.value
                                           });
                                       }}
                                   />
                               </div>
                               </td>

                           </tr>
                           <tr>

                               <td> Music : </td>
                               <td>
                                   <div className="form-group">

                           <input
                               className="form-control"
                               type="text"
                               label="Music"
                               placeholder="Enter Music"
                               value={this.state.music}
                               onChange={(event) => {
                                   this.setState({
                                       music: event.target.value
                                   });
                               }}
                           />
                       </div>
                               </td>

                           </tr>
                           <tr>

                               <td> Sports : </td>
                               <td>
                                   <div className="form-group">

                           <input
                               className="form-control"
                               type="text"
                               label="Sports"
                               placeholder="Enter Sports"
                               value={this.state.sports}
                               onChange={(event) => {
                                   this.setState({
                                       sports: event.target.value
                                   });
                               }}
                           />
                       </div>
                               </td>

                           </tr>
                           <tr>

                               <td> Shows : </td>
                               <td>
                                   <div className="form-group">

                           <input
                               className="form-control"
                               type="text"
                               label="Shows"
                               placeholder="Enter Shows"
                               value={this.state.shows}
                               onChange={(event) => {
                                   this.setState({
                                       shows: event.target.value
                                   });
                               }}
                           />
                       </div>
                               </td>
                           </tr>
                           <tr>
                               <td>
                        <div className="form-group" >
                            <button style={{textAlign:"right"}}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => this.props.handleProfile(this.state)}>
                                Submit
                            </button>
                        </div>
                               </td></tr>
                       </table>
                   </form>
                </div>
                    <div className="col-md-3" style={{marginTop:"400"}}>
                        <img src={cat} height="280" width="200"/>
                    </div>
            </div>
            </div>

        );
}
    }

export default withRouter(Profile);