import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter } from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function About() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/Home');
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const handleReservation = () => {
    router.push('/Reservation');  // Navigate to Reservation Screen
  };

  const handleSettings = () => {
    router.push('/Settings'); // Navigate to Settings Screen
  };

  const handleCheckReservations = () => {
    router.push('/ReservationCheckScreen');  // Navigate to the Reservation Check Screen
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E0F7FA', dark: '#004D40' }}
      headerImage={
        <MaterialCommunityIcons
          size={310}
          color="#00BCD4"
          name="tooth-outline"
          style={styles.headerImage}
        />
      }>
      
      {/* Profile Icon */}
      <View style={styles.topRight}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialCommunityIcons name="account-circle" size={34} color="#004D40" />
        </TouchableOpacity>
      </View>

      {/* Profile Dropdown Menu */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleSettings}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>🦷 About Our Dental Clinic 🪥</ThemedText>
      </ThemedView>
      <ThemedText style={styles.description}>
        Welcome to SmileCare Dental Clinic! We provide top-notch dental services with care and comfort.
      </ThemedText>

      <Collapsible title="Our Mission">
        <ThemedText>
          To deliver gentle, compassionate, and quality dental care to every patient.
        </ThemedText>
      </Collapsible>

      <Collapsible title="What We Offer">
        <ThemedText>
          From routine checkups to cosmetic dentistry, we offer a full range of dental services.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Why Choose Us">
        <ThemedText>
          We prioritize patient comfort, use modern equipment, and ensure a stress-free experience.
        </ThemedText>
      </Collapsible>

      <TouchableOpacity style={styles.reservationButton} onPress={handleReservation}>
        <Text style={styles.reservationButtonText}>📝 Make a Reservation</Text>
      </TouchableOpacity>

      {/* New Button to Check Reservations */}
      <TouchableOpacity style={styles.checkReservationButton} onPress={handleCheckReservations}>
        <Text style={styles.checkReservationText}>🔍 Check Your Reservations</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -70,
    left: -20,
    position: 'absolute',
  },
  topRight: {
    position: 'absolute',
    top: 10,  // Placing it at the very top
    right: 20,
    zIndex: 100,
  },
  menu: {
    position: 'absolute',
    top: 50,  // Slightly below the profile icon
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 5,
    zIndex: 100,
  },
  menuText: {
    fontSize: 16,
    color: '#004D40',  // A green color to match the theme
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004D40',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    color: '#00796B',
    textAlign: 'center',
  },
  reservationButton: {
    backgroundColor: '#00BCD4',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  reservationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkReservationButton: {
    backgroundColor: '#FF4081',  // A distinct color for the new button
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  checkReservationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
