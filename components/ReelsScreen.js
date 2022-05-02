import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
} from "react-native";
import colors from "../constants/colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import Reel from "./Reel";
import * as Analytics from "expo-firebase-analytics";
import { storage, db } from "../firebase";

const win = Dimensions.get("window");

const ReelsScreen = () => {
  useEffect(() => {
    Analytics.logEvent("ReelsScreenLoaded");
  }, []);
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [reelData, setReelData] = useState([]);
  const [height, setHeight] = useState(win.height);
  const [curItem, setCurItem] = useState(0);
  useEffect(() => {
    (async () => {
      let docs = await db.collection("reels").get();
      let data = docs.docs.map((doc) => doc.data());
      data.forEach((doc) => {
        Promise.all([
          storage.refFromURL(doc.reel).getDownloadURL(),
          storage.refFromURL(doc.userImage).getDownloadURL(),
          storage.refFromURL(doc.songOwnerImage).getDownloadURL(),
        ]).then((URIArray) => {
          if (isMounted.current)
            setReelData((prev) => [
              ...prev,
              {
                ...doc,
                uri: URIArray[0],
                userURI: URIArray[1],
                songOwnerURI: URIArray[2],
              },
            ]);
        });
      });
    })();
  }, []);
  const heightHandler = useCallback((event) => {
    setHeight(event.nativeEvent.layout.height);
  }, []);
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(
    ({ item, index }) => {
      return <Reel {...item} height={height} index={index} curItem={curItem} />;
    },
    [height, curItem]
  );
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 10,
  });
  const setItem = useCallback((e) => setCurItem(e.viewableItems[0].index), []);
  return (
    <SafeAreaView style={styles.container} onLayout={heightHandler}>
      <FlatList
        onViewableItemsChanged={setItem}
        viewabilityConfig={viewabilityConfig.current}
        snapToInterval={height}
        pagingEnabled={true}
        snapToAlignment="center"
        decelerationRate="normal"
        data={reelData}
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <View style={styles.header}>
        <Text style={{ color: colors.white, fontSize: 24, fontWeight: "bold" }}>
          Reels
        </Text>
        <SimpleLineIcons name="camera" size={24} color={colors.white} />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(ReelsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    top: 16,
  },
});
