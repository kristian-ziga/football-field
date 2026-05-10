import { createContext, useContext, useEffect, useState } from "react";
import { PCA } from "ml-pca";

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
            return transformPoints([...identifyPoints(mainPoints), ...(secondaryPoints ?? [])])
        }
        return [];
    };

    const getMainPoints = () => {
        if (mainPoints && mainPoints.length >= 31) {
            return transformPoints(identifyPoints(mainPoints))
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


export function identifyPoints(rawPoints: number[][]): number[][] {
    const n = 31;
    const sliced = rawPoints.slice(0, n);

    // Use the centroid of all 31 points as the reference centre before the orientation check.
    const meanX = sliced.reduce((s, p) => s + p[0], 0) / n;
    const meanY = sliced.reduce((s, p) => s + p[1], 0) / n;
    const centeredForCheck = sliced.map(([x, y, z]) => [x - meanX, y - meanY, z]);
    
    const posXCount = centeredForCheck.slice(0, 13).filter(p => p[0] > 0).length;
    const pts = posXCount > 6 ? sliced.map(([x, y, z]) => [-x, -y, z]) : sliced;

    const pca = new PCA(pts.map(([x, y]) => [x, y]));
    const eigenvalues = pca.getEigenvalues();
    const eigenvectors = pca.getEigenvectors();

    const smallestIdx = eigenvalues.indexOf(Math.min(...eigenvalues));
    const pc2x = eigenvectors.get(0, smallestIdx);
    const pc2y = eigenvectors.get(1, smallestIdx);

    // Same formula as original rotateField, aligns short axis with y-axis
    const angle = Math.atan2(pc2y, pc2x);
    const rotAngle = Math.PI / 2 - angle;
    const cx = pts.reduce((s, p) => s + p[0], 0) / n;
    const cy = pts.reduce((s, p) => s + p[1], 0) / n;

    // Temporarily rotate and centre all points for identification only
    const rotated = pts.map(([x, y, z]) => {
        const dx = x - cx, dy = y - cy;
        return [
            dx * Math.cos(rotAngle) - dy * Math.sin(rotAngle),
            dx * Math.sin(rotAngle) + dy * Math.cos(rotAngle),
            z,
        ];
    });

    // Estimate half-dimensions from most extreme points
    const halfL = Math.max(...rotated.map(p => Math.abs(p[0])));
    const halfW = Math.max(...rotated.map(p => Math.abs(p[1])));

    // Fixed FIFA dimensions
    const goHW = 9.16;    // goal area half-width (5.5 + 3.66)
    const goD = 5.5;      // goal area depth
    const penHW = 20.16;  // penalty area half-width (16.5 + 3.66)
    const penD = 16.5;    // penalty area depth
    const penSpot = 11;   // penalty spot from goal line
    const circleR = 9.15; // centre circle radius
    const arcHalf = Math.sqrt(90.75); // where arc crosses penalty area line (~7.31)

    // Expected (x, y) for each semantic index 0–30 in the rotated/centred frame
    const expected: [number, number][] = [
        [-halfL,          -halfW ],  // 0  lower-left corner
        [-halfL,          -penHW ],  // 1  left goal line, pen area lower
        [-halfL,          -goHW  ],  // 2  left goal line, goal area lower
        [-halfL,          +goHW  ],  // 3  left goal line, goal area upper
        [-halfL,          +penHW ],  // 4  left goal line, pen area upper
        [-halfL,          +halfW ],  // 5  upper-left corner
        [-halfL + goD,    +goHW  ],  // 6  goal area far upper
        [-halfL + goD,    -goHW  ],  // 7  goal area far lower
        [-halfL + penSpot, 0     ],  // 8  left penalty spot
        [-halfL + penD,   +penHW ],  // 9  pen area far upper
        [-halfL + penD,   +arcHalf],  // 10 upper arc point
        [-halfL + penD,   -arcHalf],  // 11 lower arc point
        [-halfL + penD,   -penHW ],  // 12 pen area far lower
        [0,               -halfW ],  // 13 lower touchline at halfline
        [0,               -circleR], // 14 lower circle
        [0,               0      ],  // 15 centre point
        [0,               +circleR], // 16 upper circle
        [0,               +halfW ],  // 17 upper touchline at halfline
        [+halfL - penD,   +penHW ],  // 18 right pen area far upper
        [+halfL - penD,   +arcHalf],  // 19 upper right arc point
        [+halfL - penD,   -arcHalf],  // 20 lower right arc point
        [+halfL - penD,   -penHW ],  // 21 right pen area far lower
        [+halfL - penSpot, 0     ],  // 22 right penalty spot
        [+halfL - goD,    +goHW  ],  // 23 right goal area far upper
        [+halfL - goD,    -goHW  ],  // 24 right goal area far lower
        [+halfL,          -halfW ],  // 25 lower-right corner
        [+halfL,          -penHW ],  // 26 right goal line, pen area lower
        [+halfL,          -goHW  ],  // 27 right goal line, goal area lower
        [+halfL,          +goHW  ],  // 28 right goal line, goal area upper
        [+halfL,          +penHW ],  // 29 right goal line, pen area upper
        [+halfL,          +halfW ],  // 30 upper-right corner
    ];

    const used = new Set<number>();
    const result: number[][] = new Array(n);

    for (let i = 0; i < n; i++) {
        const position = expected[i];
        let nearestDistance = Infinity;
        let searchedPointOrd = -1;
        for (let y = 0; y < n; y++) {
            if (used.has(y)) continue;
            const point = rotated[y];
            const distance = (point[0] - position[0]) ** 2 + (point[1] - position[1]) ** 2
            if (distance < nearestDistance) {
                nearestDistance = distance;
                searchedPointOrd = y;
            }
        }
        used.add(searchedPointOrd);
        result[i] = pts[searchedPointOrd];
    }

    // checks if sides are not swapped
    const p8 = result[8];
    const rotX8 = (p8[0] - cx) * Math.cos(rotAngle) - (p8[1] - cy) * Math.sin(rotAngle);
    if (rotX8 > 0) {
        const swaps = [
            [0, 30], [1, 29], [2, 28], [3, 27], [4, 26], [5, 25],
            [6, 24], [7, 23], [8, 22],
            [9, 21], [10, 20], [11, 19], [12, 18],
            [13, 17], [14, 16],
        ];
        for (const [a, b] of swaps) {
            [result[a], result[b]] = [result[b], result[a]];
        }
    }

    return result;
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

    transformedPoints3 = rotateField(transformedPoints2, transformedPoints2[13], transformedPoints2[17]);

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