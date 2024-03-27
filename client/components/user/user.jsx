import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native"
import api from "../../common/api";
import { Debounce } from "../../common/utils";

let debouncedCheckUserName = null; // need to define it ourside of component to avoid redefining it on every render

export default function () {
    const styles = (useColorScheme() == 'dark') ? darkStyle : lightStyle;
    const params = useLocalSearchParams()
    const [user, modifyUser] = useState({
        // _id: null,
        name: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        imageUrl: "",
    })
    const [ error, setError ] = useState({
        name: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [ showPassword, setShowPassword ] = useState(false)
    const refList = [ useRef(), useRef(), useRef(), useRef(), useRef() ]

    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false)

    const handleFocus = function(index){
        if (refList[index+1]?.current?.focus){
            refList[index+1].current.focus()
        }else if(refList[index.current?.blur]){
            refList[index].current.blur()
        }
    }

    const handleInput = function(newText){
        
    }

    const checkUserName = function(userName, userId){
        api.get("/user/unique", { params: { userName: userName, ...(userId?{ _id: userId }:{}) } }).then( ({data})=>{
            console.log('got unique', userName, data)
        } ).catch( err=>{ console.log(err) } )
    }
    
    useEffect( ()=>{
        debouncedCheckUserName = Debounce(checkUserName)
    }, [] )

    const validateFields = function(){
        let isError = false
        if (!user?.name){
            isError = true
            setError( oldErr=>({ ...oldErr, name: "Please Enter your full name" }) )
        }
        if (!user?.userName){
            isError = true
            setError( oldErr=>({ ...oldErr, userName: "Please provide a unique username" }) )
        }
        if (!user?.email){
            isError = true
            setError( oldErr=>({ ...oldErr, email: "Please enter an email" }) )
        }
        if (!user?.password){
            isError = true
            setError( oldErr=>({ ...oldErr, password: "Please enter a password" }) )
        }
        if (!user?.confirmPassword){
            isError = true
            setError( oldErr=>({ ...oldErr, confirmPassword: "Please confirm your password" }) )
        }
        if (user?.password && user?.confirmPassword && user?.password != user?.confirmPassword){
            isError = true
            setError( oldErr=>({ ...oldErr, password: "Your password is not confirmed! Please try again" }) )
        }
        return isError
    }

    const createAUser = function(){
        // check if the fields are fillewd properly
        let isError = validateFields()
        if (isError) return
        console.log('creating a user', user)
        user.name = user.name.trim()
        user.userName = user.userName.trim()
        user.email = user.email.trim()

        api.post("/user", { userData: user }).then( ({data})=>{
            console.log('user created', data)
        } ).catch( err=>{ console.log(err) } )
    }

    

    return (
        <SafeAreaView style={styles.container} >
            <Stack.Screen
                options={{
                    title: (user?._id) ? 'Edit User' : "Create your account",
                    statusBarColor: styles.statusbar.color,
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.text,
                }}
            />
            <SafeAreaView>
                <ScrollView style={styles.scrollArea}>
                    <Text style={styles.headerTitle}>Enter your details</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text>Name</Text>
                        <View style={styles.inputArea}>
                            <TextInput value={user.name} style={styles.input} placeholder="Enter your name"
                            ref={refList[0]} onSubmitEditing={()=>handleFocus(0)}
                            onChangeText={ (newText)=>{ modifyUser( oldUser=>({...oldUser, name:newText}) ) } }
                            />
                        </View>
                        {error.name?
                            <Text style={styles.inputErrorText}>{error.name}</Text>:
                            <></>
                        }
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Username</Text>
                        <View style={styles.inputArea}>
                            <TextInput value={user.userName} style={styles.input} placeholder="Enter a unique user name"
                            ref={refList[1]} onSubmitEditing={()=>handleFocus(1)}
                            onChangeText={ (newText)=>{
                                modifyUser( oldUser=>({...oldUser, userName:newText}) )
                                debouncedCheckUserName(newText, user?._id)
                            } }
                            />
                        </View>
                        {error.userName?
                            <Text style={styles.inputErrorText}>{error.userName}</Text>:
                            <></>
                        }
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Email</Text>
                        <View style={styles.inputArea}>
                            <TextInput value={user.email} style={styles.input} placeholder="Enter an email to register with"
                            ref={refList[2]} onSubmitEditing={()=>handleFocus(2)} keyboardType="email-address"
                            onChangeText={ (newText)=>{ modifyUser( oldUser=>({...oldUser, email:newText}) ) } }
                            />
                        </View>
                        {error.email?
                            <Text style={styles.inputErrorText}>{error.email}</Text>:
                            <></>
                        }
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Enter a password</Text>
                        <View style={styles.inputArea}>
                            <TextInput value={user.password} style={styles.input} placeholder="Enter a password"
                            secureTextEntry={showPassword?false:true} ref={refList[3]} onSubmitEditing={()=>handleFocus(3)}
                            onChangeText={ (newText)=>{ modifyUser( oldUser=>({...oldUser, password:newText}) ) } }
                            />
                            <TouchableOpacity style={styles.passwordEye} onPress={()=> setShowPassword(!showPassword)}>
                                { showPassword?
                                    <Image style={styles.passwordEye} source={require("../../assets/images/eye.png")}/>:
                                    <Image style={styles.passwordEye} source={require("../../assets/images/eye-closed.png")}/>
                                }
                            </TouchableOpacity>
                        </View>
                        {error.password?
                            <Text style={styles.inputErrorText}>{error.password}</Text>:
                            <></>
                        }
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Confirm Password</Text>
                        <View style={styles.inputArea}>
                            <TextInput value={user.confirmPassword} style={styles.input} placeholder="Re-enter the same password"
                            secureTextEntry={showConfirmPassword?false:true} ref={refList[4]} onSubmitEditing={()=>handleFocus(4)}
                            onChangeText={ (newText)=>{ modifyUser( oldUser=>({...oldUser, confirmPassword:newText}) ) } }
                            />
                            <TouchableOpacity style={styles.passwordEye} onPress={()=> setShowConfirmPassword(!showConfirmPassword)}>
                                { showConfirmPassword?
                                    <Image style={styles.passwordEye} source={require("../../assets/images/eye.png")}/>:
                                    <Image style={styles.passwordEye} source={require("../../assets/images/eye-closed.png")}/>
                                }
                            </TouchableOpacity>
                        </View>
                        {error.confirmPassword?
                            <Text style={styles.inputErrorText}>{error.confirmPassword}</Text>:
                            <></>
                        }
                    </View>
                    <TouchableOpacity style={styles.btn} onPress={createAUser}>
                        <Text>Create</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaView>
    )
}


const lightStyle = StyleSheet.create({
    statusbar: { color: "#154" },
    headerStyle: {
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
        color: "#111",
        textAlign: 'center'
    },

    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    scrollArea: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 70, // Adjust this value to leave space for the input area
        width: Dimensions.get('window').width,
    },
    inputContainer: {
        marginBottom: 10,
    },
    inputArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderColor: '#ccc',
    },
    passwordEye:{
        width: 20,
        height: 20,
        marginEnd: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        maxHeight: Dimensions.get('window').height / 5,
    },
    placeholder: { color: "#777" },
    inputErrorText: { color: '#f00' },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        minWidth: 30,
        minHeight: 30,
        backgroundColor: '#777',
        padding: 10,
        marginTop: 10,
    },
    imageBtn: {
        width: 20,
        height: 20,
    },
    textEmoji: {
        fontSize: 24,
        paddingHorizontal: 5,
        paddingBottom: 5,
    }
})

const darkStyle = StyleSheet.create({
    ...lightStyle,
    headerStyle: {
        backgroundColor: "#111",
    },
    container: {
        ...lightStyle.container,
        backgroundColor: '#222'
    },
    text: { color: "#ddd" },
    headerTitle: {
        ...lightStyle.headerTitle,
        color: "#ddd"
    },
    input: {
        ...lightStyle.input,
        backgroundColor: "#444",
        color: "#fff",
    },
})