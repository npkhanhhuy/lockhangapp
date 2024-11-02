import React, {useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useMyContextController} from '../store';

export default function ChangePassword({navigation}) {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const [curenPassword, setCurenPassword] = React.useState('');
  const [newPassword, setNewPassWord] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    if (userLogin == null) navigation.navigate('Signin');
  }, [userLogin]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const reauthenticate = curenPassword => {
    var user = auth().currentUser;
    var cred = auth.EmailAuthProvider.credential(user.email, curenPassword);
    return user.reauthenticateWithCredential(cred);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Mật khẩu không khớp');
      return;
    }
  
    try {
      // Lấy user hiện tại
      const user = auth().currentUser;
  
      // Đảm bảo rằng người dùng đã đăng nhập
      if (!user) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập.');
        return;
      }
  
      // Thực hiện xác thực lại với mật khẩu hiện tại
      await reauthenticate(curenPassword);
  
      // Cập nhật mật khẩu trong Authentication
      await user.updatePassword(newPassword);
  
      // Cập nhật mật khẩu trong Firestore
      const userDocRef = firestore().collection('USERS').doc(user.uid); // Sử dụng UID
      await userDocRef.update({ password: newPassword });
  
      Alert.alert('Đổi mật khẩu thành công !');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Lỗi khi cập nhật mật khẩu: ', error);
      Alert.alert('Lỗi', 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
    }
  };
  
  
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ABB7D8',
        padding: 30,
      }}>
      <TextInput
        secureTextEntry={!showPassword}
        label={'Mật khẩu hiện tại'}
        style={styles.txtInput}
        value={curenPassword}
        onChangeText={setCurenPassword}
        theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
      />
      <TextInput
        secureTextEntry={!showPassword}
        label={'Mật khẩu mới'}
        style={styles.txtInput}
        value={newPassword}
        onChangeText={setNewPassWord}
        theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
      />
      <TextInput
        secureTextEntry={!showPassword}
        label={'Nhập lại mật khẩu mới'}
        style={styles.txtInput}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
      />
      <Button onPress={toggleShowPassword}>
        {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      </Button>
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleChangePassword}>
        Chấp nhận
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  txtInput: {
    marginBottom: 10,
    backgroundColor: '#D9D9D9',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1,
    borderColor: 'grey',
  },
  button: {
    alignSelf:'center',
    width:150,
    borderRadius: 100,
    marginTop: 20,
    padding: 5,
    backgroundColor: '#2F4FF9',
  },
});
