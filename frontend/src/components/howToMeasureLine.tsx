import {useEffect, useRef} from "react";

export default function HowToMeasureLine() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = "#3A6F43";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#ffffff";
        const lineWidth = Math.min(width, height) * 0.25;

        ctx.fillRect(0, height / 2 - lineWidth / 2, width, lineWidth);
        ctx.fillRect(width / 2 - lineWidth / 2, 0, lineWidth, height/2);

        ctx.fillStyle = "#b40f09";
        const radius = Math.min(width, height) * 0.05;
        ctx.beginPath();
        ctx.arc(width/2, height/2, radius, 0, 2*Math.PI);
        ctx.fill();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                minWidth: "10rem",
                maxWidth: "60vh",
                height: "auto",
                display: "block",
            }}
            width={800}
            height={500}
        />
    );
}