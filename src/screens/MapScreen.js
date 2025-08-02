import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import * as Animatable from 'react-native-animatable';
import ChatModal from '../components/ChatModal';
import GoLiveControls from '../components/GoLiveControls';
import SearchBar from '../components/SearchBar';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LOCATION_UPDATE_INTERVAL = 15000;
const STALE_BUS_THRESHOLD = 5 * 60 * 1000;

// It now receives `theme` as a prop
const MapScreen = ({ mode, onExit, theme }) => {
  const [location, setLocation] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [activeBuses, setActiveBuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(mode === 'rider' ? '' : '500-D');
  const [liveRouteNumber, setLiveRouteNumber] = useState('500-D');
  const [isChatVisible, setChatVisible] = useState(false);
  const [currentChatBusId, setCurrentChatBusId] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeBusDocId = useRef(null);
  const locationUpdateInterval = useRef(null);
  const mapRef = useRef(null);
  const senderId = useRef(`user_${Math.random().toString(36).substr(2, 9)}`).current;

  // Most logic hooks remain the same
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission is required.");
        onExit(); return;
      }
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        Alert.alert("Location Error", "Could not fetch location.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!searchQuery && mode === 'waiter') {
      setActiveBuses([]); return;
    }
    const q = mode === 'waiter' 
      ? query(collection(db, 'active_buses'), where("routeId", "==", searchQuery.toUpperCase().trim()))
      : query(collection(db, 'active_buses'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const buses = [];
      const now = new Date();
      querySnapshot.forEach((doc) => {
        const busData = doc.data();
        if (busData.lastUpdatedAt && (now - busData.lastUpdatedAt.toDate()) < STALE_BUS_THRESHOLD) {
          if (!isLive || doc.id !== activeBusDocId.current) {
            buses.push({ id: doc.id, ...busData });
          }
        } else if (busData.lastUpdatedAt) {
          deleteDoc(doc.ref);
        }
      });
      setActiveBuses(buses);
    }, (error) => console.error("Firestore Listen Error:", error));
    return () => unsubscribe();
  }, [isLive, searchQuery, mode]);

  const handleGoLiveToggle = async () => {
    if (isLive) {
      setIsLive(false);
      clearInterval(locationUpdateInterval.current);
      if (activeBusDocId.current) {
        await deleteDoc(doc(db, "active_buses", activeBusDocId.current));
        activeBusDocId.current = null;
      }
    } else {
      if (liveRouteNumber.trim() === "") {
        Alert.alert("Route Number Required", "Please enter the bus number."); return;
      }
      try {
        const docRef = await addDoc(collection(db, "active_buses"), {
          routeId: liveRouteNumber.toUpperCase().trim(),
          currentLocation: { latitude: location.latitude, longitude: location.longitude },
          lastUpdatedAt: serverTimestamp(),
        });
        activeBusDocId.current = docRef.id;
        setIsLive(true);
        locationUpdateInterval.current = setInterval(async () => {
          let pos = await Location.getCurrentPositionAsync({});
          if (pos.coords && activeBusDocId.current) {
            await updateDoc(doc(db, "active_buses", activeBusDocId.current), {
              currentLocation: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
              lastUpdatedAt: serverTimestamp(),
            });
            setLocation(pos.coords);
          }
        }, LOCATION_UPDATE_INTERVAL);
      } catch (e) {
        Alert.alert("Error", "Could not start sharing location.");
      }
    }
  };

  const openChat = (busId) => {
    setCurrentChatBusId(busId);
    setChatVisible(true);
  };

  const styles = getStyles(theme);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: location?.latitude || 12.9716,
    longitude: location?.longitude || 77.5946,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.exitButton} onPress={onExit}>
          <Text style={styles.exitButtonText}>‹ Back</Text>
      </TouchableOpacity>
      {mode === 'waiter' && <SearchBar theme={theme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
      <MapView 
        ref={mapRef} 
        style={styles.map} 
        provider={PROVIDER_GOOGLE} 
        initialRegion={initialRegion} 
        showsUserLocation={!isLive} 
        showsMyLocationButton={true}
        customMapStyle={theme.mapStyle} // Apply the dark map style!
      >
        {isLive && location && <Marker coordinate={location} title="My Location" pinColor={theme.secondary} />}
        {activeBuses.map(bus => (
          <Marker key={bus.id} coordinate={bus.currentLocation} title={`Bus ${bus.routeId}`} onPress={() => openChat(bus.id)}>
            <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.busMarker}>
              <Text style={styles.busMarkerText}>🚌</Text>
            </Animatable.View>
          </Marker>
        ))}
      </MapView>
      <ChatModal isVisible={isChatVisible} onClose={() => setChatVisible(false)} busId={currentChatBusId} db={db} senderId={senderId} theme={theme} />
      {mode === 'rider' && <GoLiveControls isLive={isLive} onToggle={handleGoLiveToggle} routeNumber={liveRouteNumber} setRouteNumber={setLiveRouteNumber} theme={theme} />}
    </SafeAreaView>
  );
};

// Styles are now a function that accepts the theme
const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    map: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },
    loadingText: { marginTop: 10, fontSize: 16, color: theme.primary },
    busMarker: { alignItems: 'center', justifyContent: 'center' },
    busMarkerText: { fontSize: 30 },
    exitButton: { position: 'absolute', top: 50, left: 15, zIndex: 1, backgroundColor: theme.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, opacity: 0.9 },
    exitButtonText: { color: theme.primary, fontSize: 16, fontWeight: 'bold' },
});

export default MapScreen;