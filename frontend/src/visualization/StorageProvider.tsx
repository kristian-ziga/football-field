import { createContext, useContext, useEffect, useState } from "react";
import { transformPoints } from "../components/dragAndDrop";

interface StoredFile {
    name: string;
    content: string;
}

interface AppStorage {
    mainPointsFile: StoredFile | null;
    secondaryPointsFile: StoredFile | null;
    mainPoints: number[][];
    secondaryPoints: number[][];

    addFile: (file: StoredFile, isMain: boolean) => void;
    removeFile: (isMain: boolean) => void;
    setPoints: (list: number[][], isMain: boolean) => void;
    getMainPoints: () => number[][];
    getAllPoints: () => number[][];
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

    const addFile = (file: StoredFile, isMain: boolean) => {
        if (isMain) {
            setMainPointsFile(file);
        } else {
            setSecondaryPointsFile(file);
        }
    };

    const removeFile = (isMain: boolean) => {
        if (isMain) {
            setMainPointsFile(null);
            setPoints([], true)
        } else {
            setSecondaryPointsFile(null);
            setPoints([], false)
        }
    };

    const setPoints = (newPoints: number[][], isMain: boolean) => {
        if (isMain) {
            setMainPoints(newPoints);
        } else {
            setSecondaryPoints(newPoints);
        }
    };

    const getAllPoints = () => {
        if (mainPoints && mainPoints.length >= 31) {
            return transformPoints([...mainPoints, ...(secondaryPoints ?? [])])
        }
        return [];
    };

    const getMainPoints = () => {
        if (mainPoints && mainPoints.length >= 31) {
            return transformPoints(mainPoints)
        }
        return [];
    }

    return (
        <AppStorageContext.Provider value={{ mainPointsFile, secondaryPointsFile, mainPoints, secondaryPoints, addFile, removeFile, setPoints, getMainPoints, getAllPoints }}>
            {children}
        </AppStorageContext.Provider>
    );
};

export const useAppStorage = () => {
    const ctx = useContext(AppStorageContext);
    if (!ctx) throw new Error("useAppStorage must be used inside AppStorageProvider");
    return ctx;
};