import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, Image, Dimensions, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as _ from "lodash";
import { db, storage } from "../firebase";
import * as Analytics from "expo-firebase-analytics";

const win = Dimensions.get("window");

const ProfileGrid = () => {
  const [gridContent, setGridContent] = useState([]);
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      let docs = await db.collection("profileGrid").get();
      let data = docs.docs.map((doc) => doc.data());
      data.forEach((doc) => {
        storage
          .refFromURL(doc.source)
          .getDownloadURL()
          .then((uri) => {
            if (isMounted.current)
              setGridContent((prev) => [
                ...prev,
                {
                  ...doc,
                  source: uri,
                },
              ]);
          });
      });
    })();
  }, []);

  const logImageOpened = useCallback(() => {
    Analytics.logEvent("UserProfileGridImageOpened");
  }, []);

  const rows = _.chunk(gridContent, 3);

  return (
    <View>
      <View style={styles.gridContainer}>
        {rows.map((item, index) => {
          return (
            <View style={styles.gridRow} key={index}>
              <View style={styles.gridImageContainer}>
                <Pressable onPress={logImageOpened}>
                  <Image
                    source={{ uri: item[0] && item[0].source }}
                    style={styles.gridImage}
                  />
                </Pressable>
                <View style={{ position: "absolute", right: 8, top: 8 }}>
                  {item[0] && item[0].type == "video" ? (
                    <FontAwesome5 name="play" size={14} color="white" />
                  ) : (
                    false
                  )}
                  {item[0] && item[0].type == "stack" ? (
                    <Image
                      source={require("../assets/icons/carousel.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                  {item[0] && item[0].type == "reel" ? (
                    <Image
                      source={require("../assets/icons/reel-white.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                </View>
              </View>
              <View
                style={{
                  ...styles.gridImageContainer,
                  marginHorizontal: 3,
                }}
              >
                <Pressable onPress={logImageOpened}>
                  <Image
                    source={{ uri: item[1] && item[1].source }}
                    style={styles.gridImage}
                  />
                </Pressable>
                <View style={{ position: "absolute", right: 8, top: 8 }}>
                  {item[1] && item[1].type == "video" ? (
                    <FontAwesome5 name="play" size={14} color="white" />
                  ) : (
                    false
                  )}
                  {item[1] && item[1].type == "stack" ? (
                    <Image
                      source={require("../assets/icons/carousel.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                  {item[1] && item[1].type == "reel" ? (
                    <Image
                      source={require("../assets/icons/reel-white.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                </View>
              </View>
              <View style={styles.gridImageContainer}>
                <Pressable onPress={logImageOpened}>
                  <Image
                    source={{ uri: item[2] && item[2].source }}
                    style={styles.gridImage}
                  />
                </Pressable>
                <View style={{ position: "absolute", right: 8, top: 8 }}>
                  {item[2] && item[2].type == "video" ? (
                    <FontAwesome5 name="play" size={14} color="white" />
                  ) : (
                    false
                  )}
                  {item[2] && item[2].type == "stack" ? (
                    <Image
                      source={require("../assets/icons/carousel.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                  {item[2] && item[2].type == "reel" ? (
                    <Image
                      source={require("../assets/icons/reel-white.png")}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    false
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(ProfileGrid);

const styles = StyleSheet.create({
  gridContainer: {
    marginTop: 3,
    width: "100%",
    flexDirection: "column",
  },
  gridRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 3,
  },
  gridImageContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  gridImage: {
    height: win.width / 3 - 2,
    width: win.width / 3 - 2,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
});
