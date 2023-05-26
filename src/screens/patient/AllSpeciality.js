import React, { useState, useEffect } from 'react';
import {
  Alert,
  useWindowDimensions,
  View,
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
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import { Checkbox } from 'native-base';
import HeaderPatient from '../../components/HeaderPatient';
import apiConfig from '../../components/API/apiConfig';

// icons
import waiting from '../../../assets/animations/waiting1.gif';
import DoctorCard from '../../components/DoctorCard';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function AllSpeciality() {
  const [isLoading, setisLoading] = useState(false);
  const [List, setList] = useState([]);
  const [newList, setnewList] = useState([]);
  const [DoctorsList, setDoctorsList] = useState(null);
  const [selectedSpeciality, setselectedSpeciality] = useState([]);
  const [search, setSearch] = useState('');
  const [showLabel, setshowLabel] = useState(true);
  const layout = useWindowDimensions();

  useEffect(() => {
    const getAllSpeciality = async () => {
      setisLoading(true);
      await axios
        .get(`${apiConfig.baseUrl}/suggest/specialization/dropdown?max=100&min=0`)
        .then((response) => {
          if (response.status === 200) {
            const newArray = response.data.map((item) => ({
              key: item.specializationImage,
              value: item.specialization,
            }));
            // Set Data Variable
            setisLoading(false);
            setList(newArray);
          }
        })
        .catch((error) => {
          setisLoading(false);
          Alert.alert('Error', `${error}`);
        });
      setisLoading(false);
    };

    getAllSpeciality();
  }, []);

  useEffect(() => {
    const setSearchList = () => {
      const p = [];
      // console.log('Item to be searched  :   ', search.toLowerCase());

      List.forEach((item) => {
        const x = item.value.toLowerCase();
        // console.log(x);
        if (x.indexOf(search.toLowerCase()) !== -1) p.push(item);
      });

      // console.log('Results:-\n', p);

      setnewList(p);
    };
    if (search !== '') setSearchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const renderSpeciality = ({ item }) => (
    <TouchableOpacity
      style={{
        width: 115,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        margin: 5,
      }}
      key={item.key}
      onPress={() => {
        CheckBoxPressed(item);
      }}
      activeOpacity={0.6}
    >
      <Checkbox
        onChange={() => CheckBoxPressed(item)}
        size="sm"
        isChecked={selectedSpeciality.indexOf(item.value) !== -1}
        _checked={{ bg: '#2b8ada' }}
        accessibilityLabel="Select Speciality"
      />
      <Image
        style={{
          alignSelf: 'center',
          width: 70,
          height: 70,
        }}
        source={{
          uri: `${apiConfig.baseUrl}/file/admin/download?fileToken=${item.key}`,
        }}
      />

      <Text
        style={{
          alignSelf: 'center',
          textAlign: 'center',
          color: 'black',
          fontSize: 12,
          marginVertical: 5,
        }}
      >
        {item.value}
      </Text>
    </TouchableOpacity>
  );
  const CheckBoxPressed = (item) => {
    if (selectedSpeciality.indexOf(item.value) === -1)
      setselectedSpeciality([...selectedSpeciality, item.value]);
    else setselectedSpeciality(selectedSpeciality.filter((index) => index !== item.value));
  };

  const getDoctors = () => {
    setisLoading(true);
    let x = '';
    selectedSpeciality.forEach((element) => {
      x += `&speciality=${element}`;
    });
    axios
      .get(`${apiConfig.baseUrl}/patient/doctor/by/speciality?max=5&min=0${x}`)
      .then((response) => {
        if (response.status === 200) {
          setisLoading(false);
          console.log(response.data);
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
          <HeaderPatient showMenu={false} title="All Speciality" />
          {DoctorsList == null ? (
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
              }}
            >
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: '#2b8ada',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    padding: 5,
                    marginTop: 10,
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
                    Selected Speciality
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

              {showLabel ? (
                <View style={styles.whiteBodyView}>
                  {selectedSpeciality !== '' ? (
                    <View>
                      <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                        {selectedSpeciality.map((index) => (
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
                          onPress={() => {
                            setDoctorsList(null);
                            getDoctors();
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
                        <TouchableOpacity
                          style={{
                            zIndex: 3,
                            flex: 0.45,
                            justifyContent: 'center',
                            borderColor: '#2b8ada',
                            borderWidth: 1,
                            padding: 7,
                            paddingHorizontal: 15,
                            borderRadius: 5,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            marginVertical: 10,
                          }}
                          onPress={async () => {
                            setselectedSpeciality([]);
                          }}
                        >
                          <Text
                            style={{
                              color: '#2b8ada',
                              fontWeight: 'bold',
                              fontSize: 12,
                            }}
                          >
                            Clear All
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
              ) : null}
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  width: '100%',
                  alignSelf: 'center',
                }}
              >
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    width: '100%',
                    borderRadius: 10,
                  }}
                  placeholder="Enter Speciality"
                  onChangeText={(text) => setSearch(text)}
                  value={search}
                />
                <MIcons
                  name="clear"
                  size={20}
                  color="black"
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginRight: 10,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setSearch('')}
                />
              </View>

              <View style={{ alignSelf: 'center', marginBottom: 30 }}>
                <FlatList
                  data={search === '' ? List : newList}
                  key={(item) => item.key}
                  renderItem={renderSpeciality}
                  numColumns={Math.round(layout.width / 130)}
                  style={{ alignSelf: 'center' }}
                />
              </View>
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
                  {selectedSpeciality.length === 1 ? 'speciality' : 'specialities'}
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
                  {selectedSpeciality.map((index) => (
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
                    setDoctorsList(null);
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
