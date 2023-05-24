import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function logoutAction(navigation) {
  await AsyncStorage.multiRemove(await AsyncStorage.getAllKeys());
  console.log(await AsyncStorage.getAllKeys());

  navigation.navigate('LoginScreen');
}
