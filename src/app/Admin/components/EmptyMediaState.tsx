import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { Image as ImageIcon } from "lucide-react-native";

export function EmptyMediaState() {
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <ImageIcon color="#ccc" size={48} />
      <Text style={tw`text-gray-500 mt-2`}>Nenhuma mídia adicionada</Text>
      <Text style={tw`text-gray-400 mt-1 text-sm text-center px-8`}>
        Clique no botão acima para adicionar fotos e vídeos
      </Text>
    </View>
  );
}
