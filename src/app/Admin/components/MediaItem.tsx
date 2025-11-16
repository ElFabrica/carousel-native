import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import tw from "twrnc";
import {
  Video,
  Image as ImageIcon,
  Clock,
  Edit3,
  Check,
  Trash,
} from "lucide-react-native";
import { ICarouselMedia } from "@/hooks/use-midia";

interface MediaItemProps {
  media: ICarouselMedia;
  isEditing: boolean;
  displayName: string;
  duration: string;
  customName: string;
  onEdit: () => void;
  onSave: () => void;
  onRemove: () => void;
  onDurationChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onDurationBlur: () => void;
}

export function MediaItem({
  media,
  isEditing,
  displayName,
  duration,
  customName,
  onEdit,
  onSave,
  onRemove,
  onDurationChange,
  onNameChange,
  onDurationBlur,
}: MediaItemProps) {
  return (
    <View
      style={tw`p-3 bg-white rounded-lg mb-3 border border-gray-200 shadow-sm`}
    >
      {/* Header Row */}
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <View style={tw`flex-row items-center flex-1 mr-2`}>
          {media.type === "video" ? (
            <Video color="#9333ea" size={20} style={tw`mr-2`} />
          ) : (
            <ImageIcon color="#9333ea" size={20} style={tw`mr-2`} />
          )}

          {isEditing ? (
            <View style={tw`flex-1 flex-row items-center`}>
              <TextInput
                style={tw`flex-1 border border-purple-400 rounded px-2 py-1 mr-2`}
                value={customName}
                onChangeText={onNameChange}
                placeholder="Nome do arquivo"
                autoFocus
              />
              <Pressable onPress={onSave} style={tw`bg-green-500 p-2 rounded`}>
                <Check color="white" size={16} />
              </Pressable>
            </View>
          ) : (
            <View style={tw`flex-1 flex-row items-center`}>
              <Text style={tw`flex-1 font-medium text-base`} numberOfLines={1}>
                {displayName}
              </Text>
              <Pressable onPress={onEdit} style={tw`ml-2 p-1`}>
                <Edit3 color="#9333ea" size={16} />
              </Pressable>
            </View>
          )}
        </View>

        <Pressable onPress={onRemove}>
          <Trash color="red" size={20} />
        </Pressable>
      </View>

      {/* File Name */}
      <Text style={tw`text-xs text-gray-400 mb-2`}>
        Arquivo: {media.fileName}
      </Text>

      {/* Duration Input (Images Only) */}
      {media.type === "image" && (
        <View style={tw`flex-row items-center mt-2 bg-purple-50 p-2 rounded`}>
          <Clock color="#9333ea" size={16} style={tw`mr-2`} />
          <Text style={tw`text-sm text-gray-700 mr-2 font-medium`}>
            Duração:
          </Text>
          <TextInput
            style={tw`border border-gray-300 bg-white rounded px-3 py-1.5 w-20 text-center font-semibold`}
            keyboardType="numeric"
            value={duration}
            onChangeText={onDurationChange}
            onBlur={onDurationBlur}
            placeholder="7"
          />
          <Text style={tw`text-sm text-gray-700 ml-2`}>segundos</Text>
        </View>
      )}

      {/* Video Info */}
      {media.type === "video" && (
        <View style={tw`flex-row items-center mt-2 bg-blue-50 p-2 rounded`}>
          <Clock color="#3b82f6" size={16} style={tw`mr-2`} />
          <Text style={tw`text-sm text-gray-600 italic`}>
            Vídeos avançam automaticamente ao terminar
          </Text>
        </View>
      )}
    </View>
  );
}
