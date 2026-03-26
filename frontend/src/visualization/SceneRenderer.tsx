import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PCA } from "ml-pca";

import {
  createLine,
  createCircle,
  createCurvedArc,
  createPenaltyPoint
} from "./FieldLines";
import { firstValue, lineOrder, type LineValidation, secondValue, touchlineValue } from "../pages/MeasurementValidation";
import { useAppStorage } from "./StorageProvider";

interface SceneRendererProps {
    zMultiplier: number;
    minRadius: number;
    maxRadius: number;
    xFactor: number;
    showMeshes: boolean;
    showLines: boolean;
    showPlanes: boolean;
    showPoints: boolean;
    showHeatMap: boolean;
    allPoints: number[][];
    line_order: number[][];
}

const SceneRenderer: React.FC<SceneRendererProps> = ({
    zMultiplier,
    minRadius,
    maxRadius,
    xFactor,
    showMeshes,
    showLines,
    showPlanes,
    showPoints,
    showHeatMap,
    allPoints,
    line_order,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const dataRef = useRef<any>(null);
    const { setSceneData } = useAppStorage();

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 80, -120);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        scene.add(new THREE.DirectionalLight(0xffffff, 1));
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // --- Shift points ---
        const shiftedPoints = allPoints.map(([x, y, z]) => [x, y, z]);

        const heights = shiftedPoints.map(p => p[2]);
        const minHeight = Math.min(...heights);
        const maxHeight = Math.max(...heights);

        const tol = 2;
        const leftPoints = shiftedPoints.filter(p => p[1] <= tol);
        const rightPoints = shiftedPoints.filter(p => p[1] >= -tol);

        const leftPointsScene = leftPoints.map(([x, y, z]) => [x, z * zMultiplier, y]);
        const rightPointsScene = rightPoints.map(([x, y, z]) => [x, z * zMultiplier, y]);

        // --- PCA planes ---
        function getPCAPlane(points: number[][]) {
            const pca = new PCA(points);
            const eigenvectors = pca.getEigenvectors();
            const eigenvalues = pca.getEigenvalues();
            const smallestIdx = eigenvalues.indexOf(Math.min(...eigenvalues));
            const normal = new THREE.Vector3(
                eigenvectors.get(0, smallestIdx),
                eigenvectors.get(1, smallestIdx),
                eigenvectors.get(2, smallestIdx)
            ).normalize();
            const centroid = points.reduce((acc, p) => acc.map((v, i) => v + p[i]), [0, 0, 0]).map(v => v / points.length);
            const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(...centroid));
            return { normal, centroid, plane };
        }

        const leftPlane = getPCAPlane(leftPointsScene);
        const rightPlane = getPCAPlane(rightPointsScene);

        function createPlaneMesh(planeData: { normal: THREE.Vector3; centroid: number[] }, color: number) {
            const geometry = new THREE.PlaneGeometry(120, 80, 40, 40);
            const material = new THREE.MeshStandardMaterial({
                color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), planeData.normal);
            mesh.setRotationFromQuaternion(quaternion);
            mesh.position.x = planeData.centroid[0];
            mesh.position.y = planeData.centroid[1];
            mesh.position.z = planeData.centroid[2];
            if (showPlanes) scene.add(mesh);
        }

        createPlaneMesh(leftPlane, 0xff0000);
        createPlaneMesh(rightPlane, 0x0000ff);

        const xs = shiftedPoints.map(p => p[0]);
        const ys = shiftedPoints.map(p => p[1]);
        const marginX = 3;
        const marginY = 4;
        const minX = Math.min(...xs) - marginX;
        const maxX = Math.max(...xs) + marginX;
        const minY = Math.min(...ys) - marginY;
        const maxY = Math.max(...ys) + marginY;
        const width = maxX - minX;
        const depth = maxY - minY;
        const segments = 120;

        function sceneToIDW([x, yScene, zScene]: number[]) {
            return [x, -zScene, yScene / zMultiplier];
        }

        function generatePlaneConstraintPointsScene(planeData: { normal: THREE.Vector3; plane: THREE.Plane }, zScene: number[], xRange: [number, number]) {
            const points: number[][] = [];
            for (let zVal of zScene) {
                for (let x = xRange[0]; x <= xRange[1]; x += 4) {
                    const y = (-planeData.normal.x * x - planeData.normal.z * zVal - planeData.plane.constant) / planeData.normal.y;
                    points.push([x, y, zVal]);
                }
            }
            return points;
        }

        const fakeLeft = generatePlaneConstraintPointsScene(leftPlane, [minY - 5, minY - 10], [minX + marginX, maxX - marginX]).map(sceneToIDW);
        const fakeRight = generatePlaneConstraintPointsScene(rightPlane, [maxY + 5, maxY + 10], [minX + marginX, maxX - marginX]).map(sceneToIDW);

        function positionOnPitch(y: number) {
            if (y > 0) return 1;
            if (y < 0) return -1;
            return 0;
        }

        function getInterpolatedHeight(x: number, z: number) {
            let num = 0, den = 0;
            const power = 2;
            const lanePos = positionOnPitch(z);

            for (const [bx, by, bz] of shiftedPoints) {
                const dx = (x - bx) / xFactor;
                const dz = z - by;
                let dist = Math.sqrt(dx * dx + dz * dz);
                if (dist < minRadius) dist = minRadius;
                if (dist > maxRadius) continue;
                const w = 1 / Math.pow(dist, power);
                num += bz * w;
                den += w;
            }

            if (shiftedPoints.length > 31 && maxRadius <= 45) {
                const extraPoints = lanePos <= 0 ? fakeRight : fakeLeft;
                for (const [bx, by, bz] of extraPoints) {
                    const dx = (x - bx) / xFactor;
                    const dz = z - by;
                    let dist = Math.sqrt(dx * dx + dz * dz);
                    if (dist < minRadius) dist = minRadius;
                    if (dist > maxRadius) continue;
                    const w = 1 / Math.pow(dist, power);
                    num += bz * w;
                    den += w * 1.2;
                }
            }

            return den > 0 ? num / den : 0;
        }

        function createIDWSurface() {
            const geometry = new THREE.PlaneGeometry(width, depth, segments * 2, segments);
            geometry.rotateX(-Math.PI / 2);

            const pos = geometry.attributes.position as THREE.BufferAttribute;

            for (let i = 0; i < pos.count; i++) {
                pos.setY(i, getInterpolatedHeight(pos.getX(i), pos.getZ(i)) * zMultiplier);
            }

            pos.needsUpdate = true;
            geometry.computeVertexNormals();

            const colors = new Float32Array(pos.count * 3);
            geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

            return new THREE.Mesh(
                geometry,
                new THREE.MeshPhongMaterial({
                    vertexColors: true,
                    side: THREE.DoubleSide,
                    shininess: 20
                })
            );
        }

        const smoothMesh = createIDWSurface();
        function updateSurfaceColors(useHeatMap: boolean) {
            const pos = smoothMesh.geometry.attributes.position as THREE.BufferAttribute;
            const colorAttr = smoothMesh.geometry.attributes.color as THREE.BufferAttribute;

            const minYScaled = minHeight * zMultiplier;
            const maxYScaled = maxHeight * zMultiplier;
            const denom = maxYScaled - minYScaled || 1;

            for (let i = 0; i < pos.count; i++) {
                const y = pos.getY(i);

                if (useHeatMap) {
                    const t = (y - minYScaled) / denom;
                    const color = new THREE.Color();
                    color.setHSL(0.44 - 0.37 * t, 0.75, 0.1 + 0.5 * t);
                    colorAttr.setXYZ(i, color.r, color.g, color.b);
                } else {
                    colorAttr.setXYZ(i, 0.08, 0.45, 0.08);
                }
            }

            colorAttr.needsUpdate = true;
        }
        updateSurfaceColors(showHeatMap);
        if (showMeshes || showHeatMap) scene.add(smoothMesh);

        function drawLines() {
            let counter = 0;
            for (const points of line_order) {
                const mesh = createLine(
                    shiftedPoints[points[0]],
                    shiftedPoints[points[1]],
                    counter < 12,
                    getInterpolatedHeight,
                    zMultiplier
                );
                scene.add(mesh);
                counter++;
            }

            scene.add(createCircle(shiftedPoints[14], shiftedPoints[16], getInterpolatedHeight, zMultiplier));

            scene.add(createCurvedArc(shiftedPoints[10], shiftedPoints[11], true, getInterpolatedHeight, zMultiplier));
            scene.add(createCurvedArc(shiftedPoints[19], shiftedPoints[20], false, getInterpolatedHeight, zMultiplier));

            scene.add(createPenaltyPoint(shiftedPoints[8], getInterpolatedHeight, zMultiplier));
            scene.add(createPenaltyPoint(shiftedPoints[15], getInterpolatedHeight, zMultiplier));
            scene.add(createPenaltyPoint(shiftedPoints[22], getInterpolatedHeight, zMultiplier));
        }

        if (showLines) drawLines();

        // --- Points ---
        if (showPoints) {
            shiftedPoints.forEach(([x, y, _]) => {
                const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
                sphere.position.set(x, getInterpolatedHeight(x, y) * zMultiplier, y);
                scene.add(sphere);
            });
        }

        sceneRef.current = scene;
        rendererRef.current = renderer;

        dataRef.current = {
            shiftedPoints,
            getInterpolatedHeight,
            zMultiplier,
            minX,
            maxX,
            minY,
            maxY,
            width,
            depth,
            minHeight,
            maxHeight,
            smoothMesh,
            renderer,
            scene
        };


        setSceneData(dataRef);

        // --- Animate ---
        let animating = true;
        const animate = () => {
            if (!animating) return;
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // --- Resize ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            animating = false;
            window.removeEventListener("resize", handleResize);
        };
    }, [
        allPoints,
        line_order,
        zMultiplier,
        minRadius,
        maxRadius,
        xFactor,
        showMeshes,
        showLines,
        showPlanes,
        showPoints,
        showHeatMap
    ]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};


