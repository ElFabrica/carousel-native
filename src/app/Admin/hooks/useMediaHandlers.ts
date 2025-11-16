import { useCallback } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ICarouselMedia } from "@/hooks/use-midia";
import { MEDIA_CONFIG } from "../constants";

interface UseMediaHandlersProps {
  durations: { [key: string]: string };
  setDurations: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  customNames: { [key: string]: string };
  setCustomNames: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  carouselMedia: ICarouselMedia[];
  saveCarouselMedia: (media: ICarouselMedia[]) => Promise<void>;
  addMedia: (media: ICarouselMedia) => Promise<void>;
  removeMedia: (id: string) => Promise<void>;
  setUploadingMedia: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingNameId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useMediaHandlers({
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
}: UseMediaHandlersProps) {
  const handleDurationChange = useCallback(
    (mediaId: string, value: string) => {
      const numericValue = value.replace(/[^0-9]/g, "");
      setDurations((prev) => ({ ...prev, [mediaId]: numericValue }));
    },
    [setDurations]
  );

  const handleCustomNameChange = useCallback(
    (mediaId: string, value: string) => {
      setCustomNames((prev) => ({ ...prev, [mediaId]: value }));
    },
    [setCustomNames]
  );

  const handleDurationBlur = useCallback(
    async (mediaId: string) => {
      try {
        const durationValue =
          parseInt(durations[mediaId]) || MEDIA_CONFIG.DEFAULT_DURATION;

        if (durationValue < MEDIA_CONFIG.MIN_DURATION) {
          Alert.alert(
            "Erro",
            `A duração deve ser no mínimo ${MEDIA_CONFIG.MIN_DURATION} segundo`
          );
          setDurations((prev) => ({
            ...prev,
            [mediaId]: MEDIA_CONFIG.DEFAULT_DURATION.toString(),
          }));
          return;
        }

        if (durationValue > MEDIA_CONFIG.MAX_DURATION) {
          Alert.alert(
            "Erro",
            `A duração deve ser no máximo ${MEDIA_CONFIG.MAX_DURATION} segundos`
          );
          setDurations((prev) => ({ ...prev, [mediaId]: "60" }));
          return;
        }

        const updatedMedia = carouselMedia.map((media) =>
          media.id === mediaId ? { ...media, duration: durationValue } : media
        );

        await saveCarouselMedia(updatedMedia);
      } catch (error) {
        console.error("Erro ao atualizar duração:", error);
        Alert.alert("Erro", "Não foi possível salvar a duração");
      }
    },
    [durations, carouselMedia, saveCarouselMedia, setDurations]
  );

  const handleSaveCustomName = useCallback(
    async (mediaId: string) => {
      try {
        const newName = customNames[mediaId]?.trim();

        if (!newName) {
          Alert.alert("Erro", "O nome não pode estar vazio");
          return;
        }

        const updatedMedia = carouselMedia.map((media) =>
          media.id === mediaId
            ? ({ ...media, customName: newName } as any)
            : media
        );

        await saveCarouselMedia(updatedMedia);
        setEditingNameId(null);
      } catch (error) {
        console.error("Erro ao atualizar nome:", error);
        Alert.alert("Erro", "Não foi possível salvar o nome");
      }
    },
    [customNames, carouselMedia, saveCarouselMedia, setEditingNameId]
  );

  const requestPermissions = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar suas fotos e vídeos."
      );
      return false;
    }
    return true;
  }, []);

  const saveMediaToStorage = useCallback(
    async (asset: any) => {
      try {
        const mediaType = asset.type === "video" ? "video" : "image";
        const fileExtension = asset.uri.split(".").pop();
        const fileName = `carousel_${Date.now()}.${fileExtension}`;
        const localUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.copyAsync({ from: asset.uri, to: localUri });

        const newMedia: any = {
          id: Math.random().toString(36).substring(2),
          uri: localUri,
          type: mediaType,
          fileName,
          customName: `Nova ${mediaType === "video" ? "Vídeo" : "Imagem"}`,
          createdAt: new Date().toISOString(),
          duration:
            mediaType === "image" ? MEDIA_CONFIG.DEFAULT_DURATION : undefined,
        };

        await addMedia(newMedia);
        Alert.alert(
          "Sucesso",
          `${mediaType === "video" ? "Vídeo" : "Imagem"} adicionada!`
        );
      } catch (error) {
        console.error("Erro ao salvar mídia:", error);
        Alert.alert("Erro", "Não foi possível salvar a mídia.");
      }
    },
    [addMedia]
  );

  const pickMedia = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setUploadingMedia(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        quality: MEDIA_CONFIG.QUALITY,
        videoMaxDuration: MEDIA_CONFIG.MAX_VIDEO_DURATION,
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
  }, [requestPermissions, saveMediaToStorage, setUploadingMedia]);

  const handleRemoveMedia = useCallback(
    async (id: string) => {
      Alert.alert(
        "Confirmar exclusão",
        "Deseja realmente remover esta mídia?",
        [
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
        ]
      );
    },
    [removeMedia]
  );

  return {
    handleDurationChange,
    handleCustomNameChange,
    handleDurationBlur,
    handleSaveCustomName,
    requestPermissions,
    pickMedia,
    handleRemoveMedia,
  };
}
