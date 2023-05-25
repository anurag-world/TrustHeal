import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  LogBox,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import Header from '../../components/Header';
import apiConfig from '../../components/API/apiConfig';
import dateformatter from '../../components/API/dateformatter';
import waiting from '../../../assets/animations/waiting1.gif';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function CheckEarnings() {
  const [Data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const { doctorId } = x;
    // console.log("Completed");
    setisLoading(true);
    axios
      .get(
        `${
          apiConfig.baseUrl
        }/doctor/complete/consultation?doctorId=${doctorId}&start=${0}&max=${10}`
      )
      .then((response) => {
        setisLoading(false);
        if (response.status === 200) {
          console.log(response.data);
          setData(response.data);
        }
        // console.log(response.data);
      })
      .catch((error) => {
        setisLoading(false);
        Alert.alert('Error', 'An error occured while fetching details. Please try again later.');
        console.log('=====Error in fetching details=====');
        console.log(error);
      });
  };

  const renderPayments = ({ item }) => (
    <View
      style={{
        width: '95%',
        alignSelf: 'center',
        marginVertical: 10,
      }}
      key={item.consultationId}
    >
      {/* Date */}
      <View
        style={[
          styles.detailsRow,
          {
            backgroundColor: '#2B8ADA',
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
            paddingVertical: 10,
          },
        ]}
      >
        <View style={styles.detailsCol}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              paddingHorizontal: 10,
            }}
          >
            Consultation Date
          </Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              paddingHorizontal: 10,
            }}
          >
            {dateformatter(item.slotDate)}
          </Text>
        </View>
      </View>
      {/* Details */}
      <View
        style={{
          paddingVertical: 10,
          backgroundColor: 'white',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}
      >
        <View style={[styles.detailsRow]}>
          <View style={styles.detailsCol}>
            <Text style={styles.detailsText}>Patient Name</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.detailsText}>
              {item.familyUserName == null ? item.patientName : item.familyUserName}
            </Text>
          </View>
        </View>
        <View style={[styles.detailsRow]}>
          <View style={styles.detailsCol}>
            <Text style={styles.detailsText}>Consultation Type</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <FAIcons
              name={
                // eslint-disable-next-line no-nested-ternary
                item.consultationType === 'VIDEO_CALL'
                  ? 'video'
                  : item.consultationType === 'PHONE_CALL'
                  ? 'phone-alt'
                  : 'hospital-user'
              }
              style={[styles.detailsText, { fontSize: 15, color: '#2B8ADA' }]}
            />
          </View>
        </View>

        <View style={[styles.detailsRow]}>
          <View style={styles.detailsCol}>
            <Text style={styles.detailsText}>Paid Amount</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.detailsText}>₹ {item.fees}</Text>
          </View>
        </View>
      </View>
    </View>
  );

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
        <StatusBar animated backgroundColor="#2B8ADA" />
        <ScrollView
          style={{
            width: '100%',
            alignSelf: 'center',
            // marginTop: 30,
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <Header showMenu={false} title="Payment Details" />

          <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
            {/* List of Payments */}
            <TouchableOpacity
              style={{ flexDirection: 'row', padding: 5, paddingHorizontal: 10 }}
              onPress={getData}
            >
              <FAIcons
                name="redo-alt"
                size={15}
                style={{ alignSelf: 'center', marginRight: 5 }}
                color="#2b8ada"
              />
              <Text style={{ color: '#2b8ada' }}>Refresh</Text>
            </TouchableOpacity>

            {Data !== '' ? (
              <FlatList
                data={Data}
                keyExtractor={(item) => item.consultationId}
                renderItem={renderPayments}
              />
            ) : (
              <Text
                style={{
                  marginVertical: 10,
                  fontSize: 12,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                }}
              >
                Sorry no data available
              </Text>
            )}
          </View>
        </ScrollView>
        {isLoading && (
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                borderRadius: 50,
                width: 250,
                height: 250,
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Image
                source={waiting}
                style={{
                  alignSelf: 'center',
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                }}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  color: '#2B8ADA',
                  fontSize: 20,
                  fontWeight: 'bold',
                  width: '100%',
                  padding: 10,
                }}
              >
                Fetching Details
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
    height: 50,
    width: '95%',
    flexDirection: 'row',
    padding: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#2B8ADA',
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
    marginVertical: 10,
  },
  searchBarText: {
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 15,
  },
  detailsCol: {
    flexDirection: 'column',
    alignSelf: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    paddingVertical: 5,
  },
  detailsText: {
    fontSize: 12,
    alignSelf: 'center',
    paddingHorizontal: 10,
    color: 'black',
  },
});
