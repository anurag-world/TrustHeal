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

export default function TCPatient() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <SafeAreaView
        style={{
          backgroundColor: '#2B8ADA',
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
          <Header title="Terms & Conditions" showMenu={false} />
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
                Terms & Conditions
              </Text>
            </View>
            <View style={{ alignSelf: 'center', width: '90%' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.parStyles}>
                  By proceeding, I agree that I have read and understood the terms & conditions of
                  usage of this platform and consent to / accept the same. I am voluntarily availing
                  the services provided on this platform. I am fully aware that on this platform I
                  will not be undergoing any physical examination by a physician who may recommend
                  medical tests and/or treatment and/or the prescribe OTC drugs.
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.parStyles}>
                  I am also aware that the consultation on this platform does not remove the need
                  for me to visit a physician and opt for physical examination at any point in time
                  and I am free to request for the same. Such a physical examination may even be
                  advised by the consulting physician.
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
