import {Button} from "@mui/material";
import {Link} from "react-router-dom";

export default function StartOrContinue() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "1rem",
        }}>
            <Button variant="contained"
                    component={Link} to="/howToMeasure"
                    sx={{
                        width: "35vw",
                        height: "35vh",
                        padding: "1rem",
                        fontSize: "2.5rem",
                        whiteSpace: "normal",
                        textAlign: "center",
                        fontWeight: "300",
                        border: "1px solid",
                    }}
            >
                START MEASUREMENT
            </Button>

            <Button variant="contained"
                    component={Link} to="/continueOrUpload"
                    sx={{
                        width: "35vw",
                        height: "35vh",
                        padding: "1rem",
                        fontSize: "2.5rem",
                        whiteSpace: "normal",
                        textAlign: "center",
                        fontWeight: "300",
                        border: "1px solid",
                    }}
            >
                ALREADY DONE FIRST PART
            </Button>
        </div>
    );
}