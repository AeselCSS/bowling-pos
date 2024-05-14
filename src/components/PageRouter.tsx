import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Pos from '../containers/Pos';

function PageRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/"
                    element={<Pos/>} 
                />
            </Routes>
        </BrowserRouter>
    )
}

export default PageRouter;