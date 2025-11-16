export type RootStackParamList = {
    home: undefined
    form: undefined
    questions: undefined
    score: { score: number }
    users: undefined
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends
            RootStackParamList { }
    }
}