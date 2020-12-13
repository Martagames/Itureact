import React, {useEffect, useState} from "react";
import { useAuth0  } from '@auth0/auth0-react';
import AddTrackerHistory from "./addhistory";
import "./home.css"
import axios from 'axios';


function Fetch(boj)
{
  const [isLoading, setLoading] = useState(true);
    const { user } = useAuth0();
    const [inputEl, setInputEl] = useState(new Map());
    const [numofTimer,setNumber] = useState(12);
    const [loadMore,setloadMore] =useState(true);

   useEffect(  () => {
     async function FetchData() {
    axios.get('http://timetaker.mzf.cz/?method=GetHistory',
        {headers :{ 'content-type': 'application/json' ,"userid": user.sub , "numOfTimers": numofTimer}})
        .then( function (response) {
          var rowCount = 0;
          var ss = JSON.parse(response.data.slice(1021));
          setInputEl( ss.map( history => {
            rowCount++;
              return (<AddTrackerHistory  key={history.trackerid}  data={history} />)  
            }
            )
           )
            setLoading(false);
            if(rowCount < numofTimer)
            {
              console.log(rowCount);
              console.log(numofTimer);
              setloadMore(false);
            }
        }).catch(function (error) {
          console.error(error);
        })
        
      }
        FetchData();

      
},[isLoading,user.sub,loadMore,numofTimer,boj])
function Loadmore(){
  setNumber(numofTimer+10);
  console.log(numofTimer);
}
if(isLoading)
{return <h1>Loading - fetch</h1>}

  return ( <div className="MainPanel"> 
<h1>History</h1>  
  <ul className = "history" >{inputEl}</ul>
       {loadMore ? <div className="LoadMoreButton" onClick={Loadmore}>Load more </div> : null}
  </div>)

}
export default Fetch;