import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

import {
    Main
} from "./components";

const Root: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main/>}/>
        </Routes>
    </BrowserRouter>
);

export default Root;