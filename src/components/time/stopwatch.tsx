import { useState, useRef, useEffect } from "react"
import { Activity } from "../../types/activityRegisterInstance"
import { milisToClockHour, milisToStringedClockHour } from "../../utils/logic/timeUtils"
import { Box, IconButton, SxProps, Typography } from "@mui/material"
import { AccessAlarm, Pause, PlayArrow, RestartAlt } from "@mui/icons-material"
import EditStopWatchModal from "../modals/editStopWatchModal"
import useModal from "../../hook/useModal"

interface StopwatchProps {
  startTime?: number
  activity?: {
    activity: Activity
    onPause: (activity: Activity) => void
    stopDependency? : boolean
  }
}

export function Stopwatch(props: StopwatchProps) {
  const [time, setTime] = useState<number>(props.startTime ? props.startTime : 0)
  const [running, setRunning] = useState<boolean>(false)
  const requestAnimationFrameRef = useRef<number | null>(null)
  const startTime = useRef<number>(0)
  const editStopWatch = useModal()

  const sxStyles: Record<string, SxProps> = {
    "container": {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      alignItems: "center",
      maxWidth: 300
    },
    "time-box": {

    },
    "panel-box": {
      display: "flex",
      flexDirection: "row",
      gap: 1
    },
    "time-text": {
      fontSize: 30
    },
  }

  function checkTime() {
    setTime(Date.now() - startTime.current)
    requestAnimationFrameRef.current = requestAnimationFrame(checkTime)
  }

  async function restart() {
    setTime(0)
    onPuaseEmiter(0)
  }

  function resume() {
    startTime.current = Date.now() - time
    requestAnimationFrameRef.current = requestAnimationFrame(checkTime)
  }

  function handleEditStopWatch(time : number) {
    setTime(time)
    onPuaseEmiter(time)
  }

  function onPuaseEmiter(updatedTime?: number) {
    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current)
    }
    if (props.activity) {
      const clockHour = milisToClockHour(time)
      const updatedActivity: Activity = {
        ...props.activity.activity,
        timeMilis: updatedTime ? updatedTime : time,
        time: updatedTime ? milisToStringedClockHour(updatedTime) : 
        `${clockHour.hours}:${clockHour.minutes}:${clockHour.seconds}.${clockHour.miliseconds}`
      }
      props.activity.onPause(updatedActivity)
    }
  }

  useEffect(() => {
    if (running) {
      resume()
    } else {
      onPuaseEmiter()
    }
  }, [running])

  useEffect(()=>{
    if(props.activity && props.activity.stopDependency !== undefined && props.activity.stopDependency){
      onPuaseEmiter()
    }
  },[props.activity?.stopDependency])
  return (
    <Box sx={sxStyles["container"]}>
      <Box sx={sxStyles["time-box"]}>
        <Typography sx={sxStyles["time-text"]} component={"span"}>{Math.floor((time / (60000 * 60))).toString().padStart(2, "0")}</Typography>
        <Typography sx={sxStyles["time-text"]} component={"span"}>:{Math.floor((time / 60000) % 60).toString().padStart(2, "0")}</Typography>
        <Typography sx={sxStyles["time-text"]} component={"span"}>:{Math.floor((time / 1000) % 60).toString().padStart(2, "0")}</Typography>
        <Typography sx={sxStyles["time-text"]} component={"span"}>.{Math.floor((time / 100) % 10)}</Typography>
      </Box>
      <Box sx={sxStyles["panel-box"]}>
        <IconButton onClick={restart}><RestartAlt /></IconButton>
        {
          running ?
          <IconButton onClick={() => setRunning(false)}><Pause /></IconButton> :
          <IconButton onClick={() => setRunning(true)}><PlayArrow /></IconButton>
        }
        {props.activity &&
          <IconButton onClick={()=>{editStopWatch.open()}} >
            <AccessAlarm/>
          </IconButton>
        }
      </Box>
      {
        props.activity &&
        <EditStopWatchModal
          open={editStopWatch.show}
          onClose={editStopWatch.close}
          onSubmit={handleEditStopWatch}
        />
      }
    </Box>
  )
}


