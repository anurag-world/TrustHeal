/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
// import AgoraUIKit from 'agora-rn-uikit';
import axios from 'axios';
// import { ClientRoleType, createAgoraRtcEngine, ChannelProfileType } from 'react-native-agora';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiConfig from '../../components/API/apiConfig';

export default function CallAgora() {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    // consultationType,
    callID,
    doctorId,
    patientId,
    patientName,
    slotId,
    userName,
    userType,
    // userID,
  } = route.params;
  const agoraEngineRef = useRef(); // Agora engine instance
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]);
    }
  };

  /*  const setupVoiceSDKEngine = async () => {
    try {
      // use the helper function to get permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          // showMessage('Successfully joined the channel ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          // showMessage('Remote user joined with uid ' + Uid);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          // showMessage('Remote user left the channel. uid: ' + Uid);
          setRemoteUid(0);
        },
      });
      agoraEngine.initialize({
        appId: apiConfig.AgoraAppId,
      });
    } catch (e) {
      console.log(e);
    }
  }; */

  /* const join = async () => {
    if (isJoined) {
      return;
    }
    try {
      agoraEngineRef.current?.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  }; */

  /* const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      // showMessage('You left the channel');
    } catch (e) {
      console.log(e);
    }
  }; */

  // video call
  const rtcCallback = {
    EndCall: async () => {
      if (userType === 'Doctor') {
        await statusUpdateDoctorDisconnect();
        Alert.alert('Consultation Status', 'Do you want to end consultation with patient?', [
          {
            text: 'Yes',
            onPress: async () => {
              await axios
                .post(
                  `${apiConfig.baseUrl}/doctor/consultation/status/pending?consultationId=${callID}`
                )
                .then((response) => {
                  if (response.status === 200) {
                    Alert.alert(
                      'Consultation Ended',
                      `Your consultation with patient has ended.\nPlease make sure to create prescription for the patient.`
                    );
                  }
                });
            },
          },
          {
            text: 'No',
          },
        ]);
      } else {
        await statusUpdatePatientDisconnect();
      }
      navigation.goBack();
    },
    joinChannel: async () => {
      if (userType === 'Doctor') await statusUpdateDoctor();
      else if (userType === 'Patient') await statusUpdatePatient();
    },
  };

  /* const statusUpdateDoctor = async () => {
    Alert.alert('Start', 'Consultation Started');
    let p = {
      consultationId: callID,
      doctorId: doctorId,
      patientId: patientId,
      patientName: patientName,
      slotId: slotId,
    };
    axios
      .post(
        apiConfig.baseUrl +
          '/doctor/consultation/join?consultationId=' +
          callID,
      )
      .then(response => {
        if (response.status == 200)
          console.log('\n\n\nMeeting going on status updated doctor\n\n\n');
      })
      .catch(response => {
        console.log(response);
      });
  };
  const statusUpdatePatient = async () => {
    Alert.alert('Start', 'Consultation Started');
    axios
      .post(
        apiConfig.baseUrl +
          '/patient/consultation/join?consultationId=' +
          callID,
      )
      .then(response => {
        if (response.status == 200)
          console.log('\n\n\nMeeting going on status updated patient\n\n\n');
      })
      .catch(response => {
        console.log(response);
      });
  }; */

  const statusUpdatePatientDisconnect = async () => {
    axios
      .post(`${apiConfig.baseUrl}/patient/consultation/disconnect?consultationId=${callID}`)
      .then((response) => {
        if (response.status === 200)
          console.log('Meeting going on status updated patient disconnected');
      })
      .catch((response) => {
        console.log(response);
      });
  };

  const statusUpdateDoctorDisconnect = async () => {
    axios
      .post(`${apiConfig.baseUrl}/doctor/consultation/disconnect?consultationId=${callID}`)
      .then((response) => {
        if (response.status === 200)
          console.log('Meeting going on status updated doctor disconnected');
      })
      .catch((response) => {
        console.log(response);
      });
  };

  useEffect(() => {
    if (userType === 'Doctor') statusUpdateDoctor();
    else if (userType === 'Patient') statusUpdatePatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  const statusUpdateDoctor = async () => {
    Alert.alert('Consultation Started', 'You have successfully joined the consultation room.');
    const p = {
      consultationId: callID,
      doctorId,
      patientId,
      patientName,
      slotId,
    };
    // console.log(p);
    await axios
      .post(`${apiConfig.baseUrl}/doctor/consultation/join`, p)
      .then((response) => {
        if (response.status === 200)
          console.log('\n\n\nMeeting going on status updated doctor\n\n\n');
      })
      .catch((response) => {
        console.log(response);
      });
  };

  const statusUpdatePatient = async () => {
    Alert.alert('Consultation Started', 'You have successfully joined the consultation room.');
    const p = {
      consultationId: callID,
      doctorId,
      patientName,
      slotId,
    };
    // console.log(p);
    await axios
      .post(`${apiConfig.baseUrl}/patient/consultation/join`, p)
      .then((response) => {
        if (response.status === 200)
          console.log('\n\n\nMeeting going on status updated patient\n\n\n');
      })
      .catch((response) => {
        console.log(response);
      });
  };

  return {
    /* <AgoraUIKit
      connectionData={{
        appId: apiConfig.AgoraAppId,
        channel: callID,
        username: userName,
      }}
      rtcCallbacks={rtcCallback}
      settings={{
        displayUsername: true,
      }}
    /> */
  };
}
