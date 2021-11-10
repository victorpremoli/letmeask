import copyImg from '../assets/images/copy.svg';
import '../styles/roomCode.scss';
import toast, { Toaster } from 'react-hot-toast';

type RoomCodeProps = {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
    toast.success('Copied!');
  }

  return (
    <>
      <Toaster />
      <button className='room-code' onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt="Copy room code" />
        </div>
        <span>Sala #{code}</span>
      </button>
    </>
  );
}