import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { useMyContextController } from "../store";
import DatePicker from "react-native-date-picker";

export default function ServiceDetail({ navigation }) {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const dSERVICE = firestore().collection("JOBS");
  const route = useRoute();
  const { id } = route.params;
  const [service, setService] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [datetime, setDatetime] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Signin");
    } else {
      setIsAdmin(userLogin.role === "manange");
    }

    const confirmDelete = () => {
      Alert.alert(
        "Xác nhận xóa",
        "Bạn có chắn chắn muốn xóa không!",
        [
          {
            text: "Xóa",
            onPress: handleDelete,
          },
          {
            text: "Hủy",
            onPress: () => console.log("Hủy xóa"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    };

    const handleDelete = () => {
      dSERVICE
        .doc(id)
        .delete()
        .then(() => {
          Alert.alert("Xóa thành công");
          navigation.goBack();
        })
        .catch((e) => Alert.alert("Xóa thất bại", e.message));
    };

    if (isAdmin) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={confirmDelete}>
            <Icon
              source={require("../asset/dots.png")}
              size={30}
              color={"white"}
            />
          </TouchableOpacity>
        ),
      });
    }

    const getDetailService = () => {
      const unsubscribe = dSERVICE.doc(id).onSnapshot(
        (doc) => {
          if (doc.exists) {
            setService({ ...doc.data(), id: doc.id }); // Giữ ID trong state
          } else {
            setService(null); // Nếu không tìm thấy dịch vụ
          }
        },
        (error) => {
          console.error("Error fetching service detail:", error);
          Alert.alert("Lỗi", "Không thể tải dữ liệu dịch vụ.");
        }
      );

      return unsubscribe; // Trả về hàm huỷ kết nối
    };

    const unsubscribe = getDetailService();

    // Dọn dẹp listener khi component bị huỷ
    return () => {
      unsubscribe(); // Ngắt kết nối listener
    };
  }, [id, userLogin, isAdmin]);

  const handleButtonPress = () => {
    if (isAdmin) {
      navigation.navigate("UpdateService", { id: service.id }); // Sử dụng ID
    } else {
      handleAddNewApppoiment();
    }
  };

  const calculateDuration = (datestart, dateend) => {
    const startDate = new Date(datestart.split("-").reverse().join("-"));
    const endDate = new Date(dateend.split("-").reverse().join("-"));
    const timeDiff = endDate - startDate;
    const monthDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 30.44)); // Tính số tháng
    return monthDiff;
  };

  const calculateDurations = (datestart, dateend) => {
    const startDate = new Date(datestart.split("-").reverse().join("-"));
    const endDate = new Date(dateend.split("-").reverse().join("-"));
    const dayDiff = (endDate - startDate) / (1000 * 3600 * 24); // Tính số ngày
    return dayDiff;
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {service ? (
        <>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Ngày tạo: </Text>
              {service.createdAt}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Dự án: </Text>
              {service.name}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Giám sát: </Text>
              {service.monitor}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Hồ sơ: </Text>
              {service.filer}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Ngày bắt đầu: </Text>
              {service.datestart}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Ngày kết thúc: </Text>
              {service.dateend}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Thời hạn: </Text>
              {calculateDuration(service.datestart, service.dateend)} tháng (
              {calculateDurations(service.datestart, service.dateend)} ngày)
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Mô tả công việc: </Text>
              {service.description}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Phương tiện, cơ giới: </Text>
              {service.vehicle}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Đội công nhân (số lượng): </Text>
              {service.persons}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Ghi chú: </Text>
              {service.notes}
            </Text>
            <Text style={styles.txtTitle}>
              <Text style={styles.txtName}>Tài liệu: </Text>
              {service.files && service.files.length > 0 ? (
                service.files.map((file, index) => (
                  <Text key={index} style={styles.fileName}>
                    {file.name}
                  </Text>
                ))
              ) : (
                <Text>Không có tài liệu nào</Text>
              )}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.txtTitle}>Không tìm thấy hoặc đã xóa dịch vụ</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  txtName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  txtTitle: {
    fontSize: 18,
    paddingBottom: 15,
  },
});
