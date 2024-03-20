import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { IMAGE_URL } from "../../common/api";
import { memoiseInstance } from "../../common/utils";
import { useEffect, useState } from "react";

export default function ({ title, imageUrl, modalVisible, closeModal }) {

    let [ imageLink, setImageLink ] = useState(`${IMAGE_URL}/${imageUrl}`)

    const reloadImage = ()=>{
        imageLink = `${IMAGE_URL}/${imageUrl}?time=${new Date().getTime()}`
        memoiseInstance.setValue( imageUrl, imageLink )
        setImageLink( old => imageLink )
    }

    useEffect( ()=>{
        if (modalVisible){
            imageLink = memoiseInstance( imageUrl, ()=>(`${IMAGE_URL}/${imageUrl}`) )
            setImageLink( old => imageLink )
        }
    }, [ imageUrl, modalVisible ] )

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >


            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.btn}>
                            <Text>❌</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Image
                            source={{ uri: `${imageLink}` }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.btn} onPress={reloadImage}>
                            <Text style={{fontSize: 24, paddingBottom: 5}}>↻</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </Modal>
    )
}
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        height: '80%',
        borderRadius: 10,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dedede',
        borderRadius: 5,
        minWidth: 40,
        minHeight: 40,
    },
});