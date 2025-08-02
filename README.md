# NammaBus 🚌

A real-time, crowd-sourced bus tracking application for Bengaluru, built with React Native and Firebase.

## The Problem

Every day, commuters in Bengaluru face uncertainty about bus arrival times. Static schedules are often unreliable, leading to long waits and frustration. RouteSync solves this by creating a live, user-powered map of buses currently on the road.

## Key Features

* **Live Location Sharing**: Users on a bus ("Riders") can share their anonymized location in real-time.
* **Real-time Map View**: Users waiting for a bus ("Waiters") can see live bus icons moving on a map, providing an accurate ETA.
* **Route Search**: Search for any bus route to filter the map and see only the buses you're interested in.
* **Temporary Bus Chat**: Each active bus has its own temporary chat room, allowing riders and waiters to communicate about bus capacity, traffic, or other updates.
* **Elegant, Context-Aware Theming**: The app features four distinct, beautiful themes that automatically adapt to the user's system settings (Light/Dark) and their chosen role (Rider/Waiter).

## Tech Stack

* **Frontend**: React Native (with Expo)
* **Database**: Google Firebase Firestore (for real-time data)
* **Maps**: `react-native-maps` with Google Maps
* **Location Services**: `expo-location`
* **Animations**: `react-native-animatable`
* **State Management**: React Context API (for theming)

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/RouteSync.git](https://github.com/your-username/RouteSync.git)
    cd RouteSync
    ```

2.  **Install dependencies:** We use specific, compatible versions to ensure stability.
    ```bash
    npm install firebase@9.23.0 react-native-maps expo-location react-native-animatable idb@7
    ```

3.  **Set up Firebase credentials:**
    * Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    * Create a new Web App within your project to get your configuration keys.
    * In the root of the project, create a file named `.env`.
    * Copy your Firebase keys into the `.env` file in the following format:
        ```
        EXPO_PUBLIC_API_KEY="YOUR_API_KEY_HERE"
        EXPO_PUBLIC_AUTH_DOMAIN="YOUR_AUTH_DOMAIN_HERE"
        EXPO_PUBLIC_PROJECT_ID="YOUR_PROJECT_ID_HERE"
        EXPO_PUBLIC_STORAGE_BUCKET="YOUR_STORAGE_BUCKET_HERE"
        EXPO_PUBLIC_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID_HERE"
        EXPO_PUBLIC_APP_ID="YOUR_APP_ID_HERE"
        ```

4.  **Update Firestore Security Rules:** In your Firebase project, go to **Firestore Database > Rules** and paste the following to allow read/write access:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /active_buses/{document=**} {
          allow read, write: if true;
        }
      }
    }
    ```

## Running the App

Because this project uses native map components, running it in the standard Expo Go app can be unreliable. The recommended approach is to create a custom development build.

1.  **Install and log in to EAS CLI:**
    ```bash
    npm install -g eas-cli
    eas login
    ```

2.  **Configure the build:**
    ```bash
    eas build:configure
    ```

3.  **Start the build:** This will create a custom `.apk` file for you to install on your Android device.
    ```bash
    eas build --profile development --platform android
    ```

4.  **Run the project:** Once the build is complete and you've installed the app, start the development server.
    ```bash
    npx expo start
    ```
    Scan the QR code with your phone's camera to open the app.

## Project Structure

The project is organized into a clean, component-based architecture:

* `src/`: Contains all the application source code.
* `src/components/`: Reusable UI components (e.g., `SearchBar`, `ChatModal`).
* `src/contexts/`: Holds the React Context providers (e.g., `ThemeContext`).
* `src/screens/`: The main screens of the app (e.g., `WelcomeScreen`, `MapScreen`).
* `src/theme.js`: Defines the color palettes for all application themes.
* `App.js`: The main entry point that handles navigation and theme providing.
## SnapShots
![photo_2025-08-02_11-20-38](https://github.com/user-attachments/assets/2f2c3f93-95d9-4182-8255-e99128416908)
![photo_2025-08-02_11-20-46](https://github.com/user-attachments/assets/6265d816-62b4-4ab3-82d9-c8562340c7e6)
![photo_2025-08-02_11-20-52](https://github.com/user-attachments/assets/7621f467-39f2-4422-9204-f6c9d385206d)


