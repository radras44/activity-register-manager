import { SxProps, Box, Typography } from "@mui/material"
import { styleTheme } from "../../main"

interface ModalFormSectionLabelProps {
    label : string
}
export default function ModalFormSectionLabel (props : ModalFormSectionLabelProps) {
    const sxStyles : Record<string,SxProps>= {
        "container" : {
            borderBottom : `1px solid ${styleTheme.palette.text.disabled}`
        },
        "label" : {
            marginLeft : 1,
            fontWeight : "bold",
            fontSize : 20,
            color : "text.secondary"
        }
    }
    return (
        <Box sx={sxStyles["container"]}>
            <Typography sx={sxStyles["label"]}>{props.label}</Typography>
        </Box>
    )
}

