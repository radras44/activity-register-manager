import { AppBar, Toolbar, Box, Drawer, List, ListItemButton, IconButton, SxProps } from "@mui/material";
import { ArrowBack, Home, Menu } from "@mui/icons-material";
import useDrawer from "../../hook/useDrawer";
import { Link } from "react-router-dom";
import { DrawerLink } from "../../types/listElements";
import iconStyles from "../../styles/iconStyles";

interface AditionalElement {
    icon: JSX.Element
    onClick: () => void
}

interface MainNavbarProps {
    additionalElements?: AditionalElement[]
    onBack?: () => void
    onNavigation? : () => void
}

export default function MainNavbar(props: MainNavbarProps) {
    const sxStyles: Record<string, SxProps> = {
        "toolbar": {
            width: "100%",
            display : "flex",
            flexDirection : "row",
            alignItems : "center",
            padding : 0
        },
        "toolbar-right": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "flex-end",
            flex: 1
        },
        "toolbar-left": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
        },
        "drawer": {
            minWidth: "20vw"
        },
        "drawer-list-button": {
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
            fontWeight: "bold"
        },

    }
    return (
            <AppBar elevation={0} position="sticky" sx={sxStyles["appBar"]}>
                <Toolbar sx={sxStyles["toolbar"]}>
                    <Box sx={sxStyles["toolbar-left"]}>
                        {
                            props.onBack &&
                            <IconButton onClick={props.onBack}>
                                {<ArrowBack sx={iconStyles["icon"]} />}
                            </IconButton>
                        }
                        {
                            props.additionalElements &&
                            <>
                                {props.additionalElements.map((el, index) => (
                                    <IconButton key={index} onClick={()=>{
                                        el.onClick()
                                        if(props.onNavigation){
                                            props.onNavigation()
                                        }
                                    }}>
                                        {el.icon}
                                    </IconButton>
                                ))}
                            </>
                        }
                    </Box>
                    <Box sx={sxStyles["toolbar-right"]}>
                        <MainNavbarDrawer 
                        onNavigation={props.onNavigation ? props.onNavigation : () => {}} 
                        sxStyles={sxStyles} />
                    </Box>
                </Toolbar>
            </AppBar>
    )
}

const drawerLinks: DrawerLink[] = [
    { label: "Inicio", link: "/", icon: <Home /> }
]

function MainNavbarDrawer({ sxStyles,onNavigation }: { sxStyles: Record<string, SxProps>,onNavigation : () => void}) {
    const drawer = useDrawer()
    return (
        <>
            <IconButton onClick={drawer.open}>
                <Menu fontSize="medium" sx={iconStyles["icon"]} />
            </IconButton>
            <Drawer
                open={drawer.show}
                onClose={drawer.close}
            >
                <Box sx={sxStyles["drawer"]}>
                    <List>
                        {drawerLinks.map((drawerLink, index) => (
                            <Link key={index} to={drawerLink.link} onClick={onNavigation}>
                                <ListItemButton sx={sxStyles["drawer-list-button"]}>
                                    {drawerLink.icon}
                                    {drawerLink.label}
                                </ListItemButton>
                            </Link>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}