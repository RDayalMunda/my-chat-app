import { useEffect, useState } from "react";


import Login from "../login/login";
import Group from "../group/group";
import { getSession } from "../../common/auth";
import Loading from "../loading/loading";
import { getUserData } from "../../common/localstorage";
import BurgerMenu from "./burger-menu";

export default function(){


    let [ inProgress, setInProgress ] = useState(true)
    let [ session, setSession ] = useState("")

    function loginhandler(sessionToken){
        setSession(sessionToken)
        if (sessionToken){
            getUserData().then( userData=> {
                global.socket = global.reconnectSocket( { userId: userData._id } )
            } ).catch( err=>{
                console.log(err)
            } )
        }else{
            global.socket.disconnect()
        }
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
                <>
                    <BurgerMenu loginhandler={loginhandler}/>
                    <Group session={session} loginhandler={loginhandler}/>
                </>
            ):(
                <Login loginhandler={loginhandler} />
            )}
        </>
    )
}