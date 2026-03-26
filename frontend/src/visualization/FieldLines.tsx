import * as THREE from "three";

export function createLine(
    start: number[],
    end: number[],
    needsLonger: boolean,
    getInterpolatedHeight: (x: number, z: number) => number,
    zMultiplier: number,
    color?: number,
    yOffset?: number
): THREE.Mesh {
    let [x1, z1] = start;
    let [x2, z2] = end;

    if (needsLonger) {
        x1 += 0.4;
        x2 -= 0.4;
    }

    const width = 0.8;
    const offsetY = yOffset ?? 0.075;
    const segmentsPerUnit = 3;
    const minSegments = 2;
    const maxSegments = 200;
    const widthSegments = 3;

    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.hypot(dx, dz);

    const lengthSegments = Math.min(
        maxSegments,
        Math.max(minSegments, Math.ceil(length * segmentsPerUnit))
    );

    const geometry = new THREE.PlaneGeometry(length, width, lengthSegments, widthSegments);
    geometry.rotateX(-Math.PI / 2);

    // important minus
    const angle = -Math.atan2(dz, dx);
    geometry.rotateY(angle);

    const centerX = (x1 + x2) / 2;
    const centerZ = (z1 + z2) / 2;
    geometry.translate(centerX, 0, centerZ);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setY(i, getInterpolatedHeight(x, z) * zMultiplier + offsetY);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
        color: color || 0xffffff,
        side: THREE.DoubleSide,
    });

    return new THREE.Mesh(geometry, material);
}

export function createCircle(
    p1: number[],
    p2: number[],
    getInterpolatedHeight: (x: number, z: number) => number,
    zMultiplier: number,
    color?: number,
    yOffset?: number
): THREE.Mesh {
    const [x1, z1] = p1;
    const [x2, z2] = p2;

    const thetaSegments = 100;
    const width = 0.4;
    const offsetY = yOffset ?? 0.05;

    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.hypot(dx, dz);

    const circle = new THREE.RingGeometry(
        length / 2 - width,
        length / 2 + width,
        thetaSegments,
        3
    );
    circle.rotateX(-Math.PI / 2);

    const centerX = (x1 + x2) / 2;
    const centerZ = (z1 + z2) / 2;
    circle.translate(centerX, 0, centerZ);

    const pos = circle.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setY(i, getInterpolatedHeight(x, z) * zMultiplier + offsetY);
    }

    pos.needsUpdate = true;
    circle.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: color || 0xffffff,
    });

    return new THREE.Mesh(circle, material);
}

export function createCurvedArc(
    p1: number[],
    p2: number[],
    direction: boolean,
    getInterpolatedHeight: (x: number, z: number) => number,
    zMultiplier: number,
    color?: number,
    yOffset?: number
): THREE.Mesh {
    const [x1, z1] = p1;
    const [x2, z2] = p2;

    const width = 0.8;
    const offsetY = yOffset ?? 0.05;
    const arcHeight = 6;

    const start = new THREE.Vector3(x1, 0, z1);
    const end = new THREE.Vector3(x2, 0, z2);

    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;

    const dx = x2 - x1;
    const dz = z2 - z1;
    const offset = direction ? -arcHeight : arcHeight;

    const control = new THREE.Vector3(
        midX - (dz / Math.hypot(dx, dz)) * offset,
        0,
        midZ + (dx / Math.hypot(dx, dz)) * offset
    );

    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    const geometry = new THREE.TubeGeometry(curve, 35, width / 2, 4, false);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setY(i, getInterpolatedHeight(x, z) * zMultiplier + offsetY);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
        color: color || 0xffffff,
        side: THREE.DoubleSide,
    });

    return new THREE.Mesh(geometry, material);
}

export function createPenaltyPoint(
    position: number[],
    getInterpolatedHeight: (x: number, z: number) => number,
    zMultiplier: number,
    color?: number,
    yOffset?: number
): THREE.Mesh {
    const [x, z] = position;

    const thetaSegments = 30;
    const numSegments = 5;
    const radius = 1;
    const offsetY = yOffset ?? 0.05;

    const circle = new THREE.RingGeometry(0, radius, thetaSegments, numSegments);
    circle.rotateX(-Math.PI / 2);
    circle.translate(x, 0, z);

    const pos = circle.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setY(i, getInterpolatedHeight(x, z) * zMultiplier + offsetY);
    }

    pos.needsUpdate = true;
    circle.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
        color: color || 0xffffff,
        side: THREE.DoubleSide,
    });

    return new THREE.Mesh(circle, material);
}