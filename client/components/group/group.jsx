import { Text, ScrollView, TouchableOpacity, View, SafeAreaView, Pressable, Image, StyleSheet, Dimensions, useColorScheme, RefreshControl } from "react-native"
import { useRouter, Stack } from "expo-router"
import { useEffect, useState } from "react"

import api, { IMAGE_URL } from "../../common/api"
import { androidRipple } from "../../common/styles"
import { logout } from "../../common/auth"
import { getUserData, storeInLocal } from "../../common/localstorage"
import ImageModal from "../modals/image-modal"
import { memoiseInstance } from "../../common/utils"

export default function ({ loginhandler }) {
    let router = useRouter()

    var [groupList, setGroupList] = useState([])
    var [userData, setUserData] = useState({})
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        imageUrl: "",
    })
    const [ refreshing, setRefreshing ] = useState(false)
    let styles = (useColorScheme()=='dark')?darkStyle:lightStyle

    function onRefresh(){
        setRefreshing(true)
        setTimeout( ()=>{
            setRefreshing(false)
        }, 2000 )
    }

    function navigateTo(path, query) {
        router.push({
            pathname: path,
            params: query
        })
    }

    async function getGroupList() {
        try {
            let res = await api.get("/group/list", { headers: { userId: userData._id }});
            if (res.data.success) {
                storeInLocal('group-list', res.data.groupList)
                groupList = res.data.groupList
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

    const setupModal = (data) => {
        if (!data.isDirect){
            setModalData({ title: data.name, imageUrl: data.imageUrl })
        } else {
            let user = data.participants[0]._id == userData._id?data.participants[1]:data.participants[0]
            setModalData({ title: user.name, imageUrl: user.imageUrl })
        }
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        getUserData().then(data=>{
            userData = data
            setUserData(oldData=>data)
            getGroupList()
        }).catch( (err)=>{ console.log(err) } )
    }, [])

    return (
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        >
            <Stack.Screen
                options={{
                    title: "My Chat App"
                }}
            />
            <SafeAreaView>
                {groupList.map(item => (
                    <TouchableOpacity key={item._id}
                        style={styles.groupItem}
                        onPress={() => { navigateTo("/chat", { groupId: item._id }) }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <TouchableOpacity onPress={() => { setupModal(item) }} >
                                <Image
                                    source={{
                                        uri: memoiseInstance(
                                            !item?.isDirect?item.imageUrl:(
                                                userData._id==item.participants[0]._id?
                                                item.participants[1].imageUrl:
                                                item.participants[0].imageUrl
                                            ),
                                            ()=>(`${IMAGE_URL}/${!item?.isDirect?item.imageUrl:(
                                                userData._id==item.participants[0]._id?
                                                item.participants[1].imageUrl:
                                                item.participants[0].imageUrl
                                            )}` )
                                        )
                                    }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            
                            <Text
                                style={[ styles.text, {
                                    fontSize: 15,
                                    paddingLeft: 15,
                                } ]}
                            >{
                                !item?.isDirect?item.name:(
                                    userData._id==item.participants[0]._id?
                                    item.participants[1].name:
                                    item.participants[0].name
                                )
                            }</Text>
                        </View>
                        {item?.unseenCount?(
                        <View style={styles.unseenContainer}>
                            <Text style={[styles.unseenCount, styles.text]}>{item.unseenCount}</Text>
                        </View>
                        ):<></>}
                    </TouchableOpacity>
                ))}

                <ImageModal
                    title={modalData.title}
                    imageUrl={modalData.imageUrl}
                    modalVisible={modalVisible}
                    closeModal={closeModal}
                />
            </SafeAreaView>
        </ScrollView>
    )
}

const lightStyle = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
    },
    groupItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#aaa',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        paddingVertical: 8,
        backgroundColor: "#eee",
    },
    unseenContainer: {
        backgroundColor: "#3f5",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center'
    },
    unseenCount: {
        textAlign: 'center',
    },
    text: {
        color: "#000"
    },
});

const darkStyle = StyleSheet.create({
    ...lightStyle,
    
    groupItem: {
        ...lightStyle.groupItem,
        backgroundColor: "#333",
    },
    text: {
        color: "#999"
    },
})