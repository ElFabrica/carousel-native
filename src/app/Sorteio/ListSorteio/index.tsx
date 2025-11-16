import { Button } from '@/components/button'
import { IUserStorage } from '@/shared/interfaces/User-Storage'
import { UserStorge } from '@/storge/Users'
import { useEffect, useState } from 'react'
import { Alert, Modal, Text, View } from 'react-native'
import LottieView from "lottie-react-native"
import { styles } from './styles'
import { RFValue } from 'react-native-responsive-fontsize'

export function SorteioForm() {

    const [leads, setLeads] = useState<IUserStorage[]>([])
    const [leadSorted, setLeadSorted] = useState<IUserStorage | undefined>()
    const [timer, setTimer] = useState<number | undefined>()
    const [modalVisible, setModalVisible] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {

        const handleFetchUsers = async () => {
            try {
                const data = await UserStorge.get()
                setLeads(data)
            } catch (error) {
                console.log(error)
            }
        }
        handleFetchUsers()
    }, [])


    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSorter() {
        const leadsSorted = leads.filter((item) => item.sorteio === true)
        setTimer(3);
        if (!leadsSorted?.length) {
            Alert.alert("Antenção", "Nenhum usuário para sortear")
            return
        };
        const sorted = Math.floor(Math.random() * leadsSorted.length);
        const intervalo = setInterval(() => {
            setTimer(prev => (Number(prev) - 1));
        }, 1000);
        await sleep(3000);
        clearInterval(intervalo);
        setLeadSorted(leadsSorted[sorted]);
        setModalVisible(true);
        setShowConfetti(true);
        setTimer(undefined);
        await sleep(2000);
        setShowConfetti(false);
    }

    return (
        <View className='flex-1 px-6 justify-center items-center  gap-y-4'>
            <View>
                <Text className='text-4xl font-bold'>Iniciar Sorteio</Text>
            </View>
            <View>
                {
                    timer == undefined ? <Button title='Sortear' onPress={handleSorter} /> : <Text className='text-4xl font-bold'>{timer}</Text>
                }
            </View>
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                className='items-center justify-center'

            >
                <View className='bg-gray-500/30 flex-1 w-full items-center justify-center'>
                    <View className='w-[80%] items-center justify-between bg-bg-Secondary p-12 rounded-3xl' >
                        <View>
                            <Text className='text-3xl font-medium text-gray-100 text-center'>O sorteado foi </Text>
                            <Text className=' text-4xl font-bold text-center mt-5 text-white'>{leadSorted ? leadSorted?.name : "Nada aqui"} </Text>
                            <Text className=' text-2xl font-bold text-center  text-white'>{leadSorted ? leadSorted?.phone : "Nada aqui"} </Text>
                        </View>
                        <Button title="Fechar" onPress={() => setModalVisible(false)} style={{ marginTop: RFValue(20) }} />

                    </View>
                </View>
                {showConfetti && (
                    <LottieView
                        source={require('@/assets/animations/Congregations.json')}
                        autoPlay
                        loop={false}
                        style={styles.lottie}
                    />
                )}
            </Modal >
        </View >
    )
}