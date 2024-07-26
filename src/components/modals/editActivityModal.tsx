import { Box, Button, MenuItem, Modal, Select, SelectChangeEvent, SxProps } from "@mui/material"
import { Activity, ActivityRegisterInstance, ActivityTag, ContextTag } from "../../types/activityRegisterInstance"
import modalStyles from "./modalStyles"
import { useMemo, useState } from "react"
import TagCount from "../list/tagCount"
import AnnotationCount from "../list/annotationCount"
import AddAnnotationInput from "../inputs/addAnnotationInput"
import ModalFormSectionLabel from "../text/modalFormSectionLabel"
import useModal from "../../hook/useModal"
import EditAnnotationModal from "./editAnnotationModal"

interface EditActivityModalProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    activity: Activity
    onSubmit: (activityTag: Activity) => void
    instance: ActivityRegisterInstance
}

export default function EditActivityModal(props: EditActivityModalProps) {
    const [activity, setActivity] = useState<Activity>(props.activity)
    const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
    console.log(activity)
    const editAnnotation = useModal()

    const activityTag = useMemo(()=>{
        return props.instance.activityTags.find(tag => tag.id == activity.tag_id) || null
    },[activity])

    const sxStyles: Record<string, SxProps> = {
        "container": {
            ...modalStyles["container"],
            display: "flex",
            flexDirection: "column",
            gap: 4
        },
        "activity": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "annotations": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "contextTags": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "panel": {
            display: "flex",
            flexDirection: "row",
            gap: 2
        }
    }

    function changeActivityTag(e: SelectChangeEvent) {
        const newActivityTag: ActivityTag | null = props.instance.activityTags.find(tag => tag.id === e.target.value) || null
        setActivity(prev => {
            return { ...prev, tag_id: newActivityTag ? newActivityTag.id : null, contextTags: []}
        })
    }

    function handleContextTagClick(contextTag: ContextTag) {
        setActivity(prev => {
            const finded = prev.contextTags.find(tag => tag.id === contextTag.id) || null
            if (finded) {
                const updated = prev.contextTags.filter(tag => tag.id !== finded.id)
                return { ...prev, contextTags: updated }
            }
            return { ...prev, contextTags: [...prev.contextTags, contextTag] }
        })
    }
    function removeAnnotation(annotation: string) {
        setActivity(prev => {
            const updated = [...prev.anotations].filter(el => el !== annotation)
            return { ...prev, anotations: updated }
        })
    }

    function addAnnotation(annotation: string) {
        setActivity(prev => {
            return { ...prev, anotations: [...prev.anotations, annotation] }
        })
    }

    function handleSubmit() {
        props.onSubmit(activity)
        props.onClose({}, "backdropClick")
    }

    function handleEditAnnotationClick(annotation: string) {
        setSelectedAnnotation(annotation)
        editAnnotation.open()
    }

    function handleEditAnnotationSubmit(annotation: string) {
        setActivity(prev => {
            const updatedAnnotations: string[] = [...prev.anotations]
            const index = updatedAnnotations.findIndex(el => el === selectedAnnotation)
            updatedAnnotations[index] = annotation
            return { ...prev, anotations: updatedAnnotations }
        })
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={sxStyles["container"]}>
                <Box sx={sxStyles["activity"]}>
                    <ModalFormSectionLabel label="Actividad" />
                    <Select
                        onChange={changeActivityTag}
                        value={activityTag ? activityTag.id : "default"}
                    >
                        {props.instance.activityTags.map((tag, index) => (
                            <MenuItem
                                key={index}
                                value={tag.id}
                            >{tag.name}</MenuItem>
                        ))}
                        <MenuItem value={"default"}>Default</MenuItem>
                    </Select>
                </Box>
                <Box sx={sxStyles["contextTags"]}>
                    <ModalFormSectionLabel label="Sub-actividades" />
                    <TagCount
                        search
                        tags={activityTag ? activityTag.contextTags : []}
                        onTagClick={handleContextTagClick}
                        highlight={activity.contextTags}
                    />
                </Box>
                <Box sx={sxStyles["annotations"]}>
                    <ModalFormSectionLabel label="Anotaciones" />
                    <AddAnnotationInput
                        onSubmit={addAnnotation}
                    />
                    <AnnotationCount
                        annotations={activity.anotations}
                        handleDelete={removeAnnotation}
                        handleEdit={handleEditAnnotationClick}
                    />
                </Box>
                <Box sx={sxStyles["panel"]}>
                    <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
                    <Button variant="outlined" onClick={() => props.onClose({}, "backdropClick")}>Cancelar</Button>
                </Box>
                {
                    (selectedAnnotation && editAnnotation.show) &&
                    <EditAnnotationModal
                        open={editAnnotation.show}
                        onClose={editAnnotation.close}
                        onSubmit={handleEditAnnotationSubmit}
                        annotation={selectedAnnotation}
                    />
                }
            </Box>
        </Modal>
    )
}
