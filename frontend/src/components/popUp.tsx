import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type PopUpProps = {
    text: string;
    buttonText: string;
    open: boolean;
    onClose: () => void;
};

export default function PopUp({
    text,
    buttonText,
    open,
    onClose,
}: PopUpProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                <Button
                    variant="contained"
                    component={"button"}
                    onClick={onClose}
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
                    {buttonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}