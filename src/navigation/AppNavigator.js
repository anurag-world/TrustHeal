import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // const [doctorObj, setDoctorObj] = useState(null);
  // useEffect(() => {
  //   const getName = async () => {
  //     const doctorStorageObj = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
  //     setDoctorObj(doctorStorageObj);
  //     // console.log(doctorObj.doctorName + "--------from app--------");
  //   };
  //   getName();
  // }, []);
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
        {/* TODO: Work below */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
