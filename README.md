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
const path = require("path")
module.exports.PORT = 3000;
module.exports.CLIENT_PORT = 3081;
module.exports.LOCALHOST = "http://192.168.169.212";
module.exports.SOCKET_URL = "http://127.0.0.1:4000";
module.exports.MDB = {
  URL: "mongodb://127.0.0.1:27017/mychatapp"
}
module.exports.IMAGE_UPLOAD_DIR = path.join( __dirname, '..', 'images', '/' )
module.exports.SALT_ROUNDS = 10;
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

# BUILDING YOUR APPLICATION
Check [Link](https://instamobile.io/android-development/generate-react-native-release-build-android/)

## to build online with EAS.
```bash
eas build --platform android
```

## Builing Apk locally
First we need the android data folder.
For this you need to have Android Studio installed and a virtual device setup

```bash
npx expo run:android
```
This command will create the android data folder and launch the app in the virtual device

You can close the virtul device.

Go to the android directory and run gradle commnad

```bash
cd client
cd android
gradlew :app:bundleRelease
```
This will generate the aab file

You need to download bundletools provided by android studio to pack your aab file into apk. That you can share in install on any android devices.

For this Example download the `.jar` file provided you in this [link](https://developer.android.com/tools/bundletool).

Use this command to generate the apks

```bash

# this is syntax
java -jar bundletool.jar build-apks --bundle=/path/to/your/app.aab --output=/path/to/output/app.apks --mode=universal

# this is the actual command I used in my system
java -jar bundletool-all-1.15.6.jar build-apks --bundle=E:/projects/react-natives/my-chat-app/client/android/app/build/outputs/bundle/release/app-release.aab --output=E:/projects/react-natives/my-chat-app.apks --mode=universal
```

This command create bundle of apk files inside a single apk file

This required a device json file. If you dont have the device json for the device your device just create a json file ith the following content
```json
{
  "supportedAbis": ["arm64-v8a", "armeabi-v7a"],
  "supportedLocales": ["en", "fr"],
  "screenDensity": 640,
  "sdkVersion": 27
}
```
```bash
java -jar bundletool-all-1.15.6.jar extract-apks --apks=E:/projects/react-natives/my-chat-app.apks --output-dir=E:/projects/react-natives --device-spec=E:/projects/react-natives/device.json
```


## Other knows challenges I faced
### I cannot make any request to different servers
I was not able to make hit to my other server on my local machine i.e. `http://192.168.169.212:3081`. So I tried a secured website like `https://images.freeimages.com/images/large-previews/53d/leather-link-texture-1538412.jpg`. This also did not go well.

To fix this we need to create a file name `network_security_config.xml` at `\android\app\src\main\res\xml\network_security_config.xml`. If it is already present then just edit the file.
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```
The `android` folder would have been created in your project directory already if you have run `npx expo run:android` command.

Now we need to link this file to the `AndroidManifest.xml` file which is present at `\android\app\src\main\AndroidManifest.xml`. Find the application tag inside this file and add thhis attribute at the end `android:networkSecurityConfig="@xml/network_security_config"`.
```xml
...

  <application ...
  android:networkSecurityConfig="@xml/network_security_config"
  >
  ...
  </application>

...
```

Rebuild the apk again and you are good to go.


## How to add your custom icon
Go inside `\android\app\src\main\res` folder. You will find folder named `mipmap-hdpi`, `mipmap-mdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, `mipmap-xxxhdpi`. In each of folder mentioned there are 2 images named `ic_launcher.png` and `ic_launcher_round.png`.

Just replace them with your images make sure that the name are not changed. There should be a `ic_launcher.png` and `ic_launcher_round.png` file in each of the above mentioned folders.

After this you can build your app again.

## Want to change your app's name?
To change you app name, the name that is displayed on the app drawer. You have to edit this file, `\android\app\src\main\res\values\strings.xml`.


## Help with setting up nginx

Here is the configuration of my project
```bash

server {
  listen 80;
  listen [::]:80;

  root /var/www/sub.test;
  index index.html;

  server_name rnchat.lovetocode.in;

  client_max_body_size 20M;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /images/ {
    root /var/www/my-chat-app/;
    index default.png;
    try_files $uri $uri/;
  }

  location /api/ {
    add_header Access-Control-Allow-Origin *;
    add_header Cache-Control: no-cache;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forward-Proto $scheme;
    proxy_set_header X-Forward-Host $host;
    proxy_set_header X-Forward-Server $host;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    send_timeout 300;
    proxy_cookie_path ~*^/.* /;
    proxy_pass http://127.0.0.1:3000/;
  }

  location /socket.io/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

}


server {
  listen 80 default_server;
  listen [::]:80 default_server;

  root /var/www/test;

  index index.html index.htm index.nginx-debian.html;

  server_name lovetocode.in;

  location / {
    try_files $uri $uri/ index.html;
  }

}
```