import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Alert,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
// Icons
import cheifComplaints from '../../../assets/Icons/search.png';
import bodyScan from '../../../assets/Icons/body-scan.png';
import diagnosis from '../../../assets/Icons/diagnosis.png';
import medicine from '../../../assets/Icons/medicine.png';
import investigation from '../../../assets/Icons/searching.png';
import advice from '../../../assets/Icons/doctor.png';
import followUp from '../../../assets/Icons/calendar.png';

function Diagnosis({ navigation }) {
  const [Diagnosis, setDiagnosis] = useState('');
  const window = useWindowDimensions();

  const pressedProceed = async () => {
    if (Diagnosis != '') {
      const p = JSON.stringify(Diagnosis);
      await AsyncStorage.setItem('Diagnosis', p);
      console.log(await AsyncStorage.getItem('Diagnosis'));
      navigation.push('Medication');
    } else {
      Alert.alert('Incomplete', 'Diagnosis not added');
    }
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
            height: '100%',
            backgroundColor: '#E8F0FE',
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Header title="Prescription" showMenu={false} />
          <View style={{ flexDirection: 'row' }}>
            {/* Navigation Bar */}
            <View
              style={{
                flex: 0.15,
                flexDirection: 'column',
                justifyContent: 'space-around',
                borderRightWidth: 1,
                height: window.height - 80,
                padding: 1,
                alignItems: 'center',
                borderRightColor: 'gray',
              }}
            >
              <TouchableOpacity onPress={() => {}}>
                <Image source={cheifComplaints} style={[{ tintColor: '#5d5e61' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Image source={bodyScan} style={[{ tintColor: '#5d5e61' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Image source={diagnosis} style={[{ tintColor: '#2B8ADA' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Image source={medicine} style={[{ tintColor: '#5d5e61' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Image source={investigation} style={[{ tintColor: '#5d5e61' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Image source={advice} style={[{ tintColor: '#5d5e61' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Image source={followUp} style={[{ tintColor: '#5d5e61' }]} />
              </TouchableOpacity>
            </View>
            {/* Page View */}
            <View style={styles.pageView}>
              {/* Heading */}
              <TouchableOpacity
                style={styles.viewHeadingView}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <FAIcon name="chevron-left" color="#2B8ADA" size={15} style={{ marginRight: 5 }} />
                <Text style={styles.viewHeadingText}>Diagnosis</Text>
              </TouchableOpacity>
              {/* Search Bar */}
              {/* <View style={styles.searchBar}>
                <TextInput placeholder="Search" style={styles.searchBarText} />
                <FAIcon
                  name="search"
                  size={15}
                  color="gray"
                  style={styles.searchIcon}
                />
              </View> */}
              {/* Suggestions */}
              <View style={styles.whiteBodyView}>
                <View
                  style={{
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#2b8ada',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: '#2b8ada',
                    }}
                  >
                    Diagnosis
                  </Text>
                </View>
                <View
                  style={{
                    padding: 5,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    height: 100,
                    borderWidth: 1,
                    borderColor: '#2b8ada',
                  }}
                >
                  <TextInput
                    placeholder="Enter Diagnosis"
                    placeholderTextColor="gray"
                    onChangeText={(text) => setDiagnosis(text)}
                    value={Diagnosis}
                    multiline
                    style={{
                      textAlign: 'left',
                      fontSize: 11,
                    }}
                  />
                </View>
              </View>

              {/* Buttons */}
              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  bottom: 0,
                  position: 'absolute',
                  marginVertical: 10,
                  justifyContent: 'space-evenly',
                }}
              >
                <CustomButton
                  text="Proceed"
                  textstyle={{ color: 'white', fontSize: 12 }}
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#2B8ADA',
                    flex: 0.45,
                  }}
                  onPress={pressedProceed}
                />
                <CustomButton
                  text="Go Back"
                  textstyle={{ color: '#2B8ADA', fontSize: 12 }}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#2B8ADA',
                    flex: 0.45,
                  }}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              </View>
            </View>
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
  pageView: {
    flex: 0.8,
    flexDirection: 'column',
    padding: 10,
  },
  viewHeadingView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  viewHeadingText: {
    color: '#2B8ADA',
    fontSize: 15,
    fontWeight: 'bold',
  },
  searchBar: {
    width: '95%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2B8ADA',
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    marginLeft: 5,
  },
  searchBarText: {
    width: '100%',
    paddingHorizontal: 10,
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    alignSelf: 'center',
    paddingRight: 10,
  },
  bubble: {
    flexDirection: 'row',
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
  },
  bubbleText: { fontSize: 14, fontWeight: 'bold' },
  whiteBodyView: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default Diagnosis;
