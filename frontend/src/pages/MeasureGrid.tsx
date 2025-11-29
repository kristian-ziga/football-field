import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import {Link} from "react-router-dom";
import {useState} from "react";
import GridField from "../components/gridField.tsx";

export default function MeasureGrid() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div style={{ display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingBottom: "3rem",
            gap: "clamp(0.5rem, 1vh, 0rem)",
            height: "98vh"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "1rem", minHeight: "50vh", alignItems: "center"}}>
                <div style={{textAlign: "center", fontSize: "clamp(1.2rem, 7vw, 2.5rem)", width: "90vw", paddingLeft: "5vw"}}>
                    Measure points in a grid pattern for better visualization - every 10m recommended.
                    Grid in picture does not  reflect real lengths
                </div>
                <div style={{ display: "flex", maxWidth: window.innerWidth < 850 ? "95vw" : "75vw"}}>
                    <GridField/>
                </div>
            </div>
            <div  style={{ display: "flex", justifyContent: "center", flexDirection: "row", gap: "clamp(2rem, 35vw, 40rem)", maxHeight: "5vh"}}>
                <Button  variant="contained"
                         component={Link}
                         to="/continueOrUpload"
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
                         onClick={handleOpen}
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
                    DONE
                </Button>
            </div>
            <Dialog open={open}
                    onClose={handleClose}
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
                    Football field measured successfully
                </DialogTitle>
                <DialogActions>
                    <Button variant="contained" className="custom-close-button" onClick={handleClose} sx={{
                        width: "clamp(7rem, 10vw, 20rem)",
                        height: "clamp(2rem, 6vh, 10rem)",
                        padding: "1rem",
                        fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
                        whiteSpace: "normal",
                        textAlign: "center",

                        justifyContent: "center",
                    }}>CLOSE</Button>

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
        </div>
    )
}