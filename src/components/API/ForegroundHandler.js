import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

const ForegroundHandler = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      const { notification } = remoteMessage;
      console.log(remoteMessage);
      if (Platform.OS === 'android') {
        PushNotification.localNotification({
          channelId: '1',
          body: notification.body,
          title: notification.title,
          soundName: 'default',
          vibrate: true,
          playSound: true,
        });
      }
    });
    return unsubscribe;
  }, []);
};

export default ForegroundHandler;
