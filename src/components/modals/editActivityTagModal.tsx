import { CSSProperties, useState } from "react"
import { ActivityTag, ContextTag } from "../../types/activityRegisterInstance"
import { Box, Button, Modal, SxProps, TextField } from "@mui/material"
import modalStyles from "./modalStyles"
import { useForm } from "react-hook-form"
import Joi from "joi"
import inputStyles from "../inputs/inputStyles"
import { joiResolver } from "@hookform/resolvers/joi"
import ErrorLabel from "../text/errorLabel"
import TagCount from "../list/tagCount"
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
    const [contextTags, setContextTags] = useState<ContextTag[]>(props.activityTag.contextTags)
    const [activityTag] = useState<ActivityTag>(props.activityTag)
    const { register, setValue, handleSubmit, formState: { errors } } = useForm<Data>({
        resolver: joiResolver(schema)
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
        "form-name": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "form-activityTag": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "form-panel": {
            display: "flex",
            flexDirection: "row",
            gap: 2
        }
    }
    function handleContextTagClick(contextTag: ContextTag | ActivityTag) {
        setContextTags(prev => {
            const updated = prev.filter(tag => tag.id !== contextTag.id)
            return updated
        })
    }
    function addContextTag(contextTag: ContextTag) {
        setContextTags(prev => [...prev, contextTag])
    }
    function submit(data: Data) {
        setValue("name", "")
        const updatedActivityTag: ActivityTag = {
            ...props.activityTag,
            name: data.name,
            contextTags: contextTags
        }
        props.onSubmit(updatedActivityTag)
        props.onClose({}, "backdropClick")
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={sxStyles["container"]}>
                <form style={sxStyles["form"] as CSSProperties} onSubmit={handleSubmit((data) => submit(data))}>
                    <Box sx={inputStyles["form-name"]}>
                        <TextField
                            size="small"
                            autoComplete="-"
                            defaultValue={activityTag.name}
                            label="Nombre"
                            {...register("name")}
                        />
                        {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
                    </Box>
                    <Box sx={sxStyles["form-activityTag"]}>
                        <AddContextTagInput
                            onSubmit={addContextTag}
                        />
                        <TagCount
                            onTagClick={handleContextTagClick}
                            tags={contextTags}
                            variant="delete"
                        />
                    </Box>
                    <Box sx={sxStyles["form-panel"]}>
                        <Button variant="contained" type="submit">Guardar</Button>
                        <Button variant="outlined" onClick={() => props.onClose({}, "backdropClick")}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}