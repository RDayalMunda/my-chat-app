import { ToastAndroid } from "react-native"

export const showToast = (message, duration) => {
    ToastAndroid.show(message?message:'', duration?duration:ToastAndroid.SHORT);
};

export const showToastWithGravity = (message, duration, gravity) => {
    ToastAndroid.showWithGravity(message?message: '',
        duration?duration:ToastAndroid.SHORT,
        gravity?gravity:ToastAndroid.CENTER,
    );
};

export const showToastWithGravityAndOffset = (message, duration, gravity, offsetX, offsetY) => {
    ToastAndroid.showWithGravityAndOffset(
        message?message:'',
        duration?duration:ToastAndroid.LONG,
        gravity?gravity:ToastAndroid.BOTTOM,
        offsetX?offsetX:25,
        offsetY?offsetY:50,
    );
};