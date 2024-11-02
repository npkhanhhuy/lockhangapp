import { createContext, useContext, useMemo, useReducer } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyContext = createContext();
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN": {
      return { ...state, userLogin: action.value };
    }
    case "USER_LOGOUT": {
      return { ...state, userLogin: null };
    }
    case "FETCH_JOB": {
      return { ...state, job: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const MyContextControllerProvider = ({ children }) => {
  const initialState = {
    userLogin: null,
    job: [],
  };
  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

const useMyContextController = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error(
      "useMyContextController should be used inside the MyContextControllerProvider"
    );
  }
  return context;
};

const USERS = firestore().collection("USERS");
const JOBS = firestore().collection("JOBS");

const signup = (email, password, fullname, phone, role) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      Alert.alert("Tạo tài khoản thành công với " + email);
      USERS.doc(email).set({
        email,
        password,
        fullname,
        phone,
        role,
      });
    })
    .catch((e) => console.log(e.message));
};

const login = async (dispatch, email, password) => {
  try {
    // Đăng nhập bằng email và mật khẩu
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    // Lấy thông tin người dùng từ Firestore
    const userDoc = await USERS.doc(user.uid).get();
    if (userDoc.exists) {
      // Hiển thị thông báo đăng nhập thành công

      // Dispatch thông tin người dùng tới reducer
      dispatch({ type: "USER_LOGIN", value: userDoc.data() });

      // Lưu thông tin người dùng vào localStorage (trên mobile thì bạn có thể dùng AsyncStorage)
      await AsyncStorage.setItem("user", JSON.stringify(userDoc.data()));
    } else {
      throw new Alert.alert("Người dùng không tồn tại");
    }
  } catch (error) {
    // Hiển thị thông báo lỗi
    Alert.alert("Tài khoản hoặc mật khẩu sai!");
  }
};

const logout = (dispatch) => {
  auth()
    .signOut()
    .then(() => dispatch({ type: "USER_LOGOUT" }));
};

const addJod = (jobId, newJob) => {
  JOBS.add({ idJob: jobId, title: newJob })
    .then(() => console.log("add new job"))
    .catch((e) => console.log(e.message));
};

export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
  signup,
  addJod,
};
