import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppStorage } from "../visualization/StorageProvider";
import { firstValue, getValidations, secondValue, touchlineValue } from "./MeasurementValidation";


export default function FinalValidation() {
    const { getMainPoints, topViewHeatmapImage, topViewImage } = useAppStorage();
    const navigate = useNavigate();
    const mainPoints = getMainPoints();
    const lineValidations = getValidations(mainPoints);

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

    function haveValidationIssues(): boolean {
        lineValidations .filter(line =>
            line.name !== "Upper Touchline With Middle" &&
            line.name !== "Lower Touchline With Middle"
        )
        .map((line) => {
            const statusText = line.name.includes("Upper Touchline")
                ? touchlineValue(line, lineValidations.find(l => l.name === "Upper Touchline With Middle"))
                : line.name.includes("Lower Touchline")
                ? touchlineValue(line, lineValidations.find(l => l.name === "Lower Touchline With Middle"))
                : `${firstValue(line)}, ${secondValue(line)}`;

            const isOutOfTolerance = statusText.includes("Out of tolerance");

            if (!isOutOfTolerance) 
                return true;
        })
        return true;
    }

    function getLengthOfField(): number {
        const upperLength = lineValidations.find(line => line.name == "Upper Touchline")?.lengthOverMargin ?? -1;
        const lowerLength = lineValidations.find(line => line.name == "Lower Touchline")?.lengthOverMargin ?? -1;

        const num = Math.max(upperLength, lowerLength);
        return Math.round(num * 100) / 100;
    }

    function getWidthOfField(): number {
        const leftGoalLine = lineValidations.find(line => line.name == "Left Goal Line")?.lengthOverMargin ?? -1;
        const rightGoalLine = lineValidations.find(line => line.name == "Right Goal Line")?.lengthOverMargin ?? -1;
        const halfLine = lineValidations.find(line => line.name == "Halfline")?.lengthOverMargin ?? -1;

        const num =  Math.max(leftGoalLine, rightGoalLine, halfLine);
        return Math.round(num * 100) / 100;
    }

    function isFifaStandardized(): boolean {
        const lengthOfField = getLengthOfField();
        const widthOfField = getWidthOfField();

        if (lengthOfField > 110 || lengthOfField < 100 || widthOfField > 75 || widthOfField < 64)
            return false;
        return true;
    }

    function isFifaIdeal(): boolean {
        const lengthOfField = getLengthOfField();
        const widthOfField = getWidthOfField();
        // +2 / -2 for not ideal measurements
        return ((lengthOfField > 105 + 2 || lengthOfField > 105 - 2) || (widthOfField > 68 + 2 || widthOfField > 68 - 2));
    }

    function isIfabStandardized(): boolean {
        const lengthOfField = getLengthOfField();
        const widthOfField = getWidthOfField();

        if (lengthOfField > 120 || lengthOfField < 90 || widthOfField > 90 || widthOfField < 45)
            return false;
        return true;
    }

    const validations = [
        { label: "FIFA Ideal (105x68)", invalid: haveValidationIssues() || !isFifaIdeal() },
        { label: "FIFA Standard (100~110x64~75)", invalid: haveValidationIssues() || !isFifaStandardized() },
        { label: "International Standard (90~120x45~90)", invalid: haveValidationIssues() || !isIfabStandardized() }
    ];

    const statusColor = (isInvalid: boolean) => isInvalid ? "#fca5a5" : "#86efac";

    return (
        <div style={{ display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingBottom: "3rem",
            gap: "clamp(0.5rem, 5vh, 2.5rem)",
            height: "95vh"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center"}}>
                <div style={{textAlign: "center", fontSize: "clamp(1.2rem, 8vw, 3rem)",}}>
                    FIFA standard validation
                </div>
                <div
                    style={{
                            maxWidth: window.innerWidth < 850 ? "100vw" : "75vw",
                            backgroundColor: "gray",
                            padding: "1rem",
                            fontSize: "clamp(1.0rem, 6vw, 2.2rem)"
                        }}>
                    {topViewImage && (
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "1rem" }}>
                            <img
                                src={topViewImage}
                                alt="Top View"
                                style={{ maxWidth: "80%", height: "auto" }}
                            />
                        </div>
                    )}
                    {topViewHeatmapImage && (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <img
                                src={topViewHeatmapImage}
                                alt="Top View Heatmap"
                                style={{ maxWidth: "80%", height: "auto" }}
                            />
                        </div>
                    )}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: window.innerWidth < 500
                                ? "1fr"
                                : "1fr 1fr",
                            gap: "0.5rem 2rem",
                           
                            padding: "1rem",
                            fontSize: "clamp(1.0rem, 6vw, 2.2rem)",
                        }}>
                        {validations.map(v => (
                            <div key={v.label}>
                                {v.label}:
                                <span style={{ color: statusColor(v.invalid) }}>
                                {" "}{v.invalid ? "Invalid" : "Valid"}
                                </span>
                            </div>
                            ))}
                        Length: {getLengthOfField()}, Width: {getWidthOfField()}
                        
                        <div>{haveValidationIssues() && "Line validation issues:"}</div>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: window.innerWidth < 500
                                ? "1fr"
                                : "1fr 1fr",
                            gap: "0.5rem 2rem",
                           
                            padding: "1rem",
                            fontSize: "clamp(1.0rem, 6vw, 2.2rem)",
                        }}
                    >
                        {lineValidations
                            .filter(line =>
                                line.name !== "Upper Touchline With Middle" &&
                                line.name !== "Lower Touchline With Middle"
                            )
                            .map((line) => {
                                const statusText = line.name.includes("Upper Touchline")
                                    ? touchlineValue(line, lineValidations.find(l => l.name === "Upper Touchline With Middle"))
                                    : line.name.includes("Lower Touchline")
                                    ? touchlineValue(line, lineValidations.find(l => l.name === "Lower Touchline With Middle"))
                                    : `${firstValue(line)}, ${secondValue(line)}`;

                                const isOutOfTolerance = statusText.includes("Out of tolerance");

                                if (!isOutOfTolerance) 
                                    return;

                                return (
                                    <label
                                        key={line.name}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.2rem",
                                            minWidth: 0,
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <span style={{ fontWeight: "bold", fontSize: "1.8rem" }}>
                                                {line.name}
                                            </span>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                color: isOutOfTolerance ? "#fca5a5" : "#e5e4e4",
                                                marginLeft: "1.8rem",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {statusText}
                                        </span>
                                    </label>
                                );
                            })}
                    </div>
                </div>
            </div>
            <div  style={{ display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    gap: "1rem",
                    justifyContent: "space-between", 
                    paddingLeft: "2rem", paddingRight: "2rem",  paddingBottom: "3rem"}}>
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
                        width: "clamp(17rem, 45vw, 30rem)",
                        height: "clamp(2rem, 6vh, 10rem)",
                        padding: "1rem",
                        fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                        whiteSpace: "nowrap",
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
                        width: "clamp(12rem, 25vw, 22rem)",
                        height: "clamp(2rem, 6vh, 10rem)",
                        padding: "1rem",
                        fontSize: "clamp(2rem, 6vw, 2.5rem)",
                        whiteSpace: "nowrap",
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