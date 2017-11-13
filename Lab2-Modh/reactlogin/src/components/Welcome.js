import React, {Component} from 'react';
import * as API from '../api/API';

import {Link,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import '../App.css';
import FileDownload from 'react-file-download';
import {Modal} from 'react-bootstrap';
import sidebar from '../images/sidebar.png';
import cat from '../images/cat.png';

var logout={float:'right', position:'fixed', top:30, right:240, color:"grey"};
var profile={float:'right', position:'fixed', top:90, right:240, color:"grey"};
var upload={float:'right', position:'fixed', top:150, right:10, color:"grey"};
var uploadbutton={float:'right', position:'fixed', top:190, right:205, color:"grey"};
var useractivity={float:'right', position:'fixed', top:240, right:200, color:"grey"};
var tablestyle={textAlign:'left'};
//var profile={float:'right', position:'fixed', top:50, right:100};
var starredfiles={paddingLeft:'15px',paddingTop:'5px', textAlign:'left'};
var body={paddingLeft:'15px',paddingTop:'15px', textAlign:'left'};
var home ={paddingLeft:'15px', textAlign:'left', color:"grey"};


class Welcome extends Component {


    static propTypes = {
        username: PropTypes.string.isRequired,
        handleLogout: PropTypes.func.isRequired
    };

    state = {
        username : '',
        root:'',
        userId:'',
        rootDir:'',
        size:'',
        type:'',
        filename :'',
        userActivityList:[],
        starredlist:[],
        isStarFlag:'',
        recipientEmail:'',
        directoryName : '',
        lastModifiedDate:'',
        data_uri:'',
        filearray:[],
        path1:[],
        isSelfCall:false,
        showModal: false
    };


    componentWillMount() {
        var root = localStorage.getItem("root");
        var userid = localStorage.getItem("userid");
        var username = localStorage.getItem("username");
        this.setState({
            username: username,
            root:root,
            userid:userid
        });
        this.getDirectories(root);
        this.getStarredFiles(userid);
        document.title = `Welcome, ${this.state.username} !!`;
    }

    handleFileUpload = (event) => {

        const payload = new FormData();

        var userid = localStorage.getItem("userid");
        payload.append('mypic', this.refs.mypic.files[0]);
        payload.append('userid',userid);

        API.doUpload(payload)
            .then((res) => {
                if (res.status === '501') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');

                }
                else{
                    this.getDirectories(userid);
                }
            });
    };
    goBack = () =>{
        debugger;
        if(this.state.path1.length>1){
            this.getDirectories(this.state.path1[this.state.path1.length-2]);
            this.state.path1.splice(this.state.path1.length-2, 2);
        }else{
            this.getDirectories(this.state.root);
            this.state.path1.splice(this.state.path1.length-1, 1);
        }

    };
    createDirectory= (name) =>{
        var path = "";
        if(this.state.path1.length>0){
            path = (this.state.path1[this.state.path1.length-1]);
        }else{
            path = (this.state.root);
        }
        var payload = {'name':name, 'path': path};
        alert("in create dir : "+JSON.stringify(payload));
        console.log("create directory data " +JSON.stringify(payload));
        API.doMakedirectory(payload)
            .then((res) => {
                if (res.status === '501') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');

                }else{
                    this.getDirectories(path);
                }
            });
    };

    getDirectories= (path) =>{
        var payload = {'root':path};
        API.getDirectories(payload)
            .then((res) => {
                if (res.status === '201') {
                    this.state.path1.push(path);
                    this.setState({
                        filearray: res.filearray,
                        isSelfCall: true
                    });
                }else if(res.status==='501'){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                }
            })
    };
    deleteDirectory= (name) =>{
        var path = "";
        if(this.state.path1.length>0){
            path = (this.state.path1[this.state.path1.length-1]);
        }else{
            path = (this.state.root);
        }
        var payload = {'name':name, 'path': path};
        //alert("delete directory data " +JSON.stringify(data));
        API.deleteDirectory(payload)
            .then((res) => {
                if (res.status === '501') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');

                }else{
                    this.getDirectories(path);
                }
            });
    };


   download= (filepath,filename) =>{

        var data = {'path':filepath,'name':filename};
        alert("download data " + JSON.stringify(data));
        API.doDownload(data)
            .then((res) => {
                if(res.status === '201') {
                    FileDownload(res.file, filename);
                }
            })
    };

    dostarFile=(filename)=>{
        var userid = localStorage.getItem("userid");
        var payload = {'fileName':filename,'isStar':true, 'userid' :userid};
        API.doStarFiles(payload)
            .then((status) => {
                alert(JSON.stringify("Star files welcome" + JSON.stringify(status)));
                if (status.status === '501') {
                    localStorage.removeItem("token");
                }else{
                    this.setState({
                        starFileName: status,
                    });
                }

            });
    };

    dounStarFile=(filename)=>{
        var payload = {'fileName':filename, 'isStar':false};
        API.doUnStarFiles(payload)
            .then((status) => {
                alert("welcome unstar file " +JSON.stringify(status));
                if (status.status === '200') {
                    this.setState({
                        starFileName: status,
                    });
                }
            });
    };

    getStarredFiles=(userid)=>{
        var payload={'userid':userid};
        API.getStarredFiles(payload)
            .then((res)=>{
                alert(JSON.stringify(JSON.stringify(res)));
                if (res.status === '200') {
                    this.setState({
                        starredlist: res.starArray,
                        isStarFlag:res.isStar
                    });
                   // alert(JSON.stringify(this.state));
                }

            });
    };

    shareFile=(filepath,filename,recipientEmail)=>{
        var payload = {'path':filepath,'name':filename, 'recipientEmail':recipientEmail};
        alert("in sharefile" +JSON.stringify(payload));
        API.doShareFiles(payload)
            .then((res) => {
                alert(JSON.stringify(res));
                if (res.status === '200') {
                    alert("File Shared"+JSON.stringify(res));
                }else{
                }

            });
    };

    render(){

        debugger;
        var filearray1 = [];
        if(this.state.filearray && this.state.filearray!=''){
            filearray1 = this.state.filearray;
        }
        var username = this.state.userid;



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
                    <div style={home}>
                    <h4>Home</h4>
                    <hr/>

                    <button className="btn btn-primary" onClick={() => this.goBack()}>
                        back
                    </button>
                    &nbsp; &nbsp;
                    <input placeholder="Enter Directory Name"  type='text' onChange={(event) => {
                        const value=event.target.value;
                        this.setState({
                            filename: event.target.value
                        });
                    }}/>
                        &nbsp; &nbsp;
                    <button  className="btn btn-primary" onClick={() => this.createDirectory(this.state.filename)}>
                        Create Directory
                    </button>

                        <br/><br/>
                        Enter email address to SHARE File :
                        <input type="text"
                               label="email"
                               placeholder="Enter Email Address"
                               value={this.state.recipientEmail}
                               onChange={(event) => {
                                   this.setState({
                                       recipientEmail: event.target.value
                                   });
                               }}
                        />



                    </div>

                    <div style={starredfiles}>
                        <hr/>
                        <h4 style={{color:"grey"}}>Starred Files</h4>
                        <table> {this.state.starredlist.map((files, i) =>
                            <tr key={i}>{
                                (   <div>

                                            <td> {files.filename} </td>
                                            <td><input type="checkbox" name="files" onClick={() => this.dounStarFile(files.filename)}/></td>

                                    </div>
                                )}</tr>
                        )}
                        </table>
                        <hr/>
                    </div>


                    <div style={body}>
                        <h4 style={{color:"grey"}}>Recent</h4>
                        <table style={tablestyle}>

                                {filearray1.map((file, i) =>
                                    <tr key={i} >
                                        <td>
                                        {file.isFolder==true ?
                                            (<button onClick={() => this.getDirectories(file.path)}>
                                                {file.name}
                                            </button>)
                                            :
                                            (<span>
                                        {file.name}
                                    </span>)}
                                        </td>
                                        &nbsp; &nbsp;

                                        <td><input type="checkbox" name="files" onClick={() => this.dostarFile(file.name)}/>Star</td>
                                        <td>

                                        </td><td><button className="btn btn-primary" onClick={()=>this.shareFile(file.path,file.name,this.state.recipientEmail)}>Share</button>
                                            {/*<Modal show={this.state.showModal}>
                                            <Modal.Body>
                                                <input type="text"
                                                       label="email"
                                                       placeholder="Enter Email Address"
                                                       value={this.state.recipientEmail}
                                                       onChange={(event) => {
                                                           this.setState({
                                                               recipientEmail: event.target.value
                                                           });
                                                       }}
                                                />
                                                <br/>
                                                <button className="btn btn-primary" onClick={()=>this.shareFile(file.path,file.name,this.state.recipientEmail)}>Share</button>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <div className="col-sm-5 col-md-5">
                                                    <button onClick={this.close}>Close</button>
                                                </div>
                                            </Modal.Footer>
                                        </Modal>
*/}



                                        </td>


                                        <td><button className="btn btn-primary" onClick={()=>this.download(file.path,file.name)}>Download</button></td>
                                        &nbsp; &nbsp;
                                        <td><button className="btn btn-primary" onClick={() => this.deleteDirectory(file.name)}>Delete</button></td>
                                    </tr>
                                )}


                        </table>


                    </div>
                </div>
                    <div className="col-md-3">
                       {this.state.username},!
                    <div style={logout}>
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => this.props.handleLogout(this.state)}>
                            Logout
                        </button>
                    </div>
                        <div style={profile}>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    this.props.history.push("/profile");
                                }}>Profile</button>
                        </div>
                        <div style={upload}>
                            <input
                                type="file"
                                ref="mypic"
                                name="mypic"
                            />
                        </div>

                        <div style={uploadbutton}>
                            <button className="btn btn-primary" onClick={() => this.handleFileUpload()}>Upload files</button>
                        </div>
                        <div style={useractivity}>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                this.props.history.push("/userActivity");}}>
                            User Activity
                        </button>
                        </div>
                        <div style={{ marginTop:"400", marginRight:"100"}}>
                            <img src={cat} height="280" width="200"/>
                    </div>

                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(Welcome);