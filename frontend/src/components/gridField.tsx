import { useRef, useEffect } from "react";
import FootballField from "./footballField.tsx";

export default function GridField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width * 0.95;
        let height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Horizontal lines
        ctx.fillStyle = "#afacac";
        const lineWidth = width * 0.005;
        width -= lineWidth;
        height -= lineWidth;

        const gapHorizontal = height / 10;

        for (let i = 0; i < 11; i++) {
            ctx.fillRect(0, i * lineWidth + i * gapHorizontal, canvas.width - lineWidth, lineWidth);
        }
        // Vertical lines
        const gapVertical = width / 10;
        for (let i = 0; i < 11; i++) {
            ctx.fillRect(i * lineWidth + i * gapVertical, 0, lineWidth, height);
        }
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: "100vw",
                maxWidth: "81rem",
                height: "auto",
                margin: "0 auto",
                justifyContent: "center",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                paddingTop: "0.5vh",
            }}
        >
            {/* Football field layer */}
            <div
                style={{
                    top: 0,
                    left: 0,
                }}
            >
                <FootballField ord={-10} />
            </div>

            {/* Grid layer */}
            <canvas
                ref={canvasRef}
                width={1400}
                height={640}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                }}
            />
        </div>
    );
}