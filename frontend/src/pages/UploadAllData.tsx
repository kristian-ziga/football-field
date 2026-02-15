import { Button } from "@mui/material";
import DragAndDrop from "../components/dragAndDrop";
import { useNavigate } from "react-router-dom";
import { useAppStorage } from "../visualization/StorageProvider";

export default function UploadAllData() {
    const { getAllPoints } = useAppStorage();
    const navigate = useNavigate();
    const allPoints = getAllPoints;

    const handleNext = () => {
        navigate("/visualization"); 
        return;
    };

    const handleBack = () => {
        navigate("/"); 
        return;
    };

    return (
        <div style={{ display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingBottom: "3rem",
            gap: "clamp(0.5rem, 5vh, 2.5rem)",
            height: "95vh"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center"}}>
                <div style={{textAlign: "center", fontSize: "clamp(1.2rem, 8vw, 3rem)",}}>
                    Upload all data
                </div>
                <div>
                    <div style={{ display: "flex", justifyContent: "center", maxWidth: window.innerWidth < 850 ? "100vw" : "75vw"}}>
                        <DragAndDrop isMain={true}/>
                    </div>
                    <br/>
                    <div style={{ display: "flex", justifyContent: "center", maxWidth: window.innerWidth < 850 ? "100vw" : "75vw"}}>
                        <DragAndDrop isMain={false}/>
                    </div>
                </div>
            </div>
            <div  style={{ display: "flex", justifyContent: "center", flexDirection: "row", gap: "clamp(2rem, 35vw, 40rem)", maxHeight: "5vh"}}>
                <Button  
                    variant="contained"
                    onClick={handleBack}
                    sx={{
                        width: "clamp(7rem, 15vw, 20rem)",
                        height: "clamp(2rem, 6vh, 10rem)",
                        padding: "1rem",
                        fontSize: "clamp(1.2rem, 8vw, 2.5rem)",
                        whiteSpace: "normal",
                        textAlign: "center",
                        border: "1px solid",
                        justifyContent: "center",
                        }}>
                    BACK
                </Button>
                <Button 
                    variant="contained"
                    disabled={allPoints.length < 31 && !allPoints}
                    onClick={handleNext}
                    sx={{
                        width: "clamp(10rem, 20vw, 20rem)",
                        height: "clamp(2rem, 6vh, 10rem)",
                        padding: "1rem",
                        fontSize: "clamp(1.2rem, 8vw, 2.5rem)",
                        whiteSpace: "normal",
                        textAlign: "center",
                        border: "1px solid",
                        justifyContent: "center",
                    }}>
                    VISUALIZE
                </Button>
            </div>
        </div>
    )
}