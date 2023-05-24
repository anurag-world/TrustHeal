/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Alert,
  View,
  Modal,
  Text,
  TextInput,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import FAIClose from 'react-native-vector-icons/FontAwesome';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import HeaderPatient from '../../components/HeaderPatient';
// icons
import patient from '../../../assets/patient.png';
import patientFemale from '../../../assets/patient_female.png';
// import invoice from '../Icons/invoice.png';
// import notification from '../Icons/notification.png';
import appointment from '../../../assets/Icons/appointment.png';
import help from '../../../assets/Icons/help.png';
import about from '../../../assets/Icons/about.png';
import family from '../../../assets/Icons/family.png';
// import history from '../Icons/history.png';
// import editicon from '../Icons/edit.png';
// import trash from '../Icons/delete.png';
// import right from '../Icons/right.png';
// import down from '../Icons/down.png';

import apiConfig from '../../components/API/apiConfig';
import logoutAction from '../../components/logoutAction';
import theme from '../../styles/theme';

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
const dataRelations = [
  { key: 'Father', value: 'Father' },
  { key: 'Mother', value: 'Mother' },
  { key: 'Brother', value: 'Brother' },
  { key: 'Sister', value: 'Sister' },
  { key: 'Spouse', value: 'Spouse' },
  { key: 'Grandfather', value: 'Grandfather' },
  { key: 'Grandmother', value: 'Grandmother' },
  { key: 'Son', value: 'Son' },
  { key: 'Daughter', value: 'Daughter' },
  { key: 'Other', value: 'Other' },
];
const dataGender = [
  { key: 'Male', value: 'Male' },
  { key: 'Female', value: 'Female' },
  { key: 'Other', value: 'Other' },
];
const dataInvoice = [
  { no: '0123', date: '11-11-2022', doc: '' },
  { no: '0124', date: '12-11-2022', doc: '' },
  { no: '0125', date: '13-11-2022', doc: '' },
  { no: '0126', date: '14-11-2022', doc: '' },
  { no: '0127', date: '15-11-2022', doc: '' },
];

// const dataInvoiceService = [
//   {
//     currency: 'string',
//     paidAmount: 0,
//     payementTime: '2023-02-10T14:13:39.530Z',
//   },
// ];

// const datahelp = [
//   {
//     question: '1. I Am Infected With Viral Fever. What To Do?',
//     answer:
//       "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500S, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived.",
//   },
//   {
//     question: '2. I Am Infected With Viral Fever. What To Do?',
//     answer:
//       "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500S, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived.",
//   },
//   {
//     question: '3. I Am Infected With Viral Fever. What To Do?',
//     answer:
//       "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500S, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived.",
//   },
//   {
//     question: '4. I Am Infected With Viral Fever. What To Do?',
//     answer:
//       "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500S, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived.",
//   },
// ];

// const dataFamily = [
//   {
//     bloodGroup: 'A+',
//     city: 'Mumbai',
//     createdOn: dayjs().format('YYYY-MM-DD'),
//     dob: '2000-01-30',
//     email: 'Anita@gmail.com',
//     familyId: 1,
//     gender: 'Female',
//     height: '165',
//     mobileNumber: '9412152552',
//     name: 'Anita Mamgain',
//     occupation: 'Homemaker',
//     patientId: 1,
//     relation: 'Mother',
//     weight: '68',
//     whatsAppNumber: '9412152552',
//   },
//   {
//     bloodGroup: 'B+',
//     city: 'Dubai',
//     createdOn: dayjs().format('YYYY-MM-DD'),
//     dob: '1952-01-30',
//     email: 'Suman@gmail.com',
//     familyId: 2,
//     gender: 'Female',
//     height: '161',
//     mobileNumber: '9414521548',
//     name: 'Suman Mamgain',
//     occupation: 'Homemaker',
//     patientId: 1,
//     relation: 'Grandmother',
//     weight: '85',
//     whatsAppNumber: '9412152552',
//   },
//   {
//     bloodGroup: 'O+',
//     city: 'Dubai',
//     createdOn: dayjs().format('YYYY-MM-DD'),
//     dob: '1962-05-30',
//     email: 'Anil@gmail.com',
//     familyId: 3,
//     gender: 'Male',
//     height: '171',
//     mobileNumber: '9410221548',
//     name: 'Anil Mamgain',
//     occupation: 'Oil Merchant',
//     patientId: 1,
//     relation: 'Father',
//     weight: '85',
//     whatsAppNumber: '9410221548',
//   },
// ];

