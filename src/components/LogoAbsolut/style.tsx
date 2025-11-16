import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  wrapper: {
  },
  image: {
    width: RFValue(80),
    height: RFValue(25),
    borderRadius: RFValue(10),
    position: "absolute",
    right: RFValue(0),

  }
})