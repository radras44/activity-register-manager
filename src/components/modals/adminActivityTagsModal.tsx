import { Box, Button, Modal, SxProps } from "@mui/material"
import modalStyles from "./modalStyles"
import AddActivityTagInput from "../inputs/addActivityTagInput"
import TagCount from "../list/tagCount"
import ModalFormSectionLabel from "../text/modalFormSectionLabel"
import { ActivityTag, ContextTag } from "../../types/activityRegisterInstance"
import { useState } from "react"
interface AdminActivityTagsModalProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    activityTags: ActivityTag[]
    onSubmit: (activityTags: ActivityTag[]) => void
}

export default function AdminActivityTagsModal(props: AdminActivityTagsModalProps) {
    const [activityTags, setActivityTags] = useState<ActivityTag[]>(props.activityTags)
    const sxStyles: Record<string, SxProps> = {
        "container": {
            ...modalStyles["container"],
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "submit-box": {
            display: "flex",
            flexDirection: "row",
            gap: 1
        },
    }

    function remove(activityTag: ActivityTag | ContextTag) {
        setActivityTags(prev => {
            const updated = [...prev].filter(el => el.id !== activityTag.id)
            return updated
        })
    }
    function add(activityTag: ActivityTag) {
        setActivityTags(prev => [...prev, activityTag])
    }

    function submit () {
        props.onSubmit(activityTags)
        props.onClose({},"backdropClick")
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={sxStyles["container"]}>
                <ModalFormSectionLabel label="Administrar actividades" />
                <AddActivityTagInput onSubmit={add} />
                <TagCount
                    onTagClick={remove}
                    tags={activityTags}
                    variant="delete"
                />
                <Box sx={sxStyles["submit-box"]}>
                    <Button variant="contained" onClick={submit}>Guardar</Button>
                    <Button variant="outlined" onClick={() => props.onClose({}, "backdropClick")}>Cancelar</Button>
                </Box>
            </Box>
        </Modal>
    )
}