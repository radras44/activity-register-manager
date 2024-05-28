import { Box, Button, Container, List, SxProps } from "@mui/material";
import useModal from "./hook/useModal";
import { Add } from "@mui/icons-material";
import { useUserContext } from "./context/userContext";
import CreateARInstanceModal from "./components/modals/createARInstanceModal";
import MainNavbar from "./components/navbar/mainNavbar";
import DataPreviewListItemButton from "./components/list/dataPreviewListItemButton";

export default function App() {
  const createRegister = useModal()
  const context = useUserContext()

  const sxStyles: Record<string, SxProps> = {
    "container": {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      paddingTop: 3,
      paddingBottom: 4
    }
  }

  return (
        <>
      <MainNavbar />
      <Container sx={sxStyles["container"]} maxWidth={"xl"}>
        {
          <CreateARInstanceModal
            onClose={createRegister.close}
            open={createRegister.show}
          />
        }
        <Box>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={createRegister.open}
          >Nueva instancia</Button>
        </Box>
        <List>
          {context.state.instances.map((instance, index) => (
            <Box key={index}>
              <DataPreviewListItemButton
                label={instance.name}
                key={index}
                link={`/instance/registerActivity/${instance.id}`}
                otherData={[
                  { label: "registros de actividad", value: instance.registers.length.toString() },
                  { label: "Tags de actividades", value: instance.activityTags.length.toString() }
                ]}
              />
            </Box>
          ))}
        </List>
      </Container>
    </>
  )
}

