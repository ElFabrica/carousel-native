import { colors } from "@/shared/style/colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: RFValue(30),
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 16,
    marginTop: 8,
    color: colors.gray[100],
    fontWeight: '600',
    backgroundColor: colors["bg-Primary"],
    borderRadius: 20,
    paddingVertical: RFValue(7),
    paddingHorizontal: RFValue(15)
  },
  questionTitle: {
    fontSize: RFValue(20),
    marginBottom: 16,
    color: colors["text-Secondary"],
    fontWeight: "500"
  },
  option: {

    borderWidth: 3,
    borderColor: colors["Border-Secondary"], // border-blue-500 padrão
    backgroundColor: "#FFFFF9",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  optionCorrect: {
    backgroundColor: '#D1FAE5', // bg-green-100
    borderColor: '#46f23c', // border-green-500
  },
  optionIncorrect: {
    backgroundColor: '#FECACA', // bg-red-100
    borderColor: '#EF4444', // border-red-500
  },
  optionText: {
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: '#1E40AF', // bg-blue-800
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(18),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#EF4444', // bg-red-500
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalCancel: {
    backgroundColor: '#D1D5DB', // bg-gray-300
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalCancelText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  modalConfirm: {
    backgroundColor: '#EF4444', // bg-red-500
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logo: {
    width: 120, // w-30
    height: 48,  // h-12
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  lottie: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 20,

  }
});
