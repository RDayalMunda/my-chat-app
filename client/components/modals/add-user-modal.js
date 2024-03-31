import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, useColorScheme, ScrollView, TextInput, Pressable, Dimensions } from "react-native"
import { androidRipple } from "../../common/styles";
import { createRef, useEffect, useRef, useState } from "react";
import { getUserData } from "../../common/localstorage";
import api from "../../common/api";
import { getSession } from "../../common/auth";

export default function AddUserModal({ modalVisible, closeModal }) {

    const styles = (useColorScheme() == 'dark') ? darkStyle : lightStyle;

    const [friend, setFriend] = useState({ userName: "", message: "" })

    const [userData, setUserData] = useState({})
    const [inProgress, setInProgress] = useState(false)

    const inputRefs = { input1: useRef(), input2: useRef() }
    const handleEnter = function (name) {
        if (name == 'input1' && inputRefs.input2.current) {
            inputRefs.input2.current.focus();
        } else if (name == 'input2' && inputRefs.input2.current) {
            inputRefs.input2.current.blur();
        }
    }

    async function sendFriendRequest() {
        try {
            if (inProgress) {
                return
            }
            setInProgress( ()=>(true) )
            if (!friend.userName){
                throw "Enter a username to send request to"
            }
            if (!friend.message.trim()){
                friend.message = `Hey it is your friend ${userData.name}`
            }
            let {data } = await api.post("/request", friend , {
                headers: {
                    userId: userData._id,
                    sessionToken: await getSession()
                }
            })
        } catch (err) {
            console.log(err)
        }
        setInProgress( ()=>(false) )
    }

    useEffect(() => {
        if (modalVisible){
            getUserData().then(data => {
                setUserData(oldData => data)
            })
        }
    }, [modalVisible])


    return (

        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >


            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Request</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.btn}>
                            <Image source={require("../../assets/images/close.png")} style={styles.imageBtn} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView>
                        <View style={styles.inputArea}>
                            <TextInput
                                ref={inputRefs.input1} returnKeyType="next"
                                style={styles.input} onSubmitEditing={() => { handleEnter('input1') }}
                                placeholder="Enter the username of your friend" placeholderTextColor={styles.placeholder.color}
                                value={friend.userName} onChangeText={(text) => (setFriend((old) => ({ ...old, userName: text })))}
                            />
                        </View>
                        <View style={styles.inputArea}>
                            <TextInput
                                ref={inputRefs.input2} returnKeyType="done"
                                style={styles.input} onSubmitEditing={() => (handleEnter('input2'))}
                                placeholder={`Hey its your friend ${userData.name}`} placeholderTextColor={styles.placeholder.color}
                                value={friend.message} onChangeText={(text) => (setFriend((old) => ({ ...old, message: text })))}
                            />
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Pressable
                            style={styles.textBtn}
                            android_ripple={androidRipple.dark}
                            onPress={sendFriendRequest}
                        >
                            <Text>Send Request</Text>
                        </Pressable>
                        <Pressable
                            style={styles.textBtn}
                            android_ripple={androidRipple.dark}
                            onPress={() => {
                                setFriend(() => ({ userName: "", message: "" }))
                                closeModal()
                            }}
                        >
                            <Text>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

        </Modal>
    )
}
const lightStyle = StyleSheet.create({
    text: { color: "#111" },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        // height: '50%',
        borderRadius: 10,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        color: '#000'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dedede',
        borderRadius: 5,
        minWidth: 30,
        minHeight: 30,
    },
    textBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#dedede',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    imageBtn: {
        width: 15,
        height: 15,
    },
    inputArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        maxHeight: Dimensions.get('window').height / 5,
    },
    placeholder: {
        color: "#777"
    }
});

const darkStyle = StyleSheet.create({
    ...lightStyle,
    text: { color: "#eee" },
    modalContent: {
        ...lightStyle.modalContent,
        backgroundColor: "#333",
    },
    title: {
        ...lightStyle.title,
        color: '#eee'
    },
    input: {
        ...lightStyle.input,
        backgroundColor: "#444",
        color: "#fff",
    },
})