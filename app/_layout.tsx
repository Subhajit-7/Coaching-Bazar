import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { UserDetailContext } from "./../context/UserDetailContext";
import { useState } from "react";
import { StatusBar } from "react-native";
import Colors from "@/constant/Colors";

export default function RootLayout() {

  useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf')
  })

  const [userDetail, setUserDetail] = useState();

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <StatusBar
        translucent={false}
        barStyle="dark-content"
      />
      <Stack screenOptions={{
        headerShown: false
      }}></Stack>
    </UserDetailContext.Provider>
  )
}
