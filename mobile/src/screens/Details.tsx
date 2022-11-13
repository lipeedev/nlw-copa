import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";

interface RouteParams {
  id: string;
}

type OptionType = 'guesses' | 'ranking';

export function Details() {
  const route = useRoute();
  const [optionSelected, setOptionSelected] = useState<OptionType>('guesses');
  const [isLoading, setIsLoading] = useState(false);
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);
  const toast = useToast();

  const { id } = route.params as RouteParams;

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const data = await api.get(`/pools/${id}`).then(res => res.data);
      setPoolDetails(data.pool);

    } catch (err) {
      console.log(err);
      toast.show({ title: 'Não foi possível carregar os detalhes do bolão.', bgColor: 'red.500', placement: 'top' });
    }

    setIsLoading(false);
  }

  async function handleCodeShare() {
    await Share.share({ message: poolDetails.code });
  }

  useEffect(() => { fetchPoolDetails() }, [id]);

  if (isLoading) return <Loading />

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare} />

      {
        poolDetails._count?.participants > 0
          ? <VStack px={5} flex={1}>
            <PoolHeader data={poolDetails} />

            <HStack mb={5} bgColor='gray.800' p={1} rounded='sm'>
              <Option title="Seus palpites" isSelected={optionSelected === 'guesses'} onPress={() => setOptionSelected('guesses')} />
              <Option title="Ranking de grupo" isSelected={optionSelected === 'ranking'} onPress={() => setOptionSelected('ranking')} />
            </HStack>

            <Guesses poolId={poolDetails.id} code={poolDetails.code} />
          </VStack>

          : <EmptyMyPoolList code={poolDetails.code} />
      }
    </VStack>
  );
}