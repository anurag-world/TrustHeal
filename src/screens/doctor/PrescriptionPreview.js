import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  ScrollView,
  Alert,
  View,
  Text,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pdf from 'react-native-pdf';

// import { printToFileAsync } from "expo-print";
// import { shareAsync } from "expo-sharing";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS, { stat } from 'react-native-fs';

// icons
import dayjs from 'dayjs';
import waiting from '../../../assets/animations/waiting1.gif';
import apiConfig, { fileUpload } from '../../components/API/apiConfig';
import upload from '../../../assets/animations/upload.gif';

import CustomButton from '../../components/CustomButton';

function PrescriptionPreview({ navigation }) {
  const [Bp, setBp] = useState('');
  const [showPdf, setshowPdf] = useState(false);
  const [filePdf, setfilePdf] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [cheifComplaints, setcheifComplaints] = useState(null);
  const [cheifComplaintsDisplay, setcheifComplaintsDisplay] = useState(null);
  const [Examination, setExamination] = useState(null);
  const [Diagnosis, setDiagnosis] = useState(null);
  const [Prescription, setPrescription] = useState(null);
  const [Investigation, setInvestigation] = useState(null);
  const [Advice, setAdvice] = useState(null);
  const [FollowUpDate, setFollowUpDate] = useState(null);
  const [doctorId, setdoctorId] = useState(null);
  const [doctorName, setdoctorName] = useState(null);
  const [doctorEducationRaw, setdoctorEducationRaw] = useState([]);
  const [doctorEducationDisp, setdoctorEducationDisp] = useState(null);
  const [clinicId, setclinicId] = useState(null);
  const [clinicName, setclinicName] = useState('');
  const [clinicAddress, setclinicAddress] = useState('');
  const [patientName, setpatientName] = useState('');
  const [referredByDoctor, setreferredByDoctor] = useState('');
  const [consultationId, setconsultationId] = useState(null);
  const [consultationType, setconsultationType] = useState(null);
  const [patientID, setpatientID] = useState('');
  const [patientNumber, setpatientNumber] = useState('');
  const [prescriptionPath, setprescriptionPath] = useState(null);
  const [patientObj, setpatientObj] = useState([]);
  const [patientAge, setpatientAge] = useState('');
  const [isUploading, setisUploading] = useState(false);
  const [doctorFlag, setDoctorFlag] = useState(false);
  const [medReg, setmedReg] = useState(null);
  const [medCouncil, setmedCouncil] = useState(null);

  // const imageURL = 'https://jsplquality.jindalsteel.com/arogyaImage/';
  const imageURL = 'http://trustheal.in/';

  useEffect(() => {
    const loadData = async () => {
      const a = JSON.parse(await AsyncStorage.getItem('CheifComplaint'));
      const b = JSON.parse(await AsyncStorage.getItem('Examination'));
      const c = JSON.parse(await AsyncStorage.getItem('Prescription'));
      const d = JSON.parse(await AsyncStorage.getItem('Investigation'));
      const e = JSON.parse(await AsyncStorage.getItem('Advice'));
      const f = JSON.parse(await AsyncStorage.getItem('FollowUpDate'));
      const g = await AsyncStorage.getItem('Diagnosis');
      const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
      const h = JSON.parse(await AsyncStorage.getItem('PrescriptionFor'));
      // console.log('=============Patient obj===============');

      // console.log(h);
      if (h != null) {
        setpatientObj(h);
        setclinicName(h.clinicName);
        setclinicId(h.clinicId);
        setclinicAddress(h.clinicAddress);
        setpatientID(h.patientId);
        // setpatientNumber(h.patientNo);
        setconsultationId(h.consultationId);
        setconsultationType(h.consultationType);
        setpatientName(h.patientDet.patientName);
        setreferredByDoctor(h.referredByDoctor);
        setpatientAge(h.patientDet.age);
        console.log(
          '\n\n========================Patient Details========================\n\n',
          h.patientDet
        );
      }
      // setting cheifcomplaint
      if (a != null) {
        setcheifComplaints(a);
        let y = '';
        for (var i = 0; i < a.length; ++i) y += `${a[i].comp},`;
        y = y.substring(0, y.length - 1);
        setcheifComplaintsDisplay(y);
      }

      // setting examination details
      if (b != null) {
        const tempb = ` 
           <p class="mb-0 complaints"><b>Vitals:-  </b></p>
          <div style="display: flex;width:90%;margin-top:5px;margin-bottom:5px" >
                    <div  style="flex:30%">
                        <p class="p-nme mb-0"><b>Pulse - </b>${b.pulse} bpm</p>
                    </div>
                     <div  style="flex:30%">
                        <p class="p-nme mb-0"><b>Temperature - </b>${b.temperature} F</p>
                    </div>
                    <div  style="flex:30%">
                        <p class="p-nme mb-0"  ><b>BP- </b>${b.BPSystolic}/${b.BPDiastolic} mmHg</p>
                    </div>
                    
                </div>

                <p class="mb-0 complaints"><b>Examination Notes :-  </b>${b.examinationNotes}</p>`;
        setExamination(tempb);
      }

      // setting prescription
      if (c != null) {
        let z = ``;
        for (var i = 0; i < c.length; ++i) {
          z += ` <tr>
                                    <td>${i + 1}</td>
                                    <td><p class="mb-0"><b>${c[i].medicineName} (<i>${
            c[i].medicineType
          })</i></b></p>
                                    </td>
                                    <td><p class="mb-0">${c[i].instruction} for ${
            c[i].days
          } day(s)</p></td>
                                </tr>`;
        }
        setPrescription(z);
      }

      // setting investigation
      if (d != null) {
        let tempd = '';
        for (var i = 0; i < d.length; ++i) tempd += `${d[i].inv},`;
        tempd = tempd.substring(0, tempd.length - 1);
        setInvestigation(tempd);
      }

      // setting Advice
      if (e != null) {
        let tempAd = '';
        for (var i = 0; i < e.length; ++i) {
          tempAd += `${e[i].advice.substring(0, e[i].advice.length)},`;
        }

        setAdvice(tempAd.substring(0, tempAd.length - 1));
      }
      // setting follow up date
      setFollowUpDate(f != null ? f : null);
      // setting diagnosis
      setDiagnosis(g != null ? g.substring(1, g.length - 1) : null);
      setdoctorId(x.doctorId);
      setdoctorName(x.doctorName != null ? x.doctorName : x.fullName);

      // medical registration number
      await axios
        .get(`${apiConfig.baseUrl}/doctor/medicalregistrations?doctorId=${x.doctorId}`)
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            setmedReg(response.data[0].registrationNo);
            setmedCouncil(response.data[0].registrationCouncil);
          }
        })
        .catch((error) => {
          Alert.alert('Error', 'Sorry an error occurred');
        });
      // education
      await axios
        .get(`${apiConfig.baseUrl}/doctor/educations?doctorId=${x.doctorId}`)
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            // setdoctorEducationRaw(response.data);
            let x1 = ``;
            for (let i = 0; i < response.data.length; ++i) {
              x1 = `${x1}<p class="dr-designation">${response.data[i].degree.toUpperCase()} ${
                response.data[i].specialization
              }</p>`;
            }
            // console.log('==========Doctor education display===============');
            setdoctorEducationDisp(x1);
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          console.log(
            '===============Error in fetching doctor education================================='
          );
          console.log(error);
        });

      // console.log(doctorName);
    };
    loadData();
  }, []);

  const requestFilePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'File Permission',
          message: 'App needs access to your file manager ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await stackOverflowPDF();
      } else {
        Alert.alert('Alert', 'Can not create prescription without file permission');
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <title>Prescription Modify</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<style>
.entire-webpage{
        zoom: 1.5;
        //font-family:"Garamond";
       // transform: scale(2); /* Standard Property */
        //transform-origin: 0 0;  /* Standard Property */
    }
body {
  justify-content:center;
   // add prefixed versions too.
}

.container{
  margin: 0 auto;
}

img{
    object-fit: cover;
}
.px-logo{
    width: auto;
    height: 100px;
}
.prescription{
   //background:url( "https://images.template.net/128512/professional-letter-background-4pabv.jpg");
    background-attachment: scroll;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    padding: 0.5rem;
    background-color: #fff;
    padding-bottom: 3.5rem;
    align-self:center;
}
.dr-nme{
    line-height: 20px;
    font-family: Scandia;
    font-style: normal;
    font-weight: bold;
    font-size: 10px;
    color: rgba(0,0,0,1);
}
.dr-designation{
    font-family: Scandia;
    font-style: normal;
    font-weight: 500;
    font-size: 6px;
    color: rgba(0,0,0,0.5);
    padding:0;
    margin:0;
    line-height:1;
}
.dr-address, .dr-mobile, .p-id, .date{
    line-height: 14px;
    font-family: Scandia;
    font-style: normal;
    font-weight: 500;
    font-size: 4.5px;
    color: rgba(0,0,0,0.75);
    text-align: right;
    margin-bottom: 0;
}
.p-nme, .p-ag{
    line-height: 14px;
    font-family: Scandia;
    font-style: normal;
    font-weight: 500;
    font-size: 6.5px;
    color: rgba(0,0,0,0.75);
}
.complaints{
    line-height: 15px;
    font-family: Scandia;
    font-style: normal;
    font-size: 10px;
    color: rgba(0,0,0,0.75);
    padding: 1px;
}
.temp-bp, .examin{
    line-height: 18px;
    font-family: Scandia;
    font-style: normal;
    font-size: 5px;
    justify-content: space-evenly;
    color: rgba(0,0,0,0.5);
}
 .center {
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

}
.rx{
    width: 18px;
    height: 13px;
   
    
}
table, th, td {
    border: 1px solid rgba(182,182,182,1);
    border-collapse: collapse;
    line-height: 20px;
    font-size:6px;
    background: #fff;
    padding: 0 15px 0;
}
th{
    background: rgba(43,144,220,1);
    color: #fff;
    font-weight: 400;
    text-align: center;
}
// @media only screen and (min-width: 320px) and (max-width: 480px){
//     .col-sm-6{
        
//         justify-content:center;
//     }
    
// }
</style>

<body class="entire-webpage"  >

    <div class="container" >
        <div class="row mx-auto justify-content-center" >
            <div class="col-md-12 prescription" >
               
                <div style="display: flex;width:100%;align-self:center;margin-top:15px">
                 <div  style="flex:10%;">
                    <img  src="https://cdn-icons-png.flaticon.com/512/204/204225.png" style="width:65px;height:65px;padding:5px" alt=""></img>
                 </div>    
                <div  style="flex:40%;padding:10px;">
                        <h2 class="dr-nme mb-0"><b>${doctorName}</b></h2>
                   <div style="flex-direction:column">     ${doctorEducationDisp}</div>${
    clinicName != ''
      ? `<p class="p-ag" style="font-weight: 500;font-size: 6px;">${clinicName} | ${clinicAddress}</p>`
      : ''
  }
                    </div>
                    <div   style="flex:50%;align-items: flex-end;">
                        <p class="p-ag" style="text-align:right;"><b>MRN: ${medReg}</b></p>
                        
                    </div>
                </div>
                
                <div style="display: flex;flex-direction:row;width:100%;margin-top:10px;border-top: 1.5px solid black;border-bottom: 1.5px solid black;padding-top:5px;padding-bottom:5px;align-items:center">
                    <div style="display:flex;flex-direction:column; flex:50%">
                        <p class="p-nme mb-0" style="text-align:left"><b>${patientName}</b></p>${
    patientAge != undefined && patientAge != 0
      ? `<p class="p-nme mb-0" style="text-align:left"><b>Age : </b>${patientAge} Years</p>`
      : ``
  }
                        
                    </div>
                    <div style="display:flex;flex-direction:column; flex:50%">
                        <p class="p-nme mb-0" style="text-align:right">${dayjs(new Date()).format(
                          'DD MMM, YYYY hh:mm A'
                        )}</p>
                        <p class="p-nme mb-0" style="text-align:right">Patient ID : TH-000${patientID}</p>
                    </div>
                </div>
                <p class="mb-0 complaints" style="margin-top:5px"><b>Chief Complaints :-  </b>${cheifComplaintsDisplay}</p>
               ${Examination}
                <p class="mb-1 complaints"><b>Diagnosis :-  </b>${Diagnosis}</p>
    <div class="center">
                <img src="https://static.vecteezy.com/system/resources/previews/009/012/556/original/medical-symbol-rx-signage-template-free-vector.jpg" alt="rx" class="rx">
    </div>
                <div class="row align-items-center" style="margin-top:2px;">
                    <div class="col-md-12">
                        <table style="width: 100%;">
                            <thead>
                                <tr>
                                    <th width="10%" style="text-align:left">S.No</th>
                                    <th width="40%" style="text-align:left">Medicine Name</th>
                                    <th width="50%" style="text-align:left">Regime and Instruction</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Prescription}
                            </tbody>                            
                        </table>
                    </div>
                </div>
                <h2 class="mb-1 complaints" style="margin-top:5px" ><b>Investigation :-  </b>${Investigation}</h2>
     <h2 class="mb-1 complaints" ><b>Advice :-  </b>${Advice}</h2>
              <p class="mb-1 complaints" ><b>Follow-Up Date :-   </b>${dayjs(FollowUpDate).format(
                'DD MMM, YYYY'
              )}</p>
    <p class="mb-1 complaints" style="text-align:right"><b>${doctorName}</b></p>
 
                </div>
        </div>
    </div>
    
