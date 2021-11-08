import logoImg from '../assets/images/logo.svg';

import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { push, ref } from '@firebase/database';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  const params = useParams() as RoomParams;
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  const { questions, title } = useRoom(roomId)


  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await push(ref(database, `rooms/${roomId}/questions`), question);

    setNewQuestion('');
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            onChange={e => setNewQuestion(e.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>para enviar uma pergunta, <button>faça seu login</button>.</span>
            )}
            <Button type='submit' disabled={!user} >Enviar pergunta</Button>
          </div>
        </form>

        <div className="questions-list">
          {questions.map(question => {
            return (
              <Question key={question.id} content={question.content} author={question.author} />
            )
          })}
        </div>
      </main>
    </div>
  )
}
