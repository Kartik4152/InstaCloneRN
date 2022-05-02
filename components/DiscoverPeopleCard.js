import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import colors from "../constants/colors";

const win = Dimensions.get("window");

const DiscoverPeopleCard = ({ image, name, mutual }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.cardImage} />
      </View>
      <Text
        style={{ fontWeight: "bold" }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>
      <Text style={styles.followText}>Followed by</Text>
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.followText}>
        {mutual[0]} {mutual.length > 1 ? `+ ${mutual.length - 1} more` : false}
      </Text>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={{ color: colors.white, fontWeight: "bold" }}>Follow</Text>
      </TouchableOpacity>
      <View style={styles.cross}>
        <EvilIcons name="close" size={20} color="black" />
      </View>
    </View>
  );
};

export default React.memo(DiscoverPeopleCard);

const styles = StyleSheet.create({
  cardContainer: {
    width: win.width / 2.5,
    padding: 10,
    borderColor: "rgba(0,0,0,0.0975)",
    borderRadius: 5,
    borderWidth: 0.5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cross: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  cardImage: {
    height: 90,
    width: 90,
    borderRadius: 90,
  },
  imageContainer: {
    marginBottom: 10,
  },
  followText: {
    fontSize: 12,
  },
  buttonContainer: {
    alignSelf: "stretch",
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#1890ff",
    paddingVertical: 4,
    borderRadius: 4,
  },
});
