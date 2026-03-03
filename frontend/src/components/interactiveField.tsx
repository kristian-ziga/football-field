import {useEffect, useRef} from "react";


export type LineValidation = {
  name: string;
  lengthOK: boolean;
  lengthOverMargin: number;
  angleOK: boolean;
  angleOverMargin: number;
  enabled: boolean;
};

type InteractiveFootballFieldProps = {
  lineValidations: LineValidation[];
};

const RED = "#ff0000";
const GREEN = "#0d3b09";
const WHITE = "#ffffff"

export default function InteractiveField({ lineValidations }: InteractiveFootballFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    function lineColor(lineValidation: LineValidation | undefined): string {
        if (!lineValidation || !lineValidation.enabled) {
            return WHITE;
        }
        return (lineValidation.lengthOK && lineValidation.angleOK) ? GREEN : RED;
    }

    function mixColor(color1: string, color2: string, color3?: string): string {
        if (color1 == RED || color2 == RED || color3 == RED) 
            return RED;
        if (color1 == GREEN || color2 == GREEN || color3 == GREEN)
            return GREEN;
        return WHITE;
    }
    

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
            ctx.fillRect(i * segmentWidth * 2 + xMove, yMove, segmentWidth , height);
        }

        const lineWidth = Math.min(width, height) * 0.04;
        
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Goal Line"));
        ctx.fillRect(xMove, yMove, lineWidth, height);

        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Goal Line"));
        ctx.fillRect(xMove + width - lineWidth, yMove, lineWidth, height)

        //half line
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Halfline"));
        ctx.fillRect(xMove + width/2 - lineWidth/2, yMove, lineWidth, height);

        //left penalty area
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Penalty Area Upper Line"));
        ctx.fillRect(xMove, yMove + height * 0.25 - lineWidth/2, width * 0.15, lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Penalty Area Lower Line"));
        ctx.fillRect(xMove, yMove + height * 0.75 - lineWidth/2, width * 0.15, lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Penalty Area Right Line"));
        ctx.fillRect(xMove + width * 0.15 - lineWidth/2, yMove + height * 0.25 - lineWidth/2, lineWidth, height * 0.75 - height * 0.25 + lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Penalty Area Left Line"));
        ctx.fillRect(xMove, yMove + height * 0.25 - lineWidth/2, lineWidth, height * 0.75 - height * 0.25 + lineWidth);

        //left goal area
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Goal Area Upper Line"));
        ctx.fillRect(xMove, yMove + height * 0.4 - lineWidth/2, width * 0.08, lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Goal Area Lower Line"));
        ctx.fillRect(xMove, yMove + height * 0.6 - lineWidth/2, width * 0.08, lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Goal Area Right Line"));
        ctx.fillRect(xMove + width * 0.08 - lineWidth, yMove + height * 0.4 - lineWidth/2, lineWidth, height * 0.6 - height * 0.4 + lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Goal Area Left Line"));
        ctx.fillRect(xMove, yMove + height * 0.4 - lineWidth/2, lineWidth, height * 0.6 - height * 0.4 + lineWidth);

        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Left Penalty Point"));
        const rad = Math.min(width, height) * 0.025;
        ctx.beginPath();
        ctx.arc(xMove + width * 0.115, yMove + height/2 , rad, 0, 2*Math.PI);
        ctx.fill();

        ctx.strokeStyle = lineColor(lineValidations.find(line => line.name === "Left Penalty Arc"));
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.ellipse(
            xMove + width * 0.142,
            yMove + height / 2,
            Math.min(width, height) * 0.1 ,  
            Math.min(width, height) * 0.15, 
            0,
            -Math.PI / 2,
            Math.PI / 2
        );
        ctx.stroke();

        //right penalty area
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Penalty Area Upper Line"));
        ctx.fillRect(xMove + width * 0.85, yMove + height * 0.25 - lineWidth/2, width * 0.15, lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Penalty Area Lower Line"));
        ctx.fillRect(xMove + width * 0.85, yMove + height * 0.75 - lineWidth/2, width * 0.15, lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Penalty Area Left Line"));
        ctx.fillRect(xMove + width * 0.85 - lineWidth/2, yMove + height * 0.25 - lineWidth/2, lineWidth, height * 0.75 - height * 0.25 + lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Penalty Area Right Line"));
        ctx.fillRect(xMove + width - lineWidth, yMove + height * 0.25 - lineWidth/2, lineWidth, height * 0.75 - height * 0.25 + lineWidth);

        //right goal area
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Goal Area Upper Line"));
        ctx.fillRect(xMove + width * 0.92, yMove + height * 0.4 - lineWidth/2, width * 0.08, lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Goal Area Lower Line"));
        ctx.fillRect(xMove + width * 0.92, yMove + height * 0.6 - lineWidth/2, width * 0.08, lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Goal Area Left Line"));
        ctx.fillRect(xMove + width * 0.92, yMove + height * 0.4 - lineWidth/2, lineWidth, height * 0.6 - height * 0.4 + lineWidth);
        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Goal Area Right Line"));
        ctx.fillRect(xMove + width - lineWidth, yMove + height * 0.4 - lineWidth/2, lineWidth, height * 0.6 - height * 0.4 + lineWidth);


        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Right Penalty Point"));
        ctx.beginPath();
        ctx.arc(xMove + width * 0.885, yMove + height/2 , rad, 0, 2*Math.PI);
        ctx.fill();

        ctx.strokeStyle = lineColor(lineValidations.find(line => line.name === "Right Penalty Arc"));
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.ellipse(
            xMove + width * 0.858,
            yMove + height / 2,
            Math.min(width, height) * 0.1 ,  // šírka
            Math.min(width, height) * 0.15,  // výška = ovál
            0,
            Math.PI / 2,
            -Math.PI / 2
        );
        ctx.stroke();

        //mid circle
        ctx.strokeStyle = lineColor(lineValidations.find(line => line.name === "Centre Circle"));
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(xMove + width/2, yMove + height/2, Math.min(width, height) * 0.18, 0, Math.PI * 2);
        ctx.stroke();


        ctx.fillStyle = lineColor(lineValidations.find(line => line.name === "Centre Point"));
        const radius = Math.min(width, height) * 0.04;
        ctx.beginPath();
        ctx.arc(xMove + width/2, yMove + height/2, radius, 0, 2*Math.PI);
        ctx.fill();

        //outlines
        ctx.fillStyle = mixColor(lineColor(lineValidations.find(line => line.name === "Upper Touchline")), 
                            lineColor(lineValidations.find(line => line.name === "Upper Touchline With Middle")));
        ctx.fillRect(xMove, yMove - 1, width, lineWidth);

        ctx.fillStyle = mixColor(lineColor(lineValidations.find(line => line.name === "Lower Touchline")), 
                            lineColor(lineValidations.find(line => line.name === "Lower Touchline With Middle")));
        ctx.fillRect(xMove, yMove + height - lineWidth + 1, width, lineWidth);
    
    }, [lineValidations]);

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

            <div
                style={{
                position: "absolute",
                top: "50%",
                width: "100%",
                transform: "translateY(-50%)",

                display: "flex",
                justifyContent: "center",
                gap: "30%",

                fontSize: "clamp(3rem, 20vw, 14rem)",
                fontWeight: "bold",
                color: "rgb(24, 51, 30)",
                }}
            >
                <div>L</div>
                <div>R</div>
            </div>
        </div>
    );
}