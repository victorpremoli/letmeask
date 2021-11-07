import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import illustrationImg from '../assets/images/illustration.svg';

import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { push, ref } from '@firebase/database';

import '../styles/auth.scss'

export function NewRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateNewRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = ref(database, 'rooms');
    const firebaseRoom = await push(roomRef, {
      title: newRoom,
      authorId: user?.id,
    });

    navigate(`/rooms/${firebaseRoom.key}`);
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateNewRoom} >
            <input
              type="text"
              placeholder='Nome da sala'
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}