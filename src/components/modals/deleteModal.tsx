import { Box, Button, Modal, SxProps, Typography } from "@mui/material";
import modalStyles from "./modalStyles";

interface DeleteModalProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    onSubmit: () => void
    submitText?: string
    description: string
}

export default function DeleteModal(props: DeleteModalProps) {
    const sxStyles : Record<string,SxProps> = {
        "container" : {
            display : "flex",
            flexDirection : "column",
            gap : 4
        },
        "button-box" : {
            display : "flex",
            flexDirection : "row",
            gap : 1
        }
    }

    function submit () {
        props.onSubmit()
        props.onClose({},"backdropClick")
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={modalStyles["container"]}>
                <Box sx={sxStyles["container"]}>
                <Typography variant="subtitle2">{props.description}</Typography>
                <Box sx={sxStyles["button-box"]}>
                    <Button 
                    color="error"
                    variant="contained"
                    onClick={submit}
                    >{props.submitText ? props.submitText : "Eliminar"}</Button>
                    <Button 
                    color="inherit"
                    variant="outlined"
                    onClick={()=>props.onClose({},"backdropClick")}
                    >Cancel</Button>
                </Box>
                </Box>
            </Box>
        </Modal>
    )
}