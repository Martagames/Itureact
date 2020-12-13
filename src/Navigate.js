import { useAuth0} from '@auth0/auth0-react';
import './App.css';
import React  from 'react';
import { NavLink } from 'react-router-dom';
import "./Navigate.css"
import TimeTracker from "./time_tracker"
import { withAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const {isAuthenticated ,logout, isLoading} = useAuth0();
  
  if (isLoading) {
    return <div ></div>;
  }  
    if(isAuthenticated) {
      return(
        <div className="LogoutButton" onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </div>
        
           )
   }
  /* else{ 
     
       return(
        <div className="LoginButton" onClick={() => loginWithRedirect()}>
        Login
        </div>
        )
    }*/
  
};


const ProfilePic = () => {
  const {loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
 
  if (isLoading) {
    return <div>Loading</div>;
  }
  if(isAuthenticated)
  return (
      
         <img className="profileImg" src={user.picture} alt={user.name}  />

    )
else {
  return(
    <div className="LoginButton" onClick={() => loginWithRedirect()}>
        Login
        </div>
  )
}  
};

class Navigate extends React.Component{ 
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef(null);
   
    this.state = {
      inputLinkClicked: false
    }
    this.handleAddSecondInput = this.handleAddSecondInput.bind(this);
    this.handleAddFirstInput = this.handleAddFirstInput.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  };
handleClickOutside(event) {
    try{
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
     console.log("ClickOutside");
      this.setState({
        inputLinkClicked: false
      });
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
  }
  catch(e){console.log(e);

  }
}
  handleAddFirstInput( ) {
 if(!this.inputLinkClicked){
    console.log("ClickSecond true");
    this.setState({
      inputLinkClicked: true
    });
    document.addEventListener('mousedown', this.handleClickOutside);
  }
}
  handleAddSecondInput( ) {

      console.log("ClickSecond false");
      this.setState({
        inputLinkClicked: false
        
      });
      document.removeEventListener('mousedown', this.handleClickOutside);
  }
    render (){
      const { isAuthenticated } = this.props.auth0;
    return(
      <div className="TopBarWrapper">
      <div className="TopBar">
        <NavLink className="Home" to="./">
            Time taker
            </NavLink>
        <nav className="NavBar">
            <ul className="Line">   
            <li><TimeTracker props={this.props.this}/></li>   
    { isAuthenticated ?  <li ref={this.wrapperRef} onClick={this.handleAddFirstInput}><ProfilePic/></li> : <li> <ProfilePic/></li> }   
        </ul>
        </nav>
         
      { this.state.inputLinkClicked? <div ref={this.wrapperRef} className="profilePop">
  <NavLink onClick={this.handleAddSecondInput} to="./profile"> <div  className="href">Profile</div>
    
  </NavLink>
  <LoginButton/> 
  </div>
   : <div/>}
    
        </div>
        </div>
    )
}   
}
export default withAuth0(Navigate);
