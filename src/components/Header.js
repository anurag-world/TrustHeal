/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import dayjs from 'dayjs';
import CustomButton from './CustomButton';
import DayDateMaker from './API/DayDateMaker';
import apiConfig from './API/apiConfig';
import timeformatter from './API/timeformatter';
import map from '../../assets/map.png';

const NotiSample = [
  {
    id: 1,
    txt: 'Lorem Ipsum Is Simply 1 Text Of The Printing And Typesetting Industry.',
  },
  {
    id: 2,
    txt: 'Lorem Ipsum Is Simply 11 Text Of The Printing And Typesetting Industry.',
  },
  {
    id: 3,
    txt: 'Lorem Ipsum Is Simply 111 Text Of The Printing And Typesetting Industry.',
  },
  {
    id: 4,
    txt: 'Lorem Ipsum Is Simply 2 Text Of The Printing And Typesetting Industry.',
  },
  {
    id: 5,
    txt: 'Lorem Ipsum Is Simply 22 Text Of The Printing And Typesetting Industry.',
  },
  {
    id: 6,
    txt: 'Lorem Ipsum Is Simply 23 Text Of The Printing And Typesetting Industry.',
  },
  {
    id: 7,
    txt: 'Lorem Ipsum Is Simply 3 Text Of The Printing And Typesetting Industry.',
  },
  {
    id: 8,
    txt: 'Lorem Ipsum Is Simply 4 Text Of The Printing And Typesetting Industry.',
  },
];

