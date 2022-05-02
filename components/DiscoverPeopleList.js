import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import DiscoverPeopleCard from "./DiscoverPeopleCard";
import { db, storage } from "../firebase";

const DiscoverPeopleList = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [discoverPeopleData, setDiscoverPeopleData] = useState([]);
  useEffect(() => {
    (async () => {
      let docs = await db.collection("discoverPeople").get();
      let data = docs.docs.map((doc) => doc.data());
      data.forEach((doc) => {
        storage
          .refFromURL(doc.image)
          .getDownloadURL()
          .then((uri) => {
            if (isMounted.current)
              setDiscoverPeopleData((prev) => [
                ...prev,
                {
                  ...doc,
                  image: uri,
                },
              ]);
          });
      });
    })();
  }, []);

  const keyExtractorIndex = useCallback((item, index) => index.toString(), []);

  const renderItemDiscover = useCallback(
    ({ item }) => <DiscoverPeopleCard {...item} />,
    []
  );
  return (
    <>
      <View
        style={{
          width: "95%",
          marginVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Discover People</Text>
        <TouchableOpacity>
          <Text style={{ color: "#1890ff", fontWeight: "bold" }}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 20 }}
        horizontal
        data={discoverPeopleData}
        renderItem={renderItemDiscover}
        keyExtractor={keyExtractorIndex}
      />
    </>
  );
};

export default React.memo(DiscoverPeopleList);

const styles = StyleSheet.create({});
