import React from "react";
import { Icon } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Transaction from "./Transaction";
import CustomerAdmin from "./CustomerAdmin";
import DrawerContent from "./DrawerContent";
import Profile from "./Profile";
import FollowWork from "./FollowWork";
import Services from "./Services";
import Advances from "./Advances";
import Schedules from "./Schedules";

const Draw = createDrawerNavigator();
export default function Admin({ navigation }) {
  return (
    <Draw.Navigator
      initialRouteName="Services"
      drawerContent={(props) => (
        <DrawerContent navigation={navigation} {...props} />
      )}
      screenOptions={{
        drawerActiveBackgroundColor: "#2F58CA",
        drawerInactiveBackgroundColor: "#93A3D0",
      }}
    >
      <Draw.Screen
        name="Services"
        component={Services}
        options={{
          drawerLabel: "Trang chủ",
          headerTitle: "Trang chủ",
          headerStyle: { backgroundColor: "#2F58CA" },
          drawerIcon: () => (
            <Icon
              source={require("../asset/home.png")}
              color="black"
              size={26}
            />
          ),
          drawerLabelStyle: { color: "black", fontSize: 13 },
        }}
      />
      <Draw.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: "Quản lí thông tin",
          headerTitle: "Thông tin cá nhân",
          headerStyle: { backgroundColor: "#2F58CA" },
          drawerIcon: () => (
            <Icon
              source={require("../asset/mdi--card-account-details-outline.png")}
              color="black"
              size={26}
            />
          ),
          drawerLabelStyle: { color: "black", fontSize: 13 },
        }}
      />
      <Draw.Screen
        name="CustomerAdmin"
        component={CustomerAdmin}
        options={{
          drawerLabel: "Danh sách nhân viên",
          headerTitle: "Danh sách nhân viên",
          headerStyle: { backgroundColor: "#2F58CA" },
          drawerIcon: () => (
            <Icon
              source={require("../asset/contact-book.png")}
              color="black"
              size={26}
            />
          ),
          drawerLabelStyle: { color: "black" },
        }}
      />
      <Draw.Screen
        name="Schedules"
        component={Schedules}
        options={{
          drawerLabel: "Theo dõi báo cáo thi công",
          headerTitle: "Theo dõi báo cáo thi công",
          headerStyle: { backgroundColor: "#2F58CA" },
          drawerIcon: () => (
            <Icon
              source={require("../asset/event.png")}
              color="black"
              size={26}
            />
          ),
          drawerLabelStyle: { color: "black", fontSize: 13 },
        }}
      />
      <Draw.Screen
        name="Transaction"
        component={Transaction}
        options={{
          drawerLabel: "Quản lí vật tư",
          headerTitle: "Quản lí vật tư",
          headerStyle: { backgroundColor: "#2F58CA" },
          drawerIcon: () => (
            <Icon
              source={require("../asset/car-repair.png")}
              color="black"
              size={26}
            />
          ),
          drawerLabelStyle: { color: "black", fontSize: 13 },
        }}
      />
      <Draw.Screen
        name="Advances"
        component={Advances}
        options={{
          drawerLabel: "Quản lý ứng tiền",
          headerTitle: "Quản lý ứng tiền",
          headerStyle: { backgroundColor: "#2F58CA" },
          drawerIcon: () => (
            <Icon
              source={require("../asset/credit-card.png")}
              color="black"
              size={26}
            />
          ),
          drawerLabelStyle: { color: "black", fontSize: 13 },
        }}
      />
    </Draw.Navigator>
  );
}
