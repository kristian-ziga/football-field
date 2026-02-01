
export function csvParser(text: string): number[][] {
    const points: number[][] = [];
    
    const lines = text.split("\n");

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const parts = trimmed.split(",");
        if (parts.length < 3) {
            console.warn(`Line ${index + 1} skipped: not enough columns`);
            console.warn(parts);
            return;
        }

        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        const z = parseFloat(parts[2]);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            console.warn(`Line ${index + 1} skipped: invalid number`);
            return;
        }

        points.push([x, y, z]);
    });
    return points;
}

export function transformPoints(points: number[][]) {
    const transformedPoints = [];

    const diffX = points[15][0];
    const diffY = points[15][1];
    const diffZ = points[15][2];

    points.forEach(point => {
        const [x, y, z] = point;
        transformedPoints.push([x - diffX, y - diffY, z - diffZ])
    })


}