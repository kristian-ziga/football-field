import { Button } from "@mui/material";
import HowToMeasureLine from "../components/howToMeasureLine.tsx";
import HowToMeasurePoint from "../components/howToMeasurePoint.tsx";
import {Link} from "react-router-dom";

export default function HowToMeasure() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: "5rem",
            paddingBottom: "2rem",
            gap: "2rem",
            height: "80vh",
        }}>
            <div style={{textAlign: "center", fontSize: "3rem"}}>
                Always measure points in the middle of the lines
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "2rem",
                }}
            >
                <HowToMeasureLine />
                <HowToMeasurePoint />
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button  variant="contained"
                         component={Link} to="/fieldMeasuremntInstructions"
                         sx={{
                             minWidth: "10rem",
                             maxWidth: "20rem",
                             width: "35rem",
                             height: "5rem",
                             padding: "1rem",
                             fontSize: "2.5rem",
                             whiteSpace: "normal",
                             textAlign: "center",
                             border: "1px solid",
                             justifyContent: "center",
                         }}>
                    OKAY
                </Button>
            </div>
        </div>
    );
}