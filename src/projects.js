import React, {Component} from "react";
import "./home.css"
import "./projects.css"
import SidePanel from "./SidePanel"
import ProjectLine from "./projectlist"
import { withAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
class NewProject extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            ProjectName: '',
            Salery: 0
        }
    this.CancelNew = this.CancelNew.bind(this);
    this.AddNew = this.AddNew.bind(this);
    }
    CancelNew(){
        this.props.parent.setState({newProject :false});
    }
    AddNew(user,th){
        axios.post('http://timetaker.mzf.cz/?method=AddProject',
            {"userid": user.sub, "projectname":this.state.ProjectName, "salery": this.state.Salery })
            .then( function (response) {
                var data = response.data.slice(1021);
                if(data == "true")
                {
                    th.props.parent.setState({newProject :false}); 
                    th.props.parent.setState({isLoad :false}); 
                }
                else
                {
                    alert("Error occured while creating new project try again ");
                }
            })
    }
    render(){
        return (<>
            <div className="NewProjectPopUp">
                <h3>Create new project </h3>
                <div className="NewProjectGrid">
                <a>ProjectName </a>  <input onInput={e => this.setState({ProjectName: e.target.value})} type="text" className="NewProjkectItem"/>
                <a>Salery</a>  <input onInput={e => this.setState({Salery: e.target.value})} type="number" min='0' className="NewProjkectItem"/>
                 <div></div> <div className="ConfirmButton"  onClick={() => this.AddNew(this.props.user,this) }>Confirm </div> 
                </div>
                <div className="CancelButton" onClick={this.CancelNew}>X</div>
                </div>
    </>
        )
    }
    }
function Load(th,user)
    {
        
        if(!th.state.isLoad)
        {
            console.log("daasd");
            axios.get('http://timetaker.mzf.cz/?method=GetProjects',
            {headers :{"userid": user.sub }})
            .then( function (response) {
                var data = JSON.parse(response.data.slice(1021));
                th.setState( {
                        ProjectArr:  data.map( project => {
                             return (<ProjectLine parent={th} key={ project.projectid} data={project} />)
                            }) }
                    )
            })
            th.setState( {isLoad :true});
        }
        
    }

class Projects extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            ProjectArr :[],
            isLoad: false,
            newProject :false
        }
        this.handelClick = this.handelClick.bind(this);
    }
    handelClick()
    {

        console.log("asdgfsd");
        this.setState({newProject: true});
    }
  
    render () {
        const {user,isAuthenticated,isLoading} = this.props.auth0;
        if(!isLoading && isAuthenticated)
        {
            Load(this,user);
        }
        if(isLoading)
        {
            return <h1>Loading</h1>
        }
        
        if(!isAuthenticated)
        {
            return(
                <h1>Sign-in</h1> 
            )
        }
   
        return isAuthenticated &&  (  <div className="HomePage">
            <SidePanel select="projects"/>
            <div className="ProjectsPanel">
                <div className="AddProject" onClick={this.handelClick}><span className="PlusSymbol">+</span></div>
                <div className="ProjectHeaderLine">
                <div></div> <h3>Project name</h3>    <h3>Houres</h3>    <h3>Salery/h</h3>    <h3>Money</h3>
                </div>
                <ul className="ProjectsWindow">
                {this.state.ProjectArr}
                </ul>
                </div>
               {this.state.newProject ?<> <div className="projectBackground"></div> <NewProject parent={this} user={user}/></> :null }
            </div>
        )


    }
}
export default withAuth0(Projects);