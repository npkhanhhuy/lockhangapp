import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; // Import Picker

const ScheduleDetail = ({ route }) => {
  const navigation = useNavigation();
  const { jobid } = route.params;
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]); // Lưu lịch trình đã lọc
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Lưu hạng mục đã chọn
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await firestore()
          .collection("categories")
          .where("jobId", "==", jobid)
          .get();

        const categoriesData = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    const fetchSchedules = async () => {
      try {
        if (!jobid) throw new Error("jobId is missing");

        const scheduleDoc = await firestore()
          .collection("schedules")
          .doc(jobid)
          .get();

        if (!scheduleDoc.exists) throw new Error("Schedule not found");

        const schedulesData = scheduleDoc.data().schedules || [];
        setSchedules(schedulesData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching schedules: ", error);
      }
    };

    fetchCategories();
    fetchSchedules();
  }, [jobid]);

  useEffect(() => {
    // Lọc các schedules dựa trên category đã chọn
    if (selectedCategory) {
      const filteredData = schedules.filter(
        (item) => item.category === selectedCategory
      );
      setFilteredSchedules(filteredData);
    } else {
      setFilteredSchedules(schedules); // Hiển thị tất cả khi chưa chọn
    }
  }, [selectedCategory, schedules]);

  const findCategoryLabel = (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.label : "Không có hạng mục";
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Month - 1 vì tháng trong JavaScript bắt đầu từ 0
  };

  const getDateArray = (start, end) => {
    const dateArray = [];
    const startDate = parseDate(start);
    const endDate = parseDate(end);

    // Sử dụng vòng lặp để tạo mảng các ngày
    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      // Định dạng ngày (DD-MM-YYYY)
      const day = String(dt.getDate()).padStart(2, "0");
      const month = String(dt.getMonth() + 1).padStart(2, "0");
      const year = dt.getFullYear();
      dateArray.push(`${day}-${month}-${year}`);
    }
    return dateArray;
  };

  const handlePress = async (item) => {
    const dates = getDateArray(item.datestart, item.dateend);

    // Tạo ID ngẫu nhiên cho các báo cáo
    const reports = dates.map((date) => ({
      date,
      reportId: `rp-${Math.random().toString(36).substr(2, 9)}-${date}`,
    }));

    try {
      // Kiểm tra xem báo cáo đã tồn tại chưa
      const reportDoc = await firestore()
        .collection("report")
        .doc(item.id)
        .get();

      if (reportDoc.exists) {
        // Nếu báo cáo đã tồn tại, chuyển hướng đến trang xem báo cáo
        navigation.navigate("ListReport", { scheduleId: item.id });
      } else {
        // Nếu chưa tồn tại, tạo document mới trong collection reports
        await firestore().collection("report").doc(item.id).set({
          scheduleId: item.id,
          reports,
        });

        // Chuyển hướng đến trang ListReport và truyền scheduleId
        navigation.navigate("ListReport", { scheduleId: item.id });
      }
    } catch (error) {
      console.error("Error checking or creating report: ", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.scheduleItem}>
          <View style={styles.row}>
            <Text style={styles.bold}>Ngày thi công: </Text>
            <Text>
              {item.datestart} đến {item.dateend}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Hạng mục: </Text>
            <Text>{findCategoryLabel(item.category)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Mô tả công việc: </Text>
            <Text>{item.work || "Không có công việc"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Nhân công: </Text>
            <Text>{item.workers || "Không có nhân công"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Cơ giới: </Text>
            <Text>{item.vehicle || "Không có cơ giới"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.title}>Chọn Hạng Mục:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Tất cả hạng mục" value="" />
        {categories.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.label}
            value={category.value}
          />
        ))}
      </Picker>
      <FlatList
        data={filteredSchedules} // Hiển thị lịch trình đã lọc
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ScheduleDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ABB7D8",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  scheduleItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    elevation: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
