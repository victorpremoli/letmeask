import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { useParams, useNavigate, Link } from 'react-router-dom';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import { useRoom } from '../hooks/useRoom';


import '../styles/room.scss';
import { ref, remove, update } from '@firebase/database';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const navigate = useNavigate();
  const params = useParams() as RoomParams;
  const roomId = params.id;
  const { questions, title } = useRoom(roomId)

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar esta sala?')) {
      await update(ref(database, `rooms/${roomId}`), {
        endedAt: new Date(),
      })
      navigate('/');
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await remove(ref(database, `rooms/${roomId}/questions/${questionId}`))
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isHighlighted: true,
    })
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <Link to='/'>
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined >Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <div className="questions-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                author={question.author}
                content={question.content}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                      <img src={checkImg} alt="Marca pergunta como respondida" />
                    </button>
                    <button type="button" onClick={() => handleHighlightQuestion(question.id)}>
                      <img src={answerImg} alt="Destacar a pergunta" />
                    </button>
                  </>
                )}
                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
