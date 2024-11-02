import { Alert, StyleSheet, View, Image } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import React, { useEffect } from "react";
import { login, useMyContextController } from "../store";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";

function Signin({ navigation }) {
  const [controller, dispatch] = useMyContextController();
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const { userLogin } = controller;
  const [showPass, setShowPass] = React.useState(false);

  useEffect(() => {
    if (userLogin != null) {
      switch (userLogin.role) {
        case "manange":
          navigation.navigate("Admin");
          break;
        case "monitor":
          navigation.navigate("Customer");
          break;
        case "file":
          navigation.navigate("Filer");
          break;
        case "accountant":
          navigation.navigate("Accountant");
          break;
        default:
          break;
      }
    }
  }, [navigation, userLogin]);

  const handleLogin = async () => {
    try {
      await login(dispatch, email, pass); // Giả sử login trả về một Promise
      const user = auth().currentUser;

      if (user) {
        // Lấy token FCM
        const fcmToken = await messaging().getToken();
        console.log("Current FCM Token:", fcmToken); // In ra token hiện tại

        // Lưu hoặc cập nhật token FCM vào Firestore
        await firestore().collection("USERS").doc(user.uid).set(
          { fcmToken: fcmToken },
          { merge: true } // Kết hợp với dữ liệu hiện có
        );
      }
    } catch (error) {
      console.error("Error during login: ", error);
      Alert.alert(
        "Đăng nhập thất bại",
        "Vui lòng kiểm tra lại thông tin đăng nhập của bạn."
      );
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async (token) => {
      console.log("Refreshed FCM Token:", token); // In ra token mới
      const user = auth().currentUser;

      if (user) {
        try {
          const userDocRef = firestore().collection("USERS").doc(user.uid);

          // Lấy token hiện tại từ Firestore để so sánh
          const userDoc = await userDocRef.get();
          const currentUserData = userDoc.data();
          const currentFcmToken = currentUserData
            ? currentUserData.fcmToken
            : null;

          // Chỉ cập nhật nếu token mới khác với token hiện tại
          if (currentFcmToken !== token) {
            await userDocRef.set({ fcmToken: token }, { merge: true });
            console.log("FCM Token updated in Firestore.");
          } else {
            console.log("FCM Token is unchanged, no update needed.");
          }
        } catch (error) {
          console.error("Error updating FCM Token in Firestore:", error);
        }
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", remoteMessage);
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../asset/logo.png")} style={styles.imagebg} />
      <Text style={styles.headerName}>Đăng nhập</Text>
      <TextInput
        label={"Email"}
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        textColor="black"
        theme={{ colors: { primary: "black", onSurfaceVariant: "black" } }}
        underlineColor="transparent"
      />
      <TextInput
        label={"Mật khẩu"}
        value={pass}
        onChangeText={setPass}
        secureTextEntry={!showPass}
        style={styles.textInput}
        textColor="black"
        theme={{ colors: { primary: "black", onSurfaceVariant: "black" } }}
        right={
          <TextInput.Icon
            icon={
              showPass
                ? require("../asset/eye-hidden.png")
                : require("../asset/eye.png")
            }
            onPress={() => setShowPass(!showPass)}
          />
        }
        underlineColor="transparent"
      />
      <View style={styles.forgotPasswordContainer}>
        <Button onPress={() => navigation.navigate("ForgotPass")}>
          <Text style={{ color: "#2F4FF9" }}>Quên mật khẩu?</Text>
        </Button>
      </View>
      <Button style={styles.button} mode="contained" onPress={handleLogin}>
        Đăng nhập
      </Button>
    </View>
  );
}

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ABB7D8",
    justifyContent: "center",
    alignItems: "center",
  },
  imagebg: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  headerName: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2F4FF9",
    textAlign: "center",
  },
  textInput: {
    width: 350,
    marginBottom: 10,
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "grey",
  },
  button: {
    borderRadius: 10,
    marginTop: 20,
    padding: 5,
    backgroundColor: "red",
    width: 150,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: 10,
  },
});
