import { useState } from "react";
import ControlsPanel from "./ControlPanel";
import SceneRenderer from "./SceneRenderer";
import { useAppStorage } from "./StorageProvider";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import {Link} from "react-router-dom";

export default function Visualization() {
    

    const { getAllPoints } = useAppStorage();

    const allPoints = getAllPoints();
    const allPointsForVisualization = allPoints.map(([x, y, z]) => [x, -y, z]);

    const line_order: number[][] = [
        [4, 9], [1, 12], [2, 7], [3, 6], [0, 13], [13, 25], [5, 17], [17, 30],
        [18, 29], [21, 26], [24, 27], [23, 28],
        // Obvod ihriska
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
        [30, 29], [29, 28], [28, 27], [27, 26], [26, 25],
        // Stredová čiara
        [13, 14], [14, 15], [15, 16], [16, 17],
        // Ľavé bránkové územie (malé)
        [6, 7],
        // Ľavé pokutové územie (veľké)
        [9, 10], [10, 11], [11, 12],
        // Pravé bránkové územie (malé)
        [23, 24],
        // Pravé pokutové územie (veľké)
        [18, 19], [19, 20], [20, 21],
    ];

    if (!allPoints || allPoints.length < 31) {
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
                        Points for visualization are missing
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
     const xs = allPoints.map(p => p[0]);
    const ys = allPoints.map(p => p[1]);
    const marginX = 2;
    const marginY = 3;
    const minX = Math.min(...xs) - marginX;
    const maxX = Math.max(...xs) + marginX;
    const minY = Math.min(...ys) - marginY;
    const maxY = Math.max(...ys) + marginY;
    const length = maxX - minX;
    const height = maxY - minY;

    const densities: { [key: number]: number } = {};

    for (let i = 1; i < 6; i++) {
        for (let j = 1; j < 4; j++) {
            const points = [];
            allPoints.forEach(([x, y, z]) => {
                if (x >= minX + length * (i - 1) / 5 && x < minX + length * i / 5 &&
                    y >= minY + height * (j - 1) / 3 && y < minY + height * j / 3) {
                    points.push([x, y, z]);
                }
            });
            densities[points.length] = (densities[points.length] || 0) + 1;
        }
    }
    
    let mode = 0;
    Object.entries(densities).forEach(([pointCount, count]) => {
        if (count > densities[mode] || densities[mode] === undefined) {
            mode = parseInt(pointCount);
        }
    });

    if (mode === 0) {
        mode = 1;
    }

    const density = 7 / mode;    

    const [zMultiplier, setZMultiplier] = useState(15);
    const [minRadius, setMinRadius] = useState(7);
    const [maxRadius, setMaxRadius] = useState(25);
    const [xFactor, setXFactor] = useState(density);

    const [showMeshes, setShowMeshes] = useState(true);
    const [showLines, setShowLines] = useState(true);
    const [showPlanes, setShowPlanes] = useState(false);
    const [showPoints, setShowPoints] = useState(false);
    const [showHeatMap, setShowHeatMap] = useState(false);

    return (
        <div style={{ position: "fixed", inset: 0 }}>
            <SceneRenderer
                zMultiplier={zMultiplier}
                minRadius={minRadius}
                maxRadius={maxRadius}
                xFactor={xFactor}
                showMeshes={showMeshes}
                showLines={showLines}
                showPlanes={showPlanes}
                showPoints={showPoints}
                showHeatMap={showHeatMap}
                allPoints={allPointsForVisualization}
                line_order={line_order}
            />
            <ControlsPanel
                zMultiplier={zMultiplier} setZMultiplier={setZMultiplier}
                minRadius={minRadius} setMinRadius={setMinRadius}
                maxRadius={maxRadius} setMaxRadius={setMaxRadius}
                xFactor={xFactor} setXFactor={setXFactor}
                showMeshes={showMeshes} setShowMeshes={setShowMeshes}
                showLines={showLines} setShowLines={setShowLines}
                showPlanes={showPlanes} setShowPlanes={setShowPlanes}
                showPoints={showPoints} setShowPoints={setShowPoints}
                showHeatMap={showHeatMap} setShowHeatMap={setShowHeatMap}
            />
        </div>
    );
}