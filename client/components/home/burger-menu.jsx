import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, Animated, Button, TouchableOpacity, Image, ScrollView } from "react-native";
import { androidRipple } from "../../common/styles";
import { logout } from "../../common/auth";
import { getUserData } from "../../common/localstorage";

export default function ({ loginhandler }) {
    let [visible, setVisible] = useState(false)
    var [userData, setUserData] = useState({})
    const [slideAnim] = useState(new Animated.Value(-1000));



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
                                    source={{ uri: `http://192.168.105.212:3081/images/${userData.imageUrl}` }}
                                    style={styles.image}
                                />
                            </Pressable>
                        </View>
                    )
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
                                    <Text style={styles.textCenter}>X</Text>
                                </Pressable>
                            </View>
                            <ScrollView style={styles.modalMainBody}>
                                <View style={{ alignItems: 'center' }}>
                                    <Pressable
                                        android_ripple={androidRipple.light}
                                    >
                                        <Image
                                            source={{ uri: `http://192.168.105.212:3081/images/${userData.imageUrl}` }}
                                            style={[styles.imageProfile ]}
                                        />
                                        <Text style={styles.profileText}>{userData.name}</Text>
                                    </Pressable>
                                </View>

                            </ScrollView>
                            
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Pressable style={ styles.btn } onPress={toLogout}>
                                    <Text style={styles.textCenter}>Logout</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
    },
    logoutBtn: {
        overflow: 'hidden',
        backgroundColor: '#aaa',
        padding: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    animateBox: {
        backgroundColor: '#fff',
        width: '80%',
        height: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        padding: 20,
    },
    modalContent: {
        height: "100%",
        justifyContent: 'space-between'
    },
    btn: {
        backgroundColor: '#7e7e7e',
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
        minHeight: 30,
        minWidth: 30,
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