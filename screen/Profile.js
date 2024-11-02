import React, {useEffect, useState} from 'react';
import {StyleSheet, View,Image} from 'react-native';
import {Avatar, Button, Icon, Text} from 'react-native-paper';
import {useMyContextController} from '../store';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [imageAvatar, setImageAvatar] = useState('');
  const isFocused = useIsFocused(); // Sử dụng useIsFocused để kiểm tra trạng thái focus của màn hình

  useEffect(() => {
    // Điều hướng đến trang Signin nếu userLogin không tồn tại
    if (!userLogin) {
      navigation.navigate('Signin');
      return;
    }

    // Hàm để tải thông tin người dùng từ Firestore
    const loadInfo = async () => {
      try {
        const userDoc = await firestore()
          .collection('USERS')
          .doc(userLogin.uid) // Sử dụng UID của userLogin
          .get();
          
        if (userDoc.exists) {
          const userData = userDoc.data();
          setFullname(userData.fullname || '');
          setPhone(userData.phone || '');
          setImageAvatar(userData.image || '');
        } else {
          console.log('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    // Gọi hàm loadInfo mỗi khi màn hình Profile được focus
    if (isFocused) {
      loadInfo(); // Tải lại thông tin khi quay lại trang thông tin cá nhân
    }
  }, [isFocused, userLogin, navigation]);


  return (
    <View style={styles.container}>
      <View style={[{flex: 1, backgroundColor: '#ABB7D8'}, styles.avatar]}>
        <Avatar.Image
          style={{
            height: 154,
            width: 154,
            borderColor: 'white',
            borderWidth: 2,
          }}
          size={150}
          source={imageAvatar ? {uri: imageAvatar} : require('../asset/firebase.png')}
        />
      </View>
      <View style={styles.containerInfo}>
        <View style={styles.viewTxt}>
          <Icon source={require('../asset/account.png')} size={30} />
          <Text style={styles.txt}>Tên: </Text>
          <Text style={styles.txtInfo}>
            {userLogin !== null && userLogin.fullname}
          </Text>
        </View>
        <View style={styles.viewTxt}>
          <Icon source={require('../asset/email.png')} size={30} />
          <Text style={styles.txt}>Email: </Text>
          <Text style={styles.txtInfo}>
            {userLogin !== null && userLogin.email}
          </Text>
        </View>
        <View style={styles.viewTxt}>
          <Icon source={require('../asset/phone.png')} size={30} />
          <Text style={styles.txt}>Số điện thoại: </Text>
          <Text style={styles.txtInfo}>
            {userLogin !== null && userLogin.phone}
          </Text>
        </View>
        <View style={{flexDirection: 'row',justifyContent:'flex-end'}}>
          <Button onPress={() => navigation.navigate('ChangePass')} style={{backgroundColor:'#ABB7D8',}}>
            <Text style={{color:"black"}}>Đổi mật khẩu</Text>
          </Button>
        </View>
        <Button
          style={styles.logoutBtn}
          mode="contained"
          onPress={() =>
            navigation.navigate('EditProfile', {
              email: userLogin.email,
            })
          }>
          Sửa thông tin
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
  viewTxt: {
    flexDirection: 'row',
    margin: 10,
  },
  txt: {
    marginLeft: 10,
    marginRight: 5,
    fontWeight: 'bold',
    fontSize: 20,
  },
  txtInfo: {
    fontSize: 20,
  },
  logoutBtn: {
    margin: 10,
    marginTop: 100,
    borderRadius: 100,
    padding: 10,
    backgroundColor: '#2F4FF9',
  },
});
