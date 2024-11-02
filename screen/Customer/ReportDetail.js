import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";
import ImageViewing from "react-native-image-viewing";
import { useMyContextController } from "../../store";

const ReportDetail = ({ route }) => {
  const { date, reportId, scheduleId } = route.params;
  const [selectedShift, setSelectedShift] = useState("morning");
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reportInfo, setReportInfo] = useState({
    workers: "",
    work: "",
    location: "",
    vehicle: "",
    notesmorning: "",
    notesevening: "",
    imagesmorning: [],
    imagesevening: [],
    expected: "",
    workload: "",
    complete: "",
  });
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const [isMonitor, setIsMonitor] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const reportDoc = await firestore()
          .collection("report")
          .doc(scheduleId)
          .get();

        if (!reportDoc.exists)
          throw new Error("Schedule document does not exist.");

        const reportData = reportDoc.data();
        const reportDetail = reportData.reports.find(
          (report) => report.reportId === reportId
        );

        if (reportDetail) {
          setReportInfo({
            workers: reportDetail.workers || "",
            work: reportDetail.work || "",
            location: reportDetail.location || "",
            vehicle: reportDetail.vehicle || "",
            notesmorning: reportDetail.notesmorning || "",
            notesevening: reportDetail.notesevening || "",
            imagesmorning: reportDetail.imagesmorning || [],
            imagesevening: reportDetail.imagesevening || [],
            expected: reportDetail.expected || "",
            workload: reportDetail.workload || "",
            complete: reportDetail.complete || "",
          });
        } else {
          console.error("Report not found in the document.");
        }
      } catch (error) {
        console.error("Error fetching report: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Kiểm tra role từ userLogin
    const checkUserRole = () => {
      if (userLogin && userLogin.role === "monitor") {
        setIsMonitor(true);
      } else {
        setIsMonitor(false);
      }
    };

    fetchReport();
    checkUserRole();
  }, [scheduleId, reportId, userLogin]);

  const handleInputChange = (name, value) => {
    setReportInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const reportDoc = await firestore()
        .collection("report")
        .doc(scheduleId)
        .get();

      if (!reportDoc.exists)
        throw new Error("Schedule document does not exist.");

      const currentReports = reportDoc.data().reports || [];

      const updatedReports = currentReports.map((report) => {
        if (report.reportId === reportId) {
          const morningReport = {
            workers: reportInfo.workers || "",
            work: reportInfo.work || "",
            location: reportInfo.location || "",
            vehicle: reportInfo.vehicle || "",
            notesmorning: reportInfo.notesmorning || "",
            timemorning: formatDate(new Date()),
            imagesmorning: reportInfo.imagesmorning || [],
          };

          const afternoonReport = {
            expected: reportInfo.expected || "",
            workload: reportInfo.workload || "",
            complete: reportInfo.complete || "",
            notesevening: reportInfo.notesevening || "",
            timeevening: formatDate(new Date()),
            imagesevening: reportInfo.imagesevening || [],
          };

          return {
            ...report,
            ...(selectedShift === "morning" ? morningReport : afternoonReport),
          };
        }
        return report;
      });

      await firestore().collection("report").doc(scheduleId).update({
        reports: updatedReports,
      });

      Alert.alert("Thông báo", "Báo cáo đã được lưu thành công!");
    } catch (error) {
      console.error("Error saving report: ", error);
      Alert.alert(
        "Thông báo",
        "Đã xảy ra lỗi khi lưu báo cáo: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (field) => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 0 },
      async (response) => {
        if (response.didCancel) {
          console.warn("Image selection was canceled.");
          return;
        }

        if (response.assets) {
          const imageUris = response.assets.map((asset) => asset.uri);
          const urls = await Promise.all(
            imageUris.map(async (uri, index) => {
              try {
                const filename = `report/${date}/${field}/${index + 1}.png`;
                const reference = storage().ref(filename);
                await reference.putFile(uri);
                return await reference.getDownloadURL();
              } catch (error) {
                console.error("Error uploading image: ", error);
                return null; // return null or handle error
              }
            })
          );

          setReportInfo((prev) => {
            const existingUrls = prev[field] || [];
            return {
              ...prev,
              [field]: [...existingUrls, ...urls.filter(Boolean)], // filter out nulls
            };
          });
        }
      }
    );
  };

  const handleImagePress = (index) => {
    setCurrentImageIndex(index);
    setIsVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết báo cáo cho ngày: {date}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.shiftButton,
            selectedShift === "morning" && styles.selectedButton,
          ]}
          onPress={() => setSelectedShift("morning")}
        >
          <Text style={styles.shiftButtonText}>Sáng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.shiftButton,
            selectedShift === "afternoon" && styles.selectedButton,
          ]}
          onPress={() => setSelectedShift("afternoon")}
        >
          <Text style={styles.shiftButtonText}>Chiều</Text>
        </TouchableOpacity>
      </View>

      {selectedShift === "morning" ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhân công"
            value={reportInfo.workers}
            onChangeText={(text) => handleInputChange("workers", text)}
            editable={isMonitor}
          />
          <TextInput
            style={styles.input}
            placeholder="Công việc"
            value={reportInfo.work}
            onChangeText={(text) => handleInputChange("work", text)}
            editable={isMonitor}
          />
          <TextInput
            style={styles.input}
            placeholder="Vị trí"
            value={reportInfo.location}
            onChangeText={(text) => handleInputChange("location", text)}
            editable={isMonitor}
          />
          <TextInput
            style={styles.input}
            placeholder="Cơ giới"
            value={reportInfo.vehicle}
            onChangeText={(text) => handleInputChange("vehicle", text)}
            editable={isMonitor}
          />
          <TextInput
            style={styles.input}
            placeholder="Ghi chú"
            value={reportInfo.notesmorning}
            onChangeText={(text) => handleInputChange("notesmorning", text)}
            editable={isMonitor}
          />
          <Text>Ảnh minh chứng:</Text>
          <ScrollView horizontal>
            {reportInfo.imagesmorning.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(index)}
              >
                <Image source={{ uri: imageUri }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ImageViewing
            images={reportInfo.imagesmorning.map((uri) => ({ uri }))}
            imageIndex={currentImageIndex}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
          />
          {isMonitor && ( // Chỉ hiển thị nút thêm hình ảnh cho người dùng có role "monitor"
            <>
              <Button
                title="Thêm hình ảnh"
                onPress={() => handleAddImage("imagesmorning")}
              />
            </>
          )}
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhân công"
            value={reportInfo.workers}
            onChangeText={(text) => handleInputChange("workers", text)}
            editable={isMonitor}
          />
          <TextInput
            style={styles.input}
            placeholder="Công việc"
            value={reportInfo.work}
            onChangeText={(text) => handleInputChange("work", text)}
            editable={isMonitor}
          />
          <TextInput
            style={styles.input}
            placeholder="Vị trí"
            value={reportInfo.location}
            onChangeText={(text) => handleInputChange("location", text)}
            editable={isMonitor}
          />
          <TextInput
            style={styles.input}
            placeholder="Cơ giới"
            value={reportInfo.vehicle}
            onChangeText={(text) => handleInputChange("vehicle", text)}
            editable={isMonitor}
          />
          <TextInput
            style={styles.input}
            placeholder="Ghi chú"
            value={reportInfo.notesevening}
            onChangeText={(text) => handleInputChange("notesevening", text)}
            editable={isMonitor}
          />
          <ScrollView horizontal>
            {reportInfo.imagesevening.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(index)}
              >
                <Image source={{ uri: imageUri }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ImageViewing
            images={reportInfo.imagesevening.map((uri) => ({ uri }))}
            imageIndex={currentImageIndex}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
          />
          {isMonitor && ( // Chỉ hiển thị nút thêm hình ảnh cho người dùng có role "monitor"
            <>
              <Button
                title="Thêm hình ảnh"
                onPress={() => handleAddImage("imagesevening")}
              />
            </>
          )}
        </>
      )}

      {isMonitor && ( // Chỉ hiển thị nút "Lưu" cho người dùng có role "monitor"
        <Button title="Lưu" onPress={handleSubmit} />
      )}
    </View>
  );
};

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
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  shiftButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: "#007bff",
  },
  shiftButtonText: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  imageContainer: {
    flexDirection: "row", // Hiển thị theo hàng ngang
    flexWrap: "wrap", // Nếu muốn cho ảnh xuống hàng khi hết chỗ
    justifyContent: "flex-start", // Hoặc 'space-between' tùy theo cách bạn muốn căn giữa
  },
  imageWrapper: {
    margin: 5, // Khoảng cách giữa các ảnh
  },
  image: {
    width: 100, // Chiều rộng 50
    height: 100, // Chiều cao 50
    borderRadius: 5, // Nếu bạn muốn bo tròn góc
  },
  imageUrl: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  btnimage: {
    width: 50,
  },
});

export default ReportDetail;
