import { Text, ScrollView, TouchableOpacity, View, SafeAreaView, Pressable} from "react-native"
import { useRouter, Stack } from "expo-router"
import { useEffect, useState } from "react"
import api from "../../common/api"
import { androidRipple } from "../../common/styles"
import { logout } from "../../common/auth"

export default function({ loginhandler }){
    let router = useRouter()

    var [ groupList, setGroupList ] = useState([])
    function navigateTo(path){
        router.push(path)
    }

    async function getGroupList(){
        try{
            let res = await api.get("/group")
            if (res.data.success){
                groupList = res.data.groupList
                setGroupList(groupList)
            }  
        }catch(err){
            console.log(err)
        }
    }

    async function toLogout(){
        await logout()
        await loginhandler()
    }

    useEffect( ()=>{
        getGroupList()
    }, [] )

    return (
        <ScrollView>
            <Stack.Screen
                options={{
                    title: "My Chat App",
                    headerRight: ()=>(
                        <Pressable android_ripple={androidRipple.dark}
                        onPress={toLogout}
                        >
                            <Text>Logout</Text>
                        </Pressable>
                    )
                }}
            />
            <SafeAreaView>
                { groupList.map( item => (
                    <TouchableOpacity key={item._id}
                    style={{
                        backgroundColor: '#e6e6e6',
                        borderBottomWidth: 1,
                        borderBottomColor: '#000',
                        padding: 20,
                    }}
                    onPress={()=>{ navigateTo("/chat") }}
                    >
                        <Text
                        style={{
                            fontSize: 15,
                        }}
                        >{item.name}</Text>
                    </TouchableOpacity>
                ) ) }
            </SafeAreaView>
        </ScrollView>
    )
}