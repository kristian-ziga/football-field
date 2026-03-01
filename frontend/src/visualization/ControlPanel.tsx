import { Button, Slider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { useAppStorage } from "./StorageProvider";

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
}) => {
    const navigate = useNavigate();

    const { getAllPoints } = useAppStorage();

    const allPoints = getAllPoints();

    const minRadiusMax = allPoints.length > 50 ? 15 : 7;

    const lowestPoint = Math.min(...allPoints.map(([_, __, z]) => z)) * 100;
    const highestPoint = Math.max(...allPoints.map(([_, __, z]) => z)) * 100;

    return (
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight:"0.15rem" }}>
                    <span style={{ flexShrink: 0 }}>Z Multiplier: {zMultiplier}</span>
                    <Slider
                        value={zMultiplier}
                        min={1}
                        max={30}
                        onChange={(_, value) => setZMultiplier(value)}
                        style={{ flexGrow: 1 }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight:"0.15rem" }}>
                    <span style={{ flexShrink: 0 }}>Min Radius: {minRadius}</span>
                    <Slider
                        value={minRadius}
                        min={1}
                        max={minRadiusMax}
                        onChange={(_, value) => setMinRadius(value)}
                        style={{ flexGrow: 1 }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight:"0.15rem" }}>
                    <span style={{ flexShrink: 0 }}>Max Radius: {maxRadius}</span>
                    <Slider
                        value={maxRadius}
                        min={9}
                        max={40}
                        onChange={(_, value) => setMaxRadius(value)}
                        style={{ flexGrow: 1 }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight:"0.15rem" }}>
                    <span style={{ flexShrink: 0 }}>X-axis weight: {xFactor}</span>
                    <Slider
                        value={xFactor}
                        min={1}
                        max={10}
                        onChange={(_, value) => setXFactor(value)}
                        style={{ flexGrow: 1 }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "2rem" }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={showMeshes} onChange={e => { setShowMeshes(e.target.checked); setShowHeatMap(false); }} />
                        Show Grass
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={showLines} onChange={e => setShowLines(e.target.checked)} />
                        Show Lines
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={showHeatMap} onChange={e => { setShowHeatMap(e.target.checked); setShowMeshes(false); }} />
                        Show HeatMap
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={showPlanes} onChange={e => setShowPlanes(e.target.checked)} />
                        Show Planes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={showPoints} onChange={e => setShowPoints(e.target.checked)} />
                        Show Points
                    </label>
                </div>
                <div
                    style={{
                        position: "relative",
                        width: "70px",
                        height: "120px",
                        paddingBottom: "5px"
                    }}
                >
                    <div
                        style={{
                            width: "70px",
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

                    <div style={{
                        justifyContent: "center"
                    }}>
                        <div
                            style={{
                                position: "absolute",
                                right: "15%",
                                top: "4px",
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "#0e1e4c",
                            }}
                        >
                            {highestPoint.toFixed(1)} cm
                        </div>

                        <div
                            style={{
                                position: "absolute",
                                right: "15%",
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "#0e1e4c",
                            }}
                        >
                            {((highestPoint + lowestPoint) / 2).toFixed(1)} cm
                        </div>

                        <div
                            style={{
                                position: "absolute",
                                right: "15%",
                                bottom: "4px",
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "#0e1e4c",
                            }}
                        >
                            {lowestPoint.toFixed(1)} cm
                        </div>
                    </div>
                </div>
            </div>
            <Button
                variant="contained"
                onClick={() => navigate("/measurementValidation")}
                sx={{
                    width: "100%",
                    height: "clamp(2rem, 6vh, 10rem)",
                    padding: "1rem",
                    fontSize: "clamp(1.2rem, 8vw, 2.5rem)",
                    whiteSpace: "normal",
                    textAlign: "center",
                    border: "1px solid",
                    justifyContent: "center",
                }}
            >
                NEXT
            </Button>
        </div>
    );
};

export default ControlsPanel;