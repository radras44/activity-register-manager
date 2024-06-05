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
        overflow : "auto",
        padding : 4,
        minWidth : 350
    }
} as Record<string,SxProps>