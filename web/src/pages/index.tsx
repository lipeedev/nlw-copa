import Image from 'next/image';
import { FormEvent, useState } from 'react';
import appPreviewImg from '../assets/app-copa-nlw-preview.png';
import usersAvatarsImgExample from '../assets/avatars.png';
import iconCheck from '../assets/icon-check.svg';
import logoImg from '../assets/logo.svg';
import { api } from '../lib/axios';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);

      alert('bolão criado com sucesso! o código foi copiado para a área de transferência.');
      setPoolTitle('');
    } catch (err) {
      console.log(err);
      alert('erro ao criar bolão!');
    }
  }

  return (
    <div className='max-w-[1124px] h-screen items-center mx-auto grid grid-cols-2 gap-28'>
      <main>
        <Image src={logoImg} alt="NLW Copa Logo" />
        <h1 className='mt-16 text-white font-bold text-5xl leading-tight'>Crie seu bolão da copa e compartilhe entre seus amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarsImgExample} alt="Exemplo de Avatares NLW Copa" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas ja estão usando.
          </strong>
        </div>

        <form onSubmit={createPool} className='flex mt-10 gap-2'>
          <input
            className='flex-1 py-4 px-6 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            placeholder="Qual o nome do seu bolão?"
            onChange={ev => setPoolTitle(ev.target.value)}
            value={poolTitle}
            required />
          <button type="submit" className='bg-yellow-500 hover:bg-yellow-700 transition py-4 px-6 rounded text-gray-900 font-bold text-sm uppercase'>Criar meu bolão</button>
        </form>

        <p className='mt-4 leading-relaxed text-sm text-gray-300'>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões Criados</span>
            </div>
          </div>

          <div className='w-px bg-gray-600 h-14' />

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites Enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImg} quality={100} alt="Dois celuares exibindo a prévia do app NLW Copa mobile" />
    </div>
  );
}


export const getServerSideProps = async () => {

  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  };
};
