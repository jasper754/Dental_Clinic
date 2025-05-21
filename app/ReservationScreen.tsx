import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firestore } from './firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const backgroundImage = require('../assets/images/Background.png');

export default function ReservationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);

  const showAlertMessage = (title, message) => {
    if (Platform.OS !== 'web') {
      Alert.alert(title, message);
      return;
    }
    window.alert(`${title}\n\n${message}`);
  };

  useEffect(() => {
    if (params.fullName && params.email && params.date && params.time && params.service) {
      setReservationData({
        fullName: params.fullName,
        email: params.email,
        date: params.date,
        time: params.time,
        service: params.service,
      });
      setLoading(false);
      return;
    }

    const fetchReservationData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          showAlertMessage('Error', 'User not authenticated');
          setLoading(false);
          return;
        }

        const q = query(collection(firestore, 'reservations'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const reservations = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          reservations.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
          setReservationData(reservations[0]);
        } else {
          showAlertMessage('No Reservation Found', 'No reservation data found for this user.');
        }
      } catch (error) {
        console.error('Error fetching reservation data: ', error);
        showAlertMessage('Error', 'Something went wrong while fetching the reservation data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [params]);

  const handleCancel = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      showAlertMessage('Error', 'User not authenticated');
      return;
    }

    if (Platform.OS !== 'web') {
      Alert.alert(
        'Cancel Appointment',
        'Are you sure you want to cancel your appointment?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: async () => {
              try {
                if (!reservationData?.id) {
                  showAlertMessage('Error', 'Reservation ID not found');
                  return;
                }
                await deleteDoc(doc(firestore, 'reservations', reservationData.id));
                showAlertMessage('Cancelled', 'Your appointment has been cancelled.');
                router.push('/About');
              } catch (error) {
                console.error('Error deleting reservation:', error);
                showAlertMessage('Error', 'Failed to cancel the appointment. Please try again.');
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      const confirmed = window.confirm('Are you sure you want to cancel your appointment?');
      if (confirmed) {
        try {
          if (!reservationData?.id) {
            showAlertMessage('Error', 'Reservation ID not found');
            return;
          }
          await deleteDoc(doc(firestore, 'reservations', reservationData.id));
          showAlertMessage('Cancelled', 'Your appointment has been cancelled.');
          router.push('/About');
        } catch (error) {
          console.error('Error deleting reservation:', error);
          showAlertMessage('Error', 'Failed to cancel the appointment. Please try again.');
        }
      }
    }
  };

  const getIconForService = (serviceName) => {
    const serviceIcons = {
      'Teeth Cleaning': 'tooth-outline',
      'Dental Checkup': 'medical-bag',
      'Teeth Whitening': 'white-balance-sunny',
      'Root Canal': 'needle',
      'Braces Consultation': 'content-save-outline',
    };
    return serviceIcons[serviceName] || 'calendar-check';
  };

  const formatDate = (dateString) => {
    return dateString;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="loading" size={40} color="#0A6EBD" />
        <Text style={styles.loadingText}>Loading your reservation...</Text>
      </View>
    );
  }

  if (!reservationData) {
    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.noDataContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/About')}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="calendar-alert" size={80} color="#0A6EBD" />
          <Text style={styles.noDataTitle}>No Reservation Found</Text>
          <Text style={styles.noDataText}>You don't have any active reservations at the moment.</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => router.push('/Reservation')}>
              <MaterialCommunityIcons name="calendar-plus" size={22} color="#fff" />
            <Text style={styles.createButtonText}>Create New Appointment</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    );
  }

  const { fullName, email, date, time, service } = reservationData;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/About')}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Appointment</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="calendar-check" size={30} color="#0A6EBD" />
            <Text style={styles.cardTitle}>Appointment Details</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={22} color="#0A6EBD" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Patient Name</Text>
                <Text style={styles.infoValue}>{fullName}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email-outline" size={22} color="#0A6EBD" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={22} color="#0A6EBD" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Appointment Date</Text>
                <Text style={styles.infoValue}>{formatDate(date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock-outline" size={22} color="#0A6EBD" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Appointment Time</Text>
                <Text style={styles.infoValue}>{time}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name={getIconForService(service)} size={22} color="#0A6EBD" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Service Type</Text>
                <Text style={styles.infoValue}>{service}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={() =>
                router.push({
                  pathname: '/EditReservation',
                  params: {
                    id: reservationData.id,
                    fullName,
                    email,
                    date,
                    time,
                    service,
                  },
                })
              }
            >
              <MaterialCommunityIcons name="calendar-edit" size={18} color="#0A6EBD" />
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <MaterialCommunityIcons name="calendar-remove" size={18} color="#fff" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.reminderText}>
            Please arrive 15 minutes before your scheduled appointment.
            To reschedule or cancel, please do so at least 24 hours in advance.
          </Text>
        </View>

        <TouchableOpacity style={styles.newAppointmentButton} onPress={() => router.push('/Reservation')}>
          <MaterialCommunityIcons name="calendar-plus" size={22} color="#fff" />
          <Text style={styles.newAppointmentText}>Book Another Appointment</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    headerContainer: {
      backgroundColor: '#0A6EBD',
      width: '100%',
      paddingTop: 50,
      paddingBottom: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
      marginBottom: 20,
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.9)',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#0A6EBD',
    },
    noDataContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'rgba(255,255,255,0.9)',
      margin: 20,
      borderRadius: 16,
    },
    noDataTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#0A6EBD',
      marginTop: 16,
      marginBottom: 8,
    },
    noDataText: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666',
      marginBottom: 30,
    },
    backButton: {
      position: 'absolute',
      left: 20,
      top: 50,
      zIndex: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: 20,
      padding: 20,
      width: '90%',
      shadowColor: '#0A6EBD',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
      marginBottom: 20,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,

      createButton: {
  flexDirection: 'row',
  backgroundColor: '#0A6EBD',
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#0A6EBD',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 6,
  marginTop: 10,
  width: '90%',
},
createButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
  marginLeft: 8,
},

    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#0A6EBD',
      marginLeft: 10,
    },
    divider: {
      height: 1,
      backgroundColor: '#E0E7FF',
      marginVertical: 15,
    },
    infoContainer: {
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    infoTextContainer: {
      marginLeft: 15,
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    rescheduleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E0E7FF',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flex: 1,
      marginRight: 8,
    },
    rescheduleButtonText: {
      color: '#0A6EBD',
      fontWeight: '600',
      marginLeft: 6,
    },
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FF6B6B',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flex: 1,
      marginLeft: 8,
    },
    cancelButtonText: {
      color: '#fff',
      fontWeight: '600',
      marginLeft: 6,
    },
    reminderText: {
      fontSize: 13,
      color: '#666',
      textAlign: 'center',
      lineHeight: 18,
    },
    newAppointmentButton: {
      flexDirection: 'row',
      backgroundColor: '#0A6EBD',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#0A6EBD',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
      width: '90%',
    },
    newAppointmentText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
      marginLeft: 8,
    },
  });