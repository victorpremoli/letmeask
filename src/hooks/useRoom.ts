import { onValue, ref } from "@firebase/database";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;

}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
}>

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);
    onValue(roomRef, room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions
      const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestion)
    })

  }, [roomId])

  return { questions, title }
}
