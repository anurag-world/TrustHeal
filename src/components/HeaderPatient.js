/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Alert,
  Share,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { theme } from 'native-base';
import CustomButton from './CustomButton';
import map from '../../assets/map.png';

// icons
import apiConfig from './API/apiConfig';

// const slots = [
//   { id: 1, time: '11:00 AM' },
//   { id: 2, time: '11:15 AM' },
//   { id: 3, time: '11:30 AM' },
//   { id: 4, time: '11:45 AM' },
//   { id: 5, time: '12:00PM' },
//   { id: 6, time: '12:15 PM' },
//   { id: 7, time: '12:30 PM' },
//   { id: 8, time: '12:45 PM' },
// ];
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

function Header({ title, showMenu }) {
  const [patientName, setpatientName] = useState('');
  const [patientNumber, setpatientNumber] = useState('');
  const [showOTP, setshowOTP] = useState(false);
  const [showOTPResend, setshowOTPResend] = useState(false);
  const [validOTP, setvalidOTP] = useState(false);
  const [patientOTP, setpatientOTP] = useState('');
  // const [mode, setMode] = useState('');
  // const [date, setdate] = useState('');
  const [slot, setSlot] = useState('');
  const [msg, setMsg] = useState('');
  const [shareModal, setShareModal] = useState(false);
  const [LocationModal, setLocationModal] = useState(false);
  const [NotificationModal, setNotificationModal] = useState(false);
  const [NotificationList, setNotificationList] = useState(NotiSample);
  const [whileUsing, setwhileUsing] = useState(false);
  const [onlyUsing, setonlyUsing] = useState(false);
  const [donAllow, setdonAllow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [name, setName] = useState('');
  const navigation = useNavigation();

  const removeHandler = (e) => {
    setNotificationList(NotificationList.filter((obj) => obj.id !== e));
    // console.log(questionareList);
  };
  const RenderNotifications = () =>
    NotificationList.map((NotificationLists, index) => (
      <View style={styles.bubble} key={index}>
        <Text style={[styles.bubbleHeading, { fontWeight: 'bold' }]}>{NotificationLists.txt}</Text>
        <FAIcon
          name="trash"
          color="gray"
          size={15}
          style={{ alignSelf: 'center' }}
          onPress={() => {
            // console.log(NotificationList.ques);
            removeHandler(NotificationLists.id);
          }}
        />
      </View>
    ));

  const usingApp = () => {
    setwhileUsing(true);
    setonlyUsing(false);
    setdonAllow(false);
    setLocationModal(false);
    console.log('While using the app');
  };
  const onlyUsingApp = () => {
    setwhileUsing(false);
    setonlyUsing(true);
    setdonAllow(false);
    setLocationModal(false);
    console.log('Only using the app');
  };
  const dontAllow = () => {
    setwhileUsing(false);
    setonlyUsing(false);
    setdonAllow(true);
    setLocationModal(false);
    console.log("Don't Allow");
  };

  const Message = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
    const patientId = Number(x.patientId);
    axios
      .post(`${apiConfig.baseUrl}/app/patient/to/patient/share`, {
        patientId,
        patientName,
        patientNumber,
      })
      .then(async (response) => {
        // console.log(response);
        if (response.status === 200) {
          Alert.alert(
            'Shared Successfully',
            `The app has been shared with ${patientName} via message on mobile number ${patientNumber}`
          );
          clearAll();
        }
      })
      .catch((error) => {
        Alert.alert('Error', `${error}`);
      });
  };

  const sendOTP = async () => {
    await axios
      .post(`${apiConfig.baseUrl}/app/otp/send?mobileNumber=${patientNumber}`)
      .then((response) => {
        if (response.status === 200) {
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
        mobileNumber: patientNumber,
        otp: patientOTP,
      })
      .then(async (response) => {
        console.log(response);
        if (response.status === 200) {
          Alert.alert(
            'Existing User',
            `There is an existing patient with this mobile number under the name of ${response.data.patientname}`
          );
        } else if (response.status === 204) await Message();
      })
      .catch((error) => {
        Alert.alert('Invalid OTP', `Please enter valid OTP`);
        return false;
      });
  };
  const clearAll = () => {
    setpatientName('');
    setpatientNumber('');
    setpatientOTP('');
    setMsg('');
    setshowOTP(false);
    setshowOTPResend(false);
    setvalidOTP(false);
    setShareModal(false);
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey there! I've been using TrustHeal for Health Consultation and it's been amazing. If you're looking for a convenient and secure way to manage all your health care needs, check it out! Download TrustHeal here:  https://play.google.com/store/apps/details?id=com.trusthealapp`,
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

  // function Item({ id, time }) {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: '#E8F0FE',
  //         margin: 5,
  //         borderRadius: 10,
  //         padding: 10,
  //       }}
  //     >
  //       <Text
  //         style={{
  //           fontSize: 12,
  //           textAlign: 'center',
  //           color: 'black',
  //         }}
  //         onPress={() => {
  //           setSlot(time);
  //         }}
  //       >
  //         {time}
  //       </Text>
  //     </View>
  //   );
  // }

  // const renderItem = ({ item }) => <Item id={item.id} time={item.time} />;

  return (
    <View
      style={{
        backgroundColor: theme.colors.dark[50],
        flexDirection: 'row',
        padding: 10,
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
        {showMenu ? (
          <FAIcon
            style={styles.icon}
            name="bars"
            size={20}
            color="white"
            onPress={() => {
              console.log('Menu');
              navigation.toggleDrawer();
            }}
          />
        ) : (
          <TouchableOpacity
            style={{
              justifyContent: 'space-evenly',
              flexDirection: 'row',
            }}
            onPress={() => {
              if (title !== 'Confirm Booking') navigation.goBack();
            }}
          >
            {title !== 'Confirm Booking' && title !== 'PreConsult' ? (
              <FAIcon style={styles.icon} name="chevron-left" size={20} color="white" />
            ) : null}
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

      {title !== 'Confirm Booking' && title !== 'PreConsult' ? (
        <View style={[{ flexDirection: 'column', alignSelf: 'center' }]}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.navigate('PatientFav')}>
              <FAIcon
                style={styles.icon}
                name="heart"
                size={20}
                solid
                color={theme.colors.red[600]}
              />
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => {
                setLocationModal(true);
              }}>
              <Image style={styles.icon} source={location} color="white" />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={async () => {
                console.log('Share');
                await onShare();
                // setShareModal(true);
              }}
            >
              <FAIcon style={styles.icon} name="share-alt" size={20} color="white" />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                console.log('Notifications');
                setNotificationModal(true);
              }}>
              <Image style={styles.icon} source={bell} color="white" />
            </TouchableOpacity> */}
          </View>
        </View>
      ) : null}
      {shareModal ? (
        <Modal
          animationType="slide"
          transparent
          visible={shareModal}
          onRequestClose={() => {
            setModalVisible(!shareModal);
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
                  bottom: 0,
                  maxHeight: 350,
                  padding: 20,
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
                  Share App
                </Text>
                <FAIcon
                  name="window-close"
                  color="black"
                  size={20}
                  style={{ position: 'absolute', right: 0 }}
                  onPress={() => {
                    clearAll();
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 30,
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    width: '100%',
                  }}
                >
                  <View style={{ flex: 1, marginBottom: 10 }}>
                    <Text style={styles.shareModalLabel}>Name</Text>
                    <TextInput
                      style={{
                        backgroundColor: '#E8F0FE',
                        padding: 5,
                        borderRadius: 5,
                        color: 'black',
                      }}
                      onChangeText={(text) => setpatientName(text)}
                      value={patientName}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    width: '100%',
                  }}
                >
                  <View style={{ flex: 0.475 }}>
                    <Text style={styles.shareModalLabel}>Mobile No.</Text>
                    <TextInput
                      style={{
                        backgroundColor: '#E8F0FE',
                        padding: 5,
                        borderRadius: 5,
                        color: 'black',
                      }}
                      keyboardType="number-pad"
                      maxLength={10}
                      onChangeText={(text) => setpatientNumber(text)}
                      value={patientNumber}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Send OTP */}
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#2b8ada',
                          marginVertical: 5,
                        }}
                        onPress={async () => {
                          if (patientNumber.length !== 10)
                            Alert.alert(
                              'Invalid Number',
                              'Please enter valid 10 digit mobile number',
                              [
                                {
                                  text: 'ok',
                                  onPress: () => {
                                    setshowOTP(false);
                                    setpatientOTP('');
                                    setpatientNumber('');
                                  },
                                },
                              ]
                            );
                          else {
                            await sendOTP();
                            // setshowOTPResend(true);
                            // setshowOTP(true);
                          }
                        }}
                      >
                        {!showOTPResend ? 'Send OTP' : 'Resend OTP'}
                      </Text>
                    </View>
                  </View>
                  {showOTP ? (
                    <View style={{ flex: 0.475 }}>
                      <Text style={styles.shareModalLabel}>Enter OTP</Text>
                      <TextInput
                        style={{
                          backgroundColor: '#E8F0FE',
                          padding: 5,
                          borderRadius: 5,
                          color: 'black',
                        }}
                        keyboardType="number-pad"
                        maxLength={4}
                        onChangeText={(text) => setpatientOTP(text)}
                        value={patientOTP}
                      />
                    </View>
                  ) : null}
                </View>

                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginTop: 20,
                    }}
                  >
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
                        flex: 0.65,
                        borderRadius: 10,
                        marginTop: 10,
                      }}
                      onPress={async () => {
                        if (patientName === '')
                          Alert.alert('Invalid Input', 'Please enter patient name');
                        else if (patientNumber === '')
                          Alert.alert('Invalid Input', 'Please enter patient mobile phone number');
                        else if (!showOTP)
                          Alert.alert('Notice', 'Please validate number by pressing Send OTP');
                        // else if (validOTP == false)
                        //   Alert.alert(
                        //     'Invalid OTP',
                        //     'Please enter valid OTP as received on the given mobile number',
                        //   );
                        else {
                          await verifyOTP();
                        }
                      }}
                    />
                  </View>
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
    alignSelf: 'center',
    marginHorizontal: 4,
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
    color: 'black',
  },
  bubble: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E8F0FE',
    padding: 5,
    borderRadius: 15,
    marginVertical: 5,
    width: '100%',
  },

  bubbleHeading: {
    color: '#2B8ADA',
    padding: 5,
    width: '90%',
  },
  shareModalLabel: { fontSize: 13, marginBottom: 3, fontWeight: 'bold' },
});

export default Header;
