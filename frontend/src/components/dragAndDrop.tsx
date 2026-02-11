import { useCallback, useState } from "react";
import { useAppStorage } from "../visualization/StorageProvider";
import PopUp from "./popUp";


export function csvParser(text: string): number[][] {
    const points: number[][] = [];
    
    const lines = text.split("\n");

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const parts = trimmed.split(",");
        if (parts.length < 3) {
            throw new Error(`Line ${index + 1} skipped: not enough columns`);
        }

        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        const z = parseFloat(parts[2]);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            throw new Error(`Line ${index + 1} skipped: invalid number`);
        }

        points.push([x, y, z]);
    });
    return points;
}

export function transformPoints(points: number[][]) {
    const transformedPoints = [];

    const diffX = points[15][0];
    const diffY = points[15][1];
    const diffZ = points[15][2];

    points.forEach(point => {
        const [x, y, z] = point;
        transformedPoints.push([x - diffX, y - diffY, z - diffZ])
    })
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
            if (!file.name.toLowerCase().endsWith(".csv")) {
                setText("Only CSV files are allowed");
                setOpen(true);
                return;
            }
            const content = await file.text();
            const pointsToAdd = csvParser(content)
            
            if (isMain && pointsToAdd.length < 31) {
                setText("CSV file does not have all needed main points.");
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
                            Drag & drop a {isMain ? "MAIN " : "SECONDARY "}csv file here or{" "}
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
                    accept=".csv"
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