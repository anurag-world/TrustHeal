import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PatientHome">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
