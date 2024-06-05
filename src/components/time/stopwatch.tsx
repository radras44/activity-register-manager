import { useState, useRef, useEffect, forwardRef, useImperativeHandle, Ref } from "react"
import { Box, IconButton, SxProps, Typography } from "@mui/material"
import { AccessAlarm, Pause, PlayArrow, RestartAlt } from "@mui/icons-material"
import EditStopWatchModal from "../modals/editStopWatchModal"
import useModal from "../../hook/useModal"

interface StopwatchProps {
  startTime?: number
}

export interface StopwatchRef {
  getCurrentTime: () => number
  stop : () => void
}

export const Stopwatch = forwardRef<StopwatchRef, StopwatchProps>((props, ref) => {
  const [time, setTime] = useState<number>(props.startTime ? props.startTime : 0)
  const [running, setRunning] = useState<boolean>(false)
  const requestAnimationFrameRef = useRef<number | null>(null)
  const startTime = useRef<number>(0)
  const editStopWatch = useModal()

  useImperativeHandle(ref as Ref<StopwatchRef>, () => {
    return {
      getCurrentTime: () => time,
      stop : () => setRunning(false)
    }
  }, [time])

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
    pauseEmiter()
  }

  function resume() {
    startTime.current = Date.now() - time
    requestAnimationFrameRef.current = requestAnimationFrame(checkTime)
  }

  function pauseEmiter() {
    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current)
    }
  }

  //modal submit handlers
  function handleEditStopWatch(time: number) {
    setTime(time)
    pauseEmiter()
  }

  useEffect(() => {
    if (running) {
      resume()
    } else {
      pauseEmiter()
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
        <IconButton onClick={restart}><RestartAlt /></IconButton>
        {
          running ?
            <IconButton onClick={() => setRunning(false)}><Pause /></IconButton> :
            <IconButton onClick={() => setRunning(true)}><PlayArrow /></IconButton>
        }

        <IconButton onClick={() => { editStopWatch.open() }} >
          <AccessAlarm />
        </IconButton>
      </Box>
      {
        editStopWatch.show &&
        <EditStopWatchModal
          open={editStopWatch.show}
          onClose={editStopWatch.close}
          onSubmit={handleEditStopWatch}
          defaultTime={time}
        />
      }
    </Box>
  )
}
)
