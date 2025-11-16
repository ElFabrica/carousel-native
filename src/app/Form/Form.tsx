import { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"

import { CircleDashed, CircleCheck } from "lucide-react-native";

import validator from 'email-validator';
import { styles } from "./styles";
import LottieView from 'lottie-react-native';
import { UserStorge } from "@/storge/Users";
import MaskInput from 'react-native-mask-input'
import { StackRoutesProps } from "@/routes/StackRoutes";
import { Button } from "@/components/button";
import { Input } from "@/components/Input";
import { LogoAbsolut } from "@/components/LogoAbsolut";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "@/shared/style/colors";
import { useQuizContext } from "@/contexts/useUser.context";
import { IUserStorage } from "@/shared/interfaces/User-Storage";

export function Form({ navigation }: StackRoutesProps<"form">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { handleSelectUser } = useQuizContext()
  //Função que salva o formulário no storge do smartphone
  async function onSubmit() {
    //Valida de algum dos dados estão vazios
    if (!(name && email && phone)) {
      Alert.alert("Erro", "Preencha todos os dados");
      return;
    }
    //Valida se o email é um email válido (Não verifica se o email existe)
    /*if (!validator.validate(email)) {
      Alert.alert("Erro", "E-mail inválido");
      return;
    }*/
    //Caso funcione tudo redondo
    try {
      const newItem = {
        id: Math.random().toString(36).substring(2),
        name,
        email,
        phone,
        sorteio: false
      }
      await UserStorge.add(newItem)
      handleSelectUser(newItem)
      // Limpeza do formulário
      setName("");
      setEmail("");
      setPhone("")

      // Navega para a próxima tela
      navigation.navigate("instructions");
    } catch (error) {
      console.error("Erro ao salvar dados no banco:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  }

  return (
    <View className=" flex-1 py-5">
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row justify-between">
            <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
              <MaterialIcons name="arrow-back" size={24} />
            </TouchableOpacity>
            <LogoAbsolut />
          </View>
          <View style={styles.animationContainer}>
            <LottieView
              source={require('../../assets/animations/Form.json')}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>

          <Text style={styles.title}>
            Cadastro
          </Text>

          <View style={styles.content}>
            {/* NOME */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome</Text>
              <Input place="John"
                value={name}
                onChangeText={setName}
              />
            </View>
            {/* EMAIL */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <Input place="seu@email.com"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* TELEFONE */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <MaskInput
                value={phone}
                onChangeText={setPhone}
                mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                keyboardType="numeric"
                placeholder="(00) 00000-0000"
                style={styles.input}
              />
            </View>
            <Pressable
              style={styles.inputContainer}
              onPress={() => setIsConfirmed(!isConfirmed)}
            >
              <View className="p-4 px-6 bg-bg-Therthiary rounded-2xl gap-1">
                <View className="flex flex-row gap-2 items-center">
                  {isConfirmed ?
                    <CircleCheck color={colors.White} size={RFValue(20)} />
                    :
                    <CircleDashed color={colors.White} size={RFValue(20)} />}
                  <Text style={{ fontSize: RFValue(14) }} className="text-white font-bold">Termos</Text>
                </View>
                <Text style={{ fontSize: RFValue(12) }} className="text-white">
                  Ao preencher com seus dados, você autoriza o uso das informações fornecidas
                  para que possamos entrar em contato e melhorar nossos serviços,
                  sempre respeitando a sua privacidade.
                </Text>
              </View>
            </Pressable>
          </View>
          {/* BOTÃO */}
          <View style={styles.Footer}>
            <Button title="Começar"
              onPress={onSubmit}
              disable={!isConfirmed}
            />

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  )
}