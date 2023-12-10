import {setFormSubmitHandler} from "./share.js";

window.onload = () => {
    setFormSubmitHandler("registration-form", "submit-button", "/register")
}