/* eslint-disable react/prop-types */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert,
  View,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SelectList } from 'react-native-dropdown-select-list';
import dayjs from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// icons
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { Button, Checkbox, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import patientFemale from '../../../assets/patient_female.png';
import patientImg from '../../../assets/patient.png';
import apiConfig from '../../components/API/apiConfig';
import logoutAction from '../../components/logoutAction';
import theme from '../../styles/theme';

export default function PatientRegistration() {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [editName, seteditName] = useState(true);
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setpincode] = useState('');
  const [dob, setdob] = useState('');
  const [age, setage] = useState('');
  const [mobno, setmobno] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [complete, setcomplete] = useState(0);
  const [patientId, setpatientId] = useState(null);

  const [checkTerms, setCheckTerms] = useState(false);

  const window = useWindowDimensions();
  const [termsView, setTermsView] = useState(false);
  // geninfo
  // eslint-disable-next-line no-unused-vars
  const [showGenInfo, setShowGenInfo] = useState(true);

  // Medical Registration Feild
  const [showOtherInfo, setshowOtherInfo] = useState(false);
  const [BloodGroup, setBloodGroup] = useState('');
  const [Occupation, setOccupation] = useState('');
  const [Weight, setWeight] = useState('');
  const [Height, setHeight] = useState('');

  const navigation = useNavigation();

  const dataGender = [
    { key: 'Male', value: 'Male' },
    { key: 'Female', value: 'Female' },
    { key: 'Other', value: 'Other' },
  ];
  const dataTitle = [
    { key: 'Mr.', value: 'Mr.' },
    { key: 'Mrs.', value: 'Mrs.' },
    { key: 'Ms.', value: 'Ms.' },
  ];
  const dataBloodGroup = [
    { key: 'A+', value: 'A+' },
    { key: 'A-', value: 'A-' },
    { key: 'B+', value: 'B+' },
    { key: 'B-', value: 'B-' },
    { key: 'O+', value: 'O+' },
    { key: 'O-', value: 'O-' },
    { key: 'AB+', value: 'AB+' },
    { key: 'AB-', value: 'AB-' },
  ];

  useEffect(() => {
    const onLoadSetData = async () => {
      setmobno(await AsyncStorage.getItem('mobileNumber'));
      const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      if (x != null) {
        setName(x.patientName);
        setpatientId(x.patientId);
        seteditName(false);
      }
    };

    onLoadSetData();
  }, []);

  // progress bar
  useEffect(() => {
    let c = 0;
    if (title !== '') ++c;
    if (name !== '') ++c;
    if (gender !== '') ++c;
    if (city !== '') ++c;
    if (pincode !== '') ++c;
    if (dob !== '') ++c;
    setcomplete(c / 6);
  }, [title, name, gender, city, pincode, dob]);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showDatePicker = () => {
    // console.log("Pressed button");

    setDatePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    setdob(date);
    console.log(dayjs().diff(dayjs(date), 'year'));
    setage(dayjs().diff(dayjs(date), 'year'));

    hideDatePicker();
  };

  const postData = async () => {
    setisLoading(true);

    const token = await AsyncStorage.getItem('fcmToken');

    const p = {
      age,
      allowWhatsAppNotification: false,
      city,
      dob: dayjs(dob).format('YYYY-MM-DD'),
      firebaseToken: token,
      gender,
      locationPermissions: 'DONT_ALLOW',
      mobileNumber: mobno,
      patientPhoto: 0,
      patientName: `${title} ${name}`,
      pincode,
      termsAndConditions: true,
      whatsAppNumber: mobno,
    };
    DeviceInfo.getIpAddress().then((ip) => {
      p.phoneIp = ip;
    });
    if (BloodGroup !== '') p.bloodGroup = BloodGroup;
    if (Occupation !== '') p.occupation = Occupation;
    if (Weight !== '') p.weight = Weight;
    if (Height !== '') p.height = Height;
    if (email !== '') p.email = email;

    let flag = 0;
    let patient = null;

    if (editName) {
      console.log('=========== NEW USER ================\n', p);
      await axios
        .post(`${apiConfig.baseUrl}/patient/save`, p)
        .then((response) => {
          if (response.status === 200) {
            patient = response.data;
            flag = 1;
          }
        })
        .catch((error) => {
          setisLoading(false);
          console.log(error);
          Alert.alert('Error', `${error}`);
        });
    } else {
      p.patientId = patientId;
      console.log('=========== SHARED USER ================\n', p);
      await axios
        .post(`${apiConfig.baseUrl}/patient/update`, p)
        .then((response) => {
          if (response.status === 200) {
            patient = response.data;
            flag = 1;
          }
        })
        .catch((error) => {
          setisLoading(false);
          console.log(error);
          Alert.alert('Error', `${error}`);
        });
    }

    console.log(patient);

    if (flag === 1) {
      await axios
        .post(`${apiConfig.baseUrl}/patient/profile/complete?patientId=${patient.patientId}`)
        .then(async (response) => {
          if (response.status === 200) {
            setisLoading(false);
            patient.profileComplete = true;
            await AsyncStorage.setItem('UserPatientProfile', JSON.stringify(patient));
            Alert.alert('Welcome to TrustHeal', 'Your details have been saved successfully.');
            // TODO: Remove stringify
            navigation.navigate('PatientHome', {
              patientObj: JSON.stringify(patient),
            });
          }
        })
        .catch((error) => {
          setisLoading(false);
          Alert.alert('Error in Profile Complete', `${error}`);
        });
    }
  };

  const onSubmit = () => {
    if (complete === 1) {
      if (checkTerms) postData();
      else
        Alert.alert(
          'Terms and Condition',
          'Please check Terms and Conditions and Privacy Policy before continuing'
        );
    } else if (title === '')
      Alert.alert('Incomplete Details', 'Please select title before continuing.');
    else if (name === '') Alert.alert('Incomplete Details', 'Please enter name before continuing.');
    else if (gender === '')
      Alert.alert('Incomplete Details', 'Please select gender before continuing.');
    else if (city === '')
      Alert.alert('Incomplete Details', 'Please enter city name before continuing.');
    else if (dob === '')
      Alert.alert('Incomplete Details', 'Please select date of birth before continuing.');
  };

  const onLogout = async () => {
    await logoutAction(navigation);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <SafeAreaView
        style={{
          backgroundColor: '#E8F0FE',
          width: '100%',
        }}
      >
        <ScrollView
          style={{
            width: '90%',
            alignSelf: 'center',
            marginVertical: 10,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Bar */}
          <View
            style={{
              flex: 1,
              // elevation: 20,
              backgroundColor: 'white',
              width: '90%',
              height: 15,
              alignSelf: 'center',
              borderRadius: 10,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                width: window.width * complete * 0.85,
                height: 15,
                borderRadius: 10,
                backgroundColor: '#2b8ada',
              }}
            >
              <Text
                style={{
                  flex: 1,
                  color: 'white',
                  fontSize: 10,
                  alignSelf: 'center',
                }}
              >
                {Math.round(complete * 100)}%
              </Text>
            </View>
          </View>

          {/* Image */}
          <View>
            <View
              style={{
                borderWidth: 5,
                borderColor: 'white',
                backgroundColor: 'white',
                width: 100,
                height: 100,
                borderRadius: 150,
                alignSelf: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}
            >
              <Image
                style={{
                  alignSelf: 'center',
                  width: 75,
                  height: 75,
                  marginVertical: 5,
                }}
                source={gender === 'Female' ? patientFemale : patientImg}
              />
            </View>
          </View>

          {/* General Info Label */}
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                {
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  borderRadius: 10,
                  padding: 5,
                  marginVertical: 10,
                },
                showGenInfo ? { borderRadius: 0, marginBottom: 0 } : null,
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showGenInfo ? { borderBottomWidth: 0.5, borderBottomColor: '#707070' } : null,
                ]}
                onPress={() => {
                  // setShowGenInfo(!showGenInfo);
                }}
              >
                <FAIcon
                  name="address-card"
                  size={15}
                  color={showGenInfo ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text
                  style={[
                    styles.label,
                    { width: '85%' },
                    showGenInfo ? { color: '#2B8ADA' } : null,
                  ]}
                >
                  General Information
                </Text>

                <FAIcon
                  name={showGenInfo ? 'chevron-down' : 'chevron-right'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                  color={showGenInfo ? '#2B8ADA' : 'gray'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* General Info Body */}
          {showGenInfo && (
            <View>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 10,
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: 'column' }}>
                  {/* Title and FullName */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginBottom: 8,
                    }}
                  >
                    {/* Title Sub-Label */}
                    <View style={{ flex: 0.3, marginRight: '5%', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.inputLabel}>Title</Text>
                        <Text style={{ color: 'red' }}>*</Text>
                      </View>

                      <SelectList
                        search={false}
                        placeholder={' '}
                        setSelected={(val) => setTitle(val)}
                        data={dataTitle}
                        save="value"
                        boxStyles={[
                          {
                            padding: 0,
                            borderWidth: 0,
                            backgroundColor: '#E8F0FE',
                          },
                        ]}
                        dropdownStyles={{
                          backgroundColor: 'white',
                        }}
                        dropdownTextStyles={{
                          color: '#2b8ada',
                          fontWeight: 'bold',
                        }}
                        badgeStyles={{ backgroundColor: '#2b8ada' }}
                      />
                    </View>

                    {/* Full Name Sub-Label */}
                    <View style={{ flex: 0.6 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <Text style={{ color: 'red' }}>*</Text>
                      </View>
                      <TextInput
                        style={[
                          styles.textInput,
                          editName
                            ? { backgroundColor: '#E8F0FE' }
                            : { backgroundColor: '#d0e0fc' },
                        ]}
                        placeholderTextColor="black"
                        maxLength={50}
                        editable={editName}
                        onChangeText={(text) => setName(text)}
                        value={name}
                      />
                    </View>
                  </View>

                  {/* Email */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flex: 0.9, justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.inputLabel}>Email</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                        placeholderTextColor="black"
                        maxLength={50}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  {/* DOB and Gender */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flex: 0.45, marginRight: '5%' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.inputLabel}>Date Of Birth</Text>
                        <Text style={{ color: 'red' }}>*</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <TextInput
                          style={[styles.textInput, { backgroundColor: '#E8F0FE', flex: 1 }]}
                          placeholderTextColor="black"
                          value={dob !== '' ? dayjs(dob).format('DD-MM-YYYY') : ''}
                          editable={false}
                        />
                        <FAIcon
                          name="calendar-alt"
                          color="gray"
                          size={16}
                          style={{
                            position: 'absolute',
                            right: '5%',
                            alignSelf: 'center',
                          }}
                          onPress={() => {
                            showDatePicker();
                          }}
                        />
                        <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          mode="date"
                          display="spinner"
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                          maximumDate={new Date()}
                          minimumDate={new Date('1940-01-01')}
                        />
                      </View>
                    </View>

                    <View style={{ flex: 0.45 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.inputLabel}>Gender</Text>
                        <Text style={{ color: 'red' }}>*</Text>
                      </View>
                      <SelectList
                        setSelected={(val) => setGender(val)}
                        data={dataGender}
                        placeholder={' '}
                        defaultOption={gender}
                        save="value"
                        boxStyles={[
                          {
                            backgroundColor: 'white',
                            borderWidth: 0,
                          },
                          { backgroundColor: '#E8F0FE' },
                        ]}
                        dropdownStyles={{ backgroundColor: 'white' }}
                        dropdownTextStyles={{
                          color: '#2b8ada',
                          fontWeight: 'bold',
                        }}
                        badgeStyles={{ backgroundColor: '#2b8ada' }}
                      />
                    </View>
                  </View>

                  {/* City and PIN */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flex: 0.45, marginRight: '5%' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.inputLabel}>City</Text>
                        <Text style={{ color: 'red' }}>*</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                        placeholderTextColor="black"
                        onChangeText={(text) => setCity(text)}
                        maxLength={50}
                        value={city}
                      />
                    </View>
                    <View style={{ flex: 0.45 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.inputLabel}>Pin Code</Text>
                        <Text style={{ color: 'red' }}>*</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                        placeholderTextColor="black"
                        maxLength={6}
                        keyboardType="number-pad"
                        onChangeText={(text) => setpincode(text)}
                        value={pincode}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Other Information Label */}
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                {
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  marginVertical: 10,
                  padding: 5,
                },
                showOtherInfo
                  ? {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      marginBottom: 0,
                    }
                  : null,
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showOtherInfo ? { borderBottomWidth: 0.5, borderBottomColor: '#707070' } : null,
                ]}
                onPress={() => {
                  if (!showOtherInfo) {
                    setshowOtherInfo(!showOtherInfo);
                  } else {
                    setshowOtherInfo(!showOtherInfo);
                  }
                }}
              >
                <FAIcon
                  name="info-circle"
                  size={15}
                  color={showOtherInfo ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text
                  style={[
                    styles.label,
                    { width: '85%' },
                    showOtherInfo ? { color: '#2B8ADA' } : null,
                  ]}
                >
                  Other Details (Optional)
                </Text>
                <FAIcon
                  name={showOtherInfo ? 'chevron-down' : 'chevron-right'}
                  color={showOtherInfo ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Other Information Body */}
          {showOtherInfo && (
            <View>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 10,
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: 'column' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginBottom: 5,
                    }}
                  >
                    <View style={{ flex: 0.45, marginRight: '5%' }}>
                      <Text style={[styles.inputLabel, { marginTop: 0 }]}>Blood Group</Text>
                      <SelectList
                        defaultOption={BloodGroup}
                        placeholder={' '}
                        setSelected={(val) => setBloodGroup(val)}
                        data={dataBloodGroup}
                        save="value"
                        boxStyles={[
                          {
                            backgroundColor: '#E8F0FE',
                            borderWidth: 0,
                            marginVertical: 5,
                          },
                        ]}
                        dropdownStyles={{ backgroundColor: 'white' }}
                        dropdownTextStyles={{
                          color: '#2b8ada',
                          fontWeight: 'bold',
                        }}
                        badgeStyles={{ backgroundColor: '#2b8ada' }}
                      />
                    </View>
                    <View style={{ flex: 0.45 }}>
                      <Text style={[styles.inputLabel, { marginTop: 0 }]}>Occupation</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                        placeholderTextColor="black"
                        value={Occupation}
                        maxLength={30}
                        onChangeText={(text) => setOccupation(text)}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginBottom: 5,
                    }}
                  >
                    <View style={{ flex: 0.45, marginRight: '5%' }}>
                      <Text style={styles.inputLabel}>Height (in cm)</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                        placeholderTextColor="black"
                        value={Height}
                        maxLength={3}
                        keyboardType="number-pad"
                        onChangeText={(text) => setHeight(text)}
                      />
                    </View>
                    <View style={{ flex: 0.45 }}>
                      <Text style={styles.inputLabel}>Weight (in kg)</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                        placeholderTextColor="black"
                        value={Weight}
                        maxLength={3}
                        keyboardType="number-pad"
                        onChangeText={(text) => setWeight(text)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Accept Privacy Policy */}
          <HStack space={2} py={4} ml={2} alignSelf="center">
            <Checkbox
              value="agree"
              accessibilityLabel="I Agree to Privacy Policy"
              isChecked={checkTerms}
              onChange={() => setCheckTerms((prev) => !prev)}
              _checked={{ bg: '#2b8ada', borderColor: '#2b8ada' }}
              _text={{ color: 'text.primary', fontWeight: 500 }}
              bg="#e8f0fe"
            />
            <Text fontSize={12} fontWeight={600} color="#636464">
              I Agree to{' '}
              <Text style={[styles.textLink]} onPress={() => setTermsView(true)}>
                Privacy Policy
              </Text>
            </Text>
          </HStack>

          {/* Buttons */}
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              marginVertical: 16,
              width: '95%',
              justifyContent: 'space-evenly',
            }}
          >
            <Button
              onPress={() => onLogout()}
              variant="outline"
              borderColor="secondary.default"
              size="md"
              mr={4}
              w="48%"
              _text={{
                fontSize: 'sm',
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
              _pressed={{
                bg: 'blue.100',
              }}
              borderRadius={4}
              isDisabled={isLoading}
            >
              Logout
            </Button>

            <Button
              onPress={() => onSubmit()}
              bg="secondary.default"
              size="md"
              w="48%"
              _text={{
                fontSize: 'sm',
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              }}
              _pressed={{
                bg: '#4495D8',
              }}
              color="text.secondary"
              shadow={1}
              borderRadius={4}
              isLoading={isLoading}
              isLoadingText={isLoading && 'Please Wait...'}
            >
              Submit
            </Button>
          </View>
        </ScrollView>

        {termsView && (
          <Modal
            animationType="slide"
            transparent
            visible={termsView}
            onRequestClose={() => {
              setTermsView(!termsView);
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
                    width: '90%',
                    alignSelf: 'center',
                    padding: 25,
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
                    Privacy Policy
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
                      setTermsView(false);

                      // setZoom(1);
                    }}
                  />
                </View>
                <ScrollView
                  style={{
                    minHeight: 150,
                    width: '100%',
                    maxHeight: window.height - 200,
                  }}
                >
                  <View style={{ alignSelf: 'center', width: '90%' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.parStyles, { marginTop: 10 }]}>
                        Thank you for the trust you (defined below) have placed in TrustHeal Tech
                        Private Limited (‘TrustHeal’) having its registered office at B 59 LGF,
                        Sarvodaya Enclave, New Delhi - 110017. That is why we (TrustHeal) insist
                        upon the highest standards for secure transactions and customer information
                        privacy. Please read the following statement to learn about our (defined
                        below) information gathering and dissemination practices.
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.parStyles}>
                        TrustHeal is committed to respecting the privacy of every person who shares
                        information with it or whose information it receives. Your (defined below)
                        privacy is important to TrustHeal and we (defined below) strive to take care
                        and protect the information we (defined below) receive from you (defined
                        below) to the best of Our (defined below) ability.
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.parStyles}>
                        This Privacy Policy (“Privacy Policy”) applies to the collection, receipt,
                        storage, usage, processing, disclosure, transfer and protection
                        (“Utilization”) of your Personal Information (defined below) when You use
                        the TrustHeal website available at URL: www.TrustHeal.in (“Website”)
                        operated by TrustHeal or avail any Services offered by TrustHeal through the
                        Website or Application.
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.parStyles}>
                        The terms ‘You’ or ‘Your’ refer to you as the user (registered or
                        unregistered) of the Website, Application or Services and the terms ‘We’,
                        ‘Us” and ‘Our’ refer to TrustHeal.
                      </Text>
                    </View>
                    {/* CONSENT */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        CONSENT
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          1. You acknowledge that this Privacy Policy is a part of the Terms of Use
                          of the Website and the other Services, by accessing the Website or
                          Application or by otherwise providing Us Your Personal Information
                          Yourself or through a Primary User or by making use of the Services
                          provided by the Website or Application, You unconditionally signify Your
                          (i) assent to the Privacy Policy, and (ii) consent to the Utilisation of
                          your Personal Information in accordance with the provisions of this
                          Privacy Policy.
                        </Text>
                        <Text style={styles.parStyles}>
                          2. You acknowledge that You are providing Your Personal Information out of
                          Your free will. If You use the Services on behalf of someone else
                          (including but not limited to, Your child – minor or major or as a legal
                          representative of an individual with mental illness) or an entity (such as
                          Your employer), You represent that You are authorized by such individual
                          or entity to (i) accept this Privacy Policy on such individual’s or
                          entity’s behalf, and (ii) consent on behalf of such individual or entity
                          to Our collection, use and disclosure of such individual’s or entity’s
                          Personal Information as described in this Privacy Policy. Further, You
                          hereby acknowledge that the Utilization of Your Personal Information by
                          TRUSTHEAL is necessary for the purposes identified hereunder. You hereby
                          consent that the Utilization of any Personal Information in accordance
                          with the provisions of this Privacy Policy shall not cause any wrongful
                          loss to You.
                        </Text>
                        <Text style={styles.parStyles}>
                          3. YOU HAVE THE OPTION NOT TO PROVIDE US THE PERSONAL INFORMATION SOUGHT
                          TO BE COLLECTED. YOU WILL ALSO HAVE AN OPTION TO WITHDRAW YOUR CONSENT AT
                          ANY POINT, PROVIDED SUCH WITHDRAWAL OF THE CONSENT IS INTIMATED TO US IN
                          WRITING. If You do not provide Us Your Personal Information or if You
                          withdraw the consent to provide Us Your Personal Information at any point
                          in time, We shall have the option not to fulfill the purposes for which
                          the said Personal Information was sought and We may restrict You from
                          using the Website, Application or Services.
                        </Text>
                        <Text style={styles.parStyles}>
                          4. Our Website or Application are not directed at children and We do not
                          knowingly collect any Personal Information from children. Please contact
                          Us at
                          <Text
                            style={{
                              color: 'blue',
                              textDecorationLine: 'underline',
                              textDecorationColor: 'blue',
                            }}
                          >
                            contact@trustheal.in
                          </Text>{' '}
                          if You are aware that We may have inadvertently collected Personal
                          Information from a child, and We will delete that information as soon as
                          possible.
                        </Text>
                      </View>
                    </View>

                    {/* CHANGES TO THE PRIVACY POLICY */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        CHANGES TO THE PRIVACY POLICY
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          1. We reserve the right to update (change, modify, add and/or delete) this
                          Privacy Policy from time to time at our sole discretion. There is a tab at
                          the end of the Privacy Policy which indicates when the Privacy Policy was
                          last updated.
                        </Text>
                        <Text style={styles.parStyles}>
                          2. When We update Our Privacy Policy, we will intimate You of the
                          amendments on Your registered email ID or on the Website or Application.
                          Alternatively, TRUSTHEAL may cause Your account to be logged-off and make
                          Your subsequent account log-in conditional on acceptance of the Agreement.
                          If You do not agree to the amendments, please do not use the Website,
                          Application or Services any further.
                        </Text>
                      </View>
                    </View>
                    {/* PERSONAL INFORMATION COLLECTED */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        PERSONAL INFORMATION COLLECTED
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          In order to provide Services to You we might require You to voluntarily
                          provide Us certain information that personally identifies You or Secondary
                          Users related to You. You hereby consent to the collection of such
                          information by TRUSTHEAL. The information that We may collect from You,
                          about You or Secondary Users related to You, may include but are not
                          limited to, the following:
                        </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.parStyles}>
                            1. Patient/Caregiver/Doctor/Health Care Professional Name
                          </Text>
                          <Text style={styles.parStyles}>2. Birth date/age,</Text>
                          <Text style={styles.parStyles}>3. Blood group,</Text>
                          <Text style={styles.parStyles}>4. Gender</Text>
                          <Text style={styles.parStyles}>
                            5. Address (including country and pin/postal code),
                          </Text>
                          <Text style={styles.parStyles}>
                            6. Location information, including Your GPS location,
                          </Text>
                          <Text style={styles.parStyles}>7. Phone number/mobile number,</Text>
                          <Text style={styles.parStyles}>8. Email address,</Text>
                          <Text style={styles.parStyles}>
                            9. Physical, physiological and mental health condition, provided by You
                            and/or Your Healthcare Service provider or accessible from Your medical
                            records,
                          </Text>
                          <Text style={styles.parStyles}>
                            10. Personal medical records and history,
                          </Text>
                          <Text style={styles.parStyles}>
                            11. Valid financial information at time of purchase of product/Services
                            and/or online payment,
                          </Text>
                          <Text style={styles.parStyles}>12. TrustHeal Login ID and password,</Text>
                          <Text style={styles.parStyles}>
                            13. User details as provided at the time of registration or thereafter,
                          </Text>
                          <Text style={styles.parStyles}>
                            14. Records of interaction with TRUSTHEAL representatives,
                          </Text>
                          <Text style={styles.parStyles}>
                            15. Your usage details such as time, frequency, duration and pattern of
                            use, features used and the amount of storage used,
                          </Text>
                          <Text style={styles.parStyles}>
                            16. Master and transaction data and other data stored in Your user
                            account,
                          </Text>
                          <Text style={styles.parStyles}>
                            17. Internet Protocol address, browser type, browser language, referring
                            URL, files accessed, errors generated, time zone, operating system and
                            other visitor details collected in Our log files, the pages of our
                            Website or Application that You visit, the time and date of Your visit,
                            the time spent on those pages and other statistics {`("Log Data")`},
                          </Text>
                          <Text style={styles.parStyles}>
                            18. {`User's`} tracking Information such as, but not limited to the
                            device ID, Google Advertising ID and Android ID,
                          </Text>
                          <Text style={styles.parStyles}>
                            19. Any other information that is willingly shared by You. (collectively
                            referred to as “Personal Information”).
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* HOW WE COLLECT PERSONAL INFORMATION */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        HOW WE COLLECT PERSONAL INFORMATION
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          The methods by which We collect Your Personal Information include but are
                          not limited to the following:
                        </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.parStyles}>
                            1. When You register on Our Website or Application,
                          </Text>
                          <Text style={styles.parStyles}>
                            2. When You provide Your Personal Information to Us,
                          </Text>
                          <Text style={styles.parStyles}>
                            3. During the course of Services provided to You by Us,
                          </Text>
                          <Text style={styles.parStyles}>
                            4. When You use the features on Our Website or Application,
                          </Text>
                          <Text style={styles.parStyles}>
                            5. Through Your device, once You have granted permissions to Our
                            Application (discussed below),{' '}
                          </Text>
                          <Text style={styles.parStyles}>
                            6. Through HSP pursuant to consultation on the Website or the
                            Application,
                          </Text>
                          <Text style={styles.parStyles}>
                            7. By the use of cookies (also discussed below)
                          </Text>
                          <Text style={styles.parStyles}>
                            8. We collect information that Your browser/app sends whenever You visit
                            Our Website or Application, such as, the Log Data. In addition, We may
                            use third party services such as Pixel that collect, monitor and analyze
                            this. This information is kept completely secure.
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* USE OF PERSONAL INFORMATION */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        USE OF PERSONAL INFORMATION
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          YOUR PERSONAL INFORMATION MAY BE USED FOR VARIOUS PURPOSES INCLUDING BUT
                          NOT LIMITED TO THE FOLLOWING:
                        </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.parStyles}>1. To provide effective Services;</Text>
                          <Text style={styles.parStyles}>
                            2. To debug customer support related issues;
                          </Text>
                          <Text style={styles.parStyles}>
                            3. To operate and improve the Website or Application;
                          </Text>
                          <Text style={styles.parStyles}>
                            4. TO PERFORM ACADEMIC/STUDIES, CLINICAL OR OTHER RESEARCH AND ANALYSIS
                            FOR OUR UNDERSTANDING, INFORMATION, ANALYSIS, SERVICES AND TECHNOLOGIES
                            IN ORDER TO PROVIDE ALL USERS IMPROVED QUALITY OF CARE; AND ENSURING
                            THAT THE CONTENT AND ADVERTISING DISPLAYED ARE CUSTOMIZED TO YOUR
                            INTERESTS AND PREFERENCES;
                          </Text>
                          <Text style={styles.parStyles}>
                            5. To contact You via phone, SMS, email or third-party communication
                            services such as Whatsapp, etc. for appointments, technical issues,
                            payment reminders, obtaining feedback and other security announcements;
                          </Text>
                          <Text style={styles.parStyles}>
                            6. To send promotional and marketing emails from Us via SMS, email,
                            snail mail or third-party communication services such as WhatsApp,
                            Facebook etc.;
                          </Text>
                          <Text style={styles.parStyles}>
                            7. To advertise products and Services of TrustHeal and third parties;
                          </Text>
                          <Text style={styles.parStyles}>
                            8. To transfer information about You, if We are acquired by or merged
                            with another company;
                          </Text>
                          <Text style={styles.parStyles}>
                            9. To share with Our business partners for provision of specific
                            services You have ordered so as to enable them to provide effective
                            Services to You;
                          </Text>
                          <Text style={styles.parStyles}>
                            10. To administer or otherwise carry out Our obligations in relation to
                            any Agreement You have with Us;
                          </Text>
                          <Text style={styles.parStyles}>
                            11. To build Your profile on the Website or Application;
                          </Text>
                          <Text style={styles.parStyles}>
                            12. To respond to subpoenas, court orders, or legal process, or to
                            establish or exercise Our legal rights or defend against legal claims;
                          </Text>
                          <Text style={styles.parStyles}>
                            13. To investigate, prevent, or take action regarding illegal
                            activities, suspected fraud, violations of Our Terms of Use, breach of
                            Our agreement with You or as otherwise required by law;
                          </Text>
                          <Text style={styles.parStyles}>
                            14. TO AGGREGATE PERSONAL INFORMATION FOR RESEARCH FOR ACADEMIC/STUDIES,
                            CLINICAL OR OTHER RESEARCH, STATISTICAL ANALYSIS AND BUSINESS
                            INTELLIGENCE PURPOSES, AND TO SELL OR OTHERWISE TRANSFER SUCH RESEARCH,
                            STATISTICAL OR INTELLIGENCE DATA IN AN AGGREGATED AND/OR NON-PERSONALLY
                            IDENTIFIABLE FORM TO THIRD PARTIES AND AFFILIATES WITH A PURPOSE OF
                            PROVIDING SERVICES TO THE USERS OR FOR THE ADVANCEMENT OF SCIENTIFIC
                            KNOWLEDGE ABOUT HEALTH AND DISEASE (collectively referred to as
                            “Purpose(s)”).
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* SHARING AND TRANSFERRING OF PERSONAL INFORMATION */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        SHARING AND TRANSFERRING OF PERSONAL INFORMATION
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          1. You hereby consent and authorize Us to publish feedback obtained by You
                          on Our Website or Application.
                        </Text>
                        <Text style={styles.parStyles}>
                          2. {`User's`} financial information are transacted upon secure sites of
                          approved payment gateways which are digitally under encryption, thereby
                          providing the highest possible degree of care as per current technology.
                          However, User is advised to exercise discretion while saving the payment
                          details.
                        </Text>
                        <Text style={styles.parStyles}>
                          3. To the extent necessary to provide You with the Services, We may
                          provide Your Personal Information to third party contractors who work on
                          Our behalf to provide You with Services. These third-party contractors
                          have access to information needed to process Services only and shall not
                          use it for other purposes. Each third-party contractor, the data processor
                          to which We transfer Personal Information shall have to agree to comply
                          with the procedures and policies or put in place adequate measures on
                          their own for maintaining the confidentiality and secure Your Personal
                          Information.
                        </Text>
                        <Text style={styles.parStyles}>
                          4. You acknowledge that TRUSTHEAL may be obligated to by law to disclose
                          or transfer your Personal Information with Courts and Government agencies
                          in certain instances such as for verification of identity, or for
                          prevention, detection, investigation, prosecution, and punishment for
                          offences, or in compliance with laws such as intimation of diagnosis of an
                          epidemic disease. You hereby consent to disclosure or transfer of Your
                          Personal Information in these instances.
                        </Text>
                        <Text style={styles.parStyles}>
                          5. Notwithstanding the above, We are not responsible for the
                          confidentiality, security or distribution of Your Personal Information by
                          third-parties outside the scope of Our Agreement. Further, We shall not be
                          responsible for any breach of security or for any actions of any
                          third-parties or events that are beyond the reasonable control of Us
                          including but not limited to, acts of government, computer hacking,
                          unauthorized access to computer data and storage device, computer crashes,
                          breach of security and encryption, poor quality of Internet service or
                          telephone service of the User etc.
                        </Text>
                        <Text style={styles.parStyles}>
                          6. We may share Your Personal Information with Our other corporate and/or
                          associate entities and affiliates to (i) help detect and prevent identity
                          theft, fraud and other potentially illegal acts and cyber security
                          incidents, and (ii) help and detect co-related/related or multiple
                          accounts to prevent abuse of Our Services.
                        </Text>
                      </View>
                    </View>
                    {/* PERMISSIONS */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        PERMISSIONS
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          Once You download and install Our Application, You may be prompted to
                          grant certain permissions to allow the Application to perform certain
                          actions on Your device. These actions include permission to:
                        </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.parStyles}>
                            1. read/write/modify/delete data in relation to the Application on Your
                            {`device's`} storage;
                          </Text>
                          <Text style={styles.parStyles}>
                            2. view/access information relating to networks/access networks,
                            including permission to send and receive data through such
                            networks/access networks;{' '}
                          </Text>
                          <Text style={styles.parStyles}>
                            3. determine Your approximate location from sources like, but not
                            limited to, mobile towers and connected Wi-Fi networks;
                          </Text>
                          <Text style={styles.parStyles}>
                            4. determine Your exact location from sources such as, but not limited
                            to, GPS;
                          </Text>
                          <Text style={styles.parStyles}>
                            5. view/access device information, including but not limited to the
                            model number, IMEI number, operating system information and phone number
                            of Your device;
                          </Text>
                          <Text style={styles.parStyles}>
                            6. access device information including device identification number
                            required to send notification/push notifications.
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* USE OF COOKIES */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        USE OF COOKIES
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          1. Cookies are files with small amount of data, which may include an
                          anonymous unique identifier. Cookies are sent to You on the Website and/or
                          Application.
                        </Text>
                        <Text style={styles.parStyles}>
                          2. We may store temporary or permanent ‘cookies’ on Your computer/device
                          to store certain data (that is not Sensitive Personal Data or
                          Information). You can erase or choose to block these cookies from Your
                          computer. You can configure Your computer’s browser to alert You when We
                          attempt to send You a cookie with an option to accept or refuse the
                          cookie. If You have turned cookies off, You may be prevented from using
                          certain features of the Website or Application.
                        </Text>
                        <Text style={styles.parStyles}>
                          3. We do not control the use of Cookies by third parties.
                        </Text>
                      </View>
                    </View>
                    {/* SECURITY */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        SECURITY
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          1. The security of Your Personal Information is important to Us. We have
                          adopted reasonable security practices and procedures including role-based
                          access, secure communication, password protection, encryption, etc. to
                          ensure that the Personal Information collected is secure. You agree that
                          such measures are secured and adequate. We restrict access to Your
                          Personal Information to Our and Our affiliates’ employees, agents, third
                          party service providers, partners, and agencies who need to know such
                          Personal Information in relation to the Purposes as specified above in
                          this Policy, provided that such entities agree to abide by this Privacy
                          Policy.
                        </Text>
                        <Text style={styles.parStyles}>
                          2. While We will endeavour to take all reasonable and appropriate steps to
                          keep secure any information which We hold about You and prevent
                          unauthorized access, You acknowledge that the internet is not 100% secure
                          and that We cannot guarantee absolute security of Your Personal
                          Information. Further, if You are Secondary User, You hereby acknowledge
                          and agree that Your Personal Information may be freely accessible by the
                          Primary User and other Secondary Users and that TRUSTHEAL will not be able
                          to restrict, control or monitor access by Primary User or other Secondary
                          Users to your Personal Information. We will not be liable in any way in
                          relation to any breach of security or unintended loss or disclosure of
                          information caused in relation to Your Personal Information.
                        </Text>
                      </View>
                    </View>
                    {/* THIRD PARTY LINKS */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        THIRD PARTY LINKS
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          During Your interactions with Us, it may happen that We provide/include
                          links and hyperlinks of third-party websites not owned or managed by Us
                          (“Third-party Websites”). It may also happen that You or other Users may
                          include links and hyperlinks of Third-party Websites. The listing of such
                          Third-Party Websites (by You, other Users or by Us) does not imply
                          endorsement of such Third-party Websites by TRUSTHEAL. Such Third-party
                          Websites are governed by their own terms and conditions and when You
                          access such Third-party Websites, You will be governed by the terms of
                          such Third-party Websites. You must use Your own discretion while
                          accessing or using Third-party Websites. We do not make any
                          representations regarding the availability and performance of any of the
                          Third-party Websites. We are not responsible for the content, terms of
                          use, privacy policies and practices of such Third-party Websites. We do
                          not bear any liability arising out of Your use of Third-party Websites.
                        </Text>
                      </View>
                    </View>
                    {/* ACCESS */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        ACCESS
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          If You need to update or correct Your Personal Information or have any
                          grievance with respect to the processing or use of Your Personal
                          Information, or request that We no longer use Your Personal Information to
                          provide You Services, or opt-out of receiving communications such as
                          promotional and marketing-related information regarding the Services, for
                          any reason, You may send Us an email at grievances@trustheal.in and We
                          will take all reasonable efforts to incorporate the changes within a
                          reasonable period of time.
                        </Text>
                      </View>
                    </View>
                    {/* COMPLIANCE WITH LAWS */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        COMPLIANCE WITH LAWS
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          You are not allowed to use the services of the Website or Application if
                          any of the terms of this Privacy Policy are not in accordance with the
                          applicable laws of Your country.
                        </Text>
                      </View>
                    </View>
                    {/* TERM OF STORAGE OF PERSONAL INFORMATION */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        TERM OF STORAGE OF PERSONAL INFORMATION
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          1. TRUSTHEAL may keep records of communications, including phone calls
                          received and made for making enquiries, orders, feedback or other purposes
                          for rendering services effectively and efficiently. TRUSTHEAL will be the
                          exclusive owner of such data and records. However, all records are
                          regarded as confidential. Therefore, will not be divulged to any third
                          party, unless required by law.
                        </Text>
                        <Text style={styles.parStyles}>
                          2. TRUSTHEAL shall store Your Personal Information at least for a period
                          of three years from the last date of use of the Services, Website or
                          Application or for such minimum period as may be required by law.
                        </Text>
                      </View>
                    </View>

                    {/* GRIEVANCE OFFICER */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}
                      >
                        GRIEVANCE OFFICER
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parStyles}>
                          We have appointed a grievance officer, whose details are set out below, to
                          address any concerns or grievances that You may have regarding the
                          processing of Your Personal Information. If You have any such grievances,
                          please write to Our grievance officer at
                          <Text
                            style={{
                              color: 'blue',
                              textDecorationLine: 'underline',
                              textDecorationColor: 'blue',
                            }}
                          >
                            contact@trustheal.in
                          </Text>{' '}
                          and Our officer will attempt to resolve Your issues in a timely manner.
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
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
    backgroundColor: '#2B8ADA',
  },
  textLink: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  textInput: {
    paddingVertical: 5,
    backgroundColor: '#E8F0FE',
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 5,
    paddingHorizontal: 8,
    height: 40,
    color: 'black',
  },
  parStyles: {
    textAlign: 'justify',
    fontSize: 13,
    marginVertical: 5,
    lineHeight: 15,
    color: 'black',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  label: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
  },
  card: {
    margin: 20,
    backgroundColor: '#e6e3e3',
    alignSelf: 'center',
    width: '90%',
  },
  modalView: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalText: {
    marginVertical: 15,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  headingTriple: {
    fontSize: 12,
  },
  pickerStyle: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  containerStyle: {
    backgroundColor: 'white',
    borderWidth: 0,
    alignSelf: 'flex-start',
  },
});
