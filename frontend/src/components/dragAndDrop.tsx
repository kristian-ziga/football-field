import { useCallback, useState } from "react";
import { useAppStorage } from "../visualization/StorageProvider";
import PopUp from "./popUp";


export function txtParser(text: string): number[][] {
    const points: number[][] = [];
    
    const lines = text.split("\n");

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const parts = trimmed.split(/\s+/);

        if (parts.length < 4) {
            throw new Error(`Line ${index + 1} skipped: not enough columns`);
        }

        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            throw new Error(`Line ${index + 1} skipped: invalid number`);
        }

        points.push([x, y, z]);
    });

    return points;
}

export function transformPoints(mainPoints: number[][], secondaryPoints?: number[][]) {
    const transformedPoints1: number[][] = [];
    const transformedPoints2: number[][] = [];
    let transformedPoints3: number[][] = [];

    const diffX = mainPoints[15][0];
    const diffY = mainPoints[15][1];
    const diffZ = mainPoints[15][2];

    mainPoints.forEach(point => {
        const [x, y, z] = point;
        transformedPoints1.push([x - diffX, y - diffY, z - diffZ])
    })
    if (secondaryPoints) {
        secondaryPoints.forEach(point => {
            const [x, y, z] = point;
            transformedPoints1.push([x - diffX, y - diffY, z - diffZ])
        })
    }

    const middle_point_height = transformedPoints1[15][2];
    transformedPoints1.forEach(point => {
        const [x, y, z] = point;
        transformedPoints2.push([x, y, z - middle_point_height])
    })

    transformedPoints3 = rotateField(transformedPoints2, transformedPoints2[13], transformedPoints1[17]);
    return transformedPoints3;
}

export function rotateField(points: number[][], firstPoint: number[], secondPoint: number[]): number[][] {
    const newPoints: number[][] = [];

    const dx = firstPoint[0] - secondPoint[0];
    const dy = firstPoint[1] - secondPoint[1];

    const angle = Math.atan2(dy, dx);

    // Math.Pi / 2 because of finding angle of the middle line to vertical y-axis
    const rotationNeeded = Math.PI / 2 - angle;

    points.forEach(point => {
        newPoints.push(rotatePoint(point[0], point[1], point[2], rotationNeeded))
    })

    return newPoints;
}

export function rotatePoint(x: number, y: number, z: number, angle: number): number[] {
    const round3 = (n: number) => Number(n.toFixed(3));

    const newX = round3(x * Math.cos(angle) - y * Math.sin(angle));
    const newY = round3(y * Math.cos(angle) + x * Math.sin(angle));
    const newZ = round3(z);

    return [newX, newY, newZ];
}

type DragAndDropProps = {
    isMain: boolean;
};

export default function DragAndDrop({ isMain }: DragAndDropProps) {
    const { addFile, removeFile, mainPointsFile, secondaryPointsFile ,setPoints } = useAppStorage();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const inputId = isMain ? "fileInputMain" : "fileInputSecondary";

    const handleFile = async (file: File, isMain: boolean) => {
        try {
            if (!file.name.toLowerCase().endsWith(".txt")) {
                setText("Only TXT files are allowed");
                setOpen(true);
                return;
            }
            const content = await file.text();
            const pointsToAdd = txtParser(content)
            
            if (isMain && pointsToAdd.length < 31) {
                setText("TXT file does not have all needed main points.");
                setOpen(true);
                return;
            }
            addFile({ name: file.name, content }, isMain);
            setPoints(pointsToAdd, isMain)
        } catch (err) {
            if (err instanceof Error){
                setText(err.message)
                setOpen(true)
            }
        }
    };

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file, isMain);
    }, []);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file, isMain);
        e.target.value = "";
    };

    const removeMainFile = () => {
        removeFile(true);
    };

    const removeSecondaryFile = () => {
        removeFile(false);
    }

    return (
        <div>
            <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                    border: "2px dashed #aaa",
                    padding: "2rem",
                    textAlign: "center",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    backgroundColor: "#657b7f",
                    fontSize: "clamp(0.8rem, 6vw, 2rem)"
                }}
            >
                {isMain && mainPointsFile ? (
                    <>
                        File name: {mainPointsFile.name}
                        <button
                            onClick={removeMainFile}
                            style={{
                                marginBottom: "2px",
                                marginLeft: "3px",
                                background: "transparent",
                                border: "none",
                                fontSize: "2rem",
                                cursor: "pointer",
                                color: "black",
                            }}
                        >
                            ×
                        </button>
                    </>
                ) : !isMain && secondaryPointsFile ? (
                    <>
                        File name: {secondaryPointsFile.name}
                        <button
                            onClick={removeSecondaryFile}
                            style={{
                                marginBottom: "2px",
                                marginLeft: "3px",
                                background: "transparent",
                                border: "none",
                                fontSize: "2rem",
                                cursor: "pointer",
                                color: "black",
                            }}
                        >
                            ×
                        </button>
                    </>
                ) : (
                    <>
                        <span>
                            Drag & drop a {isMain ? "MAIN " : "SECONDARY "}txt file here or{" "}
                            <label
                                htmlFor={inputId}
                                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                            >
                                click
                            </label>{" "}
                            to browse
                        </span>
                    </>
                )}
                <input
                    type="file"
                    accept=".txt"
                    onChange={onInputChange}
                    style={{ display: "none" }}
                    id={inputId}
                />
            </div>
            <PopUp
                text={text}
                buttonText="OK"
                open={open}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}