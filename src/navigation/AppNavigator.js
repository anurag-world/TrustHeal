import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/login/LoginScreen';
import PatientRegistration from '../screens/register/PatientRegistration';
import PatientDrawer from './PatientDrawer';
import PatientAllAppointments from '../screens/patient/PatientAllAppointments';
import PatientCancelAppointments from '../screens/patient/PatientCancelAppointments';
import SupportPatient from '../screens/patient/SupportPatient';
import About from '../screens/About';
import TCPrivacy from '../screens/TCPrivacy';
import TCRefund from '../screens/TCRefund';
import TCPatient from '../screens/TCPatient';
import PatientProfileEdit from '../screens/patient/PatientProfileEdit';
import PatientFav from '../screens/patient/PatientFav';
import AllSpeciality from '../screens/patient/AllSpeciality';
import AllSymptoms from '../screens/patient/AllSymptoms';
import DoctorDetails from '../screens/patient/DoctorDetails';
import SelectSlotsE from '../screens/patient/SelectSlotsE';
import SelectSlotsP from '../screens/patient/SelectSlotsP';
import ConfirmBooking from '../screens/patient/ConfirmBooking';
import CallAgora from '../screens/patient/CallAgora';
import MyDrawer from './MyDrawer';
import OTPScreen from '../screens/login/OTPScreen';
import RegisterDoctor from '../screens/register/RegisterDoctor';
import DoctorRegistration2 from '../screens/register/DoctorRegistration2';
import DoctorProfileEdit from '../screens/doctor/DoctorProfileEdit';
import DoctorAllAppointments from '../screens/doctor/DoctorAllAppointments';
import FaqDoctor from '../screens/doctor/FaqDoctor';
import SupportDoctor from '../screens/doctor/SupportDoctor';
import AboutDoctor from '../screens/doctor/AboutDoctor';
import TCDoctor from '../screens/TCDoctor';
import CheifComplaints from '../screens/doctor/CheifComplaints';
import PreConsult from '../screens/patient/PreConsult';
import BodyScan from '../screens/doctor/BodyScan';
import Diagnosis from '../screens/doctor/Diagnosis';
import Medication from '../screens/doctor/Medication';
import Investigation from '../screens/doctor/Investigation';
import Advice from '../screens/doctor/Advice';
import FollowUp from '../screens/doctor/FollowUp';
import PrescriptionPreview from '../screens/doctor/PrescriptionPreview';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [doctorObj, setDoctorObj] = useState();
  useEffect(() => {
    const getName = async () => {
      const doctorStorageObj = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
      setDoctorObj(doctorStorageObj);
    };
    getName();
  }, []);

  // Temporary to check local storage
  useEffect(() => {
    const storage = async () => {
      const a = await AsyncStorage.getAllKeys();
      console.log(a);
    };
    storage();
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#e8f0fe',
            },
          }}
        />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{ headerBackButtonMenuEnabled: false, headerShown: false }}
        />
        <Stack.Screen
          name="PatientRegistration"
          component={PatientRegistration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatientHome"
          component={PatientDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatientAllAppointments"
          component={PatientAllAppointments}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatientCancelAppointments"
          component={PatientCancelAppointments}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SupportPatient"
          component={SupportPatient}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="TCPrivacy"
          component={TCPrivacy}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="TCRefund"
          component={TCRefund}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="TCPatient"
          component={TCPatient}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="PatientProfileEdit"
          component={PatientProfileEdit}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PatientFav" component={PatientFav} options={{ headerShown: false }} />
        <Stack.Screen
          name="AllSpeciality"
          component={AllSpeciality}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AllSymptoms" component={AllSymptoms} options={{ headerShown: false }} />
        <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectSlotsE"
          component={SelectSlotsE}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectSlotsP"
          component={SelectSlotsP}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConfirmBooking"
          component={ConfirmBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CallAgora" component={CallAgora} options={{ headerShown: false }} />
        <Stack.Screen name="PreConsult" component={PreConsult} options={{ headerShown: false }} />

        {/* Doctor Navigation */}
        <Stack.Screen
          name="DoctorHome"
          component={MyDrawer}
          options={{ headerShown: false }}
          initialParams={{ doctorObj }}
        />
        <Stack.Screen
          name="RegisterDoctor"
          component={RegisterDoctor}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DoctorRegistrationStep2"
          component={DoctorRegistration2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DoctorProfileEdit"
          component={DoctorProfileEdit}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DoctorAllAppointments"
          component={DoctorAllAppointments}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FaqDoctor"
          component={FaqDoctor}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="SupportDoctor"
          component={SupportDoctor}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="AboutDoctor"
          component={AboutDoctor}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="TCDoctor"
          component={TCDoctor}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="CheifComplaints"
          component={CheifComplaints}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="BodyScan"
          component={BodyScan}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="Diagnosis"
          component={Diagnosis}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="Medication"
          component={Medication}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="Investigation"
          component={Investigation}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="Advice"
          component={Advice}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="FollowUp"
          component={FollowUp}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Stack.Screen
          name="PrescriptionPreview"
          component={PrescriptionPreview}
          options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
