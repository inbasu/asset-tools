import { useEffect } from "react"

export default function Mobile() {
    useEffect(() => {
        document.title = "Mobile invent"
        }, [])
    return (
        <>
        <h1>mobile</h1>
        </>
    )
};
