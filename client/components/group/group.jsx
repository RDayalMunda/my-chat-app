import { Text, ScrollView, TouchableOpacity, View, SafeAreaView} from "react-native"
import { useRouter, Stack } from "expo-router"
import { useEffect, useState } from "react"
import api from "../../common/api"

export default function(){
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

    useEffect( ()=>{
        getGroupList()
    }, [] )

    return (
        <ScrollView>
            <Stack.Screen
                options={{
                    title: "My Chat App"
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