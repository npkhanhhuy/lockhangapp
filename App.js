import React, { useEffect } from 'react';
import {PaperProvider,} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './routers/MyStack';
import {MyContextControllerProvider} from './store';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const App = () => {
  const USERS = firestore().collection("USERS")
  const manange = {
    fullname: "LocKhang",
    email: "lockhang@gmail.com",
    password: "123456",
    phone: "0946276072",
    role: "manange"
  }
  useEffect(()=>{
    USERS.doc(manange.email)
    .onSnapshot(
      u => {
        if (!u.exists)
        {
          auth().createUserWithEmailAndPassword(manange.email, manange.password)
          .then(response =>
            {
              USERS.doc(manange.email).set(manange)
              console.log("Tạo tài khoản manange thành công")
            })
        }
      }
    )
  }, [])

  return(
  <MyContextControllerProvider>
    <PaperProvider>
      <NavigationContainer>
        <MyStack/>
      </NavigationContainer>
    </PaperProvider>
  </MyContextControllerProvider>
  )
};
export default App;