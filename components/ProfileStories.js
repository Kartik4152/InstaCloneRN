import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { db, storage } from "../firebase";
import colors from "../constants/colors";

const ProfileStories = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [stories, setStories] = useState([]);
  useEffect(() => {
    (async () => {
      let docs = await db.collection("profileStories").get();
      let data = docs.docs.map((doc) => doc.data());
      data.forEach((doc) => {
        storage
          .refFromURL(doc.photo)
          .getDownloadURL()
          .then((uri) => {
            if (isMounted.current)
              setStories((prev) => [
                ...prev,
                {
                  ...doc,
                  photo: uri,
                },
              ]);
          });
      });
    })();
  }, []);
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  const renderItem = useCallback((itemData) => {
    return (
      <View style={styles.storyImgLabelContainer}>
        <View style={styles.storyImgContainer}>
          <Image
            source={{ uri: itemData.item.photo }}
            style={styles.storyImage}
          />
        </View>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 12 }}>
          {itemData.item.name}
        </Text>
      </View>
    );
  }, []);
  return (
    <>
      <View style={{ width: "95%" }}>
        <Text style={{ fontWeight: "bold" }}>Story Highlights</Text>
      </View>
      <View style={styles.storyContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={true}
          data={stories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </View>
    </>
  );
};

export default React.memo(ProfileStories);

const styles = StyleSheet.create({
  storyContainer: {
    width: "100%",
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 0.5,
  },
  storyImgLabelContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    marginHorizontal: 8,
  },
  storyImgContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    height: 65,
    borderWidth: 1,
    borderRadius: 70,
    borderColor: "rgba(0,0,0,0.0975)",
  },
  storyImage: {
    borderRadius: 50,
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.0975)",
  },
});
