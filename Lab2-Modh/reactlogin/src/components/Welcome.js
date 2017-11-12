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
        directoryName : '',
        lastModifiedDate:'',
        size:'',
        type:'',
        filename :'',
        data_uri:'',
        filelist:[],
        pathTrack:[],
        isSelfCall:false,
        root:'',
        userId:'',
        rootDir:'',
        userActivityList:[],
        starredlist:[],
        isStarFlag:'',
        recipientEmail:'',
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
        this.getChildDir(root);
        this.getStarredFiles(userid);
        document.title = `Welcome, ${this.state.username} !!`;
    }

    close = () => {
        alert("in modal close");
        this.setState({ showModal: false });
    };
    open = () => {
        alert("in modal open");
        this.setState({ showModal: true });
    };

    getBack = () =>{
        debugger;
        if(this.state.pathTrack.length>1){
            this.getChildDir(this.state.pathTrack[this.state.pathTrack.length-2]);
            this.state.pathTrack.splice(this.state.pathTrack.length-2, 2);
        }else{
            this.getChildDir(this.state.root);
            this.state.pathTrack.splice(this.state.pathTrack.length-1, 1);
        }

    };

    handleFileUpload = (event) => {

        const payload = new FormData();

        var pathToUpload = "";
        if(this.state.pathTrack.length>0){
            pathToUpload = (this.state.pathTrack[this.state.pathTrack.length-1]);
        }else{
            pathToUpload = (this.state.root);
        }
        //alert("in handlefileupload pathtoupload" + pathToUpload);


        payload.append('mypic', this.refs.mypic.files[0]);
        payload.append('userid',localStorage.getItem("userid"));
        //payload.append('userid',localStorage.getItem("userid"));
        //alert("in handlefileupload payload : " + JSON.stringify(payload));
        API.doUpload(payload)
            .then((res) => {
                if (res.status === '501') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');

                }
                else{
                    this.getChildDir(pathToUpload);
                }
            });
    };

    createDirectory= (dirname) =>{
        var pathToUpload = "";
        if(this.state.pathTrack.length>0){
            pathToUpload = (this.state.pathTrack[this.state.pathTrack.length-1]);
        }else{
            pathToUpload = (this.state.root);
        }
        var data = {'dirName':dirname, 'path': pathToUpload};
        console.log("create directory data " +JSON.stringify(data));
        API.doMakedirectory(data)
            .then((res) => {
                if (res.status === '501') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');

                }else{
                    this.getChildDir(pathToUpload);
                }
            });
    };

    getChildDir= (filepath) =>{
        console.log('data = '+filepath);
        var data = {'dir':filepath};
        //alert("Inside getChildDir : " +JSON.stringify(data));
        API.getChildDirs(data)
            .then((res) => {
            //alert("After getchilddir : " + JSON.stringify(res));
                if (res.status === '201') {
                    this.state.pathTrack.push(filepath);
                    this.setState({
                        filelist: res.filelist,
                        isSelfCall: true
                    });
                }else if(res.status==='501'){
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                }
            })
    };
    deleteDirectory= (filename) =>{
        var pathToUpload = "";
        if(this.state.pathTrack.length>0){
            pathToUpload = (this.state.pathTrack[this.state.pathTrack.length-1]);
        }else{
            pathToUpload = (this.state.root);
        }
        var data = {'dirName':filename, 'path': pathToUpload};
        //alert("delete directory data " +JSON.stringify(data));
        API.deleteDirectory(data)
            .then((res) => {
                if (res.status === '501') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("root");
                    this.props.history.push('/login');

                }else{
                    this.getChildDir(pathToUpload);
                }
            });
    };

/*   handleUserActivity=(data)=>{
        var userid = localStorage.getItem("userid");
        alert("in handleactivity" + userid);
        API.dohandleUserActivity(data)
            .then((res) =>{
            if(res.status === '201'){
                alert("Response in welcome " + JSON.stringify(res));
                this.setState({
                    //userActivityList: res.userActivityList
                });
            }
            else if(res.status ==='501'){
                localStorage.removeItem("token");
                localStorage.removeItem("root");
            }
            });
    };*/


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

    starFile=(filename)=>{
        //alert(filename);
        var userid = localStorage.getItem("userid");
        var data = {'fileName':filename,'isStar':true, 'userid' :userid};
        API.doStarFiles(data)
            .then((status) => {
                alert(JSON.stringify("Star files welcome" + JSON.stringify(status)));
                if (status.status === '501') {
                    localStorage.removeItem("token");
                }else{
                    this.setState({
                        starFileName: status,
                    });

                    //alert(JSON.stringify(this.state));
                }

            });
    };

    unStarFile=(filename)=>{
        var data = {'fileName':filename, 'isStar':false};
        API.doUnStarFiles(data)
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
        var data={'userid':userid};
        //alert("in get starred files"+data);
       // var userid = localStorage.getItem("userid");
        API.getStarredFiles(data)
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
        var data = {'path':filepath,'name':filename, 'recipientEmail':recipientEmail};
        alert("in sharefile" +JSON.stringify(data));
        API.doShareFiles(data)
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
        var filelist1 = [];
        if(this.state.filelist && this.state.filelist!=''){
            filelist1 = this.state.filelist;
        }
        var username = this.state.userid;

       //var starList=this.state.starredlist;


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

                    <button className="btn btn-primary" onClick={() => this.getBack()}>
                        back
                    </button>
                    &nbsp; &nbsp;
                    <input placeholder="Enter Directory Name"  type='text' onChange={(event) => {
                        const value=event.target.value
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
                                            <td><input type="checkbox" name="files" onClick={() => this.unStarFile(files.filename)}/></td>

                                    </div>
                                )}</tr>
                        )}
                        </table>
                        <hr/>
                    </div>


                    <div style={body}>
                        <h4 style={{color:"grey"}}>Recent</h4>
                        <table style={tablestyle}>

                                {filelist1.map((file, i) =>
                                    <tr key={i} >
                                        <td>
                                        {file.isFolder==true ?
                                            (<button onClick={() => this.getChildDir(file.path)}>
                                                {file.name}
                                            </button>)
                                            :
                                            (<span>
                                        {file.name}
                                    </span>)}
                                        </td>
                                        &nbsp; &nbsp;

                                        {/*<a href={'http://localhost:3001/uploads/'+file.path} download={file.name}>Download</a>*/}
                                        <td><input type="checkbox" name="files" onClick={() => this.starFile(file.name)}/>Star</td>
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

                                            {/*<button className="btn btn-primary" onClick={() => this.shareFile(file.path,file.name,this.state.recipientEmail)}>Share</button>*/}

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
                                className={'fileupload'}
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

                        {/*<ImageGridList images={this.state.images}/>*/}


                </div>
            </div>

        )
    }
}

export default withRouter(Welcome);