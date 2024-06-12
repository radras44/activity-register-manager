import { joiResolver } from "@hookform/resolvers/joi"
import { SxProps, Modal, Box, TextField, Button } from "@mui/material"
import Joi from "joi"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"
import { ActivityTag, ContextTag } from "../../types/activityRegisterInstance"
import AddActivityTagInput from "../inputs/addActivityTagInput"
import TagCount from "../list/tagCount"
import ErrorLabel from "../text/errorLabel"
import ModalFormSectionLabel from "../text/modalFormSectionLabel"
import modalStyles from "./modalStyles"

interface Data {
    name: string
}

const schema = Joi.object({
    name: Joi.string().min(1).max(24).required(),
})

interface CreateRegisterProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    onSubmit: (activity:ActivityTag) => void
}

export default function AddActivityTagModal(props: CreateRegisterProps) {
    const [contextTags,setContextTags] = useState<ContextTag[]>([])
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
    
    function submit (data : Data) {
        props.onSubmit({
            id : v4(),
            name : data.name,
            contextTags : contextTags
        })
        props.onClose({},"backdropClick")
    }

    function addContextTag(contextTag: ContextTag) {
        setContextTags(prev => [...prev, contextTag])
    }

    function removeContextTag(tagToRemove: ActivityTag | ContextTag) {
        setContextTags(prev => {
            const updated = prev.filter(tag => tag.id != tagToRemove.id)
            return updated
        })
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={modalStyles["container"]}>
                <form
                    onSubmit={handleSubmit((data) => submit(data))}
                >
                    <Box sx={sxStyles["form"]}>
                        <Box sx={sxStyles["group-box"]}>
                            <ModalFormSectionLabel label="Nombre"/>
                            <TextField 
                            placeholder="Actividad"
                            autoComplete="-"
                            size="small"
                            {...register("name")}
                            />
                            {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
                        </Box>
                        <Box sx={sxStyles["group-box"]}>
                        <ModalFormSectionLabel label="Sub-actividades"/>
                            <AddActivityTagInput onSubmit={addContextTag} />
                            <TagCount 
                            onTagClick={removeContextTag} 
                            tags={contextTags}
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

