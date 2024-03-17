import AsyncStorage from "@react-native-async-storage/async-storage"

export async function logout( callback ){
    await AsyncStorage.clear()
    if (callback) await callback()
    return
}

export async function getSession (){
    return await AsyncStorage.getItem("sessionToken")
}