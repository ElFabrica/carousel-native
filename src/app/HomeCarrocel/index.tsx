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
import { useSharedValue } from "react-native-reanimated";

import { StackRoutesProps } from "@/routes/StackRoutes";
import { styles } from "./styles";
import { useMedia, ICarouselMedia } from "@/hooks/use-midia";
import { EmptyState } from "./EmptyState";

// ==================== CONSTANTES ====================
const TASKS_KEY = "ActDigital@2024";
const DEFAULT_IMAGE_DURATION = 7;
const VIDEO_END_CHECK_INTERVAL = 100;

// ==================== COMPONENTES AUXILIARES ====================

interface VideoCarouselItemProps {
  uri: string;
  onVideoEnd: () => void;
  isActive: boolean;
  isPaused: boolean;
}

function VideoCarouselItem({
  uri,
  onVideoEnd,
  isActive,
  isPaused,
}: VideoCarouselItemProps) {
  const { width, height } = Dimensions.get("window");
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
  });

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const { status, currentTime } = player;

      if (status === "idle" && currentTime > 0) {
        onVideoEnd();
        clearInterval(interval);
      }
    }, VIDEO_END_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [player, onVideoEnd]);

  useEffect(() => {
    if (isActive && !isPaused) {
      player.play();
    } else {
      player.pause();
      if (!isActive) {
        player.currentTime = 0;
      }
    }
  }, [isActive, isPaused, player]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <VideoView
        player={player}
        style={{ width, height }}
        contentFit="contain"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />
    </View>
  );
}

interface ImageCarouselItemProps {
  uri: string;
  width: number;
  height: number;
}

function ImageCarouselItem({ uri, width, height }: ImageCarouselItemProps) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={{ uri }}
        style={{ width: width * 1, height: height * 1 }}
        resizeMode="contain"
      />
    </View>
  );
}

interface LoadingStateProps {}

function LoadingState({}: LoadingStateProps) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="purple" />
      <Text style={{ marginTop: 10, color: "#666" }}>Carregando mídias...</Text>
    </View>
  );
}

interface AdminModalProps {
  visible: boolean;
  password: string;
  onChangePassword: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

function AdminModal({
  visible,
  password,
  onChangePassword,
  onCancel,
  onConfirm,
}: AdminModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Publicidades</Text>

          <TextInput
            placeholder="Digite a chave"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={onChangePassword}
          />

          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================

export function HomeCarrocel({ navigation }: StackRoutesProps<"homeCarrocel">) {
  const [tasksModalVisible, setTasksModalVisible] = useState(false);
  const [tasksPassword, setTasksPassword] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  const progress = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { width, height } = Dimensions.get("window");
  const { handleLoadingDatas, carouselMedia, loading } = useMedia();

  // ==================== FOCUS EFFECT ====================
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);

      handleLoadingDatas().catch((error) => {
        console.error("Erro ao carregar mídias:", error);
      });

      return () => {
        setIsScreenFocused(false);

        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
          autoPlayTimerRef.current = null;
        }
      };
    }, [handleLoadingDatas])
  );

  // ==================== HANDLERS ====================
  const handleAdminAccess = useCallback(() => {
    if (TASKS_KEY !== tasksPassword) {
      setTasksPassword("");
      Alert.alert("Senha inválida", "consulte o admin!");
      return;
    }
    setTasksModalVisible(false);
    navigation.navigate("admin");
    setTasksPassword("");
  }, [navigation]);

  const goToNext = useCallback(() => {
    if (carouselMedia.length <= 1) return;

    const nextIndex = (currentIndex + 1) % carouselMedia.length;
    carouselRef.current?.scrollTo({ index: nextIndex, animated: true });
  }, [carouselMedia.length, currentIndex]);

  const handleVideoEnd = useCallback(() => {
    if (carouselMedia.length > 1) {
      goToNext();
    }
  }, [carouselMedia.length, goToNext]);

  const handleSnapToItem = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleModalCancel = useCallback(() => {
    setTasksModalVisible(false);
    setTasksPassword("");
  }, []);

  // ==================== AUTO-PLAY EFFECT ====================
  useEffect(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (!isScreenFocused) return;
    if (carouselMedia.length <= 1) return;

    const currentItem = carouselMedia[currentIndex];

    if (currentItem?.type === "image") {
      const duration = currentItem.duration || DEFAULT_IMAGE_DURATION;
      const durationMs = duration * 1000;

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
  }, [currentIndex, carouselMedia, isScreenFocused, goToNext]);

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    handleLoadingDatas();
  }, [handleLoadingDatas]);

  // ==================== RENDER ITEM ====================
  const renderCarouselItem = useCallback(
    ({ item, index }: { item: ICarouselMedia; index: number }) => {
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

      return <ImageCarouselItem uri={item.uri} width={width} height={height} />;
    },
    [currentIndex, isScreenFocused, handleVideoEnd, width, height]
  );

  // ==================== RENDER ====================
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => setTasksModalVisible(true)}>
          <Icon name="gear" size={24} color="purple" />
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {loading ? (
          <LoadingState />
        ) : carouselMedia.length === 0 ? (
          <EmptyState onAdminPress={() => setTasksModalVisible(true)} />
        ) : (
          <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
            {carouselMedia.length === 1 ? (
              // Renderizar item único sem carrossel
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {renderCarouselItem({ item: carouselMedia[0], index: 0 })}
              </View>
            ) : (
              // Renderizar carrossel normal
              <Carousel
                loop
                ref={carouselRef}
                width={width}
                height={height * 0.85}
                autoPlay={false}
                data={carouselMedia}
                onProgressChange={progress}
                onSnapToItem={handleSnapToItem}
                style={{ width: "100%", height: "100%" }}
                renderItem={renderCarouselItem}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 1,
                  parallaxScrollingOffset: 0,
                }}
              />
            )}
          </View>
        )}
      </View>

      <AdminModal
        visible={tasksModalVisible}
        password={tasksPassword}
        onChangePassword={setTasksPassword}
        onCancel={handleModalCancel}
        onConfirm={handleAdminAccess}
      />
    </View>
  );
}
