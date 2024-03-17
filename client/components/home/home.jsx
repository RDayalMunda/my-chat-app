import Login from "../login/login";
import Group from "../group/group";
import { useEffect, useState } from "react";
import { getSession } from "../../common/auth";
import Loading from "../loading/loading";
export default function(){


    let [ inProgress, setInProgress ] = useState(true)
    let [ session, setSession ] = useState("")

    function loginhandler(sessionToken){
        setSession(sessionToken)
    }

    useEffect( ()=>{
        !( async function(){
            let sessionToken = await getSession()
            if (sessionToken){
                loginhandler(sessionToken)
            }
            setInProgress(false)
        } )()
    }, [] )

    return (
        <>
            {
            inProgress? (
                <Loading />
            ):session? (
                <Group session={session} loginhandler={loginhandler}/>
            ):(
                <Login loginhandler={loginhandler} />
            )}
        </>
    )
}