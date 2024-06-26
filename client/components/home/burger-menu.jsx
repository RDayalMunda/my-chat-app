import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, Animated, Button, Image, ScrollView, useColorScheme, SafeAreaView, Platform } from "react-native";
import DocumentPicker from 'react-native-document-picker'

import { androidRipple } from "../../common/styles";
import { logout } from "../../common/auth";
import { getUserData, updateInLocal } from "../../common/localstorage";
import api, { IMAGE_URL } from "../../common/api";
import ImageModal from "../modals/image-modal";
import { memoiseInstance } from "../../common/utils";
import AddUserModal from "../modals/add-user-modal";

export default function ({ loginhandler }) {


    const router = useRouter()

    let [visible, setVisible] = useState(false)
    var [userData, setUserData] = useState({})
    const [slideAnim] = useState(new Animated.Value(-1000));
    var [modalData, setModalData] = useState({ title: "", imageUrl: "", modalVisible: false })
    let colourScheme = useColorScheme()


    const [showAddUser, setShowAddUser] = useState(false)

    const [imageEditVisible, setImageEditVisible] = useState(false);

    let styles = colourScheme == 'dark' ? darkStyle : lightStyle

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

    function closeModal() {
        setModalData(oldData => ({ ...modalData, modalVisible: false }))
    }

    async function selectImage() {
        try {
            const res = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                type: DocumentPicker.types.images,
            });
            if (!res.length) return
            const formData = new FormData();
            formData.append('file', {
                uri: Platform.OS == 'android' ? res[0].uri : res[0].uri.replace('file://', ''),
                type: res[0].type,
                name: res[0].name,
            })
            formData.append('userId', userData._id)
            formData.append('oldImageUrl', userData.imageUrl)
            const { data } = await api.post("/user/profile-image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            await updateInLocal('user-data', { imageUrl: data.imageUrl })
            setUserData(oldData => ({ ...oldData, imageUrl: data.imageUrl }))
            setImageEditVisible(() => (false))

        } catch (err) {
            console.log(err)
        }
    }

    function goToFriendRequests() {
        setVisible(()=>(false))
        router.push({
            pathname: "request",
        })
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
            setModalData(oldData => ({ ...modalData, title: userData.name, imageUrl: userData.imageUrl }))
        })
    }, [])

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Pressable
                                android_ripple={androidRipple.light}
                                onPress={() => {
                                    router.push({
                                        pathname: "notification"
                                    })
                                }}
                                style={styles.iconBtn}
                            >
                                <Image
                                    source={require("../../assets/images/add-user.png")}
                                    style={styles.icon}
                                />
                            </Pressable> */}
                            <Pressable
                                android_ripple={androidRipple.light}
                                onPress={() => { setVisible(true) }}
                            >
                                <Image
                                    source={{ uri: memoiseInstance(userData.imageUrl, () => (`${IMAGE_URL}/${userData.imageUrl}`)) }}
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

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Pressable style={styles.btn} onPress={() => { animateModal(-1000, true) }}>
                                    <Image source={require("../../assets/images/close.png")} style={styles.imageBtn} />
                                </Pressable>
                            </View>
                            <ScrollView style={styles.modalMainBody}>
                                <View style={{ alignItems: 'center' }}>
                                    <Pressable
                                        android_ripple={androidRipple.light}
                                        onPress={() => { setModalData(() => ({ ...modalData, modalVisible: true })) }}
                                    >
                                        <Image
                                            source={{ uri: memoiseInstance(userData.imageUrl, () => (`${IMAGE_URL}/${userData.imageUrl}`)) }}
                                            style={[styles.imageProfile]}
                                        />
                                        <Text style={[styles.profileText, styles.text]}>{userData.name}</Text>
                                    </Pressable>
                                    <Pressable style={styles.btn} android_ripple={androidRipple.light} onPress={() => { setImageEditVisible(() => (true)) }}>
                                        <Image style={styles.imageBtn} source={require("../../assets/images/edit.png")} />
                                    </Pressable>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 20, }}>
                                    <Pressable
                                        android_ripple={androidRipple[colourScheme == 'dark' ? 'light' : 'dark']}
                                        onPress={() => { setShowAddUser(() => (true)) }}
                                        style={styles.iconBtn}
                                    >
                                        <Image
                                            source={require("../../assets/images/add-user.png")}
                                            style={styles.icon}
                                        />
                                    </Pressable>
                                    <Pressable
                                        android_ripple={androidRipple[colourScheme == 'dark' ? 'light' : 'dark']}
                                        onPress={goToFriendRequests}
                                        style={[styles.iconBtn, { paddingHorizontal: 10, }]}
                                    >
                                        <Text style={styles.text}>Friend Requests</Text>
                                    </Pressable>
                                </View>

                            </ScrollView>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Pressable style={styles.logoutBtn} onPress={toLogout}>
                                    <Text style={[styles.textCenter, { fontSize: 18 }]}>Logout</Text>
                                    <Image source={require("../../assets/images/logout.png")} style={styles.imageBtn} />
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            <Modal
                transparent={true}
                visible={imageEditVisible}
                animationType="fade"
            >

                <View style={styles.moreOptionBackground}>

                    <SafeAreaView style={styles.moreOptionContent}>
                        <ScrollView>

                            <Pressable style={[styles.option, styles.optionHandle]}></Pressable>
                            <Pressable style={styles.option} android_ripple={androidRipple.light}
                                onPress={selectImage}
                            >
                                <Image style={styles.imageBtn} source={require("../../assets/images/upload.png")} />
                                <Text style={styles.textCenter}>Upload Image</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.option, { backgroundColor: '#f00' }]} android_ripple={androidRipple.light}
                                onPress={() => { setImageEditVisible(() => (false)) }}
                            >
                                <Image style={styles.imageBtn} source={require("../../assets/images/close.png")} />
                                <Text style={styles.textCenter}>Close</Text>
                            </Pressable>
                        </ScrollView>

                    </SafeAreaView>
                </View>
            </Modal>

            <ImageModal
                title={modalData.title}
                imageUrl={modalData.imageUrl}
                modalVisible={modalData.modalVisible}
                closeModal={closeModal}
            />

            <AddUserModal modalVisible={showAddUser} closeModal={() => { setShowAddUser(() => (false)) }} />
        </View>
    )
}

const lightStyle = StyleSheet.create({
    statusbar: { color: "#154" },
    headerStyle: {
        backgroundColor: "#ddd",
    },
    text: { color: "#111" },
    container: {
        position: 'absolute',
        zIndex: 10,
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
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
        borderColor: '#11111178',
        backgroundColor: '#888',
        borderWidth: 1,
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
    },
    moreOptionBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    moreOptionContent: {
        maxHeight: '50%',
        justifyContent: 'space-between',
    },
    option: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 30,
        minHeight: 30,
        backgroundColor: '#bbb',
        gap: 5,
    },
    optionHandle: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#aaa',
        minHeight: 20,
    }
})
const darkStyle = StyleSheet.create({
    ...lightStyle,
    headerStyle: {
        backgroundColor: "#111",
    },
    text: { color: "#eee" },
    image: {
        ...lightStyle.image,
        borderColor: '#eeeeee',
    },
    btn: {
        ...lightStyle.btn,
        backgroundColor: "#888"
    },
    icon: {
        ...lightStyle.icon,
        tintColor: '#aaa'
    },
    animateBox: {
        ...lightStyle.animateBox,
        backgroundColor: '#333',
    },
})