/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  SafeAreaView,
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
import DocumentPicker, { isInProgress, types } from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import HeaderPatient from '../../components/HeaderPatient';
import apiConfig, { fileUpload } from '../../components/API/apiConfig';
import DoctorBasicDetails from '../../components/DoctorBasicDetails';
import CustomButton from '../../components/CustomButton';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function PreConsult() {
  const [PrevPageData, setPrevPageData] = useState(null);
  const [patientDet, setpatientDet] = useState(null);
  const [DocDet, setDocDet] = useState(null);
  const [QuestionList, setQuestionList] = useState([]);
  const [DocList, setDocList] = useState([]);
  const [answerUploadedButton, setanswerUploadedButton] = useState(false);
  const [answersUploaded, setanswersUploaded] = useState(false);
  const [DocsUploaded, setDocsUploaded] = useState(false);
  const [docName, setdocName] = useState('');
  const [showUploadDocsButton, setshowUploadDocsButton] = useState(false);
  const [consultationId, setconsultationId] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const LoadData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('ConfirmBookingDoctor'));
      console.log('================ PREVIOUS PAGE DATA =========================\n', x);
      setPrevPageData(x);
      setconsultationId(x.booked.consultationId);
      const temp = x.booked.preConsultationQues;
      // TODO: Check code
      temp.forEach((element) => {
        element.answers = '';
        element.consultationId = x.booked.consultationId;
      });

      console.log('========Queslist==========\n', temp);

      setQuestionList(temp);
      setDocDet(x.doctorDet);
      const y = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      console.log('================ Patient Data =========================\n', y);
      setpatientDet(y);
      setanswerUploadedButton(false);
      console.log('===============DOCS LIST========================\n', DocList);
    };
    LoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const complete = async () => {
      Alert.alert('Success', `Your response has been successfully shared with doctor.`);
      await AsyncStorage.multiRemove(['ConfirmBookingDoctor', 'bookSlot', 'viewProfile']);
      const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
      navigation.navigate('PatientHome', { patientObj: x });
    };

    if (DocsUploaded && answersUploaded) {
      complete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DocsUploaded, answersUploaded]);

  useState(() => {
    if (DocList.length > 0) setshowUploadDocsButton(true);
    else setshowUploadDocsButton(false);
  }, [DocList]);

  const selectDocs = async () => {
    try {
      console.log('==============Inside select Docs==========');

      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: types.pdf,
      });

      if (pickerResult.size > 2097152)
        Alert.alert('Size Error', 'The size of the file should be less than 2MB.');
      else {
        if (docName.split('.').pop() !== 'pdf') pickerResult.name = `${docName}.pdf`;
        else pickerResult.name = docName;

        console.log(pickerResult.name);

        const formData = new FormData();
        formData.append('directoryNames', 'PATIENT_DOCUMENT');
        formData.append('file', pickerResult);
        formData.append('userId', patientDet.patientId);
        const { error, response } = await fileUpload(formData);

        if (error != null) {
          console.log('======error======');
          console.log(error);
          Alert.alert('Error', 'There was a problem in selecting document. Please try again.');
        } else {
          console.log('======response======');
          console.log(response.fileToken);
          if (response.fileToken != null) {
            console.log(response.fileToken);

            const temp = {
              consultationId,
              documentName: pickerResult.name,
              documentPath: response.fileToken,
              // uploadedDate: dayjs().format('YYYY-MM-DD'),
            };
            const arr = [...DocList, temp];
            setDocList(arr);
            setdocName('');
          } else Alert.alert('Error', 'Please try again.');
        }
      }
    } catch (e) {
      handleError(e);
    }
  };

  const handleError = (err) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered');
    } else {
      throw err;
    }
  };

  const renderQues = ({ item, index }) => (
    <View
      style={{
        padding: 3,
        flex: 1,
        margin: 5,
        borderRadius: 10,
      }}
      key={item.questionId}
    >
      <Text
        style={{
          fontSize: 13,
          color: 'gray',
          paddingHorizontal: 10,
          fontWeight: 'bold',
          marginBottom: 5,
        }}
      >
        {item.question}
      </Text>
      <TextInput
        style={{
          backgroundColor: '#e8f0fe',
          padding: 0,
          fontSize: 12,
          borderRadius: 10,
          paddingHorizontal: 15,
          color: 'black',
        }}
        onChangeText={(text) => handleInput(text, index)}
        editable={!answersUploaded}
      />
    </View>
  );

  const renderDocs = ({ item, index }) => (
    <View
      style={[
        {
          flexDirection: 'row',

          padding: 5,
          borderRadius: 10,
          margin: 3,
          flex: 1,
          justifyContent: 'center',
        },
        !DocsUploaded ? { borderColor: '#2b8ada', borderWidth: 1 } : null,
      ]}
      key={item.documentPath}
    >
      <View style={{ flex: 0.9, flexDirection: 'column' }}>
        {!DocsUploaded ? (
          <Text
            style={{
              fontSize: 12,
              marginBottom: 3,
              color: '#2b8ada',
              fontWeight: 'bold',
              paddingHorizontal: 10,
            }}
          >
            File Name:-
          </Text>
        ) : null}
        <TextInput
          style={{
            backgroundColor: '#e8f0fe',
            padding: 0,
            fontSize: 12,
            borderRadius: 10,
            paddingHorizontal: 15,
            color: 'black',
          }}
          onChangeText={(text) => handleRename(text, index)}
          value={item.documentName}
          editable={false}
          placeholderTextColor="black"
        />
      </View>
      {!DocsUploaded ? (
        <TouchableOpacity
          style={{ marginLeft: 5, flex: 0.1, justifyContent: 'center' }}
          onPress={() => {
            removeDocsHandler(item.documentPath);
          }}
        >
          <FAIcons
            name="trash"
            size={15}
            style={{
              alignSelf: 'center',

              color: 'red',
            }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const handleRename = (text, index) => {
    const temp = [...DocList];
    temp[index].documentName = text;
    setDocList(temp);
  };

  const handleInput = (text, index) => {
    const temp = [...QuestionList];
    temp[index].answers = text;
    setQuestionList(temp);
  };

  const uploadAnswers = async () => {
    const temp = JSON.parse(JSON.stringify(QuestionList));
    const clone = [];
    temp.forEach((element) => {
      delete element.question;
      if (element.answers !== '') clone.push(element);
    });
    console.log('=============  Ques answer save  =====================\n', clone);
    if (clone.length > 0) {
      await axios
        .post(`${apiConfig.baseUrl}/patient/consultation/question/answer/save`, clone)
        .then((response) => {
          if (response.status === 200)
            Alert.alert('Done', 'Pre-Consultation Questionnaire submitted successfully!');
          setanswersUploaded(true);
        })
        .catch((error) => {
          Alert.alert('Error', `${error}`);
        });
    } else {
      Alert.alert(
        'Warning',
        'You have not answered any question. Please answer them or press skip'
      );
    }
  };

  const uploadDocs = async () => {
    console.log('=============  Uploading Docs  =====================\n', DocList);
    if (DocList.length > 0) {
      await axios
        .post(`${apiConfig.baseUrl}/patient/consultation/document/save`, DocList)
        .then((response) => {
          if (response.status === 200) Alert.alert('Done', 'Documents submitted successfully');
          setDocsUploaded(true);
        })
        .catch((error) => {
          Alert.alert('Error', `${error}`);
        });
    } else
      Alert.alert(
        'Warning',
        'You have not selected any document. Please select them or press skip'
      );
  };

  const removeDocsHandler = (i) => {
    setDocList(DocList.filter((e) => i !== e.documentPath));
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
          <HeaderPatient showMenu={false} title="PreConsult" />
          {/* Top */}

          <DoctorBasicDetails DocDet={DocDet} />

          {/* Mid Body */}

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
            }}
          >
            {/* Step 1 */}

            <View
              style={{
                marginVertical: 20,
                backgroundColor: 'white',
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  backgroundColor: '#2b8ada',
                  padding: 10,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                }}
              >
                Step 1 (Please Fill Questionnaire)
              </Text>
              <View style={{ padding: 10 }}>
                <FlatList
                  data={QuestionList}
                  renderItem={renderQues}
                  keyExtractor={(item) => item.questionId}
                />
              </View>

              {!answersUploaded ? (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                    alignSelf: 'center',
                    justifyContent: 'space-evenly',
                    marginVertical: 10,
                  }}
                >
                  <CustomButton
                    text="Submit"
                    textstyle={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 12,
                      alignSelf: 'center',
                    }}
                    style={{
                      flex: 0.45,
                      padding: 5,
                      paddingHorizontal: 10,
                      backgroundColor: '#2b8ada',
                      borderRadius: 10,
                      // width: '50%',
                      alignSelf: 'center',
                    }}
                    onPress={async () => {
                      await uploadAnswers();
                    }}
                  />
                  <CustomButton
                    text="Skip"
                    textstyle={{
                      color: '#2b8ada',
                      fontWeight: 'bold',
                      fontSize: 12,
                      alignSelf: 'center',
                    }}
                    style={{
                      flex: 0.45,
                      padding: 5,
                      paddingHorizontal: 10,
                      borderColor: '#2b8ada',
                      borderWidth: 1,
                      borderRadius: 10,
                      // width: '50%',
                      alignSelf: 'center',
                    }}
                    onPress={async () => {
                      setanswersUploaded(true);
                    }}
                  />
                </View>
              ) : null}
            </View>

            {/* Step 2 */}

            <View
              style={{
                marginVertical: 20,
                backgroundColor: 'white',
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  backgroundColor: '#2b8ada',
                  padding: 10,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                }}
              >
                Step 2 (Please Upload Documents)
              </Text>
              <Text
                style={{
                  marginVertical: 5,
                  color: 'red',
                  fontSize: 9,
                  alignSelf: 'center',
                }}
              >
                Note:-{'\n'} Upload lab report, previous prescriptions, etc. in pdf format of max
                size 2MB.
              </Text>
              <View style={{ padding: 10 }}>
                <FlatList
                  data={DocList}
                  renderItem={renderDocs}
                  keyExtractor={(item) => item.documentPath}
                />
              </View>

              {!DocsUploaded ? (
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 12,
                        marginBottom: 5,
                        color: '#2b8ada',
                        fontWeight: 'bold',
                        paddingHorizontal: 10,
                      }}
                    >
                      File Name:-
                    </Text>
                    <TextInput
                      style={{
                        backgroundColor: '#e8f0fe',
                        padding: 0,
                        fontSize: 12,
                        borderRadius: 10,
                        paddingHorizontal: 15,
                      }}
                      onChangeText={(text) => setdocName(text)}
                      value={docName}
                      placeholderTextColor="black"
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      flex: 0.45,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      borderWidth: 1,
                      borderColor: '#2b8ada',
                      alignSelf: 'flex-end',
                      borderRadius: 10,
                      padding: 3,
                      paddingHorizontal: 10,
                      marginRight: 20,
                      marginTop: 10,
                    }}
                    onPress={async () => {
                      if (DocList.length < 3) {
                        // await chooseProfileImage();
                        if (docName !== '') await selectDocs();
                        else
                          Alert.alert(
                            'Incomplete Details',
                            'Please enter file name before selecting file.'
                          );
                      } else Alert.alert('Warning', 'You can only upload maximum of 3 documents.');
                    }}
                  >
                    <FAIcons
                      name="file-pdf"
                      size={15}
                      color="#2b8ada"
                      style={{ alignSelf: 'center', marginRight: 5 }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        alignSelf: 'center',
                        color: '#2b8ada',
                      }}
                    >
                      Add File
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '90%',
                      alignSelf: 'center',
                      justifyContent: 'space-evenly',
                      marginVertical: 10,
                    }}
                  >
                    <CustomButton
                      text="Submit"
                      textstyle={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}
                      style={{
                        flex: 0.45,
                        padding: 5,
                        paddingHorizontal: 10,
                        backgroundColor: '#2b8ada',
                        borderRadius: 10,
                        marginVertical: 10,
                        // width: '50%',
                        alignSelf: 'center',
                      }}
                      onPress={async () => {
                        await uploadDocs();
                      }}
                    />
                    <CustomButton
                      text="Skip"
                      textstyle={{
                        color: '#2b8ada',
                        fontWeight: 'bold',
                        fontSize: 12,
                        alignSelf: 'center',
                      }}
                      style={{
                        flex: 0.45,
                        padding: 5,
                        paddingHorizontal: 10,
                        borderColor: '#2b8ada',
                        borderWidth: 1,
                        borderRadius: 10,
                        // width: '50%',
                        alignSelf: 'center',
                      }}
                      onPress={async () => {
                        setDocsUploaded(true);
                      }}
                    />
                  </View>
                </View>
              ) : null}
            </View>

            {/* Done Button */}

            <CustomButton
              text="Done"
              textstyle={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}
              style={{ backgroundColor: '#17CC9C', marginVertical: 20 }}
              onPress={async () => {
                if (answersUploaded === false)
                  Alert.alert('Warning', 'Please answer preconsultation questionnaire');
                else {
                  Alert.alert('Success', `Your response has been successfully shared with doctor.`);
                  await AsyncStorage.multiRemove([
                    'ConfirmBookingDoctor',
                    'bookSlot',
                    'viewProfile',
                  ]);
                  const x = JSON.parse(await AsyncStorage.getItem('UserPatientProfile'));
                  navigation.navigate('PatientHome', { patientObj: x });
                }
              }}
            />
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
});
