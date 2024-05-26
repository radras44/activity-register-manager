import { SxProps } from "@mui/material"

export default {
    "simple-box" : {
        display : "flex",
        flexDirection : "column",
        gap : 2,
        padding : 1
    },
    "emiter-box" : {
        display : "flex",
        flexDirection :"column",
    },
    "emiter-input-box" : {
        display : "flex",
        flexDirection :"column",
        alignItems : "flex-start"
    },
    "emiter-input" : {
        padding : 0
    },
    "emiter-input-button" : {
        display : "block",
        textTransform : "none",
        fontWeight : "bold"
    }
} as Record<string,SxProps>