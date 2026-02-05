import FootballField from "../components/footballField.tsx";
import Camera from "../components/camera.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {useEffect, useState} from "react";

export default function FieldMeasurementInstructions() {
    const [ord, setOrd] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, []);

    const handleNext = () => {
        if (ord >= 33) {
            navigate("/continueOrUpload"); // where to go after 25
            return;
        }
        setOrd(ord + 1);
    };

    const handleBack = () => {
        if (ord <= 0) {
            navigate("/howToMeasure"); // where to go before 0
            return;
        }
        setOrd(ord - 1);
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
                    {ord === 0
                        ? "Put total station somewhere along the red line"
                        : ord === 1
                            ? "Setup X axis on total station according to map"
                            :  ord === 2
                                ? "The order in which points must be measured"
                                : "Measure points according to map"}
                </div>
                <div style={{ display: "flex", justifyContent: "center", maxWidth: window.innerWidth < 850 ? "100vw" : "75vw"}}>
                    <FootballField ord={ord}/>
                </div>
                <div  style={{ display: "flex", justifyContent: "center", flexDirection: "row", gap: "clamp(2rem, 30vw, 15rem)",  height: "clamp(1rem, 6vh, 10rem)" }}>
                    <Camera />
                    <Camera />
                </div>
            </div>
            <div  style={{ display: "flex", justifyContent: "center", flexDirection: "row", gap: "clamp(2rem, 35vw, 40rem)", maxHeight: "5vh"}}>
                <Button  variant="contained"
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
                <Button  variant="contained"
                         onClick={handleNext}
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
                    NEXT
                </Button>
            </div>
        </div>
    )
}