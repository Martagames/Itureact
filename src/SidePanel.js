import React from "react"
import logo from './SidePaneIcon.png';
import "./Navigate.css"
import { NavLink } from 'react-router-dom';
//<img onClick={this.OpenSidePnale} className="SidePanelButton" src={logo} width="50px"  height="50px"/>
class SidePanel extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            isPanelOpen:false
        }
        this.OpenSidePnale = this.OpenSidePnale.bind(this);
    }
    OpenSidePnale(){
        this.setState(prevState => ({
            isPanelOpen: !this.state.isPanelOpen
        }))
    }
   

    render(){
        var HomeIsSelected = "NotSelected";
        var ProjectIsSelected = "NotSelected";
        switch (this.props.select) {
            case 'projects':
                ProjectIsSelected="Selected";
            break;
            case 'home':
                HomeIsSelected="Selected";
                break;
                
        }
       return(
        <div className="SidePanle">
            <NavLink className={HomeIsSelected} to="./"><h2>Home</h2></NavLink>
            <NavLink className={ProjectIsSelected} to="./projects"><h2>Projects</h2></NavLink>
        
        <h2>Statictic</h2>


    </div> 
 
       )
    }

}
export default SidePanel;