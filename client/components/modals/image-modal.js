import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"

export default function ({ title, imageUrl, modalVisible, closeModal }) {
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
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Image
                            source={{ uri: `http://192.168.105.212:3081/images/${imageUrl}` }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Footer */}
                    {/* <View style={styles.footer}>
                        <Button title="Button 1" onPress={() => { }} />
                        <Button title="Button 2" onPress={() => { }} />
                    </View> */}
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
    closeButton: {
        color: 'blue',
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
});