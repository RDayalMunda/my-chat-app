import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, Animated, Button } from "react-native";
import { androidRipple } from "../../common/styles";

export default function () {
    let [visible, setVisible] = useState(true)
    const [slideAnim] = useState(new Animated.Value(-1000));



    const animateModal = (toValue, toClose)=>{
        
        Animated.timing(
            slideAnim,
            {
                toValue,
                duration: 300,
                useNativeDriver: true,
            }
        ).start(()=>{
            if(toClose) setVisible(false)
        });
    }

    useEffect( ()=>{


        if (visible){
            animateModal(0)
        }else{
            animateModal(-1000, true)
        }

    }, [ visible ] )

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <Pressable
                            style={styles.burgerBtn}
                            onPress={()=>{ setVisible(true) }}
                            android_ripple={androidRipple.light}
                        >
                            <Text>Burger</Text>
                        </Pressable>
                    )
                }}
            />

            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
                onRequestClose={()=>{ animateModal(-1000, true) }}
            >
                <View style={styles.modalBackground}>
                    <Animated.View
                        style={[
                            styles.animateBox,
                            {
                                transform: [{ translateX: slideAnim }],
                            }
                        ]}
                    >
                        <Button title="Close Modal" onPress={()=>{ animateModal(-1000, true) }} />
                        <Text>Modal Content</Text>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        backgroundColor: '#00000078'
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    animateBox: {
        backgroundColor: '#fff',
        width: '80%',
        height: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        padding: 20,
    },
    burgerBtn: {
        backgroundColor: '#3f5fa6',
        padding: 5,
        borderRadius: 5,
    }
})