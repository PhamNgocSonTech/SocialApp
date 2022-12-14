import classNames from "classnames/bind";
import Button from "../../Button";

import { MAIN_NAV_SIDEBAR } from "../../../../Default/constant";

import styles from "./MainBar.module.scss";
import { useState } from "react";

const cn = classNames.bind(styles);

function MainBar() {
    const [active, setActive] = useState(0);

    const handleClick = (index) => {
        setActive(index);
    };

    const token = window.localStorage.getItem("accessToken");

    return (
        <div className={cn("main-bar")}>
            <div className={cn("nav-main")}>
                {MAIN_NAV_SIDEBAR.map((item, key) => {
                    if ((item.needLogin && token) || !item.needLogin) {
                        return (
                            <Button
                                key={key}
                                onClick={() => handleClick(key)}
                                className={cn("nav-item", { active: window.location.pathname == item.to })}
                                to={item.to}
                            >
                                <item.icon className={cn("nav-icon")} /> {item.title}
                            </Button>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default MainBar;
