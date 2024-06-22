import { useEffect } from "react"

export default function Index() {
    useEffect(() => {
    document.title = "Asset-tools"
    }, [])

    return (

            <h2>Index</h2>
    )
};
