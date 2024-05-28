import { SxProps } from "@mui/material"

export default {
    container: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        maxHeight : "90%",
        maxWidth : "90%",
        boxShadow: 24,
        p: 4,
        overflow : "auto"
    }
} as Record<string,SxProps>