import React from 'react';
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import Header from '../components/HeaderPatient';

export default function About() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <SafeAreaView
        style={{
          width: '100%',
        }}
      >
        <ScrollView
          style={{
            width: '100%',
            alignSelf: 'center',
            // marginTop: 30,
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar animated backgroundColor="#2B8ADA" />
          <Header title="About TrustHeal" showMenu={false} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              width: '95%',
              alignSelf: 'center',
            }}
          >
            <View style={{ flex: 1, alignSelf: 'center' }}>
              <Text
                style={{
                  textAlign: 'justify',
                  color: '#2B8ADA',
                  fontSize: 20,
                  fontWeight: 'bold',
                  borderBottomWidth: 2,
                  borderBottomColor: '#2B8ADA',
                  marginVertical: 20,
                }}
              >
                About TrustHeal
              </Text>
            </View>
            <View style={{ alignSelf: 'center', width: '90%' }}>
              <View style={{ flex: 1, alignSelf: 'center' }}>
                <Text style={styles.parStyles}>
                  TrustHeal is a healthcare platform with a mission to become India{`'`}s No. 1
                  health consultation platform. The platform aims to provide on-demand, qualified,
                  affordable, convenient, and secure medical consultations with the best doctors at
                  the click of a button on mobile devices.
                </Text>
              </View>
              <View style={{ flex: 1, alignSelf: 'center' }}>
                <Text style={styles.parStyles}>
                  TrustHeal envisions itself to be the platform of choice for all health
                  consultation needs in India. Its mission is to provide access to quality health
                  and medical facilities to every cross section of society by connecting people with
                  specialist doctors, hospitals, clinics, pharmacies, diagnostics, and
                  rehabilitation centers on-demand.
                </Text>
              </View>
              <View style={{ flex: 1, alignSelf: 'center' }}>
                <Text style={styles.parStyles}>
                  TrustHeal{`'`}s focus on accessibility and affordability makes it an attractive
                  option for people seeking quality healthcare services in India. The platform{`'`}s
                  seamless connectivity and easy-to-use interface make it possible for people to
                  access medical consultation with minimal effort and at an affordable price.
                </Text>
              </View>
              <View style={{ flex: 1, alignSelf: 'center' }}>
                <Text style={styles.parStyles}>
                  Overall, TrustHeal{`'`}s commitment to making quality healthcare accessible to all
                  is commendable, and it has the potential to revolutionize the healthcare industry
                  in India by bridging the gap between patients and healthcare providers.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f0fe',
  },
  parStyles: {
    textAlign: 'left',
    fontSize: 13,
    marginVertical: 5,
    lineHeight: 15,
    color: 'black',
  },
});
