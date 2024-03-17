import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { androidRipple } from '../../common/styles';
import {Stack}  from "expo-router"
import api from '../../common/api';

export default () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        // Implement sign-in logic here
        console.log('Signing in with:', username, password);
        try{
            let payload = { username, password }
            let { data } = await api.post("login", payload )
            console.log('data', data)
        }catch(err){
            console.log(err)
        }
    };

    const handleForgotPassword = () => {
        // Implement forgot password logic here
        console.log('Forgot password');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Login"
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
                value={username}
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
