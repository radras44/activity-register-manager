import { Box, SxProps } from "@mui/material"
import { useEffect, useState } from "react"
import EditActivityTagModal from "../../../../components/modals/editActivityTagModal"
import TagCount from "../../../../components/list/tagCount"
import { UserContextReturn } from "../../../../context/userContext"
import useModal from "../../../../hook/useModal"
import { ActivityRegisterInstance, ActivityTag, ContextTag } from "../../../../types/activityRegisterInstance"
import ModalFormSectionLabel from "../../../../components/text/modalFormSectionLabel"
import { Add } from "@mui/icons-material"
import TextButton from "../../../../components/button/textButton"
import AddActivityTagModal from "../../../../components/modals/addActivityTagModal"

export default function ActivityTagView(props: { instance: ActivityRegisterInstance, userContext: UserContextReturn }) {
    const [activityTags, setActivityTags] = useState<ActivityTag[]>(props.instance.activityTags)
    const editActivityTag = useModal()
    const [selectedActivityTag, setSelectedActivityTag] = useState<ActivityTag | null>(null)
    const addActivityTags = useModal()

    function saveActivityTags() {
        props.userContext.dispatch({
            type: "UPDATE_INSTANCE",
            payload: {
                instance: { ...props.instance, activityTags: activityTags },
            }
        })
    }

    const sxStyles: Record<string, SxProps> = {
        "container": {
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "flex-start"
        }
    }
    function handleActivityTagClick(activityTag: ActivityTag | ContextTag) {
        setSelectedActivityTag(activityTag as ActivityTag)
        editActivityTag.open()
    }

    function handleAddActivityTag(activityTag: ActivityTag) {
        setActivityTags(prev => {
            return [...prev, activityTag]
        })
    }

    function handleEditModalSubmit(activityTag: ActivityTag, deleteRequest: boolean) {
        if (deleteRequest) {
            setActivityTags(prev => {
                return prev.filter(el => el.id !== activityTag.id)
            })
            return
        }
        setActivityTags(prev => {
            const index = prev.findIndex(el => el.id === activityTag.id)
            if (index === -1) return prev
            const updated = [...prev]
            updated[index] = activityTag
            return updated
        })
    }

    useEffect(() => {
        saveActivityTags()
    }, [activityTags])
    return (
        <Box sx={sxStyles["container"]}>
            <Box>
                <ModalFormSectionLabel label="Actividades" />
                <TextButton
                    onClick={addActivityTags.open}
                    startIcon={<Add />}
                >Nueva actividad</TextButton>
            </Box>
            <TagCount
                search
                tags={activityTags}
                onTagClick={handleActivityTagClick}
            />
            {
                (selectedActivityTag && editActivityTag.show) &&
                <EditActivityTagModal
                    onSubmit={handleEditModalSubmit}
                    open={editActivityTag.show}
                    onClose={editActivityTag.close}
                    activityTag={selectedActivityTag}
                />
            }
            {
                addActivityTags.show &&
                <AddActivityTagModal
                    open={addActivityTags.show}
                    onClose={addActivityTags.close}
                    onSubmit={handleAddActivityTag}
                />
            }
        </Box>
    )
}