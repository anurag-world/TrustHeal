/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// TODO: Uncomment below
// import RNFS from 'react-native-fs';
import { SelectList } from 'react-native-dropdown-select-list';
// TODO: Uncomment below
// import Pdf from 'react-native-pdf';

// icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// TODO: Uncomment below
// import DocumentPicker, { isInProgress, types } from 'react-native-document-picker';
import dayjs from 'dayjs';
import axios from 'axios';
// TODO: Uncomment below
// import { CheckBox } from 'react-native-elements';
// TODO: Uncomment below
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import doctor from '../../../assets/doctor.png';
import doctorFemale from '../../../assets/doctor_female.png';
import waiting from '../../../assets/animations/waiting1.gif';
import uploading from '../../../assets/animations/uploading.gif';
import uploadgif from '../../../assets/animations/upload.gif';

import apiConfig, { fileUpload } from '../../components/API/apiConfig';
import { checkAlphabetOnly, checkAlphanumicOnly } from '../../components/API/Validations';
import CustomButton from '../../components/CustomButton';

const dataTitle = [
  { key: 'Dr.', value: 'Dr.' },
  { key: 'Mr.', value: 'Mr.' },
  { key: 'Mrs.', value: 'Mrs.' },
  { key: 'Ms.', value: 'Ms.' },
];
const dataGender = [
  { key: 'Male', value: 'Male' },
  { key: 'Female', value: 'Female' },
  { key: 'Other', value: 'Other' },
];

const dataYear = [];

let dataIdenDocs = [
  { key: 'Aadhar', value: 'Aadhar' },
  { key: 'Driving Licence', value: 'Driving Licence' },
  { key: 'PAN', value: 'PAN' },
  { key: 'Passport No.', value: 'Passport No.' },
];

const clearKeys = async () => {
  await AsyncStorage.removeItem('dob');
  await AsyncStorage.removeItem('age');
};

