import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

type PopUpProps = {
    text: string;
    pathFrom?: string | null;
    pathFromText?: string | null;
    pathTo?: string | null;
    pathToText?: string | null;
};

export default function PopUp({
    text,
    pathFrom,
    pathFromText,
    pathTo,
    pathToText,
}: PopUpProps) {
    const navigate = useNavigate();

    const handleClose = () => {
        if (pathFrom) navigate(pathFrom);
        else if (pathTo) navigate(pathTo);
    };

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            sx={{
                "& .MuiPaper-root": {
                    backgroundColor: "#111827",
                    color: "white",
                    padding: "1rem",
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
                {text}
            </DialogTitle>

            <DialogActions sx={{ justifyContent: "center", gap: "1rem" }}>
                {pathFromText && pathFrom && (
                    <Button
                        variant="contained"
                        component={Link}
                        to={pathFrom}
                        onClick={handleClose}
                        sx={{
                            width: "clamp(7rem, 10vw, 20rem)",
                            height: "clamp(2rem, 6vh, 10rem)",
                            padding: "1rem",
                            fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
                            whiteSpace: "normal",
                            textAlign: "center",
                            justifyContent: "center",
                        }}
                    >
                        {pathFromText}
                    </Button>
                )}

                {pathToText && pathTo && (
                    <Button
                        variant="contained"
                        component={Link}
                        to={pathTo}
                        onClick={handleClose}
                        sx={{
                            width: "clamp(7rem, 10vw, 20rem)",
                            height: "clamp(2rem, 6vh, 10rem)",
                            padding: "1rem",
                            fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
                            whiteSpace: "normal",
                            textAlign: "center",
                            border: "1px solid",
                            justifyContent: "center",
                        }}
                    >
                        {pathToText}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
