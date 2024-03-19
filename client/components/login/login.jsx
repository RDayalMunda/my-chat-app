import React, { useState } from 'react';
import { Stack } from "expo-router"

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { androidRipple } from '../../common/styles';
import api from '../../common/api';
import { storeInLocal } from '../../common/localstorage';
import ErrorModal from '../modals/error-modal';

export default ({ loginhandler }) => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorModal, setErrorModal] = useState({ text: "No error yet", title: "Error", modalVisible: false })
    const closeModal = function(){
        setErrorModal( oldData=> ({ ...oldData, modalVisible: false }) )
    }

    const handleSignIn = async () => {
        // Implement sign-in logic here
        try {
            let payload = { userName, password }
            let { data } = await api.post("auth/login", payload)
            if (data.success) {
                storeInLocal('sessionToken', data.session)
                storeInLocal('user-data', data.session)
                loginhandler(JSON.stringify(data.session))
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
                        headerRight: () => (<></>)
                    }}
                />
                <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.logo}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={userName}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                />
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={handleSignIn} android_ripple={androidRipple.light}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
                </View>

                <View style={{ overflow: 'hidden' }}>
                    <Pressable onPress={handleForgotPassword} android_ripple={androidRipple.dark}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </Pressable>
                </View>
            </View>
            <ErrorModal title={errorModal.title} text={errorModal.text} modalVisible={errorModal.modalVisible} closeModal={closeModal}/>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 150,
        height: 150,
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
