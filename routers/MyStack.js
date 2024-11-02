import { createStackNavigator } from "@react-navigation/stack";
import Signup from "../screen/Signup";
import Signin from "../screen/Signin";
import ForgotPass from "../screen/ForgotPass";
import Admin from "../screen/Admin";
import Customer from "../screen/Customer";
import UpdateService from "../screen/UpdateService";
import { useMyContextController } from "../store";
import CustomerAdmin from "../screen/CustomerAdmin";
import Profile from "../screen/Profile";
import ChangePassword from "../screen/ChangePass";
import ProfileAllUser from "../screen/ProfileAllUser";
import AppointmentDetail from "../screen/AppointmentDetail";
import EditProfile from "../screen/EditProfile";
import Mapp from "../screen/Mapp";
import ServiceDetail from "../screen/ServiceDetail";
import AddNewService from "../screen/AddNewService";
import ScheduleDetail from "../screen/Customer/ScheduleDetail";
import ListReport from "../screen/Customer/ListReport";
import ReportDetail from "../screen/Customer/ReportDetail";
import AdvancesDetail from "../screen/Customer/AdvancesDetail";
import RequestAdvance from "../screen/Customer/RequestAdvance";
import Accountant from "../screen/Accountant";
import Filer from "../screen/Filer";

const Stack = createStackNavigator();
const MyStack = ({}) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      initialRouteName="Signin"
      screenOptions={{ headerMode: "none" }}
    >
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerTitle: "Thêm nhân viên",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="CustomerAdmin" component={CustomerAdmin} />
      <Stack.Screen name="Accountant" component={Accountant} />
      <Stack.Screen name="Filer" component={Filer} />
      <Stack.Screen
        name="ChangePass"
        component={ChangePassword}
        options={{
          headerTitle: "Đổi mật khẩu",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen name="Mapp" component={Mapp} />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetail}
        options={{
          headerTitle: "Appointment Detail",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen name="Customer" component={Customer} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: "Thông tin cá nhân",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: "Thay đổi thông tin",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="ProfileAllUser"
        component={ProfileAllUser}
        options={{
          headerTitle: "Thông tin cá nhân",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="UpdateService"
        component={UpdateService}
        options={{
          headerTitle: "Update Service",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="AddNewService"
        component={AddNewService}
        options={{
          headerTitle: "Dịch Vụ",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetail}
        options={{
          headerTitle: "Chi tiết dự án",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />

      {/* MONITOR */}
      <Stack.Screen
        name="ScheduleDetail"
        component={ScheduleDetail}
        options={{
          headerTitle: "Danh sách lịch trình",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="ListReport"
        component={ListReport}
        options={{
          headerTitle: "Danh sách báo cáo",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetail}
        options={{
          headerTitle: "Chi tiết báo cáo",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="AdvancesDetail"
        component={AdvancesDetail}
        options={{
          headerTitle: "Chi tiết ứng tiền",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="RequestAdvance"
        component={RequestAdvance}
        options={{
          headerTitle: "Đề xuất ứng tiền",
          headerMode: "screen",
          headerStyle: { backgroundColor: "#2F4FF9" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};
export default MyStack;
