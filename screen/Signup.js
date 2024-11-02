import {Alert, ImageBackground, StyleSheet, View} from 'react-native';
import {Button, TextInput, Text} from 'react-native-paper';
import React from 'react';
import '@react-native-firebase/app';
import {signup} from '../store' 

function Signup({navigation}) {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [fullname, setFullname] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [role, setRole] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleCreateAccount = () => {
    signup(email, pass, fullname, phone, role);
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerName}>Thêm Nhân Viên</Text>
      <TextInput
        style={styles.textInput}
        label={'Email'}
        value={email}
        onChangeText={setEmail}
        underlineColor="transparent"
        underlineStyle={0}
        textColor='black'
        theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
      />
      <TextInput
        style={styles.textInput}
        secureTextEntry={!showPass}
        label={'Mật khẩu'}
        value={pass}
        onChangeText={setPass}
        underlineColor="transparent"
        underlineStyle={0}
        textColor='black'
        theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
        right={
          <TextInput.Icon
          icon={showPass ? require('../asset/eye-hidden.png') : require('../asset/eye.png')}
          onPress={() => setShowPass(!showPass)}/>
        }
      />
      <TextInput
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={(text) => { setConfirmPassword(text); }}
          style={styles.textInput}
          secureTextEntry={!showPass}
          underlineColor="transparent"
          underlineStyle={0}
          textColor='black'
          theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
          right={
            <TextInput.Icon
            icon={showPass ? require('../asset/eye-hidden.png') : require('../asset/eye.png')}
            onPress={() => setShowPass(!showPass)}/>
          }        
      />
      <TextInput
        style={styles.textInput}
        label={'Họ và Tên'}
        value={fullname}
        onChangeText={setFullname}
        underlineColor="transparent"
        underlineStyle={0}
        textColor='black'
        theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
      />
      <TextInput
        style={styles.textInput}
        label={'Số điện thoại'}
        value={phone}
        onChangeText={setPhone}
        underlineColor="transparent"
        underlineStyle={0}
        textColor='black'
        theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
      />
      <TextInput
        style={styles.textInput}
        label={'Chức vụ'}
        value={role}
        onChangeText={setRole}
        underlineColor="transparent"
        underlineStyle={0}
        textColor='black'
        theme={{colors:{primary:"black",onSurfaceVariant:"black"}}}
      />
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleCreateAccount}>
        Thêm tài khoản
      </Button>
    </View>
  );
}
export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ABB7D8',
    justifyContent:'center'
  },
  headerName: {
    alignSelf: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2F4FF9',
  },

  textInput: {
    alignSelf:'center',
    width:350,
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
    borderRadius: 10,
    marginTop: 20,
    padding: 5,
    backgroundColor: 'red',
    width:200,
    alignSelf:'center'
  },
});
