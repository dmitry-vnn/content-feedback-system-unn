import {setFormSubmitHandler} from "./share.js";

window.onload = () => {
    setFormSubmitHandler("auth-form", "submit-button", "/login")
}