import { useState } from "react";
import ControlsPanel from "./ControlPanel";
import SceneRenderer from "./SceneRenderer";
import { useAppStorage } from "./StorageProvider";
import { csvParser } from "./Utils";

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

    const { addFile, setList, mainPointsFile, points } = useAppStorage();

    fetch("/ZS_NFŠ_meranie_01-12-2025_LOKAL_MM.csv")
    .then(res => res.text())
    .then(text => {
        addFile({ name: "test.csv", content: text }, true);

        // optional: parse points immediately
        const points = csvParser(text);
        setList(points);
    })
    .catch(err => console.error("CSV load failed:", err));

    

    const allPoints = points;


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

    return (
        <div>
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