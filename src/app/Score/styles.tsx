import { colors } from "@/shared/style/colors";
import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({

  background: {
    flex: 1,
    paddingTop: 26,
    paddingHorizontal: RFValue(15)

  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: RFValue(80)
  },
  logo: {
    width: RFValue(120),
    height: RFValue(48),
    position: 'absolute',
    top: 20,
    right: 20,
  },
  animation: {
    width: '50%',
    height: '25%',
  },
  congrats: {
    color: colors["text-Primary"], // text-blue-500
    fontWeight: '600',
    fontSize: RFValue(42), // text-5xl ~40px
    textAlign: 'center',
    marginBottom: RFValue(10)
  },
  score: {
    color: colors["text-Primary"],
    fontWeight: '500',
    fontSize: RFValue(24), // text-3xl
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#1E40AF', // bg-blue-800
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(24), // text-2xl
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
