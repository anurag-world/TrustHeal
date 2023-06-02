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
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import { SelectList } from 'react-native-dropdown-select-list';
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

const dataFreq = [
  { key: '0-0-1', value: '0-0-1' },
  { key: '0-1-0', value: '0-1-0' },
  { key: '0-1-1', value: '0-1-1' },
  { key: '1-0-0', value: '1-0-0' },
  { key: '1-0-1', value: '1-0-1' },
  { key: '1-1-0', value: '1-1-0' },
  { key: '1-1-1', value: '1-1-1' },
  { key: '0-0-1/2', value: '0-0-1/2' },
  { key: '0-1/2-0', value: '0-1/2-0' },
  { key: '0-1/2-1/2', value: '0-1/2-1/2' },
  { key: '1/2-0-0', value: '1/2-0-0' },
  { key: '1/2-0-1/2', value: '1/2-0-1/2' },
  { key: '1/2-1/2-0', value: '1/2-1/2-0' },
  { key: '1/2-1/2-1/2', value: '1/2-1/2-1/2' },
];

const dataType = [
  { key: 'Drop', value: 'Drop' },
  { key: 'Ointment', value: 'Ointment' },
  { key: 'Syrup', value: 'Syrup' },
  { key: 'Tablet', value: 'Tablet' },
];

