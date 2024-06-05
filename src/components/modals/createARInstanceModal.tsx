import { joiResolver } from "@hookform/resolvers/joi"
import { Modal, Box, TextField, Button, SxProps } from "@mui/material"
import Joi from "joi"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"
import modalStyles from "./modalStyles"
import { ActivityRegisterInstance, ActivityTag, ContextTag } from "../../types/activityRegisterInstance"
import ErrorLabel from "../text/errorLabel"
import { useState } from "react"
import AddActivityTagInput from "../inputs/addActivityTagInput"
import TagCount from "../list/tagCount"
import { useUserContext } from "../../context/userContext"
import ModalFormSectionLabel from "../text/modalFormSectionLabel"

interface Data {
    name: string
}

const schema = Joi.object({
    name: Joi.string().min(1).max(24).required()
})

interface CreateRegisterProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
}

export default function CreateARInstanceModal(props: CreateRegisterProps) {
    const userContext = useUserContext()
    const [activityTags, setActivityTags] = useState<ActivityTag[]>([])
    const { handleSubmit, register, formState: { errors } } = useForm<Data>({
        resolver: joiResolver(schema)
    })

    const sxStyles: Record<string, SxProps> = {
        "form": {
            display: "flex",
            flexDirection: "column",
            gap: 4
        },
        "submit-box": {
            display: "flex",
            flexDirection: "row",
            gap: 1
        },
        "group-box": {
            display: "flex",
            flexDirection: "column",
            gap: 1
        },
    }

    function create(data: Data) {
        if (!userContext) return
        const newInstance: ActivityRegisterInstance = {
            id: v4(),
            activityTags: activityTags,
            registers: [],
            name: data.name
        }
        userContext.dispatch({
            type: "UPDATE_INSTANCES",
            payload: { instances: [...userContext.state.instances, newInstance] }
        })
        props.onClose({}, "backdropClick")
    }

    function addActivityTag(activityTag: ActivityTag) {
        setActivityTags(prev => [...prev, activityTag])
    }

    function removeActivityTag(tagToRemove: ActivityTag | ContextTag) {
        setActivityTags(prev => {
            const updated = prev.filter(tag => tag.id != tagToRemove.id)
            return updated
        })
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={modalStyles["container"]}>
                <form
                    onSubmit={handleSubmit((data) => create(data))}
                >
                    <Box sx={sxStyles["form"]}>
                        <Box sx={sxStyles["group-box"]}>
                            <ModalFormSectionLabel label="Nombre de la instancia"/>
                            <TextField 
                            autoComplete="-"
                            size="small"
                            {...register("name")}
                            />
                            {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
                        </Box>
                        <Box sx={sxStyles["group-box"]}>
                        <ModalFormSectionLabel label="tags de actividades"/>
                            <AddActivityTagInput onSubmit={addActivityTag} />
                            <TagCount 
                            onTagClick={removeActivityTag} 
                            tags={activityTags}
                            variant="delete"
                             />
                        </Box>
                        <Box sx={sxStyles["submit-box"]}>
                            <Button variant="contained" type="submit">Guardar</Button>
                            <Button variant="outlined" onClick={() => props.onClose({}, "backdropClick")}>Cancelar</Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}

