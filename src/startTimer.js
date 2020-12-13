import { useAuth0,isAuthenticated } from '@auth0/auth0-react';
import moment  from "moment"
import "./time_tracker.js"
import "./time_tracker.css";
import  {useEffect,useState, Component} from "react"
class Timer extends Component
{
    constructor(props) {
        super(props);
       
    //const [seconds, setSeconds] = useState(0);
    this.state = {
        isRuning :this.props.isRuning ,
        seconds: 0 
      }
    }
    handleChange = event => {
    var timer;
    
        if(this.state.isRuning)
        {
         this.timer = this.setInterval( () =>{
            this.setState({seconds : this.state.seconds +1});
            }, 1000); 
            
        }
    }
    componentDidMount() {
        console.log("adsd");
        this.setState({seconds: 0});

}
 render(){

    return (
        <a className="Time" > {this.state.seconds}</a>
        )
 }
    
}

export default Timer;