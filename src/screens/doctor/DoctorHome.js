/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Modal,
  useWindowDimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  StatusBar,
  Alert,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';

import FAIcon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import dayjs from 'dayjs';
import Pdf from 'react-native-pdf';
import CustomButton from '../../components/CustomButton';

// images
import pfp1 from '../../../assets/patient.png';
import payonclinic from '../../../assets/Icons/payonclinic1.png';
import prepaid from '../../../assets/Icons/paid.png';
import downloading from '../../../assets/animations/downloading.gif';

import Header from '../../components/Header';
import apiConfig from '../../components/API/apiConfig';
import dateformatter from '../../components/API/dateformatter';

const dataStatus = [
  { key: 'Yes', value: 'Yes' },
  { key: 'No', value: 'No' },
];

export default function DoctorHome() {
  const [doctorObj, setDoctorObj] = useState(null);
  const [doctorId, setdoctorId] = useState(null);
  // upcoming tab
  const [Upcoming, setUpcoming] = useState(false);
  const [UpcomingData, setUpcomingData] = useState([]);
  const [PreconsultaionQuestionData, setPreconsultaionQuestionData] = useState([]);
  const [PrescriptionModal, setPrescriptionModal] = useState(false);
  const [prescriptionId, setprescriptionId] = useState(null);
  const [HistoryModal, setHistoryModal] = useState(false);
  const [historyData, sethistoryData] = useState([]);
  const [patientId, setpatientId] = useState(0);
  const [historyId, sethistoryId] = useState(0);
  const [todayId, settodayId] = useState(0);
  const [TodaysModal, setTodaysModal] = useState(false);
  const [TodaysDocs, setTodaysDocs] = useState([]);
  const [ConsultationQuestionnaire, setConsultationQuestionnaire] = useState(false);

  // complete tab
  const [Complete, setComplete] = useState(false);
  const [CompleteData, setCompleteData] = useState([]);

  // status tab
  const [Status, setStatus] = useState(false);
  const [StatusData, setStatusData] = useState([]);
  const [ManageStatusModal, setManageStatusModal] = useState(false);
  const [ManageStatus, setManageStatus] = useState('');
  const [PrescriptionMade, setPrescriptionMade] = useState('');
  const [isFetching, setisFetching] = useState(false);

  // Pending Prescription Modal
  const [pending, setpending] = useState(false);
  const [PendingData, setPendingData] = useState([]);

  const [strtCC, setstrtCC] = useState(0);
  const [endCC, setendCC] = useState(4);
  const [endOfList, setendOfList] = useState(false);
  const [zoom, setZoom] = useState(1);

  const navigation = useNavigation();

  const onZoomIn = () => {
    if (zoom < 2.5) setZoom(zoom + 0.25);
  };
  const onZoomOut = () => {
    if (zoom > 1) setZoom(zoom - 0.25);
  };

  const layout = useWindowDimensions();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused != null) {
      setUpcoming(false);
      setComplete(false);
      setStatus(false);
      setpending(false);
    }
  }, [isFocused]);

  const hasStarted = (item) => {
    if (item.slotDate === dayjs().format('YYYY-MM-DD')) {
      const slotStrtArray = item.slotStartTime.split(':');
      const slotEndArray = item.slotEndTime.split(':');
      const now = dayjs().format('HH:mm');
      const nowArray = now.split(':');

      const start = Number(slotStrtArray[0]) * 60 * 60 + Number(slotStrtArray[1]) * 60 - 300;
      const end = Number(slotEndArray[0]) * 60 * 60 + Number(slotEndArray[1]) * 60;
      const current = Number(nowArray[0]) * 60 * 60 + Number(nowArray[1]) * 60;
      // console.log('Start', start);
      // console.log('Now', current);
      // console.log('End', end);

      // console.log('Compare', current >= start && current <= end);

      return current >= start && current <= end;
    }
    return false;
  };

  const onJoinPress = (
    consultationType,
    callID,
    getDoctorId,
    getPatientId,
    patientName,
    slotId,
    userName,
    userType
  ) => {
    navigation.navigate('CallAgora', {
      consultationType,
      callID,
      doctorId: getDoctorId,
      patientId: getPatientId,
      patientName,
      slotId,
      userName,
      userType,
      userID: doctorId,
    });
  };

  const onPressPrescription = async (item) => {
    // console.log(
    //   'Patient Age is ',
    //   item.familyUserDob != null
    //     ? dayjs().diff(dayjs(item.familyUserDob), 'y')
    //     : dayjs().diff(dayjs(item.patientDob), 'y')
    // );

    const obj = {
      age:
        item.familyUserDob != null
          ? dayjs().diff(dayjs(item.familyUserDob), 'y')
          : dayjs().diff(dayjs(item.patientDob), 'y'),

      patientName: item.familyUserName != null ? item.familyUserName : item.patientName,
      profilePhoto: item.familyUserPhoto != null ? item.familyUserPhoto : item.patientPhoto,
    };
    if (item.familyUsercity != null) obj.city = item.familyUsercity;
    else if (item.patientCity != null) obj.city = item.patientCity;
    else obj.city = null;

    const p = {
      patientDet: obj,
      patientId: item.patientId,
      consultationId: item.consultationId,
      consultationType: item.consultationType,
      clinicId: item.clinicId != null ? item.clinicId : null,
      clinicName: item.clinicName != null ? item.clinicName : '',
      clinicAddress: item.clinicAddress != null ? item.clinicAddress : '',
      referredByDoctor: item.referredByDoctor,
    };
    // console.log(p);
    await AsyncStorage.setItem('PrescriptionFor', JSON.stringify(p));
  };

  const downloadCache = async (fileToken, userId, fileName) => {
    console.log('Downloading with user id ', userId);

    const filePath = `file://${RNFS.CachesDirectoryPath}/`;
    const options = {
      fromUrl: `${apiConfig.baseUrl}/file/download?fileToken=${fileToken}&userId=${userId}`,
      toFile: filePath + fileName,
    };
    await RNFS.downloadFile(options)
      .promise.then((response) => {
        console.log(response);
        if (response.statusCode === 200) {
          setprescriptionId(filePath + fileName);
          setPrescriptionModal(true);
        } else if (response.statusCode === 204) Alert.alert('Sorry', 'The file does not exist');
        else Alert.alert('Download Fail', `Unable to download file. ${response.statusCode}`);
      })
      .catch((e) => {
        Alert.alert('Error', `${e}`);
      });
  };

  const timeformatter = (time) => {
    const text = time;
    const myArray = text.split(':');
    let HH = Number(myArray[0]);
    const m = Number(myArray[1]);
    let MM = m;
    if (m < 9) MM = `0${m}`;
    let PM = 'AM';
    if (HH > 12) {
      HH -= 12;
      PM = 'PM';
    }
    return `${HH}:${MM}${PM}`;
  };

  const renderCard = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        width: '95%',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 5,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: 10,
          paddingHorizontal: 10,
          justifyContent: 'space-between',
        }}
      >
        <View
          styles={{
            flex: 0.45,
          }}
        >
          <Image
            source={
              item.paymentStatus !== 'PRE_PAID' && item.paymentStatus !== 'SPECIAL_USER'
                ? payonclinic
                : prepaid
            }
            style={{
              width: 30,
              height: 30,
              tintColor:
                item.paymentStatus !== 'PRE_PAID' && item.paymentStatus !== 'SPECIAL_USER'
                  ? '#2b8ada'
                  : '#51e80c',
              marginLeft: 10,
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {item.patientPhoto === 0 || item.patientPhoto == null ? (
          <Image
            source={pfp1}
            style={{
              width: 90,
              height: 90,
              alignSelf: 'center',
              borderRadius: 5,
              margin: 5,
              marginHorizontal: 10,
            }}
          />
        ) : (
          <Image
            source={{
              uri: `${apiConfig.baseUrl}/file/download?fileToken=${item.patientPhoto}&userId=${item.patientId}`,
            }}
            style={{
              width: 90,
              height: 90,
              alignSelf: 'center',
              borderRadius: 5,
              margin: 5,
              marginHorizontal: 10,
            }}
          />
        )}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flexDirection: 'row',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            {item.familyUserName == null ? item.patientName : item.familyUserName}
          </Text>
          {item.consultationType === 'PHYSICAL' ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                {/* <Text style={styles.cardText}>Clinic</Text> */}
                <FAIcon name="hospital" size={15} color="#2b8ada" style={{}} />
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={[styles.cardText, { color: '#2b8ada', fontWeight: 'bold' }]}>
                  {item.clinicName}
                  {' | '} {item.clinicAddress}
                </Text>
              </View>
            </View>
          ) : null}

          {item.patientDob != null || item.familyUserDob ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Age</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>
                  {item.familyUserDob == null
                    ? dayjs().diff(dayjs(item.patientDob), 'y')
                    : dayjs().diff(dayjs(item.familyUserDob), 'y')}
                </Text>
              </View>
            </View>
          ) : null}

          {item.patientCity != null || item.familyUsercity ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Location</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>
                  {item.familyUsercity == null ? item.patientCity : item.familyUsercity}
                </Text>
              </View>
            </View>
          ) : null}
          {item.symptoms != null ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.2,
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Symptoms</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.6,
                }}
              >
                <Text style={styles.cardText}>{item.symptoms}</Text>
              </View>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                width: '20%',
                marginRight: '5%',
              }}
            >
              <Text style={styles.cardText}>Date</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '60%' }}>
              <Text style={styles.cardText}>{dayjs(item.slotDate).format('DD MMM, YYYY')}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                width: '20%',
                marginRight: '5%',
              }}
            >
              <Text style={styles.cardText}>Slot</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '60%' }}>
              <Text style={styles.cardText}>
                {timeformatter(item.slotStartTime)} {' - '}
                {timeformatter(item.slotEndTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Buttons */}
      <View
        style={{
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '95%',
          alignSelf: 'center',
        }}
      >
        {item.consultationType !== 'PHYSICAL' ? (
          <TouchableOpacity
            style={[
              {
                flex: 0.45,
                justifyContent: 'center',
                flexDirection: 'row',
                padding: 3,
                paddingHorizontal: 5,
                alignSelf: 'center',
                backgroundColor: '#2B8ADA',
                borderWidth: 1,
                borderColor: '#2B8ADA',
                borderRadius: 5,
              },
              hasStarted(item) ? { backgroundColor: 'limegreen', borderColor: 'limegreen' } : null,
            ]}
            onPress={async () => {
              if (hasStarted(item)) {
                await onPressPrescription(item);
                // console.log(item.slotId);

                const patientName =
                  item.familyUserName != null ? item.familyUserName : item.patientName;

                onJoinPress(
                  item.consultationType,
                  `${item.consultationId}`,
                  `${doctorObj.doctorId}`,
                  item.patientId,
                  patientName,
                  item.slotId,
                  doctorObj.doctorName,
                  'Doctor'
                );
              } else
                Alert.alert(
                  'Hold on',
                  `Your consultaion starts at ${timeformatter(item.slotStartTime)} on ${dayjs(
                    item.slotDate
                  ).format('DD MMM, YYYY')}.\nPlease join at the scheduled time.`
                );
            }}
          >
            <FAIcon
              name={item.consultationType === 'VIDEO_CALL' ? 'video' : 'phone-alt'}
              color="white"
              size={15}
              style={{ marginRight: 5 }}
            />
            <Text style={{ fontSize: 12, color: 'white' }}>Consult Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              {
                flex: 0.45,
                justifyContent: 'center',
                flexDirection: 'row',
                padding: 3,
                paddingHorizontal: 5,
                alignSelf: 'center',
                backgroundColor: '#2B8ADA',
                borderWidth: 1,
                borderColor: '#2B8ADA',
                borderRadius: 5,
              },
              hasStarted(item) ? { backgroundColor: 'limegreen', borderWidth: 0 } : null,
            ]}
            onPress={async () => {
              if (hasStarted(item)) {
                Alert.alert('Consultation Status', 'Consultation completed with the patient?', [
                  {
                    text: 'Yes',
                    onPress: async () => {
                      await axios
                        .post(
                          `${apiConfig.baseUrl}/doctor/consultation/status/pending?consultationId=${item.consultationId}`
                        )
                        .then((response) => {
                          if (response.status === 200) {
                            Alert.alert(
                              'Consultation Ended',
                              `Your consultation with patient has ended.\nPlease make sure to create prescription for the patient.`,
                              [
                                {
                                  text: 'Ok',
                                  onPress: async () => {
                                    await getUpcomingData();
                                  },
                                },
                              ]
                            );
                          }
                        });
                    },
                  },
                  {
                    text: 'No',
                  },
                ]);
              } else {
                Alert.alert(
                  'Hold on',
                  `Your consultaion starts at ${timeformatter(item.slotStartTime)} on ${dayjs(
                    item.slotDate
                  ).format('DD MMM, YYYY')}.`
                );
              }
            }}
          >
            {!hasStarted(item) ? (
              <View style={{ flexDirection: 'row' }}>
                <FAIcon name="hospital" size={15} color="white" style={{ marginRight: 5 }} />
                <Text style={{ fontSize: 12, color: 'white' }}>P-Consultation</Text>
              </View>
            ) : (
              <View>
                <Text style={{ fontSize: 12, color: 'white' }}>Mark as Complete</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            flex: 0.2,
            justifyContent: 'center',
            flexDirection: 'row',
            padding: 3,
            paddingHorizontal: 5,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
          }}
          onPress={async () => {
            settodayId(item.consultationId);
            setpatientId(item.patientId);
            await getTodaysDocs(item.consultationId);
            setTodaysModal(true);
          }}
        >
          <FAIcon name="file-pdf" color="gray" size={15} style={{ marginRight: 5 }} />
          <Text style={{ fontSize: 12 }}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              flex: 0.1,
              justifyContent: 'center',
              flexDirection: 'row',
              padding: 3,
              paddingHorizontal: 5,
              borderWidth: 1,
              borderColor: '#2b8ada',
              borderRadius: 5,
            },
          ]}
          onPress={async () => {
            settodayId(item.consultationId);
            setpatientId(item.patientId);
            await getTodaysDocs(item.consultationId);
            setConsultationQuestionnaire(true);
          }}
        >
          <MCIcons
            name="clipboard-list"
            color="#2b8ada"
            size={15}
            style={{ alignSelf: 'center' }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderCardPending = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        width: '95%',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 5,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: 10,
          paddingHorizontal: 10,
          justifyContent: 'space-between',
        }}
      >
        {/* <View
            styles={{
              flex: 0.45,
            }}>
            <Image
              source={
                item.paymentStatus != 'PRE_PAID' &&
                item.paymentStatus != 'SPECIAL_USER'
                  ? payonclinic
                  : prepaid
              }
              style={{
                width: 30,
                height: 30,
                tintColor:
                  item.paymentStatus != 'PRE_PAID' &&
                  item.paymentStatus != 'SPECIAL_USER'
                    ? '#2b8ada'
                    : '#51e80c',
                marginLeft: 10,
              }}
            />
          </View> */}
        {/* <View
            style={{
              flexDirection: 'row',
              flex: 0.45,
              justifyContent: 'flex-end',
            }}>
            <FAIcon
              name="prescription"
              size={25}
              style={{alignSelf: 'center'}}
              onPress={() => {
                Alert.alert(
                  'Create Prescription',
                  `Do you want to create prescription for ` +
                    (item.familyUserName == null
                      ? item.patientName
                      : item.familyUserName) +
                    ` right now?`,
                  [
                    {
                      text: 'Yes',
                      onPress: () => {
                        onPressPrescription(item);
                        navigation.navigate('CheifComplaints');
                      },
                    },
                    {
                      text: 'No',
                      style: 'cancel',
                    },
                  ],
                );
                //onPressPrescription(item);
              }}
            />

          </View> */}
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {item.patientPhoto === 0 || item.patientPhoto == null ? (
          <Image
            source={pfp1}
            style={{
              width: 90,
              height: 90,
              alignSelf: 'center',
              borderRadius: 5,
              margin: 5,
              marginHorizontal: 10,
            }}
          />
        ) : (
          <Image
            source={{
              uri: `${apiConfig.baseUrl}/file/download?fileToken=${item.patientPhoto}&userId=${item.patientId}`,
            }}
            style={{
              width: 90,
              height: 90,
              alignSelf: 'center',
              borderRadius: 5,
              margin: 5,
              marginHorizontal: 10,
            }}
          />
        )}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <Text
            style={{
              flexDirection: 'row',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            {item.familyUserName == null ? item.patientName : item.familyUserName}
          </Text>
          {item.consultationType === 'PHYSICAL' ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                {/* <Text style={styles.cardText}>Clinic</Text> */}
                <FAIcon name="hospital" size={15} color="#2b8ada" style={{}} />
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={[styles.cardText, { color: '#2b8ada', fontWeight: 'bold' }]}>
                  {item.clinicName}
                  {' | '} {item.clinicAddress}
                </Text>
              </View>
            </View>
          ) : null}

          {item.patientDob != null || item.familyUserDob ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Age</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>
                  {item.familyUserDob == null
                    ? dayjs().diff(dayjs(item.patientDob), 'y')
                    : dayjs().diff(dayjs(item.familyUserDob), 'y')}
                </Text>
              </View>
            </View>
          ) : null}

          {item.patientCity != null || item.familyUsercity ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Location</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>
                  {item.familyUsercity == null ? item.patientCity : item.familyUsercity}
                </Text>
              </View>
            </View>
          ) : null}
          {item.symptoms != null ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.2,
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Symptoms</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.6,
                }}
              >
                <Text style={styles.cardText}>{item.symptoms}</Text>
              </View>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                width: '20%',
                marginRight: '5%',
              }}
            >
              <Text style={styles.cardText}>Date</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '60%' }}>
              <Text style={styles.cardText}>{dayjs(item.slotDate).format('DD MMM, YYYY')}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                width: '20%',
                marginRight: '5%',
              }}
            >
              <Text style={styles.cardText}>Slot</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '60%' }}>
              <Text style={styles.cardText}>
                {timeformatter(item.slotStartTime)} {' - '}
                {timeformatter(item.slotEndTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Buttons */}
      <View
        style={{
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '95%',
          alignSelf: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 0.45,
            justifyContent: 'center',
            flexDirection: 'row',
            padding: 3,
            paddingHorizontal: 5,
            alignSelf: 'center',
            backgroundColor: '#2B8ADA',
            borderWidth: 1,
            borderColor: '#2B8ADA',
            borderRadius: 5,
          }}
          onPress={async () => {
            Alert.alert(
              'Create Prescription',
              `Do you want to create prescription for ${
                item.familyUserName == null ? item.patientName : item.familyUserName
              } right now?`,
              [
                {
                  text: 'Yes',
                  onPress: async () => {
                    await onPressPrescription(item);
                    navigation.navigate('CheifComplaints');
                  },
                },
                {
                  text: 'No',
                  style: 'cancel',
                },
              ]
            );
          }}
        >
          <FAIcon
            name="prescription"
            size={15}
            color="white"
            style={{ alignSelf: 'center', marginRight: 5 }}
            onPress={() => {}}
          />
          <Text style={{ fontSize: 12, color: 'white' }}>Create Prescription</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 0.2,
            justifyContent: 'center',
            flexDirection: 'row',
            padding: 3,
            paddingHorizontal: 5,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
          }}
          onPress={async () => {
            settodayId(item.consultationId);
            setpatientId(item.patientId);
            await getTodaysDocs(item.consultationId);
            setTodaysModal(true);
          }}
        >
          <FAIcon name="file-pdf" color="gray" size={15} style={{ marginRight: 5 }} />
          <Text style={{ fontSize: 12 }}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              flex: 0.1,
              justifyContent: 'center',
              flexDirection: 'row',
              padding: 3,
              paddingHorizontal: 5,
              borderWidth: 1,
              borderColor: '#2b8ada',
              borderRadius: 5,
            },
          ]}
          onPress={async () => {
            settodayId(item.consultationId);
            setpatientId(item.patientId);
            await getTodaysDocs(item.consultationId);
            setConsultationQuestionnaire(true);
          }}
        >
          <MCIcons
            name="clipboard-list"
            color="#2b8ada"
            size={15}
            style={{ alignSelf: 'center' }}
          />
          {/* <Text style={{fontSize: 12, color: '#2b8ada'}}>Questionnaire</Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCardRecent = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        width: '95%',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
      }}
      key={item.consultationId}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Text
          style={[
            styles.tag,
            {
              backgroundColor: '#2B8ADA',
            },
          ]}
        >
          Completed
        </Text>
        {item.patientPhoto === 0 || item.patientPhoto == null ? (
          <Image
            source={pfp1}
            style={{
              width: 90,
              height: 90,
              alignSelf: 'center',
              borderRadius: 5,
              margin: 5,
              marginHorizontal: 10,
            }}
          />
        ) : (
          <Image
            source={{
              uri: `${apiConfig.baseUrl}/file/download?fileToken=${item.patientPhoto}&userId=${item.patientId}`,
            }}
            style={{
              width: 90,
              height: 90,
              alignSelf: 'center',
              borderRadius: 5,
              margin: 5,
              marginHorizontal: 10,
            }}
          />
        )}
        <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
          <Text
            style={{
              flexDirection: 'row',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            {item.familyUserName == null ? item.patientName : item.familyUserName}
          </Text>
          {item.consultationType === 'PHYSICAL' ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                {/* <Text style={styles.cardText}>Clinic</Text> */}
                <FAIcon name="hospital" size={15} color="#2b8ada" style={{}} />
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={[styles.cardText, { color: '#2b8ada', fontWeight: 'bold' }]}>
                  {item.clinicName}
                  {' | '} {item.clinicAddress}
                </Text>
              </View>
            </View>
          ) : null}

          {item.patientDob != null || item.familyUserDob != null ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Age</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>
                  {item.familyUserDob == null
                    ? dayjs().diff(dayjs(item.patientDob), 'y')
                    : dayjs().diff(dayjs(item.familyUserDob), 'y')}
                </Text>
              </View>
            </View>
          ) : null}
          {item.familyUsercity != null || item.patientCity != null ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Location</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>
                  {item.familyUsercity == null ? item.patientCity : item.familyUsercity}
                </Text>
              </View>
            </View>
          ) : null}
          {item.symptoms != null ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Symptoms</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>{item.symptoms}</Text>
              </View>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                width: '20%',
                marginRight: '5%',
              }}
            >
              <Text style={styles.cardText}>Date</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '60%' }}>
              <Text style={styles.cardText}>{dayjs(item.slotDate).format('DD MMM, YYYY')}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                width: '20%',
                marginRight: '5%',
              }}
            >
              <Text style={styles.cardText}>Slot</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '60%' }}>
              <Text style={styles.cardText}>
                {timeformatter(item.slotStartTime)} {' - '}
                {timeformatter(item.slotEndTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Buttons */}
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        {item.consultationType !== 'PHYSICAL' ? (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 3,
              paddingHorizontal: 15,
              alignSelf: 'center',
              borderWidth: 1,
              borderColor: '#2b8ada',
              backgroundColor: '#2B8ADA',
              borderRadius: 5,
            }}
          >
            <FAIcon
              name={item.consultationType === 'VIDEO_CALL' ? 'video' : 'phone-alt'}
              color="white"
              size={15}
              style={{ marginRight: 5 }}
            />
            <Text style={{ fontSize: 13, color: 'white' }}>E-Consultation</Text>
          </TouchableOpacity>
        ) : (
          <CustomButton
            text="P-Consultation"
            textstyle={{ fontSize: 13, color: 'white' }}
            style={{
              borderWidth: 1,
              borderColor: '#2b8ada',
              backgroundColor: '#2B8ADA',
              padding: 3,
              alignSelf: 'center',
              borderRadius: 5,
              paddingHorizontal: 15,
            }}
          />
        )}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            padding: 3,
            paddingHorizontal: 15,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
          }}
          onPress={async () => {
            settodayId(item.consultationId);
            setpatientId(item.patientId);
            await getTodaysDocs(item.consultationId);
            setTodaysModal(true);
          }}
        >
          <FAIcon name="file-pdf" color="gray" size={15} style={{ marginRight: 5 }} />
          <Text style={{ fontSize: 13 }}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            padding: 3,
            paddingHorizontal: 15,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
          }}
          onPress={async () => {
            downloadCache(
              item.prescriptionPath,
              doctorId,
              `${item.consultationId}_Prescription_${item.slotDate}.pdf`
            );
          }}
        >
          <FAIcon name="prescription" size={15} style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCardCompleted = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        width: '95%',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
      }}
      key={item.consultationId}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Text
          style={[
            styles.tag,
            {
              backgroundColor: '#4DB707',
            },
          ]}
        >
          Completed
        </Text>
        {item.patientPhoto === 0 || item.patientPhoto == null ? (
          <Image
            source={pfp1}
            style={{
              width: 90,
              height: 90,
              alignSelf: 'center',
              borderRadius: 5,
              margin: 5,
              marginHorizontal: 10,
            }}
          />
        ) : (
          <Image
            source={{
              uri: `${apiConfig.baseUrl}/file/download?fileToken=${item.patientPhoto}&userId=${item.patientId}`,
            }}
            style={{
              width: 90,
              height: 90,
              alignSelf: 'center',
              borderRadius: 5,
              margin: 5,
              marginHorizontal: 10,
            }}
          />
        )}
        <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
          <Text
            style={{
              flexDirection: 'row',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            {item.familyUserName == null ? item.patientName : item.familyUserName}
          </Text>
          {item.consultationType === 'PHYSICAL' ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                {/* <Text style={styles.cardText}>Clinic</Text> */}
                <FAIcon name="hospital" size={15} color="#2b8ada" style={{}} />
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={[styles.cardText, { color: '#2b8ada', fontWeight: 'bold' }]}>
                  {item.clinicName}
                  {' | '} {item.clinicAddress}
                </Text>
              </View>
            </View>
          ) : null}

          {item.patientDob != null || item.familyUserDob != null ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Age</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>
                  {item.familyUserDob == null
                    ? dayjs().diff(dayjs(item.patientDob), 'y')
                    : dayjs().diff(dayjs(item.familyUserDob), 'y')}
                </Text>
              </View>
            </View>
          ) : null}
          {item.familyUsercity != null || item.patientCity != null ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Location</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>
                  {item.familyUsercity == null ? item.patientCity : item.familyUsercity}
                </Text>
              </View>
            </View>
          ) : null}
          {item.symptoms != null ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '20%',
                  marginRight: '5%',
                }}
              >
                <Text style={styles.cardText}>Symptoms</Text>
              </View>
              <View style={{ flexDirection: 'column', width: '60%' }}>
                <Text style={styles.cardText}>{item.symptoms}</Text>
              </View>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                width: '20%',
                marginRight: '5%',
              }}
            >
              <Text style={styles.cardText}>Date</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '60%' }}>
              <Text style={styles.cardText}>{dayjs(item.slotDate).format('DD MMM, YYYY')}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                width: '20%',
                marginRight: '5%',
              }}
            >
              <Text style={styles.cardText}>Slot</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '60%' }}>
              <Text style={styles.cardText}>
                {timeformatter(item.slotStartTime)} {' - '}
                {timeformatter(item.slotEndTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Buttons */}
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        {item.consultationType !== 'PHYSICAL' ? (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 3,
              paddingHorizontal: 15,
              alignSelf: 'center',
              borderWidth: 1,
              borderColor: '#2b8ada',
              backgroundColor: '#2B8ADA',
              borderRadius: 5,
            }}
          >
            <FAIcon
              name={item.consultationType === 'VIDEO_CALL' ? 'video' : 'phone-alt'}
              color="white"
              size={15}
              style={{ marginRight: 5 }}
            />
            <Text style={{ fontSize: 13, color: 'white' }}>E-Consultation</Text>
          </TouchableOpacity>
        ) : (
          <CustomButton
            text="P-Consultation"
            textstyle={{ fontSize: 13, color: 'white' }}
            style={{
              borderWidth: 1,
              borderColor: '#2b8ada',
              backgroundColor: '#2B8ADA',
              padding: 3,
              alignSelf: 'center',
              borderRadius: 5,
              paddingHorizontal: 15,
            }}
          />
        )}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            padding: 3,
            paddingHorizontal: 15,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
          }}
          onPress={async () => {
            settodayId(item.consultationId);
            setpatientId(item.patientId);
            await getTodaysDocs(item.consultationId);
            setTodaysModal(true);
          }}
        >
          <FAIcon name="file-pdf" color="gray" size={15} style={{ marginRight: 5 }} />
          <Text style={{ fontSize: 13 }}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            padding: 3,
            paddingHorizontal: 15,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
          }}
          onPress={() => {
            downloadCache(
              item.prescriptionPath,
              doctorId,
              `${item.consultationId}_Prescription_${item.slotDate}.pdf`
            );
          }}
        >
          <FAIcon name="prescription" size={15} style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuestionAnswers = ({ item }) => (
    <View
      style={{
        margin: 5,
        backgroundColor: '#e8f0fe',
        borderRadius: 10,
      }}
      key={item.question}
    >
      <Text
        style={{
          padding: 5,
          paddingHorizontal: 10,
          backgroundColor: '#2b8ada',
          fontSize: 13,
          color: 'white',
          fontWeight: 'bold',
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          textTransform: 'capitalize',
        }}
      >
        {item.question}
      </Text>
      <Text
        style={{
          padding: 5,
          paddingHorizontal: 10,
          fontSize: 12,
          color: '#2b8ada',
          fontWeight: 'bold',
        }}
      >
        {item.answer}
      </Text>
    </View>
  );

  const renderHistory = ({ item }) => (
    <View
      style={{
        backgroundColor: '#E8F0FE',
        padding: 10,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 7,
        marginVertical: 10,
      }}
    >
      <View style={{ width: '80%', alignSelf: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.HistoryModalText}>Uploaded Date</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.HistoryModalText}>{dateformatter(item.uploadedDate)}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 5,
          }}
        >
          <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.HistoryModalText]}>Document</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <FAIcon
              name="file-pdf"
              size={20}
              color="black"
              style={{
                marginHorizontal: 5,
              }}
              onPress={() => {}}
            />
            <Text style={styles.HistoryModalText}>{item.documentName}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderToday = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderRadius: 15,
        padding: 10,
        backgroundColor: '#E8F0FE',
      }}
      onPress={async () => {
        // console.log(item.documentPath);
        await downloadCache(item.documentPath, patientId, `${item.documentName}.pdf`);
      }}
    >
      <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
        <Text style={styles.HistoryModalText}>{item.documentName}</Text>
      </View>
      <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
        <Text style={styles.HistoryModalText}>
          {dayjs(item.uploadedDate).format('DD MMM, YYYY')}
        </Text>
        <Text style={styles.HistoryModalText}>{dayjs(item.uploadedDate).format('HH:mm A')}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <FAIcon
          name="file-pdf"
          size={20}
          color="black"
          style={{
            alignSelf: 'center',
          }}
        />
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    const onLoadScreen = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
      setdoctorId(x.doctorId);

      const fcm = await AsyncStorage.getItem('fcmToken');
      console.log('===================== FCM TOKEN ================================', fcm);

      if (fcm !== x.firebaseToken && fcm != null) {
        await axios
          .post(`${apiConfig.baseUrl}/doctor/fcm/update`, {
            doctorId: x.doctorId,
            firebaseToken: fcm,
          })
          .then(async (response) => {
            if (response.status === 200) {
              x.firebaseToken = fcm;
              await AsyncStorage.setItem('UserDoctorProfile', JSON.stringify(x));
            }
          });
      }
    };
    onLoadScreen();
  }, []);

  useEffect(() => {
    if (Upcoming) getUpcomingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Upcoming]);

  const getUpcomingData = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    setDoctorObj(x);

    const getDoctorId = x.doctorId;
    setisFetching(true);

    axios
      .get(`${apiConfig.baseUrl}/doctor/upcoming/consultation?doctorId=${getDoctorId}`)
      .then((response) => {
        setisFetching(false);
        if (response.status === 200) {
          setUpcomingData(response.data);
        }
        console.log(UpcomingData);
      })
      .catch((error) => {
        setisFetching(false);
        Alert.alert(
          'Error',
          'An error occured while fetching upcoming details. Please try again later.'
        );
        console.log('=====Error in fetching upcoming consultation details=====');
        console.log(error);
      });
  };

  useEffect(() => {
    if (pending) getPendingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  const getPendingData = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    setDoctorObj(x);

    const getDoctorId = x.doctorId;
    setisFetching(true);

    axios
      .get(`${apiConfig.baseUrl}/doctor/consultation/presription/pending?doctorId=${getDoctorId}`)
      .then((response) => {
        setisFetching(false);
        if (response.status === 200) {
          setPendingData(response.data);
        }
      })
      .catch((error) => {
        setisFetching(false);
        Alert.alert(
          'Error',
          'An error occured while fetching pending details. Please try again later.'
        );
        // console.log('=====Error in fetching pending consultation details=====');
        console.log(error);
      });
  };

  useEffect(() => {
    if (Complete) getCompletedData();
  }, [Complete]);

  const getCompletedData = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));

    const getDoctorId = x.doctorId;
    setisFetching(true);

    axios
      .get(
        `${
          apiConfig.baseUrl
        }/doctor/complete/consultation?doctorId=${getDoctorId}&start=${0}&max=${10}`
      )
      .then((response) => {
        setisFetching(false);
        if (response.status === 200) setCompleteData(response.data);
        // console.log(CompleteData);
      })
      .catch((error) => {
        setisFetching(false);
        Alert.alert(
          'Error',
          'An error occured while fetching completed consultation details. Please try again later.'
        );
        console.log('=====Error in fetching completed consultation details=====');
        console.log(error);
      });
  };

  useEffect(() => {
    if (Status) getRecentData();
  }, [Status]);

  const getRecentData = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));

    const getDoctorId = x.doctorId;
    setisFetching(true);

    axios
      .get(`${apiConfig.baseUrl}/doctor/recent/consultation?doctorId=${getDoctorId}`)
      .then((response) => {
        setisFetching(false);
        if (response.status === 200) setStatusData(response.data);
      })
      .catch((error) => {
        setisFetching(false);
        Alert.alert(
          'Error',
          'An error occured while fetching recent consultation details. Please try again later.'
        );
        // console.log('=====Error in fetching recent consultation details=====');
        console.log(error);
      });
  };

  useEffect(() => {
    const getHistoryDocs = async () => {
      axios
        .get(`${apiConfig.baseUrl}/docs/upcoming/history?patientId=${historyId}`)
        .then((response) => {
          if (response.status === 200) sethistoryData(response.data);
          // console.log(historyData);
        })
        .catch((error) => {
          Alert.alert(
            'Error',
            'An error occured while fetching documents. Please try again later.'
          );
          console.log('=====Error in fetching documents=====');
          console.log(error);
        });
    };
    if (HistoryModal) getHistoryDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [HistoryModal]);

  const getTodaysDocs = async (getTodayId) => {
    axios
      .get(`${apiConfig.baseUrl}/docs/current/uploaded?consultationId=${getTodayId}`)
      .then((response) => {
        if (response.status === 200) {
          setTodaysDocs(response.data.documents);

          setPreconsultaionQuestionData(response.data.quesAns);
        }
        // console.log(TodaysDocs);
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          'An error occured while fetching previous documents of patient. Please try again later.'
        );
        // console.log('=====Error in fetching previous documents of patient=====');
        console.log(error);
      });
  };

  const onPrev = () => {
    setendCC(strtCC - 1);
    setstrtCC(strtCC - 5);
    // console.log('       START       :         ', strtCC);
    // console.log('       END         :         ', endCC);
    getMoreConsultationQues();
  };

  const onNext = () => {
    setstrtCC(endCC + 1);
    setendCC(endCC + 5);
    // console.log('       START       :         ', strtCC);
    // console.log('       END         :         ', endCC);
    getMoreConsultationQues();
  };

  const getMoreConsultationQues = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const getDoctorId = x.doctorId;
    // console.log("Completed");
    setisFetching(true);
    axios
      .get(
        `${apiConfig.baseUrl}/doctor/complete/consultation?doctorId=${getDoctorId}&start=${strtCC}&max=${endCC}`
      )
      .then((response) => {
        setisFetching(false);
        if (response.status === 200) {
          if (response.data !== '') {
            setendOfList(true);
            setCompleteData(response.data);
          } else setendOfList(false);
        }
      })
      .catch((error) => {
        setisFetching(false);
        Alert.alert(
          'Error',
          'An error occured while fetching completed consultation details. Please try again later.'
        );
        console.log('=====Error in fetching completed consultation details=====');
        console.log(error);
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
          width: '100%',
        }}
      >
        <StatusBar animated backgroundColor="#2B8ADA" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          style={{
            width: '100%',
            backgroundColor: '#E8F0FE',
            height: layout.height - 120,
            alignSelf: 'center',
          }}
        >
          <Header showMenu />
          <View style={{ width: '95%', alignSelf: 'center' }}>
            {/* Upcoming Consultations White Label */}
            <TouchableOpacity
              style={[styles.WhiteLabel, { marginTop: 20 }]}
              onPress={() => setUpcoming(!Upcoming)}
            >
              <FAIcon
                name="comment-medical"
                size={15}
                color={Upcoming ? '#2b8ada' : 'gray'}
                style={{ marginLeft: 3, alignSelf: 'center' }}
              />
              <Text
                style={[
                  styles.label,
                  { width: '80%' },
                  Upcoming ? { color: '#2B8ADA' } : { color: 'black' },
                ]}
              >
                Upcoming Consultations
              </Text>
              <FAIcon
                name={Upcoming ? 'chevron-down' : 'chevron-right'}
                size={20}
                style={[Upcoming ? { color: '#2B8ADA' } : { color: 'black' }]}
              />
            </TouchableOpacity>

            {/* Upcoming Consultaions Data */}
            {Upcoming ? (
              <View style={{ flexDirection: 'column' }}>
                <View style={{ backgroundColor: '#E8F0FE' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      padding: 5,
                      paddingHorizontal: 10,
                      marginLeft: 10,
                    }}
                    onPress={getUpcomingData}
                  >
                    <FAIcon
                      name="redo-alt"
                      size={12}
                      style={{ alignSelf: 'center', marginRight: 5 }}
                      color="#2b8ada"
                    />
                    <Text style={{ color: '#2b8ada', fontSize: 12 }}>Refresh</Text>
                  </TouchableOpacity>

                  <View>
                    {/* Card Design */}
                    {UpcomingData !== '' ? (
                      <FlatList
                        data={UpcomingData}
                        keyExtractor={(item) => item.consultationId}
                        renderItem={renderCard}
                      />
                    ) : (
                      <Text
                        style={{
                          marginVertical: 10,
                          fontSize: 12,
                          alignSelf: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        No Data Available for Upcoming Consultations
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : null}

            {/* Prescription Pending White Label */}
            <TouchableOpacity style={[styles.WhiteLabel]} onPress={() => setpending(!pending)}>
              <FAIcon
                name="prescription"
                size={15}
                color={pending ? '#2b8ada' : 'gray'}
                style={{ marginLeft: 3, alignSelf: 'center' }}
              />
              <Text
                style={[
                  styles.label,
                  { width: '80%' },
                  pending ? { color: '#2B8ADA' } : { color: 'black' },
                ]}
              >
                Prescription Pending
              </Text>
              <FAIcon
                name={pending ? 'chevron-down' : 'chevron-right'}
                size={20}
                style={[pending ? { color: '#2B8ADA' } : { color: 'black' }]}
              />
            </TouchableOpacity>

            {/* Prescription Pending Data */}
            {pending ? (
              <View style={{ flexDirection: 'column' }}>
                <View style={{ backgroundColor: '#E8F0FE' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      padding: 5,
                      paddingHorizontal: 10,
                      marginLeft: 10,
                    }}
                    onPress={getPendingData}
                  >
                    <FAIcon
                      name="redo-alt"
                      size={12}
                      style={{ alignSelf: 'center', marginRight: 5 }}
                      color="#2b8ada"
                    />
                    <Text style={{ color: '#2b8ada', fontSize: 12 }}>Refresh</Text>
                  </TouchableOpacity>

                  <View>
                    {PendingData !== '' ? (
                      <FlatList
                        data={PendingData}
                        keyExtractor={(item) => item.consultationId}
                        renderItem={renderCardPending}
                      />
                    ) : (
                      <Text
                        style={{
                          marginVertical: 10,
                          fontSize: 12,
                          alignSelf: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        No Data Available for Pending Prescriptions
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : null}

            {/* Recent Consultaions White Label */}
            <TouchableOpacity style={styles.WhiteLabel} onPress={() => setStatus(!Status)}>
              <Entypo
                name="back-in-time"
                size={17}
                color={Status ? '#2b8ada' : 'gray'}
                style={{
                  marginLeft: 3,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={[
                  styles.label,
                  { width: '80%' },
                  Status ? { color: '#2B8ADA' } : { color: 'black' },
                ]}
              >
                Recent Consultations
              </Text>
              <FAIcon
                name={Status ? 'chevron-down' : 'chevron-right'}
                size={20}
                style={[Status ? { color: '#2B8ADA' } : { color: 'black' }]}
              />
            </TouchableOpacity>

            {/* Recent Consultaions Body Data */}
            {Status ? (
              <View style={{ flexDirection: 'column' }}>
                <View style={{ backgroundColor: '#E8F0FE' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      padding: 5,
                      paddingHorizontal: 10,
                      marginLeft: 10,
                    }}
                    onPress={getRecentData}
                  >
                    <FAIcon
                      name="redo-alt"
                      size={12}
                      style={{ alignSelf: 'center', marginRight: 5 }}
                      color="#2b8ada"
                    />
                    <Text style={{ color: '#2b8ada', fontSize: 12 }}>Refresh</Text>
                  </TouchableOpacity>

                  <View>
                    {/* Card Design Completed Consultaions */}
                    {StatusData !== '' ? (
                      <FlatList
                        data={StatusData}
                        keyExtractor={(item) => item.consultationId}
                        renderItem={renderCardRecent}
                      />
                    ) : (
                      <Text
                        style={{
                          marginVertical: 10,
                          fontSize: 12,
                          alignSelf: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        No Recent Consultations Data Found
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : null}

            {/* Completed Consultaions White Label */}
            <TouchableOpacity style={styles.WhiteLabel} onPress={() => setComplete(!Complete)}>
              <FAIcon
                name="calendar-check"
                size={15}
                color={Complete ? '#2b8ada' : 'gray'}
                style={{ marginLeft: 3, alignSelf: 'center' }}
              />
              <Text
                style={[
                  styles.label,
                  { width: '80%' },
                  Complete ? { color: '#2B8ADA' } : { color: 'black' },
                ]}
              >
                Completed Consultations
              </Text>
              <FAIcon
                name={Complete ? 'chevron-down' : 'chevron-right'}
                size={20}
                style={[Complete ? { color: '#2B8ADA' } : { color: 'black' }]}
              />
            </TouchableOpacity>

            {/* Completed Consultaions Body Data */}
            {Complete ? (
              <View style={{ flexDirection: 'column' }}>
                <View style={{ backgroundColor: '#E8F0FE' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      padding: 5,
                      paddingHorizontal: 10,
                      marginLeft: 10,
                    }}
                    onPress={getCompletedData}
                  >
                    <FAIcon
                      name="redo-alt"
                      size={12}
                      style={{ alignSelf: 'center', marginRight: 5 }}
                      color="#2b8ada"
                    />
                    <Text style={{ color: '#2b8ada', fontSize: 12 }}>Refresh</Text>
                  </TouchableOpacity>

                  <View>
                    {/* Card Design Completed Consultaions */}
                    {CompleteData !== '' ? (
                      <View>
                        <FlatList
                          data={CompleteData}
                          keyExtractor={(item) => item.consultationId}
                          renderItem={renderCardCompleted}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          marginVertical: 10,
                          fontSize: 12,
                          alignSelf: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        No Completed Consultations Data Found
                      </Text>
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginVertical: 10,
                      }}
                    >
                      {strtCC !== 0 ? (
                        <Pressable
                          style={{ flexDirection: 'row', marginRight: 10 }}
                          onPress={() => onPrev()}
                        >
                          <FAIcon
                            size={15}
                            name="chevron-left"
                            style={{
                              fontWeight: 'bold',
                              alignSelf: 'center',
                            }}
                            color={strtCC === 0 ? '#E8F0FE' : 'black'}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              alignSelf: 'center',
                              color: strtCC === 0 ? '#E8F0FE' : 'black',
                              marginLeft: 3,
                            }}
                          >
                            Previous
                          </Text>
                        </Pressable>
                      ) : null}

                      {endOfList ? (
                        <Pressable style={{ flexDirection: 'row' }} onPress={() => onNext()}>
                          <Text
                            style={{
                              fontSize: 12,
                              alignSelf: 'center',
                              marginRight: 3,
                              color: 'black',
                            }}
                          >
                            Next
                          </Text>
                          <FAIcon
                            size={15}
                            name="chevron-right"
                            style={{
                              fontWeight: 'bold',
                              alignSelf: 'center',
                            }}
                          />
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {/* History Modal */}
            {HistoryModal ? (
              <Modal
                animationType="slide"
                transparent
                visible={HistoryModal}
                onRequestClose={() => {
                  setHistoryModal(!HistoryModal);
                }}
              >
                <View
                  style={{
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={[
                      styles.modalView,
                      {
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        marginBottom: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: 'gray',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          padding: 5,
                        }}
                      >
                        History
                      </Text>
                      <FAIcon
                        name="window-close"
                        color="black"
                        size={26}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        onPress={() => setHistoryModal(false)}
                      />
                    </View>
                    <View style={{ minHeight: 150, width: '100%' }}>
                      <View
                        style={{
                          padding: 10,
                          width: '100%',
                          alignSelf: 'center',
                          borderRadius: 7,
                          marginVertical: 10,
                        }}
                      >
                        {historyData !== '' ? (
                          <View style={{ minHeight: 270, width: '100%' }}>
                            <FlatList
                              data={historyData}
                              keyExtractor={(item) => item.uploadedDate}
                              renderItem={renderHistory}
                            />
                          </View>
                        ) : (
                          <View>
                            <Text style={{ textAlign: 'center' }}>
                              No previous record has been found
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            ) : null}

            {/* Todays Doc Modal */}
            {TodaysModal ? (
              <Modal
                animationType="slide"
                transparent
                visible={TodaysModal}
                onRequestClose={() => {
                  setTodaysModal(!TodaysModal);
                }}
              >
                <View
                  style={{
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={[
                      styles.modalView,
                      {
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        marginBottom: 5,
                        borderBottomWidth: 1,
                        borderBottomColor: 'gray',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          padding: 5,
                          color: 'black',
                        }}
                      >
                        Files
                      </Text>
                      <FAIcon
                        name="window-close"
                        color="black"
                        size={26}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        onPress={() => setTodaysModal(false)}
                      />
                    </View>
                    <View style={{ minHeight: 150, width: '100%' }}>
                      <View
                        style={{
                          padding: 10,
                          width: '100%',
                          alignSelf: 'center',
                          borderRadius: 7,
                          marginVertical: 10,
                        }}
                      >
                        {TodaysDocs !== '' && TodaysDocs != null ? (
                          <View style={{ width: '100%', alignSelf: 'center' }}>
                            <FlatList
                              data={TodaysDocs}
                              keyExtractor={(item) => item.documentName}
                              renderItem={renderToday}
                              scrollEnabled
                            />
                          </View>
                        ) : (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'column',
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Text style={{}}>No document has been uploaded by the patient</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            ) : null}
            {ManageStatusModal ? (
              <Modal
                animationType="slide"
                transparent
                visible={ManageStatusModal}
                onRequestClose={() => {
                  setManageStatusModal(!ManageStatusModal);
                }}
              >
                <View
                  style={{
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={[
                      styles.modalView,
                      {
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: 'gray',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          padding: 5,
                        }}
                      >
                        Manage Status
                      </Text>
                      <FAIcon
                        name="window-close"
                        color="black"
                        size={26}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        onPress={() => setManageStatusModal(false)}
                      />
                    </View>
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderRadius: 7,
                        marginVertical: 10,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>Consultation Completed?</Text>
                      <SelectList
                        defaultOption="Yes"
                        placeholder={' '}
                        setSelected={(val) => setManageStatus(val)}
                        data={dataStatus}
                        save="value"
                        boxStyles={{
                          backgroundColor: '#F3F7FE',
                          borderWidth: 0,
                          marginVertical: 5,
                        }}
                        dropdownStyles={{ backgroundColor: 'white' }}
                        dropdownTextStyles={{
                          color: '#2b8ada',
                          fontWeight: 'bold',
                        }}
                        badgeStyles={{ backgroundColor: '#2b8ada' }}
                      />
                    </View>
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderRadius: 7,
                        marginVertical: 10,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>Have you made the prescription?</Text>
                      <SelectList
                        defaultOption="Yes"
                        placeholder={' '}
                        setSelected={(val) => setPrescriptionMade(val)}
                        data={dataStatus}
                        save="value"
                        boxStyles={{
                          backgroundColor: '#F3F7FE',
                          borderWidth: 0,
                          marginVertical: 5,
                        }}
                        dropdownStyles={{ backgroundColor: 'white' }}
                        dropdownTextStyles={{
                          color: '#2b8ada',
                          fontWeight: 'bold',
                        }}
                        badgeStyles={{ backgroundColor: '#2b8ada' }}
                      />
                    </View>
                    <CustomButton
                      text="Save"
                      textstyle={{ color: 'white' }}
                      style={{
                        backgroundColor: '#2B8ADA',
                        width: '95%',
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        setManageStatusModal(false);
                        if (PrescriptionMade === 'No') {
                          Alert.alert(
                            'Prescription Missing',
                            'Please make Prescription for the patient'
                          );
                          // onPressPrescription();
                        }
                      }}
                    />
                  </View>
                </View>
              </Modal>
            ) : null}
            {ConsultationQuestionnaire ? (
              <Modal
                animationType="slide"
                transparent
                visible={ConsultationQuestionnaire}
                onRequestClose={() => {
                  setConsultationQuestionnaire(!ConsultationQuestionnaire);
                }}
              >
                <View
                  style={{
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={[
                      styles.modalView,
                      {
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: 'gray',
                        marginBottom: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          padding: 5,
                        }}
                      >
                        Consultation Questionnaire
                      </Text>
                      <FAIcon
                        name="window-close"
                        color="black"
                        size={26}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        onPress={() => setConsultationQuestionnaire(false)}
                      />
                    </View>
                    <View style={{ width: '100%', minHeight: 100, maxHeight: 300 }}>
                      {PreconsultaionQuestionData !== '' || PreconsultaionQuestionData != null ? (
                        <FlatList
                          data={PreconsultaionQuestionData}
                          keyExtractor={(item) => item.question}
                          renderItem={renderQuestionAnswers}
                          scrollEnabled
                        />
                      ) : (
                        <Text style={{ justifyContent: 'center' }}>Not answered by patient</Text>
                      )}
                    </View>
                  </View>
                </View>
              </Modal>
            ) : null}
            {PrescriptionModal ? (
              <Modal
                animationType="slide"
                transparent
                visible={PrescriptionModal}
                onRequestClose={() => {
                  setPrescriptionModal(!PrescriptionModal);
                }}
              >
                <View
                  style={{
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={[
                      styles.modalView,
                      {
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: 'gray',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          padding: 5,
                          color: 'black',
                        }}
                      >
                        Document
                      </Text>
                      <FAIcon
                        name="window-close"
                        color="black"
                        size={26}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        onPress={() => {
                          setPrescriptionModal(false);
                          setprescriptionId(null);
                          setZoom(1);
                        }}
                      />
                    </View>
                    <View style={{ minHeight: 150, width: '100%' }}>
                      <View
                        style={{
                          padding: 10,
                          width: '100%',
                          alignSelf: 'center',
                          borderRadius: 7,
                          marginVertical: 10,
                          borderWidth: 2,
                          borderColor: 'gray',
                        }}
                      >
                        <Pdf
                          source={{
                            uri: prescriptionId,
                          }}
                          style={{
                            width: '100%',
                            height: 275,
                            alignSelf: 'center',
                          }}
                          scale={zoom}
                        />
                      </View>

                      <View style={{ alignSelf: 'center', flexDirection: 'column' }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'space-evenly',
                            width: '95%',
                          }}
                        >
                          <TouchableOpacity>
                            <FAIcon
                              name="minus-circle"
                              size={20}
                              color="gray"
                              onPress={onZoomOut}
                            />
                          </TouchableOpacity>
                          <Text>
                            {zoom * 100}
                            {' %'}
                          </Text>
                          <TouchableOpacity>
                            <FAIcon name="plus-circle" size={20} color="gray" onPress={onZoomIn} />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: '85%',
                            alignSelf: 'center',
                            marginTop: 5,
                          }}
                        />
                        <CustomButton
                          textstyle={{ color: 'white', fontSize: 12 }}
                          text="Download"
                          style={{
                            backgroundColor: 'limegreen',
                            borderRadius: 10,
                          }}
                          onPress={async () => {
                            const fileName = prescriptionId.split('/').pop();
                            await RNFS.copyFile(
                              prescriptionId,
                              `file://${RNFS.DownloadDirectoryPath}/${fileName}`
                            );
                            Alert.alert(
                              'Downloaded',
                              `Prescription has been downloaded under the name of:- ${fileName}`
                            );
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            ) : null}
          </View>
        </ScrollView>
        {isFetching && (
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
                width: 200,
                height: 200,
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Image
                source={downloading}
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
                  fontSize: 18,
                  fontWeight: 'bold',
                  width: '100%',
                  marginVertical: 5,
                  // padding: 10,
                }}
              >
                {'Please wait '}
              </Text>
              <Text
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 12,
                  width: '100%',
                  paddingHorizontal: 15,
                }}
              >
                We are fetching details
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#e8f0fe',
  },
  searchBar: {
    height: 50,
    width: '95%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#2B8ADA',
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    marginLeft: 5,
  },
  searchBarText: {
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    margin: 15,
  },
  card: {
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 5,
    flexDirection: 'column',
    borderColor: 'gray',
  },
  name: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    padding: 3,
  },
  cardText: { fontSize: 12 },
  checkBoxContainerStyle: {
    backgroundColor: '#E8F0FE',
    flex: 0.45,
    borderWidth: 0,
    padding: 0,
  },
  WhiteLabel: {
    flexDirection: 'row',
    width: '95%',
    marginVertical: 5,
    alignSelf: 'center',
    backgroundColor: 'white',
    marginBottom: 5,
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  tag: {
    color: 'white',
    padding: 5,
    paddingVertical: 10,
    fontSize: 5,
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  modalView: {
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  HistoryModalText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  bubbleHeading: {
    color: 'black',
    padding: 5,
    width: '90%',
  },
  bubble: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E8F0FE',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  bubbleHeadingActive: {
    color: 'white',
    padding: 5,
    width: '90%',
  },
  bubbleActive: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#2B8ADA',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 5,
  },
});
