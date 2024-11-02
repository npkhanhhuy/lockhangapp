import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Avatar, Text, TextInput, Button } from "react-native-paper";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { logout, useMyContextController } from "../store";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function DrawerContent(props) {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [name, setName] = React.useState("");
  const [imageAvatar, setImageAvatar] = React.useState("");
  const USERS = firestore().collection("USERS");

  const navigation = useNavigation();
  useEffect(() => {
    if (!userLogin) return; // Kiểm tra nếu userLogin không tồn tại

    // Thiết lập listener Firestore
    const unsubscribe = USERS.doc(userLogin.uid).onSnapshot((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        setImageAvatar(userData.image);
      } else {
        Alert.alert("User not found");
      }
    });

    // Hủy listener khi component unmount
    return () => {
      unsubscribe();
    };
  }, [userLogin]);

  const getRoleTitle = (role) => {
    switch (role) {
      case "manange":
        return "Lãnh đạo";
      case "monitor":
        return "Giám sát";
      case "materials":
        return "Vật tư";
      case "file":
        return "Hồ sơ";
      case "person":
        return "Nhân sự";
      case "accountant":
        return "Kế toán";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <View
      style={{ flex: 1, flexDirection: "column", backgroundColor: "#ABB7D8" }}
    >
      <Image style={styles.logo} source={require("../asset/logo.png")} />
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: "#ABB7D8",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: "black",
            padding: 5,
          }}
        >
          <Avatar.Image
            style={{
              height: 75,
              width: 75,
              borderRadius: 100,
              borderColor: "white",
              borderWidth: 1,
              alignItems: "center",
              marginLeft: 2,
            }}
            size={75}
            source={
              imageAvatar ? { uri: imageAvatar } : require("../asset/user.png")
            }
          />
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={{ marginBottom: 5 }}>
              {userLogin?.fullname || userLogin !== null}
            </Text>
            <Text style={{ marginBottom: 5 }}>
              {userLogin?.email || userLogin !== null}
            </Text>
            <Text style={styles.text}>
              {userLogin?.role
                ? getRoleTitle(userLogin.role)
                : "Không có quyền hạn"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "" }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: "black" }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button onPress={() => navigation.navigate("Signin")}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../asset/logout.png")}
            />
            <Text style={{ color: "black" }}>Đăng xuất</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {},
  logo: {
    width: 280,
    height: 135,
    justifyContent: "center",
    alignSelf: "center",
  },
});
