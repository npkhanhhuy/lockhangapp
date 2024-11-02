import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Button, Text, TextInput} from 'react-native-paper';
import {useMyContextController} from '../store';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

export default function EditProfile({route, navigation}) {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [imageAvatar, setImageAvatar] = React.useState('');
  const id = 0;

  const USERS = firestore().collection('USERS');
  

  useEffect(() => {
    if (userLogin == null) navigation.navigate('Signin');
    const showInfo = USERS.doc(userLogin.uid).onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        setFullname(userData.fullname);
        setPhone(userData.phone);
        setImageAvatar(userData.image);
      } else {
        //Alert.alert('User not found');
      }
    });

    return () => {
      showInfo();
    };
  }, [userLogin]);

  const updateInfo = async () => {
    if (!userLogin || !userLogin.uid) {
      Alert.alert('Lỗi', 'Người dùng không hợp lệ.');
      return;
    }
  
    try {
      console.log('Updating user info:', { fullname, phone, imageAvatar });
  
      // Sử dụng UID để cập nhật thông tin
      await USERS.doc(userLogin.uid).update({
        fullname,
        phone,
      });
  
      if (imageAvatar && !imageAvatar.startsWith('https://')) {
        const imageRef = storage().ref(`/avatar/${userLogin.email}.png`);
        await imageRef.putFile(imageAvatar); // Tải lên tệp hình ảnh mới
        const link = await imageRef.getDownloadURL();
        
        // Cập nhật URL hình ảnh trong Firestore
        await USERS.doc(userLogin.uid).update({ image: link });
      }
  
      Alert.alert('Cập nhật thành công');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng: ', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };
  
  

  const handleImageUpload = () => {
    ImagePicker.openPicker({
      height: 300,
      width: 400,
      mediaType: 'photo',
      cropping: true,
    })
      .then(image => {
        setImageAvatar(image.path);
      })
      .catch(e => console.log(e.message));
  };

  return (
    <View style={{flex: 1}}>
      <View style={[{flex: 1, backgroundColor: '#ABB7D8'}, styles.avatar]}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Avatar.Image
            style={{
              height: 154,
              width: 154,
              borderColor: 'white',
              borderWidth: 2,
            }}
            size={150}
            source={
              imageAvatar ? {uri: imageAvatar} : require('../asset/firebase.png')
            }
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, padding: 10}}>
        <View>
          <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
            Tên:{' '}
          </Text>
          <TextInput
            style={styles.textInput}
            label="Họ và Tên"
            value={fullname}
            onChangeText={setFullname}
          />
        </View>
        <View>
          <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
            Số điện thoại:{' '}
          </Text>
          <TextInput
            style={styles.textInput}
            label="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        <Button style={styles.button} mode="contained" onPress={updateInfo}>
          Cập nhật
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
    marginTop: 20,
    margin: 10,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 10,
    backgroundColor: null,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    fontSize: 18,
  },
  button: {
    borderRadius: 100,
    marginTop: 20,
    padding: 5,
    backgroundColor: '#2F4FF9',
  },
});
