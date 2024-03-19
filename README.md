# Setup
This application has 3 part.
- Client (react-native app)
- Server (Backend node server with database)
- Socket (Socket server for real-time communication between the three server)

## Setting up our app environment
The client is the react-native app
```bash
cd your-working-directory
git clone https://github.com/RDayalMunda/my-chat-app
cd my-chat-app
cd client
npm install
```

- Cannor start the expo server via npm start?
```
npx expo start
```
> **_IMPORTANT:_**  During development our node version is 20.11.1 and npm version is 10.2.4.


### If the expo server does not starts. and gives babel error. Do this


in the file "babel.config.js" clear out the plugin array from the return object.
```javascript

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [],
  };
};

```

## Running the app
### for expo
Install the Expo GO app in your android
Use the expo link given

#### If you cannot access the app with expo url.
use your local ip
check you system's ip address
```bash
ipconfig
IPv4 Address. . . . . . . . . . . : 192.168.123.456
```
and use this ip address as the expo link
"exp://192.168.123.456:8081"

8081 is the default port for expo.

### for emulator
For this you need to install android studio. 
[Download Android Studio](https://developer.android.com/studio)
- After downloading and installing run it and configure it.
- Advanced configuration is not needed for now, you can set everthing to default
- Check if a virtul device is present. It not create a new Virtual device. (You may need to download some more resources)
If your virtual device is setup, you can close android studio now.
Go to your "client" directory
```bash
npx expo run:android
```
This will create a folder named "android" inside your client directory.( This may take some time depending on your system specifications )
> **_IMPORTANT:_**  Make sure your system is using JDK 17. This might not work with JDK 21.
> 
> You will have to Download and install JDK 17. And set the path variable to it's bin directory


## Setting Up Server
In the server folder create a `config.js` file.
```javascript
module.exports.PORT = 3000;
module.exports.CLIENT_PORT = 3081;
module.exports.LOCALHOST = "http://192.168.123.456"
module.exports.MDB = {
    URL: "mongodb://127.0.0.1:27017/mychatapp"
}
module.exports.SALT_ROUNDS = 10
```
Open a terminal. Install packges and start the server
```bash
cd my-chat-app
cd server
npm install

npm start
```

## Setting Up Socket
In the socket folder create a `config.js` file.
```javascript
module.exports.PORT = 4000;
module.exports.LOCALHOST = "http://192.168.123.456";

// // use this CLIENT_ORIGIN for EXPO GO
module.exports.CLIENT_ORIGIN = "http://192.168.123.456:8081";

// // use this CLIENT_ORIGIN for android emulator
// module.exports.CLIENT_ORIGIN = "com.<you-user-name>.<mychatapp>://expo-development-client";

module.exports.MDB = {
    URL: "mongodb://127.0.0.1:27017/mychatapp"
}
```
> **_IMPORTANT:_**  Make sure you set the CLIENT_ORIGIN in the config.js file based on where you are running your app.

Open a terminal. Install packges and start the server
```bash
cd my-chat-app
cd server
npm install

npm start
```
