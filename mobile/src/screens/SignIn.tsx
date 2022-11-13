import { Fontisto } from '@expo/vector-icons';
import { Center, Icon, Text } from "native-base";
import { useAuth } from '../hooks/useAuth';

import { Button } from "../components/Button";

import Logo from '../assets/logo.svg';

export function SignIn() {

  const { signIn, isUserLoading } = useAuth();

  return (
    <Center flex={1} bgColor='gray.900' p={7}>
      <Logo width={212} height={40} />

      <Button
        onPress={signIn}
        isLoading={isUserLoading}
        _loading={{ _spinner: { color: 'white' } }}
        title='ENTRAR COM O GOOGLE'
        type='SECONDARY'
        mt={12}
        leftIcon={<Icon as={Fontisto} name='google' color='white' size='md' />}
      />

      <Text color='white' textAlign='center' mt={4}>
        Não utilizamos nenhuma informação além {'\n'} do seu e-mail para a criação da conta.
      </Text>
    </Center>
  );
}