export default function DoctorRegistration2() {
  // Calendar View
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartExpDatePickerVisible, setStartExpDatePickerVisible] = useState(false);
  const [isEndExpDatePickerVisible, setEndExpDatePickerVisible] = useState(false);
  const [completePercentage, setCompletePercentage] = useState('10%');

  // General Information Field
  const [showGenInfo, setShowGenInfo] = useState(false);
  const [dataSavedGenInfo, setdataSavedGenInfo] = useState(true);
  const [GenInfoEdit, setGenInfoEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setdob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [PinCode, setPinCode] = useState('');
  const [doctorId, setdoctorId] = useState(null);
  const [profileCompleted, setprofileCompleted] = useState(null);
  const [verified, setverified] = useState(null);
  const [mobileNumber, setmobileNumber] = useState('');
  const [photoPath, setphotoPath] = useState(0);

  // Medical Registration Feild
  const [showMedReg, setShowMedReg] = useState(false);
  const [dataSavedMedReg, setdataSavedMedReg] = useState(false);
  const [RegNo, setRegNo] = useState('');
  const [RegCouncil, setRegCouncil] = useState('');
  const [RegCert, setRegCert] = useState('');
  const [RegYear, setRegYear] = useState('');
  const [certificatePath, setcertificatePath] = useState(null);
  const [MedRegDoc, setMedRegDoc] = useState(null);

  // Educational Details Field
  const [showEduDet, setShowEduDet] = useState(false);
  const [addMoreEduDet, setaddMoreEduDet] = useState(false);
  const [dataSavedEduDet, setdataSavedEduDet] = useState(false);

  const [dataSpecialization, setdataSpecialization] = useState([]);
  const [Education, setEducation] = useState([]);
  const [Degree, setDegree] = useState('');
  const [DegreePassingYear, setDegreePassingYear] = useState('');
  const [Specialization, setSpecialization] = useState('');
  const [University, setUniversity] = useState('');
  const [degreePath, setdegreePath] = useState(null);

  const [Otherspeciality, setOtherSpeciality] = useState('');
  // Experience Details Field
  const [showExpDet, setShowExpDet] = useState(false);
  const [addMoreExpDet, setaddMoreExpDet] = useState(false);
  const [dataSavedExpDet, setdataSavedExpDet] = useState(false);
  const [Experience, setExperience] = useState([]);
  const [practiceAt, setPracticeAt] = useState('');
  const [startExpDate, setStartExpDate] = useState('');
  const [endExpDate, setEndExpDate] = useState('');
  const [experienceInMonths, setExperienceInMonths] = useState('');
  const [TotalYear, setTotalYear] = useState('');
  const [TotalMonths, setTotalMonths] = useState('');
  const [FinalTotalMonths, setFinalTotalMonths] = useState(0);
  const [expPhotoPath, setexpPhotoPath] = useState(0);
  const [checkPresent, setcheckPresent] = useState(false);
  // Identification
  const [showIdenDet, setShowIdenDet] = useState(false);
  const [addMoreIdenDet, setaddMoreIdenDet] = useState(false);
  const [dataSavedIdenDet, setdataSavedIdenDet] = useState(false);
  const [IdentificationDocs, setIdentificationDocs] = useState([]);
  const [identificationNumber, setidentificationNumber] = useState('');
  const [identificationType, setidentificationType] = useState('');
  const [identificationPath, setidentificationPath] = useState(null);
  // Additional Information
  const [showAddInfo, setShowAddInfo] = useState(false);
  const [addMoreAddInfo, setaddMoreAddInfo] = useState(false);
  const [dataSavedAddInfo, setdataSavedAddInfo] = useState(false);
  const [ClinicDet, setClinicDet] = useState([]);
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicPhoto, setClinicPhoto] = useState(null);
  const [specialInstruction, setSpecialInstruction] = useState('');

  // PreConsultation Questionnaire
  const [showPreConsultationQuestionaire, setShowPreConsultationQuestionaire] = useState(false);
  const [addMorePreConsultationQuestionaire, setaddMorePreConsultationQuestionaire] =
    useState(false);
  const [dataSavedPreConsultationQuestionaire, setdataSavedPreConsultationQuestionaire] =
    useState(false);
  const [questionare, setQuestionare] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [consultationQuestion, setConsultationQuestion] = useState('');
  const [questionareList, setQuestionareList] = useState([]);
  const [splArray, setsplArray] = useState([]);
  // consultation fees
  const [showConsultFees, setShowConsultFees] = useState(false);
  const [dataSavedConsultFees, setdataSavedConsultFees] = useState(false);
  const [eConsulationFees, seteConsulationFees] = useState(0);
  const [efollowUpFees, setefollowUpFees] = useState(0);
  const [showFollowUp, setshowFollowUp] = useState('');
  const [physicalConsulationFees, setphysicalConsulationFees] = useState(0);
  const [physicalfollowUpFees, setphysicalfollowUpFees] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [isSentForValidation, setisSentForValidation] = useState(false);
  const [isUploading, setisUploading] = useState(false);

  // viewing document
  const [docPath, setdocPath] = useState(null);
  const [docsModal, setdocsModal] = useState(false);
  const [zoom, setZoom] = useState(1);

  const navigation = useNavigation();

  const onZoomIn = () => {
    if (zoom < 2.5) setZoom(zoom + 0.25);
  };
  const onZoomOut = () => {
    if (zoom > 1) setZoom(zoom - 0.25);
  };

  // view images
  const [DisplayPhotoToken, setDisplayPhotoToken] = useState(0);
  const [ImageViewer, setImageViewer] = useState(false);

  // post pfp
  const chooseProfileImage = async () => {
    Alert.alert('Upload Profile Picture', 'Select option for uploading profile picture', [
      {
        text: 'Open Library',
        onPress: () => {
          // TODO: Uncomment below
          /* launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            console.log(response);
            if (response.didCancel) console.log('Cancel');
            else if (response.errorCode) {
              Alert.alert('Error', response.errorMessage);
            } else if (response.assets[0].fileSize <= 5242880) {
              await postpfp(response.assets[0]);
            } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 5MB.');
          }); */
        },
      },
      {
        text: 'Open Camera',
        onPress: () => {
          requestCameraPermission();
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'App Camera Permission',
        message: 'App needs access to your camera ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await launchcamera();
      } else {
        // console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const launchcamera = async () => {
    // TODO: Uncomment below
    /* launchCamera(
      { mediaType: 'photo', cameraType: 'front', saveToPhotos: true },
      async (response) => {
        console.log(response);
        if (response.didCancel) console.log('Cancel');
        else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets[0].fileSize <= 5242880) {
          await postpfp(response.assets[0]);
        } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 5MB.');
      }
    ); */
  };

  // TODO: Uncomment below
  /* const postpfp = async (pickerResult) => {
    try {
      console.log('==============Inside post pfp==========');

      const ext = `.${pickerResult.fileName.split('.').pop()}`;

      delete pickerResult.fileName;
      pickerResult.size = pickerResult.fileSize;
      delete pickerResult.fileSize;

      pickerResult.name = `${doctorId}_ProfilePhoto${ext}`;
      console.log(pickerResult.name);
      console.log(pickerResult);

      const formData = new FormData();
      formData.append('directoryNames', 'DOCTOR_PHOTO');
      formData.append('file', pickerResult);
      formData.append('userId', doctorId);
      if (photoPath != null && photoPath != 0) formData.append('fileToken', photoPath);
      const { error, response } = await fileUpload(formData);

      if (error != null) {
        console.log('======error======');
        console.log(error);
        Alert.alert('Error', 'There was a problem in uploading profile picture. Please try again.');
      } else {
        console.log('======response======');
        console.log(response.fileToken);
        // setphotoPath(response.fileToken);
        // let x = await AsyncStorage.getItem('UserDoctorProfile');
        // x.photoPath = response.fileToken;
        // await AsyncStorage.setItem('UserDoctorProfile', x);
        await updateGenInfo(response.fileToken);
      }
    } catch (e) {
      console.log(e);
    }
  }; */

  // TODO: Uncomment below
  /* const updateGenInfo = async (phototoken) => {
    setisUploading(true);

    const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));

    const token = await AsyncStorage.getItem('fcmToken');
    const req = {
      city: x.city,
      contactVisibility: x.contactVisibility,
      digialSignature: 0,
      dob: x.dob,
      doctorId: x.doctorId,
      doctorName: x.doctorName != null ? x.doctorName : x.fullName,
      email: x.email,
      firebaseToken: token,
      mobileNumber: x.mobileNumber,
      pinCode: x.pinCode,
      profilePhotoPath: phototoken,
      whatsAppNumber: x.mobileNumber,
    };

    axios
      .post(`${apiConfig.baseUrl}/doctor/generalinfo/update`, req)
      .then(async (response) => {
        setisUploading(false);
        if (response.status == 200) {
          // store the changes made in details to UserDoctorProfile

          x.profilePhotoPath = phototoken;
          setphotoPath(phototoken);
          await AsyncStorage.setItem('UserDoctorProfile', JSON.stringify(x));
          Alert.alert('Updated', 'Profile photo has been updated.');
          setGenInfoEdit(false);
        } else
          Alert.alert('Updation Error', 'Could not Update Profile photo. Please try again later.');
      })
      .catch((error) => {
        setisUploading(false);
        Alert.alert('Error', `An error has occured please try again. ${error}`);
      });
  }; */

  // post photo exp/clinic
  const choosePhoto = async (forField) => {
    Alert.alert('Upload Profile Picture', 'Select option for uploading profile picture', [
      {
        text: 'Open Library',
        onPress: () => {
          // TODO: Uncomment below
          /* launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            console.log(response);
            if (response.didCancel) console.log('Cancel');
            else if (response.errorCode) {
              Alert.alert('Error', response.errorMessage);
            } else if (response.assets[0].fileSize <= 2097152) {
              await postPhoto(response.assets[0], forField);
            } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 2MB.');
          }); */
        },
      },
      {
        text: 'Open Camera',
        onPress: () => {
          requestCamera(forField);
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  // eslint-disable-next-line no-unused-vars
  const requestCamera = async (forField) => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'App Camera Permission',
        message: 'App needs access to your camera ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // TODO: Uncomment below
        // await launchcameraPhoto(forField);
      } else {
        // console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // TODO: Uncomment below
  /* const launchcameraPhoto = async (forField) => {
    launchCamera(
      { mediaType: 'photo', cameraType: 'front', saveToPhotos: true },
      async (response) => {
        console.log(response);
        if (response.didCancel) console.log('Cancel');
        else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets[0].fileSize <= 2097152) {
          await postPhoto(response.assets[0], forField);
        } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 2MB.');
      }
    );
  }; */

  // TODO: Uncomment below
  /* const postPhoto = async (pickerResult, forField) => {
    try {
      console.log(`==============Inside post photo for ${forField}==========`);

      const ext = `.${pickerResult.fileName.split('.').pop()}`;

      delete pickerResult.fileName;
      pickerResult.size = pickerResult.fileSize;
      delete pickerResult.fileSize;
      if (forField == 'Clinic') pickerResult.name = `${doctorId}_ClinicPhoto${ext}`;

      if (forField == 'Experience') pickerResult.name = `${doctorId}_ExpPhoto${ext}`;

      console.log(pickerResult.name);
      console.log(pickerResult);

      const formData = new FormData();
      formData.append(
        'directoryNames',
        forField == 'Clinic' ? ' DOCTOR_CLINIC' : ' DOCTOR_EXPERIENCE'
      );
      formData.append('file', pickerResult);
      formData.append('userId', doctorId);

      if (forField == 'Experience' && expPhotoPath != 0) formData.append('fileToken', expPhotoPath);

      if (forField == 'Clinic' && clinicPhoto != null) formData.append('fileToken', clinicPhoto);

      const { error, response } = await fileUpload(formData);

      if (error != null) {
        console.log('======error======');
        console.log(error);
        Alert.alert('Error', 'There was a problem in uploading profile picture. Please try again.');
      } else {
        console.log('======response======');
        console.log(response.fileToken);
        if (forField == 'Clinic') setClinicPhoto(response.fileToken);
        if (forField == 'Experience') setexpPhotoPath(response.fileToken);
      }
    } catch (e) {
      console.log(e);
    }
  }; */

  // eslint-disable-next-line no-unused-vars
  const handleError = (err) => {
    // TODO: Uncomment below
    /* if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered');
    } else {
      throw err;
    } */
  };

  // TODO: Uncomment below
  /* const download = async (fileToken, userId, fileName) => {
    setisLoading(true);
    const filePath = `file://${RNFS.CachesDirectoryPath}/`;
    const options = {
      fromUrl: `${apiConfig.baseUrl}/file/download?fileToken=${fileToken}&userId=${userId}`,
      toFile: filePath + fileName,
    };
    
    await RNFS.downloadFile(options)
      .promise.then((response) => {
        if (response.statusCode == 200) {
          setdocPath(filePath + fileName);
          setdocsModal(true);
          setisLoading(false);
        } else {
          setisLoading(false);
          Alert.alert('Download Fail', `Unable to download file. ${response.statusCode}`);
        }
      })
      .catch((e) => {
        setisLoading(false);
        Alert.alert('Error', `${e}`);
      });
  }; */

  const dataShowQues = [
    { key: 'Yes', value: 'Yes' },
    { key: 'No', value: 'No' },
  ];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = async (date) => {
    await AsyncStorage.setItem('dob', JSON.stringify(date).substring(1, 11));
    setdob(JSON.stringify(date).substring(1, 11));
    calculateAge();
    hideDatePicker();
  };

  const calculateExp = async () => {
    if (dayjs(startExpDate).isValid() && dayjs(endExpDate).isValid()) {
      const startDt = dayjs(startExpDate);
      const endDt = dayjs(endExpDate);
      if (endDt.isBefore(startDt)) {
        Alert.alert('Invalid Date', 'Please enter valid date range.');
        setStartExpDate('');
        setEndExpDate('');
      } else {
        const diffMonth = endDt.diff(startDt, 'month');
        setExperienceInMonths(diffMonth);
        setTotalYear(Math.floor(diffMonth / 12));
        setTotalMonths(parseInt(diffMonth % 12, 10));
      }
    }
  };

  const handleStartExpDate = async (date) => {
    setStartExpDatePickerVisible(false);
    setStartExpDate(dayjs(date).format('YYYY-MM-DD'));
    calculateExp();
  };

  const handleEndExpDate = async (date) => {
    setEndExpDatePickerVisible(false);
    setEndExpDate(dayjs(date).format('YYYY-MM-DD'));
    calculateExp();
  };

  const calculateExpPresent = async () => {
    const startDt = dayjs(startExpDate);
    const endDt = dayjs();
    const diffMonth = endDt.diff(startDt, 'month');
    setExperienceInMonths(diffMonth);
    setTotalYear(Math.floor(diffMonth / 12));
    setTotalMonths(parseInt(diffMonth % 12, 10));
  };

  const calculateAge = async () => {
    const tmep = await AsyncStorage.getItem('dob');
    const year = Number(tmep.substring(0, 4));
    const month = Number(tmep.substring(5, 7)) - 1;
    const day = Number(tmep.substring(8));
    const today = new Date();
    let x = today.getFullYear() - year;
    if (today.getMonth() < month || (today.getMonth() === month && today.getDate() < day)) {
      x -= 1;
    }
    await AsyncStorage.setItem('age', `${x}`);
    setAge(x);
  };

  useEffect(() => {
    const Display = () => {
      let p = 0;
      for (let i = 0; i < Experience.length; i += 1) {
        p += Experience[i].experienceInMonths;
      }
      setFinalTotalMonths(p);
      // console.log(p);
    };
    Display();
  }, [Experience]);

  useEffect(() => {
    const setDate = async () => {
      setdob(await AsyncStorage.getItem('dob'));
    };

    setDate();
  }, [dob]);
  useEffect(() => {
    const settingAge = async () => {
      setAge(await AsyncStorage.getItem('age'));
    };
    settingAge();
  }, [age]);

  // on screen load data setter
  useEffect(() => {
    const onLoadSetData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
      // console.log('=============Doctor REgistration page 2==============');
      // console.log(x);
      const Fn = x.fullName === undefined ? x.doctorName : x.fullName;

      // console.log('====Profile=====');
      // console.log(x);

      setTitle(Fn.substring(0, Fn.indexOf(' ')));
      setName(Fn.substring(Fn.indexOf(' ') + 1));
      setdoctorId(Number(x.doctorId));
      setEmail(x.email);
      setGender(x.gender);
      setCity(x.city);
      setdob(x.dob);
      setAge(`${x.age}`);
      setPinCode(x.pincode);
      setphotoPath(x.profilePhotoPath);
      if (x.profileStatus === 'INCOMPLETE' || x.profileStatus === 'IMPROPER')
        setprofileCompleted(false);
      else setprofileCompleted(true);
      setverified(false);
      setmobileNumber(x.mobileNumber);

      const temp = JSON.parse(await AsyncStorage.getItem(`${x.doctorId}speciality`));
      if (temp != null && temp.length > 0) {
        for (let i = 0; i < temp.length; i += 1) {
          if (temp[i] !== 'Other') dataSpecialization.push({ key: temp[i], value: temp[i] });
        }
      } else {
        axios
          .get(`${apiConfig.baseUrl}/suggest/specialization/dropdown?max=100&min=0`)
          .then((response) => {
            if (response.status === 200) {
              // console.log('From Service\n\n', response.data);
              const p = [];
              response.data.forEach((item) => {
                // console.log(item);
                p.push({ key: item.specialization, value: item.specialization });
              });
              p.push({ key: 'Other', value: 'Other' });
              // console.log('Modify\n\n', p);
              setdataSpecialization(p);
            }
          })
          .catch((error) => {
            Alert.alert('Error', `${error}`);
          });
      }
      const d = new Date().getFullYear();
      // console.log(x.dob);
      let i = x.dob !== undefined ? Number(x.dob.substring(0, 4)) + 16 : 1940;
      // var i = 1940;
      for (; i <= d; i += 1) {
        dataYear.push({ key: `${i}`, value: `${i}` });
      }
    };
    onLoadSetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(()=>{})

  // check data uploaded
  useEffect(() => {
    const checkMedical = async () => {
      axios
        .get(`${apiConfig.baseUrl}/doctor/medicalregistrations?doctorId=${doctorId}`)
        .then((response) => {
          if (response.data !== '') {
            setdataSavedMedReg(true);
          } else setdataSavedMedReg(false);
        })
        .catch(() => {
          // console.log('=====Error in fetching Med Reg=====');
          // console.log(error);
        });
    };
    const checkEducation = async () => {
      axios
        .get(`${apiConfig.baseUrl}/doctor/educations?doctorId=${doctorId}`)
        .then((response) => {
          if (response.data !== '') {
            setdataSavedEduDet(true);
            // qwerty
            for (let i = 0; i < response.data.length; i += 1) {
              splArray.push({
                key: response.data[i].specialization,
                value: response.data[i].specialization,
              });
            }
          } else setdataSavedEduDet(false);
        })
        .catch(() => {
          // console.log('===== Error in fetching Edu Det =====');
          // console.log(error);
        });
    };
    const checkExp = async () => {
      axios
        .get(`${apiConfig.baseUrl}/doctor/experience?doctorId=${doctorId}`)
        .then((response) => {
          if (response.data !== '') {
            setdataSavedExpDet(true);
          } else setdataSavedExpDet(false);
        })
        .catch(() => {
          // console.log('=====Error in fetching Experience=====');
          // console.log(error);
        });
    };
    const checkIden = async () => {
      axios
        .get(`${apiConfig.baseUrl}/doctor/identifications?doctorId=${doctorId}`)
        .then((response) => {
          if (response.data !== '') {
            setdataSavedIdenDet(true);
          } else setdataSavedIdenDet(false);
        })
        .catch(() => {
          // console.log('=====Error in fetching Iden det=====');
          // console.log(error);
        });
    };
    const checkAddInfo = async () => {
      axios
        .get(`${apiConfig.baseUrl}/doctor/clinic/details?doctorId=${doctorId}`)
        .then((response) => {
          if (response.data !== '') {
            setdataSavedAddInfo(true);
          } else setdataSavedAddInfo(false);
        })
        .catch(() => {
          // console.log('=====Error in fetching Clinic Det=====');
          // console.log(error);
        });
    };
    const checkPreConsult = async () => {
      axios
        .get(`${apiConfig.baseUrl}/doctor/pre/consultation/questions?doctorId=${doctorId}`)
        .then((response) => {
          if (response.data !== '') {
            setdataSavedPreConsultationQuestionaire(true);
          } else setdataSavedPreConsultationQuestionaire(false);
        })
        .catch(() => {
          // console.log('=====Error in fetching Preconsult ques=====');
          // console.log(error);
        });
    };
    const checkFees = async () => {
      axios
        .get(`${apiConfig.baseUrl}/doctor/fees?doctorId=${doctorId}`)
        .then((response) => {
          if (response.data === '') {
            setdataSavedConsultFees(false);
          } else setdataSavedConsultFees(true);
        })
        .catch(() => {
          setdataSavedConsultFees(false);

          // console.log('=====Error in fetching Consultation Fees=====');
          // console.log(error);
        });
    };
    if (doctorId != null) {
      if (profileCompleted === false) {
        // console.log('========= profile complete is false===========');
        checkMedical();
        checkEducation();
        checkExp();
        checkIden();
        checkAddInfo();
        checkPreConsult();
        checkFees();
      } else if (profileCompleted) {
        setdataSavedMedReg(true);
        setdataSavedEduDet(true);
        setdataSavedExpDet(true);
        setdataSavedIdenDet(true);
        setdataSavedAddInfo(true);
        setdataSavedPreConsultationQuestionaire(true);
        setdataSavedConsultFees(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, profileCompleted]);

  // default preconsultation questions
  useEffect(() => {
    const getDefaultQues = async () => {
      axios
        .get(`${apiConfig.baseUrl}/doctor/default/questions`)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data);
            const p = [];
            response.data.question.forEach((item) => {
              p.push({ questions: item });
            });
            setQuestionareList(p);
          }
        })
        .catch((error) => {
          Alert.alert('Default Questions', `${error}`);
        });
    };
    if (showQuestions) getDefaultQues();
  }, [showQuestions]);

  // progress bar
  useEffect(() => {
    const progressBar = async () => {
      let c = 1;
      if (dataSavedMedReg) c += 1;
      if (dataSavedEduDet) c += 1;
      if (dataSavedExpDet) c += 1;
      if (dataSavedIdenDet) c += 1;
      if (dataSavedAddInfo) c += 1;
      if (dataSavedPreConsultationQuestionaire) c += 1;
      if (dataSavedConsultFees) c += 1;
      if (photoPath != null && photoPath !== 0) c += 1;

      setCompletePercentage(`${parseInt((c / 9) * 100, 10).toString()}%`);

      if (c === 9 && profileCompleted === false) {
        setisSentForValidation(true);
        // Please wait we are processing your profile for verification
        axios
          .post(`${apiConfig.baseUrl}/doctor/profile/verify?doctorId=${doctorId}`)
          .then(async (response) => {
            if (response.status === 200) {
              setisSentForValidation(false);
              Alert.alert('Completed', 'Your profile has been sent for verification');
              setprofileCompleted(true);
            }
          })
          .catch(() => {
            setisSentForValidation(false);
            Alert.alert('Error', 'Sorry unable to send your profile for verification.');
            // console.log('=====Error Occured in Profile complete validation request=====');
            // console.log(error);
          });
      }
    };
    progressBar();

    // console.log('Use Effect ClinicDet-----------');
    // console.log(ClinicDet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataSavedMedReg,
    dataSavedEduDet,
    dataSavedExpDet,
    dataSavedIdenDet,
    dataSavedAddInfo,
    dataSavedPreConsultationQuestionaire,
    dataSavedConsultFees,
    photoPath,
  ]);

  // view list of details

  const ViewIdentifications = () =>
    IdentificationDocs.map((doc, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
        }}
        // eslint-disable-next-line react/no-array-index-key
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
          {/* Document Type */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10, marginVertical: 3 }}>
              {doc.identificationType}
            </Text>
          </View>
          {/* Identification Number */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{doc.identificationNumber}</Text>
          </View>
          {/* Actions */}
          <TouchableOpacity
            style={[
              styles.cellStyle,
              {
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            ]}
          >
            <FAIcon
              name="file-pdf"
              size={15}
              color="#2b8ada"
              onPress={() => {
                // TODO: uncomment below
                /* download(
                  doc.identificationPath,
                  doctorId,
                  `${doctorId}_DoctorIdentification_${doc.identificationType}.pdf`
                ); */
              }}
            />
            <FAIcon
              name="trash"
              color="red"
              size={15}
              onPress={() => {
                removeIdenHandler(index);
                dataIdenDocs.push({
                  key: doc.identificationType,
                  value: doc.identificationType,
                });
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    ));

  const removeIdenHandler = (i) => {
    setIdentificationDocs(IdentificationDocs.filter((obj, e) => i !== e));
  };

  const ViewEducation = () =>
    Education.map((education, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
        }}
        // eslint-disable-next-line react/no-array-index-key
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
          {/* Degree */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{education.degree}</Text>
          </View>
          {/* Passing Year */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{education.passingYear}</Text>
          </View>
          {/* Specialization */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{education.specialization}</Text>
          </View>
          {/* University */}
          <View style={styles.cellStyle}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 10,
              }}
            >
              {education.university}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.cellStyle, { flexDirection: 'row', justifyContent: 'space-around' }]}
          >
            <FAIcon
              name="file-pdf"
              size={15}
              color="#2b8ada"
              onPress={() => {
                // TODO: uncomment below
                /* download(
                  education.degreePath,
                  doctorId,
                  `${doctorId}_DoctorEducation_${education.degree}_${education.passingYear}.pdf`
                ); */
              }}
            />
            <FAIcon
              name="trash"
              color="red"
              size={15}
              onPress={() => {
                removeEduHandler(index);
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    ));

  const removeEduHandler = (i) => {
    setEducation(Education.filter((obj, e) => i !== e));
  };

  const ViewExperience = () =>
    Experience.map((experience, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
        }}
        // eslint-disable-next-line react/no-array-index-key
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
          {/* Practice At */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{experience.practiceAt}</Text>
          </View>
          {/* Start Date */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>
              {dayjs(experience.startDate).isValid()
                ? dayjs(experience.startDate).format('DD-MM-YYYY')
                : 'DD-MM-YYYY'}
            </Text>
          </View>
          {/* End Date */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>
              {dayjs(experience.endDate).isValid()
                ? dayjs(experience.endDate).format('DD-MM-YYYY')
                : ''}
            </Text>
          </View>
          {/* Total Experience */}
          <View style={styles.cellStyle}>
            {Math.floor(experience.experienceInMonths / 12) > 0 ? (
              <Text style={{ textAlign: 'center', fontSize: 10 }}>
                {`${Math.floor(experience.experienceInMonths / 12)} year(s)`}
              </Text>
            ) : null}
            {parseInt(experience.experienceInMonths % 12, 10) !== 0 ? (
              <Text style={{ textAlign: 'center', fontSize: 10 }}>
                {`${parseInt(experience.experienceInMonths % 12, 10)} month(s)`}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity style={[styles.cellStyle, { flexDirection: 'row' }]}>
            <FAIcon
              name="file-image"
              size={15}
              color="#2b8ada"
              style={{ marginRight: 10 }}
              onPress={async () => {
                if (experience.experiencePhoto != null && experience.experiencePhoto !== 0) {
                  setDisplayPhotoToken(experience.experiencePhoto);
                  //  console.log(Experience.experiencePhoto);
                  setImageViewer(true);
                } else
                  Alert.alert(
                    'No File',
                    'You have not uploaded experience certificate for this practice center.'
                  );
              }}
            />
            <FAIcon
              name="trash"
              color="red"
              size={15}
              onPress={() => {
                removeExpHandler(index);
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    ));

  const removeExpHandler = (i) => {
    setExperience(Experience.filter((obj, e) => i !== e));
  };

  const RenderQuestion = () =>
    questionareList.map((ques, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
        }}
        // eslint-disable-next-line react/no-array-index-key
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
          {/* S No. */}
          <View style={[styles.cellStyle, { flex: 0.3 }]}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{index + 1}</Text>
          </View>
          {/* Speciality */}
          {/* <View style={styles.cellStyle}>
              <Text style={{textAlign: 'center', fontSize: 10}}>
                {ques.specialization}
              </Text>
            </View> */}
          {/* Question */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{ques.questions}</Text>
          </View>

          <TouchableOpacity
            style={[styles.cellStyle, { flex: 0.4 }]}
            onPress={() => removeQuestHandler(index)}
          >
            <FAIcon name="trash" color="red" size={15} />
          </TouchableOpacity>
        </View>
      </View>
    ));

  const removeQuestHandler = (i) => {
    setQuestionareList(questionareList.filter((obj, e) => i !== e));
  };

  const ViewClinics = () =>
    ClinicDet.map((clinic, index) => (
      <View
        style={{
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
        }}
        // eslint-disable-next-line react/no-array-index-key
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
          {/* Clinic Name */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{clinic.clinicName}</Text>
          </View>
          {/* Clinic Address */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{clinic.clinicAddress}</Text>
          </View>
          {/* Special Instructions */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{clinic.specialInstruction}</Text>
          </View>
          {/* Actions */}
          <TouchableOpacity style={[styles.cellStyle, { flexDirection: 'row' }]}>
            <FAIcon
              name="file-image"
              size={15}
              color="#2b8ada"
              style={{ marginRight: 10 }}
              onPress={async () => {
                setDisplayPhotoToken(clinic.clinicPhoto);
                // console.log(clinic);
                setImageViewer(true);
              }}
            />
            <FAIcon
              name="trash"
              color="red"
              size={15}
              onPress={() => {
                removeClinicHandler(index);
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    ));

  const removeClinicHandler = (e) => {
    setClinicDet(ClinicDet.filter((obj, i) => i !== e));
  };

  // medical registration document upload
  // TODO: Uncomment below
  /* const selectDocsMedReg = async () => {
    try {
      // console.log('==============Inside select Docs==========');

      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: types.pdf,
      });

      if (pickerResult.size > 2097152)
        Alert.alert('Size Error', 'The size of the file should be less than 2MB.');
      else {
        const ext = `.${pickerResult.name.split('.').pop()}`;

        pickerResult.name = `${doctorId}_MedicalRegistration${ext}`;
        // console.log(pickerResult.name);
        setMedRegDoc([pickerResult]);

        const formData = new FormData();
        formData.append('directoryNames', '  DOCTOR_MEDICAL_REGISTRATION');
        formData.append('file', pickerResult);
        formData.append('userId', doctorId);
        const { error, response } = await fileUpload(formData);

        if (error != null) {
          // console.log('======error======');
          // console.log(error);
          Alert.alert('Error', 'There was a problem in selecting document. Please try again.');
        } else {
          // console.log('======response======');
          // console.log(response.fileToken);
          if (response.fileToken != null) {
            setcertificatePath(response.fileToken);
            setRegCert(error == null ? pickerResult.name : '');
          }
          Alert.alert('Error', 'Please try again.');
        }
      }
    } catch (e) {
      handleError(e);
    }
  }; */

  // TODO: Uncomment below
  // education document upload
  /* const selectDocsEdu = async () => {
    try {
      // console.log('==============Inside select Docs Education==========');

      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: types.pdf,
      });

      if (pickerResult.size > 2097152)
        Alert.alert('Size Error', 'The size of the file should be less than 2MB.');
      else {
        const ext = `.${pickerResult.name.split('.').pop()}`;

        pickerResult.name = `${doctorId}_DoctorEducation_${Degree}_${DegreePassingYear}${ext}`;
        // console.log(pickerResult.name);

        const formData = new FormData();
        formData.append('directoryNames', 'DOCTOR_EDUCATION');
        formData.append('file', pickerResult);
        formData.append('userId', doctorId);
        const { error, response } = await fileUpload(formData);
        if (error != null) {
          // console.log('======error======');
          // console.log(error);
          Alert.alert('Error', 'There was a problem in selecting document. Please try again.');
        } else {
          // console.log('======response======');
          // console.log(response.fileToken);
          if (response.fileToken != undefined) setdegreePath(response.fileToken);
          else Alert.alert('Error', 'Please try again.');
        }
      }
    } catch (e) {
      handleError(e);
    }
  }; */

  // TODO: Uncomment below
  // identification document upload
  /* const selectDocsIden = async () => {
    try {
      // console.log('==============Inside select Docs Identification==========');

      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: types.pdf,
      });

      if (pickerResult.size > 2097152)
        Alert.alert('Size Error', 'The size of the file should be less than 2MB.');
      else {
        const ext = `.${pickerResult.name.split('.').pop()}`;

        pickerResult.name = `${doctorId}_DoctorIdentification_${identificationType}${ext}`;
        // console.log(pickerResult.name);

        const formData = new FormData();
        formData.append('directoryNames', 'DOCTOR_IDENTIFICATION');
        formData.append('file', pickerResult);
        formData.append('userId', doctorId);
        const { error, response } = await fileUpload(formData);
        if (error != null) {
          // console.log('======error======');
          // console.log(error);
          Alert.alert('Error', 'There was a problem in selecting document. Please try again.');
        } else {
          // console.log('======response======');
          // console.log(response.fileToken);
          if (response.fileToken != undefined) setidentificationPath(response.fileToken);
          else Alert.alert('Error', 'Please try again.');
        }
      }
    } catch (e) {
      handleError(e);
    }
  }; */

  // post medical registration
  const postMedReg = async () => {
    setisUploading(true);
    const p = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const getDoctorId = Number(p.doctorId);

    const medArry = [
      {
        certificatePath,
        registrationCouncil: RegCouncil,
        registrationNo: RegNo,
        registrationYear: Number(RegYear),
        getDoctorId,
      },
    ];
    // console.log(medArry);

    axios
      .post(`${apiConfig.baseUrl}/doctor/medicalregistration/save`, medArry)
      .then((response) => {
        setisUploading(false);
        if (response.status === 201 || response.status === 200) {
          Alert.alert(
            'Details Uploaded',
            'Medical Registration details have been saved successfully.'
          );
          setShowMedReg(false);
          setdataSavedMedReg(true);
          // setShowEduDet(true);
        }
      })
      .catch((error) => {
        setisUploading(false);
        // console.log('=================Medical Error Occured=================');
        Alert.alert('Error', `${error}`);
      });
  };

  // post educational qualification

  const postEduDet = async () => {
    setisUploading(true);
    const p = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const getDoctorId = Number(p.doctorId);

    Education.forEach((item) => {
      // TODO: Check code
      // eslint-disable-next-line no-param-reassign
      item.doctorId = getDoctorId;
    });

    // console.log(Education);

    axios
      .post(`${apiConfig.baseUrl}/doctor/education/save`, Education)
      .then((response) => {
        setisUploading(false);
        if (response.status === 201 || response.status === 200) {
          Alert.alert(
            'Details Uploaded',
            'Education Qualification & Certificates details have been saved successfully.'
          );
          setShowEduDet(false);
          setdataSavedEduDet(true);
          // setShowExpDet(true);
        }
      })
      .catch((error) => {
        setisUploading(false);
        // console.log('=================Educational Error Occured=================');
        Alert.alert('Error', `${error}`);
      });
  };

  // post experience

  const postExpDet = async () => {
    setisUploading(true);
    const p = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const getDoctorId = Number(p.doctorId);

    Experience.forEach((item) => {
      // TODO: Check code
      // eslint-disable-next-line no-param-reassign
      item.doctorId = getDoctorId;
    });

    // console.log(Experience);

    axios
      .post(`${apiConfig.baseUrl}/doctor/experience/save`, Experience)
      .then((response) => {
        setisUploading(false);
        if (response.status === 201 || response.status === 200) {
          Alert.alert('Details Uploaded', 'Experience details have been saved successfully.');
          setShowExpDet(false);
          setdataSavedExpDet(true);
          // setShowIdenDet(true);
        }
      })
      .catch((error) => {
        setisUploading(false);
        // console.log('=================Experience Error Occured=================');
        // console.log(error);
        Alert.alert('Error', `${error}`);
      });
  };

  // post Identification

  const postIdenDet = async () => {
    setisUploading(true);
    const p = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const getDoctorId = Number(p.doctorId);

    IdentificationDocs.forEach((item) => {
      // TODO: Check code
      // eslint-disable-next-line no-param-reassign
      item.doctorId = getDoctorId;
    });

    // console.log(IdentificationDocs);

    axios
      .post(`${apiConfig.baseUrl}/doctor/identifications/save`, IdentificationDocs)
      .then((response) => {
        setisUploading(false);
        if (response.status === 201 || response.status === 200) {
          Alert.alert('Details Uploaded', 'Identification details have been saved successfully.');
          setShowIdenDet(false);
          setdataSavedIdenDet(true);
          // setShowAddInfo(true);
        }
      })
      .catch((error) => {
        setisUploading(false);
        // console.log('=================Identification Error Occured=================');
        // console.log(error);
        Alert.alert('Error', `${error}`);
      });
  };

  // post Clinic Information

  const postClinicDet = async () => {
    setisUploading(true);
    const p = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const getDoctorId = Number(p.doctorId);

    ClinicDet.forEach((item) => {
      // TODO: Check code
      // eslint-disable-next-line no-param-reassign
      item.doctorId = getDoctorId;
    });

    // console.log(ClinicDet);

    axios
      .post(`${apiConfig.baseUrl}/doctor/clinic/save`, ClinicDet)
      .then((response) => {
        setisUploading(false);
        if (response.status === 201 || response.status === 200) {
          Alert.alert('Details Uploaded', 'Clinic details have been saved successfully.');
          setShowAddInfo(false);
          setdataSavedAddInfo(true);
        }
      })
      .catch((error) => {
        setisUploading(false);
        // console.log('=================Clinic Error Occured=================');
        // console.log(error);
        Alert.alert('Error', `${error}`);
      });
  };

  // post Clinic Information

  const postPreConsultQues = async () => {
    setisUploading(true);
    const p = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const getDoctorId = Number(p.doctorId);

    questionareList.forEach((item) => {
      // TODO: Check code
      // eslint-disable-next-line no-param-reassign
      item.doctorId = getDoctorId;
    });

    // console.log(questionareList);

    axios
      .post(`${apiConfig.baseUrl}/doctor/preconsultation/questions/save`, questionareList)
      .then((response) => {
        setisUploading(false);
        if (response.status === 201 || response.status === 200) {
          Alert.alert(
            'Details Uploaded',
            'Pre-Consulation  questions have been saved successfully.'
          );
          setdataSavedPreConsultationQuestionaire(true);
          setShowPreConsultationQuestionaire(false);
        }
      })
      .catch((error) => {
        setisUploading(false);
        /* console.log(
          '=================Pre Consultation Questionnaire Error Occured================='
        ); */
        // console.log(error);
        Alert.alert('Error', `${error}`);
      });
  };

  // post consultation Fees

  const postConsultFees = async () => {
    setisUploading(true);

    const p = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
    const getDoctorId = Number(p.doctorId);
    const amp = {
      getDoctorId,
      econsulationFees: eConsulationFees,
      efollowUpFees,
      followUpDuration: Number(showFollowUp),
      physicalfollowUpFees,
      physicalConsulationFees,
    };

    axios
      .post(`${apiConfig.baseUrl}/doctor/fees/save`, amp)
      .then((response) => {
        setisUploading(false);

        if (response.status === 201 || response.status === 200) {
          Alert.alert('Details Uploaded', 'Fees details have been saved successfully.');
          setShowConsultFees(false);
          setdataSavedConsultFees(true);
        }
      })
      .catch((error) => {
        setisUploading(false);
        // console.log('=================Fees Error Occured=================');
        // console.log(error);
        Alert.alert('Error', `${error}`);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <StatusBar animated backgroundColor="#2B8ADA" />

      <SafeAreaView
        style={{
          backgroundColor: '#e8f0fe',
          width: '100%',
          // marginTop: 30,
        }}
      >
        {/* Completion Bar */}
        <View
          style={{
            // elevation: 20,
            marginTop: 30,
            backgroundColor: 'white',
            width: '90%',
            height: 15,
            alignSelf: 'center',
            borderRadius: 10,
          }}
        >
          <View
            style={{
              width: completePercentage,
              height: 15,
              borderRadius: 10,
              backgroundColor: '#2b8ada',
              flexDirection: 'column',
            }}
          >
            <Text
              style={{
                fontSize: 10,
                alignSelf: 'center',
                color: 'white',
              }}
            >
              {completePercentage}
            </Text>
          </View>
        </View>
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
            alignSelf: 'center',
            padding: 10,
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            {/* Doctor Image */}
            <View
              style={{
                backgroundColor: 'white',
                width: 100,
                height: 100,
                borderRadius: 150,
                alignSelf: 'center',
                marginVertical: 20,
              }}
            >
              {photoPath == null || photoPath === 0 ? (
                <Image
                  style={{
                    alignSelf: 'center',
                    width: 75,
                    height: 75,
                    borderRadius: 100,
                  }}
                  source={gender === 'Male' ? doctor : doctorFemale}
                />
              ) : (
                <Image
                  style={{
                    alignSelf: 'center',
                    width: 75,
                    height: 75,
                    borderRadius: 100,
                  }}
                  source={{
                    uri: `${apiConfig.baseUrl}/file/download?fileToken=${photoPath}&userId=${doctorId}`,
                  }}
                />
              )}
              <TouchableOpacity onPress={chooseProfileImage}>
                <FAIcon
                  name="camera"
                  size={20}
                  color="white"
                  style={{
                    top: -25,
                    right: -30,
                    padding: 10,
                    backgroundColor: 'gray',
                    borderRadius: 100,
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
            </View>
            {photoPath == null || photoPath === 0 ? (
              <Text style={{ fontSize: 12, alignSelf: 'center' }}>
                Please add Profile photo to complete your profile
              </Text>
            ) : null}
          </View>

          {/* Profile Messages */}
          {profileCompleted && verified === false ? (
            <View
              style={{
                backgroundColor: '#21c47f',
                padding: 10,
                borderColor: '#21c47f',
                borderWidth: 1,
                width: '95%',
                alignSelf: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                borderRadius: 10,
                marginBottom: 10,
                paddingHorizontal: 10,
              }}
            >
              <FAIcon
                name="info-circle"
                color="white"
                size={20}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  color: 'white',
                }}
              >
                Your account {!verified ? 'verification is under process' : null}
              </Text>
            </View>
          ) : null}

          <View style={{ width: '95%', alignSelf: 'center' }}>
            {/* General Info Label */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={[
                  styles.whiteLabelView,
                  showGenInfo
                    ? {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginBottom: 0,
                      }
                    : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    { flexDirection: 'row', width: '100%' },
                    showGenInfo ? { borderBottomWidth: 0.5, borderBottomColor: '#707070' } : null,
                  ]}
                >
                  <FAIcon
                    name="info-circle"
                    size={15}
                    color={dataSavedGenInfo ? '#2b8ada' : 'gray'}
                    style={{ marginHorizontal: 5, alignSelf: 'center' }}
                  />
                  <Text
                    style={[
                      styles.label,
                      { width: '85%' },
                      dataSavedGenInfo ? { color: '#2B8ADA', width: '85%' } : null,
                    ]}
                  >
                    General Information
                  </Text>
                  <FAIcon
                    name={showGenInfo ? 'chevron-down' : 'check-circle'}
                    style={[
                      styles.label,
                      { width: '10%', fontSize: 20 },
                      dataSavedGenInfo ? { color: '#2B8ADA' } : { color: 'gray' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* General Info Body */}
            {showGenInfo ? (
              <View>
                <View style={styles.whiteBodyView}>
                  <View style={{ flexDirection: 'column', marginVertical: 10 }}>
                    {/* <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                        backgroundColor: "#E8F0FE",
                        width: "90%",
                        height: 52,
                        borderRadius: 5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignSelf: "center",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Image
                            source={upload}
                            style={{ marginRight: "5%" }}
                          ></Image>
                          <Text style={{ fontSize: 12 }}>Upload Image</Text>
                        </View>
                      </View>
                    </View> */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <View style={{ flex: 0.45, marginRight: '5%' }}>
                        <Text style={styles.inputLabel}>Title</Text>
                        {GenInfoEdit ? (
                          <SelectList
                            defaultOption="Mr."
                            placeholder={title}
                            setSelected={(val) => setTitle(val)}
                            data={dataTitle}
                            save="value"
                            boxStyles={{
                              backgroundColor: '#E8F0FE',
                              borderWidth: 0,
                            }}
                            dropdownStyles={{ backgroundColor: 'white' }}
                            dropdownTextStyles={{
                              color: '#2b8ada',
                              fontWeight: 'bold',
                            }}
                            badgeStyles={{ backgroundColor: '#2b8ada' }}
                          />
                        ) : (
                          <Text
                            style={[styles.textInput, { backgroundColor: '#d0e0fc', padding: 10 }]}
                          >
                            {title}
                          </Text>
                        )}
                      </View>
                      <View style={{ flex: 0.45 }}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            { backgroundColor: '#d0e0fc' },
                            GenInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                          ]}
                          placeholderTextColor="black"
                          onChangeText={(text) => setName(text)}
                          value={name}
                          editable={GenInfoEdit}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <View style={{ flex: 0.45, marginRight: '5%' }}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            { backgroundColor: '#d0e0fc' },
                            GenInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                          ]}
                          placeholderTextColor="black"
                          keyboardType="email-address"
                          onChangeText={(text) => setEmail(text)}
                          value={email}
                          editable={GenInfoEdit}
                        />
                      </View>
                      <View style={{ flex: 0.45 }}>
                        <Text style={styles.inputLabel}>Gender</Text>
                        {GenInfoEdit ? (
                          <SelectList
                            labelStyles={{ height: 0 }}
                            placeholder={gender}
                            setSelected={(val) => setGender(val)}
                            data={dataGender}
                            save="value"
                            boxStyles={{
                              backgroundColor: '#E8F0FE',
                              borderWidth: 0,
                            }}
                            dropdownStyles={{ backgroundColor: 'white' }}
                            dropdownTextStyles={{
                              color: '#2b8ada',
                              fontWeight: 'bold',
                            }}
                            badgeStyles={{ backgroundColor: '#2b8ada' }}
                          />
                        ) : (
                          <Text
                            style={[
                              styles.textInput,
                              { backgroundColor: '#d0e0fc', padding: 10 },
                              GenInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                            ]}
                          >
                            {gender}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <View style={{ flex: 0.45, marginRight: '5%' }}>
                        <Text style={styles.inputLabel}>Pin Code</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            { backgroundColor: '#d0e0fc' },
                            GenInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                          ]}
                          maxLength={6}
                          onChangeText={(text) => setPinCode(text)}
                          value={PinCode}
                          editable={GenInfoEdit}
                        />
                      </View>
                      <View style={{ flex: 0.45 }}>
                        <Text style={styles.inputLabel}>City</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            { backgroundColor: '#d0e0fc' },
                            GenInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                          ]}
                          placeholderTextColor="black"
                          onChangeText={(text) => setCity(text)}
                          value={city}
                          editable={GenInfoEdit}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <View style={{ flex: 0.45, marginRight: '5%' }}>
                        <Text style={styles.inputLabel}>Date Of Birth</Text>
                        <View>
                          <Text
                            style={[styles.textInput, { backgroundColor: '#d0e0fc', padding: 10 }]}
                          >
                            {dayjs(dob).format('DD-MM-YYYY')}
                          </Text>
                          <FAIcon
                            name="calendar-alt"
                            color="gray"
                            size={16}
                            style={{
                              position: 'absolute',
                              right: 0,
                              bottom: 0,
                              margin: '5%',
                              alignSelf: 'center',
                            }}
                            onPress={GenInfoEdit ? showDatePicker : null}
                          />
                        </View>
                      </View>

                      <View style={{ flex: 0.45 }}>
                        <Text style={styles.inputLabel}>Age</Text>
                        <Text
                          style={[styles.textInput, { backgroundColor: '#d0e0fc', padding: 10 }]}
                        >
                          {age}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '95%',
                        alignSelf: 'center',
                      }}
                    >
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        display="spinner"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                      />
                    </View>
                    {GenInfoEdit ? (
                      <CustomButton
                        text="Update"
                        textstyle={{ color: 'white', alignSelf: 'center' }}
                        onPress={() => {
                          Alert.alert('All changes made in Genreal Information have been updated');
                          clearKeys();
                          setGenInfoEdit(false);
                        }}
                        style={{
                          width: '50%',
                          marginTop: 15,
                          flexDirection: 'column',
                          alignSelf: 'center',
                          backgroundColor: '#2B8ADA',
                        }}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}

            {/* Medical Registration Label */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={[
                  styles.whiteLabelView,
                  showMedReg
                    ? {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginBottom: 0,
                      }
                    : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    { flexDirection: 'row', width: '100%' },
                    showMedReg ? { borderBottomWidth: 0.5, borderBottomColor: '#707070' } : null,
                  ]}
                  onPress={() => {
                    if (dataSavedMedReg) setShowMedReg(false);
                    else setShowMedReg(!showMedReg);
                  }}
                >
                  <FAIcon
                    name="file-medical"
                    size={15}
                    color={dataSavedMedReg ? '#2b8ada' : 'gray'}
                    style={{ marginHorizontal: 5, alignSelf: 'center' }}
                  />
                  <Text
                    style={[
                      styles.label,
                      { width: '85%' },
                      dataSavedMedReg ? { color: '#2B8ADA' } : null,
                    ]}
                  >
                    Medical Registration
                  </Text>
                  <FAIcon
                    name={
                      // eslint-disable-next-line no-nested-ternary
                      showMedReg
                        ? 'chevron-down'
                        : dataSavedMedReg
                        ? 'check-circle'
                        : 'chevron-right'
                    }
                    style={[
                      styles.label,
                      { width: '10%', fontSize: 20 },
                      dataSavedMedReg ? { color: '#2b8ada' } : { color: 'gray' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Medical Registration Body */}
            {showMedReg ? (
              <View>
                <View style={styles.whiteBodyView}>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginBottom: 10,
                      width: '95%',
                      alignSelf: 'center',
                    }}
                  >
                    {/* REgistration Number */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.inputLabel, { marginTop: 0 }]}>
                          Registration Number
                        </Text>
                        <TextInput
                          style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                          placeholderTextColor="black"
                          onChangeText={(text) => setRegNo(text)}
                          maxLength={20}
                          value={RegNo}
                        />
                      </View>
                    </View>
                    {/* Registraion Concil */}
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel]}>Registration Council</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                        placeholderTextColor="black"
                        onChangeText={(text) => setRegCouncil(text)}
                        maxLength={20}
                        value={RegCouncil}
                      />
                    </View>

                    {/* Certificate and Year */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <View style={{ flex: 1, marginRight: '5%' }}>
                        <Text style={styles.inputLabel}>Reg. Certificate</Text>
                        <View>
                          <TextInput
                            style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                            placeholderTextColor="black"
                            value={RegCert}
                            editable={false}
                          />
                          <FAIcon
                            name="upload"
                            color="gray"
                            size={16}
                            style={{
                              position: 'absolute',
                              right: 0,
                              bottom: 0,
                              paddingRight: '5%',
                              marginBottom: '5%',
                              backgroundColor: '#E8F0FE',
                            }}
                            onPress={() => {
                              if (RegNo === '')
                                Alert.alert(
                                  'Incomplete Details!',
                                  'Please Fill Registration Number'
                                );
                              else if (RegCouncil === '')
                                Alert.alert(
                                  'Incomplete Details!',
                                  'Please Fill Registration Council Name'
                                );
                              else if (RegYear === '')
                                Alert.alert(
                                  'Incomplete Details!',
                                  'Please enter Registration Year'
                                );
                              else {
                                // TODO: Uncomment below
                                // selectDocsMedReg();
                              }
                            }}
                          />
                        </View>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputLabel}>Reg. Year</Text>
                        <SelectList
                          placeholder={' '}
                          boxStyles={{
                            backgroundColor: '#e8f0fe',
                            borderWidth: 0,
                          }}
                          dropdownTextStyles={{
                            color: '#2b8ada',
                            fontWeight: 'bold',
                          }}
                          setSelected={setRegYear}
                          data={dataYear}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        marginVertical: 5,
                        color: 'red',
                        fontSize: 9,
                      }}
                    >
                      Note:-{'\n'} Upload certificate in pdf format of max size 2MB.
                    </Text>
                    <View
                      style={{
                        marginTop: 15,
                        flexDirection: 'row-reverse',
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CustomButton
                        text="Save"
                        textstyle={{ fontSize: 12, color: 'white' }}
                        style={{
                          // marginRight: '5%',
                          // flex: 0.5,
                          flex: 1,
                          backgroundColor: '#2b8ada',
                          padding: 5,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          if (RegNo === '')
                            Alert.alert('Incomplete Details!', 'Please Fill Registration Number');
                          else if (RegCouncil === '')
                            Alert.alert('Incomplete Details!', 'Please Fill Registration Council');
                          else if (RegYear === '')
                            Alert.alert('Incomplete Details!', 'Please Select Registration Year');
                          else if (certificatePath == null)
                            Alert.alert(
                              'Incomplete Details!',
                              'Please Upload Medical Registration Certificate'
                            );
                          // else if (certificatePath == '')
                          //   Alert.alert('Incomplete Details!', 'Please Select Document');
                          else if (!checkAlphanumicOnly(RegNo)) {
                            Alert.alert(
                              'Invalid Input',
                              'Please enter letters and numbers only in Registration Number.'
                            );
                            setRegNo('');
                          } else if (!checkAlphanumicOnly(RegCouncil)) {
                            Alert.alert(
                              'Invalid Input',
                              'Please enter letters and numbers only in Registration Number.'
                            );
                            setRegCouncil('');
                          } else postMedReg();
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Education Qualifications & Certificates Label */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={[
                  styles.whiteLabelView,

                  showEduDet
                    ? {
                        borderBottomRightRadius: 0,
                        borderBottomLeftRadius: 0,
                        marginBottom: 0,
                      }
                    : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    { flexDirection: 'row', width: '100%' },
                    showEduDet ? { borderBottomWidth: 0.5, borderBottomColor: '#707070' } : null,
                  ]}
                  onPress={() => {
                    if (dataSavedEduDet) setShowEduDet(false);
                    else setShowEduDet(!showEduDet);
                  }}
                >
                  <MIcons
                    name="certificate"
                    size={20}
                    color={dataSavedEduDet ? '#2b8ada' : 'gray'}
                    style={{ marginHorizontal: 2, alignSelf: 'center' }}
                  />
                  <Text
                    style={[
                      styles.label,
                      { width: '85%' },
                      dataSavedEduDet ? { color: '#2B8ADA' } : null,
                    ]}
                  >
                    Educational Qualifications & Certificates
                  </Text>
                  <FAIcon
                    name={
                      // eslint-disable-next-line no-nested-ternary
                      showEduDet
                        ? 'chevron-down'
                        : dataSavedEduDet
                        ? 'check-circle'
                        : 'chevron-right'
                    }
                    style={[
                      styles.label,
                      { width: '10%', fontSize: 20 },
                      dataSavedEduDet ? { color: '#2b8ada' } : { color: 'gray' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Education Qualifications & Certificates Body */}
            {showEduDet ? (
              <View style={{ flex: 1 }}>
                <View style={styles.whiteBodyView}>
                  {Education.length > 0 ? (
                    <View>
                      {/* Heading */}
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
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>Degree</Text>
                          </View>
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>Degree Year</Text>
                          </View>
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>Speciality</Text>
                          </View>
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>University</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
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
                      <ViewEducation />
                    </View>
                  ) : null}
                  {Education.length === 0 || addMoreEduDet ? (
                    <View
                      style={{
                        width: '95%',
                        alignSelf: 'center',
                        marginBottom: 10,
                        padding: 5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'column',
                          marginBottom: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{ flex: 0.475 }}>
                            <Text style={styles.inputLabel}>Degree</Text>
                            <TextInput
                              style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                              onChangeText={(text) => setDegree(text)}
                              maxLength={50}
                              value={Degree}
                            />
                          </View>
                          <View style={{ flex: 0.475 }}>
                            <Text style={styles.inputLabel}>Degree Passing Year</Text>
                            <SelectList
                              placeholder={' '}
                              boxStyles={{
                                backgroundColor: '#e8f0fe',
                                borderWidth: 0,
                              }}
                              dropdownTextStyles={{
                                color: '#2b8ada',
                                fontWeight: 'bold',
                              }}
                              setSelected={setDegreePassingYear}
                              data={dataYear}
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.inputLabel, { marginBottom: 10 }]}>
                              Specialization
                            </Text>
                            <SelectList
                              labelStyles={{ height: 0 }}
                              placeholder={' '}
                              setSelected={(val) => setSpecialization(val)}
                              data={dataSpecialization}
                              save="value"
                              boxStyles={{
                                backgroundColor: '#E8F0FE',
                                borderWidth: 0,
                              }}
                              dropdownStyles={{ backgroundColor: 'white' }}
                              dropdownTextStyles={{
                                color: '#2b8ada',
                                fontWeight: 'bold',
                              }}
                              badgeStyles={{ backgroundColor: '#2b8ada' }}
                            />
                          </View>
                          {Specialization === 'Other' ? (
                            <View style={{ flex: 1 }}>
                              <Text style={styles.inputLabel}>Other Speciality</Text>
                              <TextInput
                                style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                                onChangeText={(text) => setOtherSpeciality(text)}
                                maxLength={50}
                                value={Otherspeciality}
                              />
                            </View>
                          ) : null}
                          <View style={{ flex: 1 }}>
                            <Text style={styles.inputLabel}>University</Text>
                            <TextInput
                              style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                              onChangeText={(text) => setUniversity(text)}
                              maxLength={100}
                              value={University}
                            />
                          </View>
                        </View>
                      </View>

                      {/* Buttons */}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginVertical: 5,
                          flex: 1,
                          marginBottom: 10,
                        }}
                      >
                        <CustomButton
                          text={degreePath == null ? 'Select File' : ' ✓ File Selected'}
                          textstyle={{
                            color: degreePath == null ? '#2b8ada' : '#21c47f',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 6,
                            paddingHorizontal: 10,
                            borderWidth: 2,
                            borderColor: degreePath == null ? '#2b8ada' : '#21c47f',
                          }}
                          onPress={() => {
                            if (
                              Degree === '' ||
                              DegreePassingYear === '' ||
                              Specialization === '' ||
                              University === ''
                            )
                              Alert.alert(
                                'Incomplete Details',
                                'Before Uploading Document(s) please fill in details'
                              );
                            // TODO: Uncomment below
                            // else selectDocsEdu();
                          }}
                        />

                        <CustomButton
                          text="Add To List"
                          textstyle={{ color: 'white', fontSize: 12 }}
                          style={{
                            backgroundColor: '#2b8ada',
                            borderRadius: 5,
                            padding: 6,
                            paddingHorizontal: 10,
                            position: 'absolute',
                            right: 0,
                          }}
                          onPress={() => {
                            if (Degree === '')
                              Alert.alert('Incomplete Details!', 'Please fill Degree Name');
                            else if (DegreePassingYear === '')
                              Alert.alert('Incomplete Details!', 'Please fill Degree Passing Year');
                            else if (Specialization === '')
                              Alert.alert('Incomplete Details!', 'Please Select Specialization');
                            else if (University === '')
                              Alert.alert('Incomplete Details!', 'Please fill University Name');
                            else if (degreePath === null)
                              Alert.alert(
                                'Incomplete Details!',
                                'Please select degree certificate file'
                              );
                            else if (Specialization === 'Other' && Otherspeciality === '')
                              Alert.alert('Incomplete Details!', 'Please specify speciality name');
                            else {
                              // const totalexp = parseInt(TotalYear) * 12 + parseInt(TotalMonths);

                              const newArry = [];
                              newArry.push({
                                key: Specialization,
                                value: Specialization,
                              });
                              setsplArray([...splArray, ...newArry]);

                              const p = {
                                degree: Degree,
                                degreePath,
                                passingYear: Number(DegreePassingYear),
                                specialization:
                                  Specialization === 'Other' ? Otherspeciality : Specialization,
                                university: University,
                              };
                              const arr = [...Education];
                              arr.push(p);
                              setEducation(arr);
                              setDegree('');
                              setDegreePassingYear('');
                              setSpecialization('');
                              setdegreePath(null);
                              setUniversity('');
                              setaddMoreEduDet(false);
                            }
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: 9,
                          marginTop: 2,
                          color: 'red',
                        }}
                      >
                        Note:-{'\n'} Upload University Degree Certificate in pdf format of max size
                        2MB.
                      </Text>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <CustomButton
                        text="+ Add More"
                        textstyle={{ color: '#2b8ada', fontSize: 10 }}
                        style={{
                          alignSelf: 'flex-end',
                          width: 80,
                          borderColor: '#2b8ada',
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 3,
                          paddingHorizontal: 10,
                          marginTop: 10,
                        }}
                        onPress={() => setaddMoreEduDet(true)}
                      />
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      marginTop: 15,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: '95%',
                    }}
                  >
                    {Education.length > 0 ? (
                      <CustomButton
                        text="Save"
                        textstyle={{ color: 'white', fontSize: 12 }}
                        style={{
                          // marginRight: '5%',
                          // flex: 0.5,
                          flex: 1,
                          backgroundColor: '#2b8ada',
                          padding: 5,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          if (Education.length === 0)
                            Alert.alert(
                              'Incomplete Details!',
                              'Please Fill Education details before uploading.'
                            );
                          else postEduDet();
                        }}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}
            {/* Experience Label */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={[
                  styles.whiteLabelView,

                  showExpDet
                    ? {
                        borderBottomRightRadius: 0,
                        borderBottomLeftRadius: 0,
                        marginBottom: 0,
                      }
                    : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    { flexDirection: 'row', width: '100%' },
                    showExpDet ? { borderBottomWidth: 0.5, borderBottomColor: '#707070' } : null,
                  ]}
                  onPress={() => {
                    if (dataSavedExpDet) setShowExpDet(false);
                    else setShowExpDet(!showExpDet);
                  }}
                >
                  <FAIcon
                    name="calendar-plus"
                    size={15}
                    color={dataSavedExpDet ? '#2b8ada' : 'gray'}
                    style={{ marginHorizontal: 5, alignSelf: 'center' }}
                  />
                  <Text
                    style={[
                      styles.label,
                      { width: '85%' },
                      dataSavedExpDet ? { color: '#2B8ADA' } : null,
                    ]}
                  >
                    Experience
                  </Text>
                  <FAIcon
                    name={
                      // eslint-disable-next-line no-nested-ternary
                      showExpDet
                        ? 'chevron-down'
                        : dataSavedExpDet
                        ? 'check-circle'
                        : 'chevron-right'
                    }
                    // color={dataSavedExpDet ? '#2B8ADA' : 'gray'}
                    style={[
                      styles.label,
                      { width: '10%', fontSize: 20 },
                      dataSavedExpDet ? { color: '#2b8ada' } : { color: 'gray' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Experience Body */}
            {showExpDet ? (
              <View style={{ flex: 1 }}>
                <View style={styles.whiteBodyView}>
                  {Experience.length > 0 ? (
                    <View>
                      {/* Heading */}
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
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>Practice At</Text>
                          </View>
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>Start Date</Text>
                          </View>
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>End Date</Text>
                          </View>
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>Experience</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
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
                      <ViewExperience />
                    </View>
                  ) : null}
                  {Experience.length === 0 || addMoreExpDet ? (
                    <View
                      style={{
                        width: '95%',
                        alignSelf: 'center',
                        marginBottom: 10,
                        padding: 5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'column',
                          marginBottom: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.inputLabel, { marginTop: 0 }]}>Practice At</Text>
                            <TextInput
                              style={[styles.textInput, { backgroundColor: '#E8F0FE' }]}
                              onChangeText={(text) => setPracticeAt(text)}
                              maxLength={50}
                              value={practiceAt}
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{ flex: 0.475 }}>
                            <Text style={styles.inputLabel}>Start Date</Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                backgroundColor: '#E8F0FE',
                                borderRadius: 10,
                              }}
                            >
                              <Text style={[styles.textInput, { flex: 1 }]}>
                                {dayjs(startExpDate).isValid()
                                  ? dayjs(startExpDate).format('DD-MM-YYYY')
                                  : 'DD-MM-YYYY'}
                              </Text>
                              <FAIcon
                                name="calendar-alt"
                                color="gray"
                                size={20}
                                style={{
                                  marginHorizontal: 5,
                                  position: 'absolute',
                                  right: 0,
                                }}
                                onPress={() => {
                                  setStartExpDatePickerVisible(true);
                                }}
                              />
                            </View>
                            <DateTimePickerModal
                              isVisible={isStartExpDatePickerVisible}
                              mode="date"
                              display="spinner"
                              date={
                                dayjs(startExpDate).isValid()
                                  ? dayjs(startExpDate).toDate()
                                  : dayjs().toDate()
                              }
                              maximumDate={dayjs().toDate()}
                              onConfirm={handleStartExpDate}
                              onCancel={() => {
                                setStartExpDatePickerVisible(false);
                              }}
                            />
                          </View>
                          <View style={{ flex: 0.475 }}>
                            <Text style={styles.inputLabel}>End Date</Text>

                            {!checkPresent ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  width: '100%',
                                  alignItems: 'center',
                                  backgroundColor: '#E8F0FE',
                                  borderRadius: 10,
                                }}
                              >
                                <Text style={[styles.textInput, { flex: 1 }]}>
                                  {dayjs(endExpDate).isValid()
                                    ? dayjs(endExpDate).format('DD-MM-YYYY')
                                    : 'DD-MM-YYYY'}
                                </Text>
                                <FAIcon
                                  name="calendar-alt"
                                  color="gray"
                                  size={20}
                                  style={{
                                    marginHorizontal: 5,
                                    position: 'absolute',
                                    right: 0,
                                  }}
                                  onPress={() => {
                                    setEndExpDatePickerVisible(true);
                                  }}
                                />
                              </View>
                            ) : null}
                            <DateTimePickerModal
                              isVisible={isEndExpDatePickerVisible}
                              mode="date"
                              display="spinner"
                              date={
                                dayjs(endExpDate).isValid()
                                  ? dayjs(endExpDate).toDate()
                                  : dayjs().toDate()
                              }
                              maximumDate={dayjs().toDate()}
                              onConfirm={handleEndExpDate}
                              onCancel={() => {
                                setEndExpDatePickerVisible(false);
                              }}
                            />
                            {/* TODO: Uncomment below */}
                            {/* <CheckBox
                              title={<Text style={{ fontSize: 10 }}>Present (Current)</Text>}
                              containerStyle={{
                                marginTop: 3,
                                width: '100%',
                                borderWidth: 0,
                                padding: 0,
                                backgroundColor: 'white',
                              }}
                              checkedColor="#2b8ada"
                              checked={checkPresent}
                              onPress={async () => {
                                setcheckPresent(!checkPresent);
                                await calculateExpPresent();
                              }}
                            /> */}
                          </View>
                        </View>
                        <Text style={styles.inputLabel}>Experience Certificate</Text>
                        <CustomButton
                          text={expPhotoPath === 0 ? 'Select Photo' : ' ✓ Photo Selected'}
                          textstyle={{
                            color: expPhotoPath === 0 ? '#2b8ada' : '#21c47f',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 6,
                            marginVertical: 3,
                            paddingHorizontal: 10,
                            borderWidth: 2,
                            borderColor: expPhotoPath === 0 ? '#2b8ada' : '#21c47f',
                          }}
                          onPress={async () => {
                            if (practiceAt === '')
                              Alert.alert(
                                'Incomplete Details!',
                                'Please add Clinic/Hospital practice name'
                              );
                            else {
                              await choosePhoto('Experience');
                            }
                          }}
                        />
                        <Text
                          style={{
                            alignSelf: 'flex-start',
                            fontSize: 9,
                            marginTop: 2,
                            marginLeft: 10,
                            color: 'red',
                          }}
                        >
                          Note:-{'\n'} Upload image ( .jpg, .jpeg, .png ) of max size 2MB.
                        </Text>
                      </View>

                      {/* Display Experience */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <View style={{ flex: 0.475, flexDirection: 'column' }}>
                          <Text style={styles.inputLabel}>Experience (in Years)</Text>
                          <Text style={styles.textInput}>{TotalYear}</Text>
                        </View>
                        <View style={{ flex: 0.475, flexDirection: 'column' }}>
                          <Text style={styles.inputLabel}>Experience (in Months)</Text>
                          <Text style={styles.textInput}>{TotalMonths}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginVertical: 5,
                          flex: 1,
                          marginBottom: 10,
                        }}
                      >
                        <CustomButton
                          text="Add To List"
                          textstyle={{ color: 'white', fontSize: 12 }}
                          style={{
                            backgroundColor: '#2b8ada',
                            borderRadius: 5,
                            padding: 6,
                            paddingHorizontal: 10,
                            position: 'absolute',
                            right: 0,
                          }}
                          onPress={() => {
                            if (practiceAt === '')
                              Alert.alert(
                                'Incomplete Details!',
                                'Please add Clinic/Hospital practice name'
                              );
                            else if (startExpDate === '')
                              Alert.alert(
                                'Incomplete Details!',
                                'Please select practice start date'
                              );
                            else if (endExpDate === '' && checkPresent === false)
                              Alert.alert('Incomplete Details!', 'Please select practice end date');
                            // else if (expPhotoPath == 0)
                            //   Alert.alert(
                            //     'Incomplete Details!',
                            //     'Please upload experience certificate.',
                            //   );
                            else {
                              const p = {
                                currentlyThere: checkPresent,
                                endDate: endExpDate,
                                experienceInMonths,
                                experiencePhoto: expPhotoPath,
                                practiceAt,
                                startDate: startExpDate,
                              };

                              const arr = [...Experience];
                              arr.push(p);
                              setExperience(arr);
                              setPracticeAt('');
                              setStartExpDate('');
                              setEndExpDate('');
                              setExperienceInMonths('');
                              setTotalYear('');
                              setTotalMonths('');
                              setcheckPresent(false);
                              setexpPhotoPath(0);
                              setaddMoreExpDet(false);
                            }
                          }}
                        />
                      </View>

                      {Experience.length > 0 ? (
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{ flex: 0.45, flexDirection: 'column' }}>
                            <Text style={styles.inputLabel}>Total Experience (in Years)</Text>
                            <Text style={styles.textInput}>
                              {Math.floor(FinalTotalMonths / 12)}
                            </Text>
                          </View>
                          <View style={{ flex: 0.45, flexDirection: 'column' }}>
                            <Text style={styles.inputLabel}>Total Experience (in Months)</Text>
                            <Text style={styles.textInput}>{FinalTotalMonths % 12}</Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <CustomButton
                        text="+ Add More"
                        textstyle={{ color: '#2b8ada', fontSize: 10 }}
                        style={{
                          alignSelf: 'flex-end',
                          width: 80,
                          borderColor: '#2b8ada',
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 3,
                          paddingHorizontal: 10,
                          marginTop: 10,
                        }}
                        onPress={() => setaddMoreExpDet(true)}
                      />
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      marginTop: 15,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: '95%',
                    }}
                  >
                    {Experience.length > 0 ? (
                      <CustomButton
                        text="Save"
                        textstyle={{ fontSize: 12, color: 'white' }}
                        style={{
                          flex: 1,
                          backgroundColor: '#2b8ada',
                          padding: 5,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          if (Experience.length === 0)
                            Alert.alert(
                              'Incomplete Details!',
                              'Please Fill Experience details before uploading '
                            );
                          else postExpDet();
                        }}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}

            {/* Identification Label */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={[
                  styles.whiteLabelView,
                  showIdenDet
                    ? {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginBottom: 0,
                      }
                    : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    { flexDirection: 'row', width: '100%' },
                    showIdenDet ? { borderBottomWidth: 0.5, borderBottomColor: '#707070' } : null,
                  ]}
                  onPress={() => {
                    if (dataSavedIdenDet) setShowIdenDet(false);
                    else setShowIdenDet(!showIdenDet);
                  }}
                >
                  <FAIcon
                    name="address-card"
                    size={15}
                    color={dataSavedIdenDet ? '#2b8ada' : 'gray'}
                    style={{ marginHorizontal: 5, alignSelf: 'center' }}
                  />
                  <Text
                    style={[
                      styles.label,
                      { width: '85%' },
                      dataSavedIdenDet ? { color: '#2B8ADA' } : null,
                    ]}
                  >
                    Identification
                  </Text>
                  <FAIcon
                    name={
                      // eslint-disable-next-line no-nested-ternary
                      showIdenDet
                        ? 'chevron-down'
                        : dataSavedIdenDet
                        ? 'check-circle'
                        : 'chevron-right'
                    }
                    style={[
                      styles.label,
                      { width: '10%', fontSize: 20 },
                      dataSavedIdenDet ? { color: '#2b8ada' } : { color: 'gray' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Identification Body */}
            {showIdenDet ? (
              <View>
                <View style={styles.whiteBodyView}>
                  {IdentificationDocs.length > 0 ? (
                    <View>
                      {/* Heading */}
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
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>Name</Text>
                          </View>
                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>ID No.</Text>
                          </View>

                          <View
                            style={{
                              flex: 1,
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
                      <ViewIdentifications />
                    </View>
                  ) : null}

                  {IdentificationDocs.length === 0 || addMoreIdenDet ? (
                    <View style={{ marginBottom: 10 }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '95%',
                          alignSelf: 'center',
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text style={styles.inputLabel}>Document Name</Text>

                            <SelectList
                              placeholder={identificationType}
                              boxStyles={{
                                backgroundColor: '#e8f0fe',
                                borderWidth: 0,
                              }}
                              dropdownTextStyles={{
                                color: '#2b8ada',
                                fontWeight: 'bold',
                              }}
                              setSelected={setidentificationType}
                              data={dataIdenDocs}
                            />
                          </View>
                          <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text style={styles.inputLabel}>Identification No</Text>
                            <View>
                              <TextInput
                                style={[styles.textInput]}
                                onChangeText={(text) => setidentificationNumber(text)}
                                value={identificationNumber}
                                maxLength={20}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginVertical: 5,
                          width: '95%',
                          alignSelf: 'center',
                          marginBottom: 15,
                        }}
                      >
                        <CustomButton
                          text={identificationPath == null ? 'Select File' : ' ✓ File Selected'}
                          textstyle={{
                            color: identificationPath == null ? '#2b8ada' : '#21c47f',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 6,
                            paddingHorizontal: 10,
                            borderWidth: 2,
                            borderColor: identificationPath == null ? '#2b8ada' : '#21c47f',
                          }}
                          onPress={() => {
                            if (identificationType === '')
                              Alert.alert('Incomplete Details!', 'Please select document name');
                            else if (identificationNumber === '')
                              Alert.alert(
                                'Incomplete Details!',
                                'Please fill identification number'
                              );
                            // TODO: Uncomment below
                            // else selectDocsIden();
                          }}
                        />
                        <CustomButton
                          text="Add To List"
                          textstyle={{ color: 'white', fontSize: 12 }}
                          style={{
                            backgroundColor: '#2b8ada',
                            borderRadius: 5,
                            padding: 6,
                            paddingHorizontal: 10,
                            position: 'absolute',
                            right: 0,
                          }}
                          onPress={() => {
                            if (
                              identificationNumber !== '' &&
                              identificationType !== '' &&
                              identificationPath !== null
                            ) {
                              let flag = 1;
                              if (IdentificationDocs.length > 0) {
                                for (let i = 0; i < IdentificationDocs.length; i += 1) {
                                  if (
                                    IdentificationDocs[i].identificationType === identificationType
                                  ) {
                                    flag = 0;
                                    break;
                                  }
                                }
                                if (flag === 0) {
                                  Alert.alert(
                                    'Duplicate Identification Found',
                                    'This identification type has already been saved'
                                  );
                                  setidentificationNumber('');
                                  setidentificationType('');
                                }
                                // else
                                // uploadIdenDoc();
                              }

                              if (flag === 1) {
                                const p = {
                                  identificationNumber,

                                  identificationType,
                                  identificationPath,
                                };
                                // IdentificationDocs.push(p);
                                const arr = [...IdentificationDocs];
                                arr.push(p);
                                // console.log(arr);
                                setIdentificationDocs(arr);
                                setidentificationNumber('');
                                setidentificationType('');
                                setidentificationPath(null);
                                dataIdenDocs = dataIdenDocs.filter(
                                  (item) => item.key !== identificationType
                                );
                                // console.log(IdentificationDocs);
                                setaddMoreIdenDet(false);
                              }
                            } else if (identificationNumber === '')
                              Alert.alert(
                                'Incomplete Details!',
                                'Please fill Identification Number'
                              );
                            else if (identificationType === '')
                              Alert.alert('Incomplete Details!', 'Please Select Document Name');
                            else if (identificationPath == null)
                              Alert.alert(
                                'Incomplete Details!',
                                'Please Select Document before saving'
                              );
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: 9,
                          marginTop: 2,
                          marginLeft: 10,
                          color: 'red',
                        }}
                      >
                        Note:-{'\n'} Upload document in pdf format of max size 2MB.
                      </Text>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <CustomButton
                        text="+ Add More"
                        textstyle={{ color: '#2b8ada', fontSize: 10 }}
                        style={{
                          alignSelf: 'flex-end',
                          width: 80,
                          borderColor: '#2b8ada',
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 3,
                          paddingHorizontal: 10,
                          marginTop: 10,
                        }}
                        onPress={() => setaddMoreIdenDet(true)}
                      />
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      marginTop: 15,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: '95%',
                    }}
                  >
                    {IdentificationDocs.length > 0 ? (
                      <CustomButton
                        text="Save"
                        textstyle={{ color: 'white', fontSize: 12 }}
                        style={{
                          // marginRight: '5%',
                          // flex: 0.5,
                          flex: 1,
                          backgroundColor: '#2b8ada',
                          padding: 5,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          if (IdentificationDocs.length === 0)
                            Alert.alert(
                              'Incomplete Details!',
                              'Please Fill Identification details before uploading '
                            );
                          else postIdenDet();
                        }}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}

            {/* Clinic Information Label */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={[
                  styles.whiteLabelView,
                  showAddInfo
                    ? {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginBottom: 0,
                      }
                    : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    { flexDirection: 'row', width: '100%' },
                    showAddInfo ? { borderBottomWidth: 0.5, borderBottomColor: '#707070' } : null,
                  ]}
                  onPress={() => {
                    if (dataSavedAddInfo) setShowAddInfo(false);
                    else setShowAddInfo(!showAddInfo);
                  }}
                >
                  <FAIcon
                    name="clinic-medical"
                    size={15}
                    color={dataSavedAddInfo ? '#2b8ada' : 'gray'}
                    style={{ marginHorizontal: 5, alignSelf: 'center' }}
                  />
                  <Text
                    style={[
                      styles.label,
                      { width: '85%' },
                      dataSavedAddInfo ? { color: '#2B8ADA' } : null,
                    ]}
                  >
                    Clinic Information
                  </Text>
                  <FAIcon
                    name={
                      // eslint-disable-next-line no-nested-ternary
                      showAddInfo
                        ? 'chevron-down'
                        : dataSavedAddInfo
                        ? 'check-circle'
                        : 'chevron-right'
                    }
                    // color={dataSavedAddInfo ? '#2B8ADA' : 'gray'}
                    style={[
                      styles.label,
                      { width: '10%', fontSize: 20 },
                      dataSavedAddInfo ? { color: '#2b8ada' } : { color: 'gray' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Clinic Information Body */}
            {showAddInfo ? (
              <View>
                <View style={styles.whiteBodyView}>
                  <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                    {ClinicDet.length > 0 ? (
                      <View>
                        {/* Heading */}
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
                            <View style={styles.cellHeading}>
                              <Text style={styles.cellHeadingText}>Name</Text>
                            </View>
                            <View style={styles.cellHeading}>
                              <Text style={styles.cellHeadingText}>Address</Text>
                            </View>
                            <View style={styles.cellHeading}>
                              <Text style={styles.cellHeadingText}>Instructions</Text>
                            </View>
                            <View
                              style={{
                                flex: 1,
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
                        <ViewClinics />
                      </View>
                    ) : null}

                    {/* Add Clinic */}
                    {ClinicDet.length === 0 || addMoreAddInfo ? (
                      <View style={{ width: '95%', alignSelf: 'center' }}>
                        {/* Clinic Name */}
                        <View style={{ flexDirection: 'column' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.inputLabel}>Clinic Name</Text>
                            <Text style={[styles.inputLabel, { color: 'red' }]}>*</Text>
                          </View>
                          <TextInput
                            style={styles.textInput}
                            value={clinicName}
                            maxLength={50}
                            onChangeText={(text) => setClinicName(text)}
                          />
                        </View>

                        {/* Clinic Address */}
                        <View style={{ flexDirection: 'column' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.inputLabel}>Clinic Address</Text>
                            <Text style={[styles.inputLabel, { color: 'red' }]}>*</Text>
                          </View>
                          <TextInput
                            style={styles.textInput}
                            value={clinicAddress}
                            maxLength={50}
                            onChangeText={(text) => setClinicAddress(text)}
                          />
                        </View>

                        {/* Clinic Photo */}
                        <View style={{ flexDirection: 'column' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.inputLabel}>Clinic Proof</Text>
                            <Text style={[styles.inputLabel, { color: 'red' }]}>*</Text>
                          </View>

                          <TouchableOpacity
                            style={[
                              {
                                backgroundColor: '#e8f0fe',
                                padding: 10,
                                justifyContent: 'center',
                                borderRadius: 10,
                                flexDirection: 'row',
                              },
                              clinicPhoto != null
                                ? {
                                    backgroundColor: 'white',
                                    borderColor: '#21c47f',
                                    borderWidth: 1,
                                  }
                                : null,
                            ]}
                            onPress={async () => {
                              if (clinicName !== '') await choosePhoto('Clinic');
                              else
                                Alert.alert(
                                  'Incomplete Details!',
                                  'Please enter clinic name before uploading picture'
                                );
                            }}
                          >
                            {clinicPhoto == null ? (
                              <FAIcon
                                name="camera"
                                color="gray"
                                size={15}
                                style={{ marginRight: 5, alignSelf: 'center' }}
                              />
                            ) : null}
                            <Text
                              style={[
                                { alignSelf: 'center', fontSize: 12 },
                                clinicPhoto != null ? { color: '#21c47f' } : null,
                              ]}
                            >
                              {clinicPhoto == null ? 'Upload Photo' : '✓ File Selected'}
                            </Text>
                          </TouchableOpacity>
                          <Text
                            style={[
                              {
                                fontSize: 9,
                                color: 'red',
                                marginVertical: 5,
                              },
                            ]}
                          >
                            Note:-{'\n'} 1. Upload image ( .jpg, .jpeg, .png ) of max size 2MB.
                            {'\n'} 2. Image may include (Electricity Bill / Clinic Image / Water
                            Bill / Telephone Bill).
                          </Text>
                        </View>
                        {/* Special Instruction */}
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={styles.inputLabel}>Special Instruction</Text>
                          <TextInput
                            style={styles.textInput}
                            multiline
                            maxLength={50}
                            value={specialInstruction}
                            onChangeText={(text) => setSpecialInstruction(text)}
                          />
                        </View>

                        <CustomButton
                          text="Add To List"
                          textstyle={{ color: 'white', fontSize: 12 }}
                          style={{
                            backgroundColor: '#2b8ada',
                            alignSelf: 'flex-end',
                            borderRadius: 5,
                            padding: 6,
                            paddingHorizontal: 10,
                            margin: 5,
                          }}
                          onPress={() => {
                            if (clinicAddress === '')
                              Alert.alert(
                                'Incomplete Details!',
                                'Please fill Clinic Address before saving'
                              );
                            else if (clinicName === '')
                              Alert.alert(
                                'Incomplete Details!',
                                'Please fill Clinic Name before saving'
                              );
                            else if (clinicPhoto == null)
                              Alert.alert(
                                'Incomplete Details!',
                                'Please add Clinic Photo before saving'
                              );
                            else if (!checkAlphabetOnly(clinicName)) {
                              Alert.alert('Inavlid Input', 'Enter letters only in Clinic Name.');
                              setClinicName('');
                            } else if (
                              specialInstruction !== '' &&
                              !checkAlphanumicOnly(specialInstruction)
                            ) {
                              Alert.alert(
                                'Inavlid Input',
                                'Enter letters and digits only in Special Instructions.'
                              );
                              setSpecialInstruction('');
                            } else {
                              const p = [
                                {
                                  clinicName,
                                  clinicAddress,
                                  specialInstruction,
                                  clinicPhoto,
                                },
                              ];
                              if (
                                ClinicDet.findIndex(
                                  (v) =>
                                    v.clinicName === p[0].clinicName &&
                                    v.clinicAddress === p[0].clinicAddress
                                ) === -1
                              ) {
                                let newArr = [...ClinicDet, ...p];
                                newArr = newArr.map((v, i) => ({
                                  clinicSl: i + 1,
                                  clinicName: v.clinicName,
                                  clinicAddress: v.clinicAddress,
                                  specialInstruction: v.specialInstruction,
                                  clinicPhoto: v.clinicPhoto,
                                }));
                                // console.log("newArr--------");
                                // console.log(newArr);
                                setClinicDet(newArr);
                                setClinicAddress('');
                                setClinicName('');
                                setSpecialInstruction('');
                                setClinicPhoto(null);
                                setaddMoreAddInfo(false);
                                // console.log("ClinicDet--------");
                                // console.log(ClinicDet);
                              } else {
                                Alert.alert(
                                  'Duplicate Clinic Details',
                                  'This Clinic has already been saved.'
                                );
                              }
                            }
                          }}
                        />
                      </View>
                    ) : (
                      <View style={{ flex: 1 }}>
                        <CustomButton
                          text="+ Add More"
                          textstyle={{ color: '#2b8ada', fontSize: 10 }}
                          style={{
                            alignSelf: 'flex-end',
                            width: 80,
                            borderColor: '#2b8ada',
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 3,
                            paddingHorizontal: 10,
                            marginTop: 10,
                          }}
                          onPress={() => setaddMoreAddInfo(true)}
                        />
                      </View>
                    )}
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        marginTop: 15,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        width: '95%',
                      }}
                    >
                      {ClinicDet.length > 0 ? (
                        <CustomButton
                          text="Save"
                          textstyle={{ color: 'white', fontSize: 12 }}
                          style={{
                            // marginRight: '5%',
                            // flex: 0.5,
                            flex: 1,
                            backgroundColor: '#2b8ada',
                            padding: 5,
                            borderRadius: 10,
                          }}
                          onPress={() => {
                            if (ClinicDet.length === 0)
                              Alert.alert(
                                'Incomplete Details!',
                                'Please Fill Clinic details before continuing '
                              );
                            else postClinicDet();
                          }}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Preconsultation Questionnaire Label */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={[
                  styles.whiteLabelView,
                  showPreConsultationQuestionaire
                    ? {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginBottom: 0,
                      }
                    : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    { flexDirection: 'row', width: '100%' },
                    showPreConsultationQuestionaire
                      ? {
                          borderBottomWidth: 0.5,
                          borderBottomColor: '#707070',
                        }
                      : null,
                  ]}
                  onPress={() => {
                    if (dataSavedPreConsultationQuestionaire)
                      setShowPreConsultationQuestionaire(false);
                    else setShowPreConsultationQuestionaire(!showPreConsultationQuestionaire);
                  }}
                >
                  <FAIcon
                    name="comment-medical"
                    size={15}
                    color={dataSavedPreConsultationQuestionaire ? '#2b8ada' : 'gray'}
                    style={{ marginHorizontal: 5, alignSelf: 'center' }}
                  />
                  <Text
                    style={[
                      styles.label,
                      { width: '85%' },
                      dataSavedPreConsultationQuestionaire ? { color: '#2B8ADA' } : null,
                    ]}
                  >
                    Pre-Consultation Questions
                  </Text>
                  <FAIcon
                    name={
                      // eslint-disable-next-line no-nested-ternary
                      showPreConsultationQuestionaire
                        ? 'chevron-down'
                        : dataSavedPreConsultationQuestionaire
                        ? 'check-circle'
                        : 'chevron-right'
                    }
                    // color={dataSavedPreConsultationQuestionaire ? '#2B8ADA' : 'gray'}
                    style={[
                      styles.label,
                      { width: '10%', fontSize: 20 },
                      dataSavedPreConsultationQuestionaire
                        ? { color: '#2b8ada' }
                        : { color: 'gray' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Preconsultation Questionnaire Body */}
            {showPreConsultationQuestionaire ? (
              <View>
                <View style={styles.whiteBodyView}>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        width: '95%',
                        alignSelf: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text style={[styles.inputLabel, { marginTop: 0 }]}>
                        Set Pre-Consultation Questions
                      </Text>
                      <SelectList
                        placeholder={showQuestions ? 'Yes' : 'No'}
                        boxStyles={{
                          backgroundColor: '#e8f0fe',
                          borderWidth: 0,
                        }}
                        dropdownTextStyles={{
                          color: '#2b8ada',
                          fontWeight: 'bold',
                        }}
                        setSelected={(val) => setShowQuestions(val === 'Yes')}
                        onSelect={() => {
                          if (showQuestions === 'No') setQuestionareList('');
                        }}
                        data={dataShowQues}
                      />
                    </View>

                    {showQuestions ? (
                      <View
                        style={{
                          width: '95%',
                          alignSelf: 'center',
                          marginBottom: 10,
                        }}
                      >
                        {questionareList.length > 0 ? (
                          <View style={{ marginBottom: 5 }}>
                            {/* Heading */}
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
                                <View style={[styles.cellHeading, { flex: 0.3 }]}>
                                  <Text style={styles.cellHeadingText}>S.No.</Text>
                                </View>

                                <View style={styles.cellHeading}>
                                  <Text style={styles.cellHeadingText}>Question</Text>
                                </View>

                                <View
                                  style={{
                                    flex: 0.4,
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
                            <RenderQuestion />
                          </View>
                        ) : null}

                        {questionareList.length === 0 || addMorePreConsultationQuestionaire ? (
                          <View>
                            <View
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                marginBottom: 5,
                              }}
                            >
                              <Text
                                style={[styles.inputLabel, { marginBottom: 5, color: 'black' }]}
                              >
                                Question
                              </Text>

                              <View
                                style={{
                                  height: 80,
                                  textAlignVertical: 'top',
                                  width: '100%',
                                  borderWidth: 1,
                                  borderColor: 'gray',
                                  borderRadius: 5,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <TextInput
                                  returnKeyType="done"
                                  placeholder="Write your Question Here..."
                                  style={{
                                    textAlign: 'left',
                                    alignSelf: 'center',
                                    width: '90%',
                                    fontSize: 11,
                                    height: 60,
                                  }}
                                  maxLength={50}
                                  value={consultationQuestion}
                                  onChangeText={(text) => setConsultationQuestion(text)}
                                  onSubmitEditing={() => {
                                    if (consultationQuestion === '')
                                      Alert.alert(
                                        'Incomplete Details!',
                                        'Please fill question before saving.'
                                      );
                                    else if (
                                      consultationQuestion !== '' &&
                                      questionareList.length < 10
                                    ) {
                                      const p = {
                                        questions: consultationQuestion,
                                        // specialization: questionSpl,
                                      };
                                      const arr = [...questionareList];
                                      arr.push(p);
                                      setQuestionareList(arr);
                                    } else if (questionareList.length === 10)
                                      Alert.alert(
                                        'Warning',
                                        'You can only add max of 10 questions'
                                      );
                                    setConsultationQuestion('');
                                  }}
                                />
                              </View>
                            </View>
                            <Text style={{ fontSize: 10, color: '#2b8ada' }}>
                              {' Note:- Max limit is 50 characters. '}
                              {50 - consultationQuestion.length} characters left
                            </Text>
                          </View>
                        ) : (
                          <View style={{ flex: 1 }}>
                            <CustomButton
                              text="+ Add More"
                              textstyle={{ color: '#2b8ada', fontSize: 10 }}
                              style={{
                                alignSelf: 'flex-end',
                                width: 80,
                                borderColor: '#2b8ada',
                                borderWidth: 1,
                                borderRadius: 5,
                                padding: 3,
                                paddingHorizontal: 10,
                                marginTop: 10,
                              }}
                              onPress={() => setaddMorePreConsultationQuestionaire(true)}
                            />
                          </View>
                        )}
                      </View>
                    ) : null}

                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        marginTop: 10,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        width: '95%',
                      }}
                    >
                      <CustomButton
                        text="Save"
                        textstyle={{ color: 'white', fontSize: 12 }}
                        style={{
                          // marginRight: '5%',
                          // flex: 0.5,
                          flex: 1,
                          backgroundColor: '#2b8ada',
                          padding: 5,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          if (questionareList.length === 0 && showQuestions)
                            Alert.alert(
                              'Incomplete Details!',
                              'Please add question(s) before uploading'
                            );
                          else if (showQuestions === false) {
                            setShowPreConsultationQuestionaire(false);

                            setdataSavedPreConsultationQuestionaire(true);
                          } else {
                            postPreConsultQues();
                          }
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Consultation Fees Label */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={[
                  styles.whiteLabelView,
                  showConsultFees
                    ? {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginBottom: 0,
                      }
                    : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    { flexDirection: 'row', width: '100%' },
                    showConsultFees
                      ? {
                          borderBottomWidth: 0.5,
                          borderBottomColor: '#707070',
                        }
                      : null,
                  ]}
                  onPress={() => {
                    if (dataSavedConsultFees) setShowConsultFees(false);
                    else setShowConsultFees(!showConsultFees);
                  }}
                >
                  <FAIcon
                    name="money-check"
                    size={15}
                    color={dataSavedConsultFees ? '#2b8ada' : 'gray'}
                    style={{ marginHorizontal: 5, alignSelf: 'center' }}
                  />
                  <Text
                    style={[
                      styles.label,
                      { width: '85%' },
                      dataSavedConsultFees ? { color: '#2B8ADA' } : null,
                    ]}
                  >
                    Consultation Fees
                  </Text>
                  <FAIcon
                    name={
                      // eslint-disable-next-line no-nested-ternary
                      showConsultFees
                        ? 'chevron-down'
                        : dataSavedConsultFees
                        ? 'check-circle'
                        : 'chevron-right'
                    }
                    // color={dataSavedConsultFees ? '#2B8ADA' : 'gray'}
                    style={[
                      styles.label,
                      { width: '10%', fontSize: 20 },
                      dataSavedConsultFees ? { color: '#2b8ada' } : { color: 'gray' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Consultation Fees Body */}
            {showConsultFees ? (
              <View style={[styles.whiteBodyView]}>
                <View
                  style={{
                    width: '95%',
                    alignSelf: 'center',
                    flexDirection: 'column',
                    marginBottom: 10,
                  }}
                >
                  {/* Physical Consulation Fees */}
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.inputLabel}>Physical Consultation Fees </Text>
                        <Text style={[styles.inputLabel, { color: 'red' }]}>( in ₹ )</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput]}
                        maxLength={5}
                        keyboardType="number-pad"
                        onChangeText={(text) => setphysicalConsulationFees(text)}
                        value={physicalConsulationFees.toString()}
                      />
                    </View>
                  </View>
                  {/* Physical Follow-Up Fees */}
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.inputLabel}>Physical Follow-Up Fees </Text>
                        <Text style={[styles.inputLabel, { color: 'red' }]}>( in ₹ )</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput]}
                        keyboardType="number-pad"
                        maxLength={5}
                        onChangeText={(text) => setphysicalfollowUpFees(text)}
                        value={physicalfollowUpFees.toString()}
                      />
                    </View>
                  </View>
                  {/* E-Consultation Fees */}
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.inputLabel}>E-Consultation Fees </Text>
                        <Text style={[styles.inputLabel, { color: 'red' }]}>( in ₹ )</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput]}
                        maxLength={5}
                        keyboardType="number-pad"
                        onChangeText={(text) => seteConsulationFees(text)}
                        value={eConsulationFees.toString()}
                      />
                    </View>
                  </View>

                  {/* E-Consultation Follow-Up Fees */}
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.inputLabel}>E-Consultation Follow-Up Fees </Text>
                        <Text style={[styles.inputLabel, { color: 'red' }]}>( in ₹ )</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput]}
                        keyboardType="number-pad"
                        maxLength={5}
                        onChangeText={(text) => setefollowUpFees(text)}
                        value={efollowUpFees.toString()}
                      />
                    </View>
                  </View>

                  {/* Duration of Follow-Up */}
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <Text style={[styles.inputLabel, { marginBottom: 7 }]}>
                        Duration of Follow-Up ( in days )
                      </Text>

                      <TextInput
                        style={[styles.textInput]}
                        keyboardType="number-pad"
                        maxLength={2}
                        onChangeText={(text) => setshowFollowUp(text)}
                        value={showFollowUp}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      {
                        flexDirection: 'row-reverse',
                        marginTop: 15,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      },
                    ]}
                  >
                    <CustomButton
                      text="Save"
                      textstyle={{ color: 'white', fontSize: 12 }}
                      style={{
                        // marginRight: '5%',
                        flex: 1,
                        backgroundColor: '#2b8ada',
                        padding: 5,
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        if (physicalConsulationFees === '')
                          Alert.alert(
                            'Incomplete Details!',
                            'Please fill p-consultation fees before saving'
                          );
                        else if (eConsulationFees === '')
                          Alert.alert(
                            'Incomplete Details!',
                            'Please fill e-consultation fees before saving'
                          );
                        else if (physicalfollowUpFees === '')
                          Alert.alert(
                            'Incomplete Details!',
                            'Please fill physical follow-up fees before saving'
                          );
                        else if (efollowUpFees === '')
                          Alert.alert(
                            'Incomplete Details!',
                            'Please fill e-consultation follow-up fees before saving'
                          );
                        else if (showFollowUp === '')
                          Alert.alert(
                            'Incomplete Details!',
                            'Please add follow-up duration before uploading'
                          );
                        else {
                          postConsultFees();
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            ) : null}

            <CustomButton
              text="Logout"
              textstyle={{
                color: '#2b8ada',
                fontSize: 15,
                fontWeight: 'bold',
              }}
              style={{
                borderColor: '#2b8ada',
                borderWidth: 1,
                flex: 0.45,
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                marginBottom: 100,
              }}
              onPress={async () => {
                await AsyncStorage.multiRemove(await AsyncStorage.getAllKeys());
                navigation.navigate('LoginScreen');
              }}
            />
          </View>
        </ScrollView>

        {docsModal ? (
          <Modal
            animationType="slide"
            transparent
            visible={docsModal}
            onRequestClose={() => {
              setdocsModal(!docsModal);
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
                  },
                ]}
              >
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      padding: 5,
                      color: 'black',
                    }}
                  >
                    Document Viewer
                  </Text>
                  <FAIcon
                    name="window-close"
                    color="black"
                    size={26}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    }}
                    onPress={() => {
                      setdocsModal(false);
                      setdocPath(null);
                      setZoom(1);
                    }}
                  />
                </View>
                <View style={{ minHeight: 150, width: '100%' }}>
                  <View
                    style={{
                      padding: 10,
                      width: '100%',
                      alignSelf: 'center',
                      borderRadius: 7,
                      marginVertical: 10,
                      borderWidth: 2,
                      borderColor: 'gray',
                    }}
                  >
                    {/* TODO: Uncomment below */}
                    {/* <Pdf
                      source={{
                        uri: docPath,
                      }}
                      style={{
                        width: '100%',
                        height: 275,
                        alignSelf: 'center',
                      }}
                      // onLoadComplete={() => console.log('fully loaded')}
                      scale={zoom}
                    /> */}
                  </View>
                  <View style={{ alignSelf: 'center', flexDirection: 'column' }}>
                    {/* Zoom Controls */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'space-evenly',
                        width: '95%',
                      }}
                    >
                      <TouchableOpacity>
                        <FAIcon name="minus-circle" size={20} color="gray" onPress={onZoomOut} />
                      </TouchableOpacity>
                      <Text>
                        {zoom * 100}
                        {' %'}
                      </Text>
                      <TouchableOpacity>
                        <FAIcon name="plus-circle" size={20} color="gray" onPress={onZoomIn} />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 'bold',
                          color: 'black',
                          marginRight: 3,
                        }}
                      >
                        File Name:-
                      </Text>
                      {docPath != null ? (
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'black',
                          }}
                        >
                          {docPath.split('/').pop()}
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={{
                        width: '85%',
                        alignSelf: 'center',
                        marginTop: 5,
                      }}
                    />
                    <CustomButton
                      textstyle={{ color: 'white', fontSize: 12 }}
                      text="Download"
                      style={{
                        backgroundColor: 'limegreen',
                        borderRadius: 10,
                      }}
                      onPress={async () => {
                        const fileName = docPath.split('/').pop();
                        // console.log(fileName);
                        // TODO: Uncomment below
                        /* await RNFS.copyFile(
                          docPath,
                          `file://${RNFS.DownloadDirectoryPath}/${fileName}`
                        ); */
                        Alert.alert(
                          'Downloaded',
                          `Document has been downloaded under the name of:- ${fileName}`
                        );
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        ) : null}

        {ImageViewer ? (
          <Modal
            animationType="slide"
            transparent
            visible={ImageViewer}
            onRequestClose={() => {
              setImageViewer(!ImageViewer);
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
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      padding: 5,
                      color: 'black',
                    }}
                  >
                    Image Viewer
                  </Text>
                  <FAIcon
                    name="window-close"
                    color="black"
                    size={26}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    }}
                    onPress={() => {
                      setImageViewer(false);
                      setDisplayPhotoToken(0);
                      setZoom(1);
                    }}
                  />
                </View>
                <View style={{ minHeight: 150, width: '100%' }}>
                  <ScrollView
                    style={{
                      padding: 10,
                      width: '100%',
                      alignSelf: 'center',
                      borderRadius: 7,
                      marginVertical: 10,
                      borderWidth: 2,
                      borderColor: 'gray',
                      minHeight: 200,
                    }}
                    scrollEnabled
                  >
                    {DisplayPhotoToken === 0 ? (
                      <Image
                        source={waiting}
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: `${apiConfig.baseUrl}/file/download?fileToken=${DisplayPhotoToken}&userId=${doctorId}`,
                        }}
                        style={{
                          resizeMode: 'cover',
                          width: '100%',
                          height: 180,
                        }}
                      />
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>
          </Modal>
        ) : null}

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
                Please Wait...
              </Text>
            </View>
          </View>
        )}
        {isSentForValidation && (
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
                width: 200,
                height: 200,
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Image
                source={uploading}
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
                  fontSize: 18,
                  fontWeight: 'bold',
                  width: '100%',
                  marginVertical: 5,
                  // padding: 10,
                }}
              >
                {'Please wait '}
              </Text>
              <Text
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 12,
                  width: '100%',
                  paddingHorizontal: 15,
                }}
              >
                {'We are processing your profile for verification '}
              </Text>
            </View>
          </View>
        )}

        {isUploading && (
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
                width: 200,
                height: 200,
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Image
                source={uploadgif}
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
                  fontSize: 18,
                  fontWeight: 'bold',
                  width: '100%',
                  marginVertical: 5,
                  // padding: 10,
                }}
              >
                {'Uploading '}
              </Text>
              <Text
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 12,
                  width: '100%',
                  paddingHorizontal: 15,
                }}
              >
                We are uploading your details
              </Text>
            </View>
          </View>
        )}

        {questionare ? (
          <Modal
            animationType="slide"
            transparent
            visible={questionare}
            onRequestClose={() => {
              setQuestionare(!questionare);
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
                      fontSize: 14,
                      padding: 5,
                      color: 'black',
                    }}
                  >
                    Add Questions
                  </Text>
                  <FAIcon
                    name="window-close"
                    color="black"
                    size={26}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    }}
                    onPress={() => setQuestionare(false)}
                  />
                </View>
                <View
                  style={{
                    width: '95%',
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}
                >
                  {questionareList.length > 0 ? (
                    <View style={{ marginBottom: 5 }}>
                      {/* Heading */}
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
                          <View style={[styles.cellHeading, { flex: 0.3 }]}>
                            <Text style={styles.cellHeadingText}>S.No.</Text>
                          </View>

                          <View style={styles.cellHeading}>
                            <Text style={styles.cellHeadingText}>Question</Text>
                          </View>

                          <View
                            style={{
                              flex: 0.4,
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
                      <RenderQuestion />
                    </View>
                  ) : null}

                  {questionareList.length === 0 || addMorePreConsultationQuestionaire ? (
                    <View>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          marginBottom: 5,
                        }}
                      >
                        <Text style={[styles.inputLabel, { marginBottom: 5, color: 'black' }]}>
                          Question
                        </Text>

                        <View
                          style={{
                            height: 80,
                            textAlignVertical: 'top',
                            width: '100%',
                            borderWidth: 1,
                            borderColor: 'gray',
                            borderRadius: 5,
                            alignSelf: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <TextInput
                            placeholder="Write your Question Here..."
                            style={{
                              textAlign: 'left',
                              alignSelf: 'center',
                              width: '90%',
                              fontSize: 11,
                              height: 60,
                            }}
                            maxLength={50}
                            value={consultationQuestion}
                            onChangeText={(text) => setConsultationQuestion(text)}
                          />
                        </View>
                      </View>
                      <Text style={{ fontSize: 10, color: '#2b8ada' }}>
                        {' Note:- Max limit is 50 characters. '}
                        {50 - consultationQuestion.length} characters left
                      </Text>
                      <CustomButton
                        text="Save"
                        textstyle={{ color: '#2B8ADA', fontSize: 10 }}
                        style={{
                          borderColor: '#2B8ADA',
                          borderWidth: 1,
                          alignSelf: 'flex-end',
                          marginVertical: 5,
                          padding: 5,
                          paddingHorizontal: 10,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          if (consultationQuestion === '')
                            Alert.alert(
                              'Incomplete Details!',
                              'Please fill question before saving.'
                            );
                          else if (consultationQuestion !== '' && questionareList.length < 4) {
                            const p = {
                              questions: consultationQuestion,
                              // specialization: questionSpl,
                            };
                            const arr = [...questionareList];
                            arr.push(p);
                            setQuestionareList(arr);
                          } else if (questionareList.length === 4)
                            Alert.alert('Warning', 'You can only add max of 5 questions');
                          setConsultationQuestion('');
                        }}
                      />
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <CustomButton
                        text="+ Add More"
                        textstyle={{ color: '#2b8ada', fontSize: 10 }}
                        style={{
                          alignSelf: 'flex-end',
                          width: 80,
                          borderColor: '#2b8ada',
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 3,
                          paddingHorizontal: 10,
                          marginTop: 10,
                        }}
                        onPress={() => setaddMorePreConsultationQuestionaire(true)}
                      />
                    </View>
                  )}
                </View>

                <CustomButton
                  text="Done"
                  textstyle={{ color: 'white' }}
                  style={{
                    width: '95%',
                    backgroundColor: '#2B8ADA',
                    marginVertical: 5,
                    paddingVertical: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => setQuestionare(false)}
                />
              </View>
            </View>
          </Modal>
        ) : null}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#2B8ADA',
  },
  textInput: {
    // flex: 0.45,
    padding: 5,
    color: 'black',
    backgroundColor: '#E8F0FE',
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 5,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: 'bold',
    marginTop: 10,
  },
  label: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    color: 'gray',
  },
  picker: {
    width: '90%',
    fontSize: 12,
    backgroundColor: '#E8F0FE',
  },
  heading: {
    color: '#2b8ada',
    fontWeight: 'bold',
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
  bubble: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E8F0FE',
    padding: 5,
    borderRadius: 15,
    marginVertical: 5,
    width: '100%',
  },

  bubbleHeading: {
    color: 'black',
    padding: 5,
    width: '90%',
    fontSize: 12,
  },
  whiteLabelView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    padding: 5,
  },
  whiteBodyView: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
  },
  bubbleTitle: {
    color: 'black',
    padding: 5,
    width: '90%',
    textAlign: 'center',
  },
  bubbleActive: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#2b8ada',
    padding: 5,
    borderRadius: 15,
    marginVertical: 5,
    width: '100%',
  },
  bubbleTitleActive: {
    color: '#fff',
    padding: 5,
    width: '90%',
    textAlign: 'center',
  },
  slotBackground: {
    alignSelf: 'center',
    backgroundColor: '#E8F0FE',
    borderWidth: 1,
    borderColor: '#2b8ada',
    padding: 2,
    borderRadius: 10,
    margin: 2,
    width: 100,
  },
  slotTitle: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
    width: 100,
  },
  slotBackgroundActive: {
    alignSelf: 'center',
    backgroundColor: '#2b8ada',
    borderWidth: 1,
    borderColor: '#2b8ada',
    padding: 2,
    borderRadius: 10,
    margin: 2,
    width: 100,
  },
  slotTitleActive: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    width: 100,
  },
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
});
