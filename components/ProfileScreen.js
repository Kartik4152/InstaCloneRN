import React, {
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as Analytics from "expo-firebase-analytics";
import { Entypo } from "@expo/vector-icons";

import colors from "../constants/colors";

const win = Dimensions.get("window");

import EditProfileModal from "./EditProfileModal";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileStories from "./ProfileStories";
import ProfileGrid from "./ProfileGrid";
import DiscoverPeopleList from "./DiscoverPeopleList";

const ProfileScreen = ({ navigation }) => {
  useEffect(() => {
    Analytics.logEvent("ProfileScreenLoaded");
  }, []);
  const username = useRef("benbenabraham");
  const [modalVisible, setModalVisible] = useState(false);
  useLayoutEffect(() => {
    if (modalVisible)
      navigation.setOptions({
        tabBarVisible: false,
      });
    else
      navigation.setOptions({
        tabBarVisible: true,
      });
  }, [modalVisible]);
  const [showDiscoverPeople, setShowDiscoverPeople] = useState(false);
  const modalHandler = useCallback(() => setModalVisible(true));

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ProfileHeader username={username.current} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ProfileInfo username={username.current} />
          <View
            style={{
              width: "95%",
              marginTop: 24,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.0975)",
                paddingVertical: 6,
                marginRight: 6,
                borderRadius: 4,
              }}
              onPress={modalHandler}
            >
              <Text style={{ fontWeight: "bold" }}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.0975)",
                paddingVertical: 5,
                paddingHorizontal: 6,
                borderRadius: 4,
              }}
              onPress={() => setShowDiscoverPeople((prev) => !prev)}
            >
              <Entypo name="chevron-small-down" size={20} color="black" />
            </TouchableOpacity>
          </View>
          {showDiscoverPeople ? <DiscoverPeopleList /> : false}
          <ProfileStories username={username.current} />
          <ProfileGrid />
        </ScrollView>
      </SafeAreaView>
      {modalVisible ? (
        <EditProfileModal
          setVisible={setModalVisible}
          username={username.current}
        />
      ) : (
        false
      )}
    </>
  );
};

export default React.memo(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  scrollContainer: {
    width: win.width,
    borderColor: "black",
    alignItems: "center",
  },
});
