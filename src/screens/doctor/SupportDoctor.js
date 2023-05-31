/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  View,
  Modal,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  LogBox,
  StyleSheet,
  Platform,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import axios from 'axios';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import apiConfig, { fileUpload } from '../../components/API/apiConfig';
import waiting from '../../../assets/animations/waiting1.gif';
import HelpCancel from '../../../assets/HelpCancel.png';
import HelpDone from '../../../assets/HelpDone.png';
import HelpUnderProcess from '../../../assets/HelpUnderProcess.png';
import HelpUploaded from '../../../assets/HelpUploaded.png';
import upload from '../../../assets/animations/upload.gif';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
// yellow icon #FCC419
// red icon #E04F5F
export default function SupportDoctor() {
  const [doctorObj, setdoctorObj] = useState(null);
  const [doctorId, setdoctorId] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [isUploading, setisUploading] = useState(false);
  const [message, setmessage] = useState('');
  const [docList, setdocList] = useState([]);
  const [DocsUploaded, setDocsUploaded] = useState(false);
  const [type, setType] = useState(null);
  const [dataMainQuery, setdataMainQuery] = useState([]);
  const [FeedBackModal, setFeedBackModal] = useState(false);
  const [Rating, setRating] = useState(null);
  const [helpId, setHelpId] = useState(null);
  const [feedbackMsg, setfeedbackMsg] = useState('');

  const [addQuery, setaddQuery] = useState(false);
  const [viewQuery, setviewQuery] = useState(false);

  const [ImageViewer, setImageViewer] = useState(false);
  const [DisplayPhotoToken, setDisplayPhotoToken] = useState(0);

  useEffect(() => {
    const onLoadSetData = async () => {
      const x = JSON.parse(await AsyncStorage.getItem('UserDoctorProfile'));
      console.log('profile: ', x);
      setdoctorObj(x);
      setdoctorId(x.doctorId);
    };
    setisLoading(true);
    onLoadSetData();

    setisLoading(false);
  }, []);

  useEffect(() => {
    if (viewQuery) {
      getQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewQuery]);
  const getQuery = async () => {
    setisLoading(true);
    await axios
      .get(`${apiConfig.baseUrl}/doctor/help?doctorId=${doctorId}`)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setdataMainQuery(response.data);
          setisLoading(false);
        }
      })
      .catch((error) => {
        Alert.alert('Error', `${error}`);
      });
  };

  useEffect(() => {
    console.log('Doc List is\n\n');
    console.log(docList);
  }, [docList]);

  const chooseProfileImage = async () => {
    Alert.alert('Select Files', 'Select option for uploading files', [
      {
        text: 'Open Library',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            console.log(response);
            if (response.didCancel) console.log('Cancel');
            else if (response.errorCode) {
              Alert.alert('Error', response.errorMessage);
            } else if (response.assets[0].fileSize <= 5242880) {
              // await postpfp(response.assets[0]);
              // docList.push(response.assets[0]);
              // let temp = docList;
              setdocList([...docList, response.assets[0]]);
            } else Alert.alert('Max Size', 'The file exceeds the maximum limit of 5MB.');
          });
        },
      },
      // {
      //   text: 'Open Camera',
      //   onPress: () => {
      //     requestCameraPermission();
      //   },
      // },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const dropdownData = [
    { key: 'Technical', value: 'Technical' },
    { key: 'Slot Creation', value: 'Slot Creation' },
    { key: 'Patient Related', value: 'Patient Related' },
    { key: 'Feedback', value: 'Feedback' },
    { key: 'Payment', value: 'Payment' },
    { key: 'Other', value: 'Other' },
  ];

  const renderQuery = ({ item }) => (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        width: '95%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginVertical: 5,
        flexDirection: 'column',
      }}
      key={item.helpId}
    >
      <View
        style={{
          flex: 1,
          padding: 5,
          flexDirection: 'row',
        }}
      >
        {/* Image */}
        <View
          style={[
            {
              borderWidth: 3,
              borderRadius: 10,
              marginRight: 10,
            },
            item.complaintStatus === 'REGISTERED'
              ? { borderColor: '#2b8ada' }
              : item.complaintStatus === 'UNDER_PROCESS'
              ? { borderColor: '#FCC419' }
              : item.complaintStatus === 'COMPLETED'
              ? { borderColor: '#17CC9C' }
              : { borderColor: '#E04F5F' },
          ]}
        >
          <Image
            source={
              item.complaintStatus === 'REGISTERED'
                ? HelpUploaded
                : item.complaintStatus === 'UNDER_PROCESS'
                ? HelpUnderProcess
                : item.complaintStatus === 'COMPLETED'
                ? HelpDone
                : HelpCancel
            }
            style={{
              width: 50,
              height: 50,
              margin: 5,
              alignSelf: 'center',
            }}
          />
        </View>
        {/* Heading */}
        <View>
          <Text style={styles.ticketNumber}>Ticket #{item.helpId}</Text>
          <Text style={styles.dateTime}>
            {dayjs(item.registerDateTime).format('MMM DD, YYYY | HH:mm A')}
          </Text>
          <Text style={styles.underHeading}>{item.type}</Text>
        </View>
        {/* Side Note */}
        <View style={{ position: 'absolute', right: 0 }}>
          <Text
            style={[
              {
                borderRadius: 5,
                fontSize: 12,
                fontWeight: 'bold',
                padding: 5,
                borderWidth: 2,
                alignSelf: 'center',
                textAlign: 'center',
              },
              item.complaintStatus === 'REGISTERED'
                ? { borderColor: '#2b8ada', color: '#2b8ada' }
                : item.complaintStatus === 'UNDER_PROCESS'
                ? { borderColor: '#FCC419', color: '#FCC419' }
                : item.complaintStatus === 'COMPLETED'
                ? { borderColor: '#17CC9C', color: '#17CC9C' }
                : { borderColor: '#E04F5F', color: '#E04F5F' },
            ]}
          >
            {item.complaintStatus === 'REGISTERED'
              ? 'Submitted'
              : item.complaintStatus === 'UNDER_PROCESS'
              ? 'Under Process'
              : item.complaintStatus === 'COMPLETED'
              ? 'Completed'
              : 'Cancelled'}
          </Text>
        </View>
      </View>
      {/* Issue */}
      <View
        style={{
          flex: 1,
          padding: 5,
          flexDirection: 'row',
          alignSelf: 'center',
          width: '95%',
        }}
      >
        <Text style={{ color: 'black', textAlign: 'justify' }}>{item.message}</Text>
      </View>
      {/* Remarks */}
      {item.complaintStatus !== 'REGISTERED' ? (
        <View
          style={{
            flex: 1,
            padding: 5,
            flexDirection: 'column',
            alignSelf: 'center',
            width: '95%',
          }}
        >
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>Remark:-</Text>
          <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 12 }}>
            {dayjs(item.actionDateTime).format('MMM DD, YYYY | HH:mm A')}
          </Text>
          <Text style={{ color: 'black', textAlign: 'justify' }}>{item.remark}</Text>
        </View>
      ) : null}
      {/* Attatchments */}
      {item.files != null && item.files.length > 0 ? (
        <View
          style={{
            flex: 1,
            padding: 5,
            flexDirection: 'column',
            alignSelf: 'center',
            width: '95%',
          }}
        >
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>Attatchments :-</Text>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            {item.files.map((i, index) => (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#2b8ada',
                  padding: 5,
                  borderRadius: 10,
                  flexDirection: 'row',
                  marginRight: 10,
                }}
                onPress={() => {
                  setDisplayPhotoToken(i);
                  setImageViewer(true);
                }}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              >
                <FAIcon
                  name="file-image"
                  size={15}
                  color="#2b8ada"
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginRight: 5,
                  }}
                />
                <Text style={{ color: '#2b8ada', fontSize: 12 }}>Attatchment {index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}
      {item.complaintStatus !== 'REGISTERED' && item.isRated === false ? (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            padding: 5,
            justifyContent: 'space-evenly',
            marginTop: 5,
            alignSelf: 'flex-end',
            backgroundColor: '#2b8ada',
            borderRadius: 10,
            width: 100,
          }}
          onPress={() => {
            setFeedBackModal(true);
            setHelpId(item.helpId);
          }}
        >
          <FAIcon name="comment-alt" color="white" size={15} solid />
          <Text style={{ fontSize: 12, color: 'white' }}>Feedback</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderDocs = ({ item }) => (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: '#e8f0fe',
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
        <Text
          style={{
            fontSize: 12,
            marginBottom: 3,
            color: 'black',
            paddingHorizontal: 10,
          }}
        >
          {item.fileName}
        </Text>
      </View>
      {!DocsUploaded ? (
        <TouchableOpacity
          style={{ marginLeft: 5, flex: 0.1, justifyContent: 'center' }}
          onPress={() => {
            removeDocsHandler(item.fileName);
          }}
        >
          <FAIcon
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
  const removeDocsHandler = (i) => {
    setdocList(docList.filter((e) => i !== e.fileName));
  };

  const reset = () => {
    setType('');
    setmessage('');
    setdocList([]);
    setaddQuery(false);
  };
  const submitQuery = async () => {
    setisUploading(true);
    // upload pics
    const files = [];
    for (let i = 0; i < docList.length; i += 1) {
      try {
        console.log('==============Inside post pfp==========');
        // delete docList[i].fileName;
        docList[i].size = docList[i].fileSize;
        delete docList[i].fileSize;
        // docList[i].name = doctorId + '_ProfilePhoto' + ext;
        // console.log(docList[i].fileName);
        docList[i].name = docList[i].fileName;
        delete docList[i].fileName;

        const formData = new FormData();
        formData.append('directoryNames', 'DOCTOR_HELP_SUPPORT');
        formData.append('file', docList[i]);
        formData.append('userId', doctorId);
        console.log(formData);
        const { error, response } = fileUpload(formData);
        if (error != null) {
          console.log('======error======');
          console.log(error);
          Alert.alert('Error', 'There was a problem in uploading attatchments. Please try again.');
        } else {
          console.log('======response======');
          console.log(response.fileToken);
          if (response.fileToken !== undefined) files.push(response.fileToken);
        }
      } catch (e) {
        console.log(e);
      }
    }
    const queryJson = {
      doctorId,
      files,
      message,
      type,
    };
    console.log(queryJson);
    await axios
      .post(`${apiConfig.baseUrl}/doctor/help`, queryJson)
      .then((response) => {
        if (response.status === 200) {
          Alert.alert(
            'Success',
            'Your query has been submitted successfully and would be resolved within 24 hours.'
          );
          reset();
          setisUploading(false);
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'An error occured while submitting query.\n Please try again later.');
        console.log(error);
        reset();
        setisUploading(false);
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
            // marginTop: 30,
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar animated backgroundColor="#2B8ADA" />
          <Header title="Help & Support" showMenu={false} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              width: '95%',
              alignSelf: 'center',
            }}
          >
            <View style={{ flex: 1, alignSelf: 'center' }}>
              <Text
                style={{
                  textAlign: 'justify',
                  color: '#2B8ADA',
                  fontSize: 20,
                  fontWeight: 'bold',
                  borderBottomWidth: 2,
                  borderBottomColor: '#2B8ADA',
                  marginVertical: 20,
                }}
              >
                Help & Support
              </Text>
            </View>
            {/* View Query Label */}
            <TouchableOpacity style={[styles.WhiteLabel]} onPress={() => setviewQuery(!viewQuery)}>
              <FAIcon
                name="comment-dots"
                size={15}
                color={viewQuery ? '#2b8ada' : 'gray'}
                style={{ marginLeft: 3, alignSelf: 'center' }}
                solid
              />
              <Text
                style={[
                  styles.label,
                  { width: '80%' },
                  viewQuery ? { color: '#2B8ADA' } : { color: 'black' },
                ]}
              >
                Your Queries
              </Text>
              <FAIcon
                name={viewQuery ? 'chevron-down' : 'chevron-right'}
                size={20}
                style={[viewQuery ? { color: '#2B8ADA' } : { color: 'black' }]}
              />
            </TouchableOpacity>
            {viewQuery ? (
              <View>
                {dataMainQuery.length > 0 ? (
                  <FlatList
                    data={dataMainQuery}
                    renderItem={renderQuery}
                    keyExtractor={(item) => item.helpId}
                  />
                ) : (
                  <View style={{ alignSelf: 'center' }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: 'black',
                        fontSize: 13,
                      }}
                    >
                      No Query Submitted
                    </Text>
                  </View>
                )}
              </View>
            ) : null}

            {/* Add Query Label */}
            <TouchableOpacity style={[styles.WhiteLabel]} onPress={() => setaddQuery(!addQuery)}>
              <FAIcon
                name="comment-medical"
                size={15}
                color={addQuery ? '#2b8ada' : 'gray'}
                style={{ marginLeft: 3, alignSelf: 'center' }}
              />
              <Text
                style={[
                  styles.label,
                  { width: '80%' },
                  addQuery ? { color: '#2B8ADA' } : { color: 'black' },
                ]}
              >
                Add Query
              </Text>
              <FAIcon
                name={addQuery ? 'chevron-down' : 'chevron-right'}
                size={20}
                style={[addQuery ? { color: '#2B8ADA' } : { color: 'black' }]}
              />
            </TouchableOpacity>
            {addQuery ? (
              <View
                style={{
                  alignSelf: 'center',
                  width: '95%',
                  padding: 10,
                  paddingVertical: 25,
                  borderRadius: 10,
                  backgroundColor: 'white',
                  marginTop: 5,
                }}
              >
                {/* Sub-Heading */}
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={styles.parStyles}>
                    Drop your queries & feedback here.{'\n'}Your queries will be resolved within 24
                    hours.
                  </Text>
                </View>

                {/* Support Type */}
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={styles.inputLabel}>Select Query Type</Text>
                  <SelectList
                    placeholder=" "
                    setSelected={(val) => setType(val)}
                    data={dropdownData}
                    save="value"
                    boxStyles={{
                      backgroundColor: '#E8F0FE',
                      borderWidth: 0,
                      padding: 0,
                      borderRadius: 5,
                      color: 'black',
                    }}
                    dropdownStyles={{ backgroundColor: 'white' }}
                    dropdownTextStyles={{
                      color: '#2b8ada',
                      fontWeight: 'bold',
                    }}
                    badgeStyles={{ backgroundColor: '#2b8ada' }}
                  />
                </View>
                {/* Support Message */}
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={styles.inputLabel}>Type your concern here</Text>

                  <TextInput
                    style={{
                      backgroundColor: '#e8f0fe',
                      padding: 0,
                      paddingHorizontal: 10,
                      borderRadius: 5,
                      minHeight: 150,
                      textAlign: 'left',
                      color: 'black',
                    }}
                    onChangeText={(text) => setmessage(text)}
                    value={message}
                    multiline
                  />
                </View>
                {/* Attatchments */}
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={styles.inputLabel}>Attach screenshot if any</Text>

                  <View>
                    <FlatList
                      data={docList}
                      renderItem={renderDocs}
                      keyExtractor={(item) => item.fileName}
                      // style={{}}
                    />
                    <CustomButton
                      text="+ Add Image"
                      textstyle={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                      style={[
                        {
                          backgroundColor: '#2b8ada',
                          borderRadius: 5,
                          marginTop: 10,
                          padding: 10,
                        },
                        docList.length === 0 ? { flex: 1 } : { flex: 0.3, alignSelf: 'flex-end' },
                      ]}
                      onPress={() => {
                        if (docList.length < 2) chooseProfileImage();
                        else Alert.alert('File Limit', 'Maximum 2 images can be uploaded.');
                      }}
                    />
                  </View>
                </View>
                {/* Submit Button */}
                <View style={{ flex: 1, padding: 10 }}>
                  <CustomButton
                    text="Submit"
                    textstyle={{
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                    style={{
                      backgroundColor: '#17CC9C',
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={async () => {
                      await submitQuery();

                      // Alert.alert(
                      //   'Success',
                      //   'Your query has been submitted successfully and would be resolved within 24 hours.',
                      // );
                      // reset();
                    }}
                  />
                </View>
              </View>
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
                We are submitting your query
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
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
                {
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
                  borderRadius: 10,
                  height: 300,
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
                  Attatchment
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
      {FeedBackModal ? (
        <Modal
          animationType="slide"
          transparent
          visible={FeedBackModal}
          onRequestClose={() => {
            setFeedBackModal(!FeedBackModal);
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
                {
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
                  borderRadius: 10,
                  height: 300,
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
                  Feedback
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
                    // setImageViewer(false);
                    // setDisplayPhotoToken(0);
                    setFeedBackModal(false);
                    setRating(null);
                  }}
                />
              </View>
              {/* Satisfied */}
              <View style={{ width: '95%' }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    marginTop: 5,
                  }}
                >
                  Are you satisfied with the response?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '95%',
                    justifyContent: 'space-evenly',
                    marginTop: 3,
                  }}
                >
                  <CustomButton
                    text="Yes"
                    style={[
                      {
                        borderColor: '#2b8ada',
                        borderWidth: 2,
                        flex: 0.45,
                        padding: 5,
                        borderRadius: 10,
                      },
                      Rating ? { backgroundColor: '#2b8ada' } : null,
                    ]}
                    textstyle={[
                      { color: '#2b8ada', fontSize: 12 },
                      Rating ? { color: 'white' } : null,
                    ]}
                    onPress={() => {
                      setRating(true);
                    }}
                  />
                  <CustomButton
                    text="No"
                    style={[
                      {
                        borderColor: '#2b8ada',
                        borderWidth: 2,
                        flex: 0.45,
                        padding: 5,
                        borderRadius: 10,
                      },
                      Rating === false ? { backgroundColor: '#2b8ada' } : null,
                    ]}
                    textstyle={[
                      { color: '#2b8ada', fontSize: 12 },
                      Rating === false ? { color: 'white' } : null,
                    ]}
                    onPress={() => {
                      setRating(false);
                    }}
                  />
                </View>
              </View>
              {/* Feedback Message */}
              <View style={{ width: '95%', marginVertical: 5 }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  Feedback
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#e8f0fe',
                    padding: 5,
                    height: 100,
                    borderRadius: 10,
                  }}
                  onChangeText={(text) => setfeedbackMsg(text)}
                  value={feedbackMsg}
                  multiline
                />
              </View>
              <CustomButton
                text="Submit"
                textstyle={{ color: 'white', fontSize: 13 }}
                style={{
                  width: '95%',
                  backgroundColor: '#2b8ada',
                  borderRadius: 10,
                  marginVertical: 10,
                  padding: 5,
                  paddingHorizontal: 15,
                }}
                onPress={async () => {
                  console.log(`${apiConfig.baseUrl}/doctor/query/feedback`, {
                    feedback: feedbackMsg,
                    helpId,
                    isSatisfied: Rating,
                  });

                  await axios
                    .post(`${apiConfig.baseUrl}/doctor/query/feedback`, {
                      feedback: feedbackMsg,
                      helpId,
                      isSatisfied: Rating,
                    })
                    .then((response) => {
                      if (response.status === 200) {
                        Alert.alert(
                          'Feedback Submitted',
                          'Your feedback has been submitted successfully. \nThank You',
                          [
                            {
                              text: 'ok',
                              onPress: () => getQuery(),
                            },
                          ]
                        );
                        setfeedbackMsg('');
                        setRating(null);
                        setFeedBackModal(false);
                      }
                    })
                    .catch((error) => {
                      Alert.alert(
                        'Error',
                        'An error occured while submitting feedback.\nPlease try again later.'
                      );
                      setfeedbackMsg('');
                      setRating(null);
                      setFeedBackModal(false);
                      console.log(error);
                    });
                }}
              />
            </View>
          </View>
        </Modal>
      ) : null}
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
  parStyles: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 15,
    color: 'black',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#2b8ada',
  },
  WhiteLabel: {
    flexDirection: 'row',
    width: '95%',
    marginVertical: 5,
    alignSelf: 'center',
    backgroundColor: 'white',
    marginBottom: 5,
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  ticketNumber: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: 12,
    color: 'gray',
  },
  underHeading: {
    fontSize: 13,
    color: 'black',
    fontWeight: 'bold',
  },
});
