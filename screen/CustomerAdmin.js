import React, {useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {useMyContextController} from '../store';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

export default function CustomerAdmin({navigation}) {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const [userLst, setUserlst] = React.useState([]);
  const cUSER = firestore().collection('USERS');

  const getRoleLabel = (role) => {
    switch (role) {
      case 'manange':
        return 'Lãnh đạo';
      case 'monitor':
        return 'Giám sát';
      case 'materials':
        return 'Vật tư';
      case 'file':
        return 'Hồ sơ';
      case 'person':
        return 'Nhân sự';
      default:
        return 'Chưa xác định';
    }
  };

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate('Signin');
    } else setIsAdmin(userLogin.role == 'manange');

    cUSER
      .where('role', 'in', ['monitor', 'manange','person','materials','file'])
      .orderBy('role', 'desc')
      .onSnapshot(response => {
        var arr = [];
        response.forEach(doc => arr.push(doc.data()));
        setUserlst(arr);
      });
  }, [userLogin]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProfileAllUser', {
            uid: item.uid,
            fullname: item.fullname,
            role: item.role,
            email: item.email,
            phone: item.phone,
          })
        }>
        <View style={styles.borderFlatlst}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'column',
              padding: 5,
              marginLeft: 5,
              marginRight: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Email: </Text>
              <Text style={{fontSize: 18}}>{item.email}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Tên:{' '}</Text>
              <Text style={{fontSize: 18}}>{item.fullname}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>SĐT: </Text>
              <Text style={{fontSize: 18}}>{item.phone}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Chức vụ: </Text>
              <Text style={{fontSize: 18}}>{getRoleLabel(item.role)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
        }}>
        {/* <IconButton
          icon={require('../asset/user-add.png')}
          size={30}
          iconColor="#ABB7D8"
          onPress={() => navigation.navigate('Signup')}
        /> */}
      </View>
      <FlatList
        data={userLst}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  borderFlatlst: {
    borderWidth: 1,
    borderColor: 'grey',
    marginBottom: 10,
    margin: 10,
    borderRadius: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
