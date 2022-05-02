import React, { useState, useRef, useCallback, useEffect } from "react";
import AutoHeightImage from "react-native-auto-height-image";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  SafeAreaView,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import colors from "../constants/colors";

import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { storage } from "../firebase";

const win = Dimensions.get("window");

const FeedCard = ({
  logo,
  title,
  content,
  comments,
  caption,
  likes,
  index, // index of the card itself
  curIndex, // index of the current item in the feedlist
  isFocused,
}) => {
  const [user, setUser] = useState(null);
  const isMounted = useRef(true);
  const [likeUsers, setLikeUsers] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [curItem, setCurItem] = useState(1);
  const videoRefs = useRef({}); //format {source:ref}
  const videoIndex = useRef({}); //format {source:index}
  const [heightScaled, setHeightScaled] = useState(1.77);
  const [isMuted, setIsMuted] = useState({}); //format {index:boolean}
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    // iterate through all videos
    for (const video in videoRefs.current) {
      // if current card is not on screen, pause video
      if (curIndex != index) videoRefs.current[video].pauseAsync();
      // if current card is on the screen, play video if focused
      else {
        if (isFocused) {
          let source;
          // get the src of the video we want to play
          for (const src in videoIndex.current) {
            if (videoIndex.current[src] == curItem) {
              source = src;
              break;
            }
          }
          // find the video with the given src and play it
          for (const video in videoRefs.current) {
            if (video == source) videoRefs.current[video].playAsync();
            else videoRefs.current[video].pauseAsync();
          }
        } else videoRefs.current[video].pauseAsync();
      }
    }
  }, [isFocused, curIndex, curItem]);
  useEffect(() => {
    let camilla = storage
      .refFromURL(
        "gs://instaclone-b124e.appspot.com/images/profiles/camilla.jpg"
      )
      .getDownloadURL();

    let shawn = storage
      .refFromURL("gs://instaclone-b124e.appspot.com/images/profiles/shawn.jpg")
      .getDownloadURL();

    let lemon = storage
      .refFromURL("gs://instaclone-b124e.appspot.com/images/profiles/lemon.jpg")
      .getDownloadURL();
    Promise.all([camilla, shawn, lemon]).then((data) => {
      if (isMounted.current) setLikeUsers([data[0], data[1], data[2]]);
    });
    storage
      .refFromURL("gs://instaclone-b124e.appspot.com/images/profiles/pfp.jpg")
      .getDownloadURL()
      .then((uri) => {
        if (isMounted.current) setUser(uri);
      });
  }, []);
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(
    ({ item, index }) => {
      if (item.type == "image") {
        return (
          <AutoHeightImage source={{ uri: item.source }} width={win.width} />
        );
      } else if (item.type == "video") {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              videoRefs.current[item.source].getStatusAsync().then((e) => {
                videoRefs.current[item.source].setIsMutedAsync(!e.isMuted);
                setIsMuted((prev) => ({
                  ...prev,
                  [index]: !e.isMuted,
                }));
              });
            }}
          >
            <Video
              ref={(ref) => {
                videoIndex.current[item.source] = index;
                return (videoRefs.current[item.source] = ref);
              }}
              source={{ uri: item.source }}
              style={{
                height: heightScaled,
                width: win.width,
              }}
              volume={1}
              resizeMode="cover"
              shouldPlay={true}
              isLooping={true}
              isMuted={true}
              onReadyForDisplay={(res) => {
                const { height, width } = res.naturalSize;
                setHeightScaled(height * (win.width / width));
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                padding: 8,
                backgroundColor: "rgba(12,12,12,.9)",
                borderRadius: 100,
              }}
            >
              {isMuted[index] == true || isMuted[index] == undefined ? (
                <Ionicons name="md-volume-mute" size={20} color="white" />
              ) : (
                <Ionicons name="md-volume-high" size={20} color="white" />
              )}
            </View>
          </TouchableWithoutFeedback>
        );
      }
    },
    [videoRefs, videoIndex, heightScaled, win.width, isMuted]
  );
  const likeHandler = useCallback(() => setLiked((prev) => !prev), []);
  const bookmarkHandler = useCallback(() => setBookmarked((prev) => !prev), []);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 10,
  });
  const setItem = useCallback((e) => setCurItem(e.viewableItems[0].index), []);
  return (
    <SafeAreaView style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.headerImgLabelContainer}>
          <LinearGradient
            colors={["#DD2A7B", "#F58529"]}
            style={styles.outlineGradient}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: logo }} style={styles.headerImage} />
            </View>
          </LinearGradient>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </View>
      <View style={styles.carousel}>
        <FlatList
          onViewableItemsChanged={setItem}
          viewabilityConfig={viewabilityConfig.current}
          keyExtractor={keyExtractor}
          snapToInterval={win.width}
          pagingEnabled={true}
          snapToAlignment="center"
          decelerationRate="normal"
          disableIntervalMomentum
          horizontal={true}
          data={content}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
        {content.length > 1 ? (
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(12,12,12,.9)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: colors.white }}>
              {curItem + 1}/{content.length}
            </Text>
          </View>
        ) : (
          false
        )}
      </View>
      <View style={styles.control}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={22}
            color={liked ? "red" : "black"}
            style={{ marginRight: 16 }}
            onPress={likeHandler}
          />
          <Image
            source={require("../assets/icons/comment.png")}
            style={{ height: 20, width: 20, marginRight: 16 }}
          />
          <Ionicons name="paper-plane-outline" size={22} color="black" />
        </View>
        <FontAwesome
          name={bookmarked ? "bookmark" : "bookmark-o"}
          size={22}
          color="black"
          onPress={bookmarkHandler}
        />
      </View>
      <View style={styles.likes}>
        <View
          style={{
            borderWidth: 2,
            borderColor: colors.white,
            borderRadius: 200,
            zIndex: 3,
          }}
        >
          <Image
            source={{ uri: likeUsers[0] }}
            style={{
              ...styles.likesPic,
            }}
          />
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: colors.white,
            borderRadius: 200,
            zIndex: 2,
            transform: [{ translateX: -10 }],
          }}
        >
          <Image
            source={{ uri: likeUsers[1] }}
            style={{
              ...styles.likesPic,
            }}
          />
        </View>
        <View
          style={{
            transform: [{ translateX: -20 }],
            zIndex: 1,
            borderRadius: 200,
            borderWidth: 2,
            borderColor: colors.white,
          }}
        >
          <Image
            source={{ uri: likeUsers[2] }}
            style={{
              ...styles.likesPic,
            }}
          />
        </View>
        <Text
          numberOfLines={2}
          style={{
            flexWrap: "wrap",
            flexShrink: 1,
            flexGrow: 1,
            transform: [{ translateX: -10 }],
          }}
        >
          Liked by <Text style={{ fontWeight: "bold" }}>elizabetholsen</Text>{" "}
          and{" "}
          <Text style={{ fontWeight: "bold" }}>
            {likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} others
          </Text>
        </Text>
      </View>
      <View style={styles.caption}>
        <Text>
          <Text style={{ fontWeight: "bold" }}>{title + " "}</Text>
          {caption}
        </Text>
      </View>
      <View style={styles.viewAll}>
        <Text style={{ color: "rgba(0,0,0,0.3)" }}>
          View all {comments.length} comments
        </Text>
      </View>
      <View style={styles.comment}>
        <Text style={{ fontWeight: "bold" }}>{comments[0].user + " "}</Text>
        <Text>{comments[0].comment}</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={{ flex: 1 }}>
          <Image source={{ uri: user }} style={styles.inputPhoto} />
        </View>
        <View style={{ flex: 6 }}>
          <TextInput placeholder="Add a comment..." />
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>❤️</Text>
          <Text>🙌</Text>
          <AntDesign name="pluscircleo" size={12} color="rgba(0,0,0,0.3)" />
        </View>
      </View>
      <View style={styles.age}>
        <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.3)" }}>
          2 hours ago
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(FeedCard);

const styles = StyleSheet.create({
  cardContainer: {
    width: win.width,
    alignItems: "center",
    marginBottom: 8,
  },
  header: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomColor: "rgba(0,0,0,0.0975)",
    borderBottomWidth: 0.5,
  },
  headerImgLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    height: 28,
    width: 28,
    borderRadius: 30,
    borderColor: "rgba(0,0,0,0.0975)",
    borderWidth: 0.5,
    transform: [{ rotateZ: "-30deg" }],
  },
  outlineGradient: {
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 36,
    transform: [
      {
        rotateZ: "30deg",
      },
    ],
    marginRight: 8,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 36,
    width: 36,
    borderColor: "transparent",
    borderRadius: 36,
    borderWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  carousel: {
    width: "100%",
  },
  carouselContent: {
    width: win.width,
  },
  control: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  likes: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  likesPic: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  caption: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  viewAll: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  comment: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
  },
  inputContainer: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  inputPhoto: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  age: {
    width: "95%",
  },
});
