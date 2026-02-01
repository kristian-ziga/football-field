import { createContext, useContext, useEffect, useState } from "react";

interface StoredFile {
    name: string;
    content: string;
}

interface AppStorage {
    mainPointsFile: StoredFile | null;
    otherPointsFiles: StoredFile[];
    points: number[][];
    addFile: (file: StoredFile, isMain?: boolean) => void;
    removeFile: (index: number) => void;
    setList: (list: number[][]) => void;
}

const AppStorageContext = createContext<AppStorage | null>(null);

export const AppStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mainPointsFile, setMainPointsFile] = useState<StoredFile | null>(() => {
        const saved = localStorage.getItem("app_mainPointsFile");
        return saved ? JSON.parse(saved) : null;
    });

    const [otherPointsFiles, setOtherPointsFiles] = useState<StoredFile[]>(() => {
        const saved = localStorage.getItem("app_otherPointsFiles");
        return saved ? JSON.parse(saved) : [];
    });

    const [points, setPoints] = useState<number[][]>(() => {
        const saved = localStorage.getItem("app_points");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("app_mainPointsFile", JSON.stringify(mainPointsFile));
    }, [mainPointsFile]);

    useEffect(() => {
        localStorage.setItem("app_otherPointsFiles", JSON.stringify(otherPointsFiles));
    }, [otherPointsFiles]);

    useEffect(() => {
        localStorage.setItem("app_points", JSON.stringify(points));
    }, [points]);

    const addFile = (file: StoredFile, isMain = false) => {
        if (isMain) {
            setMainPointsFile(file);
        } else {
            setOtherPointsFiles((prev) => {
                if (prev.length >= 5) return prev;
                return [...prev, file];
            });
        }
    };

    const removeFile = (index: number) => {
        setOtherPointsFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const setList = (newPoints: number[][]) => {
        setPoints(newPoints);
    };

    return (
        <AppStorageContext.Provider value={{ mainPointsFile, otherPointsFiles, points, addFile, removeFile, setList }}>
            {children}
        </AppStorageContext.Provider>
    );
};

export const useAppStorage = () => {
    const ctx = useContext(AppStorageContext);
    if (!ctx) throw new Error("useAppStorage must be used inside AppStorageProvider");
    return ctx;
};