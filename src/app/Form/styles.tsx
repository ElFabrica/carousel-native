import { colors } from "@/shared/style/colors";
import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    marginBottom: 80,
  },
  animationContainer: {
    alignItems: 'center',
    marginTop: 16
  },
  Footer: {
    alignItems: 'center',
    marginTop: 16,
    justifyContent: "center",
    width: "100%"

  }, content: {
    gap: 16
  },
  animation: {
    width: '50%',
    height: 160,
  },
  title: {
    color: colors.gray[100],
    fontSize: RFValue(32),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%'
  },
  inputLabel: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
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
  button: {
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLoaded: {
    backgroundColor: '#1E40AF', // bg-blue-800
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF', // bg-gray-400
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }, header: {
    flexDirection: "row",
    marginTop: 40,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxIcon: {
    fontSize: RFValue(20),
    marginRight: 10,
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: RFValue(14),
    color: "#333333",
  }
});
