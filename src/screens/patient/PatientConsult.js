/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Modal,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  LogBox,
  Platform,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
// TODO: Change Icon to react-native-vector-icons
// import CheckBoxIcon from 'react-native-elements/dist/checkbox/CheckBoxIcon';
// import Header from '../../components/Header';
import HeaderPatient from '../../components/HeaderPatient';
import apiConfig from '../../components/API/apiConfig';
import CustomButton from '../../components/CustomButton';

// import doctor_m from '../Resources/doctor_m.png';
// import doctor_f from '../Resources/doctor_f.jpg';
import defaultDoctor from '../../../assets/doctor3x.png';

import waiting from '../../../assets/animations/waiting1.gif';
import DoctorCard from '../../components/DoctorCard';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function PatientConsult() {
  const [DoctorsList, setDoctorsList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [consultationModeModal, setconsultationModeModal] = useState(false);
  const [DoctorItem, setDoctorItem] = useState(null);
  // const [search, setsearch] = useState('');
  // const [searchData, setsearchData] = useState([]);
  // const [SortBy, setSortBy] = useState(false);
  // const [SortByAvailability, setSortByAvailability] = useState(false);
  // const [SortByExperience, setSortByExperience] = useState(false);
  // const [SortByPriceLH, setSortByPriceLH] = useState(false);
  // const [SortByPriceHL, setSortByPriceHL] = useState(false);
  // const [Filter, setFilter] = useState(false);
  // const [FilterExperience, setFilterExperience] = useState(false);
  // const [FilterExperienceValue, setFilterExperienceValue] = useState(null);
  const [FilterExperienceValueMin, setFilterExperienceValueMin] = useState(null);
  const [FilterExperienceValueMax, setFilterExperienceValueMax] = useState(null);
  // const [FilterFees, setFilterFees] = useState(false);
  // const [FilterFeesValue, setFilterFeesValue] = useState(null);
  const [FilterFeesValueMin, setFilterFeesValueMin] = useState(null);
  const [FilterFeesValueMax, setFilterFeesValueMax] = useState(null);
  // const [FilterLocation, setFilterLocation] = useState(false);
  // const [FilterLocationValue, setFilterLocationValue] = useState(null);
  // const [FilterSpl, setFilterSpl] = useState(false);
  const [FilterSplValue, setFilterSplValue] = useState(null);
  // const [FilterSplValueText, setFilterSplValueText] = useState(null);
  // const [FilterGender, setFilterGender] = useState(false);
  const [FilterGenderValue, setFilterGenderValue] = useState(null);
  // const [FilterMode, setFilterMode] = useState(false);
  const [FilterModeValue, setFilterModeValue] = useState(null);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused != null) {
      getDoctors();
    }
  }, [isFocused]);

  const getDoctors = async () => {
    setisLoading(true);

    await axios
      .get(`${apiConfig.baseUrl}/patient/doctors?max=10&min=0`)
      .then((response) => {
        if (response.status === 200) {
          setisLoading(false);
          setDoctorsList(response.data);
        }
      })
      .catch((error) => {
        setisLoading(false);
        Alert.alert('Error', `Error in fetching doctors \n${error}`);
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

  const renderListOfDoctors = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15,
        marginHorizontal: 5,
        // flexDirection: 'row',
        // flex: 1,
        marginTop: 10,
      }}
      key={item.doctorId}
    >
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          // borderBottomColor: 'gray',
          // borderBottomWidth: 2,
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
            marginRight: 10,
            flex: 0.5,
          }}
        />
        {/* Details */}
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'space-evenly',
            marginBottom: 5,
            flex: 1,
          }}
        >
          {/* Name */}
          <Text
            style={{
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: 18,
              color: 'black',
              flex: 1,
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
              flex: 1,
            }}
          >
            {item.degrees.map((index) =>
              item.degrees.indexOf(index) !== item.degrees.length - 1 ? `${index}, ` : index
            )}
          </Text>
          {/* Speciality */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
            {item.specialization.map((index) => (
              <Text
                key={index}
                style={[
                  {
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#2b8ada',
                  },
                ]}
              >
                {index}{' '}
                {item.specialization.indexOf(index) !== item.specialization.length - 1 ? ',' : ''}
              </Text>
            ))}
          </View>

          {/* Experience */}
          <Text
            style={{
              textAlign: 'left',
              color: 'black',
              fontSize: 12,
              flex: 1,
            }}
          >
            {Math.floor(item.totalExprienceInMonths / 12)}
            {' years of experience'}
          </Text>
          {/* City */}
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}
          >
            <FAIcons
              name="map-marker-alt"
              size={15}
              color="black"
              style={{ marginRight: 5, alignSelf: 'center' }}
            />
            <Text
              style={{
                textAlign: 'left',
                color: 'black',
                fontSize: 12,
                flex: 1,
              }}
            >
              {item.city}
            </Text>
          </View>
        </View>
      </View>
      {/* Fees Details */}
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 0.45,
            }}
          >
            <Text style={styles.feesDetailsLabel}>P-Consultation</Text>
            <Text style={styles.feesDetails}>₹ {item.pconsultationFees}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 0.45,
            }}
          >
            <Text style={styles.feesDetailsLabel}>E-Consultation</Text>
            <Text style={styles.feesDetails}>₹ {item.econsultationFees}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 0.45,
            }}
          >
            <Text style={styles.feesDetailsLabel}>Follow Up Fees</Text>
            <Text style={styles.feesDetails}>₹ {item.followUpFees}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 0.45,
            }}
          >
            <Text style={styles.feesDetailsLabel}>Follow Up Days</Text>
            <Text style={styles.feesDetails}>{item.followUpDuration}</Text>
          </View>
        </View>
      </View>
      {/* Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 10,
        }}
      >
        <CustomButton
          text="View Profile"
          textstyle={{ color: '#2b8ada', fontSize: 12 }}
          style={{
            borderColor: '#2b8ada',
            borderWidth: 2,
            padding: 5,
            borderRadius: 5,
            flex: 0.45,
          }}
          onPress={async () => {
            console.log(item.doctorName);
            await AsyncStorage.setItem('viewProfile', JSON.stringify(item));
            console.log(
              '======================== All Symptoms ====================================',
              item
            );
            navigation.navigate('DoctorDetails');
          }}
        />
        <CustomButton
          text="Book Appointment"
          textstyle={{ color: 'white', fontSize: 12 }}
          style={{
            backgroundColor: '#2b8ada',
            padding: 5,
            borderRadius: 5,
            flex: 0.45,
          }}
          onPress={() => {
            setconsultationModeModal(true);
            setDoctorItem(item);
          }}
        />
      </View>
    </View>
  );

  // function RenderModal() {
  //   return (
  //     <Modal
  //       animationType="slide"
  //       transparent
  //       visible={consultationModeModal}
  //       onRequestClose={() => {
  //         setconsultationModeModal(!consultationModeModal);
  //       }}
  //     >
  //       <View
  //         style={{
  //           height: '100%',
  //           backgroundColor: 'rgba(0,0,0,0.8)',
  //           flexDirection: 'row',
  //           justifyContent: 'center',
  //         }}
  //       >
  //         <View
  //           style={[
  //             styles.modalView,
  //             {
  //               borderRadius: 10,
  //               padding: 15,
  //             },
  //           ]}
  //         >
  //           <View
  //             style={{
  //               width: '100%',
  //               alignSelf: 'center',
  //               marginBottom: 20,
  //               borderBottomWidth: 1,
  //               borderBottomColor: 'gray',
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 fontWeight: 'bold',
  //                 fontSize: 20,
  //                 padding: 5,
  //                 color: 'black',
  //               }}
  //             >
  //               Consultation Mode
  //             </Text>
  //             <FAIcons
  //               name="window-close"
  //               color="black"
  //               size={26}
  //               style={{
  //                 position: 'absolute',
  //                 top: 0,
  //                 right: 0,
  //               }}
  //               onPress={() => {
  //                 setconsultationModeModal(false);
  //               }}
  //             />
  //           </View>
  //           <View>
  //             <View
  //               style={{
  //                 marginBottom: 10,
  //                 flexDirection: 'column',
  //                 alignItems: 'center',
  //               }}
  //             >
  //               <Image
  //                 source={
  //                   DoctorItem.photoPath == 0
  //                     ? defaultDoctor
  //                     : {
  //                         uri: `${apiConfig.baseUrl}/file/download?fileToken=${DoctorItem.photoPath}&userId=${DoctorItem.doctorId}`,
  //                       }
  //                 }
  //                 style={{
  //                   width: 100,
  //                   height: 100,
  //                   alignSelf: 'center',
  //                   marginVertical: 5,
  //                   borderRadius: 10,
  //                   marginRight: 10,
  //                 }}
  //               />

  //               <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
  //                 {DoctorItem.doctorName}
  //               </Text>
  //               {/* Degree */}
  //               <Text
  //                 style={{
  //                   textAlign: 'left',
  //                   fontWeight: 'bold',
  //                   fontSize: 12,
  //                   color: 'gray',
  //                 }}
  //               >
  //                 {DoctorItem.degrees.map((index) =>
  //                   DoctorItem.degrees.indexOf(index) != DoctorItem.degrees.length - 1
  //                     ? `${index}, `
  //                     : index
  //                 )}
  //               </Text>
  //               {/* Speciality */}
  //               <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  //                 {DoctorItem.specialization.map((index) => (
  //                   <Text
  //                     key={index}
  //                     style={[
  //                       {
  //                         textAlign: 'left',
  //                         color: 'gray',
  //                         fontSize: 12,
  //                         fontWeight: 'bold',
  //                         color: '#2b8ada',
  //                       },
  //                     ]}
  //                   >
  //                     {index}{' '}
  //                     {DoctorItem.specialization.indexOf(index) !=
  //                     DoctorItem.specialization.length - 1
  //                       ? ','
  //                       : ''}
  //                   </Text>
  //                 ))}
  //               </View>
  //             </View>
  //             <View style={{}}>
  //               <TouchableOpacity
  //                 style={{
  //                   width: '90%',
  //                   alignSelf: 'center',
  //                   backgroundColor: '#2B8ADA',
  //                   borderRadius: 30,
  //                   flexDirection: 'row',
  //                   justifyContent: 'space-around',
  //                   padding: 10,
  //                   marginBottom: 10,
  //                 }}
  //                 onPress={async () => {
  //                   await AsyncStorage.setItem('bookSlot', JSON.stringify(DoctorItem));
  //                   console.log(
  //                     '======================== All Symptoms ====================================',
  //                     DoctorItem
  //                   );
  //                   navigation.navigate('SelectSlotsE');
  //                   setconsultationModeModal(false);
  //                 }}
  //               >
  //                 <FAIcons name="video" color="white" size={16} />
  //                 <Text style={{ color: 'white', fontSize: 14 }}>E-Consultation</Text>
  //                 <Text style={{ color: 'white', fontSize: 14 }}>
  //                   ₹ {DoctorItem.econsultationFees}
  //                 </Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={{
  //                   width: '90%',
  //                   alignSelf: 'center',
  //                   backgroundColor: '#17CC9C',
  //                   borderRadius: 30,
  //                   flexDirection: 'row',
  //                   justifyContent: 'space-around',
  //                   padding: 10,
  //                   marginBottom: 10,
  //                 }}
  //                 onPress={async () => {
  //                   await AsyncStorage.setItem('bookSlot', JSON.stringify(DoctorItem));
  //                   console.log(
  //                     '======================== All Symptoms ====================================',
  //                     DoctorItem
  //                   );
  //                   navigation.navigate('SelectSlotsP');
  //                   setconsultationModeModal(false);
  //                 }}
  //               >
  //                 <FAIcons name="users" color="white" size={16} />
  //                 <Text style={{ color: 'white', fontSize: 14 }}>P-Consultation</Text>
  //                 <Text style={{ color: 'white', fontSize: 14 }}>
  //                   ₹ {DoctorItem.pconsultationFees}
  //                 </Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //       </View>
  //     </Modal>
  //   );
  // }

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
          nestedScrollEnabled
        >
          <HeaderPatient showMenu={false} title="Consult" />

          <DoctorCard DoctorsList={DoctorsList} />
          <View style={{ height: 50 }} />
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
  feesDetails: {
    textAlign: 'left',
    fontSize: 12,
    color: 'gray',
  },
  feesDetailsLabel: {
    textAlign: 'left',
    fontSize: 13,
    color: 'gray',
    fontWeight: 'bold',
  },
});
