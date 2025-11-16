import { colors } from "@/shared/style/colors";
import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,  // w-30
    height: 48,  // h-12
    position: 'absolute',
    top: 20,
    right: 20,
  },
  icon: {
    marginTop: 40,
    marginHorizontal: 12,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 8,
  },
  title: {
    color: colors["text-Primary"],
    fontWeight: '500',
    fontSize: RFValue(40), // text-5xl ~40px    
    textAlign: 'center',
  },
  animation: {
    width: '87%',
    height: '37%',
  },
  instructionsTitle: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: RFValue(30), // text-3xl
    textAlign: 'center',
  },
  instructionsBox: {
    backgroundColor: colors["bg-Therthiary"],
    padding: 16,
    paddingVertical: 20,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsText: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    textAlign: 'center',
    fontWeight: "500",
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16, // Tailwind gap-4 ~= 16px
    marginBottom: RFValue(80)
  },
  startButton: {
    backgroundColor: '#1E40AF',
    marginTop: 40,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: RFValue(24),
  },
  input: {
    borderWidth: 1,
    borderColor: '#A855F7', // border-purple-500
    borderRadius: 8,
    padding: 12,
    fontSize: RFValue(16),
    marginBottom: 16,
  },
  content: {
    gap: 16
  }
});
