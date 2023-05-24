import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Alert,
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import HeaderPatient from '../../components/HeaderPatient';
import apiConfig from '../../components/API/apiConfig';

export default function Support() {
  // const [HelpModal, setHelpModal] = useState(true);
  const [dataFaq, setdataFaq] = useState(null);

  const isFocused = useIsFocused();

  const getFaq = async () => {
    await axios
      .get(`${apiConfig.baseUrl}/suggest/faq?role=ROLE_PATIENT`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setdataFaq(response.data);
        }
      })
      .catch((error) => {
        Alert.alert('Error', `${error}`);
      });
  };

  useEffect(() => {
    if (isFocused != null) {
      // Update the state you want to be updated
      // getUpcomingData();
      // getCompletedData();
      // getPendingData();
      // getRecentData();
      getFaq();
    }
  }, [isFocused]);

  const renderFAQ = ({ item, index }) => (
    <View key={item.faqId}>
      <View style={[styles.WhiteLabel, styles.BlueLabel]}>
        <Text
          style={[
            {
              fontWeight: 'bold',
              fontSize: 14,
              color: 'white',
            },
          ]}
        >
          {index + 1}
          {'. '}
          {item.question}
        </Text>
      </View>
      <View style={styles.BlueLabelUnderText}>
        <Text
          style={{
            fontSize: 12,
            padding: 5,
            textAlign: 'justify',
            color: 'black',
          }}
        >
          {item.answers}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // style={styles.container}
      enabled
    >
      <SafeAreaView
        style={{
          width: '100%',
        }}
      >
        <StatusBar animated backgroundColor="#2B8ADA" />
        <HeaderPatient title="FAQ" showMenu={false} />
        <View style={{ backgroundColor: '#e8f0fe', height: '100%' }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}
          >
            {/* <View style={styles.searchBar}>
              <TextInput placeholder="Search Question" />
              <FAIcon
                name="search"
                size={15}
                color="gray"
                style={styles.searchIcon}
              />
            </View> */}
            <Text style={{ color: 'black', marginVertical: 10 }}>Frequently Asked Questions</Text>
            <ScrollView
              style={{
                // height: 300,
                width: '100%',
                flexDirection: 'column',
              }}
            >
              {dataFaq != null ? (
                <FlatList
                  data={dataFaq}
                  renderItem={renderFAQ}
                  key={(item) => item.faqId}
                  style={{ marginBottom: 200 }}
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
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
  BlueLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    backgroundColor: '#2B8ADA',
  },
  BlueLabelUnderText: {
    marginTop: -6,
    padding: 10,
    borderTopWidth: 0,
    width: '95%',
    alignSelf: 'center',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  searchBar: {
    // flex: 1,
    height: 50,
    width: '95%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#2B8ADA',
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    marginLeft: 5,
  },
  searchBarText: {
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 15,
  },
  ModalBackground: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalView: {
    borderRadius: 10,
    flex: 1,
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    borderTopRadius: 50,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
