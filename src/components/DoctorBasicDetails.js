/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Alert, View, Text, Image, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import apiConfig from './API/apiConfig';
import defaultDoctor from '../../assets/doctor3x.png';
import totalExperience from './functions';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function DoctorBasicDetails({ DocDet }) {
  const [favDocList, setfavDocList] = useState(null);
  const [isFav, setisFav] = useState(false);

  useEffect(() => {
    const getFavDoctor = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));

      // setisLoading(true);
      axios
        .get(`${apiConfig.baseUrl}/patient/favourite/doctor?patientId=${x.patientId}`)
        .then((response) => {
          console.log(
            '\n=========================== FAVOURITE DOCTORS ====================================\n'
          );
          console.log(response.data);
          if (response.status === 200) {
            // setisLoading(false);
            // setdoctorDataList(response.data);
            setfavDocList(response.data);

            response.data.forEach((element) => {
              if (element.doctorId === DocDet.doctorId) setisFav(true);
            });
          }
        })
        .catch((error) => {
          // setisLoading(false);
          Alert.alert('Error Favourite', `${error}`);
          console.log(`${error}`);
        });
      // setisLoading(false);
    };

    if (DocDet != null) getFavDoctor();
  }, [DocDet]);

  const addFav = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));

    axios
      .post(
        `${apiConfig.baseUrl}/patient/favourite/doctor/save?doctorId=${DocDet.doctorId}&patientId=${x.patientId}`
      )
      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Done', `${DocDet.doctorName} added to favourite list.`);
          setisFav(true);
        } else Alert.alert('Warning', 'You can only add max of 10 doctors to favourite list');
      })
      .catch((response) => {
        Alert.alert('Warning', 'You can only add max of 5 doctors to favourite list');
      });
  };

  const removeFav = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));

    axios
      .delete(
        `${apiConfig.baseUrl}/patient/favourite/doctor/delete?doctorId=${DocDet.doctorId}&patientId=${x.patientId}`
      )
      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Done', `${DocDet.doctorName} removed from favourite list.`);
          setisFav(false);
        }
      })
      .catch((response) => {
        Alert.alert('Error', `${response}`);
      });
  };

  return (
    <View style={{ marginVertical: 10, alignSelf: 'center' }}>
      <View
        style={{
          alignSelf: 'center',
          padding: 3,
          borderColor: '#2b8ada',
          borderWidth: 5,
          borderRadius: 500,
          backgroundColor: 'white',
        }}
      >
        {DocDet == null || DocDet.photoPath === 0 ? (
          <Image
            // source={DocDet == null || DocDet.gender == "Male"?defaultDoctor:defaultDoctor_female}
            source={defaultDoctor}
            style={{
              width: 100,
              height: 100,
              alignSelf: 'center',
              borderRadius: 100,
            }}
          />
        ) : (
          <Image
            source={{
              uri: `${apiConfig.baseUrl}/file/download?fileToken=${DocDet.photoPath}&userId=${DocDet.doctorId}`,
            }}
            // source={doctor_m}
            style={{
              width: 100,
              height: 100,
              alignSelf: 'center',
              borderRadius: 100,
            }}
          />
        )}
      </View>
      {/* Name */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          alignSelf: 'center',
          color: 'black',
          marginTop: 2,
        }}
      >
        {DocDet != null ? DocDet.doctorName : null}
      </Text>
      {/* Experience */}
      <Text
        style={{
          // backgroundColor: '#2B8ADA',
          color: 'white',
          marginTop: 5,
          borderRadius: 10,
          alignSelf: 'center',
          fontWeight: 'bold',
          backgroundColor: '#2b8ada',
          padding: 3,
          paddingHorizontal: 15,
        }}
      >
        {DocDet != null ? totalExperience(DocDet.totalExperienceInMonths) : null}
      </Text>
      {/* Specialization */}
      <Text
        style={{
          fontSize: 15,
          // backgroundColor: '#2b8ada',
          color: 'gray',
          alignSelf: 'center',
          marginTop: 5,
          fontWeight: 'bold',
          padding: 3,
          paddingHorizontal: 10,
          borderRadius: 5,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        {DocDet != null
          ? DocDet.specialization.map((index) =>
              DocDet.specialization.indexOf(index) !== DocDet.specialization.length - 1
                ? `${index}, `
                : index
            )
          : null}
      </Text>
      {/* Favourite */}
      <TouchableOpacity
        style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 5 }}
        onPress={() => {
          if (isFav) removeFav();
          else addFav();
        }}
      >
        <FAIcons name="heart" solid={isFav} color="red" size={15} style={{ marginRight: 5 }} />
        <Text style={[{ fontSize: 13 }, isFav ? { color: 'red' } : { color: 'gray' }]}>
          {isFav ? 'Added to Favourite List' : 'Add to Favourite List'}
        </Text>
      </TouchableOpacity>
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
});
