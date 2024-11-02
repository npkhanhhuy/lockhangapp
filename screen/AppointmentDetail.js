import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Alert} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {useMyContextController} from '../store';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';

const AppointmentDetail = ({navigation}) => {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const route = useRoute();
  const {id} = route.params;
  const APPOIMENTS = firestore().collection('APPOIMENTS');
  const [datetime, setDatetime] = useState(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const dSERVICE = firestore().collection('SERVICES');
  const [appoinment, setAppoinment] = useState('');
  const handleUpdateApppointment = () => {
    APPOIMENTS.doc(id)
      .update({
        datetime,
        stateUpdate: 'fix',
      })
      .then(e => console.log(e.meassage));
    navigation.goBack();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắn chắn muốn xóa không!',
      [
        {
          text: 'CANCEL',
          onPress: () => console.log('Hủy xóa'),
          style: 'cancel',
        },
        {
          text: 'DELETE',
          onPress: handleDelete,
        },
      ],
      {cancelable: false},
    );
  };

  const handleDelete = () => {
    APPOIMENTS.doc(id)
      .delete()
      .then(() => {
        Alert.alert('Delete susscess');
        navigation.goBack();
      })
      .catch(e => Alert.alert('Delete fail', e.message));
  };

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate('Signin');
    }

    const getDetailAppointment = APPOIMENTS.doc(id).onSnapshot(doc => {
      if (doc.exists) {
        const appointmentData = doc.data();
        const serviceId = appointmentData.serviceId;
        dSERVICE
          .doc(serviceId)
          .get()
          .then(serviceDoc => {
            if (serviceDoc.exists) {
              const serviceName = serviceDoc.data().serviceName;
              const price = serviceDoc.data().price;
              const image = serviceDoc.data().image;
              const appointmentWithServiceName = {
                ...appointmentData,
                serviceName: serviceName,
                price: price,
                image: image,
              };
              setAppoinment(appointmentWithServiceName);
            } else {
              console.log('Dịch vụ không tồn tại');
            }
          });
      } else getDetailAppointment(null);
    });
    return () => getDetailAppointment();
  }, [userLogin]);

  return (
    <View style={{flex: 1, padding: 20}}>
      {appoinment ? (
        <>
          <View style={{marginBottom: 10}}>
            {appoinment.image && (
              <Image source={{uri: appoinment.image}} style={{height: 300}} />
            )}
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text style={styles.txtName}>Tên khách hàng: </Text>
            <Text style={styles.txtTitle}>{appoinment.customerId}</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text style={styles.txtName}>Tên dịch vụ: </Text>
            <Text style={styles.txtTitle}>{appoinment.serviceName}</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text style={styles.txtName}>Giá: </Text>
            <Text style={styles.txtTitle}>{appoinment.price}</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text style={styles.txtName}>Thời gian: </Text>
            <Text style={styles.txtTitle}>
              {appoinment.datetime.toDate().toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#000',
              borderRadius: 5,
              padding: 5,
            }}>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                Thay đổi thời gian:{' '}
              </Text>
              <Text style={{fontSize: 18}}>
                {datetime.toLocaleDateString() +
                  ' ' +
                  datetime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>
          <DatePicker
            modal
            open={open}
            date={datetime}
            onConfirm={date => {
              setOpen(false);
              setDatetime(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <Button
            mode="contained"
            onPress={handleUpdateApppointment}
            style={{
              borderRadius: 5,
              backgroundColor: '#FF6666',
              marginTop: 10,
            }}
            disabled={appoinment.complete ? true : false}>
            Cập nhật
          </Button>
          <Button
            mode="contained"
            onPress={confirmDelete}
            style={{
              borderRadius: 5,
              backgroundColor: '#FF6666',
              marginTop: 10,
            }}
            disabled={appoinment.complete ? true : false}>
            Hủy dịch vụ
          </Button>
        </>
      ) : (
        <Text style={styles.txtTitle}>Không tìm thấy hoặc đã xóa dịch vụ</Text>
      )}
    </View>
  );
};

export default AppointmentDetail;

const styles = StyleSheet.create({
  txtName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  txtTitle: {
    fontSize: 18,
  },
});