function ItemHelp({ question, answer }) {
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.WhiteLabel,
          {
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 0,
          },
        ]}
      >
        <Text
          style={[
            {
              fontWeight: 'bold',
              fontSize: 14,
              color: 'black',
            },
          ]}
        >
          {question}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          marginTop: -6,
          padding: 5,
          borderWidth: 1,
          borderTopWidth: 0,
          width: '95%',
          alignSelf: 'center',
          borderBottomRightRadius: 5,
          borderBottomLeftRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            padding: 5,
            textAlign: 'justify',
          }}
        >
          {answer}
        </Text>
      </View>
    </View>
  );
}
function ItemInvoice({ no, date, doc }) {
  return (
    <View style={{ backgroundColor: '#F3F7FE', borderRadius: 5, marginBottom: 15 }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          paddingVertical: 10,
          justifyContent: 'space-evenly',
          alignSelf: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            alignSelf: 'center',
          }}
        >
          <Text>Invoice No. : </Text>
          <Text>Invoice Date :</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignSelf: 'center',
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>{no}</Text>
          <Text style={{ fontWeight: 'bold' }}>{date}</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignSelf: 'center',
          }}
        >
          <CustomButton
            text="Download"
            textstyle={{ fontSize: 12, color: 'white' }}
            style={{
              backgroundColor: '#2B8ADA',
              borderRadius: 5,
              padding: 7,
              paddingHorizontal: 20,
              flex: 1,
              marginVertical: 5,
            }}
          />
          <CustomButton
            text="View"
            textstyle={{ fontSize: 12, color: '#2B8ADA' }}
            style={{
              borderColor: '#2B8ADA',
              borderRadius: 5,
              padding: 7,
              paddingHorizontal: 20,
              flex: 1,
              borderWidth: 1,
            }}
          />
        </View>
      </View>
    </View>
  );
}
export default function PatientProfile() {
  const [PatientDet, setPatientDet] = useState(null);
  // other details
  const [OtherDetailsModal, setOtherDetailsModal] = useState(false);
  const [editOtherDetails, seteditOtherDetails] = useState(false);
  const [BloodGroup, setBloodGroup] = useState('');
  const [Occupation, setOccupation] = useState('');
  const [Weight, setWeight] = useState('');
  const [Height, setHeight] = useState('');
  // invoice modal
  const [invoiceModal, setinvoiceModal] = useState(false);
  // family modal
  const [familyModal, setfamilyModal] = useState(false);
  const [familyMembers, setfamilyMembers] = useState([]);
  const [famMemId, setfamMemId] = useState('');
  const [famMemName, setfamMemName] = useState('');
  const [famMemEmail, setfamMemEmail] = useState('');
  const [famMemCity, setfamMemCity] = useState('');
  const [famMemDob, setfamMemDob] = useState('');
  const [famMemRelation, setfamMemRelation] = useState('');
  const [famMemMobile, setfamMemMobile] = useState('');
  const [famMemGender, setfamMemGender] = useState('');
  const [famMemBloodGroup, setfamMemBloodGroup] = useState('');
  const [famMemOccupation, setfamMemOccupation] = useState('');
  const [famMemWeight, setfamMemWeight] = useState('');
  const [famMemHeight, setfamMemHeight] = useState('');
  const [activeFamilyId, setactiveFamilyId] = useState('');
  const [editfamilyItem, seteditfamilyItem] = useState([]);
  const [familyEditModal, setfamilyEditModal] = useState(false);
  const [addMore, setaddMore] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dob, setdob] = useState('');

  const navigation = useNavigation();

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showDatePicker = () => {
    // console.log("Pressed button");

    setDatePickerVisibility(true);
  };

  const handleConfirm = async (date) => {
    setfamMemDob(date);
    hideDatePicker();
  };

  useEffect(() => {
    // setfamilyMembers(dataFamily);

    const getData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      console.log(x);
      setPatientDet(x);
      setBloodGroup(x.bloodGroup);
      setOccupation(x.occupation);
      setHeight(x.height);
      setWeight(x.weight);
    };

    getData();
  }, []);

  const getFamily = async () => {
    axios
      .get(`${apiConfig.baseUrl}/patient/family?patientId=${PatientDet.patientId}`)
      .then((response) => {
        if (response.status === 200) {
          setfamilyMembers(response.data);
        }
      })
      .catch((error) => {
        Alert.alert('Error Family', `${error}`);
      });
  };

  const postFamily = async () => {
    const p = [
      {
        bloodGroup: famMemBloodGroup,
        city: famMemCity,
        createdOn: dayjs().format('YYYY-MM-DD'),
        dob: dayjs(famMemDob).format('YYYY-MM-DD'),
        email: famMemEmail,
        gender: famMemGender,
        height: famMemHeight,
        mobileNumber: famMemMobile,
        name: famMemName,
        occupation: famMemOccupation,
        patientId: PatientDet.patientId,
        relation: famMemRelation,
        weight: famMemWeight,
        whatsAppNumber: famMemMobile,
      },
    ];

    if (famMemId !== '') p[0].famMemId = famMemId;

    axios
      .post(`${apiConfig.baseUrl}/patient/family/save`, p)
      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Done', 'Family Member added successfully!', [
            {
              text: 'ok',
              onPress: () => getFamily(),
            },
          ]);
          reset();
          setaddMore(false);
        }
      })
      .catch((error) => {
        Alert.alert('Error Family Add', `${error}`);
      });
  };

  useEffect(() => {
    if (familyModal) getFamily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyModal]);

  const renderInvoice = ({ item }) => <ItemInvoice no={item.no} date={item.date} doc={item.doc} />;
  const renderHelp = ({ item }) => <ItemHelp question={item.question} answer={item.answer} />;
  const RenderFamily = () =>
    familyMembers.map((item, index) => (
      <View key={index} style={{ width: '95%', alignSelf: 'center' }}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: '#F3F7FE',
              borderRadius: 5,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
              marginTop: 10,
            },
            { borderWidth: 1.5, borderColor: '#2B8ADA' },
          ]}
          onPress={() => {
            if (activeFamilyId === item.familyId) setactiveFamilyId('');
            else setactiveFamilyId(item.familyId);
          }}
        >
          <FAIcon
            name={item.gender === 'Female' ? 'female' : 'male'}
            size={20}
            color={item.familyId === activeFamilyId ? '#2b8ada' : 'black'}
            style={{ alignSelf: 'center' }}
          />
          <Text
            style={[
              { flex: 0.7, fontWeight: 'bold', color: 'black', fontSize: 14 },
              item.familyId === activeFamilyId ? { color: '#2b8ada' } : null,
            ]}
          >
            {item.name}
          </Text>
          {/* edit family */}
          {/* {item.familyId == activeFamilyId ? (
              <View
                style={{
                  flex: 0.2,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    setfamilyModal(false);
                    setfamMemId(item.familyId);
                    setfamMemName(item.name);
                    setfamMemEmail(item.email);
                    setfamMemMobile(item.mobileNumber);
                    setfamMemRelation(item.relation);
                    setfamMemGender(item.gender);
                    setfamMemCity(item.city);
                    setfamMemDob(item.dob);
                    setfamMemBloodGroup(item.bloodGroup);
                    setfamMemOccupation(item.occupation);
                    setfamMemHeight(item.height);
                    setfamMemWeight(item.weight);
                    setfamilyEditModal(true);
                  }}>
                  <Image
                    style={{height: 15, width: 15, tintColor: '#2b8ada'}}
                    source={editicon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginHorizontal: 10}}
                  onPress={() => {
                    removeFamilyHandler(item.familyId);
                  }}>
                  <Image
                    style={{height: 15, width: 15, tintColor: 'red'}}
                    source={trash}
                  />
                </TouchableOpacity>
              </View>
            ) : null} */}

          <TouchableOpacity style={{ right: 0 }}>
            <FAIcon
              name={item.familyId === activeFamilyId ? 'chevron-down' : 'chevron-right'}
              size={15}
              color={item.familyId === activeFamilyId ? '#2b8ada' : 'gray'}
              style={{ alignSelf: 'center' }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {item.familyId === activeFamilyId ? (
          <ScrollView
            style={{
              height: 175,
              borderWidth: 1,
              borderTopWidth: 0,
              borderColor: '#2B8ADA',
              flexDirection: 'column',
              width: '100%',
              marginBottom: 10,
              borderBottomRightRadius: 5,
              borderBottomLeftRadius: 5,
              top: -3,
            }}
          >
            {/* <Text
                style={{
                  marginTop: 5,
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: '#000080',
                  borderBottomWidth: 1,
                  borderBottomColor: '#000080',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                Basic Details:
              </Text> */}
            <View
              style={{
                flexDirection: 'column',
                width: '95%',
                alignSelf: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}
              >
                {/* Relation */}
                <View style={[{ flex: 0.45 }]}>
                  <Text style={styles.inputLabel}>Relation</Text>
                  <Text style={styles.detailsTextInput}>{item.relation}</Text>
                </View>
                {/* Date of Birth */}
                <View style={[{ flex: 0.45 }]}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <Text style={[styles.detailsTextInput, { flex: 0.7 }]}>
                    {dayjs(item.dob).format('DD-MMM-YYYY')}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '95%',
                alignSelf: 'center',
              }}
            >
              {/* Gender */}
              <View style={[{ flex: 0.45 }]}>
                <Text style={styles.inputLabel}>Gender</Text>
                <Text style={styles.detailsTextInput}>{item.gender}</Text>
              </View>
              {/* Mobile Number */}
              <View style={[{ flex: 0.45 }]}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <Text style={styles.detailsTextInput}>{item.mobileNumber}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '95%',
                alignSelf: 'center',
              }}
            >
              {/* Gender */}
              <View style={[{ flex: 0.45 }]}>
                <Text style={styles.inputLabel}>City</Text>
                <Text style={styles.detailsTextInput}>{item.city}</Text>
              </View>
              {/* Mobile Number */}
              <View style={[{ flex: 0.45 }]}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <Text style={styles.detailsTextInput}>{item.email}</Text>
              </View>
            </View>

            {/* Other Details */}
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                flexDirection: 'column',
                marginTop: 5,
              }}
            >
              {/* <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,

                    color: '#000080',
                    borderBottomWidth: 1,
                    borderBottomColor: '#000080',
                    width: '90%',
                    alignSelf: 'center',
                  }}>
                  Other Details:
                </Text> */}
              <View
                style={{
                  flexDirection: 'column',
                  marginVertical: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}
                >
                  <View style={{ flex: 0.45, marginRight: '5%' }}>
                    <Text style={[styles.inputLabel, { marginTop: 0 }]}>Blood Group</Text>
                    <Text style={[styles.otherDetailsTextInput, { backgroundColor: '#E8F0FE' }]}>
                      {item.bloodGroup}
                    </Text>
                  </View>
                  <View style={{ flex: 0.45 }}>
                    <Text style={[styles.inputLabel, { marginTop: 0 }]}>Occupation</Text>
                    <Text style={[styles.otherDetailsTextInput, { backgroundColor: '#E8F0FE' }]}>
                      {item.occupation}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}
                >
                  <View style={{ flex: 0.45, marginRight: '5%' }}>
                    <Text style={styles.inputLabel}>Height (in cm)</Text>
                    <Text style={[styles.otherDetailsTextInput, { backgroundColor: '#E8F0FE' }]}>
                      {item.height}
                    </Text>
                  </View>
                  <View style={{ flex: 0.45 }}>
                    <Text style={styles.inputLabel}>Weight (in kg)</Text>
                    <Text style={[styles.otherDetailsTextInput, { backgroundColor: '#E8F0FE' }]}>
                      {item.weight}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : null}
      </View>
    ));

  // const removeFamilyHandler = (e) => {
  //   setfamilyMembers(familyMembers.filter((obj) => obj.familyId !== e));
  // };

  const reset = () => {
    setfamMemId('');
    setfamMemName('');
    setfamMemEmail('');
    setfamMemMobile('');
    setfamMemRelation('');
    setfamMemGender('');
    setfamMemCity('');
    setfamMemDob('');
    setfamMemBloodGroup('');
    setfamMemOccupation('');
    setfamMemHeight('');
    setfamMemWeight('');
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
        <ScrollView
          style={{
            width: '100%',
            alignSelf: 'center',
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
        >
          <HeaderPatient title="My Profile" showMenu={false} />
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'column',
            }}
          >
            {/* Image and Top Text */}
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginVertical: 5,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  borderRadius: 85,
                  width: 85,
                  height: 85,
                  borderWidth: 2,
                  borderColor: '#2B8ADA',
                  justifyContent: 'center',
                }}
              >
                {/* <Image
                  source={patient}
                  style={{
                    backgroundColor: '#2B8ADA',
                    borderRadius: 70,
                    width: 70,
                    height: 70,
                    alignSelf: 'center',
                  }}
                /> */}
                {PatientDet == null ||
                (PatientDet.patientphoto != null && PatientDet.patientphoto === 0) ||
                (PatientDet.photoPath != null && PatientDet.photoPath === 0) ? (
                  <Image
                    style={{
                      backgroundColor: '#2B8ADA',
                      borderRadius: 70,
                      width: 70,
                      height: 70,
                      alignSelf: 'center',
                    }}
                    source={
                      // eslint-disable-next-line no-nested-ternary
                      PatientDet != null
                        ? PatientDet.gender === 'Female'
                          ? patientFemale
                          : patient
                        : patient
                    }
                  />
                ) : (
                  <Image
                    style={{
                      backgroundColor: '#2B8ADA',
                      borderRadius: 70,
                      width: 70,
                      height: 70,
                      alignSelf: 'center',
                    }}
                    source={{
                      uri: `${apiConfig.baseUrl}/file/download?fileToken=${PatientDet.photoPath}&userId=${PatientDet.patientId}`,
                    }}
                  />
                )}
              </View>
              <View style={{ alignSelf: 'center' }}>
                <Text style={[styles.blueUnderText, { textAlign: 'center' }]}>
                  {PatientDet != null ? PatientDet.patientName : 'Patient Name'}
                </Text>
                <Text
                  style={[
                    styles.grayHeading,
                    {
                      color: 'black',
                      fontSize: 17,
                      textAlign: 'center',
                      marginBottom: 0,
                    },
                  ]}
                >
                  {PatientDet != null ? PatientDet.city : 'Patient City'}
                </Text>
                <Text style={[styles.grayHeading, { textAlign: 'center', marginBottom: 0 }]}>
                  {PatientDet != null ? PatientDet.email : 'Patient Email'}
                </Text>
              </View>
            </View>
            {/* Middle White Box */}
            <View style={styles.whiteBox}>
              <View style={[styles.whiteOuterBox, { borderBottomWidth: 1, borderColor: 'gray' }]}>
                <View style={[styles.whiteInnerBox, { borderRightWidth: 1, borderColor: 'gray' }]}>
                  <Text style={styles.grayHeading}>Age</Text>
                  <Text style={styles.blueUnderText}>
                    {PatientDet != null ? dayjs().diff(dayjs(PatientDet.dob), 'y') : 'Age'}
                    Years
                  </Text>
                </View>
                <View style={[styles.whiteInnerBox]}>
                  <Text style={styles.grayHeading}>Phone No.</Text>
                  <Text style={styles.blueUnderText}>
                    {PatientDet != null ? PatientDet.mobileNumber : '+91 123456789'}
                  </Text>
                </View>
              </View>
              <View style={styles.whiteOuterBox}>
                <View style={[styles.whiteInnerBox]}>
                  <Text style={styles.grayHeading}>Date of Birth</Text>
                  <Text style={styles.blueUnderText}>
                    {PatientDet != null
                      ? dayjs(PatientDet.dob).format('DD MMM, YYYY')
                      : dayjs('01-01-1997').format('DD MMM, YYYY')}
                  </Text>
                </View>
                <View style={[styles.whiteInnerBox, { borderLeftWidth: 1, borderColor: 'gray' }]}>
                  <Text style={styles.grayHeading}>Gender</Text>
                  <Text style={styles.blueUnderText}>
                    {PatientDet != null ? PatientDet.gender : 'Male'}
                  </Text>
                </View>
              </View>
            </View>
            {/* Bottom White Box */}
            <View style={styles.whiteBox}>
              <TouchableOpacity
                style={styles.whiteBoxRow}
                onPress={() => {
                  setfamilyModal(true);
                }}
              >
                <View style={{ flex: 0.3 }}>
                  <Image source={family} style={styles.whiteBoxRowIcon} />
                </View>
                <View style={{ flex: 0.6 }}>
                  <Text style={styles.whiteBoxRowText}>Family Members</Text>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.whiteBoxRow}
                onPress={() => {
                  setOtherDetailsModal(true);
                }}>
                <View style={{flex: 0.3}}>
                  <Image source={history} style={styles.whiteBoxRowIcon} />
                </View>
                <View style={{flex: 0.6}}>
                  <Text style={styles.whiteBoxRowText}>Other Details</Text>
                </View>
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                style={styles.whiteBoxRow}
                onPress={() => {
                  setinvoiceModal(true);
                }}>
                <View style={{flex: 0.3}}>
                  <Image source={invoice} style={styles.whiteBoxRowIcon} />
                </View>
                <View style={{flex: 0.6}}>
                  <Text style={styles.whiteBoxRowText}>Invoices</Text>
                </View>
              </TouchableOpacity> */}
              {/* <TouchableOpacity style={styles.whiteBoxRow} onPress={() => {}}>
                <View style={{flex: 0.3}}>
                  <Image source={notification} style={styles.whiteBoxRowIcon} />
                </View>
                <View style={{flex: 0.6}}>
                  <Text style={styles.whiteBoxRowText}>Notifications</Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.whiteBoxRow}
                onPress={() => {
                  navigation.navigate('Appointments');
                }}
              >
                <View style={{ flex: 0.3 }}>
                  <Image source={appointment} style={styles.whiteBoxRowIcon} />
                </View>
                <View style={{ flex: 0.6 }}>
                  <Text style={styles.whiteBoxRowText}>My Appointments</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.whiteBoxRow}
                onPress={() => {
                  navigation.navigate('FaqPatient');
                }}
              >
                <View style={{ flex: 0.3 }}>
                  <Image source={help} style={styles.whiteBoxRowIcon} />
                </View>
                <View style={{ flex: 0.6 }}>
                  <Text style={styles.whiteBoxRowText}>FAQ</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.whiteBoxRow, { borderBottomWidth: 0 }]}
                onPress={() => navigation.navigate('About')}
              >
                <View style={{ flex: 0.3 }}>
                  <Image source={about} style={styles.whiteBoxRowIcon} />
                </View>
                <View style={{ flex: 0.6 }}>
                  <Text style={styles.whiteBoxRowText}>About TrustHeal</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/*  Buttons */}
            <TouchableOpacity
              style={{
                borderColor: '#2B8ADA',
                borderWidth: 1,
                borderRadius: 10,
                marginVertical: 5,
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                padding: 10,
                justifyContent: 'center',
              }}
              onPress={() => {
                navigation.navigate('PatientProfileEdit');
              }}
            >
              <FAIcon name="user-edit" color="#2B8ADA" size={20} />
              <Text style={{ color: '#2B8ADA', marginLeft: 10 }}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#2B8ADA',
                borderRadius: 10,
                marginVertical: 5,
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                padding: 10,
                justifyContent: 'center',
                marginBottom: 25,
              }}
              onPress={() => logoutAction(navigation)}
            >
              <FAIcon name="sign-out-alt" color="white" size={20} />
              <Text style={{ color: 'white', marginLeft: 10 }}>Logout</Text>
            </TouchableOpacity>
            {/* <CustomButton
              text="Logout"
              textstyle={{color: 'white'}}
              style={{
                backgroundColor: '#2B8ADA',
                borderRadius: 10,
                marginVertical: 5,
                width: '90%',
                alignSelf: 'center',
              }}
              onPress={logout}
            /> */}
            {/* Notification Modal */}
            {/* Help & Support */}

            {/* Other Details Modal */}
            {OtherDetailsModal && (
              <Modal
                animationType="slide"
                transparent
                visible={OtherDetailsModal}
                onRequestClose={() => {
                  setOtherDetailsModal(!OtherDetailsModal);
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
                        width: '95%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        height: 300,
                        padding: 10,
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
                        flexDirection: 'row',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          padding: 5,
                          color: '#2B8ADA',
                        }}
                      >
                        Other Details
                      </Text>

                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          position: 'absolute',
                          right: 10,
                        }}
                      >
                        <FAIClose
                          name="close"
                          color="black"
                          size={20}
                          style={{ marginHorizontal: 5, alignSelf: 'center' }}
                          onPress={() => setOtherDetailsModal(false)}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        width: '100%',
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          alignSelf: 'center',
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignSelf: 'center',
                          }}
                        >
                          <View style={{ flex: 0.45, marginRight: '5%' }}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Blood Group</Text>
                            {editOtherDetails ? (
                              <SelectList
                                placeholder={BloodGroup}
                                setSelected={(val) => setBloodGroup(val)}
                                data={dataBloodGroup}
                                save="value"
                                boxStyles={[
                                  {
                                    backgroundColor: '#E8F0FE',
                                    borderWidth: 0,
                                    borderRadius: 5,
                                  },
                                ]}
                                dropdownStyles={{
                                  backgroundColor: 'white',
                                  zIndex: 1,
                                }}
                                dropdownTextStyles={{
                                  color: '#2b8ada',
                                  fontWeight: 'bold',
                                }}
                                badgeStyles={{ backgroundColor: '#2b8ada' }}
                              />
                            ) : (
                              <TextInput
                                style={[
                                  styles.otherDetailsTextInput,
                                  { backgroundColor: '#d0e0fc' },
                                  editOtherDetails ? { backgroundColor: '#E8F0FE' } : null,
                                ]}
                                value={BloodGroup}
                                editable={editOtherDetails}
                              />
                            )}
                          </View>
                          <View style={{ flex: 0.45 }}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Occupation</Text>
                            <TextInput
                              style={[
                                styles.otherDetailsTextInput,
                                editOtherDetails
                                  ? { backgroundColor: '#E8F0FE' }
                                  : { backgroundColor: '#d0e0fc' },
                              ]}
                              placeholderTextColor="black"
                              value={Occupation}
                              onChangeText={(text) => setOccupation(text)}
                              editable={editOtherDetails}
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignSelf: 'center',
                          }}
                        >
                          <View style={{ flex: 0.45, marginRight: '5%' }}>
                            <Text style={styles.inputLabel}>Height (in cm)</Text>
                            <TextInput
                              editable={editOtherDetails}
                              style={[
                                styles.otherDetailsTextInput,
                                editOtherDetails
                                  ? { backgroundColor: '#E8F0FE' }
                                  : { backgroundColor: '#d0e0fc' },
                              ]}
                              placeholderTextColor="black"
                              value={Height}
                              keyboardType="number-pad"
                              onChangeText={(text) => setHeight(text)}
                            />
                          </View>
                          <View style={{ flex: 0.45 }}>
                            <Text style={styles.inputLabel}>Weight (in kg)</Text>
                            <TextInput
                              editable={editOtherDetails}
                              style={[
                                styles.otherDetailsTextInput,
                                editOtherDetails
                                  ? { backgroundColor: '#E8F0FE' }
                                  : { backgroundColor: '#d0e0fc' },
                              ]}
                              placeholderTextColor="black"
                              value={Weight}
                              keyboardType="number-pad"
                              onChangeText={(text) => setWeight(text)}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {invoiceModal && (
              <Modal
                animationType="slide"
                transparent
                visible={invoiceModal}
                onRequestClose={() => {
                  setinvoiceModal(!invoiceModal);
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
                        width: '95%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        padding: 20,
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
                        My Invoices
                      </Text>
                      <FAIClose
                        name="close"
                        color="black"
                        size={20}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        onPress={() => setinvoiceModal(false)}
                      />
                    </View>
                    <View
                      style={{
                        alignSelf: 'center',
                        width: '100%',
                        flexDirection: 'row',
                      }}
                    >
                      <FlatList
                        data={dataInvoice}
                        keyExtractor={(item) => item.no}
                        renderItem={renderInvoice}
                        scrollEnabled
                        style={{ height: 300 }}
                        bounces={false}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {familyModal && (
              <Modal
                animationType="slide"
                transparent
                visible={familyModal}
                onRequestClose={() => {
                  setfamilyModal(!familyModal);
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
                        width: '95%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        padding: 15,
                        minHeight: 200,
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
                        Family Members
                      </Text>
                      <FAIClose
                        name="close"
                        color="black"
                        size={20}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        onPress={() => {
                          reset();
                          setfamilyModal(false);
                          setaddMore(false);
                        }}
                      />
                    </View>
                    <ScrollView
                      style={{
                        minHeight: 150,
                        maxHeight: 300,
                        width: '95%',
                        marginBottom: 20,
                      }}
                    >
                      {familyMembers !== '' ? (
                        <RenderFamily />
                      ) : (
                        <Text
                          style={{
                            alignSelf: 'center',
                            color: 'black',
                            marginVertical: 10,
                          }}
                        >
                          No Family Member Added
                        </Text>
                      )}
                      {addMore ? (
                        <View
                          style={{
                            // borderWidth: 1,
                            // borderColor: '#2B8ADA',
                            flexDirection: 'column',
                            width: '100%',
                            marginVertical: 10,
                            borderRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              marginTop: 5,
                              fontWeight: 'bold',
                              fontSize: 15,
                              color: '#000080',
                              borderBottomWidth: 1,
                              borderBottomColor: '#000080',
                              width: '90%',
                              alignSelf: 'center',
                            }}
                          >
                            Basic Details
                          </Text>
                          <View style={{ width: '95%', alignSelf: 'center' }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginTop: 5,
                              }}
                            >
                              <View style={[{ flex: 0.95 }, styles.detailsTextView]}>
                                <Text style={[styles.inputLabel, { marginTop: 0 }]}>Name</Text>
                                <TextInput
                                  style={styles.detailsTextInput}
                                  placeholder="Name"
                                  onChangeText={(text) => setfamMemName(text)}
                                  value={famMemName}
                                />
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                              }}
                            >
                              <View style={[{ flex: 0.45 }, styles.detailsTextView]}>
                                <Text style={[styles.inputLabel, { marginTop: 0 }]}>Email</Text>
                                <TextInput
                                  style={styles.detailsTextInput}
                                  placeholder="Email"
                                  onChangeText={(text) => setfamMemEmail(text)}
                                  value={famMemEmail}
                                  keyboardType="email-address"
                                />
                              </View>
                              <View style={[{ flex: 0.45 }, styles.detailsTextView]}>
                                <Text style={[styles.inputLabel, { marginTop: 0 }]}>
                                  Mobile Number
                                </Text>
                                <TextInput
                                  style={[styles.detailsTextInput, { flex: 0.7 }]}
                                  placeholder="Mobile Number"
                                  onChangeText={(text) => setfamMemMobile(text)}
                                  value={famMemMobile}
                                  keyboardType="number-pad"
                                  maxLength={10}
                                />
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',

                                justifyContent: 'space-evenly',
                                // flex: 1,
                              }}
                            >
                              <View style={[{ flex: 0.45 }, styles.detailsTextView]}>
                                <Text style={[styles.inputLabel, { marginTop: 0 }]}>Relation</Text>
                                <SelectList
                                  placeholder={famMemRelation === '' ? ' ' : famMemRelation}
                                  setSelected={(val) => setfamMemRelation(val)}
                                  data={dataRelations}
                                  save="value"
                                  boxStyles={[
                                    {
                                      backgroundColor: '#E8F0FE',
                                      borderWidth: 0,
                                      borderRadius: 5,
                                    },
                                  ]}
                                  dropdownStyles={{
                                    backgroundColor: 'white',
                                    zIndex: 1,
                                  }}
                                  dropdownTextStyles={{
                                    color: '#2b8ada',
                                    fontWeight: 'bold',
                                  }}
                                  badgeStyles={{ backgroundColor: '#2b8ada' }}
                                />
                              </View>
                              <View style={[styles.detailsTextView, { flex: 0.45 }]}>
                                <Text style={[styles.inputLabel, { marginTop: 0 }]}>Gender</Text>
                                <SelectList
                                  placeholder={famMemGender === '' ? ' ' : famMemGender}
                                  setSelected={(val) => setfamMemGender(val)}
                                  data={dataGender}
                                  save="value"
                                  boxStyles={[
                                    {
                                      backgroundColor: '#E8F0FE',
                                      borderWidth: 0,
                                      borderRadius: 5,
                                    },
                                  ]}
                                  dropdownStyles={{
                                    backgroundColor: 'white',
                                    zIndex: 1,
                                  }}
                                  dropdownTextStyles={{
                                    color: '#2b8ada',
                                    fontWeight: 'bold',
                                  }}
                                  badgeStyles={{ backgroundColor: '#2b8ada' }}
                                />
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                              }}
                            >
                              <View style={[styles.detailsTextView, { flex: 0.45 }]}>
                                <Text style={[styles.inputLabel, { marginTop: 0 }]}>City</Text>
                                <TextInput
                                  style={styles.detailsTextInput}
                                  placeholder="City"
                                  onChangeText={(text) => setfamMemCity(text)}
                                  value={famMemCity}
                                />
                              </View>
                              <View style={[{ flex: 0.45 }, styles.detailsTextView]}>
                                <Text style={[styles.inputLabel, { marginTop: 0 }]}>
                                  Date of Birth
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    backgroundColor: '#E8F0FE',
                                    borderRadius: 5,
                                  }}
                                >
                                  <TextInput
                                    style={[styles.detailsTextInput, { flex: 0.7 }]}
                                    placeholder="Date Of Birth"
                                    value={
                                      famMemDob === '' ? '' : dayjs(famMemDob).format('DD-MM-YYYY')
                                    }
                                    editable={false}
                                  />
                                  <FAIcon
                                    name="calendar-alt"
                                    size={20}
                                    color="gray"
                                    style={{ flex: 0.3, alignSelf: 'center' }}
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
                            </View>
                          </View>

                          <View
                            style={{
                              marginTop: 5,
                              width: '95%',
                              alignSelf: 'center',
                              flexDirection: 'column',
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: 15,
                                color: '#000080',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000080',
                                width: '90%',
                                alignSelf: 'center',
                              }}
                            >
                              Other Details (optional)
                            </Text>
                            <View
                              style={{
                                flexDirection: 'column',
                                marginVertical: 10,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                }}
                              >
                                <View style={{ flex: 0.45, marginRight: '5%' }}>
                                  <Text style={[styles.inputLabel, { marginTop: 0 }]}>
                                    Blood Group
                                  </Text>
                                  <SelectList
                                    placeholder={famMemBloodGroup === '' ? ' ' : famMemBloodGroup}
                                    setSelected={(val) => setfamMemBloodGroup(val)}
                                    data={dataBloodGroup}
                                    save="value"
                                    boxStyles={[
                                      {
                                        backgroundColor: '#E8F0FE',
                                        borderWidth: 0,
                                        borderRadius: 5,
                                      },
                                    ]}
                                    dropdownStyles={{
                                      backgroundColor: 'white',
                                      zIndex: 1,
                                    }}
                                    dropdownTextStyles={{
                                      color: '#2b8ada',
                                      fontWeight: 'bold',
                                    }}
                                    badgeStyles={{ backgroundColor: '#2b8ada' }}
                                  />
                                </View>
                                <View style={{ flex: 0.45 }}>
                                  <Text style={[styles.inputLabel, { marginTop: 0 }]}>
                                    Occupation
                                  </Text>
                                  <TextInput
                                    style={[
                                      styles.otherDetailsTextInput,
                                      { backgroundColor: '#E8F0FE' },
                                    ]}
                                    placeholderTextColor="black"
                                    onChangeText={(text) => setfamMemOccupation(text)}
                                    value={famMemOccupation}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                }}
                              >
                                <View style={{ flex: 0.45, marginRight: '5%' }}>
                                  <Text style={styles.inputLabel}>Height</Text>
                                  <TextInput
                                    style={[
                                      styles.otherDetailsTextInput,
                                      { backgroundColor: '#E8F0FE' },
                                    ]}
                                    placeholderTextColor="black"
                                    onChangeText={(text) => setfamMemHeight(text)}
                                    value={famMemHeight}
                                    keyboardType="number-pad"
                                  />
                                </View>
                                <View style={{ flex: 0.45 }}>
                                  <Text style={styles.inputLabel}>Weight</Text>
                                  <TextInput
                                    style={[
                                      styles.otherDetailsTextInput,
                                      { backgroundColor: '#E8F0FE' },
                                    ]}
                                    placeholderTextColor="black"
                                    onChangeText={(text) => setfamMemWeight(text)}
                                    value={famMemWeight}
                                    keyboardType="number-pad"
                                  />
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      ) : null}

                      {/* Buttons */}
                      {!addMore ? (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                          }}
                        >
                          <CustomButton
                            text="+ Add "
                            textstyle={{ color: 'white', fontSize: 12 }}
                            style={{
                              alignSelf: 'flex-end',
                              width: 100,
                              borderColor: '#2b8ada',
                              borderWidth: 1,
                              backgroundColor: '#2b8ada',
                              borderRadius: 5,
                              padding: 3,
                              paddingHorizontal: 10,
                              marginTop: 10,
                              marginRight: 5,
                            }}
                            onPress={() => {
                              reset();
                              setaddMore(!addMore);
                            }}
                          />
                        </View>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                          }}
                        >
                          <CustomButton
                            text="Done"
                            textstyle={{ color: 'white', fontSize: 12 }}
                            style={{
                              alignSelf: 'flex-end',
                              width: 100,
                              borderColor: '#2b8ada',
                              borderWidth: 1,
                              backgroundColor: '#2b8ada',
                              borderRadius: 5,
                              padding: 3,
                              paddingHorizontal: 10,
                              marginTop: 10,
                              marginRight: 5,
                            }}
                            onPress={async () => {
                              await postFamily();
                            }}
                          />
                          <CustomButton
                            text="Cancel"
                            textstyle={{ color: '#2b8ada', fontSize: 12 }}
                            style={{
                              alignSelf: 'flex-end',
                              width: 100,
                              borderColor: '#2b8ada',
                              borderWidth: 1,
                              borderRadius: 5,
                              padding: 3,
                              paddingHorizontal: 10,
                              marginTop: 10,
                              marginRight: 5,
                            }}
                            onPress={() => {
                              reset();
                              setaddMore(false);
                            }}
                          />
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            )}

            {familyEditModal && (
              <Modal
                animationType="slide"
                transparent
                visible={familyEditModal}
                onRequestClose={() => {
                  setfamilyEditModal(!familyEditModal);
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
                        width: '95%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        padding: 15,
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
                        Edit Family Member Details
                      </Text>
                      <FAIClose
                        name="close"
                        color="black"
                        size={20}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        onPress={() => {
                          reset();
                          setfamilyEditModal(false);
                          setaddMore(false);
                        }}
                      />
                    </View>

                    <View
                      style={{
                        // borderWidth: 1,
                        // borderColor: '#2B8ADA',
                        flexDirection: 'column',
                        width: '100%',
                        marginVertical: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={{
                          marginTop: 5,
                          fontWeight: 'bold',
                          fontSize: 15,
                          color: '#000080',
                          borderBottomWidth: 1,
                          borderBottomColor: '#000080',
                          width: '90%',
                          alignSelf: 'center',
                        }}
                      >
                        Basic Details
                      </Text>
                      <View style={{ width: '95%', alignSelf: 'center' }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            marginTop: 5,
                          }}
                        >
                          <View style={[{ flex: 0.95 }, styles.detailsTextView]}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Name</Text>
                            <TextInput
                              style={styles.detailsTextInput}
                              placeholder="Name"
                              onChangeText={(text) => setfamMemName(text)}
                              value={famMemName}
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                          }}
                        >
                          <View style={[{ flex: 0.45 }, styles.detailsTextView]}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Email</Text>
                            <TextInput
                              style={styles.detailsTextInput}
                              placeholder="Email"
                              onChangeText={(text) => setfamMemEmail(text)}
                              value={famMemEmail}
                              keyboardType="email-address"
                            />
                          </View>
                          <View style={[{ flex: 0.45 }, styles.detailsTextView]}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Mobile Number</Text>
                            <TextInput
                              style={[styles.detailsTextInput, { flex: 0.7 }]}
                              placeholder="Mobile Number"
                              onChangeText={(text) => setfamMemMobile(text)}
                              value={famMemMobile}
                              keyboardType="number-pad"
                              maxLength={10}
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                          }}
                        >
                          <View style={[{ flex: 0.45 }, styles.detailsTextView]}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Relation</Text>
                            <TextInput
                              style={styles.detailsTextInput}
                              placeholder="Relation"
                              onChangeText={(text) => setfamMemRelation(text)}
                              value={famMemRelation}
                            />
                          </View>
                          <View style={[styles.detailsTextView, { flex: 0.45 }]}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Gender</Text>
                            <TextInput
                              style={styles.detailsTextInput}
                              placeholder="Gender"
                              onChangeText={(text) => setfamMemGender(text)}
                              value={famMemGender}
                            />
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                          }}
                        >
                          <View style={[styles.detailsTextView, { flex: 0.45 }]}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>City</Text>
                            <TextInput
                              style={styles.detailsTextInput}
                              placeholder="City"
                              onChangeText={(text) => setfamMemCity(text)}
                              value={famMemCity}
                            />
                          </View>
                          <View style={[{ flex: 0.45 }, styles.detailsTextView]}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Date of Birth</Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                backgroundColor: '#E8F0FE',
                                borderRadius: 5,
                              }}
                            >
                              <TextInput
                                style={[styles.detailsTextInput, { flex: 0.7 }]}
                                placeholder="Date Of Birth"
                                value={
                                  famMemDob === '' ? '' : dayjs(famMemDob).format('DD-MM-YYYY')
                                }
                                editable={false}
                              />
                              <FAIcon
                                name="calendar-alt"
                                size={20}
                                color="gray"
                                style={{ flex: 0.3, alignSelf: 'center' }}
                              />
                            </View>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: 5,
                          width: '95%',
                          alignSelf: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 15,
                            color: '#000080',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000080',
                            width: '90%',
                            alignSelf: 'center',
                          }}
                        >
                          Other Details (optional)
                        </Text>
                        <View
                          style={{
                            flexDirection: 'column',
                            marginVertical: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignSelf: 'center',
                            }}
                          >
                            <View style={{ flex: 0.45, marginRight: '5%' }}>
                              <Text style={[styles.inputLabel, { marginTop: 0 }]}>Blood Group</Text>
                              <TextInput
                                style={[
                                  styles.otherDetailsTextInput,
                                  { backgroundColor: '#E8F0FE' },
                                ]}
                                placeholderTextColor="black"
                                onChangeText={(text) => setfamMemBloodGroup(text)}
                                value={famMemBloodGroup}
                              />
                            </View>
                            <View style={{ flex: 0.45 }}>
                              <Text style={[styles.inputLabel, { marginTop: 0 }]}>Occupation</Text>
                              <TextInput
                                style={[
                                  styles.otherDetailsTextInput,
                                  { backgroundColor: '#E8F0FE' },
                                ]}
                                placeholderTextColor="black"
                                onChangeText={(text) => setfamMemOccupation(text)}
                                value={famMemOccupation}
                              />
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignSelf: 'center',
                            }}
                          >
                            <View style={{ flex: 0.45, marginRight: '5%' }}>
                              <Text style={styles.inputLabel}>Height</Text>
                              <TextInput
                                style={[
                                  styles.otherDetailsTextInput,
                                  { backgroundColor: '#E8F0FE' },
                                ]}
                                placeholderTextColor="black"
                                onChangeText={(text) => setfamMemHeight(text)}
                                value={famMemHeight}
                                keyboardType="number-pad"
                              />
                            </View>
                            <View style={{ flex: 0.45 }}>
                              <Text style={styles.inputLabel}>Weight</Text>
                              <TextInput
                                style={[
                                  styles.otherDetailsTextInput,
                                  { backgroundColor: '#E8F0FE' },
                                ]}
                                placeholderTextColor="black"
                                onChangeText={(text) => setfamMemWeight(text)}
                                value={famMemWeight}
                                keyboardType="number-pad"
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* Buttons */}

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                      }}
                    >
                      <CustomButton
                        text="Done"
                        textstyle={{ color: 'white', fontSize: 12 }}
                        style={{
                          alignSelf: 'flex-end',
                          width: 100,
                          borderColor: '#2b8ada',
                          borderWidth: 1,
                          backgroundColor: '#2b8ada',
                          borderRadius: 5,
                          padding: 3,
                          paddingHorizontal: 10,
                          marginTop: 10,
                          marginRight: 5,
                        }}
                        onPress={async () => {
                          await postFamily();
                          setfamilyEditModal(false);
                          setfamilyModal(true);
                        }}
                      />
                      <CustomButton
                        text="Cancel"
                        textstyle={{ color: '#2b8ada', fontSize: 12 }}
                        style={{
                          alignSelf: 'flex-end',
                          width: 100,
                          borderColor: '#2b8ada',
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 3,
                          paddingHorizontal: 10,
                          marginTop: 10,
                          marginRight: 5,
                        }}
                        onPress={() => {
                          reset();
                          setfamilyEditModal(false);
                          setfamilyModal(true);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        </ScrollView>
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
  grayHeading: {
    color: 'gray',
    fontSize: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  blueUnderText: {
    color: '#2B8ADA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  whiteInnerBox: {
    flex: 0.45,
    flexDirection: 'column',
    padding: 15,
  },
  whiteOuterBox: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  whiteBox: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  whiteBoxRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 5,
    alignSelf: 'center',
  },
  whiteBoxRowIcon: { width: 30, height: 30 },
  whiteBoxRowText: { fontWeight: 'bold', fontSize: 16, color: theme.colors.dark[100] },
  modalView: {
    borderRadius: 10,
    flex: 1,
    position: 'absolute',
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
  bubble: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E8F0FE',
    padding: 5,
    borderRadius: 15,
    marginVertical: 5,
    width: '100%',
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
  searchBar: {
    flex: 1,
    width: '95%',
    flexDirection: 'row',
    padding: 5,
    borderWidth: 1,
    borderColor: '#2B8ADA',
    backgroundColor: 'white',
    borderRadius: 25,
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
    top: 0,
    margin: 10,
  },

  otherDetailsTextInput: {
    backgroundColor: '#E8F0FE',
    borderRadius: 5,
    fontSize: 12,
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  detailsTextView: {
    // backgroundColor: '#D0E0FC',
    // backgroundColor: '#E8F0FE',
    alignSelf: 'center',
    marginVertical: 3,
    borderRadius: 5,
  },
  detailsTextInput: {
    backgroundColor: '#E8F0FE',
    borderRadius: 5,
    fontSize: 12,
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2b8ada',
  },
});
