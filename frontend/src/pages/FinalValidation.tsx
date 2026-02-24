import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppStorage } from "../visualization/StorageProvider";


export default function FinalValidation() {
    const { getMainPoints } = useAppStorage();
    const navigate = useNavigate();
    const mainPoints = getMainPoints();

    if (!mainPoints || mainPoints.length < 31) {
        return (
            <Dialog 
                open={true}               
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#111827",
                        color: "white",
                        padding: "1rem"
                    },
                }}
                >
                <DialogTitle
                        sx={{
                            fontSize: "clamp(1.2rem, 10vw, 2.2rem)",
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        Points for validation and export are missing
                </DialogTitle>
                <DialogActions>
                    <Button variant="contained" component={Link} to="/uploadAllData" sx={{
                        width: "clamp(7rem, 10vw, 20rem)",
                        height: "clamp(2rem, 6vh, 10rem)",
                        padding: "1rem",
                        fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
                        whiteSpace: "normal",
                        textAlign: "center",
                        border: "1px solid",
                        justifyContent: "center",
                    }}>
                        OKAY
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    const handleExportPdf = () => {
        {/* TODO: export pdf*/}
        return;
    };

   const handleExportTransformedPoints = () => {
        if (!mainPoints || mainPoints.length < 31) return;

        // Build txt content
        const lines: string[] = [];
        for (let i = 0; i < 31; i++) {
            const [x, y, z] = mainPoints[i]; 
            lines.push(`${i + 1} ${x} ${y} ${z}`); 
        }
        const content = lines.join("\n") + "\n";

        // Download as .txt
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "points.txt";
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleBack = () => {
        navigate("/measurementValidation"); 
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
                
                {/* TODO: implement text in box with information about FIFA standard measurements*/}
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
                    onClick={handleExportTransformedPoints}
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
                    TRANSFORMED POINTS
                </Button>
                <Button 
                    variant="contained"
                    onClick={handleExportPdf}
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
                    PDF EXPORT
                </Button>
            </div>
        </div>
    )
}