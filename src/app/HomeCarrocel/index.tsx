import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Icon from "@react-native-vector-icons/fontawesome";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { VideoView, useVideoPlayer } from "expo-video";
import { useFocusEffect } from "@react-navigation/native";

import { StackRoutesProps } from "@/routes/StackRoutes";
import { styles } from "./styles";
import { Logo } from "@/components/Logo";
import { useSharedValue } from "react-native-reanimated";
import { useMedia, ICarouselMedia } from "@/hooks/use-midia";

// Componente para renderizar vídeos
function VideoCarouselItem({
  uri,
  onVideoEnd,
  isActive,
  isPaused,
}: {
  uri: string;
  onVideoEnd: () => void;
  isActive: boolean;
  isPaused: boolean;
}) {
  const { width, height } = Dimensions.get("window");

  const player = useVideoPlayer(uri, (player) => {
    player.loop = false; // Desativa loop para detectar fim
  });

  // Monitorar quando o vídeo termina
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const status = player.status;

      // Quando o vídeo terminar
      if (status === "idle" && player.currentTime > 0) {
        onVideoEnd();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player, onVideoEnd]);

  // Controlar play/pause baseado se está ativo E se a tela está em foco
  useEffect(() => {
    if (isActive && !isPaused) {
      player.play();
    } else {
      player.pause();
      if (!isActive) {
        player.currentTime = 0; // Resetar vídeo apenas se não estiver ativo
      }
    }
  }, [isActive, isPaused, player]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <VideoView
        player={player}
        style={{ width: width, height: height }}
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture={false}
        nativeControls={false}
      />
    </View>
  );
}

export function HomeCarrocel({ navigation }: StackRoutesProps<"homeCarrocel">) {
  const [tasksModalVisible, setTasksModalVisible] = useState(false);
  const [tasksPassword, setTasksPassword] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const progress = useSharedValue<number>(0);
  const ref = useRef<ICarouselInstance>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { width, height } = Dimensions.get("window");
  const { handleLoadingDatas, carouselMedia, loading } = useMedia();

  const TASKS_KEY = "Tasks1234@";

  // Detectar quando a tela está em foco ou não
  useFocusEffect(
    useCallback(() => {
      // Tela entrou em foco
      console.log("📱 Tela HomeCarrocel em FOCO - Retomando carrossel");
      setIsScreenFocused(true);

      // Recarregar mídias quando a tela voltar ao foco
      handleLoadingDatas().then(() => {
        console.log("🔄 Mídias recarregadas com sucesso!");
      });

      return () => {
        // Tela saiu de foco
        console.log("📱 Tela HomeCarrocel FORA DE FOCO - Pausando carrossel");
        setIsScreenFocused(false);

        // Limpar timer ao sair da tela
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
          autoPlayTimerRef.current = null;
        }
      };
    }, [handleLoadingDatas])
  );

  function acessoTasks() {
    // Descomente para ativar a validação de senha
    if (tasksPassword !== TASKS_KEY) {
      Alert.alert("Código inválido");
      setTasksPassword("");
      return;
    }
    setTasksModalVisible(false);
    navigation.navigate("admin");
    setTasksPassword("");
  }

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  // Avançar para próximo item - CORRIGIDO
  const goToNext = () => {
    if (carouselMedia.length === 0) return;

    // Usar next() em vez de scrollTo para navegação mais suave
    ref.current?.next();
  };

  // Handler quando vídeo termina
  const handleVideoEnd = () => {
    console.log("Vídeo terminou, avançando...");
    goToNext();
  };

  // Gerenciar autoplay para imagens - ATUALIZADO para considerar foco da tela
  useEffect(() => {
    // Limpar timer anterior
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    // Só executar se a tela estiver em foco
    if (!isScreenFocused) {
      console.log("⏸️ Tela não está em foco, autoplay pausado");
      return;
    }

    const currentItem = carouselMedia[currentIndex];

    // Se for imagem, usar timer customizado ou padrão de 7 segundos
    if (currentItem && currentItem.type === "image" && autoPlayEnabled) {
      const duration = currentItem.duration || 7; // Padrão: 7 segundos
      const durationMs = duration * 1000;

      console.log(
        `▶️ Imagem "${currentItem.fileName}" - Duração: ${duration}s`
      );

      autoPlayTimerRef.current = setTimeout(() => {
        goToNext();
      }, durationMs);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [currentIndex, carouselMedia, autoPlayEnabled, isScreenFocused]);

  // Atualizar índice atual quando carrossel mudar
  const handleSnapToItem = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    handleLoadingDatas();
  }, []);

  // Função para renderizar cada item do carrossel
  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: ICarouselMedia;
    index: number;
  }) => {
    if (item.type === "video") {
      return (
        <VideoCarouselItem
          uri={item.uri}
          onVideoEnd={handleVideoEnd}
          isActive={index === currentIndex}
          isPaused={!isScreenFocused}
        />
      );
    }

    // Renderizar imagem
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={{ uri: item.uri }}
          style={{ width: width * 0.9, height: height * 0.7 }}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => setTasksModalVisible(true)}>
          <Icon name="gear" size={24} color="purple" />
        </Pressable>
      </View>

      {/* Conteúdo principal - CARROSSEL */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {loading ? (
          // Estado de carregamento
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="purple" />
            <Text style={{ marginTop: 10, color: "#666" }}>
              Carregando mídias...
            </Text>
          </View>
        ) : carouselMedia.length === 0 ? (
          // Estado vazio - sem mídias
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Icon name="image" size={64} color="#ccc" />
            <Text
              style={{
                marginTop: 20,
                fontSize: 18,
                color: "#666",
                textAlign: "center",
              }}
            >
              Nenhuma mídia disponível
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "#999",
                textAlign: "center",
              }}
            >
              Adicione fotos ou vídeos na tela de administração
            </Text>
            <Pressable
              onPress={() => setTasksModalVisible(true)}
              style={{
                marginTop: 20,
                backgroundColor: "purple",
                paddingHorizontal: 30,
                paddingVertical: 15,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                Ir para Admin
              </Text>
            </Pressable>
          </View>
        ) : (
          // CARROSSEL COM MÍDIAS
          <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
            <Carousel
              loop
              ref={ref}
              width={width}
              height={height * 0.85}
              autoPlay={false} // Desativado - controle manual
              data={carouselMedia}
              onProgressChange={progress}
              onSnapToItem={handleSnapToItem}
              style={{ width: "100%", height: "100%" }}
              renderItem={renderCarouselItem}
              // Configurações adicionais para transição suave
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 1,
                parallaxScrollingOffset: 0,
              }}
            />
          </View>
        )}
      </View>

      {/* Modal Tasks/Admin */}
      <Modal
        animationType="slide"
        transparent
        visible={tasksModalVisible}
        onRequestClose={() => setTasksModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Publicidades</Text>

            <TextInput
              placeholder="Digite a chave"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry
              value={tasksPassword}
              onChangeText={setTasksPassword}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setTasksModalVisible(false);
                  setTasksPassword("");
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={acessoTasks}>
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
