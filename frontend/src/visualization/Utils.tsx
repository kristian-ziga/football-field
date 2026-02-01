
export function csvParser(event: React.ChangeEvent<HTMLInputElement>): Promise<number[][]> {
    return new Promise((resolve, reject) => {
        const file = event.target.files?.[0];
        if (!file) {
            reject(new Error("No file selected"));
            return;
        }

        const points: number[][] = [];
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const text = reader.result as string;
                const lines = text.split("\n");

                lines.forEach((line, index) => {
                    const trimmed = line.trim();
                    if (!trimmed) return;

                    const parts = trimmed.split(",");
                    if (parts.length < 4) {
                        console.warn(`Line ${index + 1} skipped: not enough columns`);
                        return;
                    }

                    const x = parseFloat(parts[1]);
                    const y = parseFloat(parts[2]);
                    const z = parseFloat(parts[3]);

                    if (isNaN(x) || isNaN(y) || isNaN(z)) {
                        console.warn(`Line ${index + 1} skipped: invalid number`);
                        return;
                    }

                    points.push([x, y, z]);
                });

                resolve(points);
            } catch (err) {
                reject(new Error(`Failed to parse CSV: ${(err as Error).message}`));
            }
        };

        reader.onerror = () => {
            reject(new Error("Error reading file"));
        };

        reader.readAsText(file);
    });
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