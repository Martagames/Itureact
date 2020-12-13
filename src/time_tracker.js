import React, {useState, useEffect } from "react";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import moment  from "moment"
import "./time_tracker.css";
import projecticon from "./complete.svg"

function TimeTracker (props)
{
    const {user,isAuthenticated} = useAuth0();
    const [runing,SetState] = useState(false)
    const [input, setInput] = useState(''); 
    const [stTime, setStart] = useState(0); 
    const [seconds, setSeconds] = useState(0);
    const [selecting,setSelecting] = useState(false);
    const [projectArr,setProjectArr] = useState([]);
    const [selectedProject,setSelectedProject] = useState(-1);
    var timer;
    useEffect(() => {
        if(isAuthenticated ){
            if(seconds === 0)
            {
                axios.post('http://timetaker.mzf.cz?method=IsRuning',{
                "user_id": user.sub
            })
            .then(function (response) {
                var data = response.data.slice(1021);
                if(data !== "false")
                {
                    setStart(data);
                    SetState(true);
                }
                else
                {
                    SetState(false);
                }
            } )
                    }
         
    if(runing)
    {
        timer = setInterval( () =>{
            setSeconds(Math.floor( moment(moment.now()).diff(stTime) /1000) );
            }, 1000); 
            return () => clearInterval(timer);
    }
}
      },[isAuthenticated,runing,seconds]);
      function ClickProject(project)
      {
        setSelectedProject(project.projectid);
        setSelecting(false)
      }
      function LoadProjects(){
        console.log("daasd");
        axios.get('http://timetaker.mzf.cz/?method=GetProjects',
        {headers :{"userid": user.sub }})
        .then( function (response) {
            var data = JSON.parse(response.data.slice(1021));
            setProjectArr( data.map( project => {
                return (
                <li className="ProjectSelectItem" onClick={() =>ClickProject(project)} key={ project.projectid}>{project.projectname} </li>
                )
                        }) 
                )
        })
    
    }
    const StartTimer = (() => 
    {
        if(isAuthenticated ){
            if(!runing)
            {
                if(selectedProject !== -1)
                {
                    axios.post('http://timetaker.mzf.cz/?method=StartTimer',
                    {'content-type': 'application/json' ,"user_id": user.sub, 
                    "startTime":moment(moment.now()).format("YYYY-MM-DD HH:mm:ss") ,"projectid":selectedProject})
                    .then(function (response) {
                        var data = response.data.slice(1021);
                    if(data === "Error: 1")
                    {
                        console.log(data);
                        SetState(false);
                                            }
                    else
                    {    setStart(moment.now());
                        SetState(true);  
                    }
                    })
                }
                else
                {
                    alert("Please select project");
                }
                
            }
            else { 
                if(input === "")
                alert("Tracker must be named");
                else
                {
                axios.post('http://timetaker.mzf.cz/?method=EndTimer',
                    {'content-type': 'application/json' ,"user_id": user.sub ,
                    "endTime":moment(moment.now()).format("YYYY-MM-DD HH:mm:ss"),
                    "trackerName": input})
                    .then (function (response) {
                        var data = response.data.slice(1021);
                        if(data !== "Error: 2")
                        {
                            SetState(false);
                            console.log(props= true);
                        }
                        setInput('');
                        setSeconds(0);
                    })
                }
            }

            }

    }  ) 

    const SelectProject = ( ()=> {
        if(selecting === false)
        {
            LoadProjects();
            setSelecting(true);
        }
            
        else
            setSelecting(false);
    })
    return isAuthenticated && (
        <div className="timeTracker">
           <div className="SelectProject"  onClick={SelectProject}>
           <span className="tooltiptext">Tooltip text</span>
               <img className="SelectProjectIcon"  src={projecticon}/>
               </div>
               {selecting ? <div className="SelectProjectPopUp"> SelectProject <ul className="ProjectSelectList">{projectArr}</ul> </div> : null}
            <input placeholder="What are you doing ?"  className="trackerName"  inputMode="text" value={input} onInput={e => setInput(e.target.value)   }>
            </input>
            {runing ?
            <a className="Time">{ Math.floor(seconds/3600) +moment.utc(seconds*1000).format(":mm:ss") } </a>
               : <a/>}
            <div className="startTrackerButton" onClick={StartTimer}> 
                {runing ? <div className="PauseSymbol"></div> : <div className="PlaySymbol"></div>  }
             </div>
             
        </div>
    )

}
export default TimeTracker;