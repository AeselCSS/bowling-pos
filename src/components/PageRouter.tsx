import { BrowserRouter, Route, Routes } from 'react-router-dom';

function PageRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/"
                    element={<div>Home</div>} 
                />
            </Routes>
        </BrowserRouter>
    )
}

export default PageRouter;