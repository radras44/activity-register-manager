import { CSSProperties, useState } from "react"
import { ActivityTag, ContextTag } from "../../types/activityRegisterInstance"
import { Box, Button, Modal, SxProps, TextField } from "@mui/material"
import modalStyles from "./modalStyles"
import { useForm } from "react-hook-form"
import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import ErrorLabel from "../text/errorLabel"
import TagCount from "../list/tagCount"
import AddContextTagInput from "../inputs/addContextTagInput"
import ModalFormSectionLabel from "../text/modalFormSectionLabel"
import DeleteModal from "./deleteModal"
import useModal from "../../hook/useModal"
import TextButton from "../button/textButton"
import { Delete } from "@mui/icons-material"

interface EditActivityTagModalProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    activityTag: ActivityTag
    onSubmit: (activityTag: ActivityTag, deleteRequest: boolean) => void
}

interface Data {
    name: string
}

const schema = Joi.object({
    name: Joi.string().min(1).max(30)
})

export default function EditActivityTagModal(props: EditActivityTagModalProps) {
    const deleteActivityTag = useModal()
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
            gap: 1
        },
        "form-activityTag": {
            display: "flex",
            flexDirection: "column",
            gap: 1
        },
        "form-panel": {
            display: "flex",
            flexDirection: "row",
            gap: 2
        },
        "options": {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
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
        props.onSubmit(updatedActivityTag, false)
        props.onClose({}, "backdropClick")
    }

    function handleDelete() {
        props.onSubmit(activityTag, true)
        props.onClose({}, "backdropClick")
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={sxStyles["container"]}>
                <form style={sxStyles["form"] as CSSProperties} onSubmit={handleSubmit((data) => submit(data))}>
                    <Box sx={sxStyles["form-name"]}>
                        <ModalFormSectionLabel label="Nombre de la actividad" />
                        <TextField
                            size="small"
                            autoComplete="-"
                            defaultValue={activityTag.name}
                            {...register("name")}
                        />
                        {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
                    </Box>
                    <Box sx={sxStyles["form-activityTag"]}>
                        <ModalFormSectionLabel label="Sub-actividades" />
                        <AddContextTagInput
                            onSubmit={addContextTag}
                        />
                        <TagCount
                            search={true}
                            onTagClick={handleContextTagClick}
                            tags={contextTags}
                            variant="delete"
                        />
                    </Box>
                    <Box sx={sxStyles["options"]}>
                        <TextButton
                            color="error"
                            startIcon={<Delete />}
                            onClick={deleteActivityTag.open}
                        >Eliminar actividad</TextButton>
                    </Box>
                    <Box sx={sxStyles["form-panel"]}>
                        <Button variant="contained" type="submit">Guardar</Button>
                        <Button variant="outlined" onClick={() => props.onClose({}, "backdropClick")}>Cancel</Button>
                    </Box>
                </form>
                {
                    deleteActivityTag.show &&
                    <DeleteModal
                        open={deleteActivityTag.show}
                        onClose={deleteActivityTag.close}
                        description="¿Estas seguro de que quieres eliminar esta actividad?"
                        onSubmit={handleDelete}
                    />
                }
            </Box>
        </Modal>
    )
}