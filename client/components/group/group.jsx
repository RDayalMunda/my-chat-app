import { Text, ScrollView, TouchableOpacity, View, SafeAreaView, Pressable, Image, StyleSheet, Modal, Dimensions } from "react-native"
import { useRouter, Stack } from "expo-router"
import { useEffect, useState } from "react"

import api from "../../common/api"
import { androidRipple } from "../../common/styles"
import { logout } from "../../common/auth"
import { storeInLocal } from "../../common/localstorage"
import ImageModal from "../modals/image-modal"

export default function ({ loginhandler }) {
    let router = useRouter()

    var [groupList, setGroupList] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        imageName: "",
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
            let res = await api.get("/group/list")
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
        setModalData({ imageTitle: data.name, imageUrl: data.imageUrl })
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false);
    };

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
                        onPress={() => { navigateTo("/chat", { groupId: item._id }) }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <TouchableOpacity onPress={() => { setupModal(item) }} >
                                <Image
                                    source={{ uri: `http://192.168.105.212:3081/images/${item.imageUrl}` }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 15,
                                    paddingLeft: 15,
                                }}
                            >{item.name}</Text>
                        </View>
                        {item?.unseenCount?(
                        <View style={styles.unseenContainer}>
                            <Text style={styles.unseenCount}>{item.unseenCount}</Text>
                        </View>
                        ):''}
                    </TouchableOpacity>
                ))}

                <ImageModal
                    title={modalData.imageName}
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
        backgroundColor: '#e6e6e6',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
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
});