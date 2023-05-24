/* eslint-disable react/prop-types */
import { Image, Text, TouchableOpacity, View } from 'react-native';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import apiConfig from '../API/apiConfig';

export default function RenderSymptoms({
  CategorySymptomsList,
  flip,
  selectSymptom,
  insertSymptom,
  deleteSymptom,
}) {
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '95%',
        alignSelf: 'center',
        marginTop: 20,
      }}
    >
      {CategorySymptomsList.map((item, index) => (
        <View
          style={{
            flexDirection: 'column',
            marginVertical: 5,
          }}
          key={item.category}
        >
          {/* Heading */}
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              justifyContent: 'space-between',
              flexDirection: 'row',
              padding: 5,
            }}
            onPress={() => {
              flip(index, item.active);
            }}
          >
            <View>
              <Text
                style={[
                  {
                    fontSize: 15,

                    fontWeight: 'bold',
                    marginVertical: 5,
                    paddingHorizontal: 10,
                  },
                  item.active ? { color: '#2b8ada' } : { color: 'gray' },
                ]}
              >
                {item.category}
              </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <FAIcons
                name={item.active ? 'chevron-down' : 'chevron-right'}
                size={20}
                style={[
                  {
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  },
                  item.active ? { color: '#2B8ADA' } : { color: 'black' },
                ]}
              />
            </View>
          </TouchableOpacity>
          {/* List of Symptoms */}
          {item.active && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 5,
              }}
            >
              {item.symptoms.map((data, i) => (
                <TouchableOpacity
                  key={data.symptomImage}
                  style={[
                    {
                      flexDirection: 'column',
                      alignSelf: 'center',
                      width: 80,
                      height: 120,
                      // flex: 1,
                      justifyContent: 'space-evenly',
                      borderRadius: 15,
                      margin: 5,
                      padding: 5,
                    },
                    !data.active ? { backgroundColor: '#379ae6' } : { backgroundColor: '#17CC9C' },
                  ]}
                  onPress={() => {
                    selectSymptom(index, i, data.active);
                    if (data.active) insertSymptom(data.symptom, data.specialty);
                    else deleteSymptom(data.symptom, data.specialty);
                  }}
                >
                  {/* <Image/> */}
                  <View style={{ padding: 3 }}>
                    <Image
                      source={{
                        uri: `${apiConfig.baseUrl}/file/admin/download?fileToken=${data.symptomImage}`,
                      }}
                      style={{ height: 60, width: 60, alignSelf: 'center' }}
                    />
                  </View>
                  <View style={{ padding: 3 }}>
                    <Text
                      style={{
                        fontSize: 11,
                        alignSelf: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      {data.symptom}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
