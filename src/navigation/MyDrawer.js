/* eslint-disable react/prop-types */
import { Alert, Image, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { get, isEmpty } from 'lodash';
import apiConfig from '../components/API/apiConfig';
import doctor from '../../assets/doctor2x.png';
import doctorFemale from '../../assets/doctor_female.png';
import appointment from '../../assets/drawerIcons/appointment.png';
import myprofile from '../../assets/drawerIcons/myprofile.png';
import myearning from '../../assets/drawerIcons/myearning.png';
import help from '../../assets/drawerIcons/help.png';
import support from '../../assets/drawerIcons/support.png';
import about from '../../assets/drawerIcons/about.png';
import terms from '../../assets/drawerIcons/terms.png';
import invite from '../../assets/drawerIcons/invite.png';
import general from '../../assets/drawerIcons/general.png';
import logoutAction from '../components/logoutAction';
import logout from '../../assets/drawerIcons/logout.png';
import DoctorTabNavigator from './DoctorTabNavigator';

const Drawer = createDrawerNavigator();

const onShare = async () => {
  try {
    const result = await Share.share({
      message: `Hey there! TrustHeal is the perfect app for virtual consultations. It's secure, convenient, and easy to use. Download TrustHeal here: https://play.google.com/store/apps/details?id=com.trusthealapp and start connecting with your patients today.`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

function CustomDrawerContent({ doctorObj }) {
  const navigation = useNavigation();

  return (
    // eslint-disable-next-line no-undef
    <DrawerContentScrollView>
      <View style={{ flex: 1, marginTop: -5 }}>
        <View
          style={{
            backgroundColor: '#2B8ADA',
            flexDirection: 'row',
            padding: 10,
            paddingVertical: 20,
            borderTopRightRadius: 20,
            justifyContent: 'space-evenly',
          }}
        >
          <View
            style={{
              flex: 0.4,
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
              {isEmpty(doctorObj) ||
              doctorObj.profilePhotoPath == null ||
              doctorObj.profilePhotoPath === 0 ? (
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
                    isEmpty(doctorObj.gender) || doctorObj.gender === 'Male' ? doctor : doctorFemale
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
                    uri: `${apiConfig.baseUrl}/file/download?fileToken=${doctorObj.profilePhotoPath}&userId=${doctorObj.doctorId}`,
                  }}
                />
              )}
            </View>
          </View>
          <TouchableOpacity style={{ flex: 0.5 }} onPress={() => navigation.closeDrawer()}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                marginVertical: 5,
                fontWeight: 'bold',
              }}
            >
              {!isEmpty(doctorObj) ? doctorObj.doctorName : 'Doctor Name'}
            </Text>
            <Text style={{ color: 'white', fontSize: 10, marginBottom: 10 }}>
              {!isEmpty(doctorObj) ? doctorObj.mobileNumber : 'Mobile No'}
            </Text>
            <Text
              style={{ color: 'white' }}
              onPress={() => navigation.navigate('DoctorProfileEdit')}
            >
              VIEW AND EDIT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.Heading}>
        <Text style={styles.HeadingText}>Record</Text>
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
        label="My Consultations"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => navigation.navigate('DoctorAllAppointments')}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={appointment} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="My Profile"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => navigation.navigate('Profile')}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={myprofile} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="Check Earnings"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => navigation.navigate('Check Earning')}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={myearning} style={{ tintColor: '#033158' }} />
        )}
      />
      <View style={styles.Heading}>
        <Text style={styles.HeadingText}>About</Text>
      </View>
      <DrawerItem
        label="FAQ"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          navigation.navigate('FaqDoctor');
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
          navigation.navigate('SupportDoctor');
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
        onPress={() => navigation.navigate('AboutDoctor')}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={about} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="Terms & Condition"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={() => {
          // viewTermsConditions();
          navigation.navigate('TCDoctor');
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={terms} style={{ tintColor: '#033158' }} />
        )}
      />
      <DrawerItem
        label="Invite Others"
        labelStyle={styles.labelStyle}
        style={{ marginVertical: 0, paddingVertical: 0 }}
        onPress={async () => {
          // viewTermsConditions();
          await onShare();
          // props.navigation.navigate('TCDoctor');
        }}
        // eslint-disable-next-line no-unused-vars
        icon={({ focused, color, size }) => (
          <Image source={invite} style={{ tintColor: '#033158' }} />
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
          navigation.navigate('DoctorProfileEdit');
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

export default function MyDrawer() {
  const route = useRoute();
  const doctorObj = get(route.params, 'doctorObj', {});
  // console.log(doctorObj.doctorName + "------------------ My Drawer");
  return (
    <Drawer.Navigator
      // useLegacyImplementation
      drawerContent={(props) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <CustomDrawerContent {...props} doctorObj={doctorObj} />
      )}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#a6d1f5',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        },
      }}
    >
      <Drawer.Screen name="Home" component={DoctorTabNavigator} options={{ headerShown: false }} />
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
