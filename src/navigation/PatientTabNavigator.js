import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import { Platform } from 'react-native';
import PatientHome from '../screens/patient/PatientHome';
import MyAppointments from '../screens/patient/MyAppointments';
import PatientConsult from '../screens/patient/PatientConsult';
import FaqPatient from '../screens/patient/FaqPatient';
import PatientProfile from '../screens/patient/PatientProfile';

const Tab = createBottomTabNavigator();

export default function PatientTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="PatientHome"
      screenOptions={({ route }) => ({
        // eslint-disable-next-line no-unused-vars
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Appointments') {
            iconName = 'calendar-alt';
          } else if (route.name === 'Consult') {
            iconName = 'hand-holding-medical';
          } else if (route.name === 'FAQ') {
            iconName = 'question-circle';
          } else if (route.name === 'Profile') {
            iconName = 'user-circle';
          }
          return (
            <FAIcons
              name={iconName}
              size={20}
              solid={focused}
              color={focused ? 'white' : '#53a7ed'}
              style={{ alignSelf: 'center' }}
            />
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#53a7ed',
        tabBarStyle: {
          backgroundColor: '#2B8ADA',
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'android' ? 8 : 30,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          paddingBottom: 3,
        },
      })}
    >
      <Tab.Screen name="Home" component={PatientHome} options={{ headerShown: false }} />
      <Tab.Screen name="Appointments" component={MyAppointments} options={{ headerShown: false }} />
      <Tab.Screen name="Consult" component={PatientConsult} options={{ headerShown: false }} />
      <Tab.Screen name="FAQ" component={FaqPatient} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={PatientProfile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
