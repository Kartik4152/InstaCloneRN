import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import colors from "../constants/colors";

const HomeHeader = ({ scroll }) => {
  const [loaded] = useFonts({
    InstagramRegular: require("../assets/fonts/regular.otf"),
    InstagramBold: require("../assets/fonts/bold.otf"),
  });
  if (!loaded) return null;
  return (
    <View
      style={{
        ...styles.navbar,
        borderBottomColor: scroll > 10 ? "rgba(0,0,0,0.0975)" : colors.white,
        borderBottomWidth: scroll > 10 ? 0.5 : 0,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome name="plus-square-o" size={24} color="black" />
      </View>
      <View
        style={{
          flex: 6,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.header}>Instagram</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../assets/icons/messenger.png")}
          style={{ height: 24, width: 24 }}
        />
      </View>
    </View>
  );
};

export default React.memo(HomeHeader);

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: colors.white,
    flexDirection: "row",
  },
  header: {
    fontFamily: "InstagramRegular",
    fontSize: 28,
  },
});
