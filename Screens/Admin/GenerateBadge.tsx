/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Modal from 'react-native-modal';
import {Card, Icon} from 'react-native-elements';
import Colors from '../../constants/Colors';
import axios from 'axios';
import Loading from '../../Components/Loading';
const GenerateBadge = ({route, navigation}: any) => {
  const [users, setUsers] = useState([]);
  const [selectedBadge, setSelectedBadge]: any = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [file, setFile]: any = useState(null);
  const [badge, setBadges] = useState(route.params?.ba);

  const Upload = (badge: any) => {
    setSelectedBadge(badge);
    setIsVisible(true);
  };
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  const handleFileUpload = async (badge: any) => {
    if (!file) {
      Alert.alert('Please pick a file first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file[0].uri,
        type: file[0].type || 'application/octet-stream',
        name: file[0].name || 'file',
      });

      const response = await axios.post(
        ' https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Upload/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const responseData = response.data;
      if (response.status === 200) {
        //Alert.alert('File uploaded successfully!');

        axios
          .put(
            ' https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Badges/Update',
            {
              badgesid: badge.badgesid,
              type: badge.type,
              text: badge.text,
              image: responseData,
              criteria: badge.criteria,
              activecriteria: badge.activecriteria,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(() => {
            Alert.alert('Updated Successfully');
            setIsVisible(false);
            fetchData();
          })
          .catch(err => console.log(err));

        await setFile(null);
      } else {
        Alert.alert('Error uploading file', responseData.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const closeModal = () => {
    setIsVisible(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        ' https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Badges',
      );
      const fetchedBadgesGen = response.data.filter((b:any) => b.type == 'ByAdmin');
      setBadges(fetchedBadgesGen);
      //console.log(fetchedBadgesGen);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };


  const fetchDataUsers = async () => {
    try {
      const result = await axios.get(
        ' https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/User',
      );
      const filteredUsers = result.data.filter(
        (user: any) => user.roleid == '3',
      );
      setUsers(filteredUsers);
      //console.log(filteredUsers);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataUsers();
  }, []);

  

  return (
    badge ? (
    <ScrollView style={{backgroundColor:'white'}}>
      <View style={styles.container}>
        <Text style={styles.header}>Generate Badges</Text>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('CreateBadge')}>
            <Text style={styles.button}>Create new Badge</Text>
          </TouchableOpacity>
        </View>
        {badge.map((badgeItem: any) => (
          <View style={styles.card} key={badgeItem.badgesid}>
            <Text style={styles.cardHeader}>{badgeItem.text}</Text>
            <View style={styles.badge}>
              <Image
                source={{uri: badgeItem.image}}
                style={styles.badgeImage}
              />
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ManualBadges', {
                      badge: badgeItem,
                      users: users,
                    })
                  }>
                  <Text style={styles.button}>View Trainee's</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Upload(badgeItem)}>
                  <Text style={styles.button}>Change Badge</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <View style={styles.card}>

        <TouchableOpacity  onPress={pickDocument}>
            <Text style={styles.button}>Pick a Badge</Text>
          </TouchableOpacity>

          {file && (
            <View style={{padding: 20, borderRadius: 10, marginBottom: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="file"
                  type="font-awesome"
                  size={30}
                  style={{marginRight: 10}}
                />
                <Text style={{flex: 1}}>{file[0].name || 'Unknown'}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleFileUpload(selectedBadge)}>
                <Text style={styles.button}>Upload</Text>
              </TouchableOpacity>
            </View>
          )}

          
        </View>
      </Modal>
      </View>
    </ScrollView>
    ):(<Loading/>)
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 20,
    borderRadius: 8,
    width: '80%',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  badgeImage: {
    width: 100,
    height: 100,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.secondary,
    color: 'white',
    borderRadius: 5,
    margin: 10,
  },
});

export default GenerateBadge;
