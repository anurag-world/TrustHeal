import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

export default function PatientPP({ setPpView }) {
  const window = Dimensions.get('window');
  return (
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
            width: '90%',
            alignSelf: 'center',
            padding: 25,
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
            Privacy Policy
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
              setPpView(false);

              // setZoom(1);
            }}
          />
        </View>
        <ScrollView
          style={{
            minHeight: 150,
            width: '100%',
            maxHeight: window.height - 200,
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              width: '95%',
              alignSelf: 'center',
            }}
          >
            <View style={{ alignSelf: 'center', width: '90%' }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.parStyles, { marginTop: 10 }]}>
                  Thank you for the trust you (defined below) have placed in TrustHeal Tech Private
                  Limited (‘TrustHeal’) having its registered office at B 59 LGF, Sarvodaya Enclave,
                  New Delhi - 110017. That is why we (TrustHeal) insist upon the highest standards
                  for secure transactions and customer information privacy. Please read the
                  following statement to learn about our (defined below) information gathering and
                  dissemination practices.
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.parStyles}>
                  TrustHeal is committed to respecting the privacy of every person who shares
                  information with it or whose information it receives. Your (defined below) privacy
                  is important to TrustHeal and we (defined below) strive to take care and protect
                  the information we (defined below) receive from you (defined below) to the best of
                  Our (defined below) ability.
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.parStyles}>
                  This Privacy Policy (“Privacy Policy”) applies to the collection, receipt,
                  storage, usage, processing, disclosure, transfer and protection (“Utilization”) of
                  your Personal Information (defined below) when You use the TrustHeal website
                  available at URL: www.TrustHeal.in (“Website”) operated by TrustHeal or avail any
                  Services offered by TrustHeal through the Website or Application.
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.parStyles}>
                  The terms ‘You’ or ‘Your’ refer to you as the user (registered or unregistered) of
                  the Website, Application or Services and the terms ‘We’, ‘Us” and ‘Our’ refer to
                  TrustHeal.
                </Text>
              </View>
              {/* CONSENT */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  CONSENT
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. You acknowledge that this Privacy Policy is a part of the Terms of Use of the
                    Website and the other Services, by accessing the Website or Application or by
                    otherwise providing Us Your Personal Information Yourself or through a Primary
                    User or by making use of the Services provided by the Website or Application,
                    You unconditionally signify Your (i) assent to the Privacy Policy, and (ii)
                    consent to the Utilisation of your Personal Information in accordance with the
                    provisions of this Privacy Policy.
                  </Text>
                  <Text style={styles.parStyles}>
                    2. You acknowledge that You are providing Your Personal Information out of Your
                    free will. If You use the Services on behalf of someone else (including but not
                    limited to, Your child – minor or major or as a legal representative of an
                    individual with mental illness) or an entity (such as Your employer), You
                    represent that You are authorized by such individual or entity to (i) accept
                    this Privacy Policy on such individual’s or entity’s behalf, and (ii) consent on
                    behalf of such individual or entity to Our collection, use and disclosure of
                    such individual’s or entity’s Personal Information as described in this Privacy
                    Policy. Further, You hereby acknowledge that the Utilization of Your Personal
                    Information by TRUSTHEAL is necessary for the purposes identified hereunder. You
                    hereby consent that the Utilization of any Personal Information in accordance
                    with the provisions of this Privacy Policy shall not cause any wrongful loss to
                    You.
                  </Text>
                  <Text style={styles.parStyles}>
                    3. YOU HAVE THE OPTION NOT TO PROVIDE US THE PERSONAL INFORMATION SOUGHT TO BE
                    COLLECTED. YOU WILL ALSO HAVE AN OPTION TO WITHDRAW YOUR CONSENT AT ANY POINT,
                    PROVIDED SUCH WITHDRAWAL OF THE CONSENT IS INTIMATED TO US IN WRITING. If You do
                    not provide Us Your Personal Information or if You withdraw the consent to
                    provide Us Your Personal Information at any point in time, We shall have the
                    option not to fulfill the purposes for which the said Personal Information was
                    sought and We may restrict You from using the Website, Application or Services.
                  </Text>
                  <Text style={styles.parStyles}>
                    4. Our Website or Application are not directed at children and We do not
                    knowingly collect any Personal Information from children. Please contact Us at{' '}
                    <Text
                      style={{
                        color: 'blue',
                        textDecorationLine: 'underline',
                        textDecorationColor: 'blue',
                      }}
                    >
                      contact@trustheal.in
                    </Text>{' '}
                    if You are aware that We may have inadvertently collected Personal Information
                    from a child, and We will delete that information as soon as possible.
                  </Text>
                </View>
              </View>
              {/* CHANGES TO THE PRIVACY POLICY */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  CHANGES TO THE PRIVACY POLICY
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. We reserve the right to update (change, modify, add and/or delete) this
                    Privacy Policy from time to time at our sole discretion. There is a tab at the
                    end of the Privacy Policy which indicates when the Privacy Policy was last
                    updated.
                  </Text>
                  <Text style={styles.parStyles}>
                    2. When We update Our Privacy Policy, we will intimate You of the amendments on
                    Your registered email ID or on the Website or Application. Alternatively,
                    TRUSTHEAL may cause Your account to be logged-off and make Your subsequent
                    account log-in conditional on acceptance of the Agreement. If You do not agree
                    to the amendments, please do not use the Website, Application or Services any
                    further.
                  </Text>
                </View>
              </View>
              {/* PERSONAL INFORMATION COLLECTED */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  PERSONAL INFORMATION COLLECTED
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    In order to provide Services to You we might require You to voluntarily provide
                    Us certain information that personally identifies You or Secondary Users related
                    to You. You hereby consent to the collection of such information by TRUSTHEAL.
                    The information that We may collect from You, about You or Secondary Users
                    related to You, may include but are not limited to, the following:
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parStyles}>
                      1. Patient/Caregiver/Doctor/Health Care Professional Name
                    </Text>
                    <Text style={styles.parStyles}>2. Birth date/age,</Text>
                    <Text style={styles.parStyles}>3. Blood group,</Text>
                    <Text style={styles.parStyles}>4. Gender</Text>
                    <Text style={styles.parStyles}>
                      5. Address (including country and pin/postal code),
                    </Text>
                    <Text style={styles.parStyles}>
                      6. Location information, including Your GPS location,
                    </Text>
                    <Text style={styles.parStyles}>7. Phone number/mobile number,</Text>
                    <Text style={styles.parStyles}>8. Email address,</Text>
                    <Text style={styles.parStyles}>
                      9. Physical, physiological and mental health condition, provided by You and/or
                      Your Healthcare Service provider or accessible from Your medical records,
                    </Text>
                    <Text style={styles.parStyles}>10. Personal medical records and history,</Text>
                    <Text style={styles.parStyles}>
                      11. Valid financial information at time of purchase of product/Services and/or
                      online payment,
                    </Text>
                    <Text style={styles.parStyles}>12. TrustHeal Login ID and password,</Text>
                    <Text style={styles.parStyles}>
                      13. User details as provided at the time of registration or thereafter,
                    </Text>
                    <Text style={styles.parStyles}>
                      14. Records of interaction with TRUSTHEAL representatives,
                    </Text>
                    <Text style={styles.parStyles}>
                      15. Your usage details such as time, frequency, duration and pattern of use,
                      features used and the amount of storage used,
                    </Text>
                    <Text style={styles.parStyles}>
                      16. Master and transaction data and other data stored in Your user account,
                    </Text>
                    <Text style={styles.parStyles}>
                      17. Internet Protocol address, browser type, browser language, referring URL,
                      files accessed, errors generated, time zone, operating system and other
                      visitor details collected in Our log files, the pages of our Website or
                      Application that You visit, the time and date of Your visit, the time spent on
                      those pages and other statistics Log Data,
                    </Text>
                    <Text style={styles.parStyles}>
                      18. User’s tracking Information such as, but not limited to the device ID,
                      Google Advertising ID and Android ID,
                    </Text>
                    <Text style={styles.parStyles}>
                      19. Any other information that is willingly shared by You. (collectively
                      referred to as “Personal Information”).
                    </Text>
                  </View>
                </View>
              </View>
              {/* HOW WE COLLECT PERSONAL INFORMATION */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  HOW WE COLLECT PERSONAL INFORMATION
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    The methods by which We collect Your Personal Information include but are not
                    limited to the following:
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parStyles}>
                      1. When You register on Our Website or Application,
                    </Text>
                    <Text style={styles.parStyles}>
                      2. When You provide Your Personal Information to Us,
                    </Text>
                    <Text style={styles.parStyles}>
                      3. During the course of Services provided to You by Us,
                    </Text>
                    <Text style={styles.parStyles}>
                      4. When You use the features on Our Website or Application,
                    </Text>
                    <Text style={styles.parStyles}>
                      5. Through Your device, once You have granted permissions to Our Application
                      (discussed below),{' '}
                    </Text>
                    <Text style={styles.parStyles}>
                      6. Through HSP pursuant to consultation on the Website or the Application,
                    </Text>
                    <Text style={styles.parStyles}>
                      7. By the use of cookies (also discussed below)
                    </Text>
                    <Text style={styles.parStyles}>
                      8. We collect information that Your browser/app sends whenever You visit Our
                      Website or Application, such as, the Log Data. In addition, We may use third
                      party services such as Pixel that collect, monitor and analyze this. This
                      information is kept completely secure.
                    </Text>
                  </View>
                </View>
              </View>
              {/* USE OF PERSONAL INFORMATION */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  USE OF PERSONAL INFORMATION
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    YOUR PERSONAL INFORMATION MAY BE USED FOR VARIOUS PURPOSES INCLUDING BUT NOT
                    LIMITED TO THE FOLLOWING:
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parStyles}>1. To provide effective Services;</Text>
                    <Text style={styles.parStyles}>
                      2. To debug customer support related issues;
                    </Text>
                    <Text style={styles.parStyles}>
                      3. To operate and improve the Website or Application;
                    </Text>
                    <Text style={styles.parStyles}>
                      4. TO PERFORM ACADEMIC/STUDIES, CLINICAL OR OTHER RESEARCH AND ANALYSIS FOR
                      OUR UNDERSTANDING, INFORMATION, ANALYSIS, SERVICES AND TECHNOLOGIES IN ORDER
                      TO PROVIDE ALL USERS IMPROVED QUALITY OF CARE; AND ENSURING THAT THE CONTENT
                      AND ADVERTISING DISPLAYED ARE CUSTOMIZED TO YOUR INTERESTS AND PREFERENCES;
                    </Text>
                    <Text style={styles.parStyles}>
                      5. To contact You via phone, SMS, email or third-party communication services
                      such as Whatsapp, etc. for appointments, technical issues, payment reminders,
                      obtaining feedback and other security announcements;
                    </Text>
                    <Text style={styles.parStyles}>
                      6. To send promotional and marketing emails from Us via SMS, email, snail mail
                      or third-party communication services such as WhatsApp, Facebook etc.;
                    </Text>
                    <Text style={styles.parStyles}>
                      7. To advertise products and Services of TrustHeal and third parties;
                    </Text>
                    <Text style={styles.parStyles}>
                      8. To transfer information about You, if We are acquired by or merged with
                      another company;
                    </Text>
                    <Text style={styles.parStyles}>
                      9. To share with Our business partners for provision of specific services You
                      have ordered so as to enable them to provide effective Services to You;
                    </Text>
                    <Text style={styles.parStyles}>
                      10. To administer or otherwise carry out Our obligations in relation to any
                      Agreement You have with Us;
                    </Text>
                    <Text style={styles.parStyles}>
                      11. To build Your profile on the Website or Application;
                    </Text>
                    <Text style={styles.parStyles}>
                      12. To respond to subpoenas, court orders, or legal process, or to establish
                      or exercise Our legal rights or defend against legal claims;
                    </Text>
                    <Text style={styles.parStyles}>
                      13. To investigate, prevent, or take action regarding illegal activities,
                      suspected fraud, violations of Our Terms of Use, breach of Our agreement with
                      You or as otherwise required by law;
                    </Text>
                    <Text style={styles.parStyles}>
                      14. TO AGGREGATE PERSONAL INFORMATION FOR RESEARCH FOR ACADEMIC/STUDIES,
                      CLINICAL OR OTHER RESEARCH, STATISTICAL ANALYSIS AND BUSINESS INTELLIGENCE
                      PURPOSES, AND TO SELL OR OTHERWISE TRANSFER SUCH RESEARCH, STATISTICAL OR
                      INTELLIGENCE DATA IN AN AGGREGATED AND/OR NON-PERSONALLY IDENTIFIABLE FORM TO
                      THIRD PARTIES AND AFFILIATES WITH A PURPOSE OF PROVIDING SERVICES TO THE USERS
                      OR FOR THE ADVANCEMENT OF SCIENTIFIC KNOWLEDGE ABOUT HEALTH AND DISEASE
                      (collectively referred to as “Purpose(s)”).
                    </Text>
                  </View>
                </View>
              </View>

              {/* SHARING AND TRANSFERRING OF PERSONAL INFORMATION */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  SHARING AND TRANSFERRING OF PERSONAL INFORMATION
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. You hereby consent and authorize Us to publish feedback obtained by You on
                    Our Website or Application.
                  </Text>
                  <Text style={styles.parStyles}>
                    2. User’s financial information are transacted upon secure sites of approved
                    payment gateways which are digitally under encryption, thereby providing the
                    highest possible degree of care as per current technology. However, User is
                    advised to exercise discretion while saving the payment details.
                  </Text>
                  <Text style={styles.parStyles}>
                    3. To the extent necessary to provide You with the Services, We may provide Your
                    Personal Information to third party contractors who work on Our behalf to
                    provide You with Services. These third-party contractors have access to
                    information needed to process Services only and shall not use it for other
                    purposes. Each third-party contractor, the data processor to which We transfer
                    Personal Information shall have to agree to comply with the procedures and
                    policies or put in place adequate measures on their own for maintaining the
                    confidentiality and secure Your Personal Information.
                  </Text>
                  <Text style={styles.parStyles}>
                    4. You acknowledge that TRUSTHEAL may be obligated to by law to disclose or
                    transfer your Personal Information with Courts and Government agencies in
                    certain instances such as for verification of identity, or for prevention,
                    detection, investigation, prosecution, and punishment for offences, or in
                    compliance with laws such as intimation of diagnosis of an epidemic disease. You
                    hereby consent to disclosure or transfer of Your Personal Information in these
                    instances.
                  </Text>
                  <Text style={styles.parStyles}>
                    5. Notwithstanding the above, We are not responsible for the confidentiality,
                    security or distribution of Your Personal Information by third-parties outside
                    the scope of Our Agreement. Further, We shall not be responsible for any breach
                    of security or for any actions of any third-parties or events that are beyond
                    the reasonable control of Us including but not limited to, acts of government,
                    computer hacking, unauthorized access to computer data and storage device,
                    computer crashes, breach of security and encryption, poor quality of Internet
                    service or telephone service of the User etc.
                  </Text>
                  <Text style={styles.parStyles}>
                    6. We may share Your Personal Information with Our other corporate and/or
                    associate entities and affiliates to (i) help detect and prevent identity theft,
                    fraud and other potentially illegal acts and cyber security incidents, and (ii)
                    help and detect co-related/related or multiple accounts to prevent abuse of Our
                    Services.
                  </Text>
                </View>
              </View>
              {/* PERMISSIONS */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  PERMISSIONS
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    Once You download and install Our Application, You may be prompted to grant
                    certain permissions to allow the Application to perform certain actions on Your
                    device. These actions include permission to:
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parStyles}>
                      1. read/write/modify/delete data in relation to the Application on Your
                      device’s storage;
                    </Text>
                    <Text style={styles.parStyles}>
                      2. view/access information relating to networks/access networks, including
                      permission to send and receive data through such networks/access networks;{' '}
                    </Text>
                    <Text style={styles.parStyles}>
                      3. determine Your approximate location from sources like, but not limited to,
                      mobile towers and connected Wi-Fi networks;
                    </Text>
                    <Text style={styles.parStyles}>
                      4. determine Your exact location from sources such as, but not limited to,
                      GPS;
                    </Text>
                    <Text style={styles.parStyles}>
                      5. view/access device information, including but not limited to the model
                      number, IMEI number, operating system information and phone number of Your
                      device;
                    </Text>
                    <Text style={styles.parStyles}>
                      6. access device information including device identification number required
                      to send notification/push notifications.
                    </Text>
                  </View>
                </View>
              </View>
              {/* USE OF COOKIES */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  USE OF COOKIES
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. Cookies are files with small amount of data, which may include an anonymous
                    unique identifier. Cookies are sent to You on the Website and/or Application.
                  </Text>
                  <Text style={styles.parStyles}>
                    2. We may store temporary or permanent ‘cookies’ on Your computer/device to
                    store certain data (that is not Sensitive Personal Data or Information). You can
                    erase or choose to block these cookies from Your computer. You can configure
                    Your computer’s browser to alert You when We attempt to send You a cookie with
                    an option to accept or refuse the cookie. If You have turned cookies off, You
                    may be prevented from using certain features of the Website or Application.
                  </Text>
                  <Text style={styles.parStyles}>
                    3. We do not control the use of Cookies by third parties.
                  </Text>
                </View>
              </View>
              {/* SECURITY */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  SECURITY
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. The security of Your Personal Information is important to Us. We have adopted
                    reasonable security practices and procedures including role-based access, secure
                    communication, password protection, encryption, etc. to ensure that the Personal
                    Information collected is secure. You agree that such measures are secured and
                    adequate. We restrict access to Your Personal Information to Our and Our
                    affiliates’ employees, agents, third party service providers, partners, and
                    agencies who need to know such Personal Information in relation to the Purposes
                    as specified above in this Policy, provided that such entities agree to abide by
                    this Privacy Policy.
                  </Text>
                  <Text style={styles.parStyles}>
                    2. While We will endeavour to take all reasonable and appropriate steps to keep
                    secure any information which We hold about You and prevent unauthorized access,
                    You acknowledge that the internet is not 100% secure and that We cannot
                    guarantee absolute security of Your Personal Information. Further, if You are
                    Secondary User, You hereby acknowledge and agree that Your Personal Information
                    may be freely accessible by the Primary User and other Secondary Users and that
                    TRUSTHEAL will not be able to restrict, control or monitor access by Primary
                    User or other Secondary Users to your Personal Information. We will not be
                    liable in any way in relation to any breach of security or unintended loss or
                    disclosure of information caused in relation to Your Personal Information.
                  </Text>
                </View>
              </View>
              {/* THIRD PARTY LINKS */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  THIRD PARTY LINKS
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    During Your interactions with Us, it may happen that We provide/include links
                    and hyperlinks of third-party websites not owned or managed by Us (“Third-party
                    Websites”). It may also happen that You or other Users may include links and
                    hyperlinks of Third-party Websites. The listing of such Third-Party Websites (by
                    You, other Users or by Us) does not imply endorsement of such Third-party
                    Websites by TRUSTHEAL. Such Third-party Websites are governed by their own terms
                    and conditions and when You access such Third-party Websites, You will be
                    governed by the terms of such Third-party Websites. You must use Your own
                    discretion while accessing or using Third-party Websites. We do not make any
                    representations regarding the availability and performance of any of the
                    Third-party Websites. We are not responsible for the content, terms of use,
                    privacy policies and practices of such Third-party Websites. We do not bear any
                    liability arising out of Your use of Third-party Websites.
                  </Text>
                </View>
              </View>
              {/* ACCESS */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  ACCESS
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    If You need to update or correct Your Personal Information or have any grievance
                    with respect to the processing or use of Your Personal Information, or request
                    that We no longer use Your Personal Information to provide You Services, or
                    opt-out of receiving communications such as promotional and marketing-related
                    information regarding the Services, for any reason, You may send Us an email at
                    grievances@trustheal.in and We will take all reasonable efforts to incorporate
                    the changes within a reasonable period of time.
                  </Text>
                </View>
              </View>
              {/* COMPLIANCE WITH LAWS */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  COMPLIANCE WITH LAWS
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    You are not allowed to use the services of the Website or Application if any of
                    the terms of this Privacy Policy are not in accordance with the applicable laws
                    of Your country.
                  </Text>
                </View>
              </View>
              {/* TERM OF STORAGE OF PERSONAL INFORMATION */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  TERM OF STORAGE OF PERSONAL INFORMATION
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    1. TRUSTHEAL may keep records of communications, including phone calls received
                    and made for making enquiries, orders, feedback or other purposes for rendering
                    services effectively and efficiently. TRUSTHEAL will be the exclusive owner of
                    such data and records. However, all records are regarded as confidential.
                    Therefore, will not be divulged to any third party, unless required by law.
                  </Text>
                  <Text style={styles.parStyles}>
                    2. TRUSTHEAL shall store Your Personal Information at least for a period of
                    three years from the last date of use of the Services, Website or Application or
                    for such minimum period as may be required by law.
                  </Text>
                </View>
              </View>

              {/* GRIEVANCE OFFICER */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    marginVertical: 5,
                  }}
                >
                  GRIEVANCE OFFICER
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.parStyles}>
                    We have appointed a grievance officer, whose details are set out below, to
                    address any concerns or grievances that You may have regarding the processing of
                    Your Personal Information. If You have any such grievances, please write to Our
                    grievance officer at{' '}
                    <Text
                      style={{
                        color: 'blue',
                        textDecorationLine: 'underline',
                        textDecorationColor: 'blue',
                      }}
                    >
                      contact@trustheal.in
                    </Text>{' '}
                    and Our officer will attempt to resolve Your issues in a timely manner.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parStyles: {
    textAlign: 'justify',
    fontSize: 13,
    marginVertical: 5,
    lineHeight: 15,
    color: 'black',
  },
  modalView: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalText: {
    marginVertical: 15,
    marginHorizontal: 10,
    textAlign: 'center',
  },
});