</body>
<div style="margin-top:50px;padding:2px;display: flex;flex-direction:column;columnborder-bottom-width: thin;border-bottom-style: solid;">
<p class="mb-1 complaints"  style="font-size:5px; text-align:center;"><b>Disclaimer: </b>The prescription is based on the information provided by you in an online consultation. No physical examination was done. The prescription cannot be used for medico legal purposes and is valid for 6 months from the date of issue.</p>
<p class="mb-1 complaints"  style="font-size:5px; text-align:center;"><b>Powered by TrustHeal Tech Private Limited</b></p>
</div>            

</html>`;

  useEffect(() => {
    if (
      cheifComplaints != null &&
      Diagnosis != null &&
      Prescription != null &&
      Advice != null &&
      FollowUpDate != null &&
      doctorName != null &&
      doctorEducationDisp != null
    ) {
      // stackOverflowPDF();
      if (Platform.OS === 'android') requestFilePermission();
    }
  }, [
    cheifComplaints,
    Diagnosis,
    Prescription,
    Advice,
    FollowUpDate,
    doctorName,
    doctorEducationDisp,
  ]);

  // pdf  generator
  let stackOverflowPDF = async () => {
    setisLoading(true);
    const options = {
      html,
      fileName: `${patientNumber}_prescription_${dayjs().format('YYYYMMDDHHmmss')}`,
      directory: 'docs',
    };

    const file = await RNHTMLtoPDF.convert(options);
    const destinationPath = RNFS.CachesDirectoryPath;
    console.log('\n\n++++++   DEstination Path   ++++\n', destinationPath);
    const FileName = file.filePath.split('/').pop();
    file.name = FileName;
    const destinationFile = `${destinationPath}/${FileName}`;
    // file.uri = destinationFile;
    file.uri = `file://${destinationFile}`;

    await RNFS.copyFile(file.filePath, destinationFile)
      .then(() =>
        // Delete a file on the project path using RNFS.unlink
        RNFS.unlink(file.filePath)
          .then(() => {
            console.log('FILE DELETED');
          })
          // `unlink` will throw an error, if the item to unlink does not exist
          .catch((err) => {
            console.log(err.message);
          })
      )
      .catch((err) => {
        console.log('err', err);
      });
    console.log('\n\n=============== FILE CREATED ======================\n\n', file);
    setfilePdf(file);
    setshowPdf(true);
    setisLoading(false);
    Alert.alert('Done', 'Prescription file has been created!');
  };

  const uploadPres = async () => {
    try {
      setisUploading(true);
      const statResult = await stat(filePdf.uri);

      console.log('==================statResult=================');

      console.log(statResult);

      filePdf.uri = statResult.path;
      filePdf.size = statResult.size;
      filePdf.type = 'application/pdf';

      console.log('\n\n==============File PDF inside upload====================\n\n');
      console.log(filePdf);

      // let x = {
      //   name: 'testing.pdf',
      //   size: 111384,
      //   type: 'application/pdf',
      //   uri: 'content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2F7_prescription_20230118173248.pdf',
      // };

      const formData = new FormData();
      formData.append('directoryNames', 'PATIENT_PRESCRIPTION');
      formData.append('file', filePdf);
      formData.append('userId', doctorId);
      const { error, response } = await fileUpload(formData);

      if (error != null) {
        console.log('======error======');
        console.log(error);
        Alert.alert('Error', 'There was a problem in selecting document. Please try again.');
      } else {
        console.log('======response of prescription preview======');
        console.log(response);
        if (response != undefined) {
          setprescriptionPath(response.fileToken);
          completeConsultationStatusUpdate(response.fileToken);
          // Alert.alert(
          //   'Success',
          //   'Prescription has been uploaded successfully!',
          // );
        }
      }
    } catch (e) {
      setisUploading(false);
      console.log('Uploading error', e);
      Alert.alert('Error', `File Uploading Error.\n ${e}`);
    }
  };

  const completeConsultationStatusUpdate = async (path) => {
    // console.log(FollowUpDate);

    const p = {
      consultationId,
      consultationTypes: consultationType,
      doctorId,
      followUpDate: dayjs(FollowUpDate).format('YYYY-MM-DD'),
      patientId: patientID,
      patientName,
      prescription: path,
      referredByDoctor,
    };
    if (clinicId != null && clinicId != 0) p.clinicId = clinicId;

    console.log(p);
    axios
      .post(`${apiConfig.baseUrl}/doctor/consultation/status/complete`, p)
      .then(async (response) => {
        setisUploading(false);
        console.log(response.status);
        if (response.status == 200) {
          Alert.alert('Success', `Your Consultation with ${patientName} has been completed.`);
          navigation.navigate('DoctorHome', {
            doctorObj: JSON.stringify(await AsyncStorage.getItem('UserDoctorProfile')),
          });
        }
      })
      .catch((error) => {
        setisUploading(false);
        Alert.alert(
          'Status Update Error',
          `Error occured in updating status of completion.${error}`
        );
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
        >
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 18,
              color: 'white',
              padding: 10,
              backgroundColor: 'black',
              width: '100%',
            }}
          >
            PRESCRIPTION PREVIEW
          </Text>

          {/* <CustomButton text="Show Cache Keys" onPress={show} /> */}

          {showPdf ? (
            <View>
              <Pdf
                source={{ uri: filePdf.uri }}
                style={{
                  backgroundColor: '#e8f0fe',
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height - 300,
                  marginVertical: 20,
                }}
              />
              {/* <Text
                style={{
                  flex: 1,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                File Name:- {filePdf.name}
              </Text> */}
            </View>
          ) : null}

          <View
            style={{
              marginTop: 10,
              alignSelf: 'center',
              flexDirection: 'column',
              flex: 1,
              width: '90%',
            }}
          >
            {/* <CustomButton
              text="Re-Generate"
              textstyle={{color: 'white', fontSize: 12, fontWeight: 'bold'}}
              style={{
                borderRadius: 10,
                backgroundColor: '#2B8ADA',
                flex: 1,
              }}
              onPress={() => {
                // generatePdf();
                //createPDF();
                stackOverflowPDF();
              }}
            /> */}

            <CustomButton
              text="Upload Prescription"
              textstyle={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}
              style={{
                borderRadius: 10,
                backgroundColor: '#17CC9C',
                flex: 1,
                marginVertical: 10,
              }}
              onPress={async () => {
                // console.log(
                //   await stat(filePdf.filePath).then(function (response) {
                //     console.log(response);
                //   }),
                // );
                // await onPressUpload();

                await uploadPres();
                // console.log(FollowUpDate);
                // console.log(dayjs(FollowUpDate).format('YYYY-MM-DD'));
              }}
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
                Creating Prescription...
              </Text>
            </View>
          </View>
        )}
        {isUploading == true && (
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
                Uploading
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
                We are uploading prescription
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
});

export default PrescriptionPreview;
