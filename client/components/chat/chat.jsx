import { Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Text, ScrollView, Image, View, StyleSheet, TouchableOpacity } from "react-native"
import api from "../../common/api"
import { getFromLocal, getGroupById } from "../../common/localstorage"
import ImageModal from "../modals/image-modal"


export default function () {
    const params = useLocalSearchParams()

    let [messageList, setMessageList] = useState([])
    let [groupData, setGroupData] = useState({
        name: "no-name"
    })

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        imageName: "",
        imageUrl: "",
    })
    console.log('params', params)

    async function getGroupData() {
        try {
        } catch (err) {
            console.log(err)
        }
    }

    const closeModal = () => {
        setModalVisible(false);
    };


    useEffect(() => {
        !(async () => {
            console.log('loading once in chat')
            let groupData = await getGroupById(params.groupId)
            setGroupData(groupData)
            setModalData({ imageName: groupData.name, imageUrl: groupData.imageUrl })
            console.log('groupData', groupData)
            getGroupData()
        })()
    }, [])

    return (
        <ScrollView>
            <Stack.Screen
                options={{
                    title: groupData.name,
                    headerLeft: () => (
                        <TouchableOpacity onPress={()=>{ setModalVisible(true) }}>
                            <Image
                                source={{ uri: `http://192.168.105.212:3081/images/${groupData.imageUrl}` }}
                                style={styles.headerImage}
                            />
                        </TouchableOpacity>
                    ),
                    headerTitle: () => (<Text style={styles.headerTitle}>{groupData?.name}</Text>)
                }}
            />
            <Text>Chat Messages</Text>
            <ImageModal

                title={modalData.imageName}
                imageUrl={modalData.imageUrl}
                modalVisible={modalVisible}
                closeModal={closeModal}
            />
        </ScrollView>
    )
}

let styles = StyleSheet.create({
    headerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
    },
    headerTitle: {
        fontSize: 18,
        paddingLeft: 10,
    }
})