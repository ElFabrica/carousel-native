import { View, Text, Pressable, Modal, TextInput, Alert, ImageBackground, Image } from "react-native";
import React, { useState } from "react";
import tw from 'twrnc';
import LottieView from 'lottie-react-native';
import Icon from "@react-native-vector-icons/fontawesome";

import { StackRoutesProps } from "@/routes/StackRoutes";
import { styles } from "./styles";
import { Button } from "@/components/button";
import { Logo } from "@/components/Logo";

export function Home({ navigation }: StackRoutesProps<"home">) {
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [acessoModalVisible, setAcessoModalVisible] = useState(false);
  const [tasksModalVisible, setTasksModalVisible] = useState(false);
  const [chave, setChave] = useState('');
  const [tasksPassword, setTasksPassword] = useState('');
  const [sorteioModalVisible, setSorteioModalVisible] = useState(false);
  const [sorteioPassowd, setSorteioPassowd] = useState('');

  const ACESSO_KEY = "Fala1234@";
  const ACESSO_SORTEIO = "safadao18@";
  const TASKS_KEY = "Tasks1234@";

  // Função de verificar senha para acesso restrito (Users)
  function acessoRestrito() {
    if (chave !== ACESSO_KEY) {
      Alert.alert("Código inválido");
      setChave("");
      return;
    }
    setAcessoModalVisible(false);
    setOptionsModalVisible(false);
    navigation.navigate("users");
    setChave("");
  }

  // Função de verificar senha para Tasks/Admin
  function acessoTasks() {
    if (tasksPassword !== TASKS_KEY) {
      Alert.alert("Código inválido");
      setTasksPassword("");
      return;
    }
    setTasksModalVisible(false);
    setOptionsModalVisible(false);
    navigation.navigate("admin");
    setTasksPassword("");
  }

  function handleAcessoSorteio() {
    if (sorteioPassowd !== ACESSO_SORTEIO) {
      Alert.alert("Código inválido");
      setSorteioPassowd("");
      return;
    }
    setSorteioModalVisible(false);
    navigation.navigate("sorteio");
    setSorteioPassowd("");
  }

  return (


    <View style={styles.container}>
      <ImageBackground className="flex-1" source={require("@/assets/bg-app.png")} >
        <Pressable onPress={() => navigation.navigate("form")} className="flex-1">
          {/* Ícone de configurações */}
          <View style={styles.header}>

            <Pressable onPress={() => setOptionsModalVisible(true)}>
              <Icon name="gear" size={24} color="purple" />
            </Pressable>
            <Logo />
          </View>

          {/* Conteúdo principal */}
          {/*Sem conteúdo*/}

          {/* Modal com opções */}
          <Modal
            animationType="fade"
            transparent
            visible={optionsModalVisible}
            onRequestClose={() => setOptionsModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Configurações</Text>

                <Pressable
                  style={tw`bg-purple-500 p-4 rounded-md`}
                  onPress={() => {
                    setAcessoModalVisible(true);
                    setOptionsModalVisible(false);
                  }}
                >
                  <Text style={tw`text-white font-bold text-center`}>
                    Acesso Restrito
                  </Text>
                </Pressable>

                <Pressable
                  style={tw`bg-green-600 p-4 rounded-md`}
                  onPress={() => {
                    setTasksModalVisible(true);
                    setOptionsModalVisible(false);
                  }}
                >
                  <Text style={tw`text-white font-bold text-center`}>
                    Tasks
                  </Text>
                </Pressable>
                <Pressable
                  style={tw`bg-purple-600 p-4 rounded-md`}
                  onPress={() => {
                    setSorteioModalVisible(true);
                    setOptionsModalVisible(false);
                  }}
                >
                  <Text style={tw`text-white font-bold text-center`}>
                    Sorteio
                  </Text>
                </Pressable>

                <Pressable
                  style={tw`mt-4`}
                  onPress={() => setOptionsModalVisible(false)}
                >
                  <Text style={tw`text-red-500 text-center font-bold`}>Fechar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* Modal Acesso Restrito */}
          <Modal
            animationType="slide"
            transparent
            visible={acessoModalVisible}
            onRequestClose={() => setAcessoModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Acesso Restrito</Text>

                <TextInput
                  placeholder="Digite a chave"
                  placeholderTextColor="#888"
                  style={styles.input}
                  secureTextEntry
                  value={chave}
                  onChangeText={setChave}
                />

                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => [setAcessoModalVisible(false), setChave("")]}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.confirmButton}
                    onPress={acessoRestrito}
                  >
                    <Text style={styles.modalButtonText}>Confirmar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal Tasks/Admin */}
          <Modal
            animationType="slide"
            transparent
            visible={tasksModalVisible}
            onRequestClose={() => setTasksModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Acesso Tasks</Text>

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
                    onPress={() => [setTasksModalVisible(false), setTasksPassword("")]}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.confirmButton}
                    onPress={acessoTasks}
                  >
                    <Text style={styles.modalButtonText}>Confirmar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          {/* Modal Sorteio */}
          <Modal
            animationType="slide"
            transparent
            visible={sorteioModalVisible}
            onRequestClose={() => setSorteioModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Acesso ao sorteio</Text>

                <TextInput
                  placeholder="Digite a chave"
                  placeholderTextColor="#888"
                  style={styles.input}
                  secureTextEntry
                  value={sorteioPassowd}
                  onChangeText={setSorteioPassowd}
                />

                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => [setTasksModalVisible(false), setTasksPassword("")]}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.confirmButton}
                    onPress={handleAcessoSorteio}
                  >
                    <Text style={styles.modalButtonText}>Confirmar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </Pressable>
      </ImageBackground>
    </View>
  );
}
