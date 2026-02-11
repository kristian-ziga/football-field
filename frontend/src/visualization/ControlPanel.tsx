import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

interface ControlsPanelProps {
    zMultiplier: number;
    setZMultiplier: (v: number) => void;
    minRadius: number;
    setMinRadius: (v: number) => void;
    maxRadius: number;
    setMaxRadius: (v: number) => void;
    xFactor: number;
    setXFactor: (v: number) => void;
    showMeshes: boolean;
    setShowMeshes: (v: boolean) => void;
    showLines: boolean;
    setShowLines: (v: boolean) => void;
    showHeatMap: boolean;
    setShowHeatMap: (v: boolean) => void;
    showPlanes: boolean;
    setShowPlanes: (v: boolean) => void;
    showPoints: boolean;
    setShowPoints: (v: boolean) => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
    zMultiplier, setZMultiplier,
    minRadius, setMinRadius,
    maxRadius, setMaxRadius,
    xFactor, setXFactor,
    showMeshes, setShowMeshes,
    showLines, setShowLines,
    showHeatMap, setShowHeatMap,
    showPlanes, setShowPlanes,
    showPoints, setShowPoints,
}) => (
    <div
        style={{
        position: "absolute",
        top: 10,
        right: 10,
        background: "rgba(255,255,255,0.8)",
        color: "#000",
        padding: "10px",
        borderRadius: "8px",
        zIndex: 10,
        }}
    >
        <label>
        Z Multiplier: {zMultiplier}
        <input
            type="range"
            min={1} max={40}
            value={zMultiplier}
            onChange={(e) => setZMultiplier(Number(e.target.value))}
        />
        </label>
        <br />
        <label>
        Min Radius: {minRadius}
        <input
            type="range"
            min={1} max={20}
            value={minRadius}
            onChange={(e) => setMinRadius(Number(e.target.value))}
        />
        </label>
        <br />
        <label>
        Max Radius: {maxRadius}
        <input
            type="range"
            min={5} max={100}
            value={maxRadius}
            onChange={(e) => setMaxRadius(Number(e.target.value))}
        />
        </label>
        <br />
        <label>
        X Factor: {xFactor}
        <input
            type="range"
            min={1} max={20}
            value={xFactor}
            onChange={(e) => setXFactor(Number(e.target.value))}
        />
        </label>
        <br />
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: "15px", marginRight: "15px"}}>
            <div>
                <label>
                <input type="checkbox" checked={showMeshes} onChange={e => { setShowMeshes(e.target.checked); setShowHeatMap(false); }} />
                Show Grass
                </label><br />
                <label>
                <input type="checkbox" checked={showLines} onChange={e => setShowLines(e.target.checked)} />
                Show Lines
                </label><br />
                <label>
                <input type="checkbox" checked={showHeatMap} onChange={e => { setShowHeatMap(e.target.checked); setShowMeshes(false); }} />
                Show HeatMap
                </label><br />
                <label>
                <input type="checkbox" checked={showPlanes} onChange={e => setShowPlanes(e.target.checked)} />
                Show Planes
                </label><br />
                <label>
                <input type="checkbox" checked={showPoints} onChange={e => setShowPoints(e.target.checked)} />
                Show Points
                </label>
            </div>
            <div
                style={{
                width: "50px",
                height: "120px",
                background: "linear-gradient(to top," +
                    Array.from({ length: 20 }, (_, i) => {
                    const t = i / 19;
                    const hue = 0.44 - 0.37 * t;
                    const light = 0.10 + 0.5 * t;
                    const color = new THREE.Color();
                    color.setHSL(hue, 0.75, light);
                    return `#${color.getHexString()} ${Math.round(t * 100)}%`;
                    }).join(",") +
                ")",
                border: "2px solid #fff",
                borderRadius: "10px",
                }}
            />
        </div>
        <Button 
            variant="contained"
            onClick={() => useNavigate()("/visualization")}
            sx={{
                width: "clamp(7rem, 15vw, 20rem)",
                height: "clamp(2rem, 6vh, 10rem)",
                padding: "1rem",
                fontSize: "clamp(1.2rem, 8vw, 2.5rem)",
                whiteSpace: "normal",
                textAlign: "center",
                border: "1px solid",
                justifyContent: "center",
            }}>
            NEXT
        </Button>
    </div>
);

export default ControlsPanel;