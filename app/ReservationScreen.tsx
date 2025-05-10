import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firestore } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const backgroundImage = require('../assets/images/Background.png');

export default function ReservationScreen() {
  const router = useRouter();
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          Alert.alert('Error', 'User not authenticated');
          return;
        }

        const q = query(collection(firestore, 'reservations'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data(); // Assuming we are fetching the latest reservation
          setReservationData(data);
        } else {
          Alert.alert('No Reservation Found', 'No reservation data found for this user.');
        }
      } catch (error) {
        console.error('Error fetching reservation data: ', error);
        Alert.alert('Error', 'Something went wrong while fetching the reservation data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!reservationData) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/About')}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>No Reservation Found</Text>
      </View>
    );
  }

  const { fullName, email, date, time, service } = reservationData;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        {/* Back Button to About screen */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/About')}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>📋 Reservation Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{fullName}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>

          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>

          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{time}</Text>

          <Text style={styles.label}>Service:</Text>
          <Text style={styles.value}>{service}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 12,
    marginTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});