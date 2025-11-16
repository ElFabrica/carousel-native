import { IUserStorage } from "@/shared/interfaces/User-Storage"
import { ITEMS_STORGE_KEY } from "@/storge/Users"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, FC, PropsWithChildren, ReactNode, useContext, useState } from "react"


export type SorteioContextType = {
    user: IUserStorage | null,
    handleSelectUser: (user: IUserStorage) => void
    handleUpdateUser: (user: IUserStorage) => Promise<void>
}

export const QuizContext = createContext({} as SorteioContextType)
export const QuizContextProvider: FC<PropsWithChildren> = ({ children }) => {

    function handleSelectUser(user: IUserStorage) {
        setUser(user)
    }
    async function handleUpdateUser(user: IUserStorage) {
        console.log("chegou")
        const storage = await AsyncStorage.getItem(ITEMS_STORGE_KEY);
        const items: IUserStorage[] = storage ? JSON.parse(storage) : [];

        const updatedItems = items.map(item =>
            item.id === user.id ? { ...item, sorteio: true } : item
        );

        await AsyncStorage.setItem(ITEMS_STORGE_KEY, JSON.stringify(updatedItems));

        const updatedUser = { ...user, sorteio: true };
        setUser(updatedUser);
    }


    const [user, setUser] = useState<IUserStorage | null>(null)
    return (
        <QuizContext.Provider
            value={{
                user,
                handleSelectUser,
                handleUpdateUser
            }}
        >
            {children}

        </QuizContext.Provider>
    )
}

export function useQuizContext() {
    return useContext(QuizContext)
}