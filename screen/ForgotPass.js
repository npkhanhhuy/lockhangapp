import {Alert, ImageBackground, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import React from 'react';
import auth from '@react-native-firebase/auth';

function ForgotPass({navigation}) {
  const [email, setEmail] = React.useState('');
  const handlResetPass = () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => Alert.alert('Đã gửi xác nhận lấy lại mật khẩu về Email của bạn!'))
      .catch(e => Alert.alert(e.message));
  };
  return (
    <View style={styles.container}>
        <Text style={styles.headerName}>Quên mật khẩu</Text>
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
        <Button style={styles.button} mode="contained" onPress={handlResetPass}>
          Gửi mã xác nhận
        </Button>
        <View style={{flexDirection: 'column'}}>
          <Button onPress={() => navigation.navigate('Signin')}>
          <Text style={{color:"black"}}>Trở lại</Text>
          </Button>
        </View>
    </View>
  );
}
export default ForgotPass;

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#ABB7D8',
    flex:1,
    justifyContent:'center'
  },
  headerName: {
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2F4FF9',
  },
  imagebg:{
    flex:1,
    justifyContent: 'center',
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
