/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  useWindowDimensions,
  View,
  Modal,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import HeaderPatient from '../../components/HeaderPatient';
import CustomButton from '../../components/CustomButton';
import DayDateMaker from '../../components/API/DayDateMaker';
import timeformatter from '../../components/API/timeformatter';
import downloading from '../../../assets/animations/downloading.gif';
import apiConfig from '../../components/API/apiConfig';
import clinicMaker from '../../components/API/ClincMaker';
import DoctorBasicDetails from '../../components/DoctorBasicDetails';
import waiting from '../../../assets/animations/waiting1.gif';
import theme from '../../styles/theme';

function RenderModal({ consultationModeModal, setconsultationModeModal, navigation }) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={consultationModeModal}
      onRequestClose={() => {
        setconsultationModeModal(!consultationModeModal);
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
                fontSize: 20,
                padding: 5,
                alignSelf: 'center',
              }}
            >
              Consultation Mode
            </Text>
            <FAIcon
              name="window-close"
              color="black"
              size={20}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                alignSelf: 'center',
              }}
              onPress={() => {
                setconsultationModeModal(false);
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              width: '90%',
              alignSelf: 'center',
              flex: 1,
              backgroundColor: '#2B8ADA',
              borderRadius: 30,
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: 10,
              marginBottom: 10,
            }}
            onPress={() => {
              navigation.navigate('SelectSlotsE');
              setconsultationModeModal(false);
            }}
          >
            <FAIcon name="video" color="white" size={16} />
            <Text style={{ color: 'white', fontSize: 14 }}>E-Consultation</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>
              {/* Rs. {data.doctorConsultationFeesDTO.eConsulationFees}/- */}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '90%',
              alignSelf: 'center',
              flex: 1,
              backgroundColor: '#17CC9C',
              borderRadius: 30,
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: 10,
              marginBottom: 10,
            }}
            onPress={() => {
              navigation.navigate('SelectSlotsP');
              setconsultationModeModal(false);
            }}
          >
            <FAIcon name="users" color="white" size={16} />
            <Text style={{ color: 'white', fontSize: 14 }}>P-Consultation</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>
              {/* Rs. {data.doctorConsultationFeesDTO.physicalConsulationFees}/- */}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function DoctorDetails() {
  const [DocObj, setDocObj] = useState(null); // from service
  const [DocDet, setDocDet] = useState(null); // from previous page
  const [patientDet, setpatientDet] = useState(null);

  const [showLangDet, setshowLangDet] = useState(false);
  const [Languages, setLanguages] = useState([]);
  const [showEduInfo, setShowEduInfo] = useState(false);
  const [Education, setEducation] = useState([]);
  const [showMedInfo, setShowMedInfo] = useState(false);
  const [MedRegDet, setMedRegDet] = useState([]);
  const [showExpDet, setShowExpDet] = useState(false);
  const [Experience, setExperience] = useState([]);
  const [showFeesDet, setShowFeesDet] = useState(false);
  const [Fees, setFees] = useState([]);
  const [showClinicDet, setShowClinicDet] = useState(false);
  const [ClinicDet, setClinicDet] = useState([]);
  const [isFetching, setisFetching] = useState(false);
  const [consultationModeModal, setconsultationModeModal] = useState(false);
  const [showEConsult, setshowEConsult] = useState(false);
  const [showPConsult, setshowPConsult] = useState(false);
  const layout = useWindowDimensions();
  // for e-consultation
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState(null);
  const [selectedSlotEndTime, setSelectedSlotEndTime] = useState(null);
  const [selectedSlotId, setselectedSlotId] = useState(null);
  const [consultationType, setconsultationType] = useState(null);
  const [EDays, setEDays] = useState(null);
  const [ESlots, setESlots] = useState(null);
  // for p-consultation
  const [selectedPDate, setSelectedPDate] = useState(null);
  const [selectedPSlotTime, setSelectedPSlotTime] = useState(null);
  const [selectedPSlotEndTime, setSelectedPSlotEndTime] = useState(null);
  const [selectedPSlotId, setselectedPSlotId] = useState(null);
  const [PDays, setPDays] = useState(null);
  const [PSlots, setPSlots] = useState(null);
  const [ClinicsDropDown, setClinicsDropDown] = useState([]);
  const [clinicId, setclinicId] = useState(null);
  const [clinicName, setclinicName] = useState('');

  const navigation = useNavigation();

  // view images
  const [DisplayPhotoToken, setDisplayPhotoToken] = useState(0);
  const [ImageViewer, setImageViewer] = useState(false);

  const [mode, setMode] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('viewProfile'));
      const y = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      // console.log(x);

      setDocDet(x);
      setpatientDet(y);
      axios
        .get(
          `${apiConfig.baseUrl}/patient/doctor/details?doctorId=${x.doctorId}&patientId=${y.patientId}`
        )
        .then((response) => {
          //   console.log('\n\nDoctor Details\n\n', response.data);
          if (response.status === 200) setDocObj(response.data);
        })
        .catch((error) => {
          Alert.alert('Error Fetching', `${error}`);
        });
    };

    getData();

    // console.log(layout.width);
  }, []);

  useEffect(() => {
    if (DocObj !== null) {
      const obj = {
        availableDates: DocObj.eslotDates,
      };
      setEDays(DayDateMaker(obj));
      // setPDays(DayDateMaker(DocObj.eslotDates));
      setClinicsDropDown(clinicMaker(DocObj.clinicInfo));
    }
    // console.log(layout.width);
  }, [DocObj]);

  useEffect(() => {
    const getEslots = async () => {
      axios
        .get(
          `${apiConfig.baseUrl}/slot/eslot/available?date=${selectedDate}&doctorId=${DocDet.doctorId}`
        )
        .then((response) => {
          if (response.status === 200) setESlots(response.data);
        })
        .catch((error) => {
          Alert.alert('Error in Eslots', `${error}`);
        });
    };
    if (selectedDate !== null) getEslots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

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
          Alert.alert('Error in Clinic Details', `${error}`);
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
          Alert.alert('Error in PSLots', `${error}`);
        });
    };
    if (selectedPDate !== null) getPslots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPDate]);

  useEffect(() => {
    if (DocObj !== null) {
      setMedRegDet(DocObj.medicalInfo);
      setEducation(DocObj.educationInfo);
      setExperience(DocObj.experienceInfo);
      setClinicDet(DocObj.clinicInfo);
      setLanguages(DocObj.languages);
      setFees(DocObj.feesInfo);
    }
  }, [DocObj]);

  const ViewEducation = () =>
    Education.map((education, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
        }}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 0,
            padding: 0,
          }}
        >
          {/* Degree */}
          <View style={[styles.cellStyle, { flex: 0.4 }]}>
            <Text style={styles.cellText}>{education.degree}</Text>
          </View>
          {/* Passing Year */}
          <View style={[styles.cellStyle, { flex: 0.4 }]}>
            <Text style={styles.cellText}>{education.passingYear}</Text>
          </View>
          {/* Specialization */}
          <View style={[styles.cellStyle, { flex: 1 }]}>
            <Text style={styles.cellText}>{education.specialization}</Text>
          </View>
          {/* University */}
          <View style={[styles.cellStyle, { flex: 1 }]}>
            <Text style={styles.cellText}>{education.university}</Text>
          </View>
        </View>
      </View>
    ));

  const ViewExperience = () =>
    Experience.map((experience, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
        }}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 0,
            padding: 0,
          }}
        >
          {/* Practice At */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>{experience.practiceCenter}</Text>
          </View>

          {/* Total Experience */}
          <View style={styles.cellStyle}>
            {Math.floor(experience.experienceInMonths / 12) > 0 && (
              <Text style={styles.cellText}>
                {`${Math.floor(experience.experienceInMonths / 12)} year(s)`}
              </Text>
            )}
            {parseInt(experience.experienceInMonths % 12, 10) !== 0 && (
              <Text style={styles.cellText}>
                {`${parseInt(experience.experienceInMonths % 12, 10)} month(s)`}
              </Text>
            )}
          </View>
        </View>
      </View>
    ));

  const ViewClinics = () =>
    ClinicDet.map((clinicDet, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
        }}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 0,
            padding: 0,
          }}
        >
          {/* Clinic Name */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>{clinicDet.clinicName}</Text>
          </View>
          {/* Clinic Address */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>{clinicDet.clinicAddress}</Text>
          </View>
        </View>
      </View>
    ));

  const ViewLang = () =>
    Languages.map((lang, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <View style={styles.bubble} key={index}>
        <Text style={{ color: 'white', fontSize: 12 }}>{lang}</Text>
      </View>
    ));

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
        setSelectedPDate(null);
        setselectedPSlotId(null);
        setSelectedPSlotTime(null);
        setSelectedPSlotEndTime(null);
        setclinicName('');
        setconsultationType(null);
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: selectedDate === item.date ? 'white' : 'black',
        }}
      >
        {dayjs(item.date).format('DD-MMM-YY')}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: selectedDate === item.date ? 'white' : 'black',
        }}
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
        setselectedSlotId(item.slotId);
        // setslots(item.slots);
        setSelectedSlotTime(item.startTime);
        setSelectedSlotEndTime(item.endTime);
        setMode('E_CONSULTATION');
        setconsultationType(item.typeOfEConsultation);
      }}
    >
      <FAIcon
        name={item.typeOfEConsultation === 'PHONE_CALL' ? 'phone-alt' : 'video'}
        size={15}
        color={selectedSlotId === item.slotId ? 'white' : '#2b8ada'}
        style={{ marginRight: 3 }}
      />
      <Text
        style={{
          fontSize: 10,
          color: selectedSlotId === item.slotId ? 'white' : 'black',
        }}
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

  const renderPDays = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.SlotDate,
        {
          backgroundColor: selectedPDate === item.date ? '#2b8ada' : '#e8f0fe',
        },
      ]}
      onPress={() => {
        setSelectedPDate(item.date);
        setselectedPSlotId(null);
        setSelectedDate(null);
        setselectedSlotId(null);
        setSelectedSlotTime(null);
        setSelectedSlotEndTime(null);
        setconsultationType(null);
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
      style={[
        styles.SlotTime,
        {
          backgroundColor: selectedPSlotId === item.slotId ? '#2b8ada' : '#e8f0fe',
        },
      ]}
      onPress={() => {
        setselectedPSlotId(item.slotId);
        // setslots(item.slots);
        setSelectedPSlotTime(item.startTime);
        setSelectedPSlotEndTime(item.endTime);
        setMode('P_CONSULTATION');
        setconsultationType('PHYSICAL');
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
          <HeaderPatient showMenu={false} title="About" />

          {DocObj !== null && DocObj.lastVisitDate !== null && (
            <View
              style={{
                backgroundColor: '#21c47f',
                padding: 10,
                borderColor: '#21c47f',
                borderWidth: 1,
                width: '95%',
                alignSelf: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                borderRadius: 10,
                marginVertical: 10,
                paddingHorizontal: 15,
              }}
            >
              <FAIcon
                name="info-circle"
                color="white"
                size={20}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  color: 'white',
                  fontSize: 12,
                }}
              >
                You previously consulted on {dayjs(DocObj.lastVisitDate).format('DD MMMM')}.
              </Text>
            </View>
          )}

          <DoctorBasicDetails DocDet={DocDet} />

          {/* E-Consult Label */}
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                styles.whiteLabelView,

                showEConsult && {
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showEConsult && { borderBottomWidth: 0.5, borderBottomColor: '#707070' },
                ]}
                onPress={() => {
                  setshowEConsult(!showEConsult);
                }}
              >
                <FAIcon
                  name="video"
                  size={12}
                  solid={false}
                  color={showEConsult ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text
                  style={[styles.label, { width: '85%' }, showEConsult && { color: '#2B8ADA' }]}
                >
                  E-Consultation
                </Text>
                <FAIcon
                  name={showEConsult ? 'chevron-down' : 'chevron-right'}
                  color={showEConsult ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* E-consult Body */}
          {showEConsult && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.whiteBodyView}>
                {/* Date and Slots */}
                <View
                  style={{
                    backgroundColor: 'white',
                    width: '95%',
                    alignSelf: 'center',
                  }}
                >
                  <Text style={styles.subLabel}>Select Date</Text>

                  {EDays !== '' ? (
                    <View
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        width: '95%',
                        flexDirection: 'column',
                        marginTop: 10,
                        backgroundColor: 'white',
                        flexWrap: 'wrap',
                      }}
                    >
                      <FlatList
                        data={EDays}
                        renderItem={renderDays}
                        keyExtractor={(item) => item.date}
                        numColumns={Math.floor(layout.width / 125)}
                        style={{ alignSelf: 'center' }}
                      />
                    </View>
                  ) : (
                    <Text
                      style={{
                        marginVertical: 10,
                        alignSelf: 'center',
                        fontSize: 12,
                      }}
                    >
                      All slots are booked this week. Please revisit after 7 days.
                    </Text>
                  )}
                </View>

                {selectedDate !== null && (
                  <View
                    style={{
                      backgroundColor: 'white',
                      width: '95%',
                      alignSelf: 'center',
                      marginVertical: 10,
                    }}
                  >
                    <Text style={styles.subLabel}>Select Slot</Text>
                    {ESlots !== '' ? (
                      <View
                        style={{
                          flex: 1,
                          alignSelf: 'center',
                          width: '95%',
                          flexDirection: 'row',
                          marginTop: 10,
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
                          marginVertical: 10,
                          alignSelf: 'center',
                          fontSize: 12,
                        }}
                      >
                        All slots are booked this week. Please revisit after 7 days.
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* P-Consult Label */}
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                styles.whiteLabelView,

                showPConsult && {
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showPConsult && { borderBottomWidth: 0.5, borderBottomColor: '#707070' },
                ]}
                onPress={() => {
                  setshowPConsult(!showPConsult);
                }}
              >
                <FAIcon
                  name="users"
                  size={12}
                  solid={false}
                  color={showPConsult ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text
                  style={[styles.label, { width: '85%' }, showPConsult && { color: '#2B8ADA' }]}
                >
                  P-Consultation
                </Text>
                <FAIcon
                  name={showPConsult ? 'chevron-down' : 'chevron-right'}
                  color={showPConsult ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* P-consult Body */}
          {showPConsult && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.whiteBodyView}>
                {/* Clinic Selection */}
                <View
                  style={{
                    backgroundColor: 'white',
                    width: '95%',
                    alignSelf: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.subLabel}>Select Clinic</Text>
                    <SelectList
                      // defaultOption={ClinicsDropDown[0].key}
                      placeholder={' '}
                      setSelected={(val) => {
                        setclinicName(val);
                        for (let i = 0; i < ClinicsDropDown.length; i += 1) {
                          if (val === ClinicsDropDown[i].value) {
                            // console.log(ClinicsDropDown[i].key);
                            setclinicId(ClinicsDropDown[i].key);
                            break;
                          }
                        }
                      }}
                      // onSelect={setAddress}
                      data={ClinicsDropDown}
                      save="value"
                      boxStyles={{
                        marginTop: 10,
                        width: '95%',
                        alignSelf: 'center',
                        backgroundColor: '#e8f0fe',
                        borderWidth: 0,
                        borderRadius: 5,
                      }}
                      dropdownItemStyles={
                        {
                          // borderBottomColor: '#2b8ada',
                          // borderBottomWidth: 2,
                        }
                      }
                      dropdownStyles={{
                        backgroundColor: 'white',
                        width: '90%',
                        alignSelf: 'center',
                      }}
                      dropdownTextStyles={{
                        color: 'gray',
                        fontWeight: 'bold',
                      }}
                      badgeStyles={{ backgroundColor: '#2b8ada' }}
                    />
                  </View>

                  {/* Date Label */}
                  {clinicName !== '' && (
                    <View
                      style={{
                        backgroundColor: 'white',
                        width: '95%',
                        alignSelf: 'center',
                        marginVertical: 10,
                      }}
                    >
                      <Text style={[styles.subLabel, { width: '100%' }]}>Select Date</Text>

                      {PDays !== '' ? (
                        <View
                          style={{
                            flex: 1,
                            alignSelf: 'center',
                            width: '95%',
                            flexDirection: 'column',
                            marginTop: 10,
                            backgroundColor: 'white',
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
                            marginVertical: 10,
                            alignSelf: 'center',
                            fontSize: 12,
                          }}
                        >
                          All slots are booked this week. Please revisit after 7 days.
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Slots Label */}
                  {PSlots !== null && (
                    <View
                      style={{
                        backgroundColor: 'white',
                        width: '95%',
                        alignSelf: 'center',
                        marginVertical: 10,
                      }}
                    >
                      <Text style={[styles.subLabel, { width: '100%' }]}>Select Slot</Text>
                      {PSlots !== '' ? (
                        <View
                          style={{
                            flex: 1,
                            alignSelf: 'center',
                            width: '95%',
                            flexDirection: 'row',
                            marginTop: 10,
                            backgroundColor: 'white',
                          }}
                        >
                          <FlatList
                            data={PSlots}
                            renderItem={renderPSlots}
                            keyExtractor={(item) => item.slotId}
                            numColumns={Math.floor(layout.width / 150)}
                            style={{ alignSelf: 'center' }}
                          />
                        </View>
                      ) : (
                        <Text
                          style={{
                            marginVertical: 10,
                            alignSelf: 'center',
                            fontSize: 12,
                          }}
                        >
                          All Slots are booked.
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
          {/* Fees Label */}
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                styles.whiteLabelView,

                showFeesDet && {
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showFeesDet && { borderBottomWidth: 0.5, borderBottomColor: '#707070' },
                ]}
                onPress={() => {
                  setShowFeesDet(!showFeesDet);
                }}
              >
                <FAIcon
                  name="money-bill-wave"
                  size={12}
                  color={showFeesDet ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text style={[styles.label, { width: '85%' }, showFeesDet && { color: '#2B8ADA' }]}>
                  Fees
                </Text>
                <FAIcon
                  name={showFeesDet ? 'chevron-down' : 'chevron-right'}
                  color={showFeesDet ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Fees Body */}
          {showFeesDet && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.whiteBodyView}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    paddingHorizontal: 10,
                  }}
                >
                  <View style={{ flexDirection: 'column', flex: 0.5 }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.subHeading}>Physical Fees</Text>
                      <Text style={{ fontSize: 12 }}>
                        {'₹ '}
                        {DocObj.feesInfo.phyiscalConsultationFees}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.subHeading}>P Follow-Up Fees</Text>
                      <Text style={{ fontSize: 12 }}>
                        {'₹ '}
                        {DocObj.feesInfo.physicalFollowUpFees}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.subHeading}>Follow-Up Duration</Text>
                      <Text style={{ fontSize: 12 }}>
                        {DocObj.feesInfo.followUpDuration} {' days'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'column', flex: 0.5 }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.subHeading}>E-Consultation Fees</Text>
                      <Text style={{ fontSize: 12 }}>
                        {'₹ '}
                        {DocObj.feesInfo.econsultationFees}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.subHeading}>E Follow-Up Fees</Text>
                      <Text style={{ fontSize: 12 }}>
                        {'₹ '}
                        {DocObj.feesInfo.efollowUpFees}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
          {/* Clinic Information Label */}
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                styles.whiteLabelView,
                showClinicDet && {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showClinicDet && { borderBottomWidth: 0.5, borderBottomColor: '#707070' },
                ]}
                onPress={() => {
                  setShowClinicDet(!showClinicDet);
                }}
              >
                <FAIcon
                  name="clinic-medical"
                  size={15}
                  color={showClinicDet ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text
                  style={[styles.label, { width: '85%' }, showClinicDet && { color: '#2B8ADA' }]}
                >
                  Clinic Information
                </Text>
                <FAIcon
                  name={showClinicDet ? 'chevron-down' : 'chevron-right'}
                  color={showClinicDet ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Clinic Information Body */}
          {showClinicDet && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.whiteBodyView}>
                <View>
                  {/* Heading */}
                  <View
                    style={{
                      flexDirection: 'column',
                      borderWidth: 1,
                      borderColor: '#d3d3d3',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      {/* <View style={styles.cellHeading}>
                        <Text style={styles.cellHeadingText}>Photo</Text>
                      </View> */}
                      <View style={styles.cellHeading}>
                        <Text style={styles.cellHeadingText}>Name</Text>
                      </View>
                      <View style={styles.cellHeading}>
                        <Text style={styles.cellHeadingText}>Address</Text>
                      </View>
                    </View>
                  </View>
                  <ViewClinics />
                </View>
              </View>
            </View>
          )}

          {/* Medical Registration Label */}
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                styles.whiteLabelView,
                showMedInfo && {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showMedInfo && { borderBottomWidth: 0.5, borderBottomColor: '#707070' },
                ]}
                onPress={() => {
                  if (!showMedInfo) {
                    setShowMedInfo(!showMedInfo);
                  } else {
                    setShowMedInfo(!showMedInfo);
                  }
                }}
              >
                <FAIcon
                  name="file-medical"
                  size={15}
                  color={showMedInfo ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text style={[styles.label, { width: '85%' }, showMedInfo && { color: '#2B8ADA' }]}>
                  Medical Registration
                </Text>
                <FAIcon
                  name={showMedInfo ? 'chevron-down' : 'chevron-right'}
                  color={showMedInfo ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Medical Registration Body */}
          {showMedInfo && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.whiteBodyView}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <View style={{ flexDirection: 'column', flex: 0.6 }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.subHeading}>Registration No :</Text>
                      <Text style={{ fontSize: 12 }}> {MedRegDet.registrationNo}</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.subHeading}>Reg. Council:</Text>
                      <Text style={{ fontSize: 12 }}> {MedRegDet.registrationCouncil}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'column', flex: 0.3 }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.subHeading}>Reg. Year :</Text>
                      <Text style={{ fontSize: 12 }}> {MedRegDet.registrationYear}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Education Qualification Label */}
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                styles.whiteLabelView,
                showEduInfo && {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showEduInfo && { borderBottomWidth: 0.5, borderBottomColor: '#707070' },
                ]}
                onPress={() => {
                  if (!showEduInfo) {
                    setShowEduInfo(!showEduInfo);
                  } else {
                    setShowEduInfo(!showEduInfo);
                  }
                }}
              >
                <MIcons
                  name="certificate"
                  size={20}
                  color={showEduInfo ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 2, alignSelf: 'center' }}
                />
                <Text style={[styles.label, { width: '85%' }, showEduInfo && { color: '#2B8ADA' }]}>
                  Education Qualification
                </Text>
                <FAIcon
                  name={showEduInfo ? 'chevron-down' : 'chevron-right'}
                  color={showEduInfo ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Education Qualification Body */}
          {showEduInfo && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.whiteBodyView}>
                <View>
                  {/* Heading */}
                  <View
                    style={{
                      flexDirection: 'column',
                      borderWidth: 1,
                      borderColor: '#d3d3d3',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <View style={[styles.cellHeading, { flex: 0.4 }]}>
                        <Text style={styles.cellHeadingText}>Degree</Text>
                      </View>
                      <View style={[styles.cellHeading, { flex: 0.4 }]}>
                        <Text style={styles.cellHeadingText}>Year</Text>
                      </View>
                      <View style={styles.cellHeading}>
                        <Text style={styles.cellHeadingText}>Speciality</Text>
                      </View>
                      <View style={styles.cellHeading}>
                        <Text style={styles.cellHeadingText}>University</Text>
                      </View>
                    </View>
                  </View>
                  <ViewEducation />
                </View>
              </View>
            </View>
          )}

          {/* Experience Label */}
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                styles.whiteLabelView,

                showExpDet && {
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showExpDet && { borderBottomWidth: 0.5, borderBottomColor: '#707070' },
                ]}
                onPress={() => {
                  setShowExpDet(!showExpDet);
                }}
              >
                <FAIcon
                  name="calendar-plus"
                  size={15}
                  color={showExpDet ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text style={[styles.label, { width: '85%' }, showExpDet && { color: '#2B8ADA' }]}>
                  Experience
                </Text>
                <FAIcon
                  name={showExpDet ? 'chevron-down' : 'chevron-right'}
                  color={showExpDet ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Experience Body */}
          {showExpDet && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.whiteBodyView}>
                <View>
                  {/* Heading */}
                  <View
                    style={{
                      flexDirection: 'column',
                      borderWidth: 1,
                      borderColor: '#d3d3d3',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <View style={styles.cellHeading}>
                        <Text style={styles.cellHeadingText}>Practice </Text>
                      </View>

                      <View style={styles.cellHeading}>
                        <Text style={styles.cellHeadingText}>Experience</Text>
                      </View>
                    </View>
                  </View>
                  {/* Body */}
                  <ViewExperience />
                </View>
              </View>
            </View>
          )}

          {/* Language Label */}
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <View
              style={[
                styles.whiteLabelView,
                showLangDet && {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  marginBottom: 0,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  { flexDirection: 'row', width: '100%' },
                  showLangDet && { borderBottomWidth: 0.5, borderBottomColor: '#707070' },
                ]}
                onPress={() => {
                  setshowLangDet(!showLangDet);
                }}
              >
                <FAIcon
                  name="language"
                  size={15}
                  color={showLangDet ? '#2b8ada' : 'gray'}
                  style={{ marginHorizontal: 5, alignSelf: 'center' }}
                />
                <Text style={[styles.label, { width: '85%' }, showLangDet && { color: '#2B8ADA' }]}>
                  Language
                </Text>
                <FAIcon
                  name={showLangDet ? 'chevron-down' : 'chevron-right'}
                  color={showLangDet ? '#2B8ADA' : 'gray'}
                  style={[styles.label, { width: '10%', fontSize: 20 }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Language Body */}
          {showLangDet && (
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.whiteBodyView}>
                <View style={{ flexDirection: 'row' }}>
                  <ViewLang />
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 50 }} />

          {consultationModeModal && (
            <RenderModal
              consultationModeModal={consultationModeModal}
              setconsultationModeModal={setconsultationModeModal}
              navigation={navigation}
            />
          )}
        </ScrollView>

        {ImageViewer && (
          <Modal
            animationType="slide"
            transparent
            visible={ImageViewer}
            onRequestClose={() => {
              setImageViewer(!ImageViewer);
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
                    Image Viewer
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
                      setImageViewer(false);
                      setDisplayPhotoToken(0);
                    }}
                  />
                </View>
                <View style={{ minHeight: 150, width: '100%' }}>
                  <ScrollView
                    style={{
                      padding: 10,
                      width: '100%',
                      alignSelf: 'center',
                      borderRadius: 7,
                      marginVertical: 10,
                      borderWidth: 2,
                      borderColor: 'gray',
                      minHeight: 200,
                    }}
                    scrollEnabled
                  >
                    {DisplayPhotoToken === 0 ? (
                      <Image
                        source={waiting}
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: `${apiConfig.baseUrl}/file/download?fileToken=${DisplayPhotoToken}&userId=${DocDet.doctorId}`,
                        }}
                        style={{
                          resizeMode: 'cover',
                          width: '100%',
                          height: 180,
                        }}
                      />
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {(selectedDate !== null && selectedSlotId !== null) ||
        (selectedPDate !== null && selectedPSlotId !== null && mode !== null) ? (
          <View
            style={{
              backgroundColor: '#2B8ADA',
              height: 45,
              flexDirection: 'row',
            }}
          >
            <CustomButton
              text="BOOK NOW"
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
                // console.log(mode, selectedPSlotId, selectedSlotId, patientDet.patientId);
                const slotId = mode === 'E_CONSULTATION' ? selectedSlotId : selectedPSlotId;
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
                  const date = mode === 'E_CONSULTATION' ? selectedDate : selectedPDate;
                  const time = mode === 'E_CONSULTATION' ? selectedSlotTime : selectedPSlotTime;
                  const endtime =
                    mode === 'E_CONSULTATION' ? selectedSlotEndTime : selectedPSlotEndTime;
                  // const slotId = mode === 'E_CONSULTATION' ? selectedSlotId : selectedPSlotId;

                  Alert.alert(
                    'Confirm Booking',
                    `Are you sure you want to book an appointment?\n${
                      mode === 'P_CONSULTATION' ? `\nClinic:- ${clinicName}` : ``
                    }\nOn Date:- ${dayjs(date).format('DD MMM, YYYY')}\nFrom:- ${timeformatter(
                      time
                    )}\nTo:-${timeformatter(endtime)}\nMode:- ${mode.split('_').join(' ')}`,
                    [
                      {
                        text: 'Yes',
                        onPress: async () => {
                          const x = {
                            clinicId,
                            consultationType,

                            doctorObj: DocObj,
                            doctorDet: DocDet,
                            mode,
                            slotDate: mode === 'E_CONSULTATION' ? selectedDate : selectedPDate,
                            slotId: mode === 'E_CONSULTATION' ? selectedSlotId : selectedPSlotId,
                            slotStartTime:
                              mode === 'E_CONSULTATION' ? selectedSlotTime : selectedPSlotTime,
                            slotEndTime:
                              mode === 'E_CONSULTATION'
                                ? selectedSlotEndTime
                                : selectedPSlotEndTime,
                          };
                          await AsyncStorage.setItem('ConfirmBookingDoctor', JSON.stringify(x));
                          navigation.navigate('ConfirmBooking');
                        },
                      },
                      {
                        text: 'No',
                        onPress: async () => {
                          const getSlotId =
                            mode === 'E_CONSULTATION' ? selectedSlotId : selectedPSlotId;
                          axios
                            .delete(
                              `${apiConfig.baseUrl}/patient/slot/prebooked/delete?consultation=${mode}&slotId=${getSlotId}`
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f0fe',
  },
  label: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    color: theme.colors.text.primary,
  },
  modalView: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    backgroundColor: 'white',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  whiteLabelView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    padding: 5,
  },
  whiteBodyView: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
  },
  cellStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#d3d3d3',
    paddingHorizontal: 1,
    paddingVertical: 3,
  },
  cellHeading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#d3d3d3',
    paddingHorizontal: 1,
    paddingVertical: 1,
    backgroundColor: '#2b8ada',
  },
  cellHeadingText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    marginVertical: 5,
    color: 'white',
  },
  cellText: { textAlign: 'center', fontSize: 11 },
  bubble: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#2b8ada',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 5,
    color: '#2b8ada',
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
