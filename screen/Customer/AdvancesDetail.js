import { StyleSheet, Text, View, Button, Image } from "react-native";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";

const AdvancesDetail = ({ route }) => {
  const { advanceid, userId } = route.params;
  const [advance, setAdvance] = useState(null);
  const [role, setRole] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for temporary image preview
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  // Fetch advance detail function moved outside useEffect
  const fetchAdvanceDetail = async () => {
    try {
      const doc = await firestore().collection("advances").doc(userId).get();
      if (doc.exists) {
        const advances = doc.data().advances || [];
        const advanceDetail = advances.find(
          (adv) => adv.advanceid === advanceid
        );

        if (advanceDetail) {
          setAdvance(advanceDetail);
        } else {
          console.log("Advance detail not found for advanceid:", advanceid);
          alert("Không tìm thấy chi tiết ứng tiền.");
        }
      } else {
        console.log("No document found for userId:", userId);
        alert("Không tìm thấy tài liệu cho người dùng.");
      }
    } catch (error) {
      console.error("Error fetching advance details:", error);
    }
  };

  const fetchUserRole = async (currentUserId) => {
    try {
      const userDoc = await firestore()
        .collection("USERS")
        .doc(currentUserId)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setRole(userData.role);
      } else {
        console.log("No document found for userId:", currentUserId);
        alert("Không tìm thấy tài liệu người dùng.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchUserLoginRole = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      await fetchUserRole(currentUser.uid);
    } else {
      alert("Không có người dùng đăng nhập.");
    }
  };

  useEffect(() => {
    fetchAdvanceDetail();
    fetchUserLoginRole();
  }, [advanceid, userId]);

  const getCurrentDateTime = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  const handleStatusChange = async (statusType) => {
    try {
      let newStatus = advance.status;
      let transferDate = getCurrentDateTime();

      if (statusType === "approve") {
        newStatus = "Đã duyệt";
      } else if (statusType === "reject") {
        newStatus = "Từ chối";
      } else if (role === "accountant") {
        newStatus = "Đã chuyển";
        transferDate = transferDate;
        if (!proofImage) {
          alert("Vui lòng tải lên hình ảnh minh chứng.");
          return;
        }
      }

      // Fetch the current advance data before updating
      const docRef = firestore().collection("advances").doc(userId);
      const doc = await docRef.get();

      if (doc.exists) {
        const currentData = doc.data();
        const advances = currentData.advances || [];

        // Find the specific advance to update
        const advanceIndex = advances.findIndex(
          (adv) => adv.advanceid === advanceid
        );

        if (advanceIndex !== -1) {
          // Create a new advances array with updated status and image
          advances[advanceIndex] = {
            ...advances[advanceIndex], // Keep existing fields
            status: newStatus,
            image: proofImage || advances[advanceIndex].image,
            transferDate: transferDate || advances[advanceIndex].transferDate,
          };

          // Update Firestore with the modified advances array
          await docRef.update({
            advances: advances,
          });

          // Call fetchAdvanceDetail to reload data
          await fetchAdvanceDetail();
        }
      }
      setIsImageUploaded(false);
    } catch (error) {
      console.error("Error changing advance status:", error);
    }
  };

  const handleImageUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (!result.didCancel && result.assets) {
      const imageUri = result.assets[0].uri;
      const fileName = imageUri.substring(imageUri.lastIndexOf("/") + 1);

      // Create a reference in Storage
      const reference = storage().ref(`advances/${userId}/${fileName}`);

      // Upload the image
      await reference.putFile(imageUri);
      // Get download URL
      const downloadURL = await reference.getDownloadURL();

      setProofImage(downloadURL);
      setImagePreview(imageUri);
      setIsImageUploaded(true);
    }
  };

  if (!advance) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>
        <Text style={styles.bold}>Thời gian ứng:</Text> {advance.date}
      </Text>
      <Text style={styles.txt}>
        <Text style={styles.bold}>Số tiền:</Text>{" "}
        {Number(advance.amount).toLocaleString("vi-VN")} VNĐ
      </Text>
      <Text style={styles.txt}>
        <Text style={styles.bold}>Lý do:</Text> {advance.reason}
      </Text>
      <Text style={styles.txt}>
        <Text style={styles.bold}>Trạng thái:</Text> {advance.status}
      </Text>
      <Text style={styles.txt}>
        <Text style={styles.bold}>Thời gian chuyển:</Text>{" "}
        {advance.transferDate || "Chưa có ngày chuyển"}
      </Text>
      <View>
        <Text style={styles.bold}>Hình ảnh minh chứng:</Text>
        {advance.image ? ( // Kiểm tra nếu advance.image tồn tại
          <Image
            source={{ uri: advance.image }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.txt}>Chưa có hình ảnh minh chứng.</Text> // Hiển thị thông báo nếu không có ảnh
        )}
      </View>
      {role === "manange" && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Duyệt"
              onPress={() => handleStatusChange("approve")}
              color="#4CAF50" // Màu xanh lá cây
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Từ chối"
              onPress={() => handleStatusChange("reject")}
              color="#F44336" // Màu đỏ
            />
          </View>
        </View>
      )}

      {role === "accountant" && (
        <>
          <Button
            title="Tải lên hình ảnh minh chứng"
            onPress={handleImageUpload}
          />
          {isImageUploaded && ( // Show temporary image
            <View style={styles.imageContainer}>
              <Text style={styles.bold}>Tải ảnh lên:</Text>
              <Image
                source={{ uri: imagePreview }} // Use the uri from imagePreview
                style={styles.image} // Apply styles to the image
                resizeMode="contain" // Adjust the image display mode
              />
            </View>
          )}
          <Button title="Đã chuyển" onPress={handleStatusChange} />
        </>
      )}
    </View>
  );
};

export default AdvancesDetail;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20, // Thêm khoảng cách bên trái và bên phải
  },
  buttonWrapper: {
    flex: 1, // Để nút chiếm toàn bộ chiều rộng
    marginHorizontal: 5, // Khoảng cách giữa hai nút
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ABB7D8",
  },
  txt: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 18,
  },
  imageContainer: {
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});
