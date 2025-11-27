import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/">
            <div
                style={{
                    width: "3.75rem",
                    height: "3.75rem",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    border: "0.1875rem solid black",
                    position: "fixed",
                    top: "0.94rem",
                    left: "0.94rem",
                    zIndex: 9999,
                    cursor: "pointer",
                }}
            />
        </Link>
    )
}