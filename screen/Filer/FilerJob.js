import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useMyContextController } from "../../store";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";

export default function FilerJob({ navigation }) {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const [jobList, setJobList] = useState([]);
  const [name, setName] = useState("");
  const [jobData, setJobData] = useState([]);
  const cJOBS = firestore().collection("JOBS");

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Signin");
      return; // Ngừng thực hiện nếu không có userLogin
    }

    const unsubscribe = cJOBS.onSnapshot((response) => {
      const arr = [];
      response.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });

      // Lọc danh sách dự án theo filer
      const filteredJobs = arr.filter(
        (job) => job.filer === userLogin.fullname
      );
      setJobList(arr); // Lưu toàn bộ dự án
      setJobData(filteredJobs); // Lưu danh sách dự án đã lọc
    });

    return () => unsubscribe(); // Ngắt kết nối khi component unmount
  }, [navigation, userLogin]);

  useEffect(() => {
    if (Array.isArray(jobList) && name && name.trim() !== "") {
      const normalizedSearchName = _.deburr(name.trim().toLowerCase());
      const filteredJobs = jobList.filter(
        (s) =>
          s.name &&
          _.deburr(s.name.toLowerCase()).includes(normalizedSearchName)
      );

      // Lọc jobData dựa trên tên tìm kiếm và filer
      setJobData(
        filteredJobs.filter((job) => job.filer === userLogin.fullname)
      );
    } else {
      setJobData(jobList.filter((job) => job.filer === userLogin.fullname)); // Nếu không có điều kiện lọc, gán jobData bằng jobList đã lọc
    }
  }, [name, jobList, userLogin.fullname]); // Thêm userLogin.fullname vào dependency array

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

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ServiceDetail", { id: item.id })}
      >
        <View style={styles.borderFlatlst}>
          <View
            style={{
              flexDirection: "column",
              paddingLeft: 10,
              marginBottom: 5,
            }}
          >
            <Text style={styles.txt}>
              <Text style={styles.bold}>Tên dự án:</Text> {item.name}
            </Text>
            <Text style={styles.txt}>
              <Text style={styles.bold}>Mô tả công việc:</Text>{" "}
              {item.description}
            </Text>
            <Text style={styles.txt}>
              <Text style={styles.bold}>Giám sát:</Text> {item.monitor}
            </Text>
            <Text style={styles.txt}>
              <Text style={styles.bold}>Hồ sơ:</Text> {item.filer}
            </Text>
            <Text style={styles.txt}>
              <Text style={styles.bold}>Thời hạn:</Text>{" "}
              {calculateDuration(item.datestart, item.dateend)} tháng (
              {calculateDurations(item.datestart, item.dateend)} ngày)
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ABB7D8" }}>
      <View style={{ flex: 1, backgroundColor: "#ABB7D8" }}>
        <Image
          source={require("../../asset/logo.png")}
          style={{
            alignSelf: "center",
            width: "100%",
            resizeMode: "stretch",
            marginTop: 5,
          }}
        />
        <TextInput
          label={"Tìm kiếm dự án"}
          value={name}
          onChangeText={setName}
          underlineColor="transparent"
          style={{
            margin: 10,
            backgroundColor: "white",
            borderRadius: 25,
            borderWidth: 1,
            borderColor: "grey",
          }}
        />
        <View
          style={{
            height: 50,
            backgroundColor: "#ABB7D8",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
            Danh sách dự án
          </Text>
        </View>
        <FlatList
          data={jobData}
          keyExtractor={(item) => item.id} // Sử dụng ID của dịch vụ làm key
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  borderFlatlst: {
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  txt: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
