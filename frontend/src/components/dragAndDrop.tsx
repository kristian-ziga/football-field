import { useCallback } from "react";
import { useAppStorage } from "../visualization/StorageProvider";

type DragAndDropProps = {
    onError?: (err: Error) => void;
};

export default function DragAndDrop({ onError }: DragAndDropProps) {
    const { addFile, removeFile, mainPointsFile } = useAppStorage();

    const handleFile = async (file: File) => {
         try {
            if (!file.name.toLowerCase().endsWith(".csv")) {
                throw new Error("Only CSV files are allowed.");
            }
            const content = await file.text();
            addFile({ name: file.name, content }, true);
        } catch (err) {
            if (onError && err instanceof Error) {
                onError(err);
            }
        }
    };

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, []);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const removeMainFile = () => {
        removeFile(true);
    };

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
                {mainPointsFile ? (
                    <>File name: {mainPointsFile.name} 
                    <button onClick={removeMainFile} 
                        style={{
                            marginBottom: "2px",
                            background: "transparent",
                            border: "none",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                            color: "white",
                        }}>×
                    </button></>
                ) : (
                    <>
                        <span>
                            Drag & drop a CSV file here or{" "}
                            <label
                                htmlFor="fileInput"
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
                    id="fileInput"
                />
            </div>
        </div>
    );
}