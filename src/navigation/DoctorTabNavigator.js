import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import { Platform } from 'react-native';
import DoctorHome from '../screens/doctor/DoctorHome';
import ManageSchedule from '../screens/doctor/ManageSchedule';
import FaqDoctor from '../screens/doctor/FaqDoctor';
import DoctorProfile from '../screens/doctor/DoctorProfile';
import theme from '../styles/theme';
import CheckEarnings from '../screens/doctor/CheckEarnings';

const Tab = createBottomTabNavigator();

export default function DoctorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line no-unused-vars
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Schedule') {
            iconName = 'calendar-alt';
          } else if (route.name === 'Earnings') {
            iconName = 'money-check';
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
              color={focused ? theme.colors.light[100] : '#53a7ed'}
              style={{ alignSelf: 'center' }}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.light[100],
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
      <Tab.Screen
        name="Home"
        component={DoctorHome}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name="Schedule" component={ManageSchedule} options={{ headerShown: false }} />
      <Tab.Screen name="Earnings" component={CheckEarnings} options={{ headerShown: false }} />
      <Tab.Screen name="FAQ" component={FaqDoctor} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={DoctorProfile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