export default function Header({ title, showMenu }) {
  const [name, setName] = useState('');
  const [mob, setMob] = useState('');
  const [OTP, setOTP] = useState('');
  const [showOTP, setshowOTP] = useState(false);
  const [showOTPResend, setshowOTPResend] = useState(false);
  const [mode, setMode] = useState('');
  const [date, setdate] = useState(null);
  const [eslotsId, seteslotsId] = useState(null);
  const [preveslotsId, setpreveslotsId] = useState(null);
  const [viewESlots, setviewESlots] = useState([]);
  const [viewESlotsDate, setviewESlotsDate] = useState([]);
  const [fees, setfees] = useState(0);
  const [slotTime, setslotTime] = useState('');
  const [slotStartTime, setslotStartTime] = useState('');
  const [slotEndTime, setslotEndTime] = useState('');
  const [shareModal, setShareModal] = useState(false);
  const [LocationModal, setLocationModal] = useState(false);
  const [NotificationModal, setNotificationModal] = useState(false);
  const [NotificationList, setNotificationList] = useState(NotiSample);
  const [whileUsing, setwhileUsing] = useState(false);
  const [onlyUsing, setonlyUsing] = useState(false);
  const [donAllow, setdonAllow] = useState(false);
  const [DaysSlotRefresh, setDaysSlotRefresh] = useState(false);
  const [DocDet, setDocDet] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const onLoadData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
      setDocDet(x);
    };
    onLoadData();
  }, []);

  useEffect(() => {
    const getEDates = async () => {
      const doctorId = Number(DocDet.doctorId);
      axios
        .get(`${apiConfig.baseUrl}/slot/eslot/dates?doctorId=${doctorId}`)
        .then((response) => {
          setviewESlotsDate(DayDateMaker(response.data));
        })
        .catch((error) => {
          // console.log('=====Get Eslot Dates Detail=====');
          Alert.alert('Error in fetching E-dates', `${error}`);
        });
    };
    if (shareModal) getEDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareModal]);

  const getSlots = async (isDate) => {
    const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const doctorId = Number(x.doctorId);
    setslotTime('');
    setslotStartTime('');
    setslotEndTime('');
    if (isDate !== '') {
      axios
        .get(`${apiConfig.baseUrl}/slot/eslot/available?date=${isDate}&doctorId=${doctorId}`)
        .then((response) => {
          setviewESlots(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Alert.alert('Select a date first');
    }
  };

  const removeHandler = (e) => {
    setNotificationList(NotificationList.filter((obj) => obj.id !== e));
    // console.log(questionareList);
  };

  const RenderNotifications = () =>
    NotificationList.map((notification, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <View style={styles.bubble} key={index}>
        <Text style={[styles.bubbleHeading, { fontWeight: 'bold' }]}>{notification.txt}</Text>
        <FAIcon
          name="trash"
          color="gray"
          size={20}
          style={{ alignSelf: 'center' }}
          onPress={() => {
            // console.log(NotificationList.ques);
            removeHandler(notification.id);
          }}
        />
      </View>
    ));

  const renderSlot = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.slotBackground,
        {
          justifyContent: 'center',
        },
        item.slotId === eslotsId ? { backgroundColor: '#2b8ada' } : null,
      ]}
      onPress={async () => {
        let x = false;
        if (eslotsId == null) {
          seteslotsId(item.slotId);
          x = await checkAvailable(item.slotId);
        } else {
          await unlockSlot(eslotsId);
          setpreveslotsId(eslotsId);
          seteslotsId(item.slotId);
          x = await checkAvailable(item.slotId);
        }
        if (x) {
          setslotTime(timeformatter(item.startTime));
          setslotStartTime(timeformatter(item.startTime));
          setslotEndTime(timeformatter(item.endTime));
          setMode(item.typeOfEConsultation);
        }
      }}
    >
      {item.typeOfEConsultation != null ? (
        <FAIcon
          name={item.typeOfEConsultation === 'PHONE_CALL' ? 'phone-alt' : 'video'}
          size={12}
          color={item.slotId === eslotsId ? 'white' : '#2b8ada'}
          style={{ alignSelf: 'center', marginRight: 3 }}
        />
      ) : null}
      <Text style={[item.slotId === eslotsId ? styles.slotTitleActive : styles.slotTitle]}>
        {timeformatter(item.startTime)} - {timeformatter(item.endTime)}
      </Text>
    </TouchableOpacity>
  );

  const renderEViewDaysSlot = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.bubble,
        {
          width: 60,
          justifyContent: 'center',
          marginLeft: 5,
        },
        item.date === date ? { backgroundColor: '#2b8ada' } : null,
      ]}
      onPress={async () => {
        setviewESlots('');
        setdate(item.date);
        await getSlots(item.date);
      }}
    >
      <Text style={[styles.bubbleTitle, item.date === date ? { color: 'white' } : null]}>
        {`${item.day}\n${new Date(item.date).getDate()}`}
      </Text>
    </TouchableOpacity>
  );

  const usingApp = () => {
    setwhileUsing(true);
    setonlyUsing(false);
    setdonAllow(false);
    setLocationModal(false);
    // console.log('While using the app');
  };
  const onlyUsingApp = () => {
    setwhileUsing(false);
    setonlyUsing(true);
    setdonAllow(false);
    setLocationModal(false);
    // console.log('Only using the app');
  };
  const dontAllow = () => {
    setwhileUsing(false);
    setonlyUsing(false);
    setdonAllow(true);
    setLocationModal(false);
    // console.log("Don't Allow");
  };

  const checkAvailable = async (id) =>
    axios
      .post(
        `${apiConfig.baseUrl}/doctor/slot/prebook?consultation=E_CONSULTATION&slotId=${id}&userId=${DocDet.doctorId}`
      )
      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Success', 'This slot is available to be shared with patient');
          return true;
        }
        return false;
      })
      .catch(() => {
        Alert.alert('Oops', 'This slot is under transaction. Please choose another slot');
        seteslotsId(null);
        return false;
      });

  const unlockSlot = async (id) => {
    await axios
      .delete(
        `${apiConfig.baseUrl}/doctor/slot/prebooked/delete?consultation=E_CONSULTATION&slotId=${id}`
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(`Slot unlocked ${id}`);
        }
      })
      .catch((error) => {
        Alert.alert('Error', `${error}`);
        return false;
      });
  };

  const Message = async () => {
    const p = {
      consultationType: mode,
      eslotsId,
      fees,
      patientMobileNumber: mob,
      patientName: name,
    };

    axios
      .post(`${apiConfig.baseUrl}/app/doctor/to/patient/share`, p)
      .then(async (response) => {
        if (response.status === 200) {
          Alert.alert(
            'Slot Booked',
            `Slot successfully booked for ${p.patientName} on ${dayjs(p.slotDate).format(
              'DD MMM, YYYY'
            )} at ${p.slotStartTime}`
          );
          setShareModal(false);
          await reset();
        }
      })
      .catch((error) => {
        Alert.alert('Error', `${error}`);
      });
  };

  const sendOTP = async () => {
    await axios
      .post(`${apiConfig.baseUrl}/app/otp/send?mobileNumber=${mob}`)
      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Success', `A 4 digit OTP has been shared on ${mob}.`);
          setshowOTP(true);
          setshowOTPResend(true);
        }
      })
      .catch((error) => {
        Alert.alert('Error in OTP', `${error}`);
      });
  };

  const verifyOTP = async () => {
    await axios
      .post(`${apiConfig.baseUrl}/app/otp/verify`, {
        mobileNumber: mob,
        otp: OTP,
      })
      .then(async (response) => {
        // console.log(response);
        if (response.status === 200) {
          Alert.alert(
            'Existing User',
            `There is an existing patient with this mobile number under the name of ${response.data.patientname}`
          );
          await unlockSlot(eslotsId);
          reset();
        } else if (response.status === 204) await Message();
      })
      .catch((error) => {
        Alert.alert('Invalid OTP', `Please enter valid OTP`);
        console.log(error);
      });
  };

  const reset = async () => {
    seteslotsId(null);
    setpreveslotsId(null);
    setdate(null);
    setshowOTPResend(false);
    setMode('');
    setslotTime('');
    setslotStartTime('');
    setslotEndTime('');
    setName('');
    setMob('');
    setfees('');
    setOTP('');
    setviewESlots([]);
    setShareModal(false);
  };

  return (
    <View
      style={{
        backgroundColor: 'black',
        flexDirection: 'row',
        padding: 10,
        width: '100%',
        justifyContent: 'space-between',
        alignSelf: 'center',
      }}
    >
      <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
        {showMenu ? (
          <FAIcon
            style={styles.icon}
            name="bars"
            size={20}
            color="white"
            onPress={() => navigation.toggleDrawer()}
          />
        ) : (
          <TouchableOpacity
            style={{
              justifyContent: 'space-evenly',
              flexDirection: 'row',
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <FAIcon style={styles.icon} name="chevron-left" size={20} color="white" />
            <Text
              style={{
                color: 'white',
                alignSelf: 'center',
                textAlign: 'left',
                fontSize: 15,
              }}
            >
              {title}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[{ flexDirection: 'column' }]}>
        <View style={{ flexDirection: 'row' }}>
          <FAIcon
            style={styles.icon}
            name="share-alt"
            size={20}
            color="white"
            onPress={async () => {
              setShareModal(true);
            }}
          />
        </View>
      </View>

      {shareModal ? (
        <Modal
          animationType="slide"
          transparent
          visible={shareModal}
          onRequestClose={() => {
            setShareModal(!shareModal);
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
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  borderTopRightRadius: 34,
                  borderTopLeftRadius: 34,
                  padding: 20,
                  bottom: 0,
                  minHeight: 500,
                  maxHeight: 700,
                },
              ]}
            >
              <View
                style={{
                  borderBottomColor: 'gray',
                  borderBottomWidth: 1,
                  width: '100%',
                  flexDirection: 'row',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}
                >
                  Share with Patient
                </Text>
                <FAIcon
                  name="window-close"
                  color="black"
                  size={20}
                  style={{ position: 'absolute', right: 0 }}
                  onPress={async () => {
                    await reset();
                  }}
                />
              </View>
              <ScrollView style={{ width: '95%', alignSelf: 'center' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  {/* E-Dates */}
                  <View
                    style={{
                      marginTop: 5,
                      alignSelf: 'center',
                      width: '95%',
                      minHeight: 0,
                      maxHeight: 150,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontsize: 12,
                        marginTop: 5,
                        borderBottomWidth: 1,
                        borderBottomColor: '#2b8ada',
                        color: '#2b8ada',
                      }}
                    >
                      Select Date :-
                    </Text>

                    {viewESlotsDate.length > 0 ? (
                      <View
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          paddingLeft: 10,
                          borderColor: '#2b8ada',
                          borderRadius: 15,
                          marginVertical: 10,
                        }}
                      >
                        <FlatList
                          horizontal
                          data={viewESlotsDate}
                          extraData={DaysSlotRefresh}
                          keyExtractor={(item) => item.date}
                          renderItem={renderEViewDaysSlot}
                        />
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            marginVertical: 10,
                            alignSelf: 'center',
                            fontSize: 12,
                          }}
                        >
                          No Dates Available for E-consultation
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Slots */}
                <View
                  style={{
                    marginTop: 5,
                    alignSelf: 'center',
                    width: '95%',
                    minHeight: 0,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontsize: 12,
                      marginTop: 5,
                      borderBottomWidth: 1,
                      borderBottomColor: '#2b8ada',
                      color: '#2b8ada',
                    }}
                  >
                    Select Slots :-
                  </Text>

                  {viewESlots.length > 0 ? (
                    <View
                      style={{
                        padding: 3,
                        borderColor: '#2b8ada',
                        marginVertical: 10,
                        borderRadius: 15,
                      }}
                    >
                      <FlatList
                        horizontal={false}
                        data={viewESlots}
                        keyExtractor={(item, index) => index}
                        renderItem={renderSlot}
                        numColumns={2}
                        style={{ alignSelf: 'center' }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        marginVertical: 10,
                      }}
                    >
                      {date == null ? (
                        <Text
                          style={{
                            marginVertical: 10,
                            alignSelf: 'center',
                            fontSize: 12,
                          }}
                        >
                          Please Select E-consulation Date
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginVertical: 10,
                            alignSelf: 'center',
                            fontSize: 12,
                          }}
                        >
                          No Slots Available
                        </Text>
                      )}
                    </View>
                  )}
                </View>
                <View
                  style={{
                    marginTop: 5,
                    flexDirection: 'column',
                    width: '95%',
                    alignSelf: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontsize: 12,
                      marginTop: 5,
                      borderBottomWidth: 1,
                      borderBottomColor: '#2b8ada',
                      color: '#2b8ada',
                      marginBottom: 10,
                    }}
                  >
                    Patient Details:-
                  </Text>

                  <View
                    style={{
                      padding: 10,
                    }}
                  >
                    {/* Patient Name Row */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}
                    >
                      {/* Patient Name */}
                      <View style={[styles.inputField, { paddingVertical: 0 }, { flex: 1 }]}>
                        <TextInput
                          onChangeText={(text) => setName(text)}
                          value={name}
                          maxLength={30}
                          style={{ fontSize: 12 }}
                          placeholder="Patient Name"
                        />
                      </View>
                    </View>

                    {/* Amount Received */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}
                    >
                      <View style={[styles.inputField, { paddingVertical: 0 }, { flex: 1 }]}>
                        <TextInput
                          onChangeText={(text) => setfees(text)}
                          value={fees}
                          style={{ fontSize: 12 }}
                          placeholder="Amount Received (in ₹)"
                          keyboardType="number-pad"
                          maxLength={4}
                        />
                      </View>
                    </View>

                    {/* Mobile Number and OTP Row */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}
                    >
                      {/* Mobile Number */}
                      <View
                        style={[
                          styles.inputField,
                          { paddingVertical: 0 },
                          { flex: 0.49, backgroundColor: 'white' },
                        ]}
                      >
                        <TextInput
                          onChangeText={(text) => setMob(text)}
                          value={mob}
                          maxLength={10}
                          style={{
                            fontSize: 12,
                            backgroundColor: '#E8F0FE',
                            borderRadius: 10,
                            paddingHorizontal: 5,
                          }}
                          placeholder="Mobile No."
                          keyboardType="number-pad"
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#2b8ada',
                            marginVertical: 5,
                          }}
                          onPress={async () => {
                            if (mob.length !== 10)
                              Alert.alert(
                                'Invalid Number',
                                'Please enter valid 10 digit mobile number',
                                [
                                  {
                                    text: 'ok',
                                    onPress: () => {
                                      setshowOTP(false);
                                      setOTP('');
                                      setMob('');
                                    },
                                  },
                                ]
                              );
                            else {
                              await sendOTP();
                            }
                          }}
                        >
                          {!showOTPResend ? 'Send OTP' : 'Resend OTP'}
                        </Text>
                      </View>

                      {/* OTP */}
                      {showOTP ? (
                        <View
                          style={[
                            styles.inputField,
                            { paddingVertical: 0 },
                            { flex: 0.49, backgroundColor: 'white' },
                          ]}
                        >
                          <TextInput
                            onChangeText={(text) => setOTP(text)}
                            value={OTP}
                            keyboardType="number-pad"
                            maxLength={4}
                            style={{
                              fontSize: 12,
                              backgroundColor: '#E8F0FE',
                              borderRadius: 10,
                              paddingHorizontal: 5,
                            }}
                            placeholder="Enter OTP"
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                  <CustomButton
                    text="Share"
                    textstyle={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}
                    style={{
                      backgroundColor: '#2B8ADA',
                      alignSelf: 'center',
                      flex: 0.9,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={async () => {
                      if (name === '')
                        Alert.alert('Incomplete Details', 'Please fill in the patient name');
                      else if (mob === '')
                        Alert.alert(
                          'Incomplete Details',
                          'Please fill in the patient mobile number'
                        );
                      else if (fees === '')
                        Alert.alert(
                          'Incomplete Details',
                          'Please fill in the fees received from the patient'
                        );
                      else if (date === '')
                        Alert.alert(
                          'Incomplete Details',
                          'Please select the date for e-consultation'
                        );
                      else if (slotStartTime === '')
                        Alert.alert(
                          'Incomplete Details',
                          'Please select the time slot for e-consultation'
                        );
                      else if (showOTP === false)
                        Alert.alert('Notice', 'Please validate number by pressing Send OTP');
                      else {
                        await verifyOTP();
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      {LocationModal ? (
        <Modal
          animationType="slide"
          transparent
          visible={LocationModal}
          onRequestClose={() => {
            setLocationModal(!LocationModal);
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
              style={{
                backgroundColor: 'white',
                flexDirection: 'column',
                width: '90%',
                alignSelf: 'center',
                alignItems: 'center',
                padding: 20,
                borderRadius: 15,
              }}
            >
              <FAIcon
                name="window-close"
                size={20}
                style={{ position: 'absolute', top: 0, right: 0, padding: 20 }}
                onPress={() => setLocationModal(false)}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginVertical: 20,
                }}
              >
                Location Permission is Off
              </Text>
              {/* TODO: Check Arogya text */}
              <Text style={{ textAlign: 'center', fontsize: 10 }}>
                Allow Arogya to automatically detect your location to connect you to best hospital
                doctors nearby
              </Text>
              <Image source={map} style={{ marginVertical: 20 }} />
              <Text style={{ marginVertical: 10, fontWeight: 'bold' }}>
                Allow Arogya to access this device location?
              </Text>

              <CustomButton
                text="While using the app"
                textstyle={{ fontsize: 10 }}
                style={{
                  backgroundColor: '#E8F0FE',
                  width: '95%',
                  padding: 5,
                  marginBottom: 5,
                }}
                onPress={() => {
                  usingApp();
                }}
              />

              <CustomButton
                text="Only using the app"
                textstyle={{ fontsize: 10 }}
                style={{
                  backgroundColor: '#E8F0FE',
                  width: '95%',
                  padding: 5,
                  marginBottom: 5,
                }}
                onPress={() => {
                  onlyUsingApp();
                }}
              />

              <CustomButton
                text="Don't Allow"
                textstyle={{ fontsize: 10 }}
                style={{
                  backgroundColor: '#E8F0FE',
                  width: '95%',
                  padding: 5,
                  marginBottom: 5,
                }}
                onPress={() => {
                  dontAllow();
                }}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {NotificationModal ? (
        <Modal
          animationType="slide"
          transparent
          visible={NotificationModal}
          onRequestClose={() => {
            setNotificationModal(!NotificationModal);
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
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  borderRadius: 34,
                  alignSelf: 'center',
                  width: '95%',
                },
              ]}
            >
              <View
                style={{
                  borderBottomColor: 'gray',
                  borderBottomWidth: 1,
                  width: '100%',
                  flexDirection: 'row',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}
                >
                  Notification
                </Text>
                <FAIcon
                  name="window-close"
                  size={20}
                  onPress={() => {
                    setNotificationModal(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }}
                />
              </View>
              <ScrollView style={{ width: '100%', height: 100 }}>
                <RenderNotifications />
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  icon: {
    padding: 5,
  },
  modalView: {
    borderRadius: 10,
    flex: 1,
    position: 'absolute',
    height: 350,
    width: '100%',
    backgroundColor: 'white',
    borderTopRadius: 50,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  inputField: {
    backgroundColor: '#E8F0FE',
    borderRadius: 10,
    padding: 5,
  },

  bubbleHeading: {
    color: '#2B8ADA',
    padding: 5,
    width: '90%',
  },
  bubble: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E8F0FE',
    padding: 2,
    borderRadius: 15,
    marginVertical: 5,
  },
  bubbleTitle: {
    color: 'black',
    padding: 5,
    width: '90%',
    textAlign: 'center',
  },
  bubbleActive: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#2b8ada',
    padding: 5,
    borderRadius: 15,
    marginVertical: 5,
    width: '100%',
  },
  bubbleTitleActive: {
    color: '#fff',
    padding: 5,
    width: '90%',
    textAlign: 'center',
  },
  slotBackground: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E8F0FE',
    borderWidth: 1,
    borderColor: '#2b8ada',
    padding: 8,
    borderRadius: 5,
    margin: 2,
  },
  slotTitle: {
    fontSize: 10,
    color: 'black',
    textAlign: 'center',
    alignSelf: 'center',
  },
  slotBackgroundActive: {
    backgroundColor: '#2b8ada',
    borderColor: '#2b8ada',
  },
  slotTitleActive: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
  },
});
