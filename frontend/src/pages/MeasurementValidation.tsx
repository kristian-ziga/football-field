import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useAppStorage } from "../visualization/StorageProvider";
import {Link} from "react-router-dom";
import InteractiveField from "../components/interactiveField";
import { useMemo, useState } from "react";

type LineValidation = {
  name: string;
  lengthOK: boolean;
  lengthOverMargin: number;
  angleOK: boolean;
  angleOverMargin: number;
  enabled: boolean;
};

export function firstValue(line: LineValidation): string {
    if (line.name.includes("Point")) {
        if (line.lengthOK)
            return "Vertical position: Valid"
        return `Vertical position: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm` 
    }

    if (line.name.includes("Centre Circle")) {
        if (line.lengthOK)
            return "Diameter: Valid"
        return `Diameter: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm`
    }

    if (line.name.includes("Penalty Arc")) {
        if (line.lengthOK)
            return "Upper point of Arc: Valid"
        return `Upper point of Arc: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm` 
    }   

    if (line.lengthOK)
        return "Length: Valid"
    else if (line.name.includes("Halfline") || line.name.includes("Left Goal Line") || line.name.includes("Right Goal Line")) {
        return `Length: Invalid, Out of tolerance. Length: ${line.lengthOverMargin.toFixed(3)} m`
    }
    return `Length: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm`
}

export function secondValue(line: LineValidation): string {
    if (line.name.includes("Point")) {
        if (line.angleOK)
            return "Horizontal position: Valid"
        return `Horizontal position: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm` 
    }

    if (line.name.includes("Centre Circle")) {
        if (line.angleOK)
            return "Centre of Circle: Valid"
        return `Centre of Circle: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm` 
    }

    if (line.name.includes("Penalty Arc")) {
        if (line.angleOK)
            return "Lower point of Arc: Valid"
        return `Lower point of Arc: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm`
    }   

    if (line.angleOK)
        return "Angle: Valid"
    return `Angle: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm` 
}

export function touchlineValue(line: LineValidation, lineWidthMiddle?: LineValidation): string {
    let res = "";

    res += line.lengthOK 
        ? "Length: Valid" 
        : `Length: Invalid, Out of tolerance. Length: ${line.lengthOverMargin.toFixed(3)} m`;

    res += line.angleOK 
        ? ", Angle: Valid\n" 
        : `, Angle: Invalid, Out of tolerance. Length: ${line.angleOverMargin.toFixed(3)} m\n`;

    if (lineWidthMiddle) {
        res += lineWidthMiddle.lengthOK 
            ? "Vertical position of Middle: Valid" 
            : `Vertical position of Middle: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm`;

        res += lineWidthMiddle.angleOK 
            ? ", Horizontal position of Middle: Valid" 
            : `, Horizontal position of Middle: Invalid, Out of tolerance by ${(line.lengthOverMargin * 100).toFixed(1)} cm`;
    }

    return res.trim();
}

