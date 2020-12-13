import React, {Component, } from "react";
import moment  from "moment"
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import "./addhistory.css"
import DateTimePicker from 'react-datetime-picker';
class AddTrackerHistory extends Component
{
  constructor(props) {
    super(props); 
    
    this.state = {
      dotClicked: false,
      visible:true,
      editing:false,
      oldinput : this.props.data.name,
      nameinput: this.props.data.name,
      project: this.props.data.projectname,
      projectid: this.props.data.projectid,
      projectArr: [],
      openProject:false,
      displayDateTimePicker: false,
      displayDateTimePickerStop: false,
      startDateTime: new Date(this.props.data.trackerstart),
      stopDateTime: new Date(this.props.data.trackerstop)
    }
    this.handelClick = this.handelClick.bind(this);
    this.ConfirmEdit = this.ConfirmEdit.bind(this);
    this.CancleEdit = this.CancleEdit.bind(this);
   this.LoadProjects = this.LoadProjects.bind(this);
  }
  CancleEdit() {this.setState({editing :false ,nameinput : this.state.oldinput})
  this.setState({openProject:false});
  this.setState({displayDateTimePicker:false});
  this.setState({displayDateTimePickerStop:false});
};
  handelClick(){
    this.setState(prevState => ({dotClicked: !this.state.dotClicked}))
    }
    DeleteTimer(user_id,th){
      
      axios.post('http://timetaker.mzf.cz/?method=Delete',
        {'content-type': 'application/json' ,"user_id": user_id.sub , "trackerid":this.props.data.trackerid})
      .then( function (response) {
        var data = response.data.slice(1021);
        if(data === "true")
        {
          th.setState( ({visible: false}))
        }
      })
     }
     EditTimer(th){
      this.setState({dotClicked: false})
      th.setState( {editing: true});
      
     }

      ConfirmEdit () {
        const {user} = this.props.auth0;
        const th =this;
        axios.post('http://timetaker.mzf.cz/?method=Edit',
        {'content-type': 'application/json' ,"user_id": user.sub , "trackerid":this.props.data.trackerid,
        "trackername" : this.state.nameinput, "projectid": this.state.projectid ,
         "trackerstart": moment(th.state.startDateTime).format("Y-MM-DD HH:mm:ss"),
        "trackerstop" :  moment(th.state.stopDateTime).format("Y-MM-DD HH:mm:ss") })
      .then( function (response) {
        var data = response.data.slice(1021);
        if(data === "false")
        {
          console.log("Error");
        }
        else
        {
          th.setState({editing: false, oldinput : th.state.nameinput, displayDateTimePickerStop:false,displayDateTimePickerStop:false})
        }
      
      })
   
    }
    ClickProject(project)
    {
      this.setState({project : project.projectname ,projectid: project.projectid
      ,openProject:false});
    }
    LoadProjects(user,th){
      if(th.state.openProject === false)
      {
      console.log("daasd");
      axios.get('http://timetaker.mzf.cz/?method=GetProjects',
      {headers :{"userid": user.sub }})
      .then( function (response) {
          var data = JSON.parse(response.data.slice(1021));
          th.setState({projectArr: data.map( project => {
              return (
              <li className="ProjectSlItem" onClick={() =>th.ClickProject(project)} key={ project.projectid}>{project.projectname} </li>
              )
                      }) 
                    })
      })
      th.setState({openProject: true});
    }
    else
    {
      th.setState({openProject: false});
    }

    }
    EditDateTime(th,num){
      
      if(th.state.editing)
      {
        if(num == 0)
        {
          if(th.state.displayDateTimePicker === false)
              th.setState({displayDateTimePicker: true});
          else
          th.setState({displayDateTimePicker: false});
          }
        
        else if(num == 1)
        {
          console.log(num);
          if(th.state.displayDateTimePickerStop === false)
          th.setState({displayDateTimePickerStop: true});
          else
          th.setState({displayDateTimePickerStop: false});
        }
      }

   }
   
     
  a = moment(this.props.data.trackerstop,"YYYY-MM-DD HH:mm:ss");
  b = moment(this.props.data.trackerstart,"YYYY-MM-DD HH:mm:ss");
  diff = moment.duration( this.a.diff(this.b)).asSeconds();
    render(){
      const {user} = this.props.auth0;
      var TrackerHistory = this.state.editing ? "TrackerHistoryEditing" :"TrackerHistory";
      const HistorySetingPopUp = () =>{
        return(
<div className="HistorySeting" >
   <div className="DeleteTimerButton"  onClick={() => this.DeleteTimer(user,this)}>Delete
   </div>
   <div className="EditTimerButton" onClick={() => this.EditTimer(this)}>Edit
   </div>
    </div>
        )
        
        }
        return( <div> { this.state.visible ? <li key={this.props.data.trackerid} className={TrackerHistory} >
          <div className="HistoryTopBar">
          <input className="TrackerName" value={this.state.nameinput} onInput={e => this.setState({nameinput: e.target.value})} disabled={!this.state.editing} />
          
          <div className="TrackerTime">
            
          {("0" + Math.floor(this.diff/3600)).slice(-2)}:{("0" + Math.floor((this.diff%3600)/60)).slice(-2)}:{("0" + Math.floor((this.diff%60))).slice(-2)}
          </div>
          </div>
          <div className="SecondLine">
             
          <div className="TrackerDate"> Start: </div> <div onClick={() => this.EditDateTime(this,0)}>{moment.utc(this.props.data.trackerstart).format("DD.MM.YY HH:mm") } </div>
          <div>   Stop: </div> <div onClick={() => this.EditDateTime(this,1) }>{moment.utc(this.props.data.trackerstop).format("DD.MM.YY HH:mm") }</div>
              <div>Project</div>
              <button className="Projectselect"  onClick={ () =>this.LoadProjects(user,this)}  disabled={!this.state.editing}> {this.state.project} </button>
              {this.state.openProject ? <ul className="ProjectsWindowInHistory"> {this.state.projectArr}</ul> : null}
              <div></div>
             {this.state.editing ? <div className="EditingButtons"> <div className="CancleEdit" onClick={this.CancleEdit}>Cancel </div>
              <div className="ConfirmEdit" onClick={this.ConfirmEdit}>Confirm </div>  </div> : null}
             {this.state.displayDateTimePicker ?  <div className="timePicker"> <DateTimePicker format="y-MM-dd HH:mm:ss" onChange={(value) => this.setState({startDateTime : value})} value={this.state.startDateTime}/> <div onClick={() => this.EditDateTime(this,0)}>X </div> </div>: null}
             {this.state.displayDateTimePickerStop ?  <div className="timePicker"> <DateTimePicker minDate={this.state.startDateTime} format="y-MM-dd HH:mm:ss" onChange={(value) => this.setState({stopDateTime : value})} value={this.state.stopDateTime}/> <div onClick={() => this.EditDateTime(this,1)}>X </div> </div>: null}
             {!this.state.editing ?<div className="HistorybuttonSetting" onClick={this.handelClick}>
              &#8942;
                </div> :null } 
            </div>
          {this.state.dotClicked ? <HistorySetingPopUp/> : <div/> }
      </li> : null}</div> );

    }
}
export default withAuth0(AddTrackerHistory);