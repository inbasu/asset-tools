import { useEffect } from "react"

import Box from '@mui/material/Box';

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
