/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

export default function PatientTC({ setTermsView }) {
  const window = Dimensions.get('window');
  return (
    <View
      style={{
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <View
        style={[
          styles.modalView,
          {
            borderRadius: 10,
            width: '90%',
            alignSelf: 'center',
            padding: 25,
          },
        ]}
      >
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              padding: 5,
              color: 'black',
            }}
          >
            Terms & Condition
          </Text>
          <FAIcon
            name="window-close"
            color="black"
            size={26}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
            onPress={() => {
              setTermsView(false);

              // setZoom(1);
            }}
          />
        </View>
        <ScrollView
          style={{
            minHeight: 150,
            width: '100%',
            maxHeight: window.height - 200,
          }}
        >
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
                I am also aware that the consultation on this platform does not remove the need for
                me to visit a physician and opt for physical examination at any point in time and I
                am free to request for the same. Such a physical examination may even be advised by
                the consulting physician.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parStyles: {
    textAlign: 'justify',
    fontSize: 13,
    marginVertical: 5,
    lineHeight: 15,
    color: 'black',
  },
  modalView: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalText: {
    marginVertical: 15,
    marginHorizontal: 10,
    textAlign: 'center',
  },
});
