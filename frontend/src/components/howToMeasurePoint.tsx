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
        const radius1 = Math.min(width, height) * 0.25;
        ctx.beginPath();
        ctx.arc(width/2, height/2, radius1, 0, 2*Math.PI);
        ctx.fill();


        ctx.fillStyle = "#b40f09";
        const radius2 = Math.min(width, height) * 0.05;
        ctx.beginPath();
        ctx.arc(width/2, height/2, radius2, 0, 2*Math.PI);
        ctx.fill();
    }, []);

    return <canvas
        ref={canvasRef}
        style={{
            minWidth: "10rem",
            maxWidth: "60vh",
            height: "auto",
            display: "block",
        }}
        width={800}
        height={500}
    />;
}