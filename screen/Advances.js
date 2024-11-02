import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const Advances = ({ navigation }) => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [advancesData, setAdvancesData] = useState({}); // Dữ liệu ứng tiền theo user
  const [selectedUser, setSelectedUser] = useState(null); // Người dùng được chọn

  useEffect(() => {
    // Lấy danh sách người dùng có role là monitor từ collection USERS
    const unsubscribeUsers = firestore()
      .collection("USERS")
      .where("role", "==", "monitor") // Chỉ lấy người dùng có role là monitor
      .onSnapshot((snapshot) => {
        const userList = [];
        snapshot.forEach((doc) => {
          userList.push({ uid: doc.id, ...doc.data() });
        });
        setUsers(userList);
        if (userList.length > 0) {
          setSelectedUser(userList[0].uid); // Mặc định chọn user đầu tiên
        }
      });

    return () => unsubscribeUsers();
  }, []);

  useEffect(() => {
    const fetchAdvances = async () => {
      const advancesObj = {};

      for (const user of users) {
        const advanceDoc = await firestore()
          .collection("advances")
          .doc(user.uid)
          .get();
        if (advanceDoc.exists) {
          advancesObj[user.uid] = advanceDoc.data().advances || [];
        } else {
          advancesObj[user.uid] = [];
        }
      }

      setAdvancesData(advancesObj);
    };

    if (users.length > 0) {
      fetchAdvances();
    }
  }, [users]);

  const renderAdvances = () => {
    if (!selectedUser) return null; // Nếu chưa có user được chọn, không hiển thị gì

    const advances = advancesData[selectedUser] || [];

    return (
      <View>
        {advances.length > 0 ? (
          advances.map((advance, index) => (
            <TouchableOpacity
              key={index}
              style={styles.advanceDetail}
              onPress={() =>
                navigation.navigate("AdvancesDetail", {
                  advanceid: advance.advanceid,
                  userId: selectedUser,
                })
              }
            >
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
                <Text style={styles.bold}>Ngày tạo:</Text> {advance.date}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.txt}>Chưa có ứng tiền nào</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedUser}
        onValueChange={(itemValue) => setSelectedUser(itemValue)}
        style={styles.picker}
      >
        {users.map((user) => (
          <Picker.Item
            key={user.uid}
            label={user.fullname || user.uid}
            value={user.uid}
          />
        ))}
      </Picker>
      <View style={styles.advancesContainer}>{renderAdvances()}</View>
    </View>
  );
};

export default Advances;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ABB7D8",
  },
  advancesContainer: {
    marginTop: 20,
  },
  advanceDetail: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  txt: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 18,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
  },
});
