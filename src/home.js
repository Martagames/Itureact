import React from "react";
import { useAuth0  } from '@auth0/auth0-react';
import "./home.css"
import SidePanel from "./SidePanel"
import History from "./fetch"

function Home (ss)
{//const { isAuthenticated,isLoading } = useAuth0();
    const {  isAuthenticated ,isLoading} = useAuth0();
    if(isLoading)
    { console.log(ss);
        return <h1>Loading</h1>
    }

    if(!isAuthenticated)
    {
        console.log(ss);
        return(
            <h1>Sign-in</h1> 
        )
    }
    return isAuthenticated && ( <div className="HomePage">
        <SidePanel select="home"/>
        <History bol={ss}/>
    </div>
    )
}

export default Home;