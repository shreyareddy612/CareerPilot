import { createContext, useReducer } from "react"
import ActionTypes from "./type"


const initailState={
    user:null,
    updatePasswordUserId: null
}

const appReducer=(state, action)=>{

    if(action.type===ActionTypes.UPDATE_USER_INFO){
        return{
            ...state,
            user:action.payload
        }
    }
    if(action.type===ActionTypes.UPDATE_PASSWORD_USER_INFO){
        return{
            ...state,
            updatePasswordUserId:action.payload
        }
    }
    return state
}

export const store = createContext(initailState)

const StoreProvider=({children})=>{

    const [state, dispatch] = useReducer(appReducer, initailState)

    const {Provider}= store

    return <Provider value={{state, dispatch}}>{children}</Provider>

}

export default StoreProvider
