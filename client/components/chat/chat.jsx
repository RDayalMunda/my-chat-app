import { Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Text, Image, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Pressable, Dimensions } from "react-native"
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
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: groupData.name,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => { setModalVisible(true) }}>
                            <Image
                                source={{ uri: `http://192.168.105.212:3081/images/${groupData.imageUrl}` }}
                                style={styles.headerImage}
                            />
                        </TouchableOpacity>
                    ),
                    headerTitle: () => (<Text style={styles.headerTitle}>{groupData?.name}</Text>)
                }}
            />

            {messageList?.length?(
                
                <ScrollView style={styles.scrollArea}>
                    {(new Array(10)).map((item, index) => (
                        <View key={index} style={styles.item}>
                            <Text>heyylo sdfsd sdfs  fsfdf d</Text>
                        </View>
                    ))}
                    
                    <View style={styles.item}>
                            <Text>heyylo sdfsd sdfs  fsfdf d</Text>
                    </View>
                </ScrollView>
            ):(
                <View style={styles.messageContainerEmpty}>
                    <Text style={{ textAlign: 'center' }}>No Messages yet!</Text>
                </View>
            )}
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Enter text..." />
                <Pressable style={styles.pressable}>
                    <Text>Send</Text>
                </Pressable>
            </View>




            <ImageModal
                title={modalData.imageName}
                imageUrl={modalData.imageUrl}
                modalVisible={modalVisible}
                closeModal={closeModal}
            />
        </SafeAreaView>
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
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollArea: {
        flexGrow: 1,
        paddingBottom: 70, // Adjust this value to leave space for the input area
        backgroundColor: '#ef7',
        width: Dimensions.get('window').width
    },
    messageContainerEmpty: {
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    pressable: {
        backgroundColor: "#3f5",
        height: '100%',
        justifyContent: 'center',
        borderRadius: 50,
    }
})