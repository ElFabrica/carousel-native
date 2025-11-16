import { IChoiceStorge } from "@/shared/interfaces/Choice-Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ITEMS_STORGE_KEY = "@appQuiz:Choices"


async function get(): Promise<IChoiceStorge[]> {
    try {
        const storge = await AsyncStorage.getItem(ITEMS_STORGE_KEY)

        return storge ? JSON.parse(storge) : []

    } catch (error) {
        throw new Error("ITEMS_GET: " + error)
    }
}

async function save(items: IChoiceStorge[]): Promise<void> {
    try {
        await AsyncStorage.setItem(ITEMS_STORGE_KEY, JSON.stringify(items))
    } catch (error) {
        throw new Error("ITEMS_SAVE: " + error)
    }
}

async function add(newItem: IChoiceStorge): Promise<IChoiceStorge[]> {
    const items = await get()
    const updatedItems = [...items, newItem]
    await save(updatedItems)

    return updatedItems

}

async function remove(id: string): Promise<void> {
    const items = await get();
    const index = items.findIndex((item) => item.id === id);

    if (index !== -1) {
        const updatedItems = [
            ...items.slice(0, index),
            ...items.slice(index + 1),
        ];
        await save(updatedItems);
    }
}


async function clear(): Promise<void> {
    try {
        await AsyncStorage.removeItem(ITEMS_STORGE_KEY)
    } catch (error) {
        throw new Error("ITEMS_CLEAR: " + error)
    }
}


export const ChoiceStorge = {
    get,
    save,
    add,
    remove,
    clear
}