import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function Find() {

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        toast.show({ title: 'Informe o código.', bgColor: 'red.500', placement: 'top' });
        return setIsLoading(false);
      }

      await api.post('/pools/join', { code });
      toast.show({ title: 'Você entrou no bolão com suceso.', bgColor: 'green.500', placement: 'top' });

      await navigate('pools');

    } catch (err) {
      console.log(err);

      if (err.response?.data?.message === 'Pool not found!') {
        return toast.show({ title: 'Bolão não encontrado.', bgColor: 'red.500', placement: 'top' });
      }

      if (err.response?.data?.message === 'You already joined this pool.') {
        return toast.show({ title: 'Você já está nesse bolão.', bgColor: 'red.500', placement: 'top' });
      }

      toast.show({ title: 'Erro ao encontrar bolão.', bgColor: 'red.500', placement: 'top' });
    }

  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Buscar por código' showBackButton />

      <VStack mt={8} mx={5} alignItems='center'>

        <Heading fontFamily='heading' color='white' fontSize='xl' mb={8} textAlign='center'>
          Encontrar um bolão através de {'\n'} seu código único!
        </Heading>

        <Input mb={2} placeholder='Qual o código bolão?' onChangeText={setCode} autoCapitalize='characters' />

        <Button title='BUSCAR BOLÃO' isLoading={isLoading} onPress={handleJoinPool} />
      </VStack>
    </VStack>
  );
}