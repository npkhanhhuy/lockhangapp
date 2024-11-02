import React from "react";
import { View, Button } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./DrawerContent";
import Profile from "./Profile";
import FilerJob from "./Filer/FilerJob";
import FilerSchedules from "./Filer/FilerSchedules";

const Tab = createDrawerNavigator();
export default function Filer() {
  return (
    <Tab.Navigator
      initialRouteName="FilerJob"
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
        name="FilerJob"
        component={FilerJob}
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
        name="FilerSchedules"
        component={FilerSchedules}
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
    </Tab.Navigator>
  );
}
