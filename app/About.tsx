import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Text,
  ScrollView,
  ImageBackground,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter } from 'expo-router';


// Modern dental-themed background - you can replace with a local image path
const backgroundImage = { uri: 'https://t3.ftcdn.net/jpg/01/19/67/02/360_F_119670247_HDccziQUuo2kFpaNiM22dIto5I8GPAWW.jpg' };
const windowWidth = Dimensions.get('window').width;


export default function About() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [activeCard, setActiveCard] = useState(0);


  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];


  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();


    // Auto-rotate featured cards
    const cardInterval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 4000);


    return () => clearInterval(cardInterval);
  }, []);


  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });


  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/+not-found');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };


  const handleReservation = () => {
    router.push('/Reservation');
  };


  const handleCheckReservations = () => {
    router.push('/ReservationScreen');
  };


  const serviceCards = [
    {
      icon: 'tooth-outline',
      title: 'Regular Checkups',
      description: 'Comprehensive examinations to maintain your oral health',
    },
    {
      icon: 'white-balance-sunny',
      title: 'Teeth Whitening',
      description: 'Professional whitening for a brilliantly bright smile',
    },
    {
      icon: 'medical-bag',
      title: 'Cosmetic Dentistry',
      description: 'Transform your smile with our advanced cosmetic procedures',
    },
    {
      icon: 'account-child',
      title: 'Pediatric Care',
      description: 'Kid-friendly dental care in a warm, comfortable environment',
    }
  ];


  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }]
            }
          ]}
        >
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="tooth" size={28} color="#ffffff" style={styles.logoIcon} />
            <Text style={styles.logo}>SmileCare</Text>
          </View>


          <View style={styles.profileMenu}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <MaterialCommunityIcons name="account-circle" size={38} color="#ffffff" />
            </TouchableOpacity>


            {menuVisible && (
              <Animated.View
                style={[
                  styles.menu,
                  { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
              >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    router.push('/Profile');
                    setMenuVisible(false);
                  }}
                >
                  <MaterialCommunityIcons name="account" size={22} color="#1A6Dff" />
                  <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
               
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogout}
                >
                  <MaterialCommunityIcons name="logout" size={22} color="#FF3A5A" />
                  <Text style={[styles.menuText, {color: '#FF3A5A'}]}>Logout</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </Animated.View>


        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <Animated.View
            style={[
              styles.welcomeSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandText}>SmileCare</Text>
            <Text style={styles.tagline}>Your Journey to a Perfect Smile</Text>
           
            <View style={styles.separator}>
              <View style={styles.line} />
              <MaterialCommunityIcons name="tooth" size={20} color="#1A6Dff" />
              <View style={styles.line} />
            </View>
          </Animated.View>


          <View style={styles.cardsCarousel}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.missionCard,
                  {
                    opacity: activeCard === index ? 1 : 0,
                    transform: [{ scale: activeCard === index ? 1 : 0.95 }],
                    zIndex: activeCard === index ? 3 : 1
                  }
                ]}
              >
                <Text style={styles.cardTitle}>
                  {index === 0 ? 'Our Mission' :
                   index === 1 ? 'What We Offer' : 'Why Choose Us'}
                </Text>
                <Text style={styles.cardText}>
                  {index === 0 ?
                    'To provide high-quality, compassionate dental care in a relaxing and stress-free environment.' :
                   index === 1 ?
                    'From routine checkups to advanced cosmetic procedures, we ensure personalized treatment for every patient.' :
                    'State-of-the-art technology, patient-centered care, and a team of experienced specialists committed to your smile.'}
                </Text>
                <MaterialCommunityIcons
                  name={index === 0 ? "target" : index === 1 ? "star-circle" : "check-circle"}
                  size={32}
                  color="#1A6Dff"
                  style={styles.cardIcon}
                />
              </Animated.View>
            ))}
           
            <View style={styles.indicators}>
              {[0, 1, 2].map((index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    activeCard === index && styles.activeIndicator
                  ]}
                  onPress={() => setActiveCard(index)}
                />
              ))}
            </View>
          </View>


          <Text style={styles.sectionTitle}>Our Services</Text>
         
          <View style={styles.servicesContainer}>
            {serviceCards.map((service, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.serviceCard,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: Animated.multiply(slideAnim, 1.2) }]
                  }
                ]}
              >
                <View style={styles.serviceIconContainer}>
                  <MaterialCommunityIcons name={service.icon} size={32} color="#ffffff" />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </Animated.View>
            ))}
          </View>


          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.makeReservationButton]}
              onPress={handleReservation}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="calendar-plus" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Book Appointment</Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[styles.actionButton, styles.checkReservationsButton]}
              onPress={handleCheckReservations}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="calendar-search" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>My Appointments</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.footer}>
            <Text style={styles.footerText}>SmileCare Dental Clinic</Text>
            <Text style={styles.footerSubtext}>Creating Beautiful Smiles Since 2028</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon}>
                <MaterialCommunityIcons name="instagram" size={22} color="#1A6Dff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <MaterialCommunityIcons name="facebook" size={22} color="#1A6Dff" />  
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <MaterialCommunityIcons name="twitter" size={22} color="#1A6Dff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.contactInfo}>📞 (555) 123-4567 • 📧 adv@smilecare.com</Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    width: '100%',
    height: 90,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: '#1A6Dff',
    paddingTop: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  logoIcon: {
    marginRight: 8,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 110,
    paddingBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  welcomeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 22,
    color: '#333',
    fontWeight: '500',
  },
  brandText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1A6Dff',
    letterSpacing: 2,
    marginTop: 5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    marginTop: 10,
    fontStyle: 'italic',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#1A6Dff',
  },
  cardsCarousel: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 15,
    height: 180,
    position: 'relative',
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: windowWidth - 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    borderLeftWidth: 5,
    borderLeftColor: '#1A6Dff',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A6Dff',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    paddingRight: 30,
  },
  cardIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    opacity: 0.8,
  },
  indicators: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C0C0C0',
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: '#1A6Dff',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  serviceIconContainer: {
    backgroundColor: '#1A6Dff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#1A6Dff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 18,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  makeReservationButton: {
    backgroundColor: '#1A6Dff',
  },
  checkReservationsButton: {
    backgroundColor: '#3F51B5',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  profileMenu: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 110,
  },
  profileButton: {
    padding: 4,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 150,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#1A6Dff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#1A6Dff',
    marginLeft: 10,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 25,
    borderTopWidth: 1,
    borderTopColor: 'rgba(26, 109, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  footerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A6Dff',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    marginBottom: 16,
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 109, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(26, 109, 255, 0.3)',
  },
  contactInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  }
});
