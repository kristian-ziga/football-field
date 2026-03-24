import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                gap: "2rem",
                padding: "1rem",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    width: "100%",
                }}
            >
                <Button
                    variant="contained"
                    component={Link}
                    to="/startOrContinue"
                    sx={{
                        width: { xs: "90%", sm: "35vw" },
                        height: { xs: "15%", sm: "35vh" },
                        maxWidth: "400px",
                        fontSize: { xs: "1.5rem", sm: "2.5rem" },
                        whiteSpace: "normal",
                        textAlign: "center",
                        fontWeight: 300,
                        border: "1px solid",
                    }}
                >
                    MEASURE PITCH
                </Button>

                <Button
                    variant="contained"
                    component={Link}
                    to="/uploadAllData"
                    sx={{
                        width: { xs: "90%", sm: "35vw" },
                        height: { xs: "15%", sm: "35vh" },
                        maxWidth: "400px",
                        fontSize: { xs: "1.5rem", sm: "2.5rem" },
                        whiteSpace: "normal",
                        textAlign: "center",
                        fontWeight: 300,
                        border: "1px solid",
                    }}
                >
                    UPLOAD DATA
                </Button>
            </div>
        </div>
    );
}