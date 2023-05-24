/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  View,
  Modal,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  LogBox,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import apiConfig from './API/apiConfig';
import defaultDoctor from '../../assets/doctor3x.png';
import CustomButton from './CustomButton';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

function RenderModal({ DoctorItem, consultationModeModal, setconsultationModeModal }) {
  const navigation = useNavigation();
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
                fontSize: 20,
                padding: 5,
                color: 'black',
              }}
            >
              Consultation Mode
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
                setconsultationModeModal(false);
              }}
            />
          </View>
          <View>
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Image
                source={
                  DoctorItem.photoPath === 0
                    ? defaultDoctor
                    : {
                        uri: `${apiConfig.baseUrl}/file/download?fileToken=${DoctorItem.photoPath}&userId=${DoctorItem.doctorId}`,
                      }
                }
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                  marginVertical: 5,
                  borderRadius: 10,
                  marginRight: 10,
                }}
              />

              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
                {DoctorItem.doctorName}
              </Text>
              {/* Degree */}
              <Text
                style={{
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: 12,
                  color: 'gray',
                }}
              >
                {DoctorItem.degrees.map((index) =>
                  DoctorItem.degrees.indexOf(index) !== DoctorItem.degrees.length - 1
                    ? `${index}, `
                    : index
                )}
              </Text>
              {/* Speciality */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {DoctorItem.specialization.map((index) => (
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
                    {DoctorItem.specialization.indexOf(index) !==
                    DoctorItem.specialization.length - 1
                      ? ','
                      : ''}
                  </Text>
                ))}
              </View>
            </View>
            <View style={{}}>
              <TouchableOpacity
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: '#2B8ADA',
                  borderRadius: 30,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  padding: 10,
                  marginBottom: 10,
                }}
                onPress={async () => {
                  await AsyncStorage.setItem('bookSlot', JSON.stringify(DoctorItem));
                  console.log(
                    '======================== All Symptoms ====================================',
                    DoctorItem
                  );
                  navigation.navigate('SelectSlotsE');
                  setconsultationModeModal(false);
                }}
              >
                <FAIcons name="video" color="white" size={16} />
                <Text style={{ color: 'white', fontSize: 14 }}>E-Consultation</Text>
                <Text style={{ color: 'white', fontSize: 14 }}>
                  ₹ {DoctorItem.econsultationFees}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: '#17CC9C',
                  borderRadius: 30,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  padding: 10,
                  marginBottom: 10,
                }}
                onPress={async () => {
                  await AsyncStorage.setItem('bookSlot', JSON.stringify(DoctorItem));
                  console.log(
                    '======================== All Symptoms ====================================',
                    DoctorItem
                  );
                  navigation.navigate('SelectSlotsP');
                  setconsultationModeModal(false);
                }}
              >
                <FAIcons name="users" color="white" size={16} />
                <Text style={{ color: 'white', fontSize: 14 }}>P-Consultation</Text>
                <Text style={{ color: 'white', fontSize: 14 }}>
                  ₹ {DoctorItem.pconsultationFees}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function DoctorCard({ DoctorsList }) {
  const [consultationModeModal, setconsultationModeModal] = useState(false);
  const [DoctorItem, setDoctorItem] = useState(null);
  const navigation = useNavigation();

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
            {Math.floor(item.totalExperienceInMonths / 12)}
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
      <TouchableOpacity
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          marginTop: 10,
        }}
      >
        {/* Fees */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {/* P-Consultation */}
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
          {/* E-Consultation */}
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
        {/* Follow-Up Duration */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 0.45,
            }}
          >
            {/* <Text style={styles.feesDetailsLabel}>Follow Up Days</Text>
              <Text style={styles.feesDetails}>{item.followUpDuration}</Text> */}
          </View>
        </View>
        {/* Follow-Up Fees */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {/* P-Consultation */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 0.45,
            }}
          >
            <Text style={styles.feesDetailsLabel}>P Follow-Up</Text>
            <Text style={styles.feesDetails}>₹ {item.physicalFollowUpFees}</Text>
          </View>
          {/* E-Consultation */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 0.45,
            }}
          >
            <Text style={styles.feesDetailsLabel}>E Follow-Up</Text>
            <Text style={styles.feesDetails}>₹ {item.efollowUpFees}</Text>
          </View>
        </View>
      </TouchableOpacity>
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

  return (
    <View>
      <View style={{ width: '95%', alignSelf: 'center' }}>
        <FlatList
          data={DoctorsList}
          key={(item) => item.doctorId}
          renderItem={renderListOfDoctors}
        />
      </View>
      {consultationModeModal && (
        <RenderModal
          DoctorItem={DoctorItem}
          consultationModeModal={consultationModeModal}
          setconsultationModeModal={setconsultationModeModal}
        />
      )}
    </View>
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
    alignSelf: 'center',
  },
  feesDetailsLabel: {
    textAlign: 'left',
    fontSize: 13,
    color: 'gray',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
