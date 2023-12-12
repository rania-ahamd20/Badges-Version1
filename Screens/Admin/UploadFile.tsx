/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {Card, Icon} from 'react-native-elements';

const UploadFile = ({route}:any) => {
  const [Badge, setBadge] = useState(route.params.Badge);
  const [file, setFile] :any = useState(null);
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

  const handleFileUpload = async () => {
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
        Alert.alert('File uploaded successfully!');

        axios
        .put(
          ' https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Badges/Update',
          {
            'badgesid':Badge.badgesid,
            'type': Badge.type,
            'text':Badge.text ,
            'image': responseData,
            'criteria': Badge.criteria,
            'activecriteria': Badge.activecriteria,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => {Alert.alert('Updated Successfully');})
        .catch(err => console.log(err));

          await setFile(null);

      } else {
        Alert.alert('Error uploading file', responseData.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      {file && (
        <View style={{padding: 20, borderRadius: 10, marginBottom: 40}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="file" type="font-awesome" size={30} style={{marginRight:10}} />
            <Text style={{flex: 1}}>{file[0].name || 'Unknown'}</Text>
          </View>
          <TouchableOpacity onPress={handleFileUpload}>
            <Text style={styles.button}>Upload</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.ButtonText}>Pick a Badge</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#0bda51',
    color: 'white',
    borderRadius: 5,
    margin:20,
    marginTop:30,
    textAlign: 'center',
    fontSize: 16,
  },
  ButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UploadFile;
