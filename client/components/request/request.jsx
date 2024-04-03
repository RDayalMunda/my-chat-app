import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, Image, View, useColorScheme, Pressable } from "react-native"
import api from "../../common/api";
import { androidRipple } from "../../common/styles";
import AddUserModal from "../modals/add-user-modal";
import { getSession } from "../../common/auth";
import { getUserData } from "../../common/localstorage";


export default function Requests() {
    const router = useRouter()
    // const [inProgress, setInProgress] = useState(false)
    const styles = (useColorScheme() == 'dark') ? darkStyle : lightStyle;
    const [requests, setRequests] = useState([])


    const [showAddUser, setShowAddUser] = useState(false)


    useEffect(() => {

        getUserData().then(async (data) => {

            api.get("/request/all", {
                headers: {
                    sessionToken: await getSession(),
                    userId: data._id
                }
            }).then(({ data }) => {

                console.log('success', data.requests)
                setRequests(() => (data.requests))

            }).catch(err => { console.log(err) })

        }).catch(err => { console.log(err) });


    }, [])

    return (
        <SafeAreaView style={styles.container} >
            <Stack.Screen
                options={{
                    title: "Friend requests",
                    statusBarColor: styles.statusbar.color,
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.text,
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable
                                android_ripple={androidRipple.light}
                                onPress={() => { setShowAddUser(() => (true)) }}
                                style={styles.iconBtn}
                            >
                                <Image
                                    source={require("../../assets/images/add-user.png")}
                                    style={styles.icon}
                                />
                            </Pressable>
                        </View>
                    ),
                }}
            />
            <SafeAreaView>
                <ScrollView style={styles.scrollArea}>
                    {
                        requests.map(request => (

                            <View key={request._id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={[styles.headerTitle, { width: '80%' }]}>Your frinds has requested this line of code from you</Text>
                                <View style={{ flexDirection: 'row', width: '20%'}}>
                                    <Pressable android_ripple={androidRipple.dark} style={styles.iconBtn}>
                                        <Image source={require("../../assets/images/checked.png")} style={styles.icon} />
                                    </Pressable>
                                    <Pressable android_ripple={androidRipple.dark} style={styles.iconBtn}>
                                        <Image source={require("../../assets/images/rejected.png")} style={styles.icon} />
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
            </SafeAreaView>

            <AddUserModal modalVisible={showAddUser} closeModal={() => { setShowAddUser(() => (false)) }} />

        </SafeAreaView>
    )
}


const lightStyle = StyleSheet.create({
    statusbar: { color: "#154" },
    headerStyle: {
        backgroundColor: "#ddd",
    },
    text: { color: "#111" },
    headerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
    },
    headerTitle: {
        fontSize: 18,
        color: "#111",
        textAlign: 'center'
    },

    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    scrollArea: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 70, // Adjust this value to leave space for the input area
        width: Dimensions.get('window').width,
    },
    inputContainer: {
        marginBottom: 10,
    },
    inputArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderColor: '#ccc',
    },
    passwordEye: {
        width: 20,
        height: 20,
        marginEnd: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        maxHeight: Dimensions.get('window').height / 5,
    },
    placeholder: { color: "#777" },
    inputErrorText: { color: '#f00' },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        minWidth: 30,
        minHeight: 30,
        backgroundColor: '#777',
        padding: 10,
        marginTop: 10,
    },
    imageBtn: {
        width: 20,
        height: 20,
    },
    iconBtn: {
        minHeight: 35,
        minWidth: 35,
        marginHorizontal: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain', // Adjust the image resizing mode as needed
        tintColor: '#000',
    },
    textEmoji: {
        fontSize: 24,
        paddingHorizontal: 5,
        paddingBottom: 5,
    }
})

const darkStyle = StyleSheet.create({
    ...lightStyle,
    headerStyle: {
        backgroundColor: "#111",
    },
    container: {
        ...lightStyle.container,
        backgroundColor: '#222'
    },
    text: { color: "#ddd" },
    headerTitle: {
        ...lightStyle.headerTitle,
        color: "#ddd"
    },
    input: {
        ...lightStyle.input,
        backgroundColor: "#444",
        color: "#fff",
    },
})