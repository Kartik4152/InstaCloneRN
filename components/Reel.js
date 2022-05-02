import { useIsFocused } from "@react-navigation/native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import colors from "../constants/colors";
import * as Analytics from "expo-firebase-analytics";

const win = Dimensions.get("window");

const Reel = ({
  uri,
  user,
  caption,
  userURI,
  songOwner,
  songOwnerURI,
  height,
  curItem,
  index,
}) => {
  useEffect(() => {
    Analytics.logEvent("ReelLoaded");
  }, []);
  const [isLiked, setIsLiked] = useState(false);
  const screenIsFocused = useIsFocused();
  const videoRef = useRef(null);
  useEffect(() => {
    // if current item is not in viewport
    if (curItem != index) {
      if (videoRef) videoRef.current.pauseAsync();
    }
    // if current item is in viewport
    else {
      // if screen is focused play
      if (screenIsFocused && videoRef) videoRef.current.playAsync();
    }
    // if screen is not focused , pause
    if (!screenIsFocused) if (videoRef) videoRef.current.pauseAsync();
  }, [curItem, index, screenIsFocused]);
  const muteHandler = useCallback(() => {
    videoRef.current.getStatusAsync().then((e) => {
      videoRef.current.setIsMutedAsync(!e.isMuted);
    });
  }, []);
  const likeHandler = useCallback(() => setIsLiked((prev) => !prev), []);
  return (
    <>
      <TouchableWithoutFeedback onPress={muteHandler}>
        <Video
          ref={videoRef}
          source={{ uri: uri }}
          style={{
            height: height,
            width: win.width,
          }}
          volume={1}
          resizeMode="cover"
          shouldPlay={false}
          isLooping={true}
          isMuted={true}
        />
      </TouchableWithoutFeedback>
      <View style={styles.controls}>
        <AntDesign
          name={isLiked ? "heart" : "hearto"}
          size={26}
          color={colors.white}
          style={{ marginBottom: 4 }}
          onPress={likeHandler}
        />
        <Text style={{ color: colors.white, marginBottom: 24 }}>57.1k</Text>
        <Image
          source={require("../assets/icons/comment-white.png")}
          style={{ height: 24, width: 24, marginBottom: 4 }}
        />
        <Text style={{ color: colors.white, marginBottom: 24 }}>1.2k</Text>
        <Ionicons
          name="paper-plane-outline"
          size={26}
          color={colors.white}
          style={{ marginBottom: 24 }}
        />
        <MaterialCommunityIcons
          name="dots-vertical"
          size={26}
          color={colors.white}
          style={{ marginBottom: 24 }}
        />
        <Image
          source={{ uri: userURI }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: colors.white,
          }}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.user}>
          <Image
            style={{
              borderRadius: 100,
              height: 32,
              width: 32,
              marginRight: 8,
            }}
            source={{ uri: songOwnerURI ? songOwnerURI : userURI }}
          />
          <Text
            style={{
              fontWeight: "bold",
              color: colors.white,
              marginRight: 8,
            }}
          >
            {user}
          </Text>
          <MaterialIcons
            name="verified"
            size={24}
            color={colors.white}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: colors.white, fontWeight: "bold" }}>
            • Follow
          </Text>
        </View>
        <View style={styles.caption}>
          <Text
            style={{ color: colors.white }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {caption}{" "}
          </Text>
        </View>
        <View style={styles.audio}>
          <MaterialCommunityIcons
            name="waveform"
            size={20}
            color={colors.white}
            style={{ marginRight: 4 }}
          />
          <Text
            style={{ color: colors.white }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {songOwner ? songOwner : user} • Original Audio
          </Text>
        </View>
      </View>
    </>
  );
};

export default React.memo(Reel);

const styles = StyleSheet.create({
  controls: {
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    right: 12,
    bottom: 24,
  },
  content: {
    position: "absolute",
    bottom: 24,
    left: 16,
    width: "80%",
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  caption: {
    marginBottom: 10,
  },
  audio: {
    flexDirection: "row",
    alignItems: "center",
  },
});
