import { Box, Button, MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material"
import { Activity, ActivityRegisterInstance, ActivityTag, ContextTag } from "../../types/activityRegisterInstance"
import modalStyles from "./modalStyles"
import { useState } from "react"
import TagCount from "../text/tagCount"

interface EditActivityModalProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    activity: Activity
    onSubmit: (activityTag: Activity) => void
    instance: ActivityRegisterInstance
}

export default function EditActivityModal(props: EditActivityModalProps) {
    const [activity, setActivity] = useState<Activity>(props.activity)
    function changeActivityTag(e: SelectChangeEvent) {
        const newActivityTag: ActivityTag | null = props.instance.activityTags.find(tag => tag.id === e.target.value) || null
        setActivity(prev => ({ ...prev, tag: newActivityTag }))
    }

    function handleContextTagClick(contextTag: ContextTag) {
        setActivity(prev => {
            const finded = prev.contextTags.find(tag => tag.id === contextTag.id) || null
            if(finded){
                const updated = prev.contextTags.filter(tag => tag.id !== finded.id)
                return {...prev,contextTags : updated}
            }
            return {...prev,contextTags : [...prev.contextTags,contextTag]}
        })
    }

    function handleSubmit () {
        props.onSubmit(activity)
        props.onClose({},"backdropClick")
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={modalStyles["container"]}>
                <Select
                    onChange={changeActivityTag}
                    value={activity.tag ? activity.tag.id : "default"}
                >
                    {props.instance.activityTags.map((tag, index) => (
                        <MenuItem
                            key={index}
                            value={tag.id}
                        >{tag.name}</MenuItem>
                    ))}
                    <MenuItem value={"default"}>Default</MenuItem>
                </Select>
                <TagCount
                    tags={activity.tag ? activity.tag.contextTags : []}
                    onTagClick={handleContextTagClick}
                    highlight={activity.contextTags}
                />
                <Button onClick={handleSubmit}>Guardar</Button>
            </Box>
        </Modal>
    )
}
