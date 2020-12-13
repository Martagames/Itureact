import './App.css';
import {Auth0Provider} from '@auth0/auth0-react';
import Home from "./home";
import profile from "./profile.js"
import {BrowserRouter as Router, Route} from "react-router-dom";
import  Navigate from './Navigate';
import  Projects from './projects';
import { useState } from 'react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientID = process.env.REACT_APP_AUTH0_CLIENT_ID;


function App()
{
   const [updatehistory,SetUpdateHistory] = useState(false);
   return(
  <Auth0Provider domain ={domain} clientId={clientID} redirectUri='https://martagames.github.io/Itureact/'
  scope="read:current_user update:current_user_metadata">
     <div className="App">
  
  <Router>
     <Route path="/" render={() => <Navigate this={updatehistory} />} />
      <Route path="/" exact  render={() => <Home ss={updatehistory} /> }/>
      <Route path="/projects" exact component={Projects}/>
      <Route path="/profile" exact component={profile} />
  </Router>
  </div>
  </Auth0Provider>
)
}
export default App;
