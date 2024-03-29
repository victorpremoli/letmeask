import { useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import illustrationImg from '../assets/images/illustration.svg';
import toast, { Toaster } from 'react-hot-toast';

import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss'
import { database } from '../services/firebase';
import { get, ref } from '@firebase/database';

export function Home() {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();
  const [roomcode, setRoomCode] = useState('');

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomcode.trim() === '') {
      return;
    }

    const roomRef = await get(ref(database, `rooms/${roomcode}`))
    
    if(!roomRef.exists()) {
      toast.error('Room does not exists!');
      return;
    }

    if(roomRef.val().endedAt) {
      toast.error('Room already closed!');
      return;
    }

    navigate(`/rooms/${roomcode}`);

  }

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }

    navigate('/rooms/new');
  }

  return (
    <div id='page-auth'>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntar e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content" >
          <img src={logoImg} alt="Logo letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className='separator' >ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom} >
            <input
              type="text"
              placeholder='Digite o código da sala'
              onChange={e => setRoomCode(e.target.value)}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
            <Toaster />
          </form>
        </div>
      </main>
    </div>
  )
}