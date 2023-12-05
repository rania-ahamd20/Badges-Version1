/* eslint-disable prettier/prettier */

import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Colors from '../../constants/Colors';
import axios from 'axios';

const CreateBadge = ({navigation}: any) => {
  const [textInput, setTextInput] = useState('');
  const [file, setFile] :any = useState(null);

  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
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

  const handleCreate = async () => {
    if (!file) {
      Alert.alert('Image Required');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file[0].uri,
        type: file[0].type || 'image/jpeg',
        name: file[0].name || 'image.jpg',
      });

      const uploadResponse :any = await axios.post(
        'https://a1e8-2a01-9700-1108-6f00-69b2-6829-7765-ea85.ngrok-free.app/api/Upload/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const uploadedImageUrl = uploadResponse.data;
      if (uploadResponse.status === 200) {
        const badgeCreationResponse = await axios.post(
          'https://a1e8-2a01-9700-1108-6f00-69b2-6829-7765-ea85.ngrok-free.app/api/Badges/Create',
          {
            type: 'ByAdmin',
            text: textInput,
            image: uploadedImageUrl,
            criteria: null,
            activecriteria: null,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        console.log(badgeCreationResponse.data);
        Alert.alert('Created Successfully');
        navigation.navigate('GenerateBadge');
      } else {
        Alert.alert('Error uploading file', uploadResponse.message);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
       <Text style={styles.title}>
       Start a new badge challenge!
      </Text>
      <View style={styles.card}>
      <Text style={styles.text}>Badge Name :</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={textInput}
        onChangeText={text => setTextInput(text)}
      />
      <View style={styles.rowContainer}>
        <TextInput
          style={styles.input2}
          placeholder="Selected image URL"
          value={file ? file[0].uri : ''}
          editable={false}
        />
        <TouchableOpacity style={styles.button} onPress={pickDocument}>
          <Text style={styles.buttonText}>Pick</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Badge</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    margin: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    
  },
  input: {
    height: 40,
    width: 300,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  input2: {
    height: 40,
    width: 200,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontWeight: 'bold',
    marginHorizontal:10,
  },
});
export default CreateBadge;