/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {View, Button, Text, Alert, ScrollView} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {Image} from 'react-native-elements';

const UploadFileComponent = () => {
  const [file, setFile]: any = useState(null);
  const [image, setimageurl]: any = useState(null);

  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      }).then((res: any) => {
        setFile(res);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
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
        type: file[0].type || 'application/octet-stream', // use a default type if not available
        name: file[0].name || 'file', // use a default name if not available
      });


      const response = await axios.post(' https://a1e8-2a01-9700-1108-6f00-69b2-6829-7765-ea85.ngrok-free.app/api/Upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      );

      const responseData = response.data;
      if (response.status === 200) {
       // console.log('Data', responseData);
        await setimageurl(responseData);
        Alert.alert('File uploaded successfully!');
      } else {
        Alert.alert('Error uploading file', responseData.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <ScrollView>
      <Button title="Pick Document" onPress={pickDocument} />
      {file && (
        <View>
          <Text>{`File Name: ${file[0].name || 'Unknown'}`}</Text>
          <Text>{`File Type: ${
            file[0].type || 'application/octet-stream'
          }`}</Text>
          <Text>{`File URI: ${file[0].uri || 'Unknown'}`}</Text>
          <Button title="Upload File" onPress={handleFileUpload} />
        </View>
      )}
      {image && (
        <View>
          <Text>{image}</Text>
          <Image source={{uri: image}} style={{width: 400, height: 500}} />
        </View>
      )}
    </ScrollView>
  );
};

export default UploadFileComponent;
