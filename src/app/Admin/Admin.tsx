import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  Trash,
  Settings2,
  Image as ImageIcon,
  Video,
  Clock,
  ArrowLeft,
  Edit3,
  Check,
} from "lucide-react-native";
import { Button } from "@/components/button";
import { useMedia, ICarouselMedia } from "@/hooks/use-midia";
import { StackRoutesProps } from "@/routes/StackRoutes";

export function Admin({ navigation }: StackRoutesProps<"admin">) {
  const [LoadingDownload, setLoadingDownload] = useState(false);

  // Hook de mídia
  const {
    carouselMedia,
    addMedia,
    removeMedia,
    handleLoadingDatas,
    saveCarouselMedia,
  } = useMedia();

  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Estado para controlar as durações dos inputs
  const [durations, setDurations] = useState<{ [key: string]: string }>({});

  // Estado para controlar os nomes customizados
  const [customNames, setCustomNames] = useState<{ [key: string]: string }>({});

  // Estado para controlar qual item está sendo editado
  const [editingNameId, setEditingNameId] = useState<string | null>(null);

  // ==================== FUNÇÕES DE MÍDIA ====================

  // Sincronizar durações e nomes com as mídias carregadas
  useEffect(() => {
    const initialDurations: { [key: string]: string } = {};
    const initialNames: { [key: string]: string } = {};

    carouselMedia.forEach((media) => {
      if (media.type === "image") {
        initialDurations[media.id] = (media.duration || 7).toString();
      }
      // Usar customName se existir, senão usar fileName
      initialNames[media.id] = (media as any).customName || media.fileName;
    });

    setDurations(initialDurations);
    setCustomNames(initialNames);
  }, [carouselMedia]);

  // Função para atualizar a duração de uma imagem
  const handleDurationBlur = async (mediaId: string) => {
    try {
      const durationValue = parseInt(durations[mediaId]) || 7;

      // Validação
      if (durationValue < 1) {
        Alert.alert("Erro", "A duração deve ser no mínimo 1 segundo");
        setDurations((prev) => ({ ...prev, [mediaId]: "7" }));
        return;
      }

      if (durationValue > 300) {
        Alert.alert(
          "Erro",
          "A duração deve ser no máximo 300 segundos (5 minutos)"
        );
        setDurations((prev) => ({ ...prev, [mediaId]: "60" }));
        return;
      }

      // Atualizar mídia com nova duração
      const updatedMedia = carouselMedia.map((media) => {
        if (media.id === mediaId) {
          return { ...media, duration: durationValue };
        }
        return media;
      });

      // Salvar no AsyncStorage através do hook
      await saveCarouselMedia(updatedMedia);

      console.log(
        `✅ Duração atualizada: ${durationValue}s para mídia ID: ${mediaId}`
      );
    } catch (error) {
      console.error("Erro ao atualizar duração:", error);
      Alert.alert("Erro", "Não foi possível salvar a duração");
    }
  };

  // Função para atualizar o nome customizado
  const handleSaveCustomName = async (mediaId: string) => {
    try {
      const newName = customNames[mediaId]?.trim();

      if (!newName) {
        Alert.alert("Erro", "O nome não pode estar vazio");
        return;
      }

      // Atualizar mídia com novo nome customizado
      const updatedMedia = carouselMedia.map((media) => {
        if (media.id === mediaId) {
          return { ...media, customName: newName } as any;
        }
        return media;
      });

      // Salvar no AsyncStorage
      await saveCarouselMedia(updatedMedia);

      console.log(`✅ Nome atualizado para: ${newName}`);

      // Sair do modo de edição
      setEditingNameId(null);
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      Alert.alert("Erro", "Não foi possível salvar o nome");
    }
  };

  // Atualizar duração no estado local
  const handleDurationChange = (mediaId: string, value: string) => {
    // Permite apenas números
    const numericValue = value.replace(/[^0-9]/g, "");
    setDurations((prev) => ({ ...prev, [mediaId]: numericValue }));
  };

  // Atualizar nome customizado no estado local
  const handleCustomNameChange = (mediaId: string, value: string) => {
    setCustomNames((prev) => ({ ...prev, [mediaId]: value }));
  };

  // Solicitar permissões
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar suas fotos e vídeos."
      );
      return false;
    }
    return true;
  };

  // Selecionar mídia da galeria
  const pickMedia = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setUploadingMedia(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // máximo 60 segundos
      });

      if (!result.canceled && result.assets[0]) {
        await saveMediaToStorage(result.assets[0]);
      }
    } catch (error) {
      console.error("Erro ao selecionar mídia:", error);
      Alert.alert("Erro", "Não foi possível selecionar a mídia.");
    } finally {
      setUploadingMedia(false);
    }
  };

  // Salvar mídia no storage local
  const saveMediaToStorage = async (asset: any) => {
    try {
      const mediaType = asset.type === "video" ? "video" : "image";
      const fileExtension = asset.uri.split(".").pop();
      const fileName = `carousel_${Date.now()}.${fileExtension}`;
      const localUri = `${FileSystem.documentDirectory}${fileName}`;

      // Copiar arquivo para o diretório do app
      await FileSystem.copyAsync({
        from: asset.uri,
        to: localUri,
      });

      const newMedia: any = {
        id: Math.random().toString(36).substring(2),
        uri: localUri,
        type: mediaType,
        fileName: fileName,
        customName: `Nova ${mediaType === "video" ? "Vídeo" : "Imagem"}`, // Nome padrão amigável
        createdAt: new Date().toISOString(),
        duration: mediaType === "image" ? 7 : undefined,
      };

      // Usar o hook para adicionar mídia
      await addMedia(newMedia);

      Alert.alert(
        "Sucesso",
        `${mediaType === "video" ? "Vídeo" : "Imagem"} adicionada ao carrossel!`
      );
    } catch (error) {
      console.error("Erro ao salvar mídia:", error);
      Alert.alert("Erro", "Não foi possível salvar a mídia.");
    }
  };

  // Remover mídia usando o hook
  const handleRemoveMedia = async (id: string) => {
    Alert.alert("Confirmar exclusão", "Deseja realmente remover esta mídia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removeMedia(id);
            Alert.alert("Sucesso", "Mídia removida do carrossel.");
          } catch (error) {
            console.error("Erro ao remover mídia:", error);
            Alert.alert("Erro", "Não foi possível remover a mídia.");
          }
        },
      },
    ]);
  };

  // ==================== RENDER ITEM DO FLATLIST ====================
  const renderMediaItem = ({ item: media }: { item: ICarouselMedia }) => {
    const isEditingName = editingNameId === media.id;
    const displayName = (media as any).customName || media.fileName;

    return (
      <View
        style={tw`p-3 bg-white rounded-lg mb-3 border border-gray-200 shadow-sm`}
      >
        {/* Linha 1: Ícone + Nome do arquivo editável + Botões */}
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <View style={tw`flex-row items-center flex-1 mr-2`}>
            {media.type === "video" ? (
              <Video color="#9333ea" size={20} style={tw`mr-2`} />
            ) : (
              <ImageIcon color="#9333ea" size={20} style={tw`mr-2`} />
            )}

            {isEditingName ? (
              // Modo de edição
              <View style={tw`flex-1 flex-row items-center`}>
                <TextInput
                  style={tw`flex-1 border border-purple-400 rounded px-2 py-1 mr-2`}
                  value={customNames[media.id] || displayName}
                  onChangeText={(value) =>
                    handleCustomNameChange(media.id, value)
                  }
                  placeholder="Nome do arquivo"
                  autoFocus
                />
                <Pressable
                  onPress={() => handleSaveCustomName(media.id)}
                  style={tw`bg-green-500 p-2 rounded`}
                >
                  <Check color="white" size={16} />
                </Pressable>
              </View>
            ) : (
              // Modo visualização
              <View style={tw`flex-1 flex-row items-center`}>
                <Text
                  style={tw`flex-1 font-medium text-base`}
                  numberOfLines={1}
                >
                  {displayName}
                </Text>
                <Pressable
                  onPress={() => setEditingNameId(media.id)}
                  style={tw`ml-2 p-1`}
                >
                  <Edit3 color="#9333ea" size={16} />
                </Pressable>
              </View>
            )}
          </View>

          <Pressable onPress={() => handleRemoveMedia(media.id)}>
            <Trash color="red" size={20} />
          </Pressable>
        </View>

        {/* Nome técnico do arquivo (pequeno e discreto) */}
        <Text style={tw`text-xs text-gray-400 mb-2`}>
          Arquivo: {media.fileName}
        </Text>

        {/* Linha 2: Input de duração (APENAS PARA IMAGENS) */}
        {media.type === "image" && (
          <View style={tw`flex-row items-center mt-2 bg-purple-50 p-2 rounded`}>
            <Clock color="#9333ea" size={16} style={tw`mr-2`} />
            <Text style={tw`text-sm text-gray-700 mr-2 font-medium`}>
              Duração:
            </Text>
            <TextInput
              style={tw`border border-gray-300 bg-white rounded px-3 py-1.5 w-20 text-center font-semibold`}
              keyboardType="numeric"
              value={durations[media.id] || "7"}
              onChangeText={(value) => handleDurationChange(media.id, value)}
              onBlur={() => handleDurationBlur(media.id)}
              placeholder="7"
            />
            <Text style={tw`text-sm text-gray-700 ml-2`}>segundos</Text>
          </View>
        )}

        {/* Informação para vídeos */}
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
  };

  // ==================== EFFECTS ====================

  useEffect(() => {
    handleLoadingDatas(); // Carregar mídias usando o hook
  }, []);

  // ==================== RENDER ====================

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft color="#000" size={24} />
        </Pressable>
        <Text style={tw`text-2xl font-bold`}>⚙️ Gerenciar</Text>
        <View style={tw`w-6`} />
      </View>

      {/* ========== SEÇÃO DE MÍDIA DO CARROSSEL ========== */}
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

        {/* FLATLIST de mídias COM INPUT DE DURAÇÃO */}
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
              ListEmptyComponent={
                <View style={tw`p-4 items-center`}>
                  <Text style={tw`text-gray-500`}>
                    Nenhuma mídia adicionada ainda
                  </Text>
                </View>
              }
            />
          </View>
        ) : (
          <View style={tw`flex-1 items-center justify-center`}>
            <ImageIcon color="#ccc" size={48} />
            <Text style={tw`text-gray-500 mt-2`}>Nenhuma mídia adicionada</Text>
            <Text style={tw`text-gray-400 mt-1 text-sm text-center px-8`}>
              Clique no botão acima para adicionar fotos e vídeos
            </Text>
          </View>
        )}
      </View>

      {/* Botões de ação */}
      <View style={tw`flex-row gap-4 mt-4`}>
        <View style={tw`flex-1`}>
          <Button
            title={LoadingDownload ? "Carregando..." : "Baixar Dados"}
            disabled={LoadingDownload}
          />
        </View>
        <Pressable style={tw`justify-center`}>
          <Trash color="red" size={35} />
        </Pressable>
      </View>
    </View>
  );
}
