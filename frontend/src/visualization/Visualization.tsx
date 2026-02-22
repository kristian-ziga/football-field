import { useState } from "react";
import ControlsPanel from "./ControlPanel";
import SceneRenderer from "./SceneRenderer";
import { useAppStorage } from "./StorageProvider";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import {Link} from "react-router-dom";

export default function Visualization() {
    const [zMultiplier, setZMultiplier] = useState(15);
    const [minRadius, setMinRadius] = useState(7);
    const [maxRadius, setMaxRadius] = useState(25);
    const [xFactor, setXFactor] = useState(5);

    const [showMeshes, setShowMeshes] = useState(true);
    const [showLines, setShowLines] = useState(true);
    const [showPlanes, setShowPlanes] = useState(false);
    const [showPoints, setShowPoints] = useState(false);
    const [showHeatMap, setShowHeatMap] = useState(false);

    const { getAllPoints } = useAppStorage();

    const allPoints = getAllPoints();

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
                allPoints={allPoints}
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