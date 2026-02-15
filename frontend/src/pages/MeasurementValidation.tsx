import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useAppStorage } from "../visualization/StorageProvider";
import {Link} from "react-router-dom";


export default function MeasurementValidation() {
    const { getMainPoints } = useAppStorage();
    const navigate = useNavigate();

    const mainPoints = getMainPoints();

    const handleNext = () => {
        navigate("/measurementValidation"); 
        return;
    };

    const handleBack = () => {
        navigate("/visualization"); 
        return;
    };

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
                        Points for validation are missing
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

    const linesToValidate = [
        {name: "Upper Touchline", points: [5, 30], isHorizontal: true}, 
        {name: "Left Upper Touchline", points: [5, 17], isHorizontal: true},
        {name: "Right Upper Touchline", points: [17, 30], isHorizontal: true},
        {name: "Lower Touchline", points: [0, 25], isHorizontal: true}, 
        {name: "Left Lower Touchline", points: [0, 13], isHorizontal: true},
        {name: "Right Lower Touchline", points: [13, 25], isHorizontal: true},
        {name: "Halfline", points: [13, 17], isHorizontal: false},
        {name: "Inne Circle", points: [14, 16], isHorizontal: false},
        {name: "Middle Point", points: [15], isHorizontal: false},
        {name: "Left Penalty Point", points: [8], isHorizontal: false},
        {name: "Right Penalty Point", points: [22], isHorizontal: false},
        {name: "Left Goal Line", points: [0, 5], isHorizontal: false},
        {name: "Left Goal Area Left Line", points: [2, 3], isHorizontal: false},
        {name: "Left Goal Area Right Line", points: [6, 7], isHorizontal: false},
        {name: "Left Goal Area Upper Line", points: [3, 7], isHorizontal: true},
        {name: "Left Goal Area Lower Line", points: [2, 6], isHorizontal: true},
        {name: "Left Penalty Area Left Line", points: [1, 4], isHorizontal: false},
        {name: "Left Penalty Area Right Line", points: [9, 12], isHorizontal: false},
        {name: "Left Penalty Area Upper Line", points: [4, 12], isHorizontal: true},
        {name: "Left Penalty Area Lower Line", points: [1, 9], isHorizontal: true},
        {name: "Left Penalty Arc Upper Point", points: [8, 11], isHorizontal: false},
        {name: "Left Penalty Arc Lower Point", points: [8, 10], isHorizontal: false},
        {name: "Right Goal Line", points: [25, 30], isHorizontal: false},
        {name: "Right Goal Area Left Line", points: [24, 23], isHorizontal: false},
        {name: "Right Goal Area Right Line", points: [27, 28], isHorizontal: false},
        {name: "Right Goal Area Upper Line", points: [23, 28], isHorizontal: true},
        {name: "Right Goal Area Lower Line", points: [24, 27], isHorizontal: true},
        {name: "Right Penalty Area Left Line", points: [21, 18], isHorizontal: false},
        {name: "Right Penalty Area Right Line", points: [26, 29], isHorizontal: false},
        {name: "Right Penalty Area Upper Line", points: [18, 29], isHorizontal: true},
        {name: "Right Penalty Area Lower Line", points: [21, 26], isHorizontal: true},
        {name: "Right Penalty Arc Upper Point", points: [22, 19], isHorizontal: false},
        {name: "Right Penalty Arc Lower Point", points: [22, 20], isHorizontal: false},
    ];

    const angleTolerance = 0.05;
    const lengthTolerance = 0.05;

    for (let i = 0; i < linesToValidate.length; i++) {
        
    }

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
                    VALIDATE
                </Button>
            </div>
        </div>
    )
}