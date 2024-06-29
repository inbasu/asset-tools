import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar';
import Index from './pages/index';
import Mobile from './pages/mobile/mobile';
import ItInvent from './pages/it-invent/it-invent';
import { UserContext, user } from './App';
import { useContext } from 'react';
import { checkPermission, permissions } from './permissions';

export default function Router() {
  const user = useContext<user>(UserContext);
  return (
    <BrowserRouter>
      <Navbar /> {/* navbar mast be insigt router or <Link> wouldn't wok */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/mobile" element={<Mobile />} />
        <Route path="/it-invent" element={checkPermission(user, permissions.ItInvent) ? <ItInvent /> : <Index />} />
      </Routes>
    </BrowserRouter>
  );
}
