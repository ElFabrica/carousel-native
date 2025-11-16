// @/hooks/use-midia.ts
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { ITEMS_STORGE_KEY_CAROUSEL } from "@/storge/Midia";

export interface ICarouselMedia {
  id: string;
  uri: string;
  type: "image" | "video";
  fileName: string;
  createdAt: string;
  duration?: number; // Duração em segundos (apenas para imagens)
}

export function useMedia() {
  const [carouselMedia, setCarouselMedia] = useState<ICarouselMedia[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar mídias do AsyncStorage
  const handleLoadingDatas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(ITEMS_STORGE_KEY_CAROUSEL);

      if (data) {
        const parsedData: ICarouselMedia[] = JSON.parse(data);

        // Verificar se os arquivos ainda existem
        const validMedia: ICarouselMedia[] = [];

        for (const media of parsedData) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(media.uri);
            if (fileInfo.exists) {
              validMedia.push(media);
            }
          } catch (error) {
            console.log(`Arquivo não encontrado: ${media.fileName}`);
          }
        }

        setCarouselMedia(validMedia);

        // Atualizar storage se alguns arquivos foram removidos
        if (validMedia.length !== parsedData.length) {
          await AsyncStorage.setItem(
            ITEMS_STORGE_KEY_CAROUSEL,
            JSON.stringify(validMedia)
          );
        }
      } else {
        setCarouselMedia([]);
      }
    } catch (error) {
      console.error("Erro ao carregar mídias:", error);
      setCarouselMedia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar mídias no AsyncStorage
  const saveCarouselMedia = useCallback(async (media: ICarouselMedia[]) => {
    try {
      await AsyncStorage.setItem(
        ITEMS_STORGE_KEY_CAROUSEL,
        JSON.stringify(media)
      );
      setCarouselMedia(media);
    } catch (error) {
      console.error("Erro ao salvar mídias:", error);
      throw error;
    }
  }, []);

  // Adicionar nova mídia
  const addMedia = useCallback(async (newMedia: ICarouselMedia) => {
    try {
      const currentMedia = await AsyncStorage.getItem(
        ITEMS_STORGE_KEY_CAROUSEL
      );
      const parsedMedia: ICarouselMedia[] = currentMedia
        ? JSON.parse(currentMedia)
        : [];
      const updatedMedia = [...parsedMedia, newMedia];

      await AsyncStorage.setItem(
        ITEMS_STORGE_KEY_CAROUSEL,
        JSON.stringify(updatedMedia)
      );
      setCarouselMedia(updatedMedia);
    } catch (error) {
      console.error("Erro ao adicionar mídia:", error);
      throw error;
    }
  }, []);

  // Remover mídia
  const removeMedia = useCallback(
    async (id: string) => {
      try {
        const mediaToRemove = carouselMedia.find((m) => m.id === id);

        if (mediaToRemove) {
          // Deletar arquivo físico
          await FileSystem.deleteAsync(mediaToRemove.uri, { idempotent: true });

          // Atualizar lista
          const updatedMedia = carouselMedia.filter((m) => m.id !== id);
          await AsyncStorage.setItem(
            ITEMS_STORGE_KEY_CAROUSEL,
            JSON.stringify(updatedMedia)
          );
          setCarouselMedia(updatedMedia);
        }
      } catch (error) {
        console.error("Erro ao remover mídia:", error);
        throw error;
      }
    },
    [carouselMedia]
  );

  // Limpar todas as mídias
  const clearAllMedia = useCallback(async () => {
    try {
      // Deletar todos os arquivos físicos
      for (const media of carouselMedia) {
        await FileSystem.deleteAsync(media.uri, { idempotent: true });
      }

      // Limpar storage
      await AsyncStorage.removeItem(ITEMS_STORGE_KEY_CAROUSEL);
      setCarouselMedia([]);
    } catch (error) {
      console.error("Erro ao limpar mídias:", error);
      throw error;
    }
  }, [carouselMedia]);

  return {
    carouselMedia,
    loading,
    handleLoadingDatas,
    saveCarouselMedia,
    addMedia,
    removeMedia,
    clearAllMedia,
  };
}
