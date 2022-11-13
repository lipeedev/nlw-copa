import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);

  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const data = await api.get(`/pools/${poolId}/games`).then(res => res.data);
      setGames(data.games);

    } catch (err) {
      console.log(err);
      toast.show({ title: 'Não foi possível carregar os Jogos.', bgColor: 'red.500', placement: 'top' });
    }

    setIsLoading(false);
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({ title: 'Informe o valor do palpite.', bgColor: 'red.500', placement: 'top' });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: +firstTeamPoints,
        secondTeamPoints: +secondTeamPoints
      });

      toast.show({ title: 'Palpite enviado com sucesso', bgColor: 'green.500', placement: 'top' });
      await fetchGames();

    } catch (err) {
      console.log(err.response?.data);
      toast.show({ title: 'Não foi possivel enviar o palpite.', bgColor: 'red.500', placement: 'top' });
    }
  }

  useEffect(() => { fetchGames() }, [poolId]);

  if (isLoading) return <Loading />

  return (
    <FlatList data={games} keyExtractor={item => item.id} renderItem={({ item }) => (
      <Game
        data={item}
        onGuessConfirm={() => handleGuessConfirm(item.id)}
        setFirstTeamPoints={setFirstTeamPoints}
        setSecondTeamPoints={setSecondTeamPoints} />
    )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />

  );
}
