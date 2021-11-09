import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from "./pages/Home";
import { Room } from './pages/Room';
import { NewRoom } from './pages/NewRoom';
import { AdminRoom } from './pages/AdminRoom';

import { AuthContextProvider } from './contexts/AuthContext';

import './styles/global.scss';


function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/admin/rooms/:id" element={<AdminRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
