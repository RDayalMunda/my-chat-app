import React, { useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Image, useColorScheme } from 'react-native';
import { androidRipple } from '../../common/styles';
import api from '../../common/api';
import { storeInLocal } from '../../common/localstorage';
import ErrorModal from '../modals/error-modal';

export default ({ loginhandler }) => {
    let router = useRouter();
    let params = useLocalSearchParams()
    const [userName, setUsername] = useState(params?.userName?params.userName:'');
    const [password, setPassword] = useState('');
    const [errorModal, setErrorModal] = useState({ text: "No error yet", title: "Error", modalVisible: false })
    const closeModal = function(){
        setErrorModal( oldData=> ({ ...oldData, modalVisible: false }) )
    }
    const styles = (useColorScheme()=='dark')?darkStyle:lightStyle

    const handleSignIn = async () => {
        // Implement sign-in logic here
        try {

            if (!userName || !password) return

            let payload = { userName, password }
            console.log('send to login')
            let { data } = await api.post("auth/login", payload)
            if (data.success) {
                storeInLocal('sessionToken', data.session)
                storeInLocal('user-data', data.session)
                loginhandler(JSON.stringify(data.session))
            }else{
                console.log('some error', data)
                setErrorModal( oldData=>({
                    ...oldData,
                    text: data.message,
                    modalVisible: true
                }) )
            }
        } catch (err) {
            setErrorModal( oldData=>({
                ...oldData,
                text: JSON.stringify(err),
                modalVisible: true
            }) )
            console.log(err)
        }
    };

    const navigateTo = function(path, query){
        router.push({
            pathname: path,
            params: query
        })
    }


    const handleForgotPassword = () => {
        // Implement forgot password logic here
        console.log('Forgot password');
    };

    return (
        <>
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        title: "Login",
                        headerRight: () => (<></>),
                        statusBarColor: styles.statusbar.color,
                        headerStyle: styles.headerStyle,
                        headerTitleStyle: styles.text,
                    }}
                />
                <View>
                    <Image
                        source={require("../../assets/images/logo.png")}
                        style={styles.logo}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={userName}
                    autoCapitalize="none"
                    placeholderTextColor={styles.placeholder.color}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    placeholderTextColor={styles.placeholder.color}
                    onSubmitEditing={handleSignIn}
                    returnKeyType='done'
                    secureTextEntry
                />
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={handleSignIn} android_ripple={androidRipple.light}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
                </View>

                <View style={{ overflow: 'hidden' }}>
                    <Pressable onPress={handleForgotPassword} android_ripple={androidRipple.dark}>
                        <Text style={styles.forgotPassword}>Forgot your password?</Text>
                    </Pressable>
                </View>
                
                <View>
                    <Pressable onPress={()=>{ navigateTo("/user") }} android_ripple={androidRipple.dark}>
                        <Text style={styles.forgotPassword}>Don't have an account? Create One!</Text>
                    </Pressable>
                </View>
            </View>
            <ErrorModal title={errorModal.title} text={errorModal.text} modalVisible={errorModal.modalVisible} closeModal={closeModal}/>
        </>
    );
};

const lightStyle = StyleSheet.create({
    statusbar: { color: "#154" },
    headerStyle:{
        backgroundColor: "#ddd",
    },
    text: { color: "#111" },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: "#eee",
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    placeholder: { color: "#777" },
    buttonContainer: {
        backgroundColor: '#007bff',
        padding: 0,
        borderRadius: 5,
        marginBottom: 10,
        overflow: 'hidden'
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        margin: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    forgotPassword: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
});

const darkStyle = StyleSheet.create({
    ...lightStyle,
    statusbar: { color: "#154" },
    headerStyle:{
        backgroundColor: "#111",
    },
    text: { color: "#ddd" },
    
    container: {
        ...lightStyle.container,
        backgroundColor: "#222",
    },
    input :{
        ...lightStyle.input,
        backgroundColor: "#444",
        color: "#fff",
    },
});
