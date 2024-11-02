import React from "react";
import { View, Button } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Setting from "./Advances";
import DrawerContent from "./DrawerContent";
import Profile from "./Profile";
import Transaction from "./Transaction";
import JobMonitor from "./Customer/JobMonitor";
import MonitorSchedules from "./Customer/MonitorSchedules";
import MonitorAdvance from "./Customer/MonitorAdvance";

const Tab = createDrawerNavigator();
export default function Customer() {
  return (
    <Tab.Navigator
      initialRouteName="JobMonitor"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: "#2F58CA",
        drawerInactiveBackgroundColor: "#93A3D0",
      }}
    >
      <Tab.Screen
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
      <Tab.Screen
        name="JobMonitor"
        component={JobMonitor}
        options={{
          drawerLabel: "Danh sách dự án",
          headerTitle: "Dach sách dự án",
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
      <Tab.Screen
        name="MonitorSchedules"
        component={MonitorSchedules}
        options={{
          drawerLabel: "Theo dõi báo cáo thi công",
          headerTitle: "Theo dõi báo cáo thi công",
          headerStyle: { backgroundColor: "#2F58CA" },
          headerTitleStyle: { color: "black" },
          drawerIcon: () => (
            <Icon
              source={require("../asset/appointment.png")}
              color="black"
              size={26}
            />
          ),
          drawerLabelStyle: { color: "black", fontSize: 13 },
        }}
      />
      <Tab.Screen
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
      <Tab.Screen
        name="MonitorAdvance"
        component={MonitorAdvance}
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
    </Tab.Navigator>
  );
}
