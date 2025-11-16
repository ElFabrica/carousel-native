import { colors } from "@/shared/style/colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  input: {
    color: "#333333",
    fontSize: RFValue(22),
    backgroundColor: "#FFFFFF",
    fontWeight: 600,
    borderWidth: 3,
    borderRadius: 16,
    borderColor: colors["Border-Primary"],
    padding: 16,
    width: "100%",
    minHeight: "auto",

  },
  inputFocused: {
    borderColor: "#A26201"
  }
})