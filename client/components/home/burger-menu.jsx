import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, Animated, Button, Image, ScrollView, useColorScheme } from "react-native";
import { androidRipple } from "../../common/styles";
import { logout } from "../../common/auth";
import { getUserData } from "../../common/localstorage";
import { IMAGE_URL } from "../../common/api";
import ImageModal from "../modals/image-modal";
import { memoiseInstance } from "../../common/utils";

export default function ({ loginhandler }) {
    let [visible, setVisible] = useState(false)
    var [userData, setUserData] = useState({})
    const [slideAnim] = useState(new Animated.Value(-1000));
    var [ modalData, setModalData ] = useState({ title: "", imageUrl: "", modalVisible: false})
    let colourScheme = useColorScheme()

    let styles = colourScheme=='dark'?darkStyle:lightStyle



    const animateModal = (toValue, toClose) => {

        Animated.timing(
            slideAnim,
            {
                toValue,
                duration: 300,
                useNativeDriver: true,
            }
        ).start(() => {
            if (toClose) setVisible(false)
        });
    }


    async function toLogout() {
        await logout()
        await loginhandler()
    }

    function closeModal(){
        setModalData( oldData=>({ ...modalData, modalVisible: false }) )
    }

    useEffect(() => {


        if (visible) {
            animateModal(0)
        } else {
            animateModal(-1000, true)
        }

    }, [visible])

    useEffect(() => {
        getUserData().then(data => {
            userData = data
            setUserData(oldData => data)
            setModalData( oldData=> ({ ...modalData, title: userData.name, imageUrl: userData.imageUrl }) )
        })
    }, [])

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable
                                android_ripple={androidRipple.light}
                                onPress={() => { setVisible(true) }}
                            >
                                <Image
                                    source={{ uri: memoiseInstance( userData.imageUrl, ()=>(`${IMAGE_URL}/${userData.imageUrl}`) ) }}
                                    style={styles.image}
                                />
                            </Pressable>
                        </View>
                    ),
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.text,
                    statusBarColor: styles.statusbar.color,
                }}
            />

            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
                onRequestClose={() => { animateModal(-1000, true) }}
            >
                <View style={styles.modalBackground}>
                    <Animated.View
                        style={[
                            styles.animateBox,
                            {
                                transform: [{ translateX: slideAnim }],
                            }
                        ]}
                    >
                        <View
                            style={styles.modalContent}
                        >

                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Pressable style={styles.btn} onPress={()=>{ animateModal(-1000, true) }}>
                                    <Image source={require("../../assets/images/close.png")} style={styles.imageBtn} />
                                </Pressable>
                            </View>
                            <ScrollView style={styles.modalMainBody}>
                                <View style={{ alignItems: 'center' }}>
                                    <Pressable
                                        android_ripple={androidRipple.light}
                                        onPress={()=>{ setModalData( ()=>({ ...modalData, modalVisible: true }) ) }}
                                    >
                                        <Image
                                            source={{ uri: memoiseInstance( userData.imageUrl, ()=>(`${IMAGE_URL}/${userData.imageUrl}`) ) }}
                                            style={[styles.imageProfile ]}
                                        />
                                        <Text style={[styles.profileText, styles.text]}>{userData.name}</Text>
                                    </Pressable>
                                </View>

                            </ScrollView>
                            
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Pressable style={ styles.logoutBtn } onPress={toLogout}>
                                    <Text style={[styles.textCenter, { fontSize: 18 }]}>Logout</Text>
                                    <Image source={require("../../assets/images/logout.png")} style={styles.imageBtn} />
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            <ImageModal
            title={modalData.title}
            imageUrl={modalData.imageUrl}
            modalVisible={modalData.modalVisible}
            closeModal={closeModal}
            />
        </View>
    )
}

const lightStyle = StyleSheet.create({
    statusbar: { color: "#154" },
    headerStyle:{
        backgroundColor: "#ddd",
    },
    text: { color: "#111" },
    container: {
        position: 'absolute',
        zIndex: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
        borderColor: '#11111178',
        borderWidth: 1,
    },
    logoutBtn: {
        overflow: 'hidden',
        backgroundColor: '#f54',
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    animateBox: {
        width: '80%',
        height: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        padding: 20,
        backgroundColor: '#eee',
    },
    modalContent: {
        height: "100%",
        justifyContent: 'space-between',
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        minWidth: 30,
        minHeight: 30,
        backgroundColor: '#bbb',
    },
    imageBtn: {
        width: 20,
        height: 20,
    },
    textCenter: {
        textAlign: 'center'
    },
    modalMainBody: {
        flexGrow: 1,
    },
    imageProfile: {
        width: 80,
        height: 80,
        borderRadius: 40,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
        marginTop: 20,
    },
    profileText: {
        textAlign: 'center',
        fontSize: 20,
    }
})
const darkStyle = StyleSheet.create({
    ...lightStyle,
    headerStyle:{
        backgroundColor: "#111",
    },
    text: { color: "#eee" },
    image: {
        ...lightStyle.image,
        borderColor: '#eeeeee',
    },
    btn:{
        ...lightStyle.btn,
        backgroundColor: "#888"
    },
    animateBox: {
        ...lightStyle.animateBox,
        backgroundColor: '#333',
    },
})