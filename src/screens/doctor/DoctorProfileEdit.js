/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
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
import Pdf from 'react-native-pdf';
import { Checkbox } from 'native-base';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { isEmpty } from 'lodash';
// icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import doctor from '../../../assets/doctor.png';
import doctorFemale from '../../../assets/doctor_female.png';
import downloading from '../../../assets/animations/downloading.gif';
import upload from '../../../assets/animations/upload.gif';
import waiting from '../../../assets/animations/waiting1.gif';
import apiConfig, { fileUpload } from '../../components/API/apiConfig';

import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';

const dataIdenDocs = [
  { key: 'Aadhar', value: 'Aadhar' },
  { key: 'Driving License', value: 'Driving License' },
  { key: 'PAN', value: 'PAN' },
  { key: 'Passport No.', value: 'Passport No.' },
];

const dataTitle = [{ key: 'Dr.', value: 'Dr.' }];

const dataYear = [];

export default function DoctorProfileEdit() {
  // General Information Field
  const [doctorObj, setdoctorObj] = useState(null);
  const [doctorId, setdoctorId] = useState(0);
  const [showGenInfo, setShowGenInfo] = useState(false);
  const [GenInfoEdit, setGenInfoEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setdob] = useState('');
  const [pfpuri, setpfpuri] = useState(null);
  const [profilePhotoPath, setprofilePhotoPath] = useState(null);

  // Calendar View
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartExpDatePickerVisible, setStartExpDatePickerVisible] = useState(false);
  const [isEndExpDatePickerVisible, setEndExpDatePickerVisible] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Medical Registration Feild
  const [showMedReg, setShowMedReg] = useState(false);
  const [MedInfoEdit, setMedInfoEdit] = useState(false);
  const [doctorMedicalRegistration, setDoctorMedicalRegistration] = useState(null);
  const [RegNo, setRegNo] = useState('');
  const [RegCouncil, setRegCouncil] = useState('');
  const [RegYear, setRegYear] = useState('');
  const [certificatePath, setcertificatePath] = useState(null);
  const [newcertificatePath, setnewcertificatePath] = useState(null);
  const [MedRegDoc, setMedRegDoc] = React.useState(null);

  // Educational Details Field
  const [showEduDet, setShowEduDet] = useState(false);
  const [EduElementModal, setEduElementModal] = useState(false);
  const [editEduDet, seteditEduDet] = useState(false);

  const [EduDetEdit, setEduDetEdit] = useState(false);
  const [dataSpecialization, setdataSpecialization] = useState([]);
  const [Education, setEducation] = useState([]);
  const [Degree, setDegree] = useState('');
  const [DegreePassingYear, setDegreePassingYear] = useState('');
  const [degreePath, setdegreePath] = useState(null);
  const [Specialization, setSpecialization] = useState('');
  const [Otherspeciality, setOtherSpeciality] = useState('');

  const [University, setUniversity] = useState('');
  const [doctorEducationPkId, setdoctorEducationPkId] = useState(0);

  // Experience
  const [showExpDet, setShowExpDet] = useState(false);
  const [ExpDetEdit, setExpDetEdit] = useState(false);
  const [ExpElementModal, setExpElementModal] = useState(false);
  const [editExp, seteditExp] = useState(false);
  const [Experience, setExperience] = useState([]);
  const [practiceAt, setPracticeAt] = useState('');
  const [startExpDate, setStartExpDate] = useState('');
  const [endExpDate, setEndExpDate] = useState('');
  const [experienceInMonths, setExperienceInMonths] = useState('');
  const [TotalYear, setTotalYear] = useState('');
  const [TotalMonths, setTotalMonths] = useState('');
  const [experienceId, setexperienceId] = useState(0);
  const [expPhotoPath, setexpPhotoPath] = useState(0);
  const [checkPresent, setcheckPresent] = useState(false);
  // Identification
  const [showIdenDet, setShowIdenDet] = useState(false);
  const [IdenDetEdit, setIdenDetEdit] = useState(false);
  const [IdentificationDocs, setIdentificationDocs] = useState([]);
  const [identificationNumber, setidentificationNumber] = useState('');
  const [identificationType, setidentificationType] = useState('');
  const [doctorIdentificationPkId, setdoctorIdentificationPkId] = useState(0);
  const [IdenElementModal, setIdenElementModal] = useState(false);
  const [editIden, seteditIden] = useState(false);
  const [identificationPath, setidentificationPath] = useState(null);

  // General Configuration
  const [DoctorConfiguration, setDoctorConfiguration] = useState(null);
  const [showMobNo, setshowMobNo] = useState(false);

  // consultation fees
  const [showConsultFees, setShowConsultFees] = useState(false);
  const [ConsultFeesEdit, setConsultFeesEdit] = useState(false);
  const [DoctorFees, setDoctorFees] = useState(null);
  const [physicalConsulationFees, setphysicalConsulationFees] = useState(0);
  const [eConsulationFees, seteConsulationFees] = useState(0);
  const [showFollowUp, setshowFollowUp] = useState('');
  const [physicalfollowUpFees, setphysicalfollowUpFees] = useState(0);
  const [efollowUpFees, setefollowUpFees] = useState(0);
  const [doctorConsulationFeesPkId, setdoctorConsulationFeesPkId] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [isFetching, setisFetching] = useState(false);
  const [isUploading, setisUploading] = useState(false);
  // view images
  const [DisplayPhotoToken, setDisplayPhotoToken] = useState(0);
  const [ImageViewer, setImageViewer] = useState(false);
  const [clinicPhoto, setClinicPhoto] = useState();

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

  const downloadCache = async (fileToken, userId, fileName) => {
    const filePath = `file://${RNFS.CachesDirectoryPath}/`;
    const options = {
      fromUrl: `${apiConfig.baseUrl}/file/download?fileToken=${fileToken}&userId=${userId}`,
      toFile: filePath + fileName,
    };
    await RNFS.downloadFile(options)
      .promise.then((response) => {
        if (response.statusCode === 200) {
          setdocPath(filePath + fileName);
        } else Alert.alert('Download Fail', `Unable to download file. ${response.statusCode}`);
      })
      .catch((e) => {
        Alert.alert('Error', `${e}`);
      });
  };

  useEffect(() => {
    const onLoadSetData = async () => {
      setisLoading(true);
      const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
      // console.log('profile: ', x);
      setdoctorObj(x);
      setdoctorId(Number(x.doctorId));
      // console.log(doctorId);
      setTitle(
        x.doctorName === undefined
          ? x.fullName.substring(0, x.fullName.indexOf(' '))
          : x.doctorName.substring(0, x.doctorName.indexOf(' '))
      );
      setName(
        x.doctorName !== undefined
          ? x.doctorName.substring(x.doctorName.indexOf(' ') + 1)
          : x.fullName.substring(x.fullName.indexOf(' ') + 1)
      );
      setEmail(x.email);
      setGender(x.gender);
      setCity(x.city);
      setshowMobNo(x.contactVisibility);
      setdob(x.dob);
      setAge(dayjs().diff(dayjs(x.dob), 'y'));
      setPinCode(x.pincode == null ? x.pinCode : x.pincode);
      setprofilePhotoPath(x.profilePhotoPath != null ? x.profilePhotoPath : null);

      setDoctorConfiguration(x.doctorConfigurationDTO != null ? x.doctorConfigurationDTO : '');

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
            console.log('Modify\n\n', p);
            setdataSpecialization(p);
          }
        })
        .catch((error) => {
          Alert.alert('Error', `${error}`);
        });

      setisLoading(false);
    };

    onLoadSetData();
  }, []);

  // date picker functions
  const showDatePicker = () => {
    // console.log("Pressed button");

    setDatePickerVisibility(true);
  };
  // date picker functions
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  // date picker functions
  const handleConfirm = async (date) => {
    await AsyncStorage.setItem('dob', JSON.stringify(date).substring(1, 11));
    setdob(JSON.stringify(date).substring(1, 11));
    calculateAge();
    hideDatePicker();
  };

  // calculating Age
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

  const calculateExpPresent = async () => {
    const startDt = dayjs(startExpDate);
    const endDt = dayjs();
    const diffMonth = endDt.diff(startDt, 'month');
    // console.log(diffMonth);
    setExperienceInMonths(diffMonth);
    setTotalYear(Math.floor(diffMonth / 12));
    setTotalMonths(parseInt(diffMonth % 12, 10));
  };

  const setDateData = () => {
    const d = new Date().getFullYear();
    // console.log(dob.substring(0, 4));
    let i = Number(dob.substring(0, 4));
    if (i === 0) i = 1940;
    else i += 17;
    for (; i <= d; i += 1) {
      dataYear.push({ key: `${i}`, value: `${i}` });
    }
  };

  // check total month not greater than 11
  useEffect(() => {
    const monthCheck = () => {
      if (Number(TotalMonths) > 11) {
        Alert.alert('Months should be greater than equal to 0 and less than 11!');
        setTotalMonths('');
      }
    };
    if (TotalMonths.length === 2) monthCheck();
  }, [TotalMonths]);

  // Api calls onpress labels

  // get Medical Registration
  useEffect(() => {
    const getMedReg = async () => {
      setisFetching(true);
      axios
        .get(`${apiConfig.baseUrl}/doctor/medicalregistrations?doctorId=${doctorId}`)
        .then((response) => {
          setisFetching(false);
          if (response.status === 200 || response.status === 201) {
            const doctorMedicalRegistrations = response.data;
            if (doctorMedicalRegistrations != null && doctorMedicalRegistrations.length > 0) {
              setDoctorMedicalRegistration(doctorMedicalRegistrations[0]);
              setRegNo(doctorMedicalRegistrations[0].registrationNo);
              setRegCouncil(doctorMedicalRegistrations[0].registrationCouncil);
              setRegYear(doctorMedicalRegistrations[0].registrationYear);
              setcertificatePath(doctorMedicalRegistrations[0].certificatePath);
            }
          } else Alert.alert('Error', 'Could not get Details. Please try again later.');
        })
        .catch((error) => {
          setisFetching(false);
          console.log(error);
        });
    };
    if (showMedReg) getMedReg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMedReg]);

  // get Educational Qualifications
  useEffect(() => {
    const getEduDet = async () => {
      setisFetching(true);

      axios
        .get(`${apiConfig.baseUrl}/doctor/educations?doctorId=${doctorId}`)
        .then((response) => {
          setisFetching(false);

          if (response.status === 200) {
            if (response.data != null) {
              setEducation(response.data);
            }
          } else Alert.alert('Error', 'Could not get Details. Please try again later.');
        })
        .catch((error) => {
          setisFetching(false);

          console.log(error);
        });
    };
    if (showEduDet) getEduDet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEduDet]);

  // get Experience
  useEffect(() => {
    const getExpDet = async () => {
      setisFetching(true);

      axios
        .get(`${apiConfig.baseUrl}/doctor/experience?doctorId=${doctorId}`)
        .then((response) => {
          setisFetching(false);

          if (response.status === 200) {
            if (response.data != null) {
              setExperience(response.data);
            }
          } else Alert.alert('Error', 'Could not get Details. Please try again later.');
        })
        .catch((error) => {
          setisFetching(false);

          console.log(error);
        });
    };
    if (showExpDet) getExpDet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showExpDet]);

  // get Identification
  useEffect(() => {
    const getIdenDocs = async () => {
      setisFetching(true);

      axios
        .get(`${apiConfig.baseUrl}/doctor/identifications?doctorId=${doctorId}`)
        .then((response) => {
          setisFetching(false);

          if (!isEmpty(response.data)) {
            setIdentificationDocs(response.data);
            // console.log(response.data);
          }
        })
        .catch((error) => {
          setisFetching(false);

          console.log(error);
        });
    };
    if (showIdenDet) getIdenDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIdenDet]);

  // get Consultation Fees
  useEffect(() => {
    const getFeesDet = async () => {
      setisFetching(true);

      axios
        .get(`${apiConfig.baseUrl}/doctor/fees?doctorId=${doctorId}`)
        .then((response) => {
          setisFetching(false);

          if (!isEmpty(response.data)) {
            // console.log('Fees\n\n', response.data);
            setDoctorFees(response.data);

            seteConsulationFees(response.data.econsulationFees);
            setefollowUpFees(response.data.efollowUpFees);
            setshowFollowUp(response.data.followUpDuration);
            setphysicalConsulationFees(response.data.physicalConsulationFees);
            setphysicalfollowUpFees(response.data.physicalfollowUpFees);
            setdoctorConsulationFeesPkId(response.data.doctorConsulationFeesPkId);
          }
        })
        .catch((error) => {
          setisFetching(false);

          console.log(error);
        });
    };
    if (showConsultFees) getFeesDet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConsultFees]);

  // uploading documents point

  // medical registration document upload
  const selectDocsMedReg = async (fileToken) => {
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
        // console.log(pickerResult);
        setMedRegDoc([pickerResult]);

        const formData = new FormData();
        formData.append('directoryNames', 'DOCTOR_MEDICAL_REGISTRATION');
        formData.append('file', pickerResult);
        formData.append('userId', doctorId);
        if (fileToken !== undefined) formData.append('fileToken', fileToken);

        const { error, response } = await fileUpload(formData);

        if (error != null) {
          // console.log('======error======');
          // console.log(error);
          Alert.alert('Error', 'There was a problem in selecting document. Please try again.');
        } else {
          // console.log('======response======');
          // console.log(response.fileToken);
          setcertificatePath(response.fileToken);
          setnewcertificatePath(response.fileToken);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // education document upload
  const selectDocsEdu = async (fileToken) => {
    try {
      // console.log('==============Inside select Docs Education==========');

      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: types.pdf,
      });
      const ext = `.${pickerResult.name.split('.').pop()}`;

      pickerResult.name = `${doctorId}_DoctorEducation_${Degree}_${DegreePassingYear}${ext}`;
      // console.log(pickerResult);

      const formData = new FormData();
      formData.append('directoryNames', 'DOCTOR_EDUCATION');
      formData.append('file', pickerResult);
      formData.append('userId', doctorId);
      if (fileToken !== undefined) formData.append('fileToken', fileToken);
      const { error, response } = await fileUpload(formData);
      if (error != null) {
        // console.log('======error======');
        console.log(error);
        Alert.alert('Error', 'There was a problem in selecting document. Please try again.');
      } else {
        // console.log('======response======');
        // console.log(response.fileToken);
        setdegreePath(response.fileToken);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // identification document upload
  const selectDocsIden = async (fileToken) => {
    try {
      // console.log('==============Inside select Docs Identification==========');

      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: types.pdf,
      });
      const ext = `.${pickerResult.name.split('.').pop()}`;

      pickerResult.name = `${doctorId}_DoctorIdentification_${identificationType}${ext}`;
      // console.log(pickerResult.name);

      const formData = new FormData();
      formData.append('directoryNames', 'DOCTOR_IDENTIFICATION');
      formData.append('file', pickerResult);
      formData.append('userId', doctorId);
      if (fileToken !== undefined) formData.append('fileToken', fileToken);
      const { error, response } = await fileUpload(formData);
      if (error != null) {
        // console.log('======error======');
        console.log(error);
        Alert.alert('Error', 'There was a problem in selecting document. Please try again.');
      } else {
        // console.log('======response======');
        // console.log(response.fileToken);
        setidentificationPath(response.fileToken);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // post photo exp/clinic
  const choosePhoto = async (forField) => {
    Alert.alert('Upload Profile Picture', 'Select option for uploading profile picture', [
      {
        text: 'Open Library',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            // console.log(response);
            if (response.didCancel) console.log('Cancel');
            else if (response.errorCode) {
              Alert.alert('Error', response.errorMessage);
            } else if (response.assets[0].fileSize <= 2097152) {
              await postPhoto(response.assets[0], forField);
            } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 2MB.');
          });
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
        await launchcameraPhoto(forField);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const launchcameraPhoto = async (forField) => {
    launchCamera(
      { mediaType: 'photo', cameraType: 'front', saveToPhotos: true },
      async (response) => {
        // console.log(response);
        if (response.didCancel) console.log('Cancel');
        else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets[0].fileSize <= 2097152) {
          await postPhoto(response.assets[0], forField);
        } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 2MB.');
      }
    );
  };

  const postPhoto = async (pickerResult, forField) => {
    try {
      // console.log(`==============Inside post photo for ${forField}==========`);

      const ext = `.${pickerResult.fileName.split('.').pop()}`;

      delete pickerResult.fileName;
      pickerResult.size = pickerResult.fileSize;
      delete pickerResult.fileSize;
      if (forField === 'Clinic') pickerResult.name = `${doctorId}_ClinicPhoto${ext}`;

      if (forField === 'Experience') pickerResult.name = `${doctorId}_ExpPhoto${ext}`;

      // console.log(pickerResult.name);
      // console.log(pickerResult);

      const formData = new FormData();
      formData.append(
        'directoryNames',
        forField === 'Clinic' ? ' DOCTOR_CLINIC' : ' DOCTOR_EXPERIENCE'
      );
      formData.append('file', pickerResult);
      formData.append('userId', doctorId);

      if (forField === 'Experience' && expPhotoPath !== 0)
        formData.append('fileToken', expPhotoPath);

      if (forField === 'Clinic' && clinicPhoto != null) formData.append('fileToken', clinicPhoto);

      const { error, response } = await fileUpload(formData);

      if (error != null) {
        // console.log('======error======');
        console.log(error);
        Alert.alert('Error', 'There was a problem in uploading profile picture. Please try again.');
      } else {
        // console.log('======response======');
        console.log(response.fileToken);
        if (forField === 'Clinic') setClinicPhoto(response.fileToken);
        if (forField === 'Experience') setexpPhotoPath(response.fileToken);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // api calls on press update button
  const updateGenInfo = async () => {
    setisUploading(true);

    const mainOnj = {};
    mainOnj.age = Number(age);

    mainOnj.city = city;

    mainOnj.contactVisibility = showMobNo;
    mainOnj.dob = dob;
    mainOnj.doctorId = doctorId;
    mainOnj.doctorName = `${title} ${name}`;
    mainOnj.email = email;
    mainOnj.firebaseToken = await AsyncStorage.getItem('fcmToken');
    mainOnj.mobileNumber = doctorObj.mobileNumber;
    mainOnj.profilePhotoPath = profilePhotoPath;
    mainOnj.pinCode = pinCode;

    // console.log(`General Info Update---------\n${JSON.stringify(mainOnj, null, 1)}`);

    await axios
      .post(`${apiConfig.baseUrl}/doctor/generalinfo/update`, mainOnj)
      .then(async (response) => {
        setisUploading(false);
        if (response.status === 200) {
          setGenInfoEdit(false);
          Alert.alert('Profile Edited', 'Please log-in again to incorporate the changes');
          // let fcmToken = await AsyncStorage.getItem('fcmToken');
          await AsyncStorage.multiRemove(await AsyncStorage.getAllKeys());
          // let fcmToken = await AsyncStorage.getItem('fcmToken');
          // await AsyncStorage.setItem('fcmToken', fcmToken);
          navigation.navigate('LoginScreen');
        } else Alert.alert('Updation Error', 'Could not Update Details. Please try again later.');
      })
      .catch((error) => {
        setisUploading(false);
        Alert.alert('Error', `An error has occured please try again. ${error}`);
      });
  };

  const updateMedReg = async () => {
    setisUploading(true);
    const p = {
      certificatePath,
      doctorId,
      doctorMedicalRegistrationPkId: doctorMedicalRegistration.doctorMedicalRegistrationPkId,
      registrationCouncil: RegCouncil,
      registrationNo: RegNo,
      registrationYear: Number(RegYear),
    };
    const mj = [];
    mj.push(p);

    // console.log(`Medical Regd Update---------\n${mj}`);
    axios
      .post(`${apiConfig.baseUrl}/doctor/medicalregistration/save`, mj)
      .then((response) => {
        setisUploading(false);
        if (response.status === 200) {
          Alert.alert('Updated', 'Medical Registration details have been updated successfully!');
          setMedInfoEdit(false);
          setnewcertificatePath(null);
        } else Alert.alert('Updation Error', 'Could not update details. Please try again later.');
      })
      .catch((error) => {
        setisUploading(false);
        Alert.alert('Error', `An error has occured please try again. ${error}`);
      });
  };

  const updateEduDet = async (item) => {
    setisUploading(true);
    const amp = [];
    amp.push(item);
    axios
      .post(`${apiConfig.baseUrl}/doctor/education/save`, amp)
      .then((response) => {
        setisUploading(false);
        if (response.status === 200) {
          Alert.alert('Updated', 'Educational Qualifications Details Updated Successfully!');
          setShowEduDet(false);
        } else {
          Alert.alert('Updation Error', 'Could not Update Details. Please try again later.');
        }
      })
      .catch((error) => {
        setisUploading(false);
        Alert.alert('Error', `An error has occured please try again. ${error}`);
      });
  };

  const updateExpDet = async (item) => {
    setisUploading(true);
    const amp = [];
    amp.push(item);
    axios
      .post(`${apiConfig.baseUrl}/doctor/experience/save`, amp)
      .then((response) => {
        setisUploading(false);
        if (response.status === 200) {
          Alert.alert('Updated', 'Experience Details Updated Successfully!');
        } else {
          Alert.alert('Updation Error', 'Could not Update Details. Please try again later.');
        }
      })
      .catch((error) => {
        setisUploading(false);
        Alert.alert('Error', `An error has occured please try again. ${error}`);
      });
  };

  const updateIden = async (item) => {
    setisUploading(true);
    const amp = [];
    amp.push(item);
    axios
      .post(`${apiConfig.baseUrl}/doctor/identifications/save`, amp)
      .then((response) => {
        setisUploading(false);
        if (response.status === 200) {
          setIdenDetEdit(false);
          Alert.alert('Updated', 'Identification Details Updated Successfully!');
        } else {
          Alert.alert('Updation Error', 'Could not Update Details. Please try again later.');
        }
      })
      .catch((error) => {
        setisUploading(false);
        Alert.alert('Error', `An error has occured please try again. ${error}`);
      });
  };

  // updating Consultation Fees Details(completed)
  const updatefees = async () => {
    setisUploading(true);
    const doctorFees = {};
    doctorFees.doctorId = doctorId;
    doctorFees.econsulationFees = Number(eConsulationFees);
    doctorFees.efollowUpFees = Number(efollowUpFees);
    doctorFees.feesId = DoctorFees.doctorConsulationFeesPkId;
    doctorFees.followUpDuration = Number(showFollowUp);
    doctorFees.physicalConsulationFees = Number(physicalConsulationFees);
    doctorFees.physicalFollowUpFees = Number(physicalfollowUpFees);

    // console.log(`Fees Update---------\n${JSON.stringify(doctorFees, null, 1)}`);
    axios
      .post(`${apiConfig.baseUrl}/doctor/fees/update`, doctorFees)
      .then((response) => {
        setisUploading(false);
        if (response.status === 200) {
          Alert.alert('Updated', 'All changes made in Fees Config have been updated');
          setConsultFeesEdit(false);
        } else {
          Alert.alert('Updation Error', 'Could not Update Details. Please try again later.');
        }
      })
      .catch((error) => {
        setisUploading(false);
        Alert.alert('Error', `An error has occured please try again. ${error}`);
      });
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

  const calculateExp = async () => {
    if (dayjs(startExpDate).isValid() && dayjs(endExpDate).isValid()) {
      const startDt = dayjs(startExpDate);
      const endDt = dayjs(endExpDate);
      if (endDt.isBefore(startDt)) {
        Alert.alert('Invalid Date', 'Please enter valid date range');
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

  // rendering dynamic components
  const ViewIdentificationsTabular = () =>
    IdentificationDocs.map((idDocs, index) => (
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
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
          {/* Identification File */}
          <TouchableOpacity
            style={styles.cellStyle}
            onPress={() => {
              downloadCache(
                idDocs.identificationPath,
                doctorId,
                `${doctorId}_DoctorIdentification_${idDocs.identificationType}.pdf`
              );

              setdocsModal(true);
              // openURL(
              //   apiConfig.baseUrl + idDocs.identificationPath,
              // );
            }}
          >
            <FAIcon name="file-pdf" size={15} color="#2b8ada" style={{ marginVertical: 3 }} />
          </TouchableOpacity>
          {/* Identification Type */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{idDocs.identificationType}</Text>
          </View>
          {/* Identification Number */}
          <View style={styles.cellStyle}>
            <Text style={{ textAlign: 'center', fontSize: 10 }}>{idDocs.identificationNumber}</Text>
          </View>

          {IdenDetEdit ? (
            <View
              style={[styles.cellStyle, { flexDirection: 'row', alignContent: 'space-around' }]}
            >
              <TouchableOpacity
                style={{ flexDirection: 'column', flex: 0.45 }}
                onPress={() => {
                  setidentificationType(idDocs.identificationType);
                  setidentificationNumber(idDocs.identificationNumber);
                  setdoctorIdentificationPkId(idDocs.doctorIdentificationPkId);
                  seteditIden(true);
                  setIdenElementModal(true);
                }}
              >
                <FAIcon name="edit" size={13} color="#2b8ada" style={{ alignSelf: 'center' }} />
              </TouchableOpacity>
              {/* <View style={{flexDirection: 'column', flex: 0.45}}>
                  <FAIcon
                    name="trash"
                    size={13}
                    color={'red'}
                    style={{alignSelf: 'center'}}
                    onPress={() => removeIdenHandler(index)}
                  />
                </View> */}
            </View>
          ) : null}
        </View>
      </View>
    ));

  const ViewEducation = () =>
    Education.map((edu, index) => (
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
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
          {/* Degree */}
          <View style={styles.cellStyle}>
            <FAIcon
              name="file-pdf"
              size={15}
              color="#2b8ada"
              style={{ marginVertical: 3 }}
              onPress={() => {
                downloadCache(
                  edu.degreePath,
                  doctorId,
                  `${doctorId}_DoctorEducation_${edu.degree}_${edu.passingYear}.pdf`
                );
                setdocsModal(true);
                // openURL(apiConfig.baseUrl + edu.degreePath);
              }}
            />
            <Text style={styles.cellText}>{edu.degree}</Text>
          </View>
          {/* Passing Year */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>{edu.passingYear}</Text>
          </View>
          {/* Specialization */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>{edu.specialization}</Text>
          </View>
          {/* University */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>{edu.university}</Text>
          </View>

          {EduDetEdit ? (
            <View
              style={[styles.cellStyle, { flexDirection: 'row', alignContent: 'space-around' }]}
            >
              <TouchableOpacity
                style={{ flexDirection: 'column', flex: 0.45 }}
                onPress={() => {
                  setDateData();
                  setDegree(edu.degree);
                  setDegreePassingYear(edu.passingYear);
                  setdegreePath(edu.degreePath);
                  setSpecialization(edu.specialization);
                  setUniversity(edu.university);
                  setdoctorEducationPkId(edu.doctorEducationPkId);
                  setEduElementModal(true);
                  seteditEduDet(true);
                }}
              >
                <FAIcon name="edit" size={13} color="#2b8ada" style={{ alignSelf: 'center' }} />
              </TouchableOpacity>
              {/* <View style={{flexDirection: 'column', flex: 0.45}}>
                  <FAIcon
                    name="trash"
                    size={13}
                    color={'red'}
                    style={{alignSelf: 'center'}}
                  />
                </View> */}
            </View>
          ) : null}
        </View>
      </View>
    ));

  const ViewExperienceTabular = () =>
    Experience.map((Exp, index) => (
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          flexDirection: 'column',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#d3d3d3',
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
          {/* Practice At */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>{Exp.practiceAt}</Text>
          </View>
          {/* Start Date */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>
              {dayjs(Exp.startDate).isValid()
                ? dayjs(Exp.startDate).format('DD-MM-YYYY')
                : 'DD-MM-YYYY'}
            </Text>
          </View>
          {/* End Date */}
          <View style={styles.cellStyle}>
            <Text style={styles.cellText}>
              {dayjs(Exp.endDate).isValid() && Exp.endDate != null
                ? dayjs(Exp.endDate).format('DD-MM-YYYY')
                : '-'}
            </Text>
          </View>
          {/* Total Experience */}
          <View style={styles.cellStyle}>
            {Math.floor(Exp.experienceInMonths / 12) > 0 ? (
              <Text style={styles.cellText}>
                {`${Math.floor(Exp.experienceInMonths / 12)} year(s)`}
              </Text>
            ) : null}

            {parseInt(Exp.experienceInMonths % 12, 10) !== 0 ? (
              <Text style={styles.cellText}>
                {`${parseInt(Exp.experienceInMonths % 12, 10)} month(s)`}
              </Text>
            ) : null}
          </View>

          <View style={[styles.cellStyle, { flexDirection: 'row', alignContent: 'space-around' }]}>
            <View style={{ flexDirection: 'row', flex: 0.45 }}>
              <FAIcon
                name="file-image"
                size={15}
                color="#2b8ada"
                style={[{ alignSelf: 'center' }, ExpDetEdit ? { marginRight: 10 } : null]}
                onPress={async () => {
                  if (Exp.experiencePhoto !== 0 && Exp.experiencePhoto != null) {
                    setDisplayPhotoToken(Exp.experiencePhoto);
                    // console.log(Exp);
                    setImageViewer(true);
                  } else
                    Alert.alert(
                      'No File',
                      `You have not uploaded experience certificate for ${Exp.practiceAt}.`
                    );
                }}
              />

              {ExpDetEdit ? (
                <FAIcon
                  name="edit"
                  size={13}
                  color="#2b8ada"
                  style={{ alignSelf: 'center' }}
                  onPress={() => {
                    // console.log(Exp);
                    setPracticeAt(Exp.practiceAt);
                    setStartExpDate(Exp.startDate);
                    setEndExpDate(Exp.endDate);
                    setexperienceId(Exp.experienceId);
                    setExperienceInMonths(Exp.experienceInMonths);
                    setexpPhotoPath(Exp.experiencePhoto);
                    setcheckPresent(Exp.currentlyThere);
                    seteditExp(true);
                    setExpElementModal(true);
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    ));

  const chooseProfileImage = async () => {
    Alert.alert('Upload Profile Picture', 'Select option for uploading profile picture', [
      {
        text: 'Open Library',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            // console.log(response);
            if (response.didCancel) console.log('Cancel');
            else if (response.errorCode) {
              Alert.alert('Error', response.errorMessage);
            } else if (response.assets[0].fileSize <= 5242880) {
              await postpfp(response.assets[0]);
              setpfpuri(response.assets[0].uri);
              const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
              x.profileUri = response.assets[0].uri;
              await AsyncStorage.setItem('UserDoctorProfile', JSON.stringify(x));
            } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 5MB.');
          });
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
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const launchcamera = async () => {
    launchCamera(
      { mediaType: 'photo', cameraType: 'front', saveToPhotos: true },
      async (response) => {
        // console.log(response);
        if (response.didCancel) console.log('Cancel');
        else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets[0].fileSize <= 5242880) {
          await postpfp(response.assets[0]);
          setpfpuri(response.assets[0].uri);
          const x = await AsyncStorage.getItem('UserDoctorProfile');
          x.profileUri = response.assets[0].uri;
          await AsyncStorage.setItem('UserDoctorProfile', x);
        } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 5MB.');
      }
    );
  };
  const postpfp = async (pickerResult) => {
    try {
      // console.log('==============Inside post pfp==========');

      const ext = `.${pickerResult.fileName.split('.').pop()}`;

      delete pickerResult.fileName;
      pickerResult.size = pickerResult.fileSize;
      delete pickerResult.fileSize;

      pickerResult.name = `${doctorId}_ProfilePhoto${ext}`;
      // console.log(pickerResult.name);
      // console.log(pickerResult);

      const formData = new FormData();
      formData.append('directoryNames', 'DOCTOR_PHOTO');
      formData.append('file', pickerResult);
      formData.append('userId', doctorId);
      if (profilePhotoPath != null) formData.append('fileToken', profilePhotoPath);
      const { error, response } = await fileUpload(formData);

      if (error != null) {
        // console.log('======error======');
        console.log(error);
        Alert.alert('Error', 'There was a problem in uploading profile picture. Please try again.');
      } else {
        // console.log('======response======');
        // console.log(response.fileToken);
        setprofilePhotoPath(response.fileToken);
        const x = await AsyncStorage.getItem('UserDoctorProfile');
        x.profilePhotoPath = response.fileToken;
        await AsyncStorage.setItem('UserDoctorProfile', x);
      }
    } catch (e) {
      console.log(e);
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
          // marginTop: 30,
        }}
      >
        <StatusBar animated backgroundColor="#2B8ADA" />
        <ScrollView
          style={{
            width: '100%',
            alignSelf: 'center',
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
        >
          <Header showMenu={false} title="Edit Profile" />
          <View style={{ width: '90%', alignSelf: 'center' }}>
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
                {profilePhotoPath == null || profilePhotoPath === 0 ? (
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
                      uri: `${apiConfig.baseUrl}/file/download?fileToken=${profilePhotoPath}&userId=${doctorId}`,
                    }}
                  />
                )}
                {GenInfoEdit ? (
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
                ) : null}
              </View>
            </View>

            <View style={{}}>
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
                    onPress={() => {
                      if (!showGenInfo) {
                        setShowGenInfo(!showGenInfo);
                      } else {
                        setShowGenInfo(!showGenInfo);
                      }
                    }}
                  >
                    <FAIcon
                      name="info-circle"
                      size={15}
                      color={showGenInfo ? '#2b8ada' : 'gray'}
                      style={{ marginHorizontal: 5, alignSelf: 'center' }}
                    />
                    <Text
                      style={[
                        styles.label,
                        { width: '85%' },
                        showGenInfo ? { color: '#2B8ADA', width: '75%' } : null,
                      ]}
                    >
                      General Information
                    </Text>
                    {showGenInfo ? (
                      <Text
                        style={[
                          {
                            alignSelf: 'center',
                            color: '#2B8ADA',
                            padding: 5,
                            textDecorationLine: 'underline',
                          },
                          GenInfoEdit ? { color: 'white' } : null,
                        ]}
                        onPress={() => {
                          if (GenInfoEdit === false) {
                            Alert.alert(
                              'Edit General Information',
                              'You can now edit General Information Field'
                            );
                            setGenInfoEdit(true);
                          }
                        }}
                      >
                        Edit
                      </Text>
                    ) : null}
                    <FAIcon
                      name={showGenInfo ? 'chevron-down' : 'chevron-right'}
                      style={[styles.label, { width: '10%', fontSize: 20 }]}
                      color={showGenInfo ? '#2B8ADA' : 'gray'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* General Info Body */}
              {showGenInfo ? (
                <View>
                  <View style={styles.whiteBodyView}>
                    <View style={{ flexDirection: 'column', marginVertical: 10 }}>
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
                              style={[
                                styles.textInput,
                                { backgroundColor: '#d0e0fc', padding: 10 },
                              ]}
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
                          {/* {GenInfoEdit ? (
                            <SelectList
                              labelStyles={{height: 0}}
                              placeholder={gender}
                              setSelected={val => setGender(val)}
                              data={dataGender}
                              save="value"
                              boxStyles={{
                                backgroundColor: '#E8F0FE',
                                borderWidth: 0,
                              }}
                              dropdownStyles={{backgroundColor: 'white'}}
                              dropdownTextStyles={{
                                color: '#2b8ada',
                                fontWeight: 'bold',
                              }}
                              badgeStyles={{backgroundColor: '#2b8ada'}}
                            />
                          ) : (
                            <Text
                              style={[
                                styles.textInput,
                                {backgroundColor: '#d0e0fc', padding: 10},
                                GenInfoEdit
                                  ? {backgroundColor: '#E8F0FE'}
                                  : null,
                              ]}>
                              {gender}
                            </Text>
                          )} */}
                          <Text
                            style={[styles.textInput, { backgroundColor: '#d0e0fc', padding: 10 }]}
                          >
                            {gender}
                          </Text>
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
                            keyboardType="number-pad"
                            value={pinCode}
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
                          <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text
                              style={[
                                styles.textInput,
                                { backgroundColor: '#d0e0fc', flex: 1 },
                                GenInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                              ]}
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
                                marginRight: '5%',
                                alignSelf: 'center',
                              }}
                              onPress={GenInfoEdit ? showDatePicker : null}
                            />
                          </View>
                        </View>

                        <View style={{ flex: 0.45 }}>
                          <Text style={styles.inputLabel}>Age</Text>
                          <Text
                            style={[
                              styles.textInput,
                              { backgroundColor: '#d0e0fc' },
                              GenInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                            ]}
                          >
                            {age}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          width: '90%',
                          marginTop: 10,
                        }}
                      >
                        {/* <View
                          style={{
                            flexDirection: !GenInfoEdit ? 'column' : 'row',
                            flex: 1,
                            alignSelf: 'center',
                            // borderColor: 'gray',
                            // borderWidth: 1,
                            justifyContent: 'space-between',

                            padding: 5,
                          }}>
                          <Text style={[styles.inputLabel, {marginTop: 0}]}>
                            Contact Visibility
                          </Text>
                          {GenInfoEdit ? (
                            <Switch
                              trackColor={{false: '#767577', true: '#81b0ff'}}
                              thumbColor={showMobNo ? '#81b0ff' : '#f4f3f4'}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={() => {
                                setshowMobNo(!showMobNo);
                                // updateContactVisibility();
                              }}
                              value={showMobNo}
                            />
                          ) : (
                            <Text
                              style={[
                                styles.textInput,
                                {backgroundColor: '#d0e0fc'},
                                GenInfoEdit
                                  ? {backgroundColor: '#E8F0FE'}
                                  : null,
                              ]}>
                              {showMobNo ? 'Yes' : 'No'}
                            </Text>
                          )}
                        </View> */}
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '95%',
                          alignSelf: 'center',
                        }}
                      >
                        {/* <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          marginVertical: 5,
                          width: '95%',
                          justifyContent: 'space-between',
                        }}>
                        <View style={[styles.textInput, {flex: 0.95}]}>
                          <Text style={[styles.label]}>
                            Upload Digital Signature
                          </Text>
                        </View>
                        <CustomButton
                          text="Browse"
                          textstyle={{color: 'white'}}
                          style={{
                            alignSelf: 'center',
                            backgroundColor: '#2B8ADA',
                            borderRadius: 5,
                            padding: 10,
                          }}
                          onPress={() => {}}
                        />
                      </View> */}
                        <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          mode="date"
                          display="spinner"
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                        />
                        {/* <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          width: '95%',
                          height: 60,
                          backgroundColor: '#E8F0FE',
                          marginVertical: 5,
                          borderRadius: 5,
                        }}></View> */}
                      </View>
                      {GenInfoEdit ? (
                        <View style={styles.ButtonView}>
                          <CustomButton
                            text="Done"
                            textstyle={styles.ButtonText}
                            onPress={() => {
                              // setGenInfoEdit(false);
                              updateGenInfo();
                              // clearKeys();
                            }}
                            style={styles.ButtonUpdate}
                          />
                          <CustomButton
                            text="Cancel"
                            textstyle={styles.ButtonTextCancel}
                            onPress={() => {
                              setGenInfoEdit(false);
                              // clearKeys();
                            }}
                            style={styles.ButtonCancel}
                          />
                        </View>
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
                      if (!showMedReg) {
                        setShowMedReg(!showMedReg);
                      } else {
                        setShowMedReg(!showMedReg);
                      }
                    }}
                  >
                    <FAIcon
                      name="file-medical"
                      size={15}
                      color={showMedReg ? '#2b8ada' : 'gray'}
                      style={{ marginHorizontal: 5, alignSelf: 'center' }}
                    />
                    <Text
                      style={[
                        styles.label,
                        { width: '85%' },
                        showMedReg ? { color: '#2B8ADA', width: '75%' } : null,
                      ]}
                    >
                      Medical Registration
                    </Text>
                    {showMedReg ? (
                      <Text
                        style={[
                          {
                            alignSelf: 'center',
                            color: '#2B8ADA',
                            padding: 5,
                            textDecorationLine: 'underline',
                          },
                          MedInfoEdit ? { color: 'white' } : null,
                        ]}
                        onPress={() => {
                          if (MedInfoEdit === false) {
                            Alert.alert(
                              'Edit Medical Registration',
                              'You can now edit Medical Registration Details'
                            );
                            setMedInfoEdit(true);
                          }
                        }}
                      >
                        Edit
                      </Text>
                    ) : null}
                    <FAIcon
                      name={showMedReg ? 'chevron-down' : 'chevron-right'}
                      color={showMedReg ? '#2B8ADA' : 'gray'}
                      style={[styles.label, { width: '10%', fontSize: 20 }]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Medical Registration Body */}
              {showMedReg ? (
                <View>
                  <View style={styles.whiteBodyView}>
                    <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flex: 0.45, marginRight: '5%' }}>
                          <Text style={[styles.inputLabel, { marginTop: 0 }]}>
                            Registration Number
                          </Text>
                          <TextInput
                            style={[
                              styles.textInput,
                              { backgroundColor: '#d0e0fc' },
                              MedInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                            ]}
                            editable={MedInfoEdit}
                            placeholderTextColor="black"
                            maxLength={20}
                            onChangeText={(text) => setRegNo(text)}
                            value={RegNo}
                          />
                        </View>
                        <View style={{ flex: 0.45 }}>
                          <Text style={[styles.inputLabel, { marginTop: 0 }]}>
                            Registration Council
                          </Text>
                          <TextInput
                            style={[
                              styles.textInput,
                              { backgroundColor: '#d0e0fc' },
                              MedInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                            ]}
                            editable={MedInfoEdit}
                            placeholderTextColor="black"
                            onChangeText={(text) => setRegCouncil(text)}
                            maxLength={20}
                            value={RegCouncil}
                          />
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flex: 0.45, marginRight: '5%' }}>
                          <Text style={styles.inputLabel}>Reg. Certificate</Text>
                          {MedInfoEdit === false ? (
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                marginTop: 5,
                                borderColor: '#2b8ada',
                                borderWidth: 1,
                                padding: 5,
                                borderRadius: 10,
                              }}
                              onPress={() => {
                                if (MedInfoEdit === false) {
                                  downloadCache(
                                    certificatePath,
                                    doctorId,
                                    `${doctorId}_MedicalRegistration.pdf`
                                  );
                                  setdocsModal(true);
                                } else
                                  Alert.alert('Alert', 'Please Click on Edit and then select File');
                              }}
                            >
                              {/* <TextInput
                              style={[
                                styles.textInput,
                                {backgroundColor: '#d0e0fc'},
                                MedInfoEdit
                                  ? {backgroundColor: '#E8F0FE'}
                                  : null,
                              ]}
                              placeholderTextColor={'black'}
                              value={RegCert}
                              editable={false}></TextInput>
                            {MedInfoEdit ? (
                              <FAIcon
                                name="upload"
                                color={'gray'}
                                size={16}
                                style={[
                                  {
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    marginRight: '5%',
                                    marginBottom: '5%',
                                    backgroundColor: '#d0e0fc',
                                  },
                                  {backgroundColor: '#d0e0fc'},
                                  MedInfoEdit
                                    ? {backgroundColor: '#E8F0FE'}
                                    : null,
                                ]}
                                onPress={() => {
                                  selectDocsMedReg();
                                }}
                              />
                            ) : null} */}
                              <FAIcon
                                name="file-pdf"
                                size={15}
                                color="#2b8ada"
                                style={{
                                  justifyContent: 'center',
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 10,
                                  justifyContent: 'center',
                                  paddingHorizontal: 8,
                                }}
                              >
                                {certificatePath != null
                                  ? `${doctorId}_MedicalRegistration.pdf`
                                  : 'Upload File'}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View>
                              <CustomButton
                                text={
                                  certificatePath == null ? 'Select Document' : ' ✓ File Selected'
                                }
                                textstyle={{
                                  color: certificatePath == null ? '#2b8ada' : '#21c47f',
                                  fontSize: 12,
                                }}
                                style={{
                                  marginTop: 10,
                                  backgroundColor: 'white',
                                  borderRadius: 12,
                                  padding: 6,
                                  paddingHorizontal: 10,
                                  borderWidth: 2,
                                  borderColor: certificatePath == null ? '#2b8ada' : '#21c47f',
                                }}
                                onPress={() => {
                                  selectDocsMedReg();
                                }}
                              />
                              <Text
                                style={{
                                  marginVertical: 5,
                                  color: 'red',
                                  fontSize: 9,
                                }}
                              >
                                Note:-{'\n'} Upload certificate in pdf format of max size 2MB.
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={{ flex: 0.45 }}>
                          <Text style={styles.inputLabel}>Reg. Year</Text>
                          <TextInput
                            style={[
                              styles.textInput,
                              { backgroundColor: '#d0e0fc' },
                              MedInfoEdit ? { backgroundColor: '#E8F0FE' } : null,
                            ]}
                            editable={MedInfoEdit}
                            placeholderTextColor="black"
                            keyboardType="number-pad"
                            maxLength={4}
                            onChangeText={(text) => setRegYear(text)}
                            value={`${RegYear}`}
                          />
                        </View>
                      </View>
                      {MedInfoEdit ? (
                        <View style={styles.ButtonView}>
                          <CustomButton
                            text="Done"
                            textstyle={styles.ButtonText}
                            onPress={() => {
                              if (RegNo === '')
                                Alert.alert(
                                  'Incomplete Details!',
                                  'Please fill registration number.'
                                );
                              else if (RegCouncil === '')
                                Alert.alert(
                                  'Incomplete Details!',
                                  'Please fill registration council.'
                                );
                              else if (RegYear === '' || RegYear.length < 4)
                                Alert.alert(
                                  'Incomplete Details!',
                                  'Please fill registration year.'
                                );
                              // else if (
                              //   RegYear != '' &&
                              //   !(
                              //     parseInt(RegYear) > parseInt(dob) &&
                              //     parseInt(RegYear) < 2024
                              //   )
                              // )
                              //   Alert(
                              //     'Invalid Year',
                              //     'Please fill valid registration year',
                              //   );
                              else if (certificatePath == null)
                                Alert.alert(
                                  'Incomplete Details!',
                                  'Please select registration certificate file.'
                                );
                              else updateMedReg();
                              // setMedInfoEdit(false);
                            }}
                            style={styles.ButtonUpdate}
                          />
                          <CustomButton
                            text="Cancel"
                            textstyle={styles.ButtonTextCancel}
                            onPress={() => {
                              setnewcertificatePath(null);
                              setMedInfoEdit(false);
                            }}
                            style={styles.ButtonCancel}
                          />
                        </View>
                      ) : null}
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
                      if (!showEduDet) {
                        setShowEduDet(!showEduDet);
                      } else setShowEduDet(!showEduDet);
                    }}
                  >
                    <MIcons
                      name="certificate"
                      size={20}
                      color={showEduDet ? '#2b8ada' : 'gray'}
                      style={{ marginHorizontal: 2, alignSelf: 'center' }}
                    />
                    <Text
                      style={[
                        styles.label,
                        { width: '85%' },
                        showEduDet ? { color: '#2B8ADA', width: '75%' } : null,
                      ]}
                    >
                      Educational Qualifications & Certificates
                    </Text>
                    {showEduDet ? (
                      <Text
                        style={[
                          {
                            alignSelf: 'center',
                            color: '#2B8ADA',
                            padding: 5,
                            textDecorationLine: 'underline',
                          },
                          EduDetEdit ? { color: 'white' } : null,
                        ]}
                        onPress={() => {
                          if (EduDetEdit === false) {
                            Alert.alert('Edit Education', 'You can now edit Education Details');
                            setEduDetEdit(true);
                          }
                        }}
                      >
                        Edit
                      </Text>
                    ) : null}

                    <FAIcon
                      name={showEduDet ? 'chevron-down' : 'chevron-right'}
                      color={showEduDet ? '#2B8ADA' : 'gray'}
                      style={[styles.label, { width: '10%', fontSize: 20 }]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Education Qualifications & Certificates Body */}
              {showEduDet ? (
                <View style={{ flex: 1 }}>
                  <View style={styles.whiteBodyView}>
                    {/* View Education */}
                    {Education !== '' ? (
                      <View>
                        {/* Heading */}
                        <View
                          style={{
                            width: '95%',
                            alignSelf: 'center',
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
                            {EduDetEdit ? (
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
                            ) : null}
                          </View>
                        </View>
                        <ViewEducation />
                        {EduDetEdit ? (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignSelf: 'flex-end',
                            }}
                          >
                            <CustomButton
                              text="+ Add More"
                              textstyle={{ color: 'white', fontSize: 10 }}
                              style={{
                                alignSelf: 'flex-end',
                                width: 80,
                                borderColor: '#2b8ada',
                                borderWidth: 1,
                                backgroundColor: '#2b8ada',
                                borderRadius: 5,
                                padding: 3,
                                paddingHorizontal: 10,
                                marginTop: 10,
                                marginRight: 5,
                              }}
                              onPress={() => {
                                setDateData();
                                setEduElementModal(true);
                              }}
                            />
                            <CustomButton
                              text="Cancel"
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
                              onPress={() => setEduDetEdit(false)}
                            />
                          </View>
                        ) : null}
                      </View>
                    ) : null}
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
                      if (!showExpDet) {
                        setShowExpDet(!showExpDet);
                      } else setShowExpDet(!showExpDet);
                    }}
                  >
                    <FAIcon
                      name="calendar-plus"
                      size={15}
                      color={showExpDet ? '#2b8ada' : 'gray'}
                      style={{ marginHorizontal: 5, alignSelf: 'center' }}
                    />
                    <Text
                      style={[
                        styles.label,
                        { width: '85%' },
                        showExpDet ? { color: '#2B8ADA', width: '75%' } : null,
                      ]}
                    >
                      Experience
                    </Text>
                    {showExpDet ? (
                      <Text
                        style={[
                          {
                            alignSelf: 'center',
                            color: '#2B8ADA',
                            padding: 5,
                            textDecorationLine: 'underline',
                          },
                          ExpDetEdit ? { color: 'white' } : null,
                        ]}
                        onPress={() => {
                          if (ExpDetEdit === false) {
                            Alert.alert('Edit Experience', 'You can now edit Experience Details');
                            setExpDetEdit(true);
                          }
                        }}
                      >
                        Edit
                      </Text>
                    ) : null}
                    <FAIcon
                      name={showExpDet ? 'chevron-down' : 'chevron-right'}
                      color={showExpDet ? '#2B8ADA' : 'gray'}
                      style={[styles.label, { width: '10%', fontSize: 20 }]}
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
                            width: '95%',
                            alignSelf: 'center',
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
                        <ViewExperienceTabular />
                        {ExpDetEdit ? (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignSelf: 'flex-end',
                            }}
                          >
                            <CustomButton
                              text="+ Add More"
                              textstyle={{ color: 'white', fontSize: 10 }}
                              style={{
                                alignSelf: 'flex-end',
                                width: 80,
                                borderColor: '#2b8ada',
                                borderWidth: 1,
                                backgroundColor: '#2b8ada',
                                borderRadius: 5,
                                padding: 3,
                                paddingHorizontal: 10,
                                marginTop: 10,
                                marginRight: 5,
                              }}
                              onPress={() => {
                                seteditExp(false);
                                setExpElementModal(true);
                              }}
                            />
                            <CustomButton
                              text="Cancel"
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
                              onPress={() => setExpDetEdit(false)}
                            />
                          </View>
                        ) : null}
                      </View>
                    ) : null}
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
                      if (!showIdenDet) {
                        setShowIdenDet(!showIdenDet);
                      } else setShowIdenDet(!showIdenDet);
                    }}
                  >
                    <FAIcon
                      name="address-card"
                      size={15}
                      color={showIdenDet ? '#2b8ada' : 'gray'}
                      style={{ marginHorizontal: 5, alignSelf: 'center' }}
                    />
                    <Text
                      style={[
                        styles.label,
                        { width: '85%' },
                        showIdenDet ? { color: '#2B8ADA', width: '75%' } : null,
                      ]}
                    >
                      Identification
                    </Text>
                    {showIdenDet ? (
                      <Text
                        style={[
                          {
                            alignSelf: 'center',
                            color: '#2B8ADA',
                            padding: 5,
                            textDecorationLine: 'underline',
                          },
                          IdenDetEdit ? { color: 'white' } : null,
                        ]}
                        onPress={() => {
                          if (showIdenDet) {
                            Alert.alert(
                              'Edit Identification',
                              'You can now edit Identification Details'
                            );
                            setIdenDetEdit(true);
                          }
                        }}
                      >
                        Edit
                      </Text>
                    ) : null}
                    <FAIcon
                      name={showIdenDet ? 'chevron-down' : 'chevron-right'}
                      color={showIdenDet ? '#2B8ADA' : 'gray'}
                      style={[styles.label, { width: '10%', fontSize: 20 }]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Identification Body */}
              {showIdenDet ? (
                <View>
                  <View style={styles.whiteBodyView}>
                    {IdentificationDocs !== '' ? (
                      <View>
                        <View
                          style={{
                            width: '95%',
                            alignSelf: 'center',
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
                              <Text style={styles.cellHeadingText}>File</Text>
                            </View>
                            <View style={styles.cellHeading}>
                              <Text style={styles.cellHeadingText}>Name</Text>
                            </View>
                            <View style={styles.cellHeading}>
                              <Text style={styles.cellHeadingText}>ID No.</Text>
                            </View>

                            {IdenDetEdit ? (
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
                            ) : null}
                          </View>
                        </View>
                        <ViewIdentificationsTabular />
                        {IdenDetEdit ? (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignSelf: 'flex-end',
                            }}
                          >
                            <CustomButton
                              text="+ Add More"
                              textstyle={{ color: 'white', fontSize: 10 }}
                              style={{
                                alignSelf: 'flex-end',
                                width: 80,
                                backgroundColor: '#2b8ada',
                                borderColor: '#2b8ada',
                                borderWidth: 1,
                                borderRadius: 5,
                                padding: 3,
                                paddingHorizontal: 10,
                                marginTop: 10,
                                marginRight: 5,
                              }}
                              onPress={() => {
                                seteditIden(false);
                                setIdenElementModal(true);
                              }}
                            />
                            <CustomButton
                              text="Cancel"
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
                              onPress={() => setIdenDetEdit(false)}
                            />
                          </View>
                        ) : null}
                      </View>
                    ) : null}
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
                      setShowConsultFees(!showConsultFees);
                    }}
                  >
                    <FAIcon
                      name="money-check"
                      size={15}
                      color={showConsultFees ? '#2b8ada' : 'gray'}
                      style={{ marginHorizontal: 5, alignSelf: 'center' }}
                    />
                    <Text
                      style={[
                        styles.label,
                        { width: '85%' },
                        showConsultFees ? { color: '#2B8ADA', width: '75%' } : null,
                      ]}
                    >
                      Consultation Fees
                    </Text>
                    {showConsultFees ? (
                      <Text
                        style={[
                          {
                            alignSelf: 'center',
                            color: '#2B8ADA',
                            padding: 5,
                            textDecorationLine: 'underline',
                          },
                          ConsultFeesEdit ? { color: 'white' } : null,
                        ]}
                        onPress={() => {
                          if (ConsultFeesEdit === false) {
                            Alert.alert('Edit Fees ', 'You can now edit Fees Details');
                            setConsultFeesEdit(true);
                          }
                        }}
                      >
                        Edit
                      </Text>
                    ) : null}
                    <FAIcon
                      name={showConsultFees ? 'chevron-down' : 'chevron-right'}
                      color={showConsultFees ? '#2B8ADA' : 'gray'}
                      style={[styles.label, { width: '10%', fontSize: 20 }]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Consultation Fees Body */}
              {showConsultFees ? (
                <View style={styles.whiteBodyView}>
                  <View
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      flexDirection: 'column',
                      marginBottom: 10,
                    }}
                  >
                    {/* Physical Consultation Fees */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
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
                          style={[styles.textInput, { backgroundColor: '#d0e0fc' }]}
                          maxLength={5}
                          keyboardType="number-pad"
                          onChangeText={(text) => setphysicalConsulationFees(text)}
                          value={`${physicalConsulationFees}`}
                          editable={ConsultFeesEdit}
                        />
                      </View>
                    </View>
                    {/* Physical Follow-Up Fees */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
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
                          style={[styles.textInput, { backgroundColor: '#d0e0fc' }]}
                          keyboardType="number-pad"
                          maxLength={5}
                          onChangeText={(text) => setphysicalfollowUpFees(text)}
                          value={`${physicalfollowUpFees}`}
                          editable={ConsultFeesEdit}
                        />
                      </View>
                    </View>
                    {/* E-Consultation Fees */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
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
                          style={[styles.textInput, { backgroundColor: '#d0e0fc' }]}
                          maxLength={5}
                          keyboardType="number-pad"
                          onChangeText={(text) => seteConsulationFees(text)}
                          value={`${eConsulationFees}`}
                          editable={ConsultFeesEdit}
                        />
                      </View>
                    </View>

                    {/* E-Consultation Follow-Up Fees */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
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
                          style={[styles.textInput, { backgroundColor: '#d0e0fc' }]}
                          keyboardType="number-pad"
                          maxLength={5}
                          onChangeText={(text) => setefollowUpFees(text)}
                          value={`${efollowUpFees}`}
                          editable={ConsultFeesEdit}
                        />
                      </View>
                    </View>
                    {/* Duration of Follow-Up */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '100%',
                        }}
                      >
                        <Text style={styles.inputLabel}>Duration of Follow-Up</Text>

                        <TextInput
                          style={[styles.textInput, { backgroundColor: '#d0e0fc' }]}
                          keyboardType="number-pad"
                          maxLength={2}
                          onChangeText={(text) => setshowFollowUp(text)}
                          value={`${showFollowUp}`}
                          editable={ConsultFeesEdit}
                        />
                      </View>
                    </View>
                  </View>
                  {ConsultFeesEdit ? (
                    <View style={styles.ButtonView}>
                      <CustomButton
                        text="Done"
                        textstyle={styles.ButtonText}
                        style={styles.ButtonUpdate}
                        onPress={() => {
                          updatefees();
                          // Alert.alert('Fees Details Updated Successfully!');
                          // setConsultFeesEdit(false);
                        }}
                      />
                      <CustomButton
                        text="Cancel"
                        textstyle={styles.ButtonTextCancel}
                        style={styles.ButtonCancel}
                        onPress={() => setConsultFeesEdit(false)}
                      />
                    </View>
                  ) : null}
                </View>
              ) : null}
              {/* Buttons */}
              {/* <CustomButton
                text={'Go Back'}
                textstyle={{color: 'white', fontSize: 20}}
                style={{
                  flex: 1,
                  backgroundColor: '#2b8ada',
                  padding: 6,
                  marginVertical: 10,
                  borderRadius: 10,
                }}
                onPress={() => navigation.goBack()}
              /> */}
            </View>
            {EduElementModal ? (
              <Modal
                animationType="slide"
                transparent
                visible={EduElementModal}
                onRequestClose={() => {
                  setEduElementModal(!EduElementModal);
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
                        }}
                      >
                        {editEduDet ? 'Edit' : 'Add More'} Education
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
                          setdegreePath(null);
                          setDegree('');
                          setDegreePassingYear('');
                          setUniversity('');
                          setSpecialization('');
                          setEduElementModal(false);
                        }}
                      />
                    </View>
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
                      <View
                        style={{
                          flexDirection: 'column',
                          marginVertical: 5,
                          flex: 1,
                          marginBottom: 10,
                        }}
                      >
                        <CustomButton
                          text={degreePath == null ? 'Select Document' : ' ✓ File Selected'}
                          textstyle={{
                            color: degreePath == null ? '#2b8ada' : '#21c47f',
                            fontSize: 12,
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
                            if (Degree === '' || DegreePassingYear === '')
                              Alert.alert(
                                'Incomplete Details',
                                'Please Select Degree and Passing Year before selecting document'
                              );
                            else selectDocsEdu();
                          }}
                        />
                        <Text
                          style={{
                            alignSelf: 'flex-start',
                            fontSize: 9,
                            marginTop: 2,
                            color: 'red',
                          }}
                        >
                          Note:-{'\n'} Upload University Degree Certificate in pdf format of max
                          size 2MB.
                        </Text>
                      </View>
                    </View>

                    <CustomButton
                      text="Update"
                      textstyle={{ color: 'white' }}
                      style={{
                        width: '95%',
                        backgroundColor: '#2B8ADA',
                        marginVertical: 5,
                        paddingVertical: 5,
                        borderRadius: 10,
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
                        else if (degreePath == null)
                          Alert.alert('Incomplete Details!', 'Please select pdf file');
                        else if (Specialization === 'Other' && Otherspeciality === '')
                          Alert.alert('Incomplete Details!', 'Please specify speciality name');
                        else {
                          const p = {
                            degree: Degree,
                            degreePath,
                            doctorId,
                            passingYear: Number(DegreePassingYear),
                            specialization:
                              Specialization === 'Other' ? Otherspeciality : Specialization,
                            university: University,
                          };
                          if (editEduDet) p.doctorEducationPkId = doctorEducationPkId;

                          updateEduDet(p);
                          setDegree('');
                          setdegreePath(null);
                          setDegreePassingYear('');
                          setdoctorEducationPkId(0);
                          setSpecialization('');
                          setUniversity('');
                          setEduElementModal(false);
                        }
                      }}
                    />
                  </View>
                </View>
              </Modal>
            ) : null}
            {ExpElementModal ? (
              <Modal
                animationType="slide"
                transparent
                visible={ExpElementModal}
                onRequestClose={() => {
                  setExpElementModal(!ExpElementModal);
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
                        }}
                      >
                        {editExp ? ' Edit' : 'Add More'} Experience
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
                          setExpElementModal(false);
                          setPracticeAt('');
                          setStartExpDate('');
                          setEndExpDate('');
                          setcheckPresent(false);
                          setexpPhotoPath(0);
                        }}
                      />
                    </View>
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
                            <Checkbox
                              shadow={1}
                              borderWidth={0}
                              marginTop={3}
                              isChecked={checkPresent}
                              onChange={async () => {
                                setcheckPresent(!checkPresent);
                                await calculateExpPresent();
                              }}
                              _checked={{ bg: '#2b8ada' }}
                            >
                              <Text style={{ fontSize: 10 }}>Present (Current)</Text>
                            </Checkbox>
                          </View>
                        </View>
                        <Text style={styles.inputLabel}>Experience Certificate</Text>
                        {expPhotoPath !== 0 ? (
                          <Image
                            source={{
                              uri: `${apiConfig.baseUrl}/file/download?fileToken=${expPhotoPath}&userId=${doctorId}`,
                            }}
                            style={{
                              resizeMode: 'cover',
                              width: '100%',
                              height: 180,
                            }}
                          />
                        ) : null}
                        <CustomButton
                          text={expPhotoPath === 0 ? 'Select Photo' : ' ✓ Photo Selected'}
                          textstyle={{
                            color: expPhotoPath === 0 ? '#2b8ada' : '#21c47f',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                          style={{
                            marginTop: 5,
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 6,
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
                              // selectDocsIden();
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
                    </View>

                    <CustomButton
                      text="Update"
                      textstyle={{ color: 'white' }}
                      style={{
                        width: '95%',
                        backgroundColor: '#2B8ADA',
                        marginVertical: 5,
                        paddingVertical: 5,
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        if (practiceAt === '')
                          Alert.alert(
                            'Incomplete Details!',
                            'Please add Clinic/Hospital Practise Name'
                          );
                        else if (startExpDate === '')
                          Alert.alert('Incomplete Details!', 'Please Select Practise Start Date');
                        else if (endExpDate === '' && checkPresent === false)
                          Alert.alert('Incomplete Details!', 'Please Select Practise End Date');
                        else if (expPhotoPath === 0)
                          Alert.alert(
                            'Incomplete Details!',
                            'Please upload experience certificate.'
                          );
                        else {
                          // calculateExp

                          const p = {
                            doctorId: Number(doctorId),
                            endDate: endExpDate,
                            experienceInMonths: Number(experienceInMonths),
                            practiceAt,
                            startDate: startExpDate,
                            experiencePhoto: expPhotoPath,
                          };

                          if (editExp) p.experienceId = Number(experienceId);

                          updateExpDet(p);
                          setPracticeAt('');
                          setStartExpDate('');
                          setEndExpDate('');
                          setExperienceInMonths('');
                          setTotalYear('');
                          setTotalMonths('');
                          setShowExpDet(false);
                          setexpPhotoPath(0);
                          setExpElementModal(false);
                        }
                      }}
                    />
                  </View>
                </View>
              </Modal>
            ) : null}
            {IdenElementModal ? (
              <Modal
                animationType="slide"
                transparent
                visible={IdenElementModal}
                onRequestClose={() => {
                  setIdenElementModal(!IdenElementModal);
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
                        }}
                      >
                        {editIden ? ' Edit' : 'Add More'} Identification
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
                          setidentificationPath(null);
                          setidentificationType('');
                          setidentificationNumber('');
                          setIdenElementModal(false);
                        }}
                      />
                    </View>
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
                        <CustomButton
                          text={identificationPath == null ? 'Select Document' : ' ✓ File Selected'}
                          textstyle={{
                            color: identificationPath == null ? '#2b8ada' : '#21c47f',
                            fontSize: 12,
                          }}
                          style={{
                            marginTop: 5,
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 6,
                            paddingHorizontal: 10,
                            borderWidth: 2,
                            borderColor: identificationPath == null ? '#2b8ada' : '#21c47f',
                          }}
                          onPress={() => {
                            if (identificationType === '')
                              Alert.alert(
                                'Incomplete Details',
                                'Please select Document Name then Select File.'
                              );
                            else selectDocsIden();
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
                          Note:-{'\n'} Upload document in pdf format of max size 2MB.
                        </Text>
                      </View>
                    </View>

                    <CustomButton
                      text="Update"
                      textstyle={{ color: 'white' }}
                      style={{
                        width: '95%',
                        backgroundColor: '#2B8ADA',
                        marginVertical: 15,
                        paddingVertical: 5,
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        if (
                          identificationNumber !== '' &&
                          identificationType !== '' &&
                          identificationPath != null
                        ) {
                          let flag = 1;
                          if (IdentificationDocs.length > 0 && editIden === false) {
                            for (let i = 0; i < IdentificationDocs.length; i += 1) {
                              if (IdentificationDocs[i].identificationType === identificationType) {
                                flag = 0;
                                break;
                              }
                            }
                            if (flag === 0) {
                              Alert.alert(
                                'Duplicate Records',
                                'You can not add duplicate documents'
                              );
                              setidentificationNumber('');
                              setidentificationType('');
                            }
                          }
                          if (flag === 1) {
                            const p = {
                              doctorId,
                              identificationNumber,
                              identificationPath,
                              identificationType,
                            };

                            if (editIden) p.doctorIdentificationPkId = doctorIdentificationPkId;

                            updateIden(p);
                            setidentificationNumber('');
                            setidentificationPath(null);
                            setidentificationType('');
                            setIdenElementModal(false);
                            setShowIdenDet(false);
                          }
                        } else if (identificationNumber === '')
                          Alert.alert('Incomplete Details!', 'Please fill Identification Number');
                        else if (identificationType === '')
                          Alert.alert('Incomplete Details!', 'Please Select Document Name');
                        else if (identificationPath == null)
                          Alert.alert(
                            'Incomplete Details!',
                            'Please Select Identification Document from your device'
                          );
                        else updateIden();
                      }}
                    />
                  </View>
                </View>
              </Modal>
            ) : null}
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
                        <Pdf
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
                        />
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
                            <FAIcon
                              name="minus-circle"
                              size={20}
                              color="gray"
                              onPress={onZoomOut}
                            />
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
                            await RNFS.copyFile(
                              docPath,
                              `file://${RNFS.DownloadDirectoryPath}/${fileName}`
                            );
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
                Loading...
              </Text>
            </View>
          </View>
        )}
        {isFetching && (
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
                source={downloading}
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
                We are fetching details
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
                source={upload}
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
                We are upating your details
              </Text>
            </View>
          </View>
        )}
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
    backgroundColor: '#2B8ADA',
  },
  textInput: {
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
  cellText: { textAlign: 'center', fontSize: 10, marginVertical: 3 },
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
    fontSize: 10,
    marginVertical: 3,
    color: 'white',
  },
  ButtonView: {
    alignContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
  },
  ButtonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 12,
  },
  ButtonTextCancel: {
    color: '#2b8ada',
    alignSelf: 'center',
    fontSize: 12,
  },
  ButtonUpdate: {
    backgroundColor: '#2b8ada',
    borderRadius: 5,
    padding: 6,
    paddingHorizontal: 10,
    flex: 0.45,
    marginRight: '5%',
  },
  ButtonCancel: {
    borderWidth: 1,
    borderColor: '#2b8ada',
    borderRadius: 5,
    padding: 6,
    paddingHorizontal: 10,
    flex: 0.45,
  },
});
