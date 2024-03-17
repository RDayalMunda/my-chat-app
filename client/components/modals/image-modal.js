import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native"
export default function ( { title, imageUrl, modalVisible, closeModal } ) {
    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >

            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalTitle} >
                        <Text>{title}</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Text style={{ textAlign: 'center', marginTop: 2 }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Image
                            source={{ uri: `http://192.168.105.212:3081/images/${imageUrl}` }}
                            style={styles.modalImage}
                        />
                    </View>
                </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: Dimensions.get('window').width - 30,
        // height: Dimensions.get('window').height-30,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        flexDirection: 'row',
        verticalAlign: 'middle',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalImage: {
        width: '100%',
        resizeMode: 'contain',
        minHeight: Dimensions.get('window').width,
    },
    closeButton: {
        color: 'blue',
        backgroundColor: '#789',
        width: 24,
        height: 24,
        borderRadius: 5,
    },
});