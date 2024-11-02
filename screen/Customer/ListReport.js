import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

const ListReport = ({ route, navigation }) => {
  const { scheduleId } = route.params; // Nhận scheduleId từ tham số
  const [dates, setDates] = useState([]); // Trạng thái để lưu danh sách các ngày
  const [error, setError] = useState(null); // Trạng thái để lưu thông báo lỗi

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Lấy document từ collection report với scheduleId
        const reportDoc = await firestore()
          .collection("report")
          .doc(scheduleId) // Lấy document theo scheduleId
          .get();

        // Kiểm tra xem document có tồn tại không
        if (!reportDoc.exists) {
          throw new Error("Report not found");
        }

        // Lấy danh sách các ngày từ document
        const reportData = reportDoc.data();
        setDates(reportData.reports || []); // Lưu trữ danh sách các ngày
      } catch (error) {
        setError(error.message); // Lưu trữ thông báo lỗi
        console.error("Error fetching reports: ", error);
      }
    };

    fetchReports();
  }, [scheduleId]); // Chạy lại khi scheduleId thay đổi

  const handleDatePress = (date, reportId) => {
    // Chuyển hướng đến trang báo cáo cho ngày được chọn
    navigation.navigate("ReportDetail", { date, reportId, scheduleId });
  };

  // Trong renderItem, khi hiển thị từng ngày:
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleDatePress(item.date, item.reportId)}
      >
        <Text style={styles.dateItem}>{item.date}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {/* Hiển thị thông báo lỗi nếu có */}
      <FlatList
        data={dates}
        keyExtractor={(item) => item.reportId} // Sử dụng reportId làm key
        renderItem={renderItem}
      />
    </View>
  );
};

export default ListReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dateItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
