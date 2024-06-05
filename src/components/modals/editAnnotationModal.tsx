import { Box, Button, Card, Modal, SxProps, TextField } from "@mui/material"
import modalStyles from "./modalStyles"
import ModalFormSectionLabel from "../text/modalFormSectionLabel"
import { useForm } from "react-hook-form"
import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import ErrorLabel from "../text/errorLabel"
import { CSSProperties } from "react"
interface EditAnnotationModalProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    annotation : string
    onSubmit: (annotation : string) => void
}

interface Data {
    annotation : string
}

const schema = Joi.object({
    annotation : Joi.string().min(1).max(1000).required()
})

export default function EditAnnotationModal (props : EditAnnotationModalProps) {
    const {register,handleSubmit,formState : {errors}} = useForm<Data>({
        resolver : joiResolver(schema),
        defaultValues : {
            annotation : props.annotation
        }
    })
    const sxStyles: Record<string, SxProps> = {
        "container": {
            ...modalStyles["container"],
        },
        "form": {
            display: "flex",
            flexDirection: "column",
            gap: 30
        },
        "form-panel": {
            display: "flex",
            flexDirection: "row",
            gap: 1
        },
        "form-textField" : {
            display : "flex",
            flexDirection  :"column",
            gap : 1
        }
    }

    function submit (data : Data) {
        props.onSubmit(data.annotation)
        props.onClose({},"backdropClick")
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Card sx={sxStyles["container"]}>
                <form style={sxStyles["form"] as CSSProperties} onSubmit={handleSubmit((data) => submit(data))}>
                    <Box sx={sxStyles["form-textField"]}>
                        <ModalFormSectionLabel label="Anotación"/>
                        <TextField
                        {...register("annotation")}
                        />
                        {errors.annotation && <ErrorLabel>{errors.annotation.message}</ErrorLabel>}
                    </Box>
                    <Box sx={sxStyles["form-panel"]}>
                        <Button variant="contained" type="submit">Guardar</Button>
                        <Button variant="outlined" onClick={() => props.onClose({}, "backdropClick")}>Cancel</Button>
                    </Box>
                </form>
            </Card>
        </Modal>
    )
}