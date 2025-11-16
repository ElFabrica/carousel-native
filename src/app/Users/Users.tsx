
import { View, Text, Pressable, Alert, TextInput, Modal, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import tw from 'twrnc';
import { UserStorge } from '../../storge/Users';
import { IUserStorage } from '@/shared/interfaces/User-Storage';

export function Users() {

  const [userStorge, setUserStorge] = useState<IUserStorage[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [password, setPassword] = useState('');



  const CORRECT_KEY = "Fala1234@";//Top Senhas

  async function handleUserClear() {
    try {
      await UserStorge.clear()

      await handleUsers()

    } catch (error) {
      console.log(error)
      Alert.alert("Remover", `Não foi possível remover.`)
    }
  }
  //Função que verifica a senha para limpar dos dados
  const handleClearConfirmation = () => {
    if (password === CORRECT_KEY) {
      handleUserClear()
      handleUsers();
      setModalVisible(false);
      setPassword('');
    } else {
      Alert.alert("Senha incorreta", "A chave digitada está incorreta.");
    }
  };
  //Função que sobe os dados para o banco (É chamada em um loop mais abaixo)
  const UpdateItems = async ({ id, name, email, phone, game, }: IUserStorage) => {
    try {
      const data = { id, name, email, phone, game: "Quiz", anotacao: "Show do safadão 17-10-25" };
      const response = await fetch("https://nasago.bubbleapps.io/version-test/api/1.1/wf/form_totem", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await response.json();
      console.log(json);
    } catch (error) {
      Alert.alert("Erro de conexão ou inesperado.");
      console.error('Erro:', error);
    }
  };
  //Função que ocorre em cada item do Storge do smarthpone para e manda para o banco
  const loopUpdateItems = async () => {
    for (let item of userStorge) {
      await UpdateItems({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        game: "Quiz",
      });
    }
    Alert.alert("Dados enviados com sucesso!");
  };

  //Função que pega os dados do storge da tabela "TABLE_NAME"
  async function handleUsers() {
    try {
      const response = await UserStorge.get()
      console.log(response)
      setUserStorge(response)
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Não foi possível atualizar os status.")

    }
  }

  useEffect(() => {

    try {
      handleUsers()
    } catch (e) {
      console.error("Erro ao inicializar banco:", e);
      Alert.alert("Erro", "Não foi possível carregar o banco de dados.");
    }


  }, []);

  return (
    <View style={tw`flex-1 items-center mt-8 px-4`}>
      <Text style={tw`text-xl font-medium`}>{userStorge.length} Inscritos</Text>
      <View style={tw`mt-6 w-full`}>
        {userStorge.length > 0 && (
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base text-center min-w-30`}>Nome</Text>
            <Text style={tw`text-base text-center min-w-30`}>Email</Text>
            <Text style={tw`text-base text-center min-w-30`}>Telefone</Text>
          </View>
        )}
        <View style={{ height: "84%" }}>
          <FlatList
            data={userStorge}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View key={item.id} style={tw`flex-row justify-between`}>
                <Text style={tw`text-base text-center min-w-30`}>{item.name}</Text>
                <Text style={tw`text-base text-center min-w-30`}>{item.email}</Text>
                <Text style={tw`text-base text-center min-w-30`}>{item.phone}</Text>
              </View>
            )
            }
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={() => <Text style={tw`text-center text-base`}>Nenhum dado encontrado...</Text>}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
          />
        </View>
        {/*Footer*/}
        {userStorge.length > 0 && (
          <View style={tw`flex-row absolute items-center justify-center gap-4 mt-4 bottom-5 left-5 right-5`}>
            <Pressable
              style={tw`bg-purple-500 p-4 rounded-md`}
              onPress={() => setUploadModalVisible(true)}
            >
              <Text style={tw`text-white font-bold`}>Subir dados</Text>
            </Pressable>

            <Pressable
              style={tw`bg-red-500 p-4 rounded-md`}
              onPress={() => setModalVisible(true)}
            >
              <Text style={tw`text-white font-bold`}>Limpar dados</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* 🔐 Modal limpar */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-6 rounded-lg w-80`}>
            <Text style={tw`text-lg font-bold mb-4`}>
              Digite a chave para limpar
            </Text>
            <TextInput
              placeholder="Digite aqui..."
              style={tw`border border-gray-400 rounded-md p-2 mb-4`}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={tw`flex-row justify-between`}>
              <Pressable
                style={tw`bg-gray-400 px-4 py-2 rounded-md`}
                onPress={() => {
                  setModalVisible(false);
                  setPassword('');
                }}
              >
                <Text style={tw`text-white font-bold`}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={tw`bg-red-500 px-4 py-2 rounded-md`}
                onPress={handleClearConfirmation}
              >
                <Text style={tw`text-white font-bold`}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🚀 Modal Upload */}
      <Modal
        transparent
        visible={uploadModalVisible}
        animationType="slide"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-6 rounded-lg w-80`}>
            <Text style={tw`text-lg font-bold mb-4`}>
              Deseja realmente enviar os dados?
            </Text>
            <Text style={tw`mb-4`}>
              Isso irá enviar todos os inscritos para o servidor.
            </Text>
            <View style={tw`flex-row justify-between`}>
              <Pressable
                style={tw`bg-gray-400 px-4 py-2 rounded-md`}
                onPress={() => setUploadModalVisible(false)}
              >
                <Text style={tw`text-white font-bold`}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={tw`bg-purple-500 px-4 py-2 rounded-md`}
                onPress={() => {
                  setUploadModalVisible(false);
                  loopUpdateItems();
                }}
              >
                <Text style={tw`text-white font-bold`}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}