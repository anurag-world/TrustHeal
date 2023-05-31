import React from 'react';
import {
  ScrollView,
  Alert,
  View,
  Text,
  SafeAreaView,
  Linking,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import Header from '../components/Header';

export default function TCDoctor() {
  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };
  const viewTermsConditions = () => {
    openURL('http://trustheal.in/TrustHeal_Privacy_Policy.html');
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
          <Header title="Terms & Conditions" showMenu={false} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              width: '95%',
              alignSelf: 'center',
            }}
          >
            <View style={{ alignSelf: 'center', width: '90%' }}>
              {/* GENERAL TERMS */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginTop: 20,
                  }}
                >
                  GENERAL TERMS
                </Text>
                <Text style={[styles.parStyles, { textAlign: 'justify' }]}>
                  The Aggregator has set up and operates a technology-based platform that
                  facilitates various healthcare services, including connecting healthcare providers
                  with Patients (defined hereunder).
                </Text>
              </View>
              {/* DEFINITION AND INTERPRETATION */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  DEFINITION AND INTERPRETATION
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  Definitions
                </Text>
                <Text style={styles.parStyles}>
                  In this Agreement, unless the context otherwise requires, the following words and
                  expressions shall have the meanings ascribed to them below:
                </Text>
              </View>
              {/* Definitions */}
              <View style={{ flex: 1 }}>
                <Text style={styles.parStyles}>
                  1. <Text style={{ fontWeight: 'bold' }}>“Agreement”</Text> shall comprise these
                  General Terms and amendments hereto
                </Text>
                <Text style={styles.parStyles}>
                  2. <Text style={{ fontWeight: 'bold' }}>“Applicable Law”</Text> shall mean any
                  statute, law, regulation, ordinance, rule, judgment, rule of law, order, decree,
                  clearance, approval, directive, guideline, policy, requirement, or other
                  governmental restriction or any similar form of decision, or determination by, or
                  any interpretation or administration of any of the foregoing by, any statutory or
                  regulatory authority whether in effect as of the date of this Agreement or
                  thereafter and in each case as amended.
                </Text>
                <Text style={styles.parStyles}>
                  3. <Text style={{ fontWeight: 'bold' }}>“Business Day”</Text>
                  shall mean the day on which banks are open.
                </Text>
                <Text style={styles.parStyles}>
                  4. <Text style={{ fontWeight: 'bold' }}>“Parties”</Text> collectively referred to
                  both the Aggregator and the Doctor.
                </Text>
                <Text style={styles.parStyles}>
                  5. <Text style={{ fontWeight: 'bold' }}>“Doctor’s Patients”</Text> shall have the
                  same meaning as defined under the Doctor Agreement
                </Text>
                <Text style={styles.parStyles}>
                  6. <Text style={{ fontWeight: 'bold' }}>“TrustHeal Patients”</Text> shall have the
                  same meaning as defined under the Doctor Agreement.
                </Text>
                <Text style={styles.parStyles}>
                  7. <Text style={{ fontWeight: 'bold' }}>“Patients”</Text> collectively referred to
                  both Doctor’s Patients and TrustHeal Patients.
                </Text>
                <Text style={styles.parStyles}>
                  8. <Text style={{ fontWeight: 'bold' }}>“TrustHeal Platform”</Text> means the
                  technology application and platform titled ‘TrustHeal’, owned and operated by the
                  Aggregator.
                </Text>
                <Text style={styles.parStyles}>
                  9. <Text style={{ fontWeight: 'bold' }}>“Doctor Fees”</Text> means the outpatient
                  consultation fees as mutually agreed between the Parties for each specialty.
                  Doctor Fees shall be set out in Schedule I of the Agreement.
                </Text>
                <Text style={styles.parStyles}>
                  10. <Text style={{ fontWeight: 'bold' }}>“Aggregator Fees”</Text> means the
                  percentage of Doctor Fees or Net Fees as Set out in Schedule I to be charged by
                  the Aggregator from the Doctor for providing services of the care team and
                  technology usage charges to the Doctor.
                </Text>
                <Text style={styles.parStyles}>
                  11. <Text style={{ fontWeight: 'bold' }}>“Aggregator Fee for Doctor-Visit”</Text>{' '}
                  means the flat fee charged to the Doctor by the Aggregator for a patient’s first
                  visit to the Doctor within thirty (30) days of online consultation on TrustHeal
                  Platform as a data maintenance cost for recording and preserving all the data
                  including Doctor-Patients interactions.
                </Text>
                <Text style={styles.parStyles}>
                  12. <Text style={{ fontWeight: 'bold' }}>“CIMS Licensee Fees”</Text> means the
                  flat fee charged to the Doctor by the Aggregator for the usage of CIMS and other
                  medical databases available on the TrustHeal Platform
                </Text>
              </View>
              {/* Interpretation */}
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
                  Interpretation
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. Agreement means this Agreement and includes all annexures, schedules,
                    supplements and appendices (if any).
                  </Text>
                  <Text style={styles.parStyles}>
                    2. References to any agreement or document including this Agreement shall
                    include such agreement or document as amended, modified, varied, novated,
                    supplemented or replaced from time to time in writing signed by the concerned
                    Parties.
                  </Text>
                  <Text style={styles.parStyles}>
                    3. . Descriptive headings of Clauses are inserted solely for convenience of
                    reference and are not intended as complete or accurate descriptions of the
                    content of such Clauses.
                  </Text>
                  <Text style={styles.parStyles}>
                    4. The use of words in the singular or plural, or with a particular gender,
                    shall not limit the scope or exclude the application of any provision of this
                    Agreement to such person or persons or circumstances unless the context
                    otherwise permits.
                  </Text>
                  <Text style={styles.parStyles}>
                    5. The terms “hereof”, “hereto” and “hereunder” and similar expressions shall
                    mean and refer to this Agreement and not to any particular Clause of this
                    Agreement.
                  </Text>
                  <Text style={styles.parStyles}>
                    6. The terms “Recital”, “Schedule” or “Clause” mean and refer to the specified
                    Recital of, Schedule to, and Clause of, respectively, this Agreement.
                  </Text>
                  <Text style={styles.parStyles}>
                    7. Any grammatical form of a defined term herein shall have the same meaning as
                    that of such term.
                  </Text>
                  <Text style={styles.parStyles}>
                    8. The words “including” and “includes” herein shall always mean “including,
                    without limitation” and “includes, without limitation”, respectively.
                  </Text>
                </View>
              </View>
              {/* NON-EXCLUSIVITY */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  NON-EXCLUSIVITY
                </Text>
                <Text style={[styles.parStyles, { textAlign: 'justify' }]}>
                  Arrangement as set out in this Agreement between the Parties is on a non-exclusive
                  basis and Doctor hereby agrees that the Aggregator is permitted to enter into a
                  similar or same agreement with other Doctors. Similarly, Aggregator agrees that
                  Doctor is permitted to enter into a similar or same agreement with other
                  aggregator service providers.
                </Text>
              </View>
              {/* ADDITIONAL RIGHTS AND OBLIGATIONS OF DOCTOR */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  ADDITIONAL RIGHTS AND OBLIGATIONS OF DOCTOR
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. The Agreement is being entered into on a Principal to Principal basis. The
                    Doctor is an independent doctor and not an agent and/or employee of the
                    Aggregator. The Doctor agrees that it will not represent that he is an agent of
                    the Aggregator nor hold himself/herself out as such. The Doctor shall not enter
                    into any agreement or arrangement which will bind Aggregator legally or
                    otherwise.
                  </Text>
                  <Text style={styles.parStyles}>
                    2.The Doctor hereby grants the Aggregator the right to list Doctor on the
                    TrustHeal platform
                  </Text>
                  <Text style={styles.parStyles}>
                    3. The Doctor shall use the TrustHeal platform in accordance with the
                    Aggregator’s terms of use and shall ensure that it always uses an updated
                    version of the TrustHeal platform. The Doctor shall use an Internet connection
                    based on a bandwidth of minimum{' '}
                    <Text style={{ fontWeight: 'bold' }}>4 mbps</Text> as agreed with the
                    Aggregator.
                  </Text>
                  <Text style={styles.parStyles}>
                    4. The Doctor hereby agrees and covenants that it shall use the TrustHeal
                    Platform, at all times during the term of this Agreement, for providing the
                    healthcare services to the Patients, whether it is to provide necessary
                    responses to the Patients, render advice or conduct any diagnosis, on the
                    TrustHeal platform, or store the records of the Patient on the TrustHeal
                    platform.
                  </Text>
                  <Text style={styles.parStyles}>
                    5. The Aggregator shall intimate the Doctor of an appointment booking by an
                    agreed mode and the Doctor shall have the option of rescheduling or canceling
                    the appointment at that time.
                  </Text>
                  <Text style={styles.parStyles}>
                    6. The Doctor shall provide the Patients with appropriate treatment as
                    specifically required for the care of Patients for their medical ailments. The
                    Doctor shall ensure that they conduct their own independent history and
                    assessment of the Patients and provide such treatment to the Patient, as it
                    deems fit, in its sole discretion. The Doctor shall treat the Patient in the
                    same manner as they treat other patients who directly visit the Doctor. The
                    Doctor shall at its sole responsibility ensure that consultation provided is of
                    the highest standard and care.
                  </Text>
                  <Text style={styles.parStyles}>
                    7. Notwithstanding anything elsewhere; the Doctor understands that it alone
                    stands responsible for its infrastructure and facilities and that Aggregator
                    shall not bear or have any responsibility or liability with respect to the same.
                  </Text>
                  <Text style={styles.parStyles}>
                    8. Doctor hereby agrees that the Aggregator does not have any control over the
                    Patient and is not responsible for the order placed by the Patient on the
                    TrustHeal platform. Doctor also acknowledges and agrees that the Aggregator is
                    not responsible for verifying the authenticity of the prescription.
                  </Text>
                  <Text style={styles.parStyles}>
                    9. Doctor shall at its sole cost and expense, obtain and maintain all permits
                    and licenses necessary in connection with its performance of its obligations
                    under this Agreement and shall comply with all relevant governmental rules and
                    regulations.
                  </Text>
                  <Text style={styles.parStyles}>
                    10. Doctor hereby agrees to comply at all times with the Aggregator’s terms of
                    use, privacy policy, applicable rules and regulations regarding safety,
                    security, use, and conduct, of the TrustHeal Platform.
                  </Text>
                  <Text style={styles.parStyles}>
                    11. Doctor hereby agrees and undertakes to ensure that s/he shall be available
                    to receive training from the Aggregator on the TrustHeal Platform and shall duly
                    act and perform his/her job to his best efforts and in such a manner as agreed
                    with the Aggregator and as set out in this Agreement and specific data, plans,
                    memoranda, instructional manuals and/or guidelines framed by the Aggregator and
                    shared with the Doctor.
                  </Text>
                  <Text style={styles.parStyles}>
                    12. Doctor agrees and acknowledges that by acting in pursuance to this
                    Agreement, the characteristics of a doctor-patient relationship between it and
                    the Patients does not get impacted in any manner. As such, the terms of the
                    Indian Medical Council’s Professional Conduct, Etiquette and Ethics Regulations,
                    2002 (“MCI Regulations”) or (any substitute thereof or similar relevant
                    regulations) will apply to the Doctor in their interactions with the Patients,
                    that are undertaken pursuant to this Agreement. MCI Regulations, if and as
                    applicable shall also apply to the staff of the Aggregator involved in the
                    TrustHeal platform for the purposes of this agreement.
                  </Text>
                  <Text style={styles.parStyles}>
                    13. Doctor hereby further agrees that in no event and under no circumstances
                    shall the Aggregator be held responsible and liable, whether together with the
                    Doctor or independently, with respect to any services rendered by Doctor to the
                    Patients. It is hereby clarified that the Aggregator shall not be liable for any
                    claims or damages in respect of the medical services, treatment and care
                    rendered by the Doctor to the Patients under this Agreement, except if same is
                    due to the negligence of TrustHeal staff pursuant to this agreement or due to
                    any bug, technical error, malfunction or failures in the TrustHeal Platform.
                  </Text>
                  <Text style={styles.parStyles}>
                    14. The Doctor agrees to provide all the required details to be registered as a
                    doctor on TrustHeal Platform. These details shall include:
                    {'\n'}
                    <Text style={{}}>
                      ⬤ Unique Indian Medical Association number / Registration number
                    </Text>
                    {'\n'}
                    <Text style={{}}>⬤ Degree’s and certificates</Text>
                    {'\n'}
                    <Text style={{}}>
                      ⬤ Current affiliations with Doctors, clinics or hospitals
                    </Text>
                    {'\n'}
                    <Text style={{}}>
                      ⬤ Contact and correspondence information including contact number and email
                      address
                    </Text>
                    {'\n'}
                    <Text style={{}}>⬤ Copy of digital signature</Text>
                    {'\n'}
                    <Text style={{}}>⬤ High resolution photograph</Text>
                    {'\n'}
                    <Text style={{}}>
                      ⬤ Time slot for each day of the week for OPD on TrustHeal Platform
                    </Text>
                  </Text>
                  <Text style={styles.parStyles}>
                    15. The Doctor agrees not to divulge your TrustHeal Platform credentials to
                    anyone, and that no one but yourself will be operating this account.
                  </Text>
                  <Text style={styles.parStyles}>
                    16. You understand that you will be provided patients’ sensitive information for
                    consultation purposes. You agree not utilize this sensitive patient information
                    for any other purpose except consultation.
                  </Text>
                  <Text style={styles.parStyles}>
                    17. You agree to not send spam or promotional messages to any Patients for your
                    services via messaging on the TrustHeal Platform or over the emails. In the
                    event any Patient flags you for sending spam or promotional messages, your
                    account will be suspended, and your case will be subjected to internal
                    investigation.
                  </Text>
                  <Text style={styles.parStyles}>
                    18. All information shared by the Doctor for your profile, or information you
                    share with the Patient on the TrustHeal Platform will be governed by Aggregators
                    Terms of Use and Privacy Policy.
                  </Text>
                  <Text style={styles.parStyles}>
                    19. The Parties further agree that if any responsibility not specifically
                    described in this Agreement is found to be an inherent, necessary or customary
                    part of the Services and/or required for proper performance or provision of the
                    Services; Services to be delivered by the Doctor.
                  </Text>
                </View>
              </View>
              {/* RIGHTS AND OBLIGATIONS OF AGGREGATOR */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  RIGHTS AND OBLIGATIONS OF AGGREGATOR
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. Aggregator shall be responsible for development of the TrustHeal platform,
                    day to day upkeep of TrustHeal platform and any upgradation of the TrustHeal
                    platform.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. Aggregator shall ensure that TrustHeal platform is operational and accessible
                    at all times (subject to unforeseen technical errors/failures).
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3. Aggregator shall reasonably ensure that the technology and experience
                    provided by the Aggregator and its personnel are of the highest quality and
                    standard.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. Aggregator shall have the right to respond to Patient reviews listed on the
                    TrustHeal platform, on behalf of the Doctor and in consultation with the Doctor.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    5. Aggregator shall have the right to send its personnel, employees, agents or
                    contractors to Doctor, after informing Doctor 2 Business Days in advance of the
                    visit, to check and ensure that the TrustHeal platform made available in the
                    Doctor is operating accurately. When any employee, agent or contractor of the
                    Aggregator enters the premises of Doctor, the Aggregator shall ensure that such
                    employees, agents and contractors use all reasonable endeavors to: (i) protect
                    Doctor’s people and property; (ii) prevent nuisance and unnecessary noise and
                    disturbance in Doctor premises; and (iii) act in a safe and lawful manner and
                    comply with the safety standards and policies of Doctor. The employees and
                    representatives of the Aggregator shall wear an official identity card (provided
                    by the Aggregator), when they are in Doctor premises.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    6. Aggregator shall connect Patients with the Doctor for medical
                    services/treatments on the basis of their medical requirements and as per a
                    Patient’s individualistic specific preferences, as requested by the Patient on
                    the TrustHeal platform. Aggregator shall assimilate details and provide to the
                    Doctor the said details of the Patients, provided by the Patient on the
                    TrustHeal platform. Aggregator will only pass on information that the Patient
                    has uploaded on the Platform and the Aggregator is not responsible for the
                    accuracy of such information.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    7. Aggregator shall collect and store all the data and health records, including
                    but not limited to the information provided by the Patients and medical reports
                    issued by the Doctor, on the TrustHeal platform, and shall provide the Doctor
                    with such information as may be required by the Doctor, to enable the Doctor to
                    render its services to the Patients. Aggregator is not responsible for the
                    accuracy of such information as it is only assisting in storing such
                    information. Aggregator shall be responsible for the security and
                    confidentiality of the patient data and health records stored on TrustHeal
                    platform and shall be liable for any adverse impact arising due to breach of
                    such security and confidentiality except due to negligence of Doctor.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    8. The Aggregator will make all reasonable attempts to ensure the patients are
                    reminded of their appointments. However, the Aggregator does not take
                    responsibility for patients who do not show up to appointments.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    9. Aggregator at its sole cost and expense, shall obtain and maintain all
                    permits and licenses necessary in connection with its performance of its
                    obligations under this Agreement and shall comply with all relevant governmental
                    rules and regulations.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    10. Aggregator hereby agrees to honor the payment commitment set out in this
                    Agreement and confirms that Aggregator shall not act or cause any of its
                    employees, officers, directors, staff or personnel to act in a manner so as to
                    dishonor any of its obligation under this Agreement or to adversely affect the
                    revenue of Doctor or adversely affect the business of Doctor.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    11. Aggregator shall ensure that the Doctor receives the training on the
                    TrustHeal Platform and all the relevant material including but not limited to
                    specific data, plans, files, computer discs, software, documents, memoranda,
                    instructional manuals along with one or more of its functionaries for
                    coordination and interaction with the Doctor.
                  </Text>
                </View>
              </View>
              {/* MARKETING */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  MARKETING
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. Parties hereby agree that the Aggregator shall have right to promote and
                    market Doctor in the manner the Aggregator deems fit, after taking permission
                    from Doctor with a copy of the marketing material; such permission shall not be
                    unreasonably denied.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. Parties hereby also agree and acknowledge that the Aggregator shall have the
                    right to promote and market the Aggregator to Doctor’s existing Patients via
                    various channels.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3. Doctor hereby agrees and grants the Aggregator the right to create and
                    display cobranded signage, such as signs images, and logos, on digital channels
                    or Doctor premises, in such manner as the Aggregator deems fit, after taking
                    permission from Doctor with a soft copy of the signages; such permission shall
                    not be unreasonably denied.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. Details of the type and form of marketing proposed to be carried out by the
                    Aggregator shall be mutually agreed in writing among the Parties.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    5.The cost for co-branded marketing done by the Aggregator within Doctor
                    premises shall be borne by the Aggregator.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    6. The cost of any co-branded marketing campaign on mass media channels like
                    radio, print, hoarding or television shall be discussed between the Aggregator
                    and Doctor. The decision of sharing cost shall be based on mutual written
                    agreement between both the Parties.
                  </Text>
                </View>
              </View>
              {/* ADDITIONAL PAYMENT TERMS */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  ADDITIONAL PAYMENT TERMS
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. The Doctor shall use the technology solution provided by the Aggregator (
                    <Text style={{ fontWeight: 'bold' }}>“Technology Solution”</Text>) for all
                    interactions with the Patients referred to the Doctor by the Aggregator. This
                    shall include managing and assigning appointments, generating invoices,
                    rendering prescriptions.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. By the first week of every month, the Aggregator shall share a settlement
                    statement (
                    <Text style={{ fontWeight: 'bold' }}>“Monthly Settlement Statement”</Text>) with
                    the Doctor providing the break-up for each of the consultation services as
                    detailed above rendered in the previous month.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3. All payments made by the Aggregator to the Doctor shall be subject to
                    withholding taxes and such other taxes as and when applicable.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. All payment exchanges between the Parties shall be consummated through a
                    direct bank transfer using NEFT/RTGS/IMPS or through a cheque/demand draft/pay
                    order as specified by the Parties.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    5. The Parties agree that the Aggregator shall pay the Doctor differential
                    amount, that is, the amount equal to the Doctors Fee minus the Aggregator Fee.
                    Additionally, in order to scale up the business for the Doctor, Aggregator at
                    its discretion may charge the Patient a discounted amount that can be lower than
                    the agreed Doctors fee. In such an event Aggregator shall borne the cost towards
                    the discounted fee and continue to pay the Doctor an amount equal to the Doctors
                    Fee minus the Aggregator Fee. Further, Aggregator may charge the Patient a
                    higher amount and retain the excess amount charged from the Patient over the
                    agreed Doctors Fee. In such events Aggregator shall continue to pay the Doctor
                    an agreed amount, that is, the amount equal to the Doctors Fee minus the
                    Aggregator Fee.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    6. All the payments made under this Agreement shall be subject to applicable
                    withholding taxes and such taxes as applicable from time to time.
                  </Text>
                </View>
              </View>
              {/* TERM AND TERMINATION */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  TERM AND TERMINATION
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1.The Effective date stated in the preamble of this Agreement shall be regarded
                    as the date of commencement of this Agreement (
                    <Text style={{ fontWeight: 'bold' }}>“Commencement Date”</Text>
                    ).
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. The Agreement is valid for the Term specified in the Doctor’s Agreement. On
                    the expiry of the Term of this Agreement, the Parties hereto may, by mutual
                    consent in writing, extend the term of this Agreement for such further period or
                    periods and on the terms and conditions as may be mutually agreed between the
                    Parties.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3.Parties hereby agree that the commercial terms between the Parties for the
                    purpose of this Agreement shall be revised and discussed by the Parties thirty
                    (30) days prior to end of Term of this Agreement and the revised agreed terms
                    shall be in written form executed by the Parties, as an addendum to this
                    Agreement.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. Either Party may terminate this Agreement for (i) breach or non-conformity by
                    the defaulting Party of any of the terms of this Agreement or failure to perform
                    the obligations/duties under this Agreement, which breach or failure, if capable
                    of cure or remedy, has not been cured or remedied within thirty (30) days of the
                    receipt of written notice of such breach or failure from the non-defaulting
                    Party; or (ii) in the event of a Party being ordered to be wound up for any
                    reasons by any court or direction and/or liquidator/receiver being appointed.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    5. Notwithstanding anything else contained in this Agreement, the either Party
                    may terminate this Agreement, for any or no reason, at any given point in time
                    by giving the other Party a thirty (30) days’ notice of such termination.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    6. Notwithstanding anything else contained in this Agreement, the Aggregator may
                    terminate this Agreement with a week’s notice in the case of provable
                    negligence, fraud or misconduct on the part of the Doctor in performance of the
                    services to be provided by the Doctor to the Patients.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    7. Notwithstanding anything else contained in this Agreement, the Doctor may
                    terminate this Agreement with a week’s notice in the case of i. provable
                    negligence or gross misconduct on the part of Aggregator and/or its staff in
                    performance of the services to be provided by Aggregator to the Patients of
                    Doctor and ii. Major malfunction, bug or outage in the TrustHeal platform that
                    affects its services to the Patients of Doctor and provided that bug has not
                    been cured or remedied by the Aggregator within thirty (30) days of the receipt
                    of a written notice by the Doctor in this regard.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    8. Upon termination of this Agreement whether by expiry of the Term or early
                    termination the following shall be applicable: {'\n'}
                    <Text style={{}}>
                      a. Both Parties shall settle all accounts and payments due to the other Party
                      as on the date of termination.
                    </Text>
                    {'\n'}
                    <Text style={{}}>
                      b. The Doctor shall henceforth return to the Aggregator all
                      TrustHeal/Aggregator specific data, assets, plans, files, computer discs,
                      software, documents, memoranda, instructional manuals and other records which
                      were given to or obtained by the Aggregator by virtue of this Agreement
                      including any other document that was provided to the Aggregator in order to
                      enable the Doctor to provide the services detailed under this Agreement.
                    </Text>
                  </Text>
                </View>
              </View>
              {/* DATA PRIVACY & SECURITY */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  DATA PRIVACY & SECURITY
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. Parties shall ensure that all personal information, including without
                    limitation, name, age, address (including postcode), telephone number, or email
                    address, medical records and/or medical information shall be used in accordance
                    with the Aggregator’s privacy policy as defined in
                    <Text
                      onPress={viewTermsConditions}
                      style={{
                        color: 'blue',
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                      }}
                    >
                      {' '}
                      http://trustheal.in/TrustHeal_Privacy_Policy.html
                    </Text>{' '}
                    and as per applicable laws in relation thereto. Any change in the Aggregator’s
                    privacy policy shall be immediately communicated to Doctor in writing.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. Neither Party shall disclose personal information without following due
                    course/applicable privacy, security and data protection laws, rules and
                    regulations including without limitation those restricting cross border transfer
                    of data, and all applicable laws, rules and regulations governing outbound
                    telephone calls, transmission of electronic mail or other electronic messages
                    not limited to SMS or WhatsApp messages or transmission of facsimile messages.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3. Doctor hereby agrees that the Aggregator shall be allowed to use the
                    information/data, including data received of and from the Patients, received by
                    the Aggregator during the term of this Agreement, for the purpose of enhancing
                    the TrustHeal platform technology, research and analysis, in accordance with
                    applicable laws..
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. Aggregator hereby agrees that Doctor shall be allowed to use the
                    information/data, including data received of and from Corporate Clients,
                    received by Doctor during the term of this Agreement, for the purpose of
                    enhancing its workflow, research and analysis, in accordance with applicable
                    laws.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    5. The Aggregator agrees that Patient details shall remain confidential and
                    would not be shared with a third-party for marketing or promotional purposes.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    6. Without the Aggregator’s prior written approval, the Doctor shall not publish
                    or use any advertising, sales promotion or publicity matter relating to the
                    Agreement and/or the Aggregator.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    7. The Doctor agrees that the Aggregator for its promotional purposes shall be
                    allowed to use the information provided by the Doctor.
                  </Text>
                </View>
              </View>
              {/* OWNERSHIP OF MATERIAL */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  OWNERSHIP OF MATERIAL
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. For the purpose of this Agreement:{'\n'}
                    <Text style={{}}>
                      a. “Doctor-generated Materials” – means any write up, ideas, materials, data,
                      programs or information, including, without limitation, ideas, concepts,
                      whether or not subject to copyright, but not including (i) any data in public
                      domain used by Doctor in those materials and (ii) Third Party Proposals (as
                      defined below).
                    </Text>
                    {'\n'}
                    <Text style={{}}>
                      a. “Third Party Proposals” means any ideas, concepts, materials or proposals
                      that Doctor obtains from a third party, so long as Doctor identifies the item
                      as supplied by a third party prior to furnishing it to Aggregator.
                    </Text>
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2.Assignment of all intellectual property rights in the Doctor generated
                    Materials – Doctor hereby irrevocably and perpetually assigns to the Aggregator
                    all worldwide rights, title and interests in and to intellectual property
                    created, made, conceived, reduced to practice or authored by Doctor, or any
                    persons provided by Doctor either solely or jointly with others, in the Doctor
                    generated Material, including the right to obtain, register, perfect and enforce
                    such rights under applicable laws and conventions. Doctor agrees that the
                    Aggregator will be free to make, have made, use, offer for sale, sell, modify,
                    translate, and import products utilizing the intellectual property assigned to
                    the Aggregator.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3. All plans, ideas, materials, data or information furnished by the Aggregator
                    to the Doctor in connection with the Agreement (“Aggregator-furnished
                    Materials”) are the sole property of the Aggregator. The Doctor must not use any
                    of those items at any time in connection with any product or service of any
                    other organization, or for any purpose other than the Doctor’s performance of
                    its obligations under the Agreement.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. Upon termination or expiration of the Agreement, Doctor will transfer to
                    Aggregator title and ownership of all Doctor-generated Material. Thereafter,
                    Aggregator shall have no liability to Doctor arising from Aggregator’s use of
                    any of that Doctorgenerated Material.
                  </Text>
                </View>
              </View>
              {/* QUALITY OF SERVICE */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  QUALITY OF SERVICE
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    Parties hereby agrees to:
                    {'\n'}
                    <Text>
                      (a) provide their services in a proper, timely and efficient manner using the
                      standard of care, skill, diligence, prudence and foresight that would
                      reasonably be expected from a prudent, expert and experienced provider of
                      services that are similar to the services provided under this Agreement;
                    </Text>
                    {'\n'}
                    <Text>
                      (b) ensure the highest quality of work and the delivery of the services with
                      the utmost efficiency and care;
                    </Text>
                    {'\n'}
                    <Text>(c) act in good faith and in the best interests of the other Party;</Text>
                    {'\n'}
                    <Text>
                      (d) keep the other Party informed of all matters of which it ought reasonably
                      be made aware, and provide such information in relation to the provision of
                      the services as may reasonably be required by the other Party; and
                    </Text>
                    {'\n'}
                    <Text>
                      (e) fully comply with their obligations and duties under this Agreement.
                    </Text>
                  </Text>
                </View>
              </View>
              {/* ADHERENCE TO TRUSTHEAL PLATFORM */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  ADHERENCE TO TRUSTHEAL PLATFORM
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1.Subject to the terms of this Agreement, either Party’s permitted
                    representatives including but not limited to employees, contractors, or
                    authorized third party representatives (collectively, “Representatives”), may
                    inspect the other party, after seeking permission in advance, to assess whether
                    they are in compliance with the Agreement.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. In case the inspecting Representatives of either Party observe any gaps at
                    the other Party, in processes required to comply with this agreement the
                    Representatives shall notify the other Party and the other Party shall take
                    corrective actions to bring itself to be in compliance with this Agreement. In
                    case either Party is not able to take corrective action for these gaps to the
                    satisfaction of the other Party, despite having received three (3)
                    notifications, the inspecting Party shall have the right to fix such gaps at its
                    cost and such cost shall be reimbursed by the other Party, as the case may be.
                  </Text>
                </View>
              </View>
              {/* WARRANTY */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  WARRANTY
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    Each Party warrants that:
                    {'\n'}
                    <Text>
                      (i) it has the power and authority to execute and deliver this Agreement and
                      is not prohibited from entering into this Agreement;
                    </Text>
                    {'\n'}
                    <Text>
                      (ii) this Agreement has been duly authorized by all necessary resolutions and
                      upon execution and delivery by it will be a legal, valid and binding
                      obligation against it, enforceable in accordance with its terms;
                    </Text>
                    {'\n'}
                    <Text>
                      (iii) the execution and delivery of this Agreement by it and the promises,
                      agreements or undertakings under this Agreement do not violate any applicable
                      law, or any rule, regulation or order applicable to it or violate or
                      contravene the provisions of or constitute a default under any documents,
                      contracts, agreements or any other instrument to which it is a party or which
                      are applicable to it; and
                    </Text>
                    {'\n'}
                    <Text>
                      (iv) all services provided by it will be performed in a professional and
                      workmanlike manner and with the highest standard and care.
                    </Text>
                  </Text>
                </View>
              </View>
              {/* CONFIDENTIALITY */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  CONFIDENTIALITY
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. Any information relating to a Patient or about either Party obtained during
                    the subsistence of this Agreement shall remain confidential and the Parties
                    shall not disclose such confidential information to any third party (provided
                    that the Parties may reveal such information to any of their employees,
                    officers, advisers, who have a need to know such information, in each case,
                    subject to the relevant recipient acknowledging the confidential nature of the
                    information) without prior written consent of the disclosing Party.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. Each Party hereto shall treat as confidential all information of a
                    confidential nature (including but not limited to trade secrets, intellectual
                    property or any rights therein and information of commercial value), which may
                    become known to any of them from any other Party or their respective affiliates.
                    None of the Parties shall reveal any such information to any third party
                    (provided that the Parties may reveal such information to any of their
                    employees, officers, advisers, who have a need to know such information, in each
                    case, subject to the relevant recipient acknowledging the confidential nature of
                    the information) without prior written consent of the disclosing Party
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3. Obligations of confidentiality contained herein shall not apply to any
                    information which is already in the public domain.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. Legal Obligation to Disclose. Either Party may disclose Confidential
                    Information of the other Party in accordance with a judicial, administrative or
                    governmental order, provided that the Party disclosing the information against
                    the judicial, administrative or governmental order gives the other Party
                    reasonable notice and opportunity prior to such disclosure to take any lawful
                    actions that are available to prevent or minimize the extent of disclosure of
                    the Confidential Information.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    5. Parties obligations for confidentiality shall survive the termination of this
                    Agreement.
                  </Text>
                </View>
              </View>
              {/* INDEMNITY */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  INDEMNITY
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. Except as covered under this Agreement, Aggregator shall not become or be
                    responsible for any other liability on any account.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. Doctor shall indemnify, defend and hold Aggregator harmless from all actions,
                    proceedings, complaints, claims, damages, demands, liabilities, costs, expenses,
                    etc arising out of or in relation with:
                    {'\n'}
                    <Text>i. any violation of confidentiality obligations,</Text>
                    {'\n'}
                    <Text>ii. any form of medical negligence,</Text>
                    {'\n'}
                    <Text>
                      iii. any violation of the intellectual property rights of the Aggregator,
                    </Text>
                    {'\n'}
                    <Text>
                      iv. any act of willful misconduct, gross negligence by the Doctor and/or its
                      employees/associate,
                    </Text>
                    {'\n'}
                    <Text>v. any statutory violation,</Text>
                    {'\n'}
                    <Text>
                      vi. any other act which may have any form of legal impact on the Aggregator.
                    </Text>
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3. Aggregators liability under this Agreement shall not exceed INR Ten Thousand
                    (10,000).
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. Doctor shall not in any circumstances be liable for any claims or damages in
                    respect of the TrustHeal services rendered by the Aggregator to the Patients
                    under this Agreement.
                  </Text>
                </View>
              </View>
              {/* MISCELLANEOUS */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'black',
                  }}
                >
                  MISCELLANEOUS
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. Doctor shall be responsible for compliance, and shall ensure that its Doctors
                    comply with all applicable laws and regulations related to the operations of the
                    Doctor, including obtaining all required registrations or licenses, paying
                    government taxes and filing tax returns and following procedures. Doctor shall
                    be responsible for compliance with all agreements, obligations and covenants
                    which affects the Doctor’s ability to operate and run Doctor. This Agreement is
                    based on the assumption that the Doctor is in compliance with all such
                    regulations and the information and documents provided by the Doctor in relation
                    to this compliance are true and accurate.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    2. Aggregator shall be responsible for compliance, and shall ensure that its
                    employees and staff comply, with all applicable laws and regulations related to
                    the service provided through TrustHeal platform, including obtaining all
                    required registrations or licenses, paying government taxes and filing tax
                    returns and following procedures. Aggregator shall be responsible for compliance
                    with all agreements, obligations and covenants which affects its ability to
                    operate and run its business. This Agreement is based on the assumption that the
                    Aggregator is in compliance with all such regulations and the information and
                    documents provided by the Aggregator in relation to this compliance are true and
                    accurate.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    3. Either Party shall not be characterized as owner, operator, joint venture
                    partner, employee, or a contractor of the other Party
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    4. Either Party shall have the right to audit all non-finance records, registers
                    or other documents of the other Party relating to any of the Party’s obligations
                    under this Agreement subject to a prior notice in this regard. For the avoidance
                    of doubt, each Party will bear its own costs of conducting or participating in
                    an audit.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    5. A Party shall not be liable or required to perform any of its obligations
                    (except for payment obligations) under this Agreement in the event of any
                    contingency beyond the reasonable control of the Party, such as an act of God,
                    flood, earthquake, war or national emergency, insurrection, any epidemic, and/or
                    an act of terrorism and change in government policies. If the delay or failure
                    continues for more than thirty (30) days, either Party may terminate this
                    Agreement in whole or in part, upon notice in writing to the other Party.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    6. TNothing in this Agreement shall be deemed to create a partnership or
                    establish a relationship of principal and agent between the Parties hereto or in
                    any manner authorize either Party to bind the other for any purpose and neither
                    Party shall become liable by reason of any representation, action or omission of
                    the other Party except in accordance with the provisions of this Agreement.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    7. Except as otherwise expressly limited or provided for herein, neither Party
                    shall assign and transfer any of its rights, privileges, or obligations set
                    forth in, arising under, or created by this Agreement in whole or in part
                    without prior written notice to the other Party.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    8. If any term or provision in this Agreement is held to be illegal or
                    unenforceable, in whole or in part, under any enactment or rule of law, such
                    term or provision or part thereof to that extent will be deemed not to form part
                    of this Agreement and the same shall be replaced by a valid provision, which
                    comes as close as reasonably possible to the original intended purpose of the
                    original provision and the enforceability of the remainder of this Agreement
                    will not be affected.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    9. Any term or condition of this Agreement may be waived at any time by the
                    Party that is entitled to the benefit thereof, but no such waiver shall be
                    effective unless set forth in a written instrument duly executed by or on behalf
                    of the Party waiving such term or condition and accepted by the Other Party. No
                    waiver by any Party of any term or condition of this Agreement, in any one or
                    more instances, shall be deemed to be or construed as a waiver of the same or
                    any other term or condition of this Agreement on any future occasion. All
                    remedies under this Agreement or by law or otherwise afforded, will be
                    cumulative and not alternative.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    10. This Agreement shall be amended, changed, modified, supplemented, rescinded
                    or discharged only by a written document signed by both the Parties.
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    11. Any notice, consent, request, demand, approval or other communication to be
                    given or made under or in connection with this Agreement (each, a “Notice” for
                    the purposes of this clause) shall be in English, in writing and signed by or on
                    behalf of the Party giving it and must be effected either by hand delivery or
                    through electronic mail with a signed pdf attachment or courier to the relevant
                    addresses set out herein and shall be deemed to be served upon delivery. In the
                    case of notices to Aggregator
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.parStyles, { fontWeight: 'bold', textAlign: 'justify' }]}>
                  This Agreement shall be governed by and construed in accordance with the laws of
                  India. Any dispute arising out of this Agreement may in the first instance be
                  resolved through conciliation or mediation. In the event that the dispute(s) are
                  not resolved within thirty (30) days from commencement of conciliation/mediation
                  or such longer period as the Parties may agree in writing, either Party may refer
                  the dispute(s) to a sole arbitrator to be appointed with the mutual written
                  consent of the Parties. Arbitral proceedings shall be conducted as per Arbitration
                  and Conciliation Act, 1996 or its subsequent amendment[s]. The seat of arbitration
                  shall be Bangalore, Karnataka and the arbitral proceedings shall be conducted in
                  English. Notwithstanding the provisions of this clause, the Parties hereby submit
                  to the exclusive jurisdiction of the Bangalore courts of competent jurisdiction
                  insofar as it relates to obtaining any injunctive or equitable relief.
                </Text>
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
  parStylesUnder: {
    textAlign: 'left',
    fontSize: 11,
    marginVertical: 2,
    lineHeight: 15,
    color: 'black',
  },
});
