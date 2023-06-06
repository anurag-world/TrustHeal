/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Keyboard } from 'react-native';
import axios from 'axios';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Countdown from 'react-native-countdown-fixed';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Box, Button, Pressable, theme } from 'native-base';
import { isEmpty } from 'lodash';
import apiConfig from '../../components/API/apiConfig';

export default function OTPModal({
  mob,
  nextScreen,
  resend,
  setResend,
  sendOTP,
  setModalVisible,
  isLoading,
  setIsLoading,
}) {
  const pin1Ref = useRef(null);
  const pin2Ref = useRef(null);
  const pin3Ref = useRef(null);
  const pin4Ref = useRef(null);
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const [wrongOTPMessage, setwrongOTPMessage] = useState(false);
  const [val, setVal] = useState(30);

  const navigation = useNavigation();

  const reset = () => {
    setPin1('');
    setPin2('');
    setPin3('');
    setPin4('');
  };

  const onResend = () => {
    console.log('Resend OTP requested');
    reset();
    setResend(true);
    setVal(60);
    sendOTP();
  };

  const onFinishCount = () => {
    setResend(false);
  };

  const onSubmitPressed = async () => {
    setwrongOTPMessage(false);
    if (isEmpty(pin1) || isEmpty(pin2) || isEmpty(pin3) || isEmpty(pin4)) {
      Alert.alert('Invalid OTP', 'Please feed in 4 digit OTP!');
    } else {
      setIsLoading(true);

      const x = `${pin1}${pin2}${pin3}${pin4}`;
      // let no = await AsyncStorage.getItem("mobileNumber");
      // console.log(no);

      if (nextScreen === 'RegisterDoctor') {
        axios
          .post(`${apiConfig.baseUrl}/login/doctor/otp/verify`, {
            mobileNumber: mob,
            otp: x,
          })
          .then(async (response) => {
            setIsLoading(false);
            console.log(response.status);
            if (response.status === 204) {
              setModalVisible(false);
              reset();
              navigation.dispatch(StackActions.replace(nextScreen));
            } else if (response.status === 200) {
              setModalVisible(false);
              reset();
              const y = response.data;

              await AsyncStorage.setItem('UserDoctorProfile', JSON.stringify(y));

              if (y.profileStatus === 'VERIFIED') {
                setModalVisible(false);
                Alert.alert(
                  `Hey ${y.doctorName}`,
                  'Welcome to TrustHeal - Your Health Service Partner'
                );
                navigation.dispatch(StackActions.replace('DoctorHome', { doctorObj: y }));
              } else if (y.profileStatus === 'INCOMPLETE') {
                setModalVisible(false);
                Alert.alert(
                  `Hey ${y.doctorName}`,
                  'Please complete your profile to continue your journey with TrustHeal.'
                );
                navigation.dispatch(StackActions.replace('DoctorRegistrationStep2'));
              } else if (y.profileStatus === 'UNDER_VERIFICATION') {
                setModalVisible(false);
                Alert.alert(
                  `Hey ${y.doctorName}`,
                  'Your profile is under verification. We will inform you when your account has been verified'
                );
                navigation.dispatch(StackActions.replace('DoctorRegistrationStep2'));
              } else if (y.profileStatus === 'IMPROPER') {
                setModalVisible(false);
                Alert.alert(`Hey ${y.doctorName}`, `${y.improperProfileReason}`);
                navigation.dispatch(StackActions.replace('DoctorRegistrationStep2'));
              }
              // else if (y.profileStatus == 'DEACTIVATE') {
              //   setModalVisible(false);
              //   Alert.alert(
              //     `Hey ${y.doctorName}`,
              //     `Your account has been deactivated please contact admin.`,
              //   );
              // }
            }
          })
          .catch((error) => {
            setIsLoading(false);
            console.log(error);
            if (error === 'AxiosError: Request failed with status code 400') {
              // console.log(error);
              setwrongOTPMessage(true);
              reset();
            }
            if (error === 'AxiosError: Request failed with status code 401') {
              setModalVisible(false);
              Alert.alert('Sorry!', 'Your account has been deactivated please contact admin.');
              reset();
            }
          });
      } else {
        axios
          .post(`${apiConfig.baseUrl}/login/patient/otp/verify`, {
            mobileNumber: mob,
            otp: x,
          })
          .then(async (response) => {
            setIsLoading(false);
            console.log(response.data);
            if (response.status === 200) {
              setModalVisible(false);
              await AsyncStorage.setItem('UserPatientProfile', JSON.stringify(response.data));
              console.log(response.data);
              if (response.data.profileComplete) {
                Alert.alert(
                  `Hey ${response.data.patientName}`,
                  'Welcome to TrustHeal - Your Health Partner'
                );
                navigation.dispatch(
                  StackActions.replace('PatientHome', {
                    patientObj: response.data,
                  })
                );
              } else {
                Alert.alert('Important', 'Please complete your profile before continuing');
                navigation.dispatch(StackActions.replace('PatientRegistration'));
              }
            } else if (response.status === 204) {
              setModalVisible(false);
              console.log(response.data);
              Alert.alert('New User!', 'Please register yourself before continuing.');
              navigation.dispatch(StackActions.replace('PatientRegistration'));
            }
          })
          .catch((error) => {
            setIsLoading(false);
            if (error === 'AxiosError: Request failed with status code 400') {
              // console.log(error);
              setwrongOTPMessage(true);
              reset();
            }
          });
      }
    }
  };
  return (
    <Pressable onPress={Keyboard.dismiss}>
      <View style={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <View style={[styles.modalView, { flexDirection: 'column' }]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginTop: 15,
                color: theme.colors.dark[100],
              }}
            >
              Enter OTP
            </Text>
            <FAIcon
              name="window-close"
              color={theme.colors.dark[100]}
              size={26}
              style={{ position: 'absolute', top: 10, right: 10 }}
              onPress={() => {
                setModalVisible(false);
                reset();
              }}
            />
          </View>
          <View
            style={{
              width: '75%',
              alignItems: 'center',
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: theme.colors.dark[100],
                marginVertical: 16,
              }}
            >
              Enter 4 digit OTP sent to your mobile number and Registered Email
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FAIcon name="phone-alt" size={20} color={theme.colors.dark[100]} />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: theme.colors.dark[100],
                  marginLeft: 8,
                }}
              >
                {mob}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginVertical: 15,
              // justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <View style={styles.TextInputView}>
              <TextInput
                ref={pin1Ref}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(pin1Val) => {
                  setPin1(pin1Val);
                  if (pin1Val !== '') {
                    pin2Ref.current.focus();
                  }
                }}
                value={pin1}
                style={styles.TextInputText}
              />
            </View>
            <View style={styles.TextInputView}>
              <TextInput
                ref={pin2Ref}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(pin2Val) => {
                  setPin2(pin2Val);
                  if (pin2Val !== '') {
                    pin3Ref.current.focus();
                  }
                }}
                value={pin2}
                style={styles.TextInputText}
              />
            </View>
            <View style={styles.TextInputView}>
              <TextInput
                ref={pin3Ref}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(pin3Val) => {
                  setPin3(pin3Val);
                  if (pin3Val !== '') {
                    pin4Ref.current.focus();
                  }
                }}
                value={pin3}
                style={styles.TextInputText}
              />
            </View>
            <View style={styles.TextInputView}>
              <TextInput
                ref={pin4Ref}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(pin4Val) => {
                  setPin4(pin4Val);
                }}
                value={pin4}
                style={styles.TextInputText}
              />
            </View>
          </View>

          {/* OTP action button */}
          <Box w="full" px={4}>
            <Button
              onPress={() => onSubmitPressed()}
              size="md"
              w="full"
              bg="secondary.default"
              _text={{
                fontSize: 'sm',
                fontWeight: 600,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              }}
              shadow={2}
              my={2}
              borderRadius={4}
              isLoading={isLoading}
              isLoadingText={isLoading && 'Please Wait...'}
              _pressed={{
                bg: '#4495D8',
              }}
            >
              Submit
            </Button>
          </Box>
          <View
            style={{
              flexDirection: 'column',
              alignSelf: 'center',
              marginVertical: 10,
              width: '95%',
            }}
          >
            {wrongOTPMessage && (
              <Text
                style={{
                  fontSize: 15,
                  color: theme.colors.warning[600],
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  marginBottom: 8,
                }}
              >
                This otp is incorrect. Please recheck.
              </Text>
            )}

            {!resend ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: theme.colors.dark[100],
                    alignSelf: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  Didn{`'`}t recieve the OTP.
                </Text>

                <TouchableOpacity activeOpacity={0.8} onPress={onResend}>
                  <Text
                    style={{
                      fontSize: 15,
                      alignSelf: 'center',
                      fontWeight: 'bold',
                      color: '#2b8ada',
                      marginLeft: 4,
                    }}
                  >
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Text style={{ color: theme.colors.dark[100], fontWeight: 'bold' }}>
                  Resend OTP after
                </Text>

                <Countdown
                  size={15}
                  until={val}
                  digitStyle={{
                    marginHorizontal: 2,
                    padding: 0,
                  }}
                  digitTxtStyle={{
                    color: '#2b8ada',
                    padding: 0,
                    fontWeight: 'bold',
                  }}
                  style={{ marginTop: -10 }}
                  timeToShow={['M', 'S']}
                  timeLabels={{ m: '', s: '' }}
                  showSeparator
                  onFinish={onFinishCount}
                />

                <Text style={{ color: theme.colors.dark[100], fontWeight: 'bold' }}>sec</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    width: '100%',
    height: 440,
    bottom: 0,
    backgroundColor: 'white',
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
});
