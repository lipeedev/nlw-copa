import { Heading, Text, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { useState } from "react";
import Logo from '../assets/logo.svg';
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function New() {
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handlePoolCreate() {
    if (!title.trim()) return toast.show({ title: 'Informe um nome para seu Bolão!', placement: 'top', bgColor: 'red.500' });


    try {
      setIsLoading(true);

      await api.post('/pools', { title });
      await toast.show({ title: 'Bolão criado com sucesso.', placement: 'top', bgColor: 'green.500' });

      setTitle('');
    } catch (err) {
      console.log(err);
      toast.show({ title: 'Ocorreu um erro ao criar o Bolão.', placement: 'top', bgColor: 'red.500' });
    }

    setIsLoading(false);
  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Criar novo bolão' />

      <VStack mt={8} mx={5} alignItems='center'>
        <Logo />

        <Heading fontFamily='heading' color='white' fontSize='xl' my={8} textAlign='center'>
          Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
        </Heading>

        <Input mb={2} placeholder='Qual o nome do seu bolão?' onChangeText={setTitle} value={title} />

        <Button title='CRIAR MEU BOLÃO' onPress={handlePoolCreate} isLoading={isLoading} />

        <Text color='gray.200' fontSize='sm' px={10} mt={4} textAlign='center'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas
        </Text>
      </VStack>
    </VStack>
  );
}