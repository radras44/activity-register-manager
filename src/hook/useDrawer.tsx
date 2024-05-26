import { useState } from "react"

export default function useDrawer () {
    const [show,setShow] = useState<boolean>(false)
    const open = () => setShow(true)
    const close = () => setShow(false)
    return {open,close,show}
}