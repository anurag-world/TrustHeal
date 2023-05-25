/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  View,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  LogBox,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import apiConfig from '../../components/API/apiConfig';
import waiting from '../../../assets/animations/waiting1.gif';
import logo from '../../../assets/TH_trans1.png';
import OTPModal from './OTPModal';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs(["EventEmitter.removeListener('appStateDidChange', ...) ..."]);
// import logo from '../Resources/Logo.jpg';

export default function OTPScreen() {
  const minLength = 10;
  const maxLength = 10;

  const [show, setShow] = useState(false);
  const [resend, setResend] = useState(false);

  const [mob, setMob] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [wrongOTPMessage, setwrongOTPMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();

  const { nextScreen } = route.params;
  console.log(nextScreen);

  const onContinuePressed = async () => {
    if (mob.length < minLength || mob.length > maxLength)
      Alert.alert('Invalid Mobile Number', 'Please enter valid mobile number!');
    else {
      setwrongOTPMessage(false);

      try {
        await AsyncStorage.setItem('mobileNumber', mob);
        sendOTP();
      } catch (e) {
        console.log(e);
        // }
      }
    }
  };

  const sendOTP = async () => {
    setIsLoading(true);
    axios
      .post(`${apiConfig.baseUrl}/login/otp/generate?mobilenumber=${mob}`)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          setModalVisible(true);
          setShow(true);
          // TODO: fix
          // setResend(true);
        }
      })
      .catch((error) => {
        Alert.alert('Error', `${error}`);
        setIsLoading(false);
      });
  };

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
        <StatusBar animated backgroundColor="#2B8ADA" />
        <ScrollView
          style={{
            width: '100%',
            alignSelf: 'center',
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Image
              source={logo}
              style={{
                width: '80%',
                resizeMode: 'contain',
                alignSelf: 'center',
                borderRadius: 50,
                margin: 20,
              }}
            />

            <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>
              <TextInput
                placeholder="Enter Mobile Number"
                style={{
                  borderRadius: 10,
                  padding: 15,
                  marginVertical: 10,
                  backgroundColor: 'white',
                  width: '80%',
                  fontSize: 15,
                }}
                onChangeText={(text) => setMob(text)}
                value={mob}
                keyboardType="number-pad"
                minLength={minLength}
                maxLength={maxLength}
                contextMenuHidden
              />
            </View>

            <CustomButton
              text="Continue"
              textstyle={{
                color: 'white',
                fontSize: 15,
              }}
              style={{
                backgroundColor: '#2b8ada',
                width: '80%',
                alignSelf: 'center',
                marginVertical: 20,
                borderRadius: 5,
              }}
              onPress={onContinuePressed}
            />
          </View>

          {isLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  borderRadius: 20,
                  width: 150,
                  height: 150,
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Image
                  source={waiting}
                  style={{
                    alignSelf: 'center',
                    width: 80,
                    height: 80,
                    // borderRadius: 150,
                  }}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    color: '#2B8ADA',
                    fontSize: 15,
                    fontWeight: 'bold',
                    width: '100%',
                    // padding: 10,
                  }}
                >
                  Please Wait...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {modalVisible && (
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <OTPModal
              mob={mob}
              nextScreen={nextScreen}
              resend={resend}
              setResend={setResend}
              sendOTP={sendOTP}
              setModalVisible={setModalVisible}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </Modal>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f0fe',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fe9703',
    margin: 50,
    alignSelf: 'center',
  },

  logo: {
    width: 66,
    height: 58,
  },
  iconStyle: {
    fontSize: 40,
    marginTop: 30,
    color: 'black',
  },
  pickerTitleStyle: {
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  textLink: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  pickerStyle: {
    height: 50,
    width: '30%',
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    marginRight: 1,
    fontSize: 15,
  },
  selectedCountryTextStyle: {
    paddingLeft: 5,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 15,
    textAlign: 'right',
  },
  TextInputView: {
    marginVertical: 1,
    borderRadius: 5,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#2b8ada',
    backgroundColor: 'white',
    width: 61,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextInputText: {
    width: 40,
    height: 40,
    fontSize: 16,
    marginHorizontal: 10,
    textAlign: 'center',
    padding: 0,
    color: 'black',
  },
  countryNameTextStyle: {
    paddingLeft: 10,
    color: '#000',
    textAlign: 'right',
  },

  searchBarStyle: {
    flex: 1,
  },
  containerStyle: {
    backgroundColor: '#e8f0fe',
    marginVertical: 0,
    borderWidth: 0,
  },
  modalView: {
    position: 'absolute',
    width: '100%',
    height: 440,
    bottom: 0,
    backgroundColor: 'white',
    borderTopRightRadius: 34,
    borderTopLeftRadius: 34,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
