import { Stack, useLocalSearchParams } from "expo-router";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { memoiseInstance } from "../../common/utils";
import { useEffect, useState } from "react";
import { getGroupById, getUserData } from "../../common/localstorage";
import ErrorModal from "../modals/error-modal";
import { IMAGE_URL } from "../../common/api";

export default function () {
    let params = useLocalSearchParams()
    const styles = (useColorScheme() == 'dark') ? darkStyle : lighStyle;
    let [groupData, setGroupData] = useState({
        name: "no-name"
    })
    const [errorModal, setErrorModal] = useState({ text: "", title: "Error", modalVisible: false })
    const closeErrorModal = () => { setErrorModal(oldData => ({ ...oldData, modalVisible: false })) }

    useEffect(() => {
        getUserData().then((udata) => {
            console.log('udata', udata)
            getGroupById(params.groupId).then((gData) => {
                console.log('grop', gData)
                setGroupData( oldData=> ( !gData.isDirect?gData:
                    gData.participants?.length==1?gData.participants[0]:
                    (gData.participants[0]._id==udata._id)?gData.participants[1]:
                    gData.participants[0] )
                )
            }).catch((err) => {
                setErrorModal(oldData => ({ ...oldData, modalVisible: true, text: JSON.stringify(err) }))
            })
        }).catch((err) => {
            setErrorModal(oldData => ({ ...oldData, modalVisible: true, text: JSON.stringify(err) }))
        })
    }, [])
    return (
        <SafeAreaView>
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
                    <Image style={styles.profileImage} source={{uri: memoiseInstance( groupData.imageUrl, ()=>( `${IMAGE_URL}/${groupData.imageUrl}` ) )}} />
                </View>
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
                { groupData?.participants?.length?(
                    <View>
                        <Text style={[styles.headingText]}>Participants List</Text>
                        { groupData?.participants?.map( group=>(
                            <TouchableOpacity key={group._id}>
                                <Text>{group.name}</Text>
                            </TouchableOpacity>
                        ) ) }
                    </View>
                ):(<></>) }
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

const lighStyle = StyleSheet.create({
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
    btnGroup:{
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imageBtn: {
        width: 15,
        height: 15,
    },

    headingText: {
        textAlign:"center",
        fontSize: 20,
        paddingVertical: 5,
    }

})

const darkStyle = StyleSheet.create({
    ...lighStyle,
})