import React, {useState} from 'react';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useMyContextController} from '../store';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

export default function AddNewService({navigation}) {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const [serviceName, setServiceName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const hasErrorServiceName = () => serviceName == '';
  const [image, setImage] = useState('');
  const SERVICES = firestore().collection('SERVICES');
  const handleAddNewService = () => {
    SERVICES.add({
      serviceName,
      price,
      createBy: userLogin.fullname,
    })
      .then(respone => {
        const refImage = storage().ref('/services/' + respone.id + '.png');
        if (image != '') {
          refImage
            .putFile(image)
            .then(() => {
              refImage
                .getDownloadURL()
                .then(link => SERVICES.doc(respone.id).update({image: link}));
            })
            .catch(e => console.log(e.message));
        }
        SERVICES.doc(respone.id).update({id: respone.id});
        Alert.alert('Add new service success');
        navigation.goBack();
      })
      .catch(e => Alert.alert('Add new service fail'));
  };
  const hasErrorPrice = () => price <= 0;

  const handleUploadImage = () => {
    ImagePicker.openPicker({
      height: 300,
      width: 400,
      mediaType: 'photo',
      cropping: true,
    })
      .then(image => setImage(image.path))
      .catch(e => console.log(e.message));
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      {image != '' && <Image source={{uri: image}} style={{height: 300}} />}
      <Text style={styles.text}>Dịch vụ: </Text>
      <TextInput
        style={styles.inputText}
        label="Thêm tên dịch vụ mới"
        value={serviceName}
        onChangeText={setServiceName}
        underlineColor="transparent"
        underlineStyle={0}
      />
      <Text style={styles.text}>Giá: </Text>
      <TextInput
        keyboardType="numeric"
        style={styles.inputText}
        label="Giá"
        value={price}
        onChangeText={setPrice}
        underlineColor="transparent"
        underlineStyle={0}
      />
      <Button onPress={handleUploadImage}>Cập nhật ảnh</Button>
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleAddNewService}>
        Thêm
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputText: {
    backgroundColor: 'none',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: 'grey',
    borderWidth: 1,
  },
  button: {
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#FF6666',
  },
});
