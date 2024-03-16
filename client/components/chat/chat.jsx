import { Stack } from "expo-router"
import { Text, ScrollView} from "react-native"
export default function(){
    return (
        <ScrollView>
            <Stack.Screen
                options={{
                    title: 'Chat title'
                }}
            />
            <Text>Chat Messages</Text>
        </ScrollView>
    )
}