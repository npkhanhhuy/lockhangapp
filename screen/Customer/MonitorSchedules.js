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

export default function MonitorSchedules({ navigation }) {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const [scheduleList, setScheduleList] = useState([]);
  const [name, setName] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const cSCHEDULES = firestore().collection("schedules");

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Signin");
      return;
    }

    const unsubscribe = cSCHEDULES.onSnapshot((response) => {
      const arr = [];
      response.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      setScheduleList(
        arr.filter((schedule) => schedule.createdBy === userLogin.fullname)
      ); // Lọc danh sách lịch trình theo createdBy
      setFilteredSchedules(
        arr.filter((schedule) => schedule.createdBy === userLogin.fullname)
      ); // Lọc cho danh sách hiển thị
    });

    return () => unsubscribe();
  }, [navigation, userLogin]);

  useEffect(() => {
    if (Array.isArray(scheduleList) && name && name.trim() !== "") {
      const normalizedSearchName = _.deburr(name.trim().toLowerCase());
      const filtered = scheduleList.filter(
        (s) =>
          s.projectName && // Giả sử bạn có trường `title` trong tài liệu lịch trình
          _.deburr(s.projectName.toLowerCase()).includes(normalizedSearchName)
      );

      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(scheduleList); // Nếu không có điều kiện lọc, gán filteredSchedules bằng scheduleList
    }
  }, [name, scheduleList]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ScheduleDetail", { jobid: item.jobid })
        } // Chuyển đến trang chi tiết lịch trình
      >
        <View style={styles.borderFlatlst}>
          <View style={styles.scheduleInfo}>
            <Text style={styles.txt}>
              <Text style={styles.bold}>Dự án:</Text> {item.projectName}
            </Text>
            <Text style={styles.txt}>
              <Text style={styles.bold}>Giám sát:</Text> {item.createdBy}
            </Text>
            <Text style={styles.txt}>
              <Text style={styles.bold}>Ngày tạo:</Text> {item.createdAt}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ABB7D8" }}>
      <View style={{ flex: 1, backgroundColor: "#ABB7D8" }}>
        <TextInput
          label={"Tìm kiếm lịch trình"}
          value={name}
          onChangeText={setName}
          underlineColor="transparent"
          style={styles.searchInput}
        />
        <FlatList
          data={filteredSchedules}
          keyExtractor={(item) => item.id}
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
  logo: {
    alignSelf: "center",
    width: "100%",
    resizeMode: "stretch",
    marginTop: 5,
  },
  searchInput: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "grey",
  },
  header: {
    height: 50,
    backgroundColor: "#ABB7D8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  scheduleInfo: {
    flexDirection: "column",
    paddingLeft: 10,
    marginBottom: 5,
  },
});
