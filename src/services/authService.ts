import { validateUsername } from "@/validator/validate"
import axios from "axios"
import { resolveTypeReferenceDirective } from "typescript" 

const authService = async (username: string , password: string) => {
    const credentials = {
        username: username,
        password: password
    }
    const response = await axios.post("", credentials)
    return response
}
export default authService
//const creden = {clave: valor, clave2: valor2 }