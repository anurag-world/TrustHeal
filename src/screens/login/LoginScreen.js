/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Center,
  VStack,
  Image,
  Text,
  FormControl,
  Input,
  Button,
  HStack,
  Checkbox,
  Pressable,
  WarningOutlineIcon,
  Stack,
} from 'native-base';
import {
  Modal,
  Dimensions,
  Keyboard,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiConfig from '../../components/API/apiConfig';
import logo from '../../../assets/TH_trans1.png';
import onBoardingImg from '../../../assets/onBoarding.png';
import healthProIcon from '../../../assets/health-pro-icon.png';

import OTPModal from './OTPModal';
// import {
//   NotificationListner,
//   requestUserPermission,
// } from '../../components/API/PushNotification';
// import ForegroundHandler from '../../components/API/ForegroundHandler';
import PatientTC from '../../components/policies/PatientTC';
import PatientPP from '../../components/policies/PatientPP';

export default function LoginScreen() {
  const [checked, setChecked] = useState(false);
  const [mob, setMob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [termsView, setTermsView] = useState(false);
  const [ppView, setPpView] = useState(false);
  const [resend, setResend] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);

  const nextScreen = 'PatientRegistration';

  const { height } = Dimensions.get('screen');

  const navigation = useNavigation();

  // const getPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //     ]);
  //   }
  // };

  // const isFocused = useIsFocused();

  //   useEffect(() => {
  //     const getFCM = async () => {
  //       let x = null;
  //       await AsyncStorage.getItem('fcmToken').then(async response => {
  //         if (response == null) {
  //           await requestUserPermission();
  //         } else {
  //           x = response;
  //         }
  //       });
  //       console.log('Role Screen FCM Token is\n', x);
  //     };
  //     getFCM();
  //   }, [isFocused]);

  //   useEffect(() => {
  //     const onLoad = async () => {
  //       await getPermission();
  //       NotificationListner();
  //     };
  //     onLoad();
  //   }, []);

  useEffect(() => {
    const onLoadSetData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
      console.log('Doctor Object: ', x);

      const y = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      console.log('Patient Object: ', y);

      if (x != null && y == null) {
        if (x.profileStatus === 'VERIFIED') {
          navigation.navigate('DoctorHome', { doctorObj: x });
        } else {
          navigation.navigate('DoctorRegistrationStep2');
        }
      } else if (x == null && y != null) {
        if (y.profileComplete) {
          navigation.navigate('PatientHome', { patientObj: y });
        } else {
          navigation.navigate('PatientRegistration1');
        }
      }
    };
    onLoadSetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (val) => {
    if (val.trim().length <= 10) {
      setMob(val);
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
          setResend(true);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
    // setModalVisible(true);
    // setResend(true);
    setIsLoading(false);
  };

  const onContinuePressed = async () => {
    setError(false);

    if (mob.trim().length !== 10) {
      setError(true);
      setMsg('Please enter valid mobile number!');
      return;
    }

    if (!checked && mob.trim().length === 10) {
      setError(true);
      setMsg('Please Agree to T&C & Privacy Policy');
      return;
    }

    try {
      await AsyncStorage.setItem('mobileNumber', mob);
      console.log(await AsyncStorage.getItem('mobileNumber'));
      sendOTP();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Pressable flex="1" onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <ForegroundHandler /> */}
        <Center flex="1" bg="primary.default" p={4}>
          <Box
            w="full"
            h="full"
            bg="light.default"
            borderRadius="lg"
            alignItems="center"
            borderWidth={1}
            borderColor="blue.200"
            pt={height < 900 ? 8 : 12}
          >
            {/* Section 1 */}
            <VStack space={height < 900 ? 4 : 8} alignItems="center" w="full" px={2}>
              {/* Logo */}
              <Image source={logo} alt="logo" w={200} h={60} resizeMode="contain" />

              {/* Headline */}
              <VStack space={0.5} alignItems="center" pb={2} w="full">
                <Text
                  fontSize={height < 900 ? 15 : 16}
                  fontWeight={height < 900 ? 500 : 600}
                  textAlign="center"
                  color="text.primary"
                >
                  Experience the power of{' '}
                  <Text
                    fontSize={height < 900 ? 16 : 17}
                    fontWeight={height < 900 ? 500 : 600}
                    fontStyle="italic"
                    color="text.secondary"
                  >
                    TeleConsultation
                  </Text>
                </Text>
                <Text
                  fontSize={height < 900 ? 15 : 16}
                  fontWeight={height < 900 ? 500 : 600}
                  color="text.primary"
                >
                  Accessible{' '}
                  <Text
                    fontSize={height < 900 ? 16 : 17}
                    fontWeight={height < 900 ? 500 : 600}
                    color="text.secondary"
                    fontStyle="italic"
                  >
                    Anytime Anywhere
                  </Text>
                </Text>
              </VStack>

              {/* On Boarding Image */}
              <Image
                source={onBoardingImg}
                alt="onBoarding"
                h={height < 900 ? 150 : 200}
                resizeMode="contain"
                opacity={90}
              />
            </VStack>

            {/* Section 2 */}
            <VStack space={2} w="full" alignItems="center" pt={height < 900 ? 6 : 8} px={8}>
              {/* Headline */}
              <Text
                textAlign="center"
                fontSize={height < 900 ? 'md' : 'lg'}
                fontWeight="bold"
                textTransform="uppercase"
                color="text.primary"
              >
                Sign In / Sign Up
              </Text>

              {/* Mobile number input */}
              <FormControl isRequired isInvalid={error}>
                <Input
                  _focus={{ fontWeight: 600 }}
                  fontWeight={600}
                  variant="underlined"
                  placeholder="Enter Mobile Number"
                  size="lg"
                  textAlign="center"
                  _input={{ marginLeft: 4 }}
                  onChangeText={(val) => handleChange(val)}
                  value={mob}
                  keyboardType="number-pad"
                  contextMenuHidden
                />
                {error && (
                  <FormControl.ErrorMessage
                    alignItems="center"
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {msg}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>

              {/* Login action button */}
              <Button
                onPress={() => onContinuePressed()}
                size="md"
                w="full"
                bg="secondary.default"
                _text={{
                  fontSize: 'sm',
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                }}
                shadow={2}
                mt={2}
                borderRadius={4}
                isLoading={isLoading}
                isLoadingText={isLoading && 'Please Wait...'}
                _pressed={{
                  bg: '#4495D8',
                }}
              >
                Continue
              </Button>

              {/* Accept T&C and Privacy Policy */}
              <HStack space={2} pt={2} alignItems="center">
                <Checkbox
                  shadow={1}
                  value="agree"
                  accessibilityLabel="I Agree to T&C and Privacy Policy"
                  isChecked={checked}
                  onChange={() => setChecked((prev) => !prev)}
                  borderRadius="xl"
                  _checked={{ bg: 'green.600', borderColor: 'green.600' }}
                  _text={{ color: 'text.primary', fontWeight: 500 }}
                />
                <Text fontSize={12} fontWeight={600} color="text.primary">
                  I Agree to{' '}
                  <Text
                    color="text.secondary"
                    textDecorationLine="underline"
                    onPress={() => setTermsView(true)}
                  >
                    T&C
                  </Text>{' '}
                  and{' '}
                  <Text
                    color="text.secondary"
                    textDecorationLine="underline"
                    onPress={() => setPpView(true)}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </HStack>
            </VStack>

            {/* Health Professional/Doctor login button */}
            <Stack
              flex={1}
              w="full"
              justifyContent="center"
              alignItems="center"
              style={{ flexDirection: 'row' }}
              px={2}
            >
              <Image
                source={healthProIcon}
                alt="healthProIcon"
                size={12}
                opacity={90}
                style={{ marginRight: 10 }}
              />
              <HStack space={3} style={{ flexDirection: 'column' }}>
                <Text textAlign="center" fontSize="md" fontWeight={700} color="text.primary">
                  For Health Professionals / Doctors
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('OTPScreen', {
                      nextScreen: 'RegisterDoctor',
                    });
                  }}
                >
                  <Text color="text.secondary" fontWeight={700}>
                    Register / Login
                  </Text>
                </TouchableOpacity>
              </HStack>
            </Stack>
          </Box>
        </Center>
      </SafeAreaView>

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
      {termsView && (
        <Modal
          animationType="slide"
          transparent
          visible={termsView}
          onRequestClose={() => {
            setTermsView(!termsView);
          }}
        >
          <PatientTC setTermsView={setTermsView} />
        </Modal>
      )}
      {ppView && (
        <Modal
          animationType="slide"
          transparent
          visible={ppView}
          onRequestClose={() => {
            setPpView(!ppView);
          }}
        >
          <PatientPP setPpView={setPpView} />
        </Modal>
      )}
    </Pressable>
  );
}
