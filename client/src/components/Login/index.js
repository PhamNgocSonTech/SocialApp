import classNames from "classnames/bind";
import styles from "./Login.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";

import close from "../../assets/image/modal/close-dark.svg";
import facebook from "../../assets/image/login/facebook.svg";
import google from "../../assets/image/login/google.svg";
import person from "../../assets/image/login/person.svg";

import PersonalLogIn from "../PersonalLogIn";
import Register from "../Register";
import { createContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { gapi } from "gapi-script";

import { GoogleLogin, useGoogleLogin } from "react-google-login";
import { loginGoogle } from "../../utils/HttpRequest/auth_request";
import { useGoogleAuth } from "../common/GoogleAuth/googleAuth";

const cn = classNames.bind(styles);
export const ParentContext = createContext();

function Login({ handleClosePanel, className }) {
    const [isOpenRegisterForm, setIsOpenRegisterForm] = useState(false);
    const [isOpenPersonalLogInForm, setIsOpenPersonalLogInForm] = useState({ open: false, panel: "" });

    const client_id = "841192353210-1b7o6v02khn2gs7sl801pbt9hmhjejtu.apps.googleusercontent.com";

    function handleCloseModal() {
        handleClosePanel(false);
    }

    function handleOpenRegisterForm() {
        setIsOpenRegisterForm(true);
    }

    function handleOpenPersonalLogInForm() {
        setIsOpenPersonalLogInForm({ open: true, panel: "" });
    }

    const googleHandleSuccess = (res) => {
        console.log(res);
    };

    const googleHandleFailed = (res) => {
        console.log(res);
    };

    const { signIn } = useGoogleAuth();

    const facebookHandle = () => {
        window.open("https://onstagramapi.onrender.com/api/auth/facebook", "_self");
    };

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: client_id,
                scope: "",
            });
        }
        gapi.load("client:auth2", start);
    });

    return (
        <ParentContext.Provider
            value={{
                setIsOpenRegisterForm,
                setIsOpenPersonalLogInForm,
                handleClosePanel,
            }}
        >
            <Modal_Center className={cn("login-modal", { [className]: className })}>
                <div className={cn("header-modal")}>
                    <div
                        className={cn("close-btn")}
                        onClick={handleCloseModal}
                    >
                        <img
                            src={close}
                            alt='close'
                        />
                    </div>
                </div>

                <div className={cn("body-modal")}>
                    <h1 className={cn("text")}>Login to Onstagrams</h1>
                    <div className={cn("login-section")}>
                        <Button
                            className={cn("btn-login")}
                            classNameImg={cn("img-login")}
                            leftIcon={facebook}
                            onClick={facebookHandle}
                            outline
                        >
                            Login with Facebook
                        </Button>
                        <Button
                            className={cn("btn-login")}
                            classNameImg={cn("img-login")}
                            leftIcon={google}
                            outline
                            onClick={signIn}
                        >
                            Login with Google
                        </Button>
                        <Button
                            className={cn("btn-login")}
                            classNameImg={cn("img-login")}
                            leftIcon={person}
                            outline
                            onClick={handleOpenPersonalLogInForm}
                        >
                            Login with Onstagrams Account
                        </Button>
                    </div>
                </div>

                <div className={cn("footer-modal")}>
                    <div className={cn("register-recommend")}>
                        <h3>
                            Don't have account?{" "}
                            <span
                                className={cn("register-btn")}
                                onClick={handleOpenRegisterForm}
                            >
                                Register now!
                            </span>
                        </h3>
                    </div>
                </div>
                {/* Handle Open Another Form */}
                <AnimatePresence>
                    {isOpenRegisterForm && <Register key={"regis"} />}
                    {isOpenPersonalLogInForm.open && (
                        <PersonalLogIn
                            key={"perlog"}
                            isShowDoneRegister={isOpenPersonalLogInForm.panel}
                        />
                    )}
                </AnimatePresence>
            </Modal_Center>
        </ParentContext.Provider>
    );
}

export default Login;
