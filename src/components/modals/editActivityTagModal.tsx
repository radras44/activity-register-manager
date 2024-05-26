import {  useState } from "react"
import { ActivityTag, ContextTag } from "../../types/activityRegisterInstance"
import { Box, Button, Modal, TextField } from "@mui/material"
import modalStyles from "./modalStyles"
import { useForm } from "react-hook-form"
import Joi from "joi"
import inputStyles from "../inputs/inputStyles"
import { joiResolver } from "@hookform/resolvers/joi"
import ErrorLabel from "../text/errorLabel"
import TagCount from "../text/tagCount"
import AddContextTagInput from "../inputs/addContextTagInput"

interface EditActivityTagModalProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    activityTag: ActivityTag
    onSubmit: (activityTag: ActivityTag) => void
}

interface Data {
    name: string
}

const schema = Joi.object({
    name: Joi.string().min(1).max(30)
})

export default function EditActivityTagModal(props: EditActivityTagModalProps) {
    const [contextTags,setContextTags] = useState<ContextTag[]>(props.activityTag.contextTags)
    const [activityTag] = useState<ActivityTag>(props.activityTag)
    const { register, setValue, handleSubmit, formState: { errors } } = useForm<Data>({
        resolver : joiResolver(schema)
    })
    function handleContextTagClick (contextTag : ContextTag | ActivityTag) {
        setContextTags(prev => {
            const updated = prev.filter(tag => tag.id !== contextTag.id)
            return updated
        })
    }
    function addContextTag (contextTag : ContextTag) {
        setContextTags(prev => [...prev,contextTag])
    }
    function submit(data: Data) {
        setValue("name", "")
        const updatedActivityTag : ActivityTag = {
            ...props.activityTag,
            name : data.name,
            contextTags : contextTags
        }
        props.onSubmit(updatedActivityTag)
        props.onClose({}, "backdropClick")
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={modalStyles["container"]}>
                <form onSubmit={handleSubmit((data) => submit(data))}>
                    <Box sx={inputStyles["simple-box"]}>
                        <TextField
                            defaultValue={activityTag.name}
                            label="Nombre"
                            {...register("name")}
                        />
                        {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
                    </Box>
                    <AddContextTagInput
                    onSubmit={addContextTag}
                    />
                    <TagCount
                    onTagClick={handleContextTagClick}
                    tags={contextTags}
                    />
                    <Button type="submit">Guardar</Button>
                </form>
            </Box>
        </Modal>
    )
}