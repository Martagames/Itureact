import React, { Component } from 'react';
import "./home.css"
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import "./projects.css"
class EditProject extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            ProjectName: this.props.parent.props.data.projectname,
            Salery: this.props.parent.props.data.salery
        }
    this.CancelEdit = this.CancelEdit.bind(this);
    this.AddEdit = this.AddEdit.bind(this);
    }
    CancelEdit(){
        this.props.parent.setState({editing :false}); 
    }
    AddEdit(user,th){
        axios.post('http://timetaker.mzf.cz/?method=EditProject',
            {"userid": user.sub, "projectid":this.props.parent.props.data.projectid, "projectname":this.state.ProjectName, "salery": this.state.Salery })
            .then( function (response) {
                var data = response.data.slice(1021);
                if(data == "true")
                {
                    th.props.parent.setState({editing :false}); 
                    th.props.parent.props.parent.setState({isLoad :false}); 
                }
                else
                {
                    alert("Error occured while creating editing project try again ");
                }
            })
    }
    render(){
        return (<>
            <div className="EditProjectPopUp">
                <h3>Edit project </h3>
                <div className="EditProjectGrid">
                <a>ProjectName </a>  <input value={this.state.ProjectName} onInput={e => this.setState({ProjectName: e.target.value})} type="text" className="NewProjkectItem"/>
                <a>Salery</a>  <input  value={this.state.Salery} onInput={e => this.setState({Salery: e.target.value})} type="number" min='0' className="NewProjkectItem"/>
                 <div></div> <div className="ConfirmButton"  onClick={() => this.AddEdit(this.props.user,this) }>Confirm </div> 
                </div>
                <div className="CancelButton" onClick={this.CancelEdit}>X</div>
                </div>
    </>
        )
    }
    }
class LoadProjects extends Component 
{
    constructor(props) {
        super(props); 
        this.state = {
            editing: false,
            dotClicked:false,
            visible: true
        }
        this.handelClick = this.handelClick.bind(this);
    }
    handelClick()
    {
        if(this.state.dotClicked === false)
            this.setState({dotClicked: true});
        else
            this.setState({dotClicked: false});
    }
    DeleteProject(user,th)
    {
        axios.post('http://timetaker.mzf.cz/?method=DeleteProject',
        {'content-type': 'application/json' ,"userid": user.sub , "projectid":this.props.data.projectid})
      .then( function (response) {
        var data = response.data.slice(1021);
        if(data === "true")
        {
          th.setState( ({visible: false}))
        }
      })
    }
    EditProject(th)
    {
        this.setState({dotClicked: false})
        this.setState({editing: true});
    }

 render()
 {
    const {user} = this.props.auth0;
    const ProjectsSetingPopUp = () =>{
        return(
<div className="ProjectSetting" >
   <div className="DeleteTimerButton"  onClick={() => this.DeleteProject(user,this)}>Delete
   </div>
   <div className="EditTimerButton" onClick={() => this.EditProject(this)}>Edit
   </div>
    </div>
        )
        }
    return ( <> {this.state.visible ? <li className="ProjectList">
    <div className="ProjectItem"> {this.props.data.projectname}</div>
    <div className="ProjectItem"> {Math.floor(this.props.data.projectseconds/3600)}</div>
    <div className="ProjectItem">{this.props.data.salery}</div>
    <div className="ProjectMoney"> {Math.floor (this.props.data.salery * (this.props.data.projectseconds/3600))}</div>
     <div className=""></div>
     {this.state.editing ? <> <div className="projectBackground"></div> <EditProject parent={this} user={user}/> </>: null}
       <a className="ProjectButtonSetting" onClick={this.handelClick}>
       &#8942;
         </a>
         {this.state.dotClicked ? <ProjectsSetingPopUp /> : <div/> }
     </li> : null}
       
            </>
    )     
    }
}
export default withAuth0(LoadProjects);