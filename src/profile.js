import React, {  useEffect  } from 'react';
import { useAuth0} from '@auth0/auth0-react';

import './profile.css'

const Auth = () =>  {
  //var locItems =[];
  const {user, isAuthenticated,isLoading,
    getAccessTokenSilently } = useAuth0();
    

 useEffect( ()  =>{
  
  var token ;
  async function fetchData() {
 try {
    token = await getAccessTokenSilently({
     audience: 'https://dev--us6eczp.eu.auth0.com/api/v2/',
     scope: 'read:clients',
   });
 
 } catch (e) {
   console.error(e);
 }
 }
 fetchData();
})
      if (isLoading ){
       
          return <div className="loading"></div>;
  
        }

        
    return ( 
      isAuthenticated  &&(
          <div className="info">
            <img  src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{user.sub}</p>
          </div>
        )
      )
  
  }
export default Auth;

