import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button } from "react-native";
import { TextInput } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth"; // Import Firebase Auth
import { useNavigation } from "@react-navigation/native";

const RequestAdvance = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [fullname, setFullname] = useState(""); // State để lưu fullname

  // Get the current user's UID
  const user = auth().currentUser;

  useEffect(() => {
    if (user) {
      // Fetch user's fullname from Firestore
      fetchUserFullname(user.uid);
    }
  }, [user]);

  const fetchUserFullname = async (uid) => {
    try {
      const doc = await firestore().collection("USERS").doc(uid).get(); // Giả sử bạn có collection 'users'
      if (doc.exists) {
        setFullname(doc.data().fullname || ""); // Lưu fullname vào state
      }
    } catch (error) {
      console.error("Error fetching user fullname: ", error);
    }
  };

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

  const sendNotificationToRoleUsers = async (role) => {
    try {
      const tokensSnapshot = await firestore()
        .collection("USERS")
        .where("role", "==", role)
        .get();
      const tokens = [];

      tokensSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.fcmToken) {
          tokens.push(data.fcmToken); // Giả sử bạn đã lưu token FCM trong Firestore
        }
      });

      // Gửi thông báo tới các token
      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization:
            "key=BOOKHj4XVgXlgpy7pGlmIMKQFPd5PWc9VeYiqLk5I-kc9Yxiw2UHUlAYken-yCAzmomO3hVvymCFWrRkZLoWo-U", // Thay YOUR_SERVER_KEY bằng Server Key của bạn
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration_ids: tokens,
          notification: {
            title: "Yêu cầu ứng tiền mới",
            body: `${fullname} đã yêu cầu ứng tiền: ${amount} VND với lý do: ${reason}`,
          },
        }),
      });

      const data = await response.json();
      console.log("Notification sent successfully:", data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleAddAdvance = async () => {
    const date = getCurrentDateTime(); // Get the current date

    const newAdvance = {
      advanceid: `advance-${Math.random()
        .toString(36)
        .substr(2, 9)}-${Date.now()}`, // Tạo ID duy nhất cho advance
      amount: amount,
      reason: reason,
      status: "Đợi duyệt", // Default status
      date: date,
    };

    if (!user) {
      console.error("No user is logged in");
      return;
    }

    try {
      // Update Firestore document with advances object
      await firestore()
        .collection("advances")
        .doc(user.uid)
        .set(
          {
            advances: firestore.FieldValue.arrayUnion(newAdvance),
            createdBy: fullname,
          },
          { merge: true }
        );

      // Reset input fields
      setAmount("");
      setReason("");

      await sendNotificationToRoleUsers("manange");

      navigation.goBack("MonitorAdvance");
    } catch (error) {
      console.error("Error adding advance: ", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ABB7D8", padding: 10 }}>
      <TextInput
        label="Số tiền"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Lý do"
        value={reason}
        onChangeText={setReason}
        style={styles.input}
      />
      <Button title="Thêm ứng tiền" onPress={handleAddAdvance} />
    </View>
  );
};

const styles = StyleSheet.create({
  txt: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    marginVertical: 10,
  },
});

export default RequestAdvance;
