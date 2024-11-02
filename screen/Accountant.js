import React from "react";
import { View, Button } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./DrawerContent";
import Profile from "./Profile";
import AccountantAdvance from "./Accountant/AccountantAdvance";

const Tab = createDrawerNavigator();
export default function Customer() {
  return (
    <Tab.Navigator
      initialRouteName="AccountantAdvance"
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
        name="AccountantAdvance"
        component={AccountantAdvance}
        options={{
          drawerLabel: "Danh sách ứng tiền",
          headerTitle: "Dach sách ứng tiền",
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
