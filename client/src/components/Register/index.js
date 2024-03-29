import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { ParentContext } from "../Login";

import { register } from "../../utils/HttpRequest/auth_request";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";
import Tooltip from "../common/Tooltip";
import Alert from "../common/Alert";
import LoadingModal from "../common/LoadingModal";

import incorrect from "../../assets/image/login/incorrect.svg";
import close from "../../assets/image/modal/close-dark.svg";
import back from "../../assets/image/header/back.svg";
import question from "../../assets/image/register/question.svg";
import information from "../../assets/image/register/information.svg";
import show from "../../assets/image/register/show.svg";
import hide from "../../assets/image/register/hide.svg";

const cn = classNames.bind(styles);

function Register() {
    const { setIsOpenRegisterForm, setIsOpenPersonalLogInForm, handleClosePanel } = useContext(ParentContext);

    const [isIncorrectResponse, setIsIncorrectResponse] = useState("");

    const [isCheck, setIsCheck] = useState(false);
    const [radioChoose, setRadioChoose] = useState(3);

    const [isShowUsernamePopupValidate, setIsShowUsernamePopupValidate] = useState(false);
    const [isShowEmailValidate, setIsShowEmailValidate] = useState(false);
    const [isShowPasswordPopupValidate, setIsShowPasswordPopupValidate] = useState(false);
    const [isShowPasswordAgainValidate, setIsShowPasswordAgainValidate] = useState(false);

    const [isShowWrongPassword, setIsShowWrongPassword] = useState(false);
    const [isShowWrongEmail, setIsShowWrongEmail] = useState(false);

    const [isChangeWrongUsernameIcon, setIsChangeWrongUsernameIcon] = useState(false);
    const [isChangeWrongPasswordIcon, setIsChangeWrongPasswordIcon] = useState(false);

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowEyesIcon, setIsShowEyesIcon] = useState(false);

    const [isShowPassword2, setIsShowPassword2] = useState(false);
    const [isShowEyesIcon2, setIsShowEyesIcon2] = useState(false);

    const [isShowModal, setIsShowModal] = useState(false);

    function registerAccount(data) {
        return register(data).then((res) => res);
    }

    /**
     * 0: Fullname ->
     * 1: Username -> ^[a-z0-9-#]{5,20}$
     * 2: Email -> ^\w{5,15}@[a-z]{5,8}\.[a-z]{2,3}(\.[a-z]{2,3})?$
     * 3: Password -> ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
     * 4: Password 2 -> = Password1
     */
    const [registerData, setRegisterData] = useState(new Array(5));

    const frm = useRef();

    useEffect(() => {
        frm.current.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }, []);

    function handleBackLogInForm() {
        setIsOpenRegisterForm(false);
    }

    function handleCloseAllForm() {
        handleClosePanel(false);
    }

    function handleOpenLoginForm() {
        setIsOpenRegisterForm(false);
        setIsOpenPersonalLogInForm({ open: true, panel: "" });
    }

    function handleChangeRadio(value) {
        setRadioChoose(value);
    }

    function handleChangeCheckBox() {
        setIsCheck(!isCheck);
    }

    function handleCommonTogglePopup(state, setCallback) {
        setCallback(state);
    }

    function handleShowHideBtnPW1() {
        setIsShowPassword(!isShowPassword);
    }

    function handleShowHideBtnPW2() {
        setIsShowPassword2(!isShowPassword2);
    }

    function handleChangeInputData(index, e) {
        let tmpArr = [...registerData];
        tmpArr[index] = e.target.value;
        if (index === 1) {
            setIsChangeWrongUsernameIcon(!validateUsername(tmpArr[1]));
        }
        if (index === 2) {
            setIsShowWrongEmail(!validateEmail(tmpArr[2]));
        }
        if (index === 3) {
            setIsChangeWrongPasswordIcon(!validatePassword(tmpArr[3]));
            setIsShowWrongPassword(!validatePasswordAgain(tmpArr[3], tmpArr[4]));
            if (tmpArr[3]) {
                setIsShowEyesIcon(true);
            } else {
                setIsShowEyesIcon(false);
                setIsShowPassword(false);
            }
        }
        if (index === 4) {
            setIsShowWrongPassword(!validatePasswordAgain(tmpArr[3], tmpArr[4]));
            if (tmpArr[4]) {
                setIsShowEyesIcon2(true);
            } else {
                setIsShowEyesIcon2(false);
                setIsShowPassword2(false);
            }
        }
        setRegisterData(tmpArr);
    }

    // Validate Functions
    const validateUsername = (str) => {
        return new RegExp(/^[a-z0-9-#]{5,20}$/).test(str);
    };

    const validateEmail = (str) => {
        return new RegExp(/^\w{5,15}@[a-z]{5,8}\.[a-z]{2,3}(\.[a-z]{2,3})?$/).test(str);
    };

    const validatePassword = (str) => {
        return new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).test(str);
    };

    const validatePasswordAgain = (str1, str2) => {
        return str1 === str2;
    };

    function onHandleSubmitData() {
        // Validate Fullname
        const validated_FN = registerData[0];
        // Validate Username
        const validated_UN = validateUsername(registerData[1]);
        (!validated_UN && registerData[1] == undefined) || validated_UN || setIsChangeWrongUsernameIcon(true);

        // Validate Email Address
        const validated_EM = validateEmail(registerData[2]);
        (!validated_EM && registerData[2] == undefined) || validated_EM || setIsShowWrongEmail(true);

        // Validate Password
        const validated_PW = validatePassword(registerData[3]);
        (!validated_PW && registerData[3] == undefined) || validated_PW || setIsChangeWrongPasswordIcon(true);

        // Validate Password Again
        const validated_PW2 = validatePasswordAgain(registerData[3], registerData[4]);
        validated_PW2 || setIsShowWrongPassword(true);

        // Check all
        if (validated_FN && validated_UN && validated_EM && validated_PW && validated_PW2) {
            setIsShowModal(true);
            const user_final_data = {
                username: registerData[1],
                fullname: registerData[0],
                email: registerData[2],
                password: registerData[3],
                gender: radioChoose,
            };
            registerAccount(user_final_data).then((res) => {
                setIsShowModal(false);
                if (res.status === 200) {
                    setIsOpenRegisterForm(false);
                    setIsOpenPersonalLogInForm({ open: true, panel: res.data.msg });
                } else {
                    setIsIncorrectResponse(res.data.msg);
                }
            });
        }
        // setIsOpenRegisterForm(false);
        // setIsOpenPersonalLogInForm({ open: true, panel: true });
    }

    return (
        <Modal_Center
            className={cn("register-modal")}
            classNameWrapper={cn("overal-modal")}
        >
            <div className={cn("header-modal")}>
                {isShowModal && <LoadingModal />}
                <div
                    className={cn("back-btn")}
                    onClick={handleBackLogInForm}
                >
                    <img
                        src={back}
                        alt='back'
                    />
                </div>

                <div
                    className={cn("close-btn")}
                    onClick={handleCloseAllForm}
                >
                    <img
                        src={close}
                        alt='close'
                    />
                </div>
            </div>

            <div className={cn("body-modal")}>
                <h1 className={cn("text")}>Register</h1>
                <div className={cn("register-section")}>
                    {isIncorrectResponse && (
                        <Alert
                            leftImage={incorrect}
                            content={isIncorrectResponse}
                            type='failed'
                        />
                    )}

                    <form
                        id='form-register'
                        ref={frm}
                    >
                        <input
                            className={cn("input-control")}
                            type='text'
                            placeholder='Full Name'
                            required
                            onChange={(e) => handleChangeInputData(0, e)}
                        />
                        <div className={cn("validate-input")}>
                            <input
                                className={cn("input-control")}
                                type='text'
                                placeholder='User Name'
                                required
                                onChange={(e) => handleChangeInputData(1, e)}
                            />
                            <div className={cn("infor-validation")}>
                                <img
                                    src={isChangeWrongUsernameIcon ? information : question}
                                    alt={isChangeWrongUsernameIcon ? "information" : "question"}
                                    onMouseEnter={() => handleCommonTogglePopup(true, setIsShowUsernamePopupValidate)}
                                    onMouseLeave={() => handleCommonTogglePopup(false, setIsShowUsernamePopupValidate)}
                                />
                            </div>
                            {isShowUsernamePopupValidate && (
                                <div className={cn("tooltip-information", "length-tooltip")}>
                                    <Tooltip>
                                        <span>
                                            Limit in 5 to 20 characters, just '#', '-' special character, only
                                            lowercase, no spaces
                                        </span>
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                        <div className={cn("validate-input")}>
                            <input
                                className={cn("input-control")}
                                type='text'
                                placeholder='Email'
                                required
                                onChange={(e) => handleChangeInputData(2, e)}
                            />
                            {isShowWrongEmail && (
                                <div className={cn("infor-validation")}>
                                    <img
                                        src={information}
                                        alt='information'
                                        onMouseEnter={() => {
                                            handleCommonTogglePopup(true, setIsShowEmailValidate);
                                        }}
                                        onMouseLeave={() => {
                                            handleCommonTogglePopup(false, setIsShowEmailValidate);
                                        }}
                                    />
                                </div>
                            )}

                            {isShowEmailValidate && (
                                <div className={cn("tooltip-information")}>
                                    <Tooltip>
                                        <span>It's not an available email address</span>
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                        <div className={cn("validate-input")}>
                            <input
                                className={cn("input-control")}
                                type={isShowPassword ? "text" : "password"}
                                placeholder='Password'
                                required
                                onChange={(e) => handleChangeInputData(3, e)}
                            />
                            {isShowEyesIcon && (
                                <img
                                    className={cn("show-hide-icon")}
                                    src={isShowPassword ? show : hide}
                                    alt=''
                                    onClick={handleShowHideBtnPW1}
                                />
                            )}
                            <div className={cn("infor-validation")}>
                                <img
                                    src={isChangeWrongPasswordIcon ? information : question}
                                    alt={isChangeWrongPasswordIcon ? "information" : "question"}
                                    onMouseEnter={() => handleCommonTogglePopup(true, setIsShowPasswordPopupValidate)}
                                    onMouseLeave={() => handleCommonTogglePopup(false, setIsShowPasswordPopupValidate)}
                                />
                            </div>
                            {isShowPasswordPopupValidate && (
                                <div className={cn("tooltip-information", "length-tooltip")}>
                                    <Tooltip>
                                        Minimum eight characters, at least one uppercase letter, one lowercase letter,
                                        one number and one special character
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                        <div className={cn("validate-input")}>
                            <input
                                className={cn("input-control")}
                                type={isShowPassword2 ? "text" : "password"}
                                placeholder='Input Password Again'
                                required
                                onChange={(e) => handleChangeInputData(4, e)}
                            />
                            {isShowEyesIcon2 && (
                                <img
                                    className={cn("show-hide-icon")}
                                    src={isShowPassword2 ? show : hide}
                                    alt=''
                                    onClick={handleShowHideBtnPW2}
                                />
                            )}
                            {isShowWrongPassword && (
                                <div className={cn("infor-validation")}>
                                    <img
                                        src={information}
                                        alt='information'
                                        onMouseEnter={() => {
                                            handleCommonTogglePopup(true, setIsShowPasswordAgainValidate);
                                        }}
                                        onMouseLeave={() => {
                                            handleCommonTogglePopup(false, setIsShowPasswordAgainValidate);
                                        }}
                                    />
                                </div>
                            )}

                            {isShowPasswordAgainValidate && (
                                <div className={cn("tooltip-information")}>
                                    <Tooltip>Not matched with above password field</Tooltip>
                                </div>
                            )}
                        </div>
                        <div className={cn("gender-picker")}>
                            <div className={cn("gender-choose")}>
                                <label
                                    className={cn("gender-label")}
                                    htmlFor='male'
                                >
                                    Male
                                </label>
                                <input
                                    type='radio'
                                    id='male'
                                    checked={radioChoose === 1}
                                    onChange={() => handleChangeRadio(1)}
                                />
                            </div>

                            <div className={cn("gender-choose")}>
                                <label
                                    className={cn("gender-label")}
                                    htmlFor='fmale'
                                >
                                    Female
                                </label>
                                <input
                                    type='radio'
                                    id='fmale'
                                    checked={radioChoose === 2}
                                    onChange={() => handleChangeRadio(2)}
                                />
                            </div>

                            <div className={cn("gender-choose")}>
                                <label
                                    className={cn("gender-label")}
                                    htmlFor='hidegd'
                                >
                                    Secret
                                </label>
                                <input
                                    type='radio'
                                    id='hidegd'
                                    checked={radioChoose === 3}
                                    onChange={() => handleChangeRadio(3)}
                                />
                            </div>
                        </div>
                    </form>
                    <div className={cn("policy-check")}>
                        <input
                            id='policy'
                            type='checkbox'
                            checked={isCheck}
                            onChange={handleChangeCheckBox}
                        />
                        <label htmlFor='policy'>
                            By continuing, you agree to Onstagram’s Terms of Service and confirm that you have read
                            Onstagram’s Privacy Policy.
                        </label>
                    </div>
                    <Button
                        primary
                        disabled={!isCheck}
                        className={cn("submit")}
                        onClick={onHandleSubmitData}
                        form='form-register'
                    >
                        Continue
                    </Button>
                </div>
            </div>

            <div className={cn("footer-modal")}>
                <div className={cn("login-recommend")}>
                    <h3>
                        Already have account?{" "}
                        <span
                            className={cn("login-btn")}
                            onClick={handleOpenLoginForm}
                        >
                            Login now!
                        </span>
                    </h3>
                </div>
            </div>
        </Modal_Center>
    );
}

export default Register;
