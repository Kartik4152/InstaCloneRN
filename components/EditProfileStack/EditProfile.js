import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";

const EditProfile = ({ navigation, user, setUser }) => {
  const nameHandler = useCallback((e) => {
    setUser((prev) => ({
      ...prev,
      Name: e,
    }));
  }, []);

  const websiteHandler = useCallback((e) => {
    setUser((prev) => ({
      ...prev,
      Website: e,
    }));
  }, []);
  const bioHandler = useCallback((e) => {
    setUser((prev) => ({
      ...prev,
      Bio: e,
    }));
  }, []);

  const goToPersonal = useCallback(() => navigation.navigate("personal"), []);
  return (
    <View style={styles.container}>
      <View style={styles.imgLabelContainer}>
        <Image
          source={{ uri: user.Photo }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            resizeMode: "cover",
          }}
        />
        <TouchableOpacity>
          <Text
            style={{
              color: colors.blue,
              marginVertical: 10,
              fontSize: 18,
            }}
          >
            Change Profile Photo
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput
            value={user.Name}
            style={styles.formInput}
            onChangeText={nameHandler}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Username</Text>
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            value={user.Username}
            style={styles.formInput}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            placeholder="Website"
            value={user.Website}
            style={styles.formInput}
            onChangeText={websiteHandler}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Bio</Text>
          <TextInput
            value={user.Bio}
            style={styles.formInput}
            onChangeText={bioHandler}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.options}>
        <Text style={styles.optionText}>Switch To Professional Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.options} onPress={goToPersonal}>
        <Text style={styles.optionText}>Personal Information Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(EditProfile);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  imgLabelContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  form: {
    width: "90%",
  },
  formGroup: {
    marginVertical: 8,
  },
  formInput: {
    fontSize: 16,
    borderBottomColor: "rgba(0,0,0,0.0975)",
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  formLabel: {
    color: "rgba(0,0,0,0.5)",
  },
  options: {
    width: "100%",
    alignItems: "flex-start",
    padding: 20,

    borderColor: "rgba(0,0,0,0.0975)",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginVertical: 10,
  },
  optionText: {
    color: colors.blue,
  },
});
