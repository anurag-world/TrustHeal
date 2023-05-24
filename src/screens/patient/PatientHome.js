/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Alert,
  Dimensions,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  LogBox,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import CustomButton from '../../components/CustomButton';
import timeformatter from '../../components/API/timeformatter';
import HeaderPatient from '../../components/HeaderPatient';
import apiConfig from '../../components/API/apiConfig';
import defaultDoctor from '../../../assets/doctor3x.png';
import waiting from '../../../assets/animations/waiting1.gif';
import theme from '../../styles/theme';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const { width } = Dimensions.get('window');
const height = width * 0.5;

function PatientHome() {
  const [BannerData, setBannerData] = useState([]);
  const [UpcomingData, setUpcomingData] = useState([]);
  const [SplData, setSplData] = useState([]);
  //   const [SymptomsData, setSymptomsData] = useState([]);
  const [DoctorsData, setDoctorsData] = useState([]);
  const [states, setStates] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setisLoading] = useState(false);
  const [patientDet, setpatientDet] = useState(null);
  const [CategoryList, setCategoryList] = useState(null);
  //   const [CategorySymptomsList, setCategorySymptomsList] = useState(null);

  const navigation = useNavigation();

  //   const shouldShow = (item) => {
  //     if (dayjs(item.slotDate).diff(dayjs(), 'd') > 0) return true;
  //     if (dayjs(item.slotDate).diff(dayjs(), 'd') == 0) {
  //       if (item.slotDate != dayjs().format('YYYY-MM-DD')) return true;

  //       const slotEndArray = item.slotEndTime.split(':');
  //       if (Number(dayjs().format('HH')) < slotEndArray[0]) return true;
  //       if (Number(dayjs().format('HH')) == slotEndArray[0]) {
  //         if (Number(dayjs().format('mm')) <= slotEndArray[1]) return true;
  //         return false;
  //       }
  //     }
  //   };

  const renderUpcomingConsultations = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        margin: 5,
        flexDirection: 'column',
        width: width - 50,
        // height: 100,
        alignSelf: 'center',
        justifyContent: 'space-evenly',
      }}
      onPress={() => navigation.navigate('Appointments')}
      key={item.consultationId}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {/* Image */}
        <View
          style={{
            width: 100,
            flexDirection: 'column',
            alignSelf: 'center',
            margin: 5,
          }}
        >
          <Image
            source={
              item.photoPath === 0
                ? defaultDoctor
                : {
                    uri: `${apiConfig.baseUrl}/file/download?fileToken=${item.photoPath}&userId=${item.doctorId}`,
                  }
            }
            style={{
              width: 90,
              height: 90,
              borderRadius: 10,
              alignSelf: 'center',
            }}
          />
        </View>
        {/* Details */}
        <View
          style={{
            flexDirection: 'column',
            width: width - 175,
            justifyContent: 'space-evenly',
          }}
        >
          {/* Doctor Name */}
          <View style={{ flexDirection: 'row', flex: 1, padding: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
              {item.doctorName}
            </Text>
          </View>
          {/* Doctor Specialization */}
          <View style={{ flexDirection: 'row', flex: 1, padding: 2 }}>
            <Text style={{ fontSize: 12, color: 'gray', fontWeight: 'bold' }}>
              {item.specialization.map((index) =>
                item.specialization.indexOf(index) !== item.specialization.length - 1
                  ? `${index}, `
                  : index
              )}
            </Text>
          </View>
          {/* Type of Consultation */}
          <View style={{ flexDirection: 'row', flex: 1, padding: 2 }}>
            <FAIcons
              name={
                // eslint-disable-next-line no-nested-ternary
                item.consultationType === 'PHYSICAL'
                  ? 'users'
                  : item.consultationType === 'PHONE_CALL'
                  ? 'phone-alt'
                  : 'video'
              }
              color="#2b8ada"
              size={12}
              solid={false}
              style={{
                alignSelf: 'center',
                marginRight: 5,
              }}
            />
            <Text style={{ fontSize: 12, color: '#2B8ADA' }}>
              {item.consultationType === 'PHYSICAL' ? 'P-Consultation' : 'E-Consultation'}
            </Text>
          </View>
          {/* Address if Physical */}
          {item.clinicAddress != null ? (
            <View style={{ flexDirection: 'row', flex: 1, padding: 2 }}>
              <FAIcons
                name="hospital"
                color="#2b8ada"
                size={12}
                solid={false}
                style={{
                  alignSelf: 'center',
                  marginRight: 5,
                }}
              />
              <Text style={{ fontSize: 12, color: '#2B8ADA' }}>
                {item.clinicName}
                {' | '}
                {item.clinicAddress}
              </Text>
            </View>
          ) : null}
          {/* Date and Time */}
          <View style={{ flexDirection: 'row', flex: 1, padding: 2 }}>
            <FAIcons
              name="clock"
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                marginRight: 5,
              }}
              color="gray"
            />
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'gray' }}>
              {timeformatter(item.slotStartTime)} {' - '}
              {timeformatter(item.slotEndTime)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flex: 1, padding: 2 }}>
            <FAIcons
              name="calendar-alt"
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                marginRight: 5,
              }}
              color="black"
            />
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'black' }}>
              {dayjs(item.slotDate).format('DD MMM, YYYY')}
            </Text>
          </View>
        </View>
        {/* Chat Button */}
        {/* <TouchableOpacity style={{alignSelf: 'flex-start'}}>
          <Entypo
            name="chat"
            color={'white'}
            size={15}
            style={{
              backgroundColor: '#2B8ADA',
              padding: 5,
              borderRadius: 20,
            }}
          />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );

  const RenderSpeciality = () =>
    SplData.map((data) => (
      <TouchableOpacity
        key={data.specializationImage}
        style={{
          flex: 1,
          flexDirection: 'column',
          alignSelf: 'center',

          width: 80,
          backgroundColor: 'white',
          justifyContent: 'space-evenly',
          borderRadius: 15,
          margin: 5,
        }}
        onPress={() => {
          navigation.navigate('AllSpeciality');
        }}
      >
        {/* <Image/> */}
        <View style={{ flex: 1, padding: 2, marginVertical: 2 }}>
          <Image
            source={{
              uri: `${apiConfig.baseUrl}/file/admin/download?fileToken=${data.specializationImage}`,
            }}
            style={{
              height: 50,
              width: 50,
              alignSelf: 'center',
            }}
          />
        </View>
        <View style={{ flex: 1, padding: 2, marginBottom: 2 }}>
          <Text
            style={{
              fontSize: 10,
              alignSelf: 'center',
              textAlign: 'center',
              color: theme.colors.dark[100],
            }}
          >
            {data.specialization}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  const RenderCategories = () =>
    CategoryList.map((data) => (
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 5,
          margin: 5,
        }}
        key={data}
        onPress={() => {
          navigation.navigate('AllSymptoms');
        }}
      >
        <View>
          <Text
            style={[
              {
                fontSize: 15,
                marginVertical: 5,
                fontWeight: 'bold',
                paddingHorizontal: 10,
              },
              { color: 'gray' },
            ]}
          >
            {data}
          </Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <FAIcons
            name="chevron-right"
            size={20}
            style={[
              {
                alignSelf: 'center',
                justifyContent: 'center',
                marginRight: 10,
              },
              { color: 'black' },
            ]}
          />
        </View>
      </TouchableOpacity>
    ));

  const renderListOfDoctors = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15,
        width: 150,
        marginHorizontal: 5,
      }}
    >
      {/* Image */}
      <Image
        source={
          item.photoPath === 0
            ? defaultDoctor
            : {
                uri: `${apiConfig.baseUrl}/file/download?fileToken=${item.photoPath}&userId=${item.doctorId}`,
              }
        }
        style={{
          width: 100,
          height: 100,
          alignSelf: 'center',
          marginVertical: 5,
          borderRadius: 10,
        }}
      />
      {/* Details */}
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'space-around',
          marginBottom: 5,
        }}
      >
        {/* Name */}
        <Text
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: 14,
            color: 'black',
          }}
        >
          {item.doctorName}
        </Text>
        {/* Degree */}
        <Text
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: 12,
            color: 'gray',
          }}
        >
          {item.degrees.map((index) =>
            item.degrees.indexOf(index) !== item.degrees.length - 1 ? `${index}, ` : index
          )}
        </Text>
        {/* Speciality */}
        <Text
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: 12,
            color: '#2b8ada',
          }}
        >
          {item.specialization.map((index) =>
            item.specialization.indexOf(index) !== item.specialization.length - 1
              ? `${index}, `
              : index
          )}
        </Text>
        {/* Experience */}
        <Text
          style={{
            textAlign: 'left',
            color: 'black',
            fontSize: 12,
          }}
        >
          {Math.floor(item.totalExperienceInMonths / 12)}
          {' years of experience'}
        </Text>
      </View>
      {/* View Profile Button */}
      <CustomButton
        text="View Profile"
        textstyle={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}
        style={{
          backgroundColor: '#2B8ADA',
          paddingVertical: 3,
        }}
        onPress={async () => {
          console.log(item.doctorName);
          await AsyncStorage.setItem('viewProfile', JSON.stringify(item));
          console.log(
            '======================== DOCTOR HOME ====================================',
            item
          );
          navigation.navigate('DoctorDetails');
        }}
      />
    </View>
  );
  const change = ({ nativeEvent }) => {
    const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    if (slide !== states) {
      setStates(slide);
    }
  };

  // Load Data
  useEffect(() => {
    const getPatientDet = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      setpatientDet(x);
      const fcm = await AsyncStorage.getItem('fcmToken');
      console.log('===================== FCM TOKEN ================================', fcm);

      if (fcm !== x.firebaseToken && fcm != null) {
        await axios
          .post(`${apiConfig.baseUrl}/patient/fcm/update`, {
            patientId: x.patientId,
            firebaseToken: fcm,
          })
          .then(async (response) => {
            if (response.status === 200) {
              x.firebaseToken = fcm;
              await AsyncStorage.setItem('UserPatientProfile', JSON.stringify(x));
            }
          });
      }
    };

    const getBanner = async () => {
      axios.get(`${apiConfig.baseUrl}/suggest/patient/banner`).then((response) => {
        console.log(
          '\n=========================== BANNER DATA ====================================\n'
        );
        console.log(response.data);
        if (response.status === 200) setBannerData(response.data.bannerPath);
      });
    };

    const getSpeciality = async () => {
      axios
        .get(`${apiConfig.baseUrl}/suggest/specialization/dropdown?max=5&min=0`)
        .then((response) => {
          console.log(
            '\n=========================== SPECIALITY DATA ====================================\n'
          );
          console.log(response.data);
          if (response.status === 200) setSplData(response.data);
        });
    };

    const getCategory = async () => {
      axios.get(`${apiConfig.baseUrl}/suggest/symptoms/category`).then((response) => {
        console.log(
          '\n=========================== CATEGORIES DATA ====================================\n'
        );
        console.log(response.data);
        if (response.status === 200) {
          // console.log(response.data);
          setCategoryList(response.data.category);
        }
      });
    };

    const getDoctors = async () => {
      axios.get(`${apiConfig.baseUrl}/patient/doctors?max=5&min=0`).then((response) => {
        console.log(
          '\n=========================== LIST OF DOCTORS DATA ====================================\n'
        );
        console.log(response.data);
        if (response.status === 200) setDoctorsData(response.data);
      });
    };
    const getFavDoctors = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      const { patientId } = x;
      axios
        .get(`${apiConfig.baseUrl}/patient/fav/doctor/id?patientId=${patientId}`)
        .then(async (response) => {
          console.log(
            '\n=========================== LIST OF FAV DOCTORS ====================================\n'
          );
          console.log(response.data);
          if (response.status === 200) {
            const { id } = response.data;
            await AsyncStorage.setItem('PatientFavId', JSON.stringify(id));
          }
        })
        .catch((error) => {
          Alert.alert('Error', 'Error in fetching favourite doctor');
          console.log(error);
        });
    };
    getPatientDet();
    getBanner();
    getSpeciality();
    getCategory();
    getDoctors();
    getFavDoctors();
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && patientDet != null) {
      // Update the state you want to be updated
      getUpcoming();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, patientDet]);

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Exit App', 'Exiting the application', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: () => BackHandler.exitApp(),
  //       },
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  // useEffect(() => {

  //   if (patientDet != null) getUpcoming();
  // }, [patientDet]);
  const getUpcoming = async () => {
    axios
      .get(`${apiConfig.baseUrl}/patient/upcoming/consultations?patientId=${patientDet.patientId}`)
      .then((response) => {
        console.log(
          '\n=========================== UPCOMING CONSULTATIONS  ====================================\n'
        );
        console.log(response.data);
        if (response.status === 200) setUpcomingData(response.data);
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
          flex: 1,
        }}
        edges={['top']}
      >
        <ScrollView
          style={{
            width: '100%',
            alignSelf: 'center',
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <HeaderPatient showMenu />
          {/* slideshow */}
          <View style={{ marginVertical: 10, width, height }}>
            <ScrollView
              pagingEnabled
              horizontal
              onScroll={change}
              showsHorizontalScrollIndicator={false}
              style={{
                width: width - 40,
                height,
                alignSelf: 'center',
                marginTop: 10,
              }}
            >
              {BannerData.map((item, index) => (
                <Image
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  source={{
                    uri: `${apiConfig.baseUrl}/file/admin/download?fileToken=${BannerData[index]}`,
                  }}
                  style={{
                    width: width - 40,
                    height,
                    resizeMode: 'cover',
                    borderRadius: 8,
                  }}
                />
              ))}
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                bottom: 0,
                alignSelf: 'center',
                paddingBottom: Platform.OS === 'ios' ? 4 : 0,
              }}
            >
              {BannerData.map((i, k) => (
                <Text
                  // eslint-disable-next-line react/no-array-index-key
                  key={k}
                  style={
                    k === states
                      ? { color: 'white', margin: 3, fontSize: Platform.OS === 'ios' ? 8 : 14 }
                      : { color: 'gray', margin: 3, fontSize: Platform.OS === 'ios' ? 8 : 14 }
                  }
                >
                  ⬤
                </Text>
              ))}
            </View>
          </View>

          {/* Consultation Buttons */}

          {/* <View
            style={{
              flexDirection: 'column',
              width: '80%',
              alignSelf: 'center',
              borderRadius: 30,
              marginVertical: 10,
            }}>
            <CustomButton
              text="E-Consultation"
              textstyle={{color: 'white'}}
              style={{
                backgroundColor: '#2B8ADA',
                borderRadius: 30,
                marginBottom: 10,
              }}
              onPress={() => {
                navigation.navigate('Consult');
              }}
            />
            <CustomButton
              text="P-Consultation"
              textstyle={{color: 'white'}}
              style={{
                backgroundColor: '#17CC9C',
                borderRadius: 30,
                marginBottom: 10,
              }}
              onPress={() => {
                navigation.navigate('Consult');
              }}
            />
          </View> */}

          {/* Recent Consultation */}
          {/* <View style={styles.whiteBox}>
            {/* Heading */}
          {/* <View style={styles.headingBox}>
              <Text style={{color: '#2B8ADA'}}>Recent Consultations</Text>
              <Text
                style={{color: '#2B8ADA', textDecorationLine: 'underline'}}
                onPress={() => {}}>
                View All
              </Text>
            </View>
            {/* Blue Box */}
          {/* <View style={{flex: 1}}>
              <FlatList
                data={dataRecentConsultation}
                horizontal={true}
                keyExtractor={item => item.name}
                renderItem={renderRecentConsultations}
              /> 
            </View> 
          </View> */}

          {/* Upcoming Consultation */}
          {UpcomingData !== '' ? (
            <View style={styles.transparentBox}>
              {/* Heading */}
              <View style={styles.headingBox}>
                <Text style={{ color: '#2B8ADA', fontWeight: 'bold', fontSize: 15 }}>
                  Upcoming Consultations
                </Text>
                <Text
                  style={{
                    color: '#2B8ADA',
                    textDecorationLine: 'underline',
                    fontSize: 12,
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    navigation.navigate('Appointments');
                  }}
                >
                  View All
                </Text>
              </View>
              {/* Transparent Box */}

              <FlatList
                data={UpcomingData}
                keyExtractor={(item) => item.consultationId}
                renderItem={renderUpcomingConsultations}
                horizontal={false}
              />
            </View>
          ) : null}

          {/* Select Via Speciality */}
          <View style={styles.transparentBox}>
            {/* Heading */}
            <View style={[styles.headingBox, { justifyContent: 'flex-start' }]}>
              <MIcons
                name="medical-bag"
                size={20}
                color="#2b8ada"
                style={{ alignSelf: 'center', marginRight: 5 }}
              />
              <Text style={{ color: '#2B8ADA', fontWeight: 'bold', fontSize: 16 }}>
                Select Via Speciality
              </Text>
            </View>
            {/* Transparent Box */}
            <ScrollView
              style={{ alignSelf: 'center', flexDirection: 'row' }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <RenderSpeciality />
            </ScrollView>
            <Text
              style={{
                color: '#2B8ADA',
                fontSize: 12,
                alignSelf: 'flex-end',
                margin: 10,
              }}
              onPress={() => {
                console.log(Math.floor(width / 90));
                navigation.navigate('AllSpeciality');
              }}
            >
              View All
            </Text>
          </View>

          {/* Consult Doctor Via Symptom */}
          <View style={[styles.whiteBox, { marginVertical: 10, backgroundColor: '#e8f0fe' }]}>
            {/* Heading */}
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '90%',
                marginBottom: 10,
                alignSelf: 'center',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <MIcons
                  name="emoticon-sick-outline"
                  size={20}
                  color="#2b8ada"
                  style={{ alignSelf: 'center', marginRight: 5 }}
                />
                <Text style={{ color: '#2B8ADA', fontSize: 16, fontWeight: 'bold' }}>
                  Consult Doctor Via Symptom
                </Text>
              </View>
              <Text style={{ color: 'black', fontSize: 12 }}>
                Select a category of symptom to book in 1 step
              </Text>
            </View>
            {/* Transparent Box */}
            <ScrollView
              style={{ alignSelf: 'center', flexDirection: 'column' }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {CategoryList != null ? (
                <View style={{ flexDirection: 'column', width: '100%' }}>
                  <RenderCategories />
                </View>
              ) : null}
            </ScrollView>
            <Text
              style={{
                color: '#2B8ADA',
                fontSize: 12,
                alignSelf: 'flex-end',
                margin: 10,
              }}
              onPress={() => {
                navigation.navigate('AllSymptoms');
              }}
            >
              View All
            </Text>
          </View>

          {/* List Of Doctors */}
          <View style={styles.transparentBox}>
            {/* Heading */}
            <View style={[styles.headingBox, { justifyContent: 'flex-start' }]}>
              <MIcons
                name="doctor"
                size={20}
                color="#2b8ada"
                style={{ alignSelf: 'center', marginRight: 5 }}
              />
              <Text style={{ color: '#2B8ADA', fontWeight: 'bold', fontSize: 16 }}>
                List Of Doctors
              </Text>
            </View>
            {/* Transparent Box */}
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              <FlatList
                data={DoctorsData}
                horizontal
                keyExtractor={(item) => item.doctorId}
                renderItem={renderListOfDoctors}
                style={{ marginRight: 5, flex: 1 }}
              />
            </View>
            <Text
              style={{
                flex: 1,
                color: '#2B8ADA',
                fontSize: 12,
                alignSelf: 'flex-end',
                margin: 10,
                marginVertical: 10,
              }}
              onPress={() => {
                navigation.navigate('Consult');
              }}
            >
              View All
            </Text>
          </View>
        </ScrollView>
        {isLoading ? (
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
                Loading...
              </Text>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f0fe',
  },
  headingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
    alignSelf: 'center',
  },
  transparentBox: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#E8F0FE',
    padding: 10,
  },
  whiteBox: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
  },
});
export default PatientHome;
