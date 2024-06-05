import { Box, SxProps} from "@mui/material"
import { useState } from "react"
import EditActivityTagModal from "../../../../components/modals/editActivityTagModal"
import TagCount from "../../../../components/list/tagCount"
import { UserContextReturn } from "../../../../context/userContext"
import useModal from "../../../../hook/useModal"
import { ActivityRegisterInstance, ActivityTag, ContextTag } from "../../../../types/activityRegisterInstance"
import ModalFormSectionLabel from "../../../../components/text/modalFormSectionLabel"
import { Edit } from "@mui/icons-material"
import TextButton from "../../../../components/button/textButton"
import AdminActivityTagsModal from "../../../../components/modals/adminActivityTagsModal"

export default function ActivityTagView(props: { instance: ActivityRegisterInstance, userContext: UserContextReturn }) {
    const editActivityTag = useModal()
    const [selectedActivityTag, setSelectedActivityTag] = useState<ActivityTag | null>(null)
    const adminActivityTags = useModal()
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
    function onEditModalSubmit(activityTag: ActivityTag) {
        props.userContext.dispatch({
            type: "UPDATE_ACTIVITY_TAG",
            payload: { instance: props.instance, activityTag: activityTag }
        })
    }
    function updateActivityTags (activityTags : ActivityTag[]) {
        props.userContext.dispatch({
            type : "UPDATE_INSTANCE",
            payload : {
                instance : {...props.instance,activityTags : activityTags},
            }
        })
    }
    return (
        <Box sx={sxStyles["container"]}>
            <Box>
                <ModalFormSectionLabel label="Actividades" />
                <TextButton
                    onClick={adminActivityTags.open}
                    startIcon={<Edit />}
                >Gestionar actividades</TextButton>
            </Box>
            <TagCount
                tags={props.instance.activityTags}
                onTagClick={handleActivityTagClick}
            />
            {
                (selectedActivityTag && editActivityTag.show) &&
                <EditActivityTagModal
                    onSubmit={onEditModalSubmit}
                    open={editActivityTag.show}
                    onClose={editActivityTag.close}
                    activityTag={selectedActivityTag}
                />
            }
            {
                adminActivityTags.show &&
                <AdminActivityTagsModal
                open={adminActivityTags.show}
                onClose={adminActivityTags.close}
                onSubmit={updateActivityTags}
                activityTags={props.instance.activityTags}
                />
            }
        </Box>
    )
}