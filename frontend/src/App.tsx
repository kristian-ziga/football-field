import {Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import Logo from "./components/logo.tsx";
import StartOrContinue from "./pages/StartOrContinue.tsx";
import UploadAllData from "./pages/UploadAllData.tsx";
import HowToMeasure from "./pages/HowToMeasure.tsx";
import ContinueOrUploadCurrentData from "./pages/ContinueOrUploadCurrentData.tsx";
import UploadCurrentData from "./pages/UploadCurrentData.tsx";
import MeasureGrid from "./pages/MeasureGrid.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Logo />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/startOrContinue" element={<StartOrContinue />} />
                <Route path="/uploadAllData" element={<UploadAllData />} />
                <Route path="/howToMeasure" element={<HowToMeasure />} />
                <Route path="/continueOrUpload" element={<ContinueOrUploadCurrentData />} />
                <Route path="/uploadCurrentData" element={<UploadCurrentData />} />
                <Route path="/measureGrid" element={<MeasureGrid />} />
            </Routes>
        </BrowserRouter>
    );
}