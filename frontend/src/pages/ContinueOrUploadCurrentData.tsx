import {Button} from "@mui/material";
import {Link} from "react-router-dom";


export default function ContinueOrUploadCurrentData() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "1rem",
        }}>
            <Button variant="contained"
                    component={Link} to="/measureGrid"
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
                CONTINUE MEASUREMENT
            </Button>

            <Button variant="contained"
                    component={Link} to="/uploadCurrentData"
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
                UPLOAD CURRENT DATA
            </Button>
        </div>
    );
}