import { Stack, useLocalSearchParams } from "expo-router";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { memoiseInstance } from "../../common/utils";
import { useEffect, useState } from "react";
import { getGroupById, getUserData } from "../../common/localstorage";
import ErrorModal from "../modals/error-modal";
import { IMAGE_URL } from "../../common/api";

export default function () {
    let params = useLocalSearchParams()
    const styles = (useColorScheme() == 'dark') ? darkStyle : lightStyle;
    let [groupData, setGroupData] = useState({
        name: "no-name",
        canChangeImage: false
    })
    const [errorModal, setErrorModal] = useState({ text: "", title: "Error", modalVisible: false })
    const closeErrorModal = () => { setErrorModal(oldData => ({ ...oldData, modalVisible: false })) }

    useEffect(() => {
        getUserData().then((udata) => {
            getGroupById(params.groupId).then((gData) => {
                let canChangeImage = !gData.isDirect ? true :
                    (gData.participants?.length == 1 && gData.participants[0]._id == udata._id) ? true :
                        false;
                let isDirect = gData.isDirect

                groupData = !gData.isDirect ? gData :
                    gData.participants?.length == 1 ? gData.participants[0] :
                        (gData.participants[0]._id == udata._id) ? gData.participants[1] :
                            gData.participants[0];

                groupData.canChangeImage = canChangeImage;
                groupData.isDirect = isDirect

                setGroupData(oldData => groupData)
            }).catch((err) => {
                setErrorModal(oldData => ({ ...oldData, modalVisible: true, text: JSON.stringify(err) }))
            })
        }).catch((err) => {
            setErrorModal(oldData => ({ ...oldData, modalVisible: true, text: JSON.stringify(err) }))
        })
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: () => (<Text style={styles.headerTitle}>{groupData?.name}</Text>),
                    statusBarColor: styles.statusbar.color,
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.text,
                    headerTintColor: styles.text.color,
                }}
            />
            <ScrollView>
                <View>
                    <Image style={styles.profileImage} source={{ uri: memoiseInstance(groupData.imageUrl, () => (`${IMAGE_URL}/${groupData.imageUrl}`)) }} />
                </View>
                {groupData.canChangeImage ? (
                    <View style={styles.btnGroup}>
                        <TouchableOpacity style={styles.btn}>
                            <Image style={styles.imageBtn} source={require("../../assets/images/eye.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn}>
                            <Image style={styles.imageBtn} source={require("../../assets/images/upload.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn}>
                            <Image style={styles.imageBtn} source={require("../../assets/images/trash.png")} />
                        </TouchableOpacity>
                    </View>
                ) : (<></>)}
                {groupData?.participants?.length ? (
                    <View>
                        <Text style={[styles.text, styles.headingText]}>Participants</Text>
                        <View style={{alignItems: 'center'}}>

                            <View style={styles.participantsContainer}>
                                {groupData?.participants?.map(user => (
                                    <TouchableOpacity key={user._id} style={styles.participantsBtn}>
                                        <Text style={styles.textBtn}>{user.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                ) : (<></>)}
                {!groupData.isDirect ? (
                    <View style={styles.btnGroup}>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.textBtn}>Leave Group</Text>
                            <Image style={styles.imageBtn} source={require("../../assets/images/exit.png")} />
                        </TouchableOpacity>
                    </View>
                ) : (<></>)}
            </ScrollView>
            <ErrorModal
                title={errorModal.title}
                text={errorModal.text}
                modalVisible={errorModal.modalVisible}
                closeModal={closeErrorModal}
            />
        </SafeAreaView>
    )
}

const lightStyle = StyleSheet.create({
    headerTitle: {
        fontSize: 18,
        paddingLeft: 10,
        color: "#111"
    },
    statusbar: { color: "#154" },
    headerStyle: {
        backgroundColor: "#ddd",
    },
    text: { color: "#111" },
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    profileImage: {
        maxHeight: 200,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 10,
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dedede',
        borderRadius: 5,
        minWidth: 30,
        minHeight: 30,
        marginHorizontal: 3,
    },
    btnGroup: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imageBtn: {
        width: 15,
        height: 15,
        marginHorizontal: 3,
    },
    textBtn: {
        marginHorizontal: 5,
        textAlign: 'center',
    },
    headingText: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 20,
    },
    participantsContainer: {
        paddingBottom: 10,
        paddingHorizontal: 10,
        width: '50%',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    participantsBtn: {
        fontSize: 16,
        marginVertical: 3,
        borderRadius: 5,
        backgroundColor: '#79a',
    },

})

const darkStyle = StyleSheet.create({
    ...lightStyle,
    headerStyle: {
        backgroundColor: "#111",
    },
    text: { color: "#ddd" },
    headerTitle: {
        ...lightStyle.headerTitle,
        color: "#ddd"
    },
    container: {
        ...lightStyle.container,
        backgroundColor: '#222',
    },
})