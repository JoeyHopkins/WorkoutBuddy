# WorkoutBuddy

Workout app built on React Native

## Setup and Run

install node (nvm then node)
Currently using v 20.0.0

install Expo
npm i -g expo-cli

install dependancies
npx expo install react-native-web@~0.18.10 react-dom@18.2.0 @expo/webpack-config@^18.0.1

To run your project, navigate to the directory and run one of the following npm commands.

- cd WorkoutBuddy
- npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
- npm run android
- npm run ios # requires an iOS device or macOS for access to an iOS simulator
- npm run web

## Android Sim Dev

App is built using:
Android Studio Flamingo | 2022.2.1
Build #AI-222.4459.24.2221.9862592, built on March 31, 2023

install Android Studio
->look in android sdk to make sure latest version is installed
->click on SDK Tools and make sure Android SDK Build Tools, Android Emulator, Androide SDK Platform Tools
-->Emulator Hypervisor
->virtual device manager
--->setup phone and run to get android simulator up

once started you and android simulator is open, run on android to auto install and set things up on the simulated phone
should pull up and be reactive on save

Ctrl+M -> main screen expo go

## Using own Android Dev

Make sure you are connected to the wifi, Was having issues being hard wires not connected.
Make sure the wifi is set to private
->might be able to have public if disired but I belive this depends on firewall
Download Expo Go on google play store
Select connect with QR Code
Scan code presented when starting the front end
Should pull up and be reactive on save

Can also reload with hitting R in the console
