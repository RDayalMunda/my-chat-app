import { Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Text, Image, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Pressable, Dimensions } from "react-native"
import api from "../../common/api"
import { getFromLocal, getGroupById, getMessagesByGroupId, getUserData, storeInLocal } from "../../common/localstorage"
import ImageModal from "../modals/image-modal"


export default function () {
    const params = useLocalSearchParams()

    let [userData, setUserData] = useState({})

    let scrollViewRef = useRef()
    let [messageList, setMessageList] = useState([])
    let [groupData, setGroupData] = useState({
        name: "no-name"
    })

    let [messageObj, setMessageObj] = useState({
        text: "",
        groupId: params.groupId,
    })

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        imageName: "",
        imageUrl: "",
    })

    async function getGroupData() {
        try {
        } catch (err) {
            console.log(err)
        }
    }

    const closeModal = () => {
        setModalVisible(false);
    };

    async function getOnlineMessage() {
        try {
            let { data } = await api.get("/chat/messages", { params: { groupId: params.groupId } })
            storeInLocal(params.groupId, data.messages)
            setMessageList(data.messages)
        } catch (err) {
            console.log(err)
        }
    }

    async function sendMessage() {
        try {
            let payload = {
                ...messageObj,
                userId: userData._id,
            }
            let { data } = await api.post("/chat/message", payload)
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        getUserData().then(data => {
            if (data) setUserData(data)
        }).catch(() => { })
        !(async () => {
            let groupData = await getGroupById(params.groupId)
            if (groupData) {
                setGroupData(groupData)
            } else {
                console.log('send api')
            }
            setModalData({ imageName: groupData.name, imageUrl: groupData.imageUrl })

            let messages = await getMessagesByGroupId(params.groupId)
            if (messages?.length) {
                setMessageList(messages)
                console.log('local messages scroll ')
                scrollViewRef.current.scrollToEnd({ animated: false });
            } else {
                console.log('online messages')
                getOnlineMessage()
            }
            getGroupData()
        })()
    }, [])
    useEffect(() => {
        // Scroll to the bottom when content changes
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    }, [messageList]);

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

            {messageList?.length ? (

                <ScrollView
                    contentContainerStyle={styles.scrollArea}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
                >
                    {messageList.map((item) => (
                        <View key={item._id} style={[styles.messageContainer, (item.userId == userData._id) ? styles.messageContainerSender : styles.messageContainerReceiver]}>
                            {(item.userId != userData._id) ? (<View style={[styles.messageTail, styles.receiverTail]} />) : ''}
                            <View style={[styles.messageContent, (item.userId == userData._id) ? styles.senderMessage : styles.receiverMessage]}>
                                {!groupData?.isDirect ? (
                                    <Text style={styles.messageTitle}>{item.userName}</Text>
                                ) : ""}

                                <Text style={styles.messageText}>{item.text}</Text>
                            </View>
                            {(item.userId == userData._id) ? (<View style={[styles.messageTail, styles.senderTail]} />) : ''}
                        </View>
                    ))}
                </ScrollView>


            ) : (
                <View style={styles.messageContainerEmpty}>
                    <Text style={{ textAlign: 'center' }}>No Messages yet!</Text>
                </View>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter text..."
                    onChangeText={(text) => { setMessageObj({ ...messageObj, text: text }) }}
                    value={messageObj.text}
                />
                <Pressable
                    style={styles.pressable}
                    onPress={sendMessage}
                >
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        // marginBottom: 0
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    messageContainerSender: {
        justifyContent: 'flex-end'
    },
    messageContainerReceiver: {
        justifyContent: 'flex-start'
    },
    messageContent: {
        maxWidth: '80%',
        padding: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    senderMessage: {
        backgroundColor: '#d3d3d3', // Gray background for sender's messages
        alignSelf: 'flex-end',
        borderTopLeftRadius: 5,
    },
    receiverMessage: {
        backgroundColor: '#add8e6', // Light blue background for receiver's messages
        alignSelf: 'flex-start',
        borderTopRightRadius: 5,
    },
    messageTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 16,
    },
    messageTail: {
        // position: 'absolute',
        width: 0,
        height: 0,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    senderTail: {
        borderLeftColor: '#d3d3d3', // Gray tail for sender's messages
        marginLeft: 0,
        borderLeftWidth: 10,
        borderBottomWidth: 10,
    },
    receiverTail: {
        borderRightColor: '#add8e6', // Light blue tail for receiver's messages
        borderRightWidth: 10,
        borderBottomWidth: 10,
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