export function getValidations(mainPoints: number[][]): LineValidation[] {
    const linesToValidate = [
        {name: "Upper Touchline", points: [5, 30, 17], isHorizontal: true}, 
        {name: "Upper Touchline With Middle", points: [17, 5, 30], isHorizontal: true},
        {name: "Lower Touchline", points: [0, 25, 13], isHorizontal: true}, 
        {name: "Lower Touchline With Middle", points: [13, 0, 25], isHorizontal: true},

        {name: "Halfline", points: [13, 17, 14, 15, 16], isHorizontal: false},
        {name: "Centre Circle", points: [15, 14, 16], isHorizontal: false},
        {name: "Centre Point", points: [15], isHorizontal: false},
        {name: "Left Penalty Point", points: [8, 2, 3], isHorizontal: false}, 
        {name: "Right Penalty Point", points: [22, 27, 28], isHorizontal: false},

        {name: "Left Goal Line", points: [0, 5, 1, 2, 3, 4], isHorizontal: false},
        {name: "Right Goal Line", points: [25, 30, 26, 27, 28, 29], isHorizontal: false},
        {name: "Left Goal Area Left Line", points: [2, 3], isHorizontal: false},
        {name: "Right Goal Area Left Line", points: [24, 23], isHorizontal: false},
        {name: "Left Goal Area Right Line", points: [6, 7], isHorizontal: false},
        {name: "Right Goal Area Right Line", points: [27, 28], isHorizontal: false},
        {name: "Left Goal Area Upper Line", points: [3, 6], isHorizontal: true},
        {name: "Right Goal Area Upper Line", points: [23, 28], isHorizontal: true},
        {name: "Left Goal Area Lower Line", points: [2, 7], isHorizontal: true},
        {name: "Right Goal Area Lower Line", points: [24, 27], isHorizontal: true},
        {name: "Left Penalty Area Left Line", points: [1, 4, 2, 3], isHorizontal: false},
        {name: "Right Penalty Area Left Line", points: [18, 21, 19, 20], isHorizontal: false},
        {name: "Left Penalty Area Right Line", points: [9, 12, 10 , 11], isHorizontal: false},
        {name: "Right Penalty Area Right Line", points: [26, 29, 27, 28], isHorizontal: false},
        {name: "Left Penalty Area Upper Line", points: [4, 9], isHorizontal: true},
        {name: "Right Penalty Area Upper Line", points: [18, 29], isHorizontal: true},
        {name: "Left Penalty Area Lower Line", points: [1, 12], isHorizontal: true},
        {name: "Right Penalty Area Lower Line", points: [21, 26], isHorizontal: true},
        {name: "Left Penalty Arc", points: [8, 10, 11], isHorizontal: false},
        {name: "Right Penalty Arc", points: [22, 19, 20], isHorizontal: false},
    ];

    function lineLength(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x1 - x2;
        const dy = y1 - y2;

        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    function lineLengthWithHeight(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;

        return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
    }

    function lengthOfPoints(points: number[][]): number {
        let totalLength = 0;
        for (let i = 0; i < points.length - 1; i++) {
            totalLength += lineLengthWithHeight(points[i][0], points[i][1], points[i][2], points[i + 1][0], points[i + 1][1], points[i + 1][2]);
        }
        return totalLength;
    }

    const angleTolerance = 0.12;
    // in length it is 12 cm but 6 shorter or longer so together 12cm range of error
    const lengthTolerance = 0.12;
    const additionalArcTolerance = 0.2;

    function diffInLengths(length: number, desiredLength: number): number {
        const res = Math.abs(desiredLength) - Math.abs(length);
        return Math.trunc(res * 1000) / 1000;
    }

    function isLengthOverMargin(diffLength: number, tolerance: number): boolean {
        return tolerance/2 >= diffLength && diffLength >= -tolerance/2;
    }

    function lengthOverMargin(diffLength: number, tolerance: number): number {
        if (diffLength < 0)
            return -(tolerance/2 + diffLength);
        return tolerance/2 - diffLength;
    }

    const resultOfLineValidation: LineValidation[] = [];

    function leftLineHeightAproximation(x: number): number {
        // approximation of height of left line based on x coordinate, because of different ranges
        const leftPenaltyPoint = linesToValidate.find(line => line.name === "Left Penalty Point");
        const centrePoint = linesToValidate.find(line => line.name === "Centre Point");
        if (!leftPenaltyPoint || !centrePoint) return 0;
        
        const x1 = mainPoints[leftPenaltyPoint.points[0]][0];
        const z1 = mainPoints[leftPenaltyPoint.points[0]][2];
        const x2 = mainPoints[centrePoint.points[0]][0];
        const z2 = mainPoints[centrePoint.points[0]][2];

        // avoids division by zero
        if (x1 === x2) return z1;

        const t = (x - x1) / (x2 - x1);

        return z1 + t * (z2 - z1);
    }

    function rightLineHeightAproximation(x: number): number {
        // approximation of height of right line based on x coordinate, because of different ranges
        const rightPenaltyPoint = linesToValidate.find(line => line.name === "Right Penalty Point");
        const centrePoint = linesToValidate.find(line => line.name === "Centre Point");
        if (!rightPenaltyPoint || !centrePoint) return 0;
        
        const x1 = mainPoints[rightPenaltyPoint.points[0]][0];
        const z1 = mainPoints[rightPenaltyPoint.points[0]][2];
        const x2 = mainPoints[centrePoint.points[0]][0];
        const z2 = mainPoints[centrePoint.points[0]][2];

        // avoids division by zero
        if (x1 === x2) return z1;

        const t = (x - x1) / (x2 - x1);

        return z1 + t * (z2 - z1);
    }
    
    // length and angle naming is mainly for straight lines, in points or other situations they may be used for other purpose 
    for (let i = 0; i < linesToValidate.length; i++) {
        const line = linesToValidate[i];

        if (line.name.includes("Penalty Point")) {
            const middle = [(mainPoints[line.points[1]][0] + mainPoints[line.points[2]][0]) / 2, (mainPoints[line.points[1]][1] + mainPoints[line.points[2]][1]) / 2 ];
            const length = lineLength(mainPoints[line.points[0]][0], mainPoints[line.points[0]][1], middle[0], middle[1]);
            // 0.06 width of line
            const diffLength = diffInLengths(length + 0.06, 11)
            const yAxisDiff = diffInLengths(mainPoints[line.points[0]][1], middle[1]);
            resultOfLineValidation.push({name: line.name, lengthOK: isLengthOverMargin(diffLength, lengthTolerance), lengthOverMargin: lengthOverMargin(diffLength, lengthTolerance), 
                angleOK: isLengthOverMargin(yAxisDiff, angleTolerance), angleOverMargin: lengthOverMargin(yAxisDiff, angleTolerance), enabled: true});
            continue;
        }

        if (line.name.includes("Centre Point")) {
            const xAxisDiff = diffInLengths(mainPoints[line.points[0]][0], 0);
            const yAxisDiff = diffInLengths(mainPoints[line.points[0]][1], 0);
            resultOfLineValidation.push({name: line.name, lengthOK: isLengthOverMargin(xAxisDiff, angleTolerance), lengthOverMargin: lengthOverMargin(xAxisDiff, angleTolerance), 
                angleOK: isLengthOverMargin(yAxisDiff, angleTolerance), angleOverMargin: lengthOverMargin(yAxisDiff, angleTolerance), enabled: true});
            continue;
        }

        if (line.name.includes("Centre Circle")) {
            const diameter = lengthOfPoints([mainPoints[line.points[1]], mainPoints[line.points[0]], mainPoints[line.points[2]]]);
            const diameterhOver = diffInLengths(diameter + 0.12, 18.30)

            // how much off is middle point from middle of circle defined by two outer points
            const middle = [(mainPoints[line.points[1]][0] + mainPoints[line.points[2]][0]) / 2, (mainPoints[line.points[1]][1] + mainPoints[line.points[2]][1]) / 2 ];
            const length = lineLength(mainPoints[line.points[0]][0], mainPoints[line.points[0]][1], middle[0], middle[1]);
            const diffLength = diffInLengths(length, 0)
        
            resultOfLineValidation.push({name: line.name, lengthOK: isLengthOverMargin(diameterhOver, lengthTolerance), lengthOverMargin: lengthOverMargin(diameterhOver, lengthTolerance), 
                angleOK: isLengthOverMargin(diffLength, lengthTolerance), angleOverMargin: lengthOverMargin(diffLength, lengthTolerance), enabled: true});
            continue;
        }

        if (line.name.includes("Penalty Arc")) {
            const lengthUpperPoint = lineLength(mainPoints[line.points[0]][0], mainPoints[line.points[0]][1], mainPoints[line.points[1]][0], mainPoints[line.points[1]][1])
            const lengthLowerPoint = lineLength(mainPoints[line.points[0]][0], mainPoints[line.points[0]][1], mainPoints[line.points[2]][0], mainPoints[line.points[2]][1])
            const lengthOverUpper = diffInLengths(lengthUpperPoint + 0.06, 9.15)
            const lengthOverLower = diffInLengths(lengthLowerPoint + 0.06, 9.15)

            resultOfLineValidation.push({name: line.name, lengthOK: isLengthOverMargin(lengthOverUpper, lengthTolerance + additionalArcTolerance), lengthOverMargin: lengthOverMargin(lengthOverUpper, lengthTolerance + additionalArcTolerance), 
                angleOK: isLengthOverMargin(lengthOverLower, lengthTolerance + additionalArcTolerance), angleOverMargin: lengthOverMargin(lengthOverLower, lengthTolerance + additionalArcTolerance), enabled: true});
            continue;
        }   

        // checks how of is the middle point in touchlines
        if (line.name.includes("Touchline With Middle")) {
            // how much off is middle point from middle of circle defined by two outer points
            const middle = [(mainPoints[line.points[1]][0] + mainPoints[line.points[2]][0]) / 2, (mainPoints[line.points[1]][1] + mainPoints[line.points[2]][1]) / 2 ];
            const xAxisDiff = diffInLengths(mainPoints[line.points[0]][0], middle[0]);
            const yAxisDiff = diffInLengths(mainPoints[line.points[0]][1], middle[1]);
        
            resultOfLineValidation.push({name: line.name, lengthOK: isLengthOverMargin(xAxisDiff, angleTolerance), lengthOverMargin: lengthOverMargin(xAxisDiff, angleTolerance), 
                angleOK: isLengthOverMargin(yAxisDiff, angleTolerance), angleOverMargin: lengthOverMargin(yAxisDiff, angleTolerance), enabled: true});
            continue;
        }

        if (line.isHorizontal) {
            let length = lineLength(mainPoints[line.points[0]][0], mainPoints[line.points[0]][1], mainPoints[line.points[1]][0], mainPoints[line.points[1]][1]);
            const yAxisDiff = diffInLengths(mainPoints[line.points[0]][1],  mainPoints[line.points[1]][1]);
            let desiredLength = 0;
            
            if (line.name.includes("Touchline")) {
                length = lengthOfPoints([mainPoints[line.points[0]], mainPoints[line.points[2]], mainPoints[line.points[1]]]);
                // needs special handling lengthOverMargin is actually real length, because of different ranges
                resultOfLineValidation.push({name: line.name, lengthOK: 110 + lengthTolerance/2 >= (length + 0.12) && (length + 0.12) >= 100 - lengthTolerance/2, 
                    lengthOverMargin: length + 0.12, 
                    angleOK: isLengthOverMargin(yAxisDiff, angleTolerance), angleOverMargin: lengthOverMargin(yAxisDiff, angleTolerance), enabled: true});
                continue;
            } else if (line.name.includes("Goal Area Upper Line") || line.name.includes("Goal Area Lower Line")) {
                desiredLength = 5.5;
            } else if (line.name.includes("Penalty Area Upper Line") || line.name.includes("Penalty Area Lower Line")) {
                desiredLength = 16.5;
            } 
            const diffLength = diffInLengths(length + 0.12, desiredLength)
            
            resultOfLineValidation.push({name: line.name, lengthOK: isLengthOverMargin(diffLength, lengthTolerance), lengthOverMargin: lengthOverMargin(diffLength, lengthTolerance), 
                angleOK: isLengthOverMargin(yAxisDiff, angleTolerance), angleOverMargin: lengthOverMargin(yAxisDiff, angleTolerance), enabled: true});
            continue;
        } else {
            let length = lineLength(mainPoints[line.points[0]][0], mainPoints[line.points[0]][1], mainPoints[line.points[1]][0], mainPoints[line.points[1]][1]);
            const xAxisDiff = diffInLengths(mainPoints[line.points[0]][0],  mainPoints[line.points[1]][0]);
            let desiredLength = 0;
            if (line.name == "Halfline" || line.name == "Left Goal Line" || line.name == "Right Goal Line") {
                if (line.name == "Halfline") {
                    length = lengthOfPoints([mainPoints[line.points[0]], mainPoints[line.points[2]], mainPoints[line.points[3]], mainPoints[line.points[4]], mainPoints[line.points[1]]]);
                } else if (line.name == "Left Goal Line") {
                    const x = (mainPoints[line.points[0]][0] + mainPoints[line.points[1]][0]) / 2;
                    length = lengthOfPoints([mainPoints[line.points[0]], mainPoints[line.points[2]], mainPoints[line.points[3]], 
                        [x, (mainPoints[line.points[0]][1] + mainPoints[line.points[1]][1]) / 2, leftLineHeightAproximation(x)],
                        mainPoints[line.points[4]], mainPoints[line.points[5]], mainPoints[line.points[1]]]);
                } else if (line.name == "Right Goal Line") {
                    const x = (mainPoints[line.points[0]][0] + mainPoints[line.points[1]][0]) / 2;
                    length = lengthOfPoints([mainPoints[line.points[0]], mainPoints[line.points[2]], mainPoints[line.points[3]], 
                        [x, (mainPoints[line.points[0]][1] + mainPoints[line.points[1]][1]) / 2, rightLineHeightAproximation(x)],
                        mainPoints[line.points[4]], mainPoints[line.points[5]], mainPoints[line.points[1]]]);
                }
                // needs special handling lengthOverMargin is actually real length, because of different ranges
                resultOfLineValidation.push({name: line.name, lengthOK: 75 + lengthTolerance/2 >= (length + 0.12) && (length + 0.12) >= 64 - lengthTolerance/2, lengthOverMargin: length + 0.12, 
                    angleOK: isLengthOverMargin(xAxisDiff, angleTolerance), angleOverMargin: lengthOverMargin(xAxisDiff, angleTolerance), enabled: true});
                continue;
            } else if (line.name.includes("Goal Area Left Line") || line.name.includes("Goal Area Right Line")) {
                if (line.name.includes("Left Goal Area")) {
                    const x = (mainPoints[line.points[0]][0] + mainPoints[line.points[1]][0]) / 2;
                    length = lengthOfPoints([mainPoints[line.points[0]],
                        [x, (mainPoints[line.points[0]][1] + mainPoints[line.points[1]][1]) / 2, leftLineHeightAproximation(x)],
                        mainPoints[line.points[1]]]);
                } else {
                    const x = (mainPoints[line.points[0]][0] + mainPoints[line.points[1]][0]) / 2;
                    length = lengthOfPoints([mainPoints[line.points[0]], 
                        [x, (mainPoints[line.points[0]][1] + mainPoints[line.points[1]][1]) / 2, rightLineHeightAproximation(x)],
                       mainPoints[line.points[1]]]);
                }

                desiredLength = 18.3;
                //const ddiffLength = diffInLengths(length + 0.12, desiredLength)
                //console.log(line.name, length, desiredLength, ddiffLength)
                //console.log(mainPoints[line.points[0]][0], mainPoints[line.points[0]][1], mainPoints[line.points[1]][0], mainPoints[line.points[1]][1])
            } else if (line.name.includes("Penalty Area Left Line") || line.name.includes("Penalty Area Right Line")) {
                if (line.name.includes("Left Penalty Area")) {
                    const x = (mainPoints[line.points[2]][0] + mainPoints[line.points[3]][0]) / 2;
                    length = lengthOfPoints([mainPoints[line.points[0]], mainPoints[line.points[2]], 
                        [x, (mainPoints[line.points[2]][1] + mainPoints[line.points[3]][1]) / 2, leftLineHeightAproximation(x)],
                        mainPoints[line.points[3]], mainPoints[line.points[1]]]);
                } else {
                    const x = (mainPoints[line.points[2]][0] + mainPoints[line.points[3]][0]) / 2;
                    length = lengthOfPoints([mainPoints[line.points[0]], mainPoints[line.points[2]],
                        [x, (mainPoints[line.points[2]][1] + mainPoints[line.points[3]][1]) / 2, rightLineHeightAproximation(x)],
                        mainPoints[line.points[3]], mainPoints[line.points[1]]]);
                }

                desiredLength = 40.3;
                //const ddiffLength = diffInLengths(length + 0.12, desiredLength)
                //console.log(line.name, length, desiredLength, ddiffLength)
                //console.log(mainPoints[line.points[0]][0], mainPoints[line.points[0]][1], mainPoints[line.points[1]][0], mainPoints[line.points[1]][1])
            } 
        
            const diffLength = diffInLengths(length + 0.12, desiredLength)
            const newLengthTolerance = lengthTolerance + 0.02; // because of different ranges and possible bigger errors in longer lines and also slope, we increase tolerance for them, this is not ideal but works for now
            resultOfLineValidation.push({name: line.name, lengthOK: isLengthOverMargin(diffLength, newLengthTolerance), lengthOverMargin: lengthOverMargin(diffLength, newLengthTolerance), 
                angleOK: isLengthOverMargin(xAxisDiff, angleTolerance), angleOverMargin: lengthOverMargin(xAxisDiff, angleTolerance), enabled: true});
            continue;
        }
    }
    return resultOfLineValidation;
}


export default function MeasurementValidation() {
    const { getMainPoints } = useAppStorage();
    const navigate = useNavigate();
    const mainPoints = getMainPoints();
    const lineValidations = getValidations(mainPoints);
    //console.log(mainPoints)

    const [enabledLines, setEnabledLines] = useState<Record<string, boolean>>({});

    const toggleLine = (name: string) => {
        setEnabledLines(prev => ({
        ...prev,
        [name]: !prev[name],
        }));
    };

    const toggleAll = () => {
        const filteredLines = lineValidations.filter(line =>
            line.name !== "Upper Touchline With Middle" &&
            line.name !== "Lower Touchline With Middle"
        );

        const allEnabled = filteredLines.every(line => enabledLines[line.name]);

        const updated: Record<string, boolean> = {};
        filteredLines.forEach(line => {
            updated[line.name] = !allEnabled;
        });

        setEnabledLines(prev => ({
            ...prev,
            ...updated
        }));
    };

    const handleNext = () => {
        navigate("/finalValidation"); 
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

    

    

    const visibleLines = lineValidations ? lineValidations.filter(line => 
        line.name !== "Upper Touchline With Middle" &&
        line.name !== "Lower Touchline With Middle"
    ) : [];


    const mergedLineValidations = useMemo(() => {
        return lineValidations.map(line => ({
            ...line,
            enabled: enabledLines[line.name] ?? false
        }));
    }, [lineValidations, enabledLines]);

    return (
        <div style={{ display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingBottom: "3rem",
            gap: "clamp(0.5rem, 5vh, 2.5rem)",
            height: "95vh"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center"}}>
                <div style={{textAlign: "center", fontSize: "clamp(1.2rem, 8vw, 3rem)",}}>
                   Measurement Validation
                </div>
                <div style={{ display: "flex", justifyContent: "center", maxWidth: window.innerWidth < 850 ? "100vw" : "75vw"}}>
                    <InteractiveField lineValidations={mergedLineValidations}/>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: window.innerWidth < 500
                            ? "1fr"
                            : "1fr 1fr",
                        gap: "0.5rem 2rem",
                        maxWidth: window.innerWidth < 850 ? "100vw" : "75vw",
                        backgroundColor: "gray",
                        padding: "1rem",
                        fontSize: "clamp(1.0rem, 6vw, 2.2rem)",
                    }}
                >
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontWeight: "bold",
                            fontSize: "1.8rem",
                            minWidth: 0,
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={visibleLines.every(line => enabledLines[line.name])}
                            onChange={toggleAll}
                        />
                        All
                    </label>

                    {lineValidations
                        .filter(line =>
                            line.name !== "Upper Touchline With Middle" &&
                            line.name !== "Lower Touchline With Middle"
                        )
                        .map((line) => {
                            // Red text if out of tolerance
                            const statusText = line.name.includes("Upper Touchline")
                                ? touchlineValue(line, lineValidations.find(l => l.name === "Upper Touchline With Middle"))
                                : line.name.includes("Lower Touchline")
                                ? touchlineValue(line, lineValidations.find(l => l.name === "Lower Touchline With Middle"))
                                : `${firstValue(line)}, ${secondValue(line)}`;

                            const isOutOfTolerance = statusText.includes("Out of tolerance");

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
                                        <input
                                            type="checkbox"
                                            checked={!!enabledLines[line.name]}
                                            onChange={() => toggleLine(line.name)}
                                        />
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
            <div  style={{ display: "flex", justifyContent: "center", flexDirection: "row", gap: "clamp(2rem, 35vw, 40rem)", 
                maxHeight: "5vh",  paddingBottom: "3rem"}}>
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