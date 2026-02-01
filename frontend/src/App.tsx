import {Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import Logo from "./components/logo.tsx";
import StartOrContinue from "./pages/StartOrContinue.tsx";
import UploadAllData from "./pages/UploadAllData.tsx";
import HowToMeasure from "./pages/HowToMeasure.tsx";
import ContinueOrUploadCurrentData from "./pages/ContinueOrUploadCurrentData.tsx";
import UploadCurrentData from "./pages/UploadCurrentData.tsx";
import MeasureGrid from "./pages/MeasureGrid.tsx";
import FieldMeasurementInstructions from "./pages/FieldMeasurementInstructions.tsx";
import { AppStorageProvider } from "./visualization/StorageProvider.tsx";
import Visualization from "./visualization/Visualization.tsx";

export default function App() {
    return (
        <AppStorageProvider>
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
                    <Route path="/fieldMeasuremntInstructions" element={<FieldMeasurementInstructions />} />
                    <Route path="/visualization" element={<Visualization />} />
                </Routes>
            </BrowserRouter>
        </AppStorageProvider>
    );
}