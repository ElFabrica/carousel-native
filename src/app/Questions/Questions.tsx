import { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, Alert, ImageBackground } from "react-native";
import React from "react";
import tw from "twrnc";
import * as Progress from 'react-native-progress';

import { ITaskStorge } from "@/shared/interfaces/tasks-Storge";
import { IChoiceStorge } from "@/shared/interfaces/Choice-Storage";
import { TaskStorge } from "@/storge/Tasks";
import { ChoiceStorge } from "@/storge/Choices";

import { StackRoutesProps } from "@/routes/StackRoutes";
import { styles } from "./styles";
import { Button } from "@/components/button";
import { LogoAbsolut } from "@/components/LogoAbsolut";
import LottieView from "lottie-react-native";

// ... (importações mantidas)

export function Questions({ navigation }: StackRoutesProps<"questions">) {
  const [tasks, setTasks] = useState<ITaskStorge[]>([]);
  const [choices, setChoices] = useState<IChoiceStorge[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptions, setCurrentOptions] = useState<IChoiceStorge[]>([]); // NOVO estado
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<IChoiceStorge>();
  const [isCorrect, setIsCorrect] = useState<Boolean>();
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false)

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  async function handleTasks() {
    try {
      const response = await TaskStorge.get();
      const randomizedTasks = shuffleArray(response); // embaralha perguntas
      setTasks(randomizedTasks);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível puxar as perguntas.");
    }
  }

  async function handleChoices() {
    try {
      const response = await ChoiceStorge.get();
      setChoices(response);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível puxar as alternativas.");
    }
  }

  useEffect(() => {
    handleTasks();
    handleChoices();
  }, []);

  // embaralha opções apenas quando muda a pergunta
  useEffect(() => {
    if (tasks.length === 0 || choices.length === 0) return
    const currentTask = tasks[currentQuestionIndex];
    const optionsForCurrent = choices.filter((item) => item.task === currentTask.id);
    setCurrentOptions(shuffleArray(optionsForCurrent));
  }, [currentQuestionIndex, tasks, choices]); // só atualiza quando troca a pergunta ou carrega as listas



  const handleNext = () => {
    if (currentQuestionIndex === tasks.length - 1) {
      navigation.navigate("score", { score: score });
    } else {
      if (!selectedOption) return;
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(undefined);
      setIsCorrect(undefined);
    }
  };


  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const handleOptionPress = async (pressedOption: IChoiceStorge) => {
    if (selectedOption) return;
    setSelectedOption(pressedOption);

    const isAnswerCorrect = tasks[currentQuestionIndex].choiceRight === pressedOption.id;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore((prevScore) =>
        prevScore + tasks[currentQuestionIndex].points,
      );
      setShowConfetti(true)
      await sleep(2500)
      setShowConfetti(false)
    }
  };

  if (tasks.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Nenhuma pergunta encontrada...</Text>
      </View>
    );
  }
  const handleExit = () => {
    setModalVisible(false);
    navigation.navigate("home");
  };

  const currentTask = tasks[currentQuestionIndex];

  return (
    <View className="flex-1">
      <View style={styles.container}>
        <LogoAbsolut />
        <View style={styles.progressContainer}>
          <Progress.Bar
            color="#46f23c"
            progress={(currentQuestionIndex + 1) / tasks.length}
            width={400}
            height={15}
            borderColor="#ccc"
          />

        </View>

        <View >
          <View className="flex items-start">
            <Text className="text-3xl bg-text-Primary rounded-2xl px-8 font-medium justify-center py-3 text-white text-center">
              {`${currentQuestionIndex + 1}`}

            </Text>
          </View>
          <Text style={styles.questionTitle}>
            {`${currentTask.title}`}
          </Text>
        </View>
        <View>
          {currentOptions.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.option,
                selectedOption?.id === option.id && (isCorrect
                  ? styles.optionCorrect
                  : styles.optionIncorrect),
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <Text style={styles.optionText}>{option.title}</Text>
            </Pressable>
          ))}
        </View>

        <Button
          style={{ marginTop: 20 }}
          title={currentQuestionIndex === tasks.length - 1 ? "Finalizar" : "Próximo"}
          size={22}
          onPress={handleNext}
          disable={!selectedOption || showConfetti == true}
        />

        <Pressable
          style={styles.exitButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.exitButtonText}>Sair</Text>
        </Pressable>

        <View className="flex w-full items-center mb-2 flex-1 justify-end">
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {tasks.length}
          </Text>
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Deseja realmente sair do quiz?
              </Text>

              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.modalCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Não</Text>
                </Pressable>
                <Pressable
                  style={styles.modalConfirm}
                  onPress={handleExit}
                >
                  <Text style={styles.modalConfirmText}>Sim</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {
        showConfetti && (
          <LottieView
            source={require('@/assets/animations/Congregations.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        )
      }
    </View >
  );
}
