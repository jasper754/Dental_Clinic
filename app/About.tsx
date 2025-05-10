import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Text, ScrollView, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter } from 'expo-router';

const backgroundImage = require('../assets/images/Background.png');

export default function About() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/+not-found');
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const handleReservation = () => {
    router.push('/Reservation'); // Navigate to Reservation Screen
  };

  const handleCheckReservations = () => {
    router.push('/ReservationScreen'); // Navigate to Reservation Check Screen
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>SmileCare 🦷</Text>
          <Text style={styles.heading}>Welcome to SmileCare</Text>
          <Text style={styles.subheading}>Your smile is our priority</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardText}>
              To provide high-quality, compassionate dental care in a stress-free environment.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What We Offer</Text>
            <Text style={styles.cardText}>
              From routine checkups to advanced cosmetic procedures, we ensure every patient gets the best treatment.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Why Choose Us</Text>
            <Text style={styles.cardText}>
              We use modern equipment, focus on patient comfort, and offer a welcoming atmosphere for all our clients.
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.floatingButton} onPress={handleReservation}>
            <Text style={styles.floatingButtonText}>📝 Make a Reservation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.floatingButton} onPress={handleCheckReservations}>
            <Text style={styles.floatingButtonText}>🔍 Check Reservations</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileMenu}>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#004D40" />
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.menu}>
              <TouchableOpacity onPress={() => router.push('/Profile')}>
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 38,
    fontWeight: '800',
    color: '#004D40',
    marginBottom: 5,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#004D40',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 18,
    color: '#00796B',
    textAlign: 'center',
    marginBottom: 15,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004D40',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#00796B',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  floatingButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileMenu: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 100,
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  menuText: {
    padding: 10,
    fontSize: 18,
    color: '#00796B',
  },
});
