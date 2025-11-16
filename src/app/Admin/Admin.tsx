import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, FlatList, Alert } from "react-native";
import tw from "twrnc";
import { Trash, Image as ImageIcon, ArrowLeft } from "lucide-react-native";
import { Button } from "@/components/button";
import { useMedia, ICarouselMedia } from "@/hooks/use-midia";
import { StackRoutesProps } from "@/routes/StackRoutes";
import { useMediaHandlers } from "./hooks/useMediaHandlers";
import { EmptyMediaState } from "./components/EmptyMediaState";
import { MediaItem } from "./components/MediaItem";
import { MEDIA_CONFIG } from "./constants";
import { usePublicityDownloader } from "./hooks/usePublicityDownloader";
import { TotemModal } from "./components/TotemModal";

// ==================== COMPONENTE PRINCIPAL ====================

function AdminComponent({ navigation }: StackRoutesProps<"admin">) {
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [durations, setDurations] = useState<{ [key: string]: string }>({});
  const [customNames, setCustomNames] = useState<{ [key: string]: string }>({});
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [totemModalVisible, setTotemModalVisible] = useState(false);
  const [totemCode, setTotemCode] = useState("");

  const {
    carouselMedia,
    addMedia,
    removeMedia,
    handleLoadingDatas,
    saveCarouselMedia,
    clearAllMedia,
  } = useMedia();

  // Custom hooks
  const {
    handleDurationChange,
    handleCustomNameChange,
    handleDurationBlur,
    handleSaveCustomName,
    requestPermissions,
    pickMedia: pickMediaHandler,
    handleRemoveMedia,
  } = useMediaHandlers({
    durations,
    setDurations,
    customNames,
    setCustomNames,
    carouselMedia,
    saveCarouselMedia,
    addMedia,
    removeMedia,
    setUploadingMedia,
    setEditingNameId,
  });

  const {
    loadingDownload,
    downloadPublicities,
    handleClearAllPublicities: clearPublicities,
  } = usePublicityDownloader({
    carouselMedia,
    addMedia,
    handleLoadingDatas,
    clearAllMedia,
  });

  // ==================== SYNC STATE ====================
  useEffect(() => {
    const initialDurations: { [key: string]: string } = {};
    const initialNames: { [key: string]: string } = {};

    carouselMedia.forEach((media) => {
      if (media.type === "image") {
        initialDurations[media.id] = (
          media.duration || MEDIA_CONFIG.DEFAULT_DURATION
        ).toString();
      }
      initialNames[media.id] = (media as any).customName || media.fileName;
    });

    setDurations(initialDurations);
    setCustomNames(initialNames);
  }, [carouselMedia]);

  // ==================== HANDLERS ====================
  const handleGoBack = useCallback(() => {
    if (!navigation) {
      console.error("Navigation prop is undefined");
      return;
    }
    navigation.goBack();
  }, [navigation]);

  const openTotemModal = useCallback(() => {
    setTotemCode("");
    setTotemModalVisible(true);
  }, []);

  const closeTotemModal = useCallback(() => {
    setTotemModalVisible(false);
    setTotemCode("");
  }, []);

  const confirmDownload = useCallback(() => {
    if (!totemCode.trim()) {
      Alert.alert("Erro", "Por favor, digite o código do totem");
      return;
    }
    setTotemModalVisible(false);
    downloadPublicities(totemCode.trim());
  }, [totemCode, downloadPublicities]);

  const pickMedia = useCallback(async () => {
    await pickMediaHandler();
  }, [pickMediaHandler]);

  // ==================== RENDER ITEM ====================
  const renderMediaItem = useCallback(
    ({ item: media }: { item: ICarouselMedia }) => {
      const isEditingName = editingNameId === media.id;
      const displayName = (media as any).customName || media.fileName;

      return (
        <MediaItem
          media={media}
          isEditing={isEditingName}
          displayName={displayName}
          duration={
            durations[media.id] || MEDIA_CONFIG.DEFAULT_DURATION.toString()
          }
          customName={customNames[media.id] || displayName}
          onEdit={() => setEditingNameId(media.id)}
          onSave={() => handleSaveCustomName(media.id)}
          onRemove={() => handleRemoveMedia(media.id)}
          onDurationChange={(value) => handleDurationChange(media.id, value)}
          onNameChange={(value) => handleCustomNameChange(media.id, value)}
          onDurationBlur={() => handleDurationBlur(media.id)}
        />
      );
    },
    [
      editingNameId,
      durations,
      customNames,
      handleSaveCustomName,
      handleRemoveMedia,
      handleDurationChange,
      handleCustomNameChange,
      handleDurationBlur,
    ]
  );

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    handleLoadingDatas();
  }, [handleLoadingDatas]);

  // ==================== RENDER ====================
  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <Pressable onPress={handleGoBack}>
          <ArrowLeft color="#000" size={24} />
        </Pressable>
        <Text style={tw`text-2xl font-bold`}>⚙️ Gerenciar</Text>
        <View style={tw`w-6`} />
      </View>

      {/* Media Section */}
      <View style={tw`mb-6 p-4 bg-gray-50 rounded-lg flex-1`}>
        <Text style={tw`text-lg font-bold mb-3`}>🎬 Carrossel de Mídia</Text>

        <Pressable
          style={tw`bg-purple-600 p-3 rounded mb-3 flex-row items-center justify-center shadow`}
          onPress={pickMedia}
          disabled={uploadingMedia}
        >
          <ImageIcon color="white" size={20} style={tw`mr-2`} />
          <Text style={tw`text-white font-bold`}>
            {uploadingMedia ? "Carregando..." : "Adicionar Foto/Vídeo"}
          </Text>
        </Pressable>

        {carouselMedia.length > 0 ? (
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
              📁 Mídias ({carouselMedia.length})
            </Text>
            <FlatList
              data={carouselMedia}
              keyExtractor={(item) => item.id}
              renderItem={renderMediaItem}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={tw`pb-4`}
            />
          </View>
        ) : (
          <EmptyMediaState />
        )}
      </View>

      {/* Action Buttons */}
      <View style={tw`flex-row gap-4 mt-4`}>
        <View style={tw`flex-1`}>
          <Button
            title={loadingDownload ? "Baixando..." : "📥 Baixar Publicidades"}
            onPress={openTotemModal}
            disabled={loadingDownload || uploadingMedia}
          />
        </View>
        <Pressable
          onPress={clearPublicities}
          style={tw`justify-center bg-red-50 px-4 rounded`}
        >
          <Trash color="red" size={35} />
        </Pressable>
      </View>

      {/* Totem Modal */}
      <TotemModal
        visible={totemModalVisible}
        code={totemCode}
        onChangeCode={setTotemCode}
        onCancel={closeTotemModal}
        onConfirm={confirmDownload}
      />
    </View>
  );
}

AdminComponent.displayName = "Admin";
export const Admin = AdminComponent;
