import React, { useState, useEffect } from 'react';
import {
  Alert,
  useWindowDimensions,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import HeaderPatient from '../../components/HeaderPatient';

import CustomButton from '../../components/CustomButton';
import DayDateMaker from '../../components/API/DayDateMaker';
import timeformatter from '../../components/API/timeformatter';
import apiConfig from '../../components/API/apiConfig';
import DoctorBasicDetails from '../../components/DoctorBasicDetails';

export default function SelectSlotsE() {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedSlotTime, setSelectedSlotTime] = useState();
  const [selectedSlotEndTime, setSelectedSlotEndTime] = useState();
  const [consultationType, setconsultationType] = useState();
  const [selectedSlotId, setselectedSlotId] = useState();
  const [EDays, setEDays] = useState([]);
  const [ESlots, setESlots] = useState();
  const [DocDet, setDocDet] = useState(); // Previous page data
  const [DocObj, setDocObj] = useState(); // Service response data
  const [patientDet, setpatientDet] = useState();
  const [isReschedule, setisReschedule] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('bookSlot'));
      const y = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      setpatientDet(y);
      setDocDet(x);
      if (!isEmpty(x.isReschedule)) {
        setisReschedule(true);
      }
      // console.log(
      //   `${apiConfig.baseUrl}/patient/doctor/details?doctorId=${x.doctorId}&patientId=${y.patientId}`
      // );
      axios
        .get(
          `${apiConfig.baseUrl}/patient/doctor/details?doctorId=${x.doctorId}&patientId=${y.patientId}`
        )
        .then((response) => {
          // console.log('\n\nDoctor Details\n\n', response.data);
          if (response.status === 200) setDocObj(response.data);
        })
        .catch((error) => {
          Alert.alert('Error Fetching', `${error}`);
        });

      axios
        .get(`${apiConfig.baseUrl}/slot/eslot/dates?doctorId=${x.doctorId}`)
        .then((response) => {
          if (response.status === 200) {
            setEDays(DayDateMaker(response.data));
          }
        })
        .catch((error) => {
          Alert.alert('Error EDays', `${error}`);
        });
    };

    getData();

    // console.log(layout.width);
  }, []);
  useEffect(() => {
    const getESlots = async () => {
      axios
        .get(
          `${apiConfig.baseUrl}/slot/eslot/available?date=${selectedDate}&doctorId=${DocDet.doctorId}`
        )
        .then((response) => {
          if (response.status === 200) {
            setESlots(response.data);
          }
        })
        .catch((error) => {
          Alert.alert('Error Eslots', `${error}`);
        });
    };
    if (!isEmpty(selectedDate)) getESlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const renderDays = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.SlotDate,
        {
          backgroundColor: selectedDate === item.date ? '#2b8ada' : '#e8f0fe',
        },
      ]}
      onPress={() => {
        setSelectedDate(item.date);
        setselectedSlotId(null);
      }}
    >
      <Text
        style={[
          {
            fontSize: 12,
            color: selectedDate === item.date ? 'white' : 'black',
          },
        ]}
      >
        {dayjs(item.date).format('DD MMM, YYYY')}
      </Text>
      <Text
        style={[
          {
            fontSize: 12,
            color: selectedDate === item.date ? 'white' : 'black',
          },
        ]}
      >
        {dayjs(item.date).format('dddd')}
      </Text>
    </TouchableOpacity>
  );
  const renderSlots = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.SlotTime,
        {
          backgroundColor: selectedSlotId === item.slotId ? '#2b8ada' : '#e8f0fe',
          flexDirection: 'row',
        },
      ]}
      onPress={() => {
        // console.log(item);
        setselectedSlotId(item.slotId);
        // setslots(item.slots);
        setSelectedSlotTime(item.startTime);
        setSelectedSlotEndTime(item.endTime);
        setconsultationType(item.typeOfEConsultation);
      }}
    >
      <FAIcons
        name={item.typeOfEConsultation === 'PHONE_CALL' ? 'phone-alt' : 'video'}
        size={15}
        color={selectedSlotId === item.slotId ? 'white' : '#2b8ada'}
        style={{ marginRight: 5 }}
      />
      <Text
        style={[
          {
            fontSize: 10,
            color: selectedSlotId === item.slotId ? 'white' : 'black',
          },
        ]}
      >
        {timeformatter(item.startTime)}
        {' - '} {timeformatter(item.endTime)}
      </Text>
      {/* <Text
          style={{
            fontSize: 12,
            color: selectedDate == item.date ? 'white' : 'black',
          }}>
          {item.endTime}
        </Text> */}
    </TouchableOpacity>
  );

  const layout = useWindowDimensions();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <SafeAreaView
        style={{
          backgroundColor: '#2B8ADA',
          width: '100%',
        }}
      >
        <ScrollView
          style={{
            width: '100%',
            alignSelf: 'center',
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
        >
          <HeaderPatient showMenu={false} title="Select Slots" />
          <DoctorBasicDetails DocDet={DocDet} />
          {/* Body */}
          <View style={{ width: '95%', alignSelf: 'center' }}>
            {/* Date Label */}
            <View
              style={{
                backgroundColor: 'white',
                width: '95%',
                alignSelf: 'center',
                marginVertical: 15,
                borderRadius: 10,
              }}
            >
              <Text style={[styles.subLabel, { width: '100%' }]}>Select Date</Text>

              {EDays !== '' ? (
                <View
                  style={{
                    flex: 1,
                    alignSelf: 'center',
                    flexDirection: 'column',
                    marginVertical: 10,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <FlatList
                    data={EDays}
                    renderItem={renderDays}
                    keyExtractor={(item) => item.date}
                    numColumns={Math.floor(layout.width / 125)}
                    style={{
                      alignSelf: 'center',
                    }}
                    scrollEnabled={false}
                  />
                </View>
              ) : (
                <Text
                  style={{
                    marginVertical: 20,
                    alignSelf: 'center',
                    fontSize: 13,
                    color: 'black',
                  }}
                >
                  For next 7 days all slots are booked.
                </Text>
              )}
            </View>

            {/* Slots Label */}
            {!isEmpty(ESlots) && (
              <View
                style={{
                  backgroundColor: 'white',
                  width: '95%',
                  alignSelf: 'center',
                  marginVertical: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={[styles.subLabel, { width: '100%' }]}>Select Slot</Text>
                {ESlots !== '' ? (
                  <View
                    style={{
                      alignSelf: 'center',
                      width: '85%',
                      flexDirection: 'row',
                      marginVertical: 10,
                      backgroundColor: 'white',
                    }}
                  >
                    <FlatList
                      data={ESlots}
                      renderItem={renderSlots}
                      keyExtractor={(item) => item.slotId}
                      numColumns={Math.floor(layout.width / 150)}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                ) : (
                  <Text
                    style={{
                      marginVertical: 20,
                      alignSelf: 'center',
                      fontSize: 13,
                      color: 'black',
                    }}
                  >
                    All Slots are booked.
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
        {!isEmpty(selectedSlotId) && !isEmpty(selectedDate) ? (
          <View
            style={{
              backgroundColor: '#2B8ADA',
              height: 45,
              flexDirection: 'row',
            }}
          >
            <CustomButton
              text="PROCEED"
              textstyle={{ color: '#2B8ADA', fontSize: 12, fontWeight: 'bold' }}
              style={{
                position: 'absolute',
                right: 20,
                alignSelf: 'center',
                backgroundColor: 'white',
                width: 100,
                padding: 3,
              }}
              onPress={async () => {
                // slot prebook
                const mode = 'E_CONSULTATION';
                const slotId = selectedSlotId;
                let flag = 0;
                await axios
                  .post(
                    `${apiConfig.baseUrl}/patient/slot/prebook?consultation=${mode}&slotId=${slotId}&userId=${patientDet.patientId}`
                  )
                  .then((response) => {
                    if (response.status === 200) {
                      flag = 1;
                    } else {
                      Alert.alert(
                        'Sorry',
                        'This Slot is under transaction.\nPlease select another time slot.'
                      );
                    }
                  })
                  .catch(() => {
                    Alert.alert(
                      'Sorry',
                      'This Slot is under transaction.\nPlease select another time slot.'
                    );
                  });

                if (flag === 1) {
                  const date = selectedDate;
                  const time = selectedSlotTime;
                  const endtime = selectedSlotEndTime;
                  // const slotId = selectedSlotId;

                  // TODO: Check clinicName variable
                  Alert.alert(
                    'Confirm Booking',
                    `Are you sure you want to book an appointment?\n${
                      mode === 'P_CONSULTATION' ? `\nClinic:- ${'clinicName'}` : ``
                    }\nOn Date:- ${dayjs(date).format('DD MMM, YYYY')}\nFrom:- ${timeformatter(
                      time
                    )}\nTo:-${timeformatter(endtime)}\nMode:- ${
                      consultationType === 'PHONE_CALL' ? `Phone Call` : `Video Call`
                    }`,
                    [
                      {
                        text: 'Yes',
                        onPress: async () => {
                          if (isReschedule) {
                            const temp = {
                              consultationId: DocDet.consultationId,
                              consultationType,
                              doctorEmail: DocDet.doctorEmail,
                              doctorId: DocDet.doctorId,
                              doctorName: DocDet.doctorName,
                              newEndTime: selectedSlotEndTime.substring(0, 5),
                              newSlotDate: selectedDate,
                              newSlotId: selectedSlotId,
                              newStartTime: selectedSlotTime.substring(0, 5),
                              oldEndTime: DocDet.slotEndTime.substring(0, 5),
                              oldSlotDate: DocDet.slotDate,
                              oldStartTime: DocDet.slotStartTime.substring(0, 5),
                              patientEmail: patientDet.email,
                              patientId: patientDet.patientId,
                              patientName: patientDet.patientName,
                            };
                            // console.log('=====RESCHEDULING SLOT======', temp);

                            axios
                              .post(`${apiConfig.baseUrl}/patient/consultation/reschedule`, temp)
                              .then((response) => {
                                if (response.status === 200) {
                                  Alert.alert(
                                    'Done',
                                    `Your appointment with ${
                                      DocDet.doctorName
                                    } has been rescheduled to\nDate:- ${dayjs(selectedDate).format(
                                      'DD MMM, YYYY'
                                    )}\nFrom:- ${timeformatter(
                                      selectedSlotTime
                                    )}\nTo:-  ${timeformatter(selectedSlotEndTime)}\nMode :- ${
                                      consultationType === 'PHONE_CALL'
                                        ? `Phone Call`
                                        : `Video Call`
                                    }`
                                  );
                                  navigation.goBack();
                                }
                              })
                              .catch((error) => {
                                Alert.alert('Error', `Please try again later.\n${error}`);
                              });
                          } else {
                            const x = {
                              consultationType,
                              doctorObj: DocObj,
                              doctorDet: DocDet,
                              mode: 'E_CONSULTATION',
                              slotDate: selectedDate,
                              slotId: selectedSlotId,
                              slotStartTime: selectedSlotTime,
                              slotEndTime: selectedSlotEndTime,
                            };
                            await AsyncStorage.setItem('ConfirmBookingDoctor', JSON.stringify(x));
                            navigation.navigate('ConfirmBooking');
                          }
                        },
                      },
                      {
                        text: 'No',
                        onPress: async () => {
                          axios
                            .delete(
                              `${apiConfig.baseUrl}/patient/slot/prebooked/delete?consultation=E_CONSULTATION` +
                                `&slotId=${selectedSlotId}`
                            )
                            .then((response) => {
                              if (response.status === 200) {
                                console.log(response.data);
                              }
                            })
                            .catch((error) => {
                              Alert.alert('Error', `Error in Delete PreBook:-\n ${error}`);
                            });
                        },
                        style: 'cancel',
                      },
                    ]
                  );
                }
              }}
            />
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
  subLabel: {
    width: '95%',
    alignSelf: 'center',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#2b8ada',
    color: 'white',
    borderBottomColor: '#2b8ada',
    borderBottomWidth: 1,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  SlotDate: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  SlotTime: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
});
