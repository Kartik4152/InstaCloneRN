import React, { useCallback } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import colors from "../../constants/colors";

const EditPersonal = ({ user, setUser }) => {
  const emailHandler = useCallback((e) => {
    setUser((prev) => ({
      ...prev,
      Email: e,
    }));
  }, []);
  const phoneHandler = useCallback((e) => {
    setUser((prev) => ({
      ...prev,
      Phone: e,
    }));
  }, []);
  const genderHandler = useCallback((e) => {
    setUser((prev) => ({
      ...prev,
      Gender: e,
    }));
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={{ color: "rgba(0,0,0,0.5)" }}>
            Provide your personal information,even if the account is used for a
            business, a pet or something else. This wont be part of your public
            profile.
          </Text>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>E-mail Address</Text>
          <TextInput
            value={user.Email}
            style={styles.formInput}
            onChangeText={emailHandler}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Phone number</Text>
          <TextInput
            value={user.Phone}
            style={styles.formInput}
            onChangeText={phoneHandler}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Gender</Text>
          <TextInput
            value={user.Gender}
            style={styles.formInput}
            onChangeText={genderHandler}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Birthday</Text>
          <TextInput
            value={user.Birthday}
            style={styles.formInput}
            editable={false}
            selectTextOnFocus={false}
          />
        </View>
      </View>
    </View>
  );
};

export default React.memo(EditPersonal);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  form: {
    marginTop: 10,
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
});