export default SceneRenderer;

export const exportTopViewImages = async (
    linesToRed: LineValidation[],
    dataRef: React.RefObject<any>,
    setTopViewImage: (image: string | null) => void,
    setTopViewHeatmapImage: (image: string | null) => void
) => {
    console.log("Exporting top view images...");
    const data = dataRef.current;
    if (!data) return;

    const {
        scene,
        renderer,
        shiftedPoints,
        getInterpolatedHeight,
        zMultiplier,
        minX,
        maxX,
        minY,
        maxY,
        width,
        depth,
        minHeight,
        maxHeight,
        smoothMesh
    } = data;

    const updateSurfaceColors = (useHeatMap: boolean) => {
        if (!smoothMesh) return;
        const pos = smoothMesh.geometry.attributes.position as THREE.BufferAttribute;
        const colorAttr = smoothMesh.geometry.attributes.color as THREE.BufferAttribute;

        const minYScaled = minHeight * zMultiplier;
        const maxYScaled = maxHeight * zMultiplier;
        const denom = maxYScaled - minYScaled || 1;

        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);

            if (useHeatMap) {
                const t = (y - minYScaled) / denom;
                const color = new THREE.Color();
                color.setHSL(0.44 - 0.37 * t, 0.75, 0.1 + 0.5 * t);
                colorAttr.setXYZ(i, color.r, color.g, color.b);
            } else {
                colorAttr.setXYZ(i, 0.08, 0.45, 0.08);
            }
        }

        colorAttr.needsUpdate = true;
    };

    const lineMap = Object.fromEntries(lineOrder.map(l => [l.name, l]));

    const getLineRenderOrder = (name: string, outOfTolerance: boolean): number => {
        if (outOfTolerance) return 10;
        if (name.includes("Goal Line") || name.includes("Goal Area")) return 3;
        if (name.includes("Penalty Area") || name.includes("Penalty Arc")) return 2;
        return 1;
    };

    const addToScene = (mesh: THREE.Mesh, name: string, outOfTolerance: boolean) => {
        const order = getLineRenderOrder(name, outOfTolerance);
        mesh.renderOrder = order;
        (mesh.material as THREE.MeshBasicMaterial).depthTest = false;
        scene.add(mesh);
    };

    linesToRed.filter(line =>
        line.name !== "Upper Touchline With Middle" &&
        line.name !== "Lower Touchline With Middle"
    )
    .map((line) => {
        const statusText = line.name.includes("Upper Touchline")
            ? touchlineValue(line, linesToRed.find(l => l.name === "Upper Touchline With Middle"))
            : line.name.includes("Lower Touchline")
            ? touchlineValue(line, linesToRed.find(l => l.name === "Lower Touchline With Middle"))
            : `${firstValue(line)}, ${secondValue(line)}`;

        const isOutOfTolerance = statusText.includes("Out of tolerance");
        const color = isOutOfTolerance ? 0xff0000 : 0xffffff;

        if (line.name.includes("Point")) {
            const point = lineMap[line.name].points[0];
            if (!point){
                return;
            }
            addToScene(createPenaltyPoint(shiftedPoints[point], getInterpolatedHeight, zMultiplier, color), line.name, isOutOfTolerance);
        }
        else if (line.name.includes("Circle")) {
            const points = lineMap[line.name].points;
            if (!points || points.length < 3) {
                return;
            }
            addToScene(createCircle(shiftedPoints[points[1]], shiftedPoints[points[2]], getInterpolatedHeight, zMultiplier, color), line.name, isOutOfTolerance);
        } 
        else if (line.name.includes("Arc")) {
            const points = lineMap[line.name].points;
            if (!points || points.length < 3) {
                return;
            }
            const direction = line.name.includes("Left Penalty Arc") ? true : false;
            addToScene(createCurvedArc(
                shiftedPoints[points[1]],
                shiftedPoints[points[2]],
                direction,
                getInterpolatedHeight,
                zMultiplier,
                color
            ), line.name, isOutOfTolerance);
        }
        else {
            const points = lineMap[line.name].points;
            if (!points || points.length < 2) {
                return;
            }
            addToScene(createLine(
                shiftedPoints[points[0]],
                shiftedPoints[points[1]],
                false,
                getInterpolatedHeight,
                zMultiplier,
                color
            ), line.name, isOutOfTolerance);
        }

    });
    
    const imageWidth = 1400;
    const imageHeight = 900;

    const aspect = imageWidth / imageHeight;
    const frustumSize = Math.max(width, depth) * 0.8;

    const topCamera = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        1000
    );

    const centerX = (minX + maxX) / 2;
    const centerZ = (minY + maxY) / 2;
    const maxSurfaceY = maxHeight * zMultiplier;

    topCamera.position.set(centerX, maxSurfaceY + 200, centerZ);
    topCamera.up.set(0, 0, -1);
    topCamera.lookAt(centerX, 0, centerZ);
    topCamera.updateProjectionMatrix();

    const renderTarget = new THREE.WebGLRenderTarget(imageWidth, imageHeight, {
        samples: 4
    });

    const pixels = new Uint8Array(imageWidth * imageHeight * 4);
    const helperCanvas = document.createElement("canvas");
    helperCanvas.width = imageWidth;
    helperCanvas.height = imageHeight;
    const ctx = helperCanvas.getContext("2d");
    if (!ctx) return;

    console.log("Rendering top view images...");

    const saveRenderToImage = async (isHeatmap: boolean) => {
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, topCamera);
        renderer.readRenderTargetPixels(
            renderTarget,
            0,
            0,
            imageWidth,
            imageHeight,
            pixels
        );
        renderer.setRenderTarget(null);

        const imageData = ctx.createImageData(imageWidth, imageHeight);

        for (let y = 0; y < imageHeight; y++) {
            for (let x = 0; x < imageWidth; x++) {
                const src = ((imageHeight - 1 - y) * imageWidth + x) * 4;
                const dst = (y * imageWidth + x) * 4;

                imageData.data[dst] = pixels[src];
                imageData.data[dst + 1] = pixels[src + 1];
                imageData.data[dst + 2] = pixels[src + 2];
                imageData.data[dst + 3] = pixels[src + 3];
            }
        }

        ctx.putImageData(imageData, 0, 0);

        const dataUrl = helperCanvas.toDataURL("image/png");

        if (isHeatmap) {
            setTopViewHeatmapImage(dataUrl);
        } else {
            setTopViewImage(dataUrl);
        }
    };
    console.log("Saving top view images...");

    const originalVisible = smoothMesh.visible;

    smoothMesh.visible = true;
    const exportLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(exportLight);

    updateSurfaceColors(false);
    await saveRenderToImage(false);

    updateSurfaceColors(true);
    await saveRenderToImage(true);

    scene.remove(exportLight);
    smoothMesh.visible = originalVisible;

    renderTarget.dispose();
    console.log("Top view images exported.");
};