import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import * as Analytics from "expo-firebase-analytics";
import colors from "../constants/colors";
import { storage, db } from "../firebase";

const ActivityItem = React.memo(
  ({ user, sub, comment, userPic, postPic, age, index }) => {
    return (
      <View key={index} style={styles.activityItemContainer}>
        <View>
          <Image
            source={{ uri: userPic }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 48,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.0975)",
            }}
          />
        </View>
        <View style={{ flex: 1, marginHorizontal: 16 }}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>{user}</Text> {sub} {comment}{" "}
            <Text style={{ color: "rgba(0,0,0,0.5)" }}>{age}</Text>
          </Text>
        </View>
        <View>
          <Image
            source={{ uri: postPic }}
            style={{
              width: 48,
              height: 48,
              resizeMode: "contain",
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.0975)",
            }}
          />
        </View>
      </View>
    );
  }
);

const ActivityScreen = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    Analytics.logEvent("ActivityScreenLoaded");
  }, []);
  const [activities, setActivities] = useState([]);
  const [requestUser, setRequestUser] = useState(null);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    (async () => {
      let uri;
      uri = await storage
        .refFromURL(
          "gs://instaclone-b124e.appspot.com/images/profiles/Anuv-Jain.jpg"
        )
        .getDownloadURL();
      if (isMounted.current) setRequestUser(uri);
    })();
    (async () => {
      let docs = await db.collection("activities").get();
      let data = docs.docs.map((doc) => doc.data());
      data.forEach((doc) => {
        Promise.all([
          storage.refFromURL(doc.postPic).getDownloadURL(),
          storage.refFromURL(doc.userPic).getDownloadURL(),
        ]).then((URIArray) => {
          if (isMounted.current)
            setActivities((prev) => [
              ...prev,
              {
                ...doc,
                postPic: URIArray[0],
                userPic: URIArray[1],
              },
            ]);
        });
      });
    })();
  }, []);

  const [scroll, setScroll] = useState(0);
  const scrollHandler = useCallback((e) => {
    setScroll(e.nativeEvent.contentOffset.y);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          ...styles.header,
          borderBottomColor: scroll > 10 ? "rgba(0,0,0,0.0975)" : colors.white,
          borderBottomWidth: scroll > 10 ? 0.5 : 0,
        }}
      >
        <Text style={styles.headerText}>Activity</Text>
      </View>
      <ScrollView
        onScroll={scrollHandler}
        style={styles.activity}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.followRequests}>
          <View>
            <Image
              source={{ uri: requestUser }}
              style={{ width: 48, height: 48, borderRadius: 48 }}
            />
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                backgroundColor: "red",
                height: 20,
                width: 20,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.white, fontSize: 12 }}>20</Text>
            </View>
          </View>
          <View style={{ marginLeft: 16, flexDirection: "column" }}>
            <Text style={{ fontWeight: "bold" }}>Follow Requests</Text>
            <Text style={{ color: "rgba(0,0,0,0.6)" }}>
              Approve or ignore requests
            </Text>
          </View>
        </View>
        <View style={styles.activitiesHeader}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>
        </View>
        {activities.map((ele, index) => {
          return <ActivityItem key={index} index={index} {...ele} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(ActivityScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  header: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activity: {
    paddingVertical: 10,
    width: "100%",
    paddingHorizontal: "5%",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  followRequests: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  activitiesHeader: {
    width: "100%",
    marginVertical: 20,
  },
  activityItemContainer: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 12,
  },
});
