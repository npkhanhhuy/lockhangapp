import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useMyContextController } from "../../store";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";

const MonitorAdvance = ({ navigation }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const [advanceList, setAdvanceList] = useState([]);
  const [name, setName] = useState("");
  const [filteredAdvances, setFilteredAdvances] = useState([]);
  const cADVANCES = firestore().collection("advances");

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Signin");
      return;
    }

    const unsubscribe = cADVANCES.onSnapshot((response) => {
      const arr = [];
      response.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });

      const userAdvances = arr.filter(
        (advance) => advance.createdBy === userLogin.fullname
      );

      setAdvanceList(userAdvances);
      setFilteredAdvances(userAdvances);
    });

    return () => unsubscribe();
  }, [navigation, userLogin]);

  useEffect(() => {
    if (Array.isArray(advanceList) && name && name.trim() !== "") {
      const normalizedSearchName = _.deburr(name.trim().toLowerCase());
      const filtered = advanceList.filter((a) =>
        _.deburr(a.createdBy.toLowerCase()).includes(normalizedSearchName)
      );

      setFilteredAdvances(filtered);
    } else {
      setFilteredAdvances(advanceList);
    }
  }, [name, advanceList]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.advanceInfo}>
        {Array.isArray(item.advances) && item.advances.length > 0 ? (
          item.advances.map((advance, index) => (
            <TouchableOpacity
              key={index}
              style={styles.advanceDetail}
              onPress={() =>
                navigation.navigate("AdvancesDetail", {
                  advanceid: advance.advanceid,
                  userId: userLogin.uid,
                })
              }
            >
              <Text style={styles.txt}>
                <Text style={styles.bold}>Số tiền:</Text>{" "}
                {Number(advance.amount).toLocaleString("vi-VN")} VNĐ
              </Text>
              <Text style={styles.txt}>
                <Text style={styles.bold}>Ngày tạo:</Text> {advance.date}
              </Text>
              <Text style={styles.txt}>
                <Text style={styles.bold}>Trạng thái:</Text> {advance.status}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.txt}>Chưa có ứng tiền nào</Text> // Hiển thị thông báo khi không có ứng tiền
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ABB7D8" }}>
      <View style={{ flex: 1, backgroundColor: "#ABB7D8" }}>
        <TextInput
          label={"Tìm kiếm ứng tiền"}
          value={name}
          onChangeText={setName}
          underlineColor="transparent"
          style={styles.searchInput}
        />
        <FlatList
          data={filteredAdvances}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
        <Button
          mode="contained"
          onPress={() => navigation.navigate("RequestAdvance")} // Điều hướng đến trang RequestAdvance
          style={styles.requestButton}
        >
          Ứng tiền
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  advanceInfo: {
    flexDirection: "column",
    marginBottom: 5,
    padding: 10,
  },
  advanceDetail: {
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  requestButton: {
    margin: 10,
    padding: 10,
    borderRadius: 25,
  },
});

export default MonitorAdvance;
