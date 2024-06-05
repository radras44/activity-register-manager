import { Box, Button, Input, Modal, SxProps, TextField } from "@mui/material";
import { ActivityRegister } from "../../types/activityRegisterInstance";
import modalStyles from "./modalStyles";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import ErrorLabel from "../text/errorLabel";
import ModalFormSectionLabel from "../text/modalFormSectionLabel";
interface EditActivityRegisterModalProps {
    activityRegister: ActivityRegister
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    onSubmit: (register: ActivityRegister) => void
}

interface Data {
    name: string
    date: Date
}

const schema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    date: Joi.date().required()
})

export default function EditActivityRegisterModal(props: EditActivityRegisterModalProps) {
    console.log("props: creationDate", props.activityRegister)
    const defaultDate = props.activityRegister.creationDate.split("T")[0]
    const { register, formState: { errors }, handleSubmit } = useForm<Data>({
        resolver: joiResolver(schema),

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
        "form-fields": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "form-field": {
            display: "flex",
            flexDirection: "column",
            gap: 1
        },
        "form-panel": {
            display: "flex",
            flexDirection: "row",
            gap: 1
        }
    }

    function submit(data: Data) {
        props.onSubmit({
            ...props.activityRegister,
            creationDate: data.date.toISOString(),
            name: data.name.trim()
        })
        props.onClose({}, "backdropClick")
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={sxStyles["container"]}>
                <form onSubmit={handleSubmit((data) => submit(data))} style={sxStyles["form"] as CSSProperties}>
                    <Box sx={sxStyles["form-fields"]}>
                        <Box sx={sxStyles["form-field"]}>
                            <ModalFormSectionLabel label="Nombre" />
                            <TextField
                                {...register("name")}
                                defaultValue={props.activityRegister.name}
                            />
                            {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
                        </Box>
                        <Box sx={sxStyles["form-field"]}>
                            <ModalFormSectionLabel label="Fecha" />
                            <Input
                                {...register("date")}
                                defaultValue={defaultDate}
                                type="date"
                            />
                            {errors.date && <ErrorLabel>{errors.date.message}</ErrorLabel>}
                        </Box>
                    </Box>
                    <Box sx={sxStyles["form-panel"]}>
                        <Button type="submit" variant="contained">Guardar</Button>
                        <Button onClick={() => props.onClose({}, "backdropClick")} variant="outlined">Cancelar</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}