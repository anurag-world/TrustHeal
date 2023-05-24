/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Modal,
  Text,
  TextInput,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  LogBox,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
// TODO: Uncomment below
// import CheckBoxIcon from 'react-native-elements/dist/checkbox/CheckBoxIcon';
import { useNavigation } from '@react-navigation/native';
import HeaderPatient from '../../components/HeaderPatient';
import apiConfig from '../../components/API/apiConfig';
import CustomButton from '../../components/CustomButton';

import defaultDoctor from '../../../assets/doctor3x.png';
import waiting from '../../../assets/animations/waiting1.gif';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function PatientFav() {
  const [isLoading, setisLoading] = useState(false);
  const [doctorDataList, setdoctorDataList] = useState([]);
  //   const [search, setsearch] = useState('');
  //   const [searchData, setsearchData] = useState([]);
  const [SortBy, setSortBy] = useState(false);
  const [SortByAvailability, setSortByAvailability] = useState(false);
  const [SortByExperience, setSortByExperience] = useState(false);
  const [SortByPriceLH, setSortByPriceLH] = useState(false);
  const [SortByPriceHL, setSortByPriceHL] = useState(false);
  const [Filter, setFilter] = useState(false);
  const [FilterExperience, setFilterExperience] = useState(false);
  const [FilterExperienceValue, setFilterExperienceValue] = useState(null);
  const [FilterExperienceValueMin, setFilterExperienceValueMin] = useState(null);
  const [FilterExperienceValueMax, setFilterExperienceValueMax] = useState(null);
  const [FilterFees, setFilterFees] = useState(false);
  const [FilterFeesValue, setFilterFeesValue] = useState(null);
  const [FilterFeesValueMin, setFilterFeesValueMin] = useState(null);
  const [FilterFeesValueMax, setFilterFeesValueMax] = useState(null);
  const [FilterLocation, setFilterLocation] = useState(false);
  const [FilterLocationValue, setFilterLocationValue] = useState(null);
  const [FilterSpl, setFilterSpl] = useState(false);
  const [FilterSplValue, setFilterSplValue] = useState(null);
  const [FilterSplValueText, setFilterSplValueText] = useState(null);
  const [FilterGender, setFilterGender] = useState(false);
  const [FilterGenderValue, setFilterGenderValue] = useState(null);
  const [FilterMode, setFilterMode] = useState(false);
  const [FilterModeValue, setFilterModeValue] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    getFavDoctor();
  }, []);
  const getFavDoctor = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
    setisLoading(true);
    axios
      .get(`${apiConfig.baseUrl}/patient/favourite/doctor?patientId=${x.patientId}`)
      .then((response) => {
        console.log(
          '\n=========================== FAVOURITE DOCTORS ====================================\n'
        );
        console.log(response.data);
        if (response.status === 200) {
          setisLoading(false);
          setdoctorDataList(response.data);
          // setdoctorDataList(serviceResponse);
        }
      })
      .catch((error) => {
        setisLoading(false);
        Alert.alert('Error Favourite', `${error}`);
      });
    setisLoading(false);
  };

  const dataExp = [
    { min: 0, max: 24 },
    { min: 24, max: 36 },
    { min: 36, max: 60 },
    { min: 60, max: 120 },
    { min: 120, max: 240 },
    { min: 240, max: 1200 },
  ];
  const renderExperienceList = ({ item }) => (
    <View style={styles.FilterValueView} key={item.min}>
      {/* TODO: Uncomment below */}
      {/* <CheckBoxIcon
        checkedColor="#2b8ada"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={FilterExperienceValueMax == item.max}
        onIconPress={() => {
          setFilterExperienceValueMin(item.min);
          setFilterExperienceValueMax(item.max);
        }}
      /> */}
      {item.max !== 1200 ? (
        <Text style={styles.FilterValueText}>
          {Math.floor(item.min / 12)}
          {' - '}
          {Math.floor(item.max / 12)} Years
        </Text>
      ) : (
        <Text style={styles.FilterValueText}> 20 + Years</Text>
      )}
    </View>
  );
  const dataFees = [
    { min: 0, max: 100 },
    { min: 100, max: 500 },
    { min: 500, max: 100 },
    { min: 1000, max: 1500 },
    { min: 1500, max: 2000 },
    { min: 2000, max: 2500 },
  ];
  const renderFeesList = ({ item }) => (
    <View style={styles.FilterValueView} key={item.min}>
      {/* TODO: Uncomment below */}
      {/* <CheckBoxIcon
        checkedColor="#2b8ada"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={FilterFeesValueMax == item.max}
        onIconPress={() => {
          setFilterFeesValueMin(item.min);
          setFilterFeesValueMax(item.max);
        }}
      /> */}
      <Text style={styles.FilterValueText}>
        ₹ {item.min} - {item.max}
      </Text>
    </View>
  );

  const data = [
    { key: 'Dermatologist', value: 'Dermatologist' },
    { key: 'Dietician & Nutition', value: 'Dietician & Nutition' },
    { key: 'ENT', value: 'ENT' },
    { key: 'Endocrinologist', value: 'Endocrinologist' },
    { key: 'Gastoentrologist', value: 'Gastoentrologist' },
    { key: 'Gynecologist', value: 'Gynecologist' },
    { key: 'Lifestyle Diseases', value: 'Lifestyle Diseases' },
    { key: 'Ophthalmologist', value: 'Ophthalmologist' },
    { key: 'Pediatrician', value: 'Pediatrician' },
    { key: 'Physician', value: 'Physician' },
    { key: 'Psychiatrist', value: 'Psychiatrist' },
    { key: 'Psychological Counselling', value: 'Psychological Counselling' },
    { key: 'Other', value: 'Other' },
  ];
  const renderSpecialityList = ({ item }) => (
    <View style={styles.FilterValueView} key={item.key}>
      {/* TODO: Uncomment below */}
      {/* <CheckBoxIcon
        checkedColor="#2b8ada"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={FilterSplValue == item.value}
        onIconPress={() => {
          setFilterSplValue(item.key);
        }}
      /> */}
      <Text style={styles.FilterValueText}>{item.key}</Text>
    </View>
  );
  const dataGender = [
    { key: 'Male', value: 'Male' },
    { key: 'Female', value: 'Female' },
    { key: 'Other', value: 'Other' },
  ];
  const renderGenderList = ({ item }) => (
    <View style={styles.FilterValueView} key={item.key}>
      {/* TODO: Uncomment below */}
      {/* <CheckBoxIcon
        checkedColor="#2b8ada"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={FilterGenderValue == item.value}
        onIconPress={() => {
          setFilterGenderValue(item.key);
        }}
      /> */}
      <Text style={styles.FilterValueText}>{item.key}</Text>
    </View>
  );
  const dataMode = [
    { key: 'P-Consultation', value: 'P-Consultation' },
    { key: 'Video Call', value: 'Video Call' },
    { key: 'Phone Call', value: 'Phone Call' },
  ];
  const renderModeList = ({ item }) => (
    <View style={styles.FilterValueView} key={item.key}>
      {/* TODO: Uncomment below */}
      {/* <CheckBoxIcon
        checkedColor="#2b8ada"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={FilterModeValue == item.value}
        onIconPress={() => {
          setFilterModeValue(item.key);
        }}
      /> */}
      <Text style={styles.FilterValueText}>{item.key}</Text>
    </View>
  );

  const renderDoctor = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 5,
        justifyContent: 'space-evenly',
        marginTop: 10,
      }}
      key={item.doctorId}
    >
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
        }}
      >
        {/* Image Pressable */}
        <TouchableOpacity
          style={{
            flex: 0.3,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          onPress={async () => {
            console.log(item.doctorName);
            await AsyncStorage.setItem('viewProfile', JSON.stringify(item));
            console.log(
              '======================== All Upcoming ====================================',
              item
            );
            navigation.navigate('DoctorDetails');
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
              width: 90,
              height: 90,
              borderRadius: 5,
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
        {/* Details Pressable */}
        <TouchableOpacity
          style={{
            flex: 0.6,
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          {/* Doctor Name */}
          <Text
            style={{
              flexDirection: 'row',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#033158',
            }}
          >
            {item.doctorName}
          </Text>
          {/* Doctor Degree */}
          <Text style={{ fontSize: 12, color: '#2b8ada', fontWeight: 'bold' }}>
            {item.degrees.map((index) =>
              item.degrees.indexOf(index) !== item.degrees.length - 1 ? `${index}, ` : index
            )}
          </Text>
          {/* Doctor Specialization */}
          <Text style={{ fontSize: 12, color: 'gray', fontWeight: 'bold' }}>
            {item.specialization.map((index) =>
              item.specialization.indexOf(index) !== item.specialization.length - 1
                ? `${index}, `
                : index
            )}
          </Text>
          {/* Doctor Experience */}
          <View style={{ flexDirection: 'row', marginVertical: 3 }}>
            <FAIcons
              name="calendar-alt"
              size={15}
              color="black"
              style={{ marginRight: 5, alignSelf: 'center' }}
            />
            <Text style={styles.CardText}>
              {Math.ceil(item.totalExperienceInMonths / 12)} year(s)
            </Text>
          </View>
          {/* Doctor Location */}
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 3,
            }}
          >
            <FAIcons
              name="map-marker-alt"
              size={15}
              color="black"
              style={{ marginRight: 5, alignSelf: 'center' }}
            />
            <Text style={[styles.CardText, { color: 'black' }]}>{item.city}</Text>
          </View>
        </TouchableOpacity>
        {/* Like Button */}
        <TouchableOpacity style={{ flex: 0.1 }} onPress={() => removeFavourite(item)}>
          <FAIcons name="heart" color="red" solid size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const removeFavourite = async (item) => {
    const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
    setisLoading(true);
    axios
      .delete(
        `${apiConfig.baseUrl}/patient/favourite/doctor/delete?doctorId=${item.doctorId}&patientId=${x.patientId}`
      )
      .then(async (response) => {
        if (response.status === 200) {
          Alert.alert('Doctor Removed', `${item.doctorName} has been removed from Favourite List.`);
          await getFavDoctor();
          setisLoading(false);
        }
      })
      .catch((error) => {
        setisLoading(false);
        console.log('Error Favourite', `${error}`);
      });
    setisLoading(false);
  };

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
          nestedScrollEnabled
        >
          <HeaderPatient showMenu={false} title="Favourite" />

          {/* Doctor Cards */}
          <View>
            {doctorDataList !== '' ? (
              <FlatList
                data={doctorDataList}
                key={(item) => item.doctorId}
                renderItem={renderDoctor}
              />
            ) : (
              <Text style={{ alignSelf: 'center', color: 'gray', marginTop: 100 }}>
                No Favourite Doctor(s)
              </Text>
            )}
          </View>
        </ScrollView>

        {isLoading && (
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
                }}
              >
                Loading...
              </Text>
            </View>
          </View>
        )}

        {SortBy && (
          <Modal
            animationType="slide"
            transparent
            visible={SortBy}
            onRequestClose={() => {
              setSortBy(!SortBy);
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
                      color: 'black',
                    }}
                  >
                    Sort By
                  </Text>

                  <FAIcons
                    name="window-close"
                    color="black"
                    size={26}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    }}
                    onPress={() => {
                      setSortByAvailability(false);
                      setSortByExperience(false);
                      setSortByPriceLH(false);
                      setSortByPriceHL(false);
                      setSortBy(false);
                    }}
                  />
                </View>
                {/* Options */}
                <View>
                  {/* Availability */}
                  <View style={[styles.SortOptionsView]}>
                    <Text style={{ color: 'black', flex: 1 }}>Earliest Availability</Text>
                    {/* TODO: Uncomment below */}
                    {/* <CheckBoxIcon
                      checkedColor="#2b8ada"
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checked={SortByAvailability}
                      onIconPress={() => setSortByAvailability(!SortByAvailability)}
                    /> */}
                  </View>
                  {/* Experience */}
                  <View style={[styles.SortOptionsView]}>
                    <Text style={{ color: 'black', flex: 1 }}>Most Experience</Text>
                    {/* TODO: Uncomment below */}
                    {/* <CheckBoxIcon
                      checkedColor="#2b8ada"
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checked={SortByExperience}
                      onIconPress={() => setSortByExperience(!SortByExperience)}
                    /> */}
                  </View>
                  {/* Low to High */}
                  <View style={[styles.SortOptionsView]}>
                    <Text style={{ color: 'black', flex: 1 }}>Doctor Fees ( Low to High )</Text>
                    {/* TODO: Uncomment below */}
                    {/* <CheckBoxIcon
                      checkedColor="#2b8ada"
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checked={SortByPriceLH}
                      onIconPress={() => {
                        setSortByPriceLH(!SortByPriceLH);
                        setSortByPriceHL(false);
                      }}
                    /> */}
                  </View>
                  {/* High to Low */}
                  <View style={[styles.SortOptionsView]}>
                    <Text style={{ color: 'black', flex: 1 }}>Doctor Fees ( High to Low )</Text>
                    {/* TODO: Uncomment below */}
                    {/* <CheckBoxIcon
                      checkedColor="#2b8ada"
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checked={SortByPriceHL}
                      onIconPress={() => {
                        setSortByPriceLH(false);
                        setSortByPriceHL(!SortByPriceHL);
                      }}
                    /> */}
                  </View>
                </View>

                {SortByAvailability ||
                  SortByExperience ||
                  SortByPriceHL ||
                  (SortByPriceLH && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        width: '95%',
                        alignSelf: 'center',
                      }}
                    >
                      <CustomButton
                        text="Apply"
                        textstyle={{
                          color: 'white',
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}
                        style={{
                          flex: 0.45,
                          backgroundColor: '#2b8ada',
                          borderRadius: 10,
                          padding: 5,
                          borderColor: '#2b8ada',
                          borderWidth: 2,
                        }}
                        onPress={() => {
                          setSortBy(false);
                        }}
                      />
                      <CustomButton
                        text="Cancel"
                        textstyle={{
                          color: '#2b8ada',
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}
                        style={{
                          flex: 0.45,
                          borderColor: '#2b8ada',
                          borderWidth: 2,
                          borderRadius: 10,
                          padding: 5,
                        }}
                        onPress={() => {
                          setSortByAvailability(false);
                          setSortByExperience(false);
                          setSortByPriceLH(false);
                          setSortByPriceHL(false);
                          setSortBy(false);
                        }}
                      />
                    </View>
                  ))}
              </View>
            </View>
          </Modal>
        )}

        {Filter && (
          <Modal
            animationType="slide"
            transparent
            visible={Filter}
            onRequestClose={() => {
              setFilter(!Filter);
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: '#e8f0fe',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  backgroundColor: 'black',
                  width: '100%',
                  height: '8%',
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    flex: 0.6,
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setFilter(false);
                    setFilterExperience(false);
                    setFilterFees(false);
                    setFilterSpl(false);
                    setFilterLocation(false);
                    setFilterGender(false);
                    setFilterMode(false);
                  }}
                >
                  <FAIcons
                    name="chevron-left"
                    color="white"
                    size={20}
                    style={{ alignSelf: 'center', marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}
                  >
                    Filter
                  </Text>
                </TouchableOpacity>
                {/* Button Actions */}
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: 'row',
                  }}
                >
                  <CustomButton
                    text="Clear Filter"
                    textstyle={{
                      color: '#2b8ada',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                    style={{
                      backgroundColor: 'white',
                      width: 100,
                      paddingVertical: 5,
                      margin: 15,
                    }}
                    onPress={() => {
                      setFilterExperienceValue(null);
                      setFilterExperienceValueMax(null);
                      setFilterExperienceValueMin(null);
                      setFilterFeesValue(null);
                      setFilterFeesValueMax(null);
                      setFilterFeesValueMin(null);
                      setFilterSplValue(null);
                      setFilterSplValueText(null);
                      setFilterLocationValue(null);
                      setFilterGenderValue(null);
                      setFilterModeValue(null);
                      setFilterExperience(true);
                      setFilterFees(false);
                      setFilterSpl(false);
                      setFilterLocation(false);
                      setFilterGender(false);
                      setFilterMode(false);
                      // setFilter(false);
                    }}
                  />
                </View>
              </View>
              {/* Body */}
              <View style={{ flexDirection: 'row', height: '84%' }}>
                {/* Filter Labels */}
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 0.45,
                    backgroundColor: '#e8f0fe',
                    justifyContent: 'space-evenly',
                  }}
                >
                  {/* Experience Label */}
                  <TouchableOpacity
                    style={[
                      styles.filterOptionsView,
                      {
                        backgroundColor: FilterExperience ? 'white' : '#e8f0fe',
                      },
                    ]}
                    onPress={() => {
                      setFilterExperience(true);
                      setFilterFees(false);
                      setFilterSpl(false);
                      setFilterLocation(false);
                      setFilterGender(false);
                      setFilterMode(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionsText,
                        { color: FilterExperience ? '#2b8ada' : '#033158' },
                      ]}
                    >
                      Experience
                    </Text>
                  </TouchableOpacity>
                  {/* Fees Label */}
                  <TouchableOpacity
                    style={[
                      styles.filterOptionsView,
                      {
                        backgroundColor: FilterFees ? 'white' : '#e8f0fe',
                      },
                    ]}
                    onPress={() => {
                      setFilterExperience(false);
                      setFilterFees(true);
                      setFilterSpl(false);
                      setFilterLocation(false);
                      setFilterGender(false);
                      setFilterMode(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionsText,
                        { color: FilterFees ? '#2b8ada' : '#033158' },
                      ]}
                    >
                      Doctor Fees
                    </Text>
                  </TouchableOpacity>
                  {/* Specialization Label */}
                  <TouchableOpacity
                    style={[
                      styles.filterOptionsView,
                      {
                        backgroundColor: FilterSpl ? 'white' : '#e8f0fe',
                      },
                    ]}
                    onPress={() => {
                      setFilterExperience(false);
                      setFilterFees(false);
                      setFilterSpl(true);
                      setFilterLocation(false);
                      setFilterGender(false);
                      setFilterMode(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionsText,
                        { color: FilterSpl ? '#2b8ada' : '#033158' },
                      ]}
                    >
                      Specialization
                    </Text>
                  </TouchableOpacity>
                  {/* Location Label */}
                  <TouchableOpacity
                    style={[
                      styles.filterOptionsView,
                      {
                        backgroundColor: FilterLocation ? 'white' : '#e8f0fe',
                      },
                    ]}
                    onPress={() => {
                      setFilterExperience(false);
                      setFilterFees(false);
                      setFilterSpl(false);
                      setFilterLocation(true);
                      setFilterGender(false);
                      setFilterMode(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionsText,
                        { color: FilterLocation ? '#2b8ada' : '#033158' },
                      ]}
                    >
                      Location
                    </Text>
                  </TouchableOpacity>
                  {/* Gender Label */}
                  <TouchableOpacity
                    style={[
                      styles.filterOptionsView,
                      {
                        backgroundColor: FilterGender ? 'white' : '#e8f0fe',
                      },
                    ]}
                    onPress={() => {
                      setFilterExperience(false);
                      setFilterFees(false);
                      setFilterSpl(false);
                      setFilterLocation(false);
                      setFilterGender(true);
                      setFilterMode(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionsText,
                        { color: FilterGender ? '#2b8ada' : '#033158' },
                      ]}
                    >
                      Gender
                    </Text>
                  </TouchableOpacity>
                  {/* Mode Label */}
                  <TouchableOpacity
                    style={[
                      styles.filterOptionsView,
                      {
                        backgroundColor: FilterMode ? 'white' : '#e8f0fe',
                      },
                    ]}
                    onPress={() => {
                      setFilterExperience(false);
                      setFilterFees(false);
                      setFilterSpl(false);
                      setFilterLocation(false);
                      setFilterGender(false);
                      setFilterMode(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionsText,
                        { color: FilterMode ? '#2b8ada' : '#033158' },
                      ]}
                    >
                      Mode
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Filter Values */}
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 0.55,
                    backgroundColor: 'white',
                  }}
                >
                  {/* Experience Values */}
                  {FilterExperience && (
                    <View style={{ flexDirection: 'column' }}>
                      <FlatList
                        data={dataExp}
                        key={(item) => item.min}
                        renderItem={renderExperienceList}
                      />
                    </View>
                  )}

                  {/* Fees Values */}
                  {FilterFees && (
                    <View style={{ flexDirection: 'column' }}>
                      <FlatList
                        data={dataFees}
                        key={(item) => item.min}
                        renderItem={renderFeesList}
                      />
                    </View>
                  )}

                  {/* Specialization Values */}
                  {FilterSpl && FilterSplValue !== 'Other' ? (
                    <View style={{ flexDirection: 'column' }}>
                      <FlatList
                        data={data}
                        key={(item) => item.key}
                        renderItem={renderSpecialityList}
                      />
                    </View>
                  ) : null}

                  {/* Specialization Other Value */}
                  {FilterSpl && FilterSplValue === 'Other' ? (
                    <View style={{ marginTop: 20, flexDirection: 'column' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          paddingBottom: 3,
                          marginBottom: 3,
                          color: '#2b8ada',
                          borderBottomWidth: 2,
                          borderBottomColor: '#2b8ada',
                          width: '95%',
                          alignSelf: 'center',
                        }}
                      >
                        Other Speciality
                      </Text>
                      <TextInput
                        placeholder="Enter Speciality"
                        onChangeText={(text) => setFilterSplValueText(text)}
                        maxLength={20}
                        value={FilterSplValueText}
                        style={{
                          marginTop: 10,
                          borderColor: '#2b8ada',
                          borderWidth: 2,
                          borderRadius: 10,
                          paddingHorizontal: 15,
                          width: '95%',
                          alignSelf: 'center',
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          width: '100%',
                          justifyContent: 'space-evenly',
                        }}
                      >
                        <CustomButton
                          text="Done"
                          textstyle={{ color: 'white', fontSize: 12 }}
                          style={{
                            borderColor: '#2b8ada',
                            borderWidth: 1,
                            backgroundColor: '#2b8ada',
                            padding: 5,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                          }}
                          onPress={() => {
                            setFilterSpl(false);
                            setFilterLocation(true);
                          }}
                        />
                        <CustomButton
                          text="Cancel"
                          textstyle={{ color: '#2b8ada', fontSize: 12 }}
                          style={{
                            borderColor: '#2b8ada',
                            borderWidth: 1,
                            padding: 5,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                          }}
                          onPress={() => setFilterSplValue(null)}
                        />
                      </View>
                    </View>
                  ) : null}
                  {/* Location Value */}

                  {FilterLocation ? (
                    <View style={{ marginTop: 20, flexDirection: 'column' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          paddingBottom: 3,
                          marginBottom: 3,
                          color: '#2b8ada',
                          borderBottomWidth: 2,
                          borderBottomColor: '#2b8ada',
                          width: '95%',
                          alignSelf: 'center',
                        }}
                      >
                        Location
                      </Text>
                      <TextInput
                        placeholder="Enter City Name"
                        onChangeText={(text) => setFilterLocationValue(text)}
                        maxLength={20}
                        value={FilterLocationValue}
                        style={{
                          marginTop: 10,
                          borderColor: '#2b8ada',
                          borderWidth: 2,
                          borderRadius: 10,
                          paddingHorizontal: 15,
                          width: '95%',
                          alignSelf: 'center',
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          width: '100%',
                          justifyContent: 'space-evenly',
                        }}
                      >
                        <CustomButton
                          text="Done"
                          textstyle={{ color: 'white', fontSize: 12 }}
                          style={{
                            borderColor: '#2b8ada',
                            borderWidth: 1,
                            backgroundColor: '#2b8ada',
                            padding: 5,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                          }}
                          onPress={() => {
                            setFilterLocation(false);
                            setFilterGender(true);
                          }}
                        />
                        <CustomButton
                          text="Cancel"
                          textstyle={{ color: '#2b8ada', fontSize: 12 }}
                          style={{
                            borderColor: '#2b8ada',
                            borderWidth: 1,
                            padding: 5,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                          }}
                          onPress={() => setFilterLocationValue(null)}
                        />
                      </View>
                    </View>
                  ) : null}
                  {/* Gender Values */}
                  {FilterGender && (
                    <View style={{ flexDirection: 'column' }}>
                      <FlatList
                        data={dataGender}
                        key={(item) => item.key}
                        renderItem={renderGenderList}
                      />
                    </View>
                  )}

                  {/* Gender Values */}
                  {FilterMode && (
                    <View style={{ flexDirection: 'column' }}>
                      <FlatList
                        data={dataMode}
                        key={(item) => item.key}
                        renderItem={renderModeList}
                      />
                    </View>
                  )}
                </View>
              </View>

              {/* Footer */}
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  backgroundColor: '#2b8ada',
                  width: '100%',
                  height: '8%',
                }}
              >
                {/* Result Details */}
                <View
                  style={{
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    flex: 0.6,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  >
                    412152
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  >
                    Doctors Found
                  </Text>
                </View>
                {/* Button Actions */}
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: 'row',
                  }}
                >
                  <CustomButton
                    text="Apply"
                    textstyle={{
                      color: '#2b8ada',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                    style={{
                      backgroundColor: 'white',
                      width: 100,
                      paddingVertical: 5,
                      margin: 15,
                    }}
                    onPress={() => setFilter(false)}
                  />
                </View>
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
    backgroundColor: '#e8f0fe',
  },
  searchBar: {
    height: 40,
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
  searchBarText: {
    width: '90%',
  },
  searchIcon: {
    right: 0,
    top: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  Buttons: {
    flex: 0.45,
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
    borderColor: '#2b8ada',
    borderWidth: 1,
  },
  ButtonsText: { color: '#2b8ada', fontWeight: 'bold' },
  ButtonIcon: {
    alignSelf: 'center',
    marginRight: 5,
  },
  modalView: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    backgroundColor: 'white',
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  SortOptionsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    padding: 5,
    marginBottom: 5,
  },
  filterOptionsText: {
    textAlign: 'center',
    width: '100%',
    color: '#033158',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterOptionsView: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FilterValueView: {
    padding: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    marginTop: 10,
  },
  FilterValueText: {
    fontSize: 15,
    marginLeft: 10,
  },
  tag: {
    color: 'white',
    padding: 5,
    fontSize: 5,
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  CardText: {
    fontSize: 12,
    color: 'black',
  },
});
