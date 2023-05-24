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
import { SelectList } from 'react-native-dropdown-select-list';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import HeaderPatient from '../../components/HeaderPatient';

import CustomButton from '../../components/CustomButton';
import DayDateMaker from '../../components/API/DayDateMaker';
import timeformatter from '../../components/API/timeformatter';
import apiConfig from '../../components/API/apiConfig';
import clinicMaker from '../../components/API/ClincMaker';
import DoctorBasicDetails from '../../components/DoctorBasicDetails';

export default function SelectSlotsP() {
  const [selectedPDate, setSelectedPDate] = useState();
  const [selectedPSlotTime, setSelectedPSlotTime] = useState();
  const [selectedPSlotEndTime, setSelectedPSlotEndTime] = useState();
  const [selectedPSlotId, setselectedPSlotId] = useState();
  const [PDays, setPDays] = useState();
  const [PSlots, setPSlots] = useState();

  const [ClinicDet, setClinicDet] = useState([]);
  const [clinicId, setclinicId] = useState();
  const [clinicName, setclinicName] = useState('');

  const [DocDet, setDocDet] = useState(); // Previous page data
  const [DocObj, setDocObj] = useState(); // Service response data
  const [patientDet, setpatientDet] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('bookSlot'));
      const y = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      // console.log(x);

      setDocDet(x);
      setpatientDet(y);
      /* console.log(
        `${apiConfig.baseUrl}/patient/doctor/details?doctorId=${x.doctorId}&patientId=${y.patientId}`
      ); */
      axios
        .get(
          `${apiConfig.baseUrl}/patient/doctor/details?doctorId=${x.doctorId}&patientId=${y.patientId}`
        )
        .then((response) => {
          console.log('\n\nDoctor Details\n\n', response.data);
          if (response.status === 200) setDocObj(response.data);
        })
        .catch((error) => {
          Alert.alert('Error Fetching', `${error}`);
        });
      axios
        .get(`${apiConfig.baseUrl}/slot/clinic/details?doctorId=${x.doctorId}`)
        .then((response) => {
          // console.log(response.data);
          if (response.status === 200) setClinicDet(clinicMaker(response.data));
        })
        .catch((error) => {
          Alert.alert('Error in geting clinic', `${error}`);
        });
    };
    getData();
  }, []);

  useEffect(() => {
    const getClinicDays = async () => {
      axios
        .get(
          `${apiConfig.baseUrl}/slot/pslot/dates?doctorId=${DocDet.doctorId}&clinicId=${clinicId}`
        )
        .then((response) => {
          if (response.status === 200) {
            setPDays(DayDateMaker(response.data));
          }
        })
        .catch((error) => {
          Alert.alert('Error', `${error}`);
        });
    };

    if (clinicName !== '') getClinicDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicName]);

  useEffect(() => {
    const getPslots = async () => {
      axios
        .get(
          `${apiConfig.baseUrl}/slot/pslots/available?date=${selectedPDate}&doctorId=${DocDet.doctorId}&clinicId=${clinicId}`
        )
        .then((response) => {
          if (response.status === 200) setPSlots(response.data);
        })
        .catch((error) => {
          Alert.alert('Error', `${error}`);
        });
    };
    if (!isEmpty(selectedPDate)) getPslots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPDate]);

  const renderPDays = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedPDate === item.date ? '#2b8ada' : '#e8f0fe',
        padding: 10,
        margin: 3,
        borderRadius: 5,
        flexDirection: 'column',
        alignItems: 'center',
      }}
      onPress={() => {
        setSelectedPDate(item.date);
        setselectedPSlotId(null);
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: selectedPDate === item.date ? 'white' : 'black',
        }}
      >
        {dayjs(item.date).format('DD-MMM-YY')}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: selectedPDate === item.date ? 'white' : 'black',
        }}
      >
        {dayjs(item.date).format('dddd')}
      </Text>
    </TouchableOpacity>
  );
  const renderPSlots = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedPSlotId === item.slotId ? '#2b8ada' : '#e8f0fe',
        padding: 10,
        margin: 5,
        borderRadius: 5,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
      }}
      onPress={() => {
        setselectedPSlotId(item.slotId);
        // setslots(item.slots);
        setSelectedPSlotEndTime(item.endTime);
        setSelectedPSlotTime(item.startTime);
      }}
    >
      <Text
        style={{
          fontSize: 10,
          color: selectedPSlotId === item.slotId ? 'white' : 'black',
        }}
      >
        {timeformatter(item.startTime)}
        {' - '} {timeformatter(item.endTime)}
      </Text>
      {/* <Text
          style={{
            fontSize: 12,
            color: selectedPDate == item.date ? 'white' : 'black',
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
          {/* Top */}
          <DoctorBasicDetails DocDet={DocDet} />

          <View style={{ width: '95%', alignSelf: 'center' }}>
            {/* Clinic Selection */}
            <View
              style={{
                backgroundColor: 'white',
                width: '95%',
                alignSelf: 'center',
                borderRadius: 10,
              }}
            >
              <View style={{ flexDirection: 'column' }}>
                <Text style={[styles.subLabel, { width: '100%' }]}>Select Clinic</Text>
                <SelectList
                  placeholder={' '}
                  setSelected={(val) => {
                    setclinicName(val);
                    for (let i = 0; i < ClinicDet.length; i += 1) {
                      if (val === ClinicDet[i].value) {
                        // console.log(ClinicDet[i].key);
                        setclinicId(ClinicDet[i].key);
                        break;
                      }
                    }
                  }}
                  // onSelect={setAddress}
                  data={ClinicDet}
                  save="value"
                  boxStyles={{
                    width: '90%',
                    alignSelf: 'center',
                    backgroundColor: '#e8f0fe',
                    borderWidth: 0,
                    borderRadius: 5,
                    marginVertical: 10,
                  }}
                  dropdownItemStyles={{}}
                  dropdownStyles={{
                    backgroundColor: 'white',
                    width: '90%',
                    alignSelf: 'center',
                  }}
                  dropdownTextStyles={{ color: '#2b8ada', fontWeight: 'bold' }}
                  badgeStyles={{ backgroundColor: '#2b8ada' }}
                />
              </View>
            </View>

            {/* Date Label */}
            {clinicName !== '' && (
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

                {PDays !== '' ? (
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
                      data={PDays}
                      renderItem={renderPDays}
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
            )}

            {/* Slots Label */}
            {!isEmpty(PSlots) && (
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
                {PSlots !== '' ? (
                  <View
                    style={{
                      alignSelf: 'center',
                      width: '75%',
                      flexDirection: 'row',
                      marginVertical: 10,
                      backgroundColor: 'white',
                    }}
                  >
                    <FlatList
                      data={PSlots}
                      renderItem={renderPSlots}
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

        {!isEmpty(clinicName) && !isEmpty(selectedPSlotId) && !isEmpty(selectedPDate) ? (
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
                const slotId = selectedPSlotId;
                let flag = 0;
                await axios
                  .post(
                    `${apiConfig.baseUrl}/patient/slot/prebook?consultation=P_CONSULTATION` +
                      `&slotId=${slotId}&userId=${patientDet.patientId}`
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
                  Alert.alert(
                    'Confirm Booking',
                    `Are you sure you want to book an appointment?\n` +
                      `\nClinic:- ${clinicName}` +
                      `\nOn Date:- ${dayjs(selectedPDate).format(
                        'DD MMM, YYYY'
                      )}\nFrom:- ${timeformatter(selectedPSlotTime)}\nTo:-${timeformatter(
                        selectedPSlotEndTime
                      )}\nMode:- P_CONSULTATION`,
                    [
                      {
                        text: 'Yes',
                        onPress: async () => {
                          const x = {
                            clinicId,
                            consultationType: 'PHYSICAL',
                            doctorObj: DocObj,
                            doctorDet: DocDet,
                            mode: 'PHYSICAL',
                            slotDate: selectedPDate,
                            slotId: selectedPSlotId,
                            slotStartTime: selectedPSlotTime,
                            slotEndTime: selectedPSlotEndTime,
                          };
                          await AsyncStorage.setItem('ConfirmBookingDoctor', JSON.stringify(x));
                          navigation.navigate('ConfirmBooking');
                        },
                      },
                      {
                        text: 'No',
                        onPress: async () => {
                          const getSlotId = selectedPSlotId;
                          axios
                            .delete(
                              `${apiConfig.baseUrl}/patient/slot/prebooked/delete?consultation=P_CONSULTATION` +
                                `&slotId=${getSlotId}`
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
});
