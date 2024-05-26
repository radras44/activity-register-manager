import { useState, useRef, useEffect } from "react"
import { Activity } from "../../types/activityRegisterInstance"
import { milisToClockHour } from "../../utils/logic/timeUtils"
import { Box, IconButton, SxProps, Typography } from "@mui/material"
import { Pause, PlayArrow, RestartAlt } from "@mui/icons-material"

interface StopwatchProps {
  startTime?: number
  activity?: {
    activity: Activity
    onPause: (activity: Activity) => void
  }
}

export function Stopwatch(props: StopwatchProps) {
  const [time, setTime] = useState<number>(props.startTime ? props.startTime : 0)
  const [running, setRunning] = useState<boolean>(false)

  const requestAnimationFrameRef = useRef<number | null>(null)
  const startTime = useRef<number>(0)

  const sxStyles: Record<string, SxProps> = {
    "container": {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      alignItems: "center",
      maxWidth : 300
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
    onPuaseEmiter(true)
  }

  function resume() {
    startTime.current = Date.now() - time
    requestAnimationFrameRef.current = requestAnimationFrame(checkTime)
  }

  function pause() {
    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current)
    }
    onPuaseEmiter()
  }

  function onPuaseEmiter (reset?:boolean) {
    if (props.activity) {
      const clockHour = milisToClockHour(time)
      const updatedActivity: Activity = {
        ...props.activity.activity,
        timeMilis: reset ? 0 : time,
        time: reset ? "00:00:00.0" :`${clockHour.hours}:${clockHour.minutes}:${clockHour.seconds}.${clockHour.miliseconds}`
      }
      props.activity.onPause(updatedActivity)
    }
  }

  useEffect(() => {
    if (running) {
      resume()
    } else {
      pause()
    }
  }, [running])
  return (
    <Box sx={sxStyles["container"]}>
      <Box sx={sxStyles["time-box"]}>
        <Typography sx={sxStyles["time-text"]} component={"span"}>{Math.floor((time / (60000 * 60))).toString().padStart(2, "0")}</Typography>
        <Typography sx={sxStyles["time-text"]} component={"span"}>:{Math.floor((time / 60000) % 60).toString().padStart(2, "0")}</Typography>
        <Typography sx={sxStyles["time-text"]} component={"span"}>:{Math.floor((time / 1000) % 60).toString().padStart(2, "0")}</Typography>
        <Typography sx={sxStyles["time-text"]} component={"span"}>.{Math.floor((time / 100) % 10)}</Typography>
      </Box>
      <Box sx={sxStyles["panel-box"]}>
        {
          running ?
            <IconButton onClick={() => setRunning(false)}><Pause /></IconButton> :
            <IconButton onClick={() => setRunning(true)}><PlayArrow /></IconButton>
        }
        <IconButton onClick={restart}><RestartAlt /></IconButton>
      </Box>
    </Box>
  )
}
