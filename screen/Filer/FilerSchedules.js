import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useMyContextController } from "../../store";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";

export default function FilterSchedules({ navigation }) {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const [scheduleList, setScheduleList] = useState([]);
  const [name, setName] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const cSCHEDULES = firestore().collection("schedules");
  const cJOBS = firestore().collection("JOBS"); // Đúng là collection JOBS

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Signin");
      return;
    }

    // Lấy danh sách JOBS
    const unsubscribeJobs = cJOBS.onSnapshot((response) => {
      const jobs = {};
      response.forEach((doc) => {
        jobs[doc.id] = doc.data(); // Lưu thông tin JOB vào đối tượng
      });

      // Lấy danh sách lịch trình
      const unsubscribeSchedules = cSCHEDULES.onSnapshot((response) => {
        const arr = [];
        response.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });

        // Lọc lịch trình dựa trên createdBy và giá trị filer từ JOBS
        const filteredSchedules = arr.filter((schedule) => {
          const jobId = schedule.jobid; // Giả sử jobid là ID của JOB
          const jobFiler = jobs[jobId]?.filer; // Lấy filer của JOB tương ứng
          const jobMonitor = jobs[jobId]?.monitor; // Lấy monitor của JOB tương ứng

          // Kiểm tra điều kiện: createdBy phải là monitor và tồn tại filer
          return jobFiler === userLogin.fullname; // Chỉ hiển thị nếu filer = fullname đăng nhập
        });

        setScheduleList(filteredSchedules);
      });

      return () => unsubscribeSchedules(); // Đảm bảo hủy bỏ unsubscribeSchedules khi component unmount
    });

    return () => {
      unsubscribeJobs(); // Hủy bỏ khi component unmount
    };
  }, [navigation, userLogin]);

  useEffect(() => {
    if (Array.isArray(scheduleList) && name && name.trim() !== "") {
      const normalizedSearchName = _.deburr(name.trim().toLowerCase());
      const filtered = scheduleList.filter(
        (s) =>
          s.projectName &&
          _.deburr(s.projectName.toLowerCase()).includes(normalizedSearchName)
      );

      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(scheduleList); // Nếu không có điều kiện lọc, gán lại filteredSchedules
    }
  }, [name, scheduleList]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ScheduleDetail", { jobid: item.jobid })
        }
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
  searchInput: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "grey",
  },
  scheduleInfo: {
    flexDirection: "column",
    paddingLeft: 10,
    marginBottom: 5,
  },
});
