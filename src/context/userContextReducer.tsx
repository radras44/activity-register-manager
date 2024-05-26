import { ActivityRegisterInstance, ActivityTag,ActivityRegister } from "../types/activityRegisterInstance";
import { UserContextState } from "./userContext";


export type UserContextReducerAction = 
{type : "UPDATE_INSTANCES",payload : {instances : ActivityRegisterInstance[]}} |
{type : "UPDATE_INSTANCE",payload : {instance : ActivityRegisterInstance}} |
{type : "UPDATE_ACTIVITY_TAG",payload : {instance : ActivityRegisterInstance,activityTag : ActivityTag}} |
{type : "UPDATE_ACTIVITY_REGISTER",payload : {instance : ActivityRegisterInstance,register : ActivityRegister}}

export function userContextReducer (state : UserContextState,action : UserContextReducerAction) : UserContextState {
    const {type,payload} = action
    switch(type){
        case "UPDATE_INSTANCES" : {
            return {...state,instances : payload.instances}
        }
        case "UPDATE_INSTANCE" : {
            const instanceIndex = state.instances.findIndex(el => el.id === payload.instance.id)
            if(instanceIndex === -1) return state
            const updated = [...state.instances]
            updated[instanceIndex] = payload.instance
            return {...state,instances : updated}
        }
        case "UPDATE_ACTIVITY_TAG" : {
            const instanceIndex = state.instances.findIndex(instance => instance.id === payload.instance.id)
            if(instanceIndex === -1) return state
            const activityTagIndex = state.instances[instanceIndex].activityTags.findIndex(tag => tag.id === payload.activityTag.id)
            const updated = [...state.instances]
            if(activityTagIndex === -1) {
                updated[instanceIndex].activityTags.push(payload.activityTag) 
            }else{
                updated[instanceIndex].activityTags[activityTagIndex] = payload.activityTag
            }
            return {...state,instances : updated}
        }
        case "UPDATE_ACTIVITY_REGISTER" : {
            const instanceIndex = state.instances.findIndex(el => el.id === payload.instance.id)
            if(instanceIndex === -1) return state
            const updated = [...state.instances]
            const registerIndex = state.instances[instanceIndex].registers.findIndex(el => el.id === payload.register.id)
            if(registerIndex === -1) {
                updated[instanceIndex].registers.push(payload.register)
            }else{
                updated[instanceIndex].registers[registerIndex] = payload.register
            }
            return {...state,instances : updated}
        }
    }
}