function Medication({ navigation }) {
  const [Medicine, setMedicine] = useState(false);

  const [Medication, setMedication] = useState([]);
  const [medicineName, setmedicineName] = useState('');
  const [medicineType, setmedicineType] = useState('');
  const [medicineInstruction, setmedicineInstruction] = useState('');
  const [medicineDays, setmedicineDays] = useState('');

  const window = useWindowDimensions();

  const clearAll = async () => {
    setmedicineName('');
    setmedicineType('');
    setmedicineInstruction('');
    setmedicineDays('');
  };
  const pressedProceed = async () => {
    if (Medication.length > 0) {
      const p = JSON.stringify(Medication);
      await AsyncStorage.setItem('Prescription', p);
      console.log(await AsyncStorage.getItem('Prescription'));
      navigation.push('Investigation');
    } else Alert.alert('Incomplete Details!', 'Please add medications before continuing!');
  };

  const removeHandler = (e) => {
    setMedication(Medication.filter((obj) => obj.medicineName !== e));
    // console.log(questionareList);
  };

  const RenderMedicine = () =>
    Medication.map((Medication, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
          maxHeight: 50,
        }}
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
          {/* Serial No */}
          {/* <View style={[styles.cellStyle, {flex: 0.3}]}>
              <Text style={styles.cellText}>{index + 1 + '.'}</Text>
            </View> */}
          {/* Medicaine Name */}
          <View style={[styles.cellStyle, { flex: 0.5 }]}>
            <Text style={styles.cellText}>{Medication.medicineName}</Text>
          </View>
          {/* Medicaine Type */}
          <View style={[styles.cellStyle, { flex: 0.3 }]}>
            <Text style={styles.cellText}>{Medication.medicineType}</Text>
          </View>
          {/* Medicine Instruction */}
          <View style={[styles.cellStyle, { flex: 0.5 }]}>
            <Text style={styles.cellText}>{Medication.instruction}</Text>
          </View>
          {/* Medicine Days */}
          <View style={[styles.cellStyle, { flex: 0.25 }]}>
            <Text style={styles.cellText}>{Medication.days}</Text>
          </View>

          {/* Action */}
          <View style={[styles.cellStyle, { flex: 0.3 }]}>
            <FAIcon
              name="trash"
              color="red"
              size={9}
              style={{ alignSelf: 'center' }}
              onPress={() => {
                // console.log(questionareList.ques);
                removeHandler(Medication.medicineName);
              }}
            />
          </View>
        </View>
      </View>
    ));

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
                <Image source={medicine} style={[{ tintColor: '#2B8ADA' }]} />
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
                <Text style={styles.viewHeadingText}>Medication & Instruction</Text>
              </TouchableOpacity>
              {/* Form  */}
              <View style={styles.whiteBodyView}>
                <View
                  style={{
                    alignSelf: 'center',
                    width: '95%',
                    flexDirection: 'column',
                  }}
                >
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
                      Add Medications
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 3,
                    }}
                  >
                    <View style={{ flex: 0.65 }}>
                      <Text style={styles.label}>Name</Text>
                      <TextInput
                        value={medicineName}
                        onChangeText={setmedicineName}
                        style={styles.inputView}
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <Text style={styles.label}>Days</Text>
                      <TextInput
                        value={medicineDays}
                        onChangeText={setmedicineDays}
                        keyboardType="number-pad"
                        style={styles.inputView}
                        maxLength={3}
                      />
                    </View>
                  </View>
                  <View style={{ marginBottom: 3 }}>
                    <Text style={styles.label}>Special Instructions</Text>
                    <TextInput
                      value={medicineInstruction}
                      onChangeText={setmedicineInstruction}
                      style={[styles.inputView, { maxHeight: 100 }]}
                      multiline
                    />
                  </View>
                  <View style={{ marginBottom: 3 }}>
                    <Text style={styles.label}>Medicine Type</Text>
                    <SelectList
                      placeholder={' '}
                      labelStyles={{ height: 0 }}
                      setSelected={(val) => setmedicineType(val)}
                      data={dataType}
                      save="value"
                      boxStyles={[styles.inputView, { borderWidth: 0 }]}
                      dropdownStyles={{ backgroundColor: 'white' }}
                      dropdownTextStyles={{
                        color: '#2b8ada',
                        fontWeight: 'bold',
                      }}
                      badgeStyles={{ backgroundColor: '#2b8ada' }}
                    />
                  </View>

                  <CustomButton
                    text="+ Add More"
                    textstyle={{ color: 'white', fontSize: 12 }}
                    style={{
                      position: 'relative',
                      backgroundColor: '#2B8ADA',
                      alignSelf: 'flex-end',
                      marginTop: 10,
                      padding: 5,
                      paddingHorizontal: 10,
                      borderRadius: 5,
                    }}
                    onPress={async () => {
                      if (medicineName == '')
                        Alert.alert('Incomplete Details', 'Please fill medicine name');
                      else if (medicineDays == '')
                        Alert.alert('Incomplete Details', 'Please fill days on intake');
                      else if (medicineType == '')
                        Alert.alert('Incomplete Details', 'Please select  medicine type');
                      else if (medicineInstruction == '')
                        Alert.alert('Incomplete Details', 'Please fill medicine name');
                      else {
                        const as = {
                          medicineName,
                          medicineType,
                          instruction: medicineInstruction,
                          days: medicineDays,
                        };
                        Medication.push(as);
                        console.log(Medication);
                        await clearAll();
                      }
                    }}
                  />
                </View>
              </View>

              {/* {Medication.map((Medication, index) => {})} */}
              {Medication.length > 0 ? (
                <View style={[styles.whiteBodyView, { maxHeight: 250 }]}>
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
                      Medications
                    </Text>
                  </View>
                  <View>
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
                        {/* <View style={[styles.cellHeading, {flex: 0.3}]}>
                          <Text style={styles.cellHeadingText}>S No.</Text>
                        </View> */}
                        <View style={[styles.cellHeading, { flex: 0.5 }]}>
                          <Text style={styles.cellHeadingText}>Name</Text>
                        </View>
                        <View style={[styles.cellHeading, { flex: 0.3 }]}>
                          <Text style={styles.cellHeadingText}>Type</Text>
                        </View>
                        <View style={[styles.cellHeading, { flex: 0.5 }]}>
                          <Text style={styles.cellHeadingText}>Instruction</Text>
                        </View>
                        <View style={[styles.cellHeading, { flex: 0.25 }]}>
                          <Text style={styles.cellHeadingText}>Days</Text>
                        </View>

                        <View
                          style={{
                            flex: 0.3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 1,
                            paddingVertical: 1,
                            backgroundColor: '#2b8ada',
                          }}
                        >
                          <Text style={styles.cellHeadingText}>Actions</Text>
                        </View>
                      </View>
                    </View>
                    <ScrollView style={{ maxHeight: 150 }}>
                      <RenderMedicine />
                    </ScrollView>
                  </View>
                </View>
              ) : null}

              {/* Bottom Buttons */}
              <View
                style={{
                  flex: 1,
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
    // borderBottomWidth: 1,
    // borderColor: '#2b8ada',
  },
  searchBar: {
    width: '95%',
    flexDirection: 'row',
    padding: 5,
    borderWidth: 1,
    borderColor: '#2B8ADA',
    backgroundColor: 'white',
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  searchBarText: {
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  bubble: {
    flexDirection: 'row',
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
  },
  bubbleText: { fontSize: 14, fontWeight: 'bold' },
  cellStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#d3d3d3',
    paddingHorizontal: 1,
    paddingVertical: 1,
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
    fontSize: 11,
    marginVertical: 5,
    color: 'white',
  },
  cellText: { textAlign: 'center', fontSize: 11, paddingVertical: 3 },
  whiteBodyView: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  inputView: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#e8f0fe',
    borderRadius: 5,
    marginVertical: 5,
    fontSize: 13,
    color: 'black',
  },
});

export default Medication;
