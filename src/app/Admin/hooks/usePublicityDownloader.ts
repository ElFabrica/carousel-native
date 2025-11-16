import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { ICarouselMedia } from "@/hooks/use-midia";
import { API_CONFIG, MEDIA_CONFIG } from "../constants";

interface UsePublicityDownloaderProps {
  carouselMedia: ICarouselMedia[];
  addMedia: (media: ICarouselMedia) => Promise<void>;
  handleLoadingDatas: () => Promise<void>;
  clearAllMedia: () => Promise<void>;
}

export function usePublicityDownloader({
  carouselMedia,
  addMedia,
  handleLoadingDatas,
  clearAllMedia,
}: UsePublicityDownloaderProps) {
  const [loadingDownload, setLoadingDownload] = useState(false);

  const downloadPublicities = useCallback(
    async (codTotem: string) => {
      setLoadingDownload(true);
      try {
        const response = await fetch(API_CONFIG.ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codTotem }),
        });

        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

        const data = await response.json();

        if (data.status !== "success" || !data.response?.publicities) {
          throw new Error("Formato de resposta inválido");
        }

        const publicities = data.response.publicities;

        if (publicities.length === 0) {
          Alert.alert("Aviso", "Nenhuma publicidade encontrada");
          return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const publicity of publicities) {
          try {
            if (!publicity.ativo) continue;

            const isVideo = publicity.tipo_arquivo === "video";
            let fileUrl = isVideo
              ? publicity.publi_video
              : publicity.publi_image;

            if (!fileUrl) {
              errorCount++;
              continue;
            }

            if (fileUrl.startsWith("//")) fileUrl = `https:${fileUrl}`;

            const fileExtension =
              fileUrl.split(".").pop()?.split("?")[0] ||
              (isVideo ? "mp4" : "jpg");
            const localFileName = `publicity_${publicity._id}.${fileExtension}`;
            const localUri = `${FileSystem.documentDirectory}${localFileName}`;

            const fileInfo = await FileSystem.getInfoAsync(localUri);

            if (!fileInfo.exists) {
              const downloadResult = await FileSystem.downloadAsync(
                fileUrl,
                localUri
              );
              if (downloadResult.status !== 200)
                throw new Error(`Erro ao baixar: ${downloadResult.status}`);
            }

            const newMedia: any = {
              id: publicity._id,
              uri: localUri,
              type: isVideo ? "video" : "image",
              fileName: localFileName,
              customName: publicity.nome_referencia || "Sem nome",
              createdAt: new Date(publicity["Created Date"]).toISOString(),
              duration: isVideo ? undefined : MEDIA_CONFIG.DEFAULT_DURATION,
              order: publicity.order || 0,
            };

            const existingMedia = carouselMedia.find(
              (m) => m.id === newMedia.id
            );
            if (!existingMedia) await addMedia(newMedia);

            successCount++;
          } catch (error) {
            console.error(
              `Erro ao processar "${publicity.nome_referencia}":`,
              error
            );
            errorCount++;
          }
        }

        await handleLoadingDatas();

        if (successCount > 0) {
          Alert.alert(
            "Download concluído!",
            `✅ ${successCount} mídia(s) processada(s)!`
          );
        } else {
          Alert.alert(
            "Nenhuma mídia nova",
            "Todas as mídias já estão baixadas."
          );
        }
      } catch (error) {
        console.error("Erro ao baixar publicidades:", error);
        Alert.alert(
          "Erro",
          `Não foi possível baixar as publicidades.\n\n${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      } finally {
        setLoadingDownload(false);
      }
    },
    [carouselMedia, addMedia, handleLoadingDatas]
  );

  const handleClearAllPublicities = useCallback(() => {
    Alert.alert(
      "⚠️ Confirmar exclusão",
      "Deseja realmente remover TODAS as mídias?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllMedia();
              Alert.alert("✅ Sucesso", "Todas as mídias foram removidas!");
            } catch (error) {
              console.error("Erro ao limpar mídias:", error);
              Alert.alert("Erro", "Não foi possível remover as mídias");
            }
          },
        },
      ]
    );
  }, [clearAllMedia]);

  return {
    loadingDownload,
    downloadPublicities,
    handleClearAllPublicities,
  };
}
