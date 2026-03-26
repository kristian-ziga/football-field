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
    topViewImage: string | null;
    topViewHeatmapImage: string | null;

    setTopViewImage: (image: string | null) => void;
    setTopViewHeatmapImage: (image: string | null) => void;
    addFile: (file: StoredFile, isMain: boolean) => void;
    removeFile: (isMain: boolean) => void;
    setPoints: (list: number[][], isMain: boolean) => void;
    getMainPoints: () => number[][];
    getAllPoints: () => number[][];

    sceneData: any | null; 
    setSceneData: (data: any) => void; 
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

    const [topViewImage, setTopViewImage] = useState<string | null>(() => {
        return localStorage.getItem("app_topViewImage");
    });

    const [topViewHeatmapImage, setTopViewHeatmapImage] = useState<string | null>(() => {
        return localStorage.getItem("app_topViewHeatmapImage");
    });

    const [sceneData, setSceneData] = useState<any>(null);

    useEffect(() => {
        if (topViewImage) {
            localStorage.setItem("app_topViewImage", topViewImage);
        } else {
            localStorage.removeItem("app_topViewImage");
        }
    }, [topViewImage]);

    useEffect(() => {
        if (topViewHeatmapImage) {
            localStorage.setItem("app_topViewHeatmapImage", topViewHeatmapImage);
        } else {
            localStorage.removeItem("app_topViewHeatmapImage");
        }
    }, [topViewHeatmapImage]);

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
        <AppStorageContext.Provider value={{ mainPointsFile, secondaryPointsFile, mainPoints, secondaryPoints, topViewImage, 
        topViewHeatmapImage, setTopViewImage, setTopViewHeatmapImage, addFile, removeFile, setPoints, getMainPoints, 
        getAllPoints, sceneData, setSceneData }}>
            {children}
        </AppStorageContext.Provider>
    );
};

export const useAppStorage = () => {
    const ctx = useContext(AppStorageContext);
    if (!ctx) throw new Error("useAppStorage must be used inside AppStorageProvider");
    return ctx;
};


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