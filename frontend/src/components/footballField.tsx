import {useEffect, useRef} from "react";

export default function FootballField({ ord }: { ord: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const spots = [
        
        [0, 1],
        [0, 0.75],
        [0, 0.6],
        [0, 0.4],
        [0, 0.25],
        [0, 0],

        [0.08, 0.4],
        [0.08, 0.6],

        [0.115, 0.5],

        [0.15, 0.25],
        [0.15, 0.36],
        [0.15, 0.64],
        [0.15, 0.75],

        [0.5, 1],
        [0.5, 0.68],
        [0.5, 0.5],
        [0.5, 0.32],
        [0.5, 0],

        [0.85, 0.25],
        [0.85, 0.36],
        [0.85, 0.64],
        [0.85, 0.75],

        [0.885, 0.5],

        [0.92, 0.4],
        [0.92, 0.6],

        [1, 1],
        [1, 0.75],
        [1, 0.6],
        [1, 0.4],
        [1, 0.25],
        [1, 0],
    ]


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const width  = canvas.width * 0.95;
        const height = canvas.height * 0.95;

        const xMove = width * 0.025;
        const yMove = height * 0.025;

        ctx.fillStyle = "#2cc845";
        ctx.fillRect(xMove, yMove, width, height);


        ctx.fillStyle = "#3A6F43";
        const segments = 7;
        const segmentWidth = width / segments;

        for (let i = 0; i < segments; i++) {
            ctx.fillRect(i * segmentWidth * 2 + xMove, yMove, segmentWidth - 1, height);
        }

        // ctx.fillStyle = "#ff0000";
        // ctx.fillRect(0, height / 2, width, 0.5);

        ctx.fillStyle = "#ffffff";
        const lineWidth = Math.min(width, height) * 0.04;

        //outlines
        ctx.fillRect(xMove, yMove, width, lineWidth);
        ctx.fillRect(xMove, yMove + height - lineWidth, width, lineWidth);

        ctx.fillRect(xMove, yMove, lineWidth, height);
        ctx.fillRect(xMove + width - lineWidth, yMove, lineWidth, height)

        //half line
        ctx.fillRect(xMove + width/2 - lineWidth/2, yMove, lineWidth, height);

        //left goal area
        ctx.fillRect(xMove, yMove + height * 0.4 - lineWidth/2, width * 0.08, lineWidth);
        ctx.fillRect(xMove, yMove + height * 0.6 - lineWidth/2, width * 0.08, lineWidth);
        ctx.fillRect(xMove + width * 0.08 - lineWidth, yMove + height * 0.4 - lineWidth/2, lineWidth, height * 0.6 - height * 0.4+ lineWidth);

        ctx.fillRect(xMove, yMove + height * 0.25 - lineWidth/2, width * 0.15, lineWidth);
        ctx.fillRect(xMove, yMove + height * 0.75 - lineWidth/2, width * 0.15, lineWidth);
        ctx.fillRect(xMove + width * 0.15 - lineWidth/2, yMove + height * 0.25 - lineWidth/2, lineWidth, height * 0.75 - height * 0.25 + lineWidth);

        const rad = Math.min(width, height) * 0.025;
        ctx.beginPath();
        ctx.arc(xMove + width * 0.115, yMove + height/2 , rad, 0, 2*Math.PI);
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.ellipse(
            xMove + width * 0.142,
            yMove + height / 2,
            Math.min(width, height) * 0.1 ,  // polomer X (šírka)
            Math.min(width, height) * 0.15,  // polomer Y (výška) — väčší = ovál
            0,
            -Math.PI / 2,
            Math.PI / 2
        );
        ctx.stroke();

        //right goal area
        ctx.fillRect(xMove + width * 0.92, yMove + height * 0.4 - lineWidth/2, width * 0.08, lineWidth);
        ctx.fillRect(xMove + width * 0.92, yMove + height * 0.6 - lineWidth/2, width * 0.08, lineWidth);
        ctx.fillRect(xMove + width * 0.92, yMove + height * 0.4 - lineWidth/2, lineWidth, height * 0.6 - height * 0.4+ lineWidth);

        ctx.fillRect(xMove + width * 0.85, yMove + height * 0.25 - lineWidth/2, width * 0.15, lineWidth);
        ctx.fillRect(xMove + width * 0.85, yMove + height * 0.75 - lineWidth/2, width * 0.15, lineWidth);
        ctx.fillRect(xMove + width * 0.85 - lineWidth/2, yMove + height * 0.25 - lineWidth/2, lineWidth, height * 0.75 - height * 0.25 + lineWidth);

        ctx.beginPath();
        ctx.arc(xMove + width * 0.885, yMove + height/2 , rad, 0, 2*Math.PI);
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.ellipse(
            xMove + width * 0.858,
            yMove + height / 2,
            Math.min(width, height) * 0.1 ,  // polomer X (šírka)
            Math.min(width, height) * 0.15,  // polomer Y (výška) — väčší = ovál
            0,
            Math.PI / 2,
            -Math.PI / 2
        );
        ctx.stroke();

        //mid circle
        ctx.strokeStyle = "white";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(xMove + width/2, yMove + height/2, Math.min(width, height) * 0.18, 0, Math.PI * 2);
        ctx.stroke();


        const radius = Math.min(width, height) * 0.04;
        ctx.beginPath();
        ctx.arc(xMove + width/2, yMove + height/2, radius, 0, 2*Math.PI);
        ctx.fill();

        if (ord === -10) {
            return;
        }

        if (ord === 0) {
            ctx.beginPath();
            ctx.strokeStyle = "#b40f09";
            ctx.lineWidth = 10;
            ctx.moveTo(xMove * 2, height + yMove * 2);
            ctx.lineTo(width, height + yMove * 2);
            ctx.stroke();
            return;
        }
        if (ord === 1) {
            ctx.beginPath();
            ctx.strokeStyle = "#b40f09";
            ctx.lineWidth = 10;
            ctx.moveTo(xMove, yMove + height / 2);
            ctx.lineTo(xMove + width, yMove + height / 2);
            ctx.stroke();
            return;
        }
        if (ord === 2) {
            for (let index = 0; index < spots.length; index++) {
                ctx.fillStyle = "#b40f09";
                const r = Math.min(width, height) * 0.035;
                ctx.beginPath();
                const spot = spots[index];
                let x = width * spot[0];
                let y = height * spot[1];    
                if ((index > -1 && index < 6) || index === 24 || index === 23) {
                    x += lineWidth/2;
                } else if ((index > 24 && index < 31) || index === 6 || index === 7) {
                    x -= lineWidth/2;
                }

                if (index === 0 || index === 13 || index === 25) {
                    y = y - lineWidth / 2;
                } else if (index === 5 || index === 17 || index === 30) {
                    y = y + lineWidth / 2;
                }
                
                const cx = xMove + x;
                const cy = yMove + y;

                ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = "white";
                ctx.font = `${r * 1.2}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(index.toString(), cx, cy);
            }
            return;
        }

        ctx.fillStyle = "#b40f09";
        const r = Math.min(width, height) * 0.035;
        ctx.beginPath();
        const spot = spots[ord - 3];
        if (!spot) return;
        let x = width * spot[0];
        let y = height * spot[1];        

        if ((ord > 2 && ord < 9) || ord === 27 || ord === 26) {
            x += lineWidth/2;
        } else if ((ord > 27 && ord < 34) || ord === 9 || ord === 10) {
            x -= lineWidth/2;
        }

        if (ord === 3 || ord === 16 || ord === 28) {
            y = y - lineWidth / 2;
        } else if (ord === 8 || ord === 20 || ord === 33) {
            y = y + lineWidth / 2;
        }

        ctx.arc(xMove + x, yMove + y, r, 0, 2*Math.PI);
        ctx.fill();
    }, [ord]);

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "81rem",
                margin: "0 auto",
                position: "relative",
            }}
        >
            <canvas
                ref={canvasRef}
                width={1300}
                height={600}
                style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                }}
            />
        </div>
    );
}