import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { UserContextReducerAction, userContextReducer } from "./userContextReducer";
import { ActivityRegisterInstance } from "../types/activityRegisterInstance";
import { existsActivityRegisterInstances, readActivityRegisterInstances, writeActivityRegisterInstances } from "../utils/fs/activityRegisterInstance";

export interface UserContextState {
    instances: ActivityRegisterInstance[]
    profile: {
        username: string
    }
    currentInstnace : ActivityRegisterInstance | null
}

export interface UserContextReturn {
    state: UserContextState
    dispatch: React.Dispatch<UserContextReducerAction>
}

const userContextInitialState: UserContextState = {
    instances: [],
    profile: {
        username: "default"
    },
    currentInstnace : null
}

const UserContext = createContext<UserContextReturn>({
    state: userContextInitialState,
    dispatch: () => { }
})

export function UserProvider(props: { children: React.ReactNode }) {
    const [userInfoLoaded,setUserInfoLoaded] = useState<boolean>(false)
    const [state, dispatch] = useReducer(userContextReducer, userContextInitialState)

    async function checkInstances() {
        const existentFile = await existsActivityRegisterInstances(state.profile.username)
        if (!existentFile) {
            await writeActivityRegisterInstances(state.profile.username, [])
            return
        }
        const instances = await readActivityRegisterInstances(state.profile.username)
        if (!instances) return
        dispatch({
            type: "UPDATE_INSTANCES",
            payload: { instances: instances }
        })
    }
    function loadUserData () {
        checkInstances()
        setUserInfoLoaded(true)
    }
    useEffect(() => {
        if (typeof window !== undefined) {
            loadUserData()
        }
    }, [])
    useEffect(()=>{
        console.log("actualizando instancias de actividad de registro...")
        if(userInfoLoaded){
            writeActivityRegisterInstances(state.profile.username,state.instances)
        }
    },[state.instances])
    return (
        <UserContext.Provider value={{
            state: state,
            dispatch: dispatch
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext)

