import React from 'react';
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import Header from '../components/HeaderPatient';

export default function TCRefund() {
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
            // marginTop: 30,
            backgroundColor: '#e8f0fe',
          }}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar animated backgroundColor="#2B8ADA" />
          <Header title="Refund & Cancellation Policy" showMenu={false} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              width: '95%',
              alignSelf: 'center',
            }}
          >
            <View style={{ alignSelf: 'center', width: '90%' }}>
              {/* Terms and Conditions for Refund and Cancellation */}
              <View style={{ flex: 1, alignSelf: 'center' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#2B8ADA',
                    fontSize: 20,
                    fontWeight: 'bold',
                    borderBottomWidth: 2,
                    borderBottomColor: '#2B8ADA',
                    marginVertical: 20,
                  }}
                >
                  Refund & Cancellation Policy
                </Text>
              </View>

              {/* 1.	Cancellations Policy:  */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  1. Cancellations Policy:
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    • If the patient cancels the teleconsultation appointment with at least 24 hours
                    advance written notice, the full amount paid by him / her will be refunded.
                  </Text>
                  <Text style={styles.parStyles}>
                    • If the patient cancels the appointment with less than 24 hours notice, no
                    refund will be provided.
                  </Text>
                  <Text style={styles.parStyles}>
                    • If the teleconsultation appointment is missed without any prior timely
                    cancellation, no refund will be provided.
                  </Text>
                </View>
              </View>
              {/* 2.	Refunds Policy:   */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  2. Refunds Policy:
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    • In the event that technical difficulties at our end prevent the
                    teleconsultation appointment from taking place, the full amount paid by the
                    patient will be refunded.
                  </Text>
                  <Text style={styles.parStyles}>
                    • If the teleconsultation appointment is unsatisfactory, the patient may send in
                    a reasoned written request for a partial or full refund, which will be reviewed
                    and may be granted on a case-by-case basis at our sole discretion.
                  </Text>
                </View>
              </View>
              {/* 3.	Acceptance of Terms and Conditions:  */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  3. Acceptance of Terms and Conditions:
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    • By using this teleconsultation service, you agree to the terms and conditions
                    outlined in this policy.
                  </Text>
                </View>
              </View>
              {/* 4.	Changes to Policy:   */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  4. Changes to Policy:
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    • We reserve the right to modify this policy at any time, and any changes will
                    be updated / posted on this page. By using the teleconsultation service after
                    any changes have been made, you agree to the updated policy.
                  </Text>
                </View>
              </View>
              {/* 5.	Contact Us:  */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  5. Contact Us:
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    • If you have any questions or concerns about this policy, please contact us at{' '}
                    <Text
                      style={{
                        color: 'blue',
                        textDecorationLine: 'underline',
                        textDecorationColor: 'blue',
                      }}
                    >
                      contact@trustheal.in
                    </Text>
                  </Text>
                </View>
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
  parStyles: {
    textAlign: 'left',
    fontSize: 13,
    marginVertical: 5,
    lineHeight: 15,
    color: 'black',
  },
});
