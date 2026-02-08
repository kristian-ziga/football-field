import { createContext, useContext, useEffect, useState } from "react";

interface StoredFile {
    name: string;
    content: string;
}

interface AppStorage {
    mainPointsFile: StoredFile | null;
    secondaryPointsFile: StoredFile | null;
    points: number[][];
    addFile: (file: StoredFile, isMain?: boolean) => void;
    removeFile: (isMain?: boolean) => void;
    setList: (list: number[][]) => void;
}

const AppStorageContext = createContext<AppStorage | null>(null);

export const AppStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mainPointsFile, setMainPointsFile] = useState<StoredFile | null>(() => {
        const saved = localStorage.getItem("app_mainPointsFile");
        return saved ? JSON.parse(saved) : null;
    });

    const [secondaryPointsFile, setSecondaryPointsFile] = useState<StoredFile | null>(() => {
        const saved = localStorage.getItem("app_secondaryPointsFile");
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
        localStorage.setItem("app_secondaryPointsFile", JSON.stringify(secondaryPointsFile));
    }, [secondaryPointsFile]);

    useEffect(() => {
        localStorage.setItem("app_points", JSON.stringify(points));
    }, [points]);

    const addFile = (file: StoredFile, isMain = false) => {
        if (isMain) {
            setMainPointsFile(file);
        } else {
            setSecondaryPointsFile(file);
        }
    };

    const removeFile = (isMain = true) => {
        if (isMain) {
            setMainPointsFile(null);
        } else {
            setSecondaryPointsFile(null);
        }
    };

    const setList = (newPoints: number[][]) => {
        setPoints(newPoints);
    };

    return (
        <AppStorageContext.Provider value={{ mainPointsFile, secondaryPointsFile, points, addFile, removeFile, setList }}>
            {children}
        </AppStorageContext.Provider>
    );
};

export const useAppStorage = () => {
    const ctx = useContext(AppStorageContext);
    if (!ctx) throw new Error("useAppStorage must be used inside AppStorageProvider");
    return ctx;
};