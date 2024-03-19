import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"

export default function ({ title, text, modalVisible, closeModal }) {
    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >


            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <Text>{text}</Text>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.closeButton}>Close</Text>
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
    closeButton: {
        color: 'blue',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
});