import { Text, ScrollView, TouchableOpacity} from "react-native"
import { useRouter, Stack } from "expo-router"
export default function(){
    let router = useRouter()

    function navigateTo(path){
        router.push(path)
    }

    return (
        <ScrollView>
            <Stack.Screen
                options={{
                    title: "My Chat App"
                }}
            />
            <Text>Group List</Text>
            <TouchableOpacity
            onPress={()=>{ navigateTo("/chat") }}
            >
                <Text>Enter Chat</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}