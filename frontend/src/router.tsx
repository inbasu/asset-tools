import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navBar/navBar"
import Index from "./pages";
import Mobile from "./pages/mobile";
import ItInvent from "./pages/it_invent";

export default function Router() {
    return (
        <BrowserRouter>
            <Navbar />  {/* navbar mast be insigt router or <Link> wouldn't wok */}
            <Routes>
                <Route path="/" element={<Index/> } />
                <Route path="/mobile" element={<Mobile />} />
                <Route path="/it-invent" element={<ItInvent />} />
            </Routes>
        </BrowserRouter>
    )
};
