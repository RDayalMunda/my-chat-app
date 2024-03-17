
import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeInLocal = async function ( key, value ){
    try{
        await AsyncStorage.setItem( key, JSON.stringify(value) )
        return true
    }catch(err){
        console.log(err)
        return err
    }
}

export const getFromLocal = async function(key){
    try{
        return JSON.parse(await AsyncStorage.getItem(key))
    }catch(err){
        console.log(err)
        return null
    }
}

export const getGroupById = async function(groupId){
    try{
        let groupList = JSON.parse(await AsyncStorage.getItem('group-list'))
        return groupList?.find?.( item => item._id == groupId )
    }catch(err){
        console.log(err)
        return null
    }
}