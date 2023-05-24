/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
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
import axios from 'axios';
import { isEmpty } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import HeaderPatient from '../../components/HeaderPatient';
import apiConfig from '../../components/API/apiConfig';
import waiting from '../../../assets/animations/waiting1.gif';
import DoctorCard from '../../components/DoctorCard';
import RenderSymptoms from '../../components/patient/RenderSymptoms';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function AllSymptoms() {
  const [isLoading, setisLoading] = useState(false);
  const [findMode, setfindMode] = useState(true);
  const [patientDet, setpatientDet] = useState(null);
  const [CategoryList, setCategoryList] = useState(null);
  const [CategorySymptomsList, setCategorySymptomsList] = useState(null);
  const [searchSymptomList, setsearchSymptomList] = useState([]);
  const [searchSpecialityList, setsearchSpecialityList] = useState([]);
  const [DisplaySpecialityList, setDisplaySpecialityList] = useState([]);
  const [showLabel, setshowLabel] = useState(true);
  const [DoctorsList, setDoctorsList] = useState(null);

  useEffect(() => {
    const getPatientDet = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      setpatientDet(x);
    };

    const getCategory = async () => {
      axios
        .get(`${apiConfig.baseUrl}/suggest/symptoms/category`)
        .then((response) => {
          /* console.log(
            '\n=========================== CATEGORIES DATA ====================================\n'
          ); */
          // console.log(response.data);
          if (response.status === 200) {
            // console.log(response.data);
            setCategoryList(response.data.category);
            setisLoading(false);
          }
        })
        .catch((error) => {
          setisLoading(false);
          Alert.alert('Error', `${error}`);
        });
    };
    setisLoading(true);
    getPatientDet();
    getCategory();
    setsearchSpecialityList([]);
    setsearchSymptomList([]);
  }, []);

  useEffect(() => {
    const getSymptoms = async () => {
      const p = [];

      for (let i = 0; i < CategoryList.length; i += 1) {
        axios
          .get(`${apiConfig.baseUrl}/suggest/symptom/by/category?category=${CategoryList[i]}`)
          .then((response) => {
            // console.log(`\n\n=======    ${CategoryList[i]} ===========\n\n`, response.data);

            if (response.status === 200 && response.data !== '') {
              // TODO: Check below code
              response.data.forEach((element) => {
                // eslint-disable-next-line no-param-reassign
                element.active = false;
              });

              p.push({
                category: CategoryList[i],
                symptoms: response.data,
                active: false,
              });
            }
          });
      }
      // console.log('===============  CATEGORIES WITH SYMPTOMS=================\n\n', p);
      setCategorySymptomsList(p);
    };

    if (CategoryList != null) getSymptoms();
  }, [CategoryList]);

  const flip = (index, active) => {
    const temp = [...CategorySymptomsList];
    temp[index].active = !active;
    setCategorySymptomsList(temp);
  };
  const selectSymptom = (index, i, active) => {
    const temp = [...CategorySymptomsList];
    // TODO: Check code
    temp[index].symptoms.forEach((item, a) => {
      // eslint-disable-next-line no-param-reassign
      if (a === i) item.active = !active;
    });
    setCategorySymptomsList(temp);
  };
  const insertSymptom = (symptoms, speciality) => {
    // if (!searchSymptomList.includes(symptoms))
    searchSymptomList.push(symptoms);
    // if (!searchSpecialityList.includes(speciality))
    searchSpecialityList.push(speciality);
    // console.log('============= Selected Symptoms are===========', searchSymptomList);
    // console.log('============= Suggested Speciality are===========', searchSpecialityList);
  };

  const deleteSymptom = (symptoms, speciality) => {
    if (searchSymptomList.includes(symptoms)) {
      const p = [...searchSymptomList];
      const index = searchSymptomList.indexOf(symptoms);
      p.splice(index, 1);
      setsearchSymptomList(p);
    }
    if (searchSpecialityList.includes(speciality)) {
      const p = [...searchSpecialityList];
      const index = searchSpecialityList.indexOf(speciality);
      p.splice(index, 1);
      setsearchSpecialityList(p);
    }
    // console.log('============= Selected Symptoms are===========', searchSymptomList);
    // console.log('============= Suggested Speciality are===========', searchSpecialityList);
  };

  const getDoctors = async () => {
    setisLoading(true);
    let x = '';
    const p = [...new Set(searchSpecialityList)];
    setDisplaySpecialityList(p);
    // console.log('Fetching doctors with\n', p);

    p.forEach((element) => {
      x += `&speciality=${element}`;
    });
    await axios
      .get(`${apiConfig.baseUrl}/patient/doctor/by/speciality?max=5&min=0${x}`)
      .then((response) => {
        if (response.status === 200) {
          setisLoading(false);
          // console.log(response.data);
          setfindMode(false);
          setDoctorsList(response.data);
        }
      })
      .catch((error) => {
        setisLoading(false);
        Alert.alert('Error', `${error}`);
      });
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
          <HeaderPatient showMenu={false} title="All Symptoms" />
          {findMode ? (
            <View>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={[
                    {
                      backgroundColor: '#2b8ada',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      padding: 5,
                    },
                    showLabel
                      ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
                      : { borderRadius: 10 },
                  ]}
                  onPress={() => {
                    setshowLabel(!showLabel);
                  }}
                >
                  <View>
                    <Text
                      style={[
                        {
                          fontSize: 15,
                          fontWeight: 'bold',
                          marginVertical: 5,
                          paddingHorizontal: 10,
                          color: 'white',
                        },
                      ]}
                    >
                      Selected Symptoms List
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <FAIcons
                      name={showLabel ? 'chevron-down' : 'chevron-right'}
                      size={20}
                      style={[
                        {
                          alignSelf: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        },
                        { color: 'white' },
                      ]}
                    />
                  </View>
                </TouchableOpacity>

                {showLabel && (
                  <View style={styles.whiteBodyView}>
                    {searchSymptomList !== '' ? (
                      <View>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                          {searchSymptomList.map((index) => (
                            <Text
                              key={index}
                              style={{
                                padding: 5,
                                paddingHorizontal: 10,
                                backgroundColor: '#17CC9C',
                                color: 'white',
                                borderRadius: 10,
                                fontSize: 13,
                                margin: 3,
                              }}
                            >
                              {index}
                            </Text>
                          ))}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              zIndex: 3,
                              flex: 0.45,
                              justifyContent: 'center',
                              backgroundColor: '#2b8ada',
                              padding: 7,
                              paddingHorizontal: 15,
                              borderRadius: 5,
                              alignSelf: 'center',
                              flexDirection: 'row',
                              marginVertical: 10,
                            }}
                            onPress={async () => {
                              // setDoctorsList(null);
                              await getDoctors();
                            }}
                          >
                            <FAIcons
                              name="search"
                              size={15}
                              color="white"
                              style={{ alignSelf: 'center', marginRight: 5 }}
                            />
                            <Text
                              style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 12,
                              }}
                            >
                              Find Doctors
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            alignSelf: 'center',
                            fontSize: 12,
                            color: 'black',
                          }}
                        >
                          Please select symptoms from the list below
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              {!isEmpty(CategorySymptomsList) && (
                <RenderSymptoms
                  CategorySymptomsList={CategorySymptomsList}
                  flip={flip}
                  selectSymptom={selectSymptom}
                  insertSymptom={insertSymptom}
                  deleteSymptom={deleteSymptom}
                />
              )}
            </View>
          ) : (
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
              }}
            >
              {/* Filter */}
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  marginTop: 20,
                }}
              >
                {/* Heading */}
                <Text
                  style={{
                    width: '100%',
                    padding: 10,
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: '#2b8ada',
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    fontSize: 15,
                  }}
                >
                  Showing results for{' '}
                  {DisplaySpecialityList.length === 1 ? 'speciality' : 'specialities'}
                </Text>

                {/* Specialities */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: '95%',
                    alignSelf: 'center',
                    flexWrap: 'wrap',
                    marginVertical: 5,
                  }}
                >
                  {DisplaySpecialityList.map((index) => (
                    <Text
                      key={index}
                      style={{
                        padding: 5,
                        paddingHorizontal: 7,
                        backgroundColor: '#17CC9C',
                        color: 'white',
                        borderRadius: 10,
                        fontSize: 13,
                        margin: 3,
                      }}
                    >
                      {index}
                    </Text>
                  ))}
                </View>

                {/* Edit Speciality */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#2b8ada',
                    padding: 5,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    marginVertical: 10,
                  }}
                  onPress={async () => {
                    setfindMode(true);
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                    Edit Speciality
                  </Text>
                </TouchableOpacity>
              </View>

              {DoctorsList !== '' ? (
                <View>
                  <DoctorCard DoctorsList={DoctorsList} />
                </View>
              ) : (
                <Text style={{ alignSelf: 'center', color: 'black', marginTop: 50 }}>
                  No Doctors available for the above speciality
                </Text>
              )}
            </View>
          )}
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
  whiteBodyView: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
  },
});
