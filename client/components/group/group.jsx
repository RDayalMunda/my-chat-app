import { Text, ScrollView, TouchableOpacity, View, SafeAreaView, Pressable, Image, StyleSheet } from "react-native"
import { useRouter, Stack } from "expo-router"
import { useEffect, useState } from "react"
import api from "../../common/api"
import { androidRipple } from "../../common/styles"
import { logout } from "../../common/auth"

export default function ({ loginhandler }) {
    let router = useRouter()

    var [groupList, setGroupList] = useState([])
    function navigateTo(path) {
        router.push(path)
    }

    async function getGroupList() {
        try {
            let res = await api.get("/group")
            if (res.data.success) {
                groupList = res.data.groupList
                console.log('groupList', groupList[0])
                setGroupList(groupList)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function toLogout() {
        await logout()
        await loginhandler()
    }

    useEffect(() => {
        getGroupList()
    }, [])

    return (
        <ScrollView>
            <Stack.Screen
                options={{
                    title: "My Chat App",
                    headerRight: () => (
                        <Pressable android_ripple={androidRipple.dark}
                            onPress={toLogout}
                        >
                            <Text>Logout</Text>
                        </Pressable>
                    )
                }}
            />
            <SafeAreaView>
                {groupList.map(item => (
                    <TouchableOpacity key={item._id}
                        style={styles.groupItem}
                        onPress={() => { navigateTo("/chat") }}
                    >
                        <Image
                            source={{ uri: `http://192.168.105.212:3081/images/${item.imageUrl}` }}
                            style={ styles.image }
                        />
                        <Text
                            style={{
                                fontSize: 15,
                            }}
                        >{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
    },
    groupItem: {
        backgroundColor: '#e6e6e6',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});