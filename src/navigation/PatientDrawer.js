/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { useNavigation, useRoute } from '@react-navigation/native';
import { get, isEmpty } from 'lodash';
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';
import apiConfig from '../components/API/apiConfig';
import logoutAction from '../components/logoutAction';

// Images
import patient from '../../assets/patient2x.png';
import patientFemale from '../../assets/patient_female.png';

// Drawer Images
import consultD from '../../assets/drawerIcons/consult.png';
import appointment from '../../assets/drawerIcons/appointment.png';
import cancelconsultation from '../../assets/drawerIcons/cancelconsultation.png';
import general from '../../assets/drawerIcons/general.png';
import help from '../../assets/drawerIcons/help.png';
import logout from '../../assets/drawerIcons/logout.png';
import terms from '../../assets/drawerIcons/terms.png';
import refund from '../../assets/drawerIcons/refund.png';
import privacy from '../../assets/drawerIcons/privacy.png';
import support from '../../assets/drawerIcons/support.png';
import about from '../../assets/drawerIcons/about.png';
import PatientTabNavigator from './PatientTabNavigator';

const Drawer = createDrawerNavigator();

function CustomDrawerContentPatient({ patientObj }) {
  const navigation = useNavigation();
  return (
    <DrawerContentScrollView>
      <View style={{ flex: 1, marginTop: -5 }}>
        <View
          style={{
            backgroundColor: '#2B8ADA',
            flexDirection: 'row',
            padding: 5,
            paddingVertical: 20,
            borderTopRightRadius: 20,
            justifyContent: 'space-evenly',
          }}
        >
          <View
            style={{
              flex: 0.3,
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                borderWidth: 2,
                borderColor: 'white',
                alignSelf: 'center',
                borderRadius: 100,
              }}
            >
              {isEmpty(patientObj) || patientObj.photoPath == null || patientObj.photoPath === 0 ? (
                <Image
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 80,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    margin: 5,
                  }}
                  source={
                    isEmpty(patientObj) || patientObj.gender !== 'Female' ? patient : patientFemale
                  }
                />
              ) : (
                <Image
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 80,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    margin: 5,
                  }}
                  source={{
                    uri: `${apiConfig.baseUrl}/file/download?fileToken=${patientObj.photoPath}&userId=${patientObj.patientId}`,
                  }}
                />
              )}
            </View>
          </View>
          <View
            style={{ flex: 0.5, justifyContent: 'center' }}
            onPress={() => console.log(patientObj.patientName)}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                marginVertical: 5,
                fontWeight: 'bold',
              }}
            >
              {!isEmpty(patientObj) ? patientObj.patientName : 'Patient Name'}
            </Text>
            <Text style={{ color: 'white', fontSize: 12, marginBottom: 10 }}>
              {!isEmpty(patientObj) ? patientObj.mobileNumber : 'Mobile No'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.Heading}>
        <Text style={styles.HeadingText}>Core Services</Text>
      </View>
      {/* <DrawerItem
          label="Notification"
          labelStyle={styles.labelStyle}
          style={{marginVertical: 0, paddingVertical: 0}}
          onPress={() => {}}
          icon={({focused, color, size}) => (
            <Image source={bell} style={{tintColor: '#033158'}} />
          )}
        /> */}
      <DrawerItem
        label="Consult Now"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => navigation.navigate('Consult')}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={consultD} style={{ tintColor: '#033158' }} />
        )}
      />
      <View style={styles.Heading}>
        <Text style={styles.HeadingText}>Record</Text>
      </View>
      {/* <DrawerItem
          label="Notification"
          labelStyle={styles.labelStyle}
          style={{marginVertical: 0, paddingVertical: 0}}
          //onPress={() => props.navigation.navigate('DoctorAllAppointments')}
          icon={({focused, color, size}) => (
            <Image source={bell} style={{tintColor: '#033158'}} />
          )}
        /> */}
      <DrawerItem
        label="My Consultations"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => navigation.navigate('PatientAllAppointments')}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={appointment} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="Cancel Consultations"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => navigation.navigate('PatientCancelAppointments')}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={cancelconsultation} style={{ tintColor: '#033158' }} />
        )}
      />
      {/* <DrawerItem
          label="Profile"
          labelStyle={styles.labelStyle}
          style={{marginVertical: 0, paddingVertical: 0}}
          onPress={() => props.navigation.navigate('PatientProfile')}
          icon={({focused, color, size}) => (
            <Image source={myprofile} style={{tintColor: '#033158'}} />
          )}
        /> */}
      {/* <DrawerItem
          label="Invoices"
          labelStyle={styles.labelStyle}
          style={{marginVertical: 0, paddingVertical: 0}}
          //onPress={() => props.navigation.navigate('DoctorAllAppointments')}
          icon={({focused, color, size}) => (
            <Image source={myearning} style={{tintColor: '#033158'}} />
          )}
        /> */}

      <View style={styles.Heading}>
        <Text style={styles.HeadingText}>About</Text>
      </View>
      <DrawerItem
        label="FAQ"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          navigation.navigate('FAQ');
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={help} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="Help & Support"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          navigation.navigate('SupportPatient');
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={support} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="About TrustHeal"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => navigation.navigate('About')}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={about} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="Privacy Policy"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          // viewTermsConditions();
          navigation.navigate('TCPrivacy');
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={privacy} style={{ tintColor: '#033158' }} />
        )}
      />

      <DrawerItem
        label="Refund & Cancellation"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          // viewTermsConditions();
          navigation.navigate('TCRefund');
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={refund} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="Terms & Conditions"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          // viewTermsConditions();
          navigation.navigate('TCPatient');
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={terms} style={{ tintColor: '#033158' }} />
        )}
      />
      <View style={styles.Heading}>
        <Text style={styles.HeadingText}>Settings</Text>
      </View>
      <DrawerItem
        label="Edit Profile"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          navigation.navigate('PatientProfileEdit');
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={general} style={{ tintColor: '#033158' }} />
        )}
      />

      <DrawerItem
        label="Logout"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          logoutAction(navigation);
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={logout} style={{ tintColor: '#033158' }} />
        )}
      />
    </DrawerContentScrollView>
  );
}

export default function PatientDrawer() {
  const route = useRoute();
  const patientObj = get(route.params, 'patientObj', {});
  // console.log(doctorObj.doctorName + "------------------ My Drawer");
  return (
    <Drawer.Navigator
      // useLegacyImplementation
      drawerContent={(props) => (
        <CustomDrawerContentPatient {...props} patientObj={patientObj} />
        // <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#a6d1f5',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        },
      }}
    >
      <Drawer.Screen
        name="PatientsHome"
        component={PatientTabNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  Heading: {
    flex: 1,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
  },
  HeadingText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#2B8ADA',
    fontWeight: 'bold',
    marginVertical: 5,
    marginTop: 15,
  },
  labelStyle: { color: '#033158', fontSize: 14 },
});
