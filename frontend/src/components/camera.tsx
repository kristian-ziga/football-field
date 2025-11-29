import {useEffect, useRef} from "react";

export default function Camera() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    function roundTriangle(ctx: CanvasRenderingContext2D, height: number, middle: number, radius: number) {
        // Calculate side length for equilateral triangle
        const sideLength = (2 * height) / Math.sqrt(3);

        // Triangle points
        const p1 = { x: middle - sideLength / 2, y: 0 };
        const p2 = { x: middle + sideLength / 2, y: 0 };
        const p3 = { x: middle, y: height };

        ctx.beginPath();

        // Start at top-left
        ctx.moveTo(p1.x + radius, p1.y);

        // Top edge → top-right
        ctx.lineTo(p2.x - radius, p2.y);
        ctx.quadraticCurveTo(p2.x, p2.y, p2.x, p2.y + radius);

        // Right side → bottom tip
        ctx.lineTo(p3.x + radius, p3.y);
        ctx.quadraticCurveTo(p3.x, p3.y, p3.x - radius, p3.y);

        // Left side → back to top-left
        ctx.lineTo(p1.x, p1.y + radius);
        ctx.quadraticCurveTo(p1.x, p1.y, p1.x + radius, p1.y);

        ctx.closePath();

        ctx.fillStyle = "#e4e4e4";
        ctx.fill();
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = "#e4e4e4";
        ctx.beginPath();
        ctx.roundRect(0, height * 0.2, width, height * 0.75, 10);
        ctx.fill();

        roundTriangle(ctx, height * 0.25, width / 2, 5);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                height: "clamp(2rem, 9vh, 7rem)",
                display: "block",
            }}
            width={50}
            height={90}
        />
    );
}