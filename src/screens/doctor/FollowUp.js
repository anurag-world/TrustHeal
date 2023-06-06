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
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
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

function FollowUp({ navigation }) {
  const window = useWindowDimensions();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setdate] = useState(new Date());
  // const [minDate, setminDate] = useState();

  const showDatePicker = () => {
    // console.log("Pressed button");

    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = async (date) => {
    setdate(date);
    hideDatePicker();
  };

  const pressedProceed = async () => {
    if (date != null) {
      await AsyncStorage.setItem('FollowUpDate', JSON.stringify(date));
      console.log(await AsyncStorage.getItem('FollowUpDate'));
      navigation.push('PrescriptionPreview');
    } else Alert.alert('Follow- Up Date', 'Please select follow-up date');
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
                <Image source={diagnosis} style={[{ tintColor: '#5d5e61' }]} />
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
                <Image source={followUp} style={[{ tintColor: '#2B8ADA' }]} />
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
                <Text style={styles.viewHeadingText}>Follow Up</Text>
              </TouchableOpacity>
              <View style={styles.whiteBodyView}>
                <Text style={styles.label}>Select Follow-Up Date</Text>
                {/* Search Bar */}
                <View style={[styles.searchBar, { borderRadius: 5 }]}>
                  <TextInput
                    placeholder="click on calendar icon"
                    editable={false}
                    onChangeText={(text) => setdate(text)}
                    value={dayjs(date).format('DD-MM-YYYY')}
                    style={styles.searchBarText}
                  />
                  <FAIcon
                    name="calendar-alt"
                    size={20}
                    color="gray"
                    style={styles.searchIcon}
                    onPress={showDatePicker}
                  />
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                  />
                </View>
              </View>
              {/* Bottom Buttons */}
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
                  text="Done"
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
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#2B8ADA',
    backgroundColor: 'white',
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 13,
    marginLeft: 5,
    color: '#2b8ada',
    borderBottomWidth: 1,
    borderBottomColor: '#2b8ada',
    fontWeight: 'bold',
    width: '95%',
    alignSelf: 'center',
  },
  searchBarText: {
    width: '100%',
    color: 'black',
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    paddingRight: 20,
    alignSelf: 'center',
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

export default FollowUp;
