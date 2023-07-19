# WorkoutBuddy

Node V20.0.0
Workout app built on React Native/Node.js
Storage is built on Sqlite and is stored locally on users device

The main goal of this app is to replace using notes in the gym. To provide the user with complete flexibility with what goes in, while still providing a robust way to interact with the user for maximum gains.

# Roadmap

- strength workout section
  -ability to see previous progress to give an idea of what user wants to aim for
  -flexibility to add as many reps, sets, to the activity at the time of working out
  -flexibility to add any number of workouts and have everything dynamically populate

- Finish setting up routine functionality on home page and link it into the workouts to help keep track of daily workouts
  -also want to let the user be able to change and do any desired day they would like

- Hook up Cardio and Strength workouts to populate different color dots on the calander on home page.
  - will also display these when day is selected

At this point the plan is to create a build of the app at this stage so i can start generating real working data to help build the report section

- Reports page
  -up to this point, this page was used more as a proof of concept
  -needs some ui cleanup and maybe some reworking
  -dynamically creating and populating reports based on workouts

each report will have its own dynamic report generated
based on sets and dates to show difference between them (multi line)

## Setup and Run

install node (nvm then node)
Currently using v 20.0.0

install Expo
npm i -g expo-cli

install dependancies
npm i

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

Make sure you are connected to the wifi, Was having issues being hard wired, not connected.
Make sure the wifi is set to private
->might be able to have public if disired but I belive this depends on firewall
Download Expo Go on google play store
Select connect with QR Code
Scan code presented when starting the front end
Should pull up and be reactive on save

Can also reload with hitting R in the console

## Useful dev stuff

App is linked appwide to config/colors page. Some adjustments may need to be changed but it is being developed with this is mind.
