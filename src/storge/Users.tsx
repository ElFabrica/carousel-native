import { IUserStorage } from "@/shared/interfaces/User-Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ITEMS_STORGE_KEY = "@appQuiz:Users"


//Faz uma busca de todos os itens dessa tabela
async function get(): Promise<IUserStorage[]> {
    try {
        const storge = await AsyncStorage.getItem(ITEMS_STORGE_KEY)
        return storge ? JSON.parse(storge) : []
    } catch (error) {
        throw new Error("ITEMS_GET: " + error)
    }
}
//Faz um filtro de todos os itens com base num parâmetro
//Salva os itens dentro do banco de dados do dispositivo
async function save(items: IUserStorage[]): Promise<void> {
    try {
        await AsyncStorage.setItem(ITEMS_STORGE_KEY, JSON.stringify(items))
    } catch (error) {
        throw new Error("ITEMS_SAVE: " + error)
    }
}
//Adiciona um item no banco de dados do dispositivo
async function add(newItem: IUserStorage): Promise<IUserStorage[]> {
    const items = await get()
    const updatedItems = [...items, newItem]
    await save(updatedItems)

    return updatedItems

}
//Remove um item do banco de dadods do dispositivo
async function remove(id: string): Promise<void> {
    const items = await get()
    const updatedItems = items.filter((item) => item.id !== id)
    save(updatedItems)
}
//Limpa os itens do banco de dados do dispositivo
async function clear(): Promise<void> {
    try {
        await AsyncStorage.removeItem(ITEMS_STORGE_KEY)
    } catch (error) {
        throw new Error("ITEMS_CLEAR: " + error)
    }
}

async function edit() {
    const storage = get()
    edit
}
//Altera o status do item 



export const UserStorge = {
    get,
    save,
    add,
    remove,
    clear
}