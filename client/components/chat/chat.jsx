import { Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Text, Image, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Pressable, Dimensions, useColorScheme } from "react-native"
import api, { IMAGE_URL } from "../../common/api"
import { getFromLocal, getGroupById, getMessagesByGroupId, getUserData, storeInLocal } from "../../common/localstorage"
import ImageModal from "../modals/image-modal"


export default function () {
    const params = useLocalSearchParams()
    const styles = (useColorScheme()=='dark')?darkStyle:lightStyle

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
        title: "",
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
            console.log('message:', messageObj.text)
            if (!messageObj?.text?.trim()){
                return
            }
            let payload = {
                ...messageObj,
                userId: userData._id,
            }
            await api.post("/chat/message", payload)
            setMessageObj( { ...messageObj, text: "" } )
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        getUserData().then( async data => {
            if (data){
                userData = data
                setUserData(oldData=>data)
            }
            
            let groupData = await getGroupById(params.groupId)
            if (groupData) {
                setGroupData(groupData)
            } else {
                console.log('send api')
            }

            if (!groupData.isDirect){
                setModalData({ title: groupData.name, imageUrl: groupData.imageUrl })
            }else{
                let user = groupData.participants[0]._id == userData._id?groupData.participants[1]:groupData.participants[0]
                setGroupData( oldData=>({ ...oldData, name: user.name, imageUrl: user.imageUrl }) )
                setModalData({ title: user.name, imageUrl: user.imageUrl })
            }

            let messages = await getMessagesByGroupId(params.groupId)
            if (messages?.length) {
                setMessageList(messages)
                scrollViewRef?.current?.scrollToEnd({ animated: false });
            } else {
                getOnlineMessage()
            }
            getGroupData()

            global.socket.on( "send-message", (messageData)=>{
                setMessageList(messageList => [...messageList, messageData])
                storeInLocal(params.groupId, messageList)
            } )
        }).catch(() => { console.log(err) })
    }, [])
    useEffect(() => {
        // Scroll to the bottom when content changes
        if (scrollViewRef.current) {
            scrollViewRef?.current?.scrollToEnd({ animated: false });
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
                                source={{ uri: `${IMAGE_URL}/${groupData.imageUrl}` }}
                                style={styles.headerImage}
                            />
                        </TouchableOpacity>
                    ),
                    headerTitle: () => (<Text style={styles.headerTitle}>{groupData?.name}</Text>),
                    statusBarColor: styles.statusbar.color,
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.text,
                    headerTintColor: styles.text.color,
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
                            {(item.userId != userData._id) ? (<View style={[styles.messageTail, styles.receiverTail]} />) : <></>}
                            <View style={[styles.messageContent, (item.userId == userData._id) ? styles.senderMessage : styles.receiverMessage]}>
                                {!groupData?.isDirect ? (
                                    <Text style={styles.messageTitle}>{item.userName}</Text>
                                ) : <></>}

                                <Text style={styles.messageText}>{item.text}</Text>
                            </View>
                            {(item.userId == userData._id) ? (<View style={[styles.messageTail, styles.senderTail]} />) : <></>}
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
                    placeholderTextColor={styles.placeholder.color}
                    multiline={true}
                />
                <View style={{justifyContent:"center"}}>
                    
                    <Pressable 
                        style={styles.btn}
                        onPress={sendMessage}
                    >
                        <Text style={styles.textEmoji}>➤</Text>
                    </Pressable>
                </View>
            </View>




            <ImageModal
                title={modalData.title}
                imageUrl={modalData.imageUrl}
                modalVisible={modalVisible}
                closeModal={closeModal}
            />
        </SafeAreaView>
    )
}

const lightStyle = StyleSheet.create({
    statusbar: { color: "#154" },
    headerStyle:{
        backgroundColor: "#ddd",
    },
    text: { color: "#111" },
    headerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover', // Adjust the image resizing mode as needed
    },
    headerTitle: {
        fontSize: 18,
        paddingLeft: 10,
        color: "#111"
    },

    container: {
        flex: 1,
        backgroundColor: '#ddd',
    },
    scrollArea: {
        flexGrow: 1,
        paddingBottom: 70, // Adjust this value to leave space for the input area
        width: Dimensions.get('window').width,
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        maxHeight: Dimensions.get('window').height/5,
        borderColor: '#ccc',
    },
    placeholder: { color: "#777" },
    btn: {
        backgroundColor: "#bfe762",
        // height: '100%',
        // justifyContent: 'center',
        borderRadius: 5,
    },
    textEmoji: {
        fontSize: 24,
        paddingHorizontal: 5,
        paddingBottom: 5,
    }
})

const darkStyle = StyleSheet.create({
    ...lightStyle,
    headerStyle:{
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
    inputContainer: {
        ...lightStyle.inputContainer,
        borderTopColor: '#888',
        backgroundColor: '#444',
    },
    input: {
        ...lightStyle.input,
        backgroundColor: "#444",
        color: "#fff",
    },
})