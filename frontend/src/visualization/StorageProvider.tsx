import { createContext, useContext, useEffect, useState } from "react";

interface StoredFile {
    name: string;
    content: string;
}

interface AppStorage {
    mainPointsFile: StoredFile | null;
    secondaryPointsFile: StoredFile | null;
    mainPoints: number[][];
    secondaryPoints: number[][];

    addFile: (file: StoredFile, isMain?: boolean) => void;
    removeFile: (isMain?: boolean) => void;
    setPoints: (list: number[][], isMain?: boolean) => void;
}

const AppStorageContext = createContext<AppStorage | null>(null);

export const AppStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mainPointsFile, setMainPointsFile] = useState<StoredFile | null>(() => {
        const saved = localStorage.getItem("app_mainPointsFile");
        return saved ? JSON.parse(saved) : null;
    });

    const [secondaryPointsFile, setSecondaryPointsFile] = useState<StoredFile | null>(() => {
        const saved = localStorage.getItem("app_secondaryPointsFile");
        return saved ? JSON.parse(saved) : null;
    });

    const [mainPoints, setMainPoints] = useState<number[][]>(() => {
        const saved = localStorage.getItem("app_mainPoints");
        return saved ? JSON.parse(saved) : [];
    });

    const [secondaryPoints, setSecondaryPoints] = useState<number[][]>(() => {
        const saved = localStorage.getItem("app_secondaryPoints");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("app_mainPointsFile", JSON.stringify(mainPointsFile));
    }, [mainPointsFile]);

    useEffect(() => {
        localStorage.setItem("app_secondaryPointsFile", JSON.stringify(secondaryPointsFile));
    }, [secondaryPointsFile]);

    useEffect(() => {
        localStorage.setItem("app_mainPoints", JSON.stringify(mainPoints));
    }, [mainPoints]);

    useEffect(() => {
        localStorage.setItem("app_secondaryPoints", JSON.stringify(secondaryPoints));
    }, [secondaryPoints]);

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

    const setPoints = (newPoints: number[][], isMain = true) => {
        if (isMain) {
            setMainPoints(newPoints);
        } else {
            setSecondaryPoints(newPoints);
        }
    };

    return (
        <AppStorageContext.Provider value={{ mainPointsFile, secondaryPointsFile, mainPoints, secondaryPoints, addFile, removeFile, setPoints }}>
            {children}
        </AppStorageContext.Provider>
    );
};

export const useAppStorage = () => {
    const ctx = useContext(AppStorageContext);
    if (!ctx) throw new Error("useAppStorage must be used inside AppStorageProvider");
    return ctx;
};