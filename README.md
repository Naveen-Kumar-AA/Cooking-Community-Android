# Cooking Community

Cooking Community is a mobile application that allows users to create an account and log in securely to access various features related to recipes. Users can create and delete recipes, filter posts based on meal type, like and comment on other users' posts, save posts to their profile for future reference, search for other users, and visit other users' profiles to follow or unfollow them. The app also includes an option to edit the user's own profile. With features like secure authentication and protection against SQL injection, Cooking Community provides a safe and engaging environment for users to share their love for cooking and connect with like-minded individuals.

## Table of Contents

- [Run the app in development environment](#run-the-app-in-development-environment)
- [Install the app using apk](#install-the-app-using-apk)
- [Cooking Community Version 1.0.0 Release Notes](#cooking-community-version-100-release-notes)

## Run the app in development environment

1. Install the Expo CLI globally by running the following command in the terminal:
    ```
    npm install -g expo-cli
    ```
2. Clone the project from the Git repository to your local machine.
3. Open a terminal window and navigate to the project directory.
4. Install the dependencies by running the following command:
    ```
    npm install
    ```
5. Start the Expo development server by running the following command:
    ```
    npm start
    ```
6. This will start the Metro Bundler and display a QR code in the terminal.
7. Install the Expo Go app on your Android or iOS device from the respective app stores.
8. Open the Expo Go app and scan the QR code displayed in the terminal.
9. This will launch the app on your mobile device and you can start testing and developing the app.

Note: For iOS devices, you may need to have a Mac computer and Xcode installed to run the app in the development environment.


## Install the app using apk

1. Download the apk file from the project repository at v1.0.0/cooking_community.apk.
2. On your Android device, go to Settings > Security > Unknown sources and enable installation from unknown sources.
3. Use a file manager app to locate the downloaded apk file on your device and tap on it to start the installation.
4. Follow the on-screen instructions to complete the installation process.
5. Once the installation is complete, open the app and start using it.


## Cooking Community Version 1.0.0 Release Notes

Cooking community brings all the food enthusiasts to share, discover and save their favourite recipes!

### Features:

- Create an account or sign in with an authenticated login
- Secure features to prevent SQL injection
- Create, delete and search recipes with filters based on meal type
- Like, comment on and save recipes to your profile for easy later reference
- Search for other users and visit their profiles
- Follow or unfollow other users and edit your own profile
- Navigate to different tabs in Home screen such as feed, profile, new post, search.
- Easy logout is provided for making logout easier instead of visiting profile each time to logout.
- Clicking on a username on any post will direct you to their profile

### Technical details:

- Built using React Native version 0.71.7
- Node version 14.16.1 was used during development
- JWT token-based authentication has been implemented for added security
- SQL injection and other similar protection has been implemented for added security
- We used Expo SDK version 48.0.15 for development
- Other notable packages used include @react-navigation, @react-native-elements, @react-native-async-storage

Thank you for using Cooking Community! We hope you enjoy sharing and discovering new recipes with our platform.

<div align="center">
  <img src="screenshots/profile.jpeg" width="32%" />
  <img src="screenshots/signup.jpeg" width="32%" />
  <img src="screenshots/feed%20filter.jpeg" width="32%" />
  <br></br>
  <img src="screenshots/profile%20menu.jpeg" width="32%" />
  <img src="screenshots/search.jpeg" width="32%" />
  <img src="screenshots/update%20profile.jpeg" width="32%" />
  <br></br>
  <img src="screenshots/post%20popup.jpeg" width="32%" />
  <img src="screenshots/comments.jpeg" width="32%" />
  <img src="screenshots/save%20post%20menu.jpeg" width="32%" />
  <br></br>
  <img src="screenshots/savedpost.jpeg" width="32%" />
  <img src="screenshots/deletepost.jpeg" width="32%" />
  <img src="screenshots/newpost.jpeg" width="32%" />
</div>
