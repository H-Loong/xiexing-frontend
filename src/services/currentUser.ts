
import {UserType} from "../models/user";
import myAxios from "../plugins/myAxios";

export const getCurrent = async () => {
    const getCurrentUser: UserType = await myAxios.get("/user/current")
    // @ts-ignore
    sessionStorage.setItem("longUser", getCurrentUser ? JSON.stringify(getCurrentUser) : JSON.stringify({}))
    return getCurrentUser
}

export default getCurrent