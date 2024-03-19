import { Text, ScrollView, TouchableOpacity, View, SafeAreaView, Pressable, Image, StyleSheet, Dimensions } from "react-native"
import { useRouter, Stack } from "expo-router"
import { useEffect, useState } from "react"

import api, { IMAGE_URL } from "../../common/api"
import { androidRipple } from "../../common/styles"
import { logout } from "../../common/auth"
import { getUserData, storeInLocal } from "../../common/localstorage"
import ImageModal from "../modals/image-modal"

export default function ({ loginhandler }) {
    let router = useRouter()

    var [groupList, setGroupList] = useState([])
    var [userData, setUserData] = useState({})
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        imageUrl: "",
    })

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
        <ScrollView>
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
                                    source={{ uri: `${IMAGE_URL}/${!item?.isDirect?item.imageUrl:(
                                        userData._id==item.participants[0]._id?
                                        item.participants[1].imageUrl:
                                        item.participants[0].imageUrl
                                    )}` }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            
                            <Text
                                style={{
                                    fontSize: 15,
                                    paddingLeft: 15,
                                }}
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
                            <Text style={styles.unseenCount}>{item.unseenCount}</Text>
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

const styles = StyleSheet.create({
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: Dimensions.get('window').width - 30,
        // height: Dimensions.get('window').height-30,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        flexDirection: 'row',
        verticalAlign: 'middle',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalImage: {
        width: '100%',
        resizeMode: 'contain',
        minHeight: Dimensions.get('window').width,
    },
    closeButton: {
        color: 'blue',
        backgroundColor: '#789',
        width: 24,
        height: 24,
        borderRadius: 5,
    },
    logoutBtn: {
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#aaa',
        padding: 5,
        marginLeft: 5,
    }
});