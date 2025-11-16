import React from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import tw from "twrnc";

interface TotemModalProps {
  visible: boolean;
  code: string;
  onChangeCode: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function TotemModal({
  visible,
  code,
  onChangeCode,
  onCancel,
  onConfirm,
}: TotemModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
      >
        <View style={tw`bg-white rounded-lg p-6 w-11/12 max-w-md`}>
          <Text style={tw`text-xl font-bold mb-4 text-center`}>
            🔑 Código do Totem
          </Text>

          <Text style={tw`text-gray-600 mb-4 text-center`}>
            Digite o código do totem para baixar as publicidades
          </Text>

          <TextInput
            style={tw`border border-gray-300 rounded px-4 py-3 mb-4 text-base`}
            placeholder="Ex: codigo01"
            value={code}
            onChangeText={onChangeCode}
            autoCapitalize="none"
            autoFocus
          />

          <View style={tw`flex-row gap-3`}>
            <Pressable
              style={tw`flex-1 bg-gray-200 py-3 rounded`}
              onPress={onCancel}
            >
              <Text style={tw`text-center font-bold text-gray-700`}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={tw`flex-1 bg-purple-600 py-3 rounded`}
              onPress={onConfirm}
            >
              <Text style={tw`text-center font-bold text-white`}>
                Confirmar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
