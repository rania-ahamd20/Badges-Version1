/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import {Card, Icon} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import Loading from '../../Components/Loading';
//import {withNavigation} from 'react-navigation';

const Criteria = ({navigation}: any) => {
  const [badges, setBadges] = useState([]);
  const [genBadges , setgenBadges] : any = useState();
  const [criteriaArray, setCriteriaArray] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [activeCriterias, setActiveCriterias]: any = useState([]);
  const [selectedBadge, setSelectedBadge]: any = useState(null);

  const [file, setFile]: any = useState(null);
  const Upload = (badge: any)=>{ setSelectedBadge(badge);
    setIsVisible(true);};

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

  const handleFileUpload = async(badge:any) => {
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
        'https://d199-92-253-117-43.ngrok-free.app/api/Upload/upload',
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
            'https://d199-92-253-117-43.ngrok-free.app/api/Badges/Update',
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
          navigation.navigate('Criteria');
           Alert.alert('Updated Successfully');
            setIsVisible(false);

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
  const handleEstablishCriteria = (badge: any) => {
    const criteria: any = badge.criteria;
    const criteriaArray = criteria
      .split(',')
      .map((criterion: any) => criterion.trim());
    setCriteriaArray(criteriaArray);
    setSelectedBadge(badge);
    setIsModalVisible(true);
  };


  const toggleCriteriaSelection = (criterion: any) => {
    let updatedCriterias = [...activeCriterias];
    if (updatedCriterias.includes(criterion)) {
      updatedCriterias = updatedCriterias.filter(
        criteria => criteria !== criterion,
      );
    } else {
      updatedCriterias.push(criterion);
    }
    setActiveCriterias(updatedCriterias);
  };

  const saveActiveCriterias = async (badge: any) => {
    const selectedCriterias = activeCriterias.map(
      (index: any) => criteriaArray[index],
    );
    const selectedCriteriasString = selectedCriterias.join(', ');
    try {
      await axios.put(
        'https://d199-92-253-117-43.ngrok-free.app/api/Badges/Update',
        {
          badgesid: badge.badgesid,
          type: badge.type,
          text: badge.text,
          image: badge.image,
          criteria: badge.criteria,
          activecriteria: selectedCriteriasString,
        },
      );
      console.log('Successfully saved for the badge', selectedBadge.badgesid);
      closeModal();
    } catch (error) {
      console.error('Error :', error);
    }
  };
  const closeModal = () => {
    setIsModalVisible(false);
    setCriteriaArray([]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://d199-92-253-117-43.ngrok-free.app/api/Badges',
        );
        const fetchedBadges = response.data;
        setBadges(fetchedBadges);
        const fetchedBadgesGen = fetchedBadges.filter((b:any) => b.type == 'ByAdmin');
        setgenBadges(fetchedBadgesGen);
        //console.log(fetchedBadgesGen);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    fetchData();
  }, []);

  return (
    badges && genBadges ? (
      <ScrollView>
    <View style={styles.container}>

      <Text style={styles.header}>Badges</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('GenerateBadge' , { ba : genBadges})}>
          <Text style={styles.button}>Generate Badges Manually</Text>
        </TouchableOpacity>
      </View>
      {badges.map((badge: any) => (
        badge.type != 'ByAdmin' ? (
        <View style={styles.card} key={badge.badgesid}>
          <Text style={styles.cardHeader}>{badge.type}</Text>
          <View style={styles.badge}>
            <Image source={{uri: badge.image}} style={styles.badgeImage} />
            <View>
              <TouchableOpacity onPress={() => handleEstablishCriteria(badge)}>
                <Text style={styles.button}>Establish Criteria</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() =>Upload(badge)}>
                <Text style={styles.button}>Change Badge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        ) : (<View key={badge.badgesid} />)
      ))}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Establish Criteria: </Text>
          <ScrollView style={styles.criteriaContainer}>
            {criteriaArray.map((criterion, index) => (
              <View key={index}>
                <View style={styles.row}>
                  <Text style={styles.criteriaItem}>- {criterion} </Text>
                  <TouchableOpacity
                    onPress={() => toggleCriteriaSelection(index)}>
                    {activeCriterias.includes(index) ? (
                      <Text style={{color: '#0bda51'}}>✔</Text>
                    ) : (
                      <Text style={{color: 'red'}}>✖</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => saveActiveCriterias(selectedBadge)}>
            <Text style={styles.okButton}>save</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <View style={styles.card}>
          {file && (
            <View style={{padding: 20, borderRadius: 10, marginBottom: 40}}>
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

          <TouchableOpacity style={styles.button} onPress={pickDocument}>
            <Text>Pick a Badge</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
    </ScrollView>) : (<Loading/>)
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
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
   margin:10,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    margin: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  criteriaContainer: {
    maxHeight: 200,
    marginBottom: 15,
  },
  criteriaItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  okButton: {
    padding: 10,
    backgroundColor: Colors.secondary,
    color: 'white',
    borderRadius: 5,
    width: '50%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Criteria;
