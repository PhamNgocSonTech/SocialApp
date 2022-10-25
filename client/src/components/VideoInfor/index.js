import classNames from "classnames/bind";
import styles from "./VideoInfor.module.scss";
import { motion } from "framer-motion";

import FrameRecommendVideo from "../../components/common/FrameRecommendVideo";
import Button from "../../components/common/Button";

import music from "../../assets/image/sidebar/music.svg";
import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";
import { useState } from "react";

const cn = classNames.bind(styles);

function VideoInfor() {
    const [isUnderlineUsername, setIsUnderlineUsername] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [isFollow, setIsFollow] = useState(false);

    const animations = {
        like: {
            scale: [1, 1.4, 0.8, 1],
        },
        dislike: {},
    };

    function handleMouseHoverAvt() {
        setIsUnderlineUsername(true);
    }

    function handleMouseLeaveAvt() {
        setIsUnderlineUsername(false);
    }

    function handleLike() {
        setIsLike(!isLike);
    }

    function handleChangeFollower() {
        setIsFollow(!isFollow);
    }

    return (
        <FrameRecommendVideo className={cn("wrapper")}>
            <img
                className={cn("avatar")}
                alt='avt'
                src='https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/01d8d4475876db565c7990edf21443e8~c5_100x100.jpeg?x-expires=1666807200&x-signature=CRSAI21L0yFB6t8%2Foz59CZb6stI%3D'
                onMouseEnter={handleMouseHoverAvt}
                onMouseLeave={handleMouseLeaveAvt}
            />

            <div className={cn("details")}>
                <div className={cn("author")}>
                    <h3
                        className={cn("username", {
                            active: isUnderlineUsername,
                        })}
                    >
                        thanlanoscarr
                    </h3>
                    <h4
                        className={cn("name")}
                        onMouseEnter={handleMouseHoverAvt}
                        onMouseLeave={handleMouseLeaveAvt}
                    >
                        𝓣𝓪̀𝓲❤️𝓦𝓲𝓷𝓽𝓮𝓪𝓶
                    </h4>
                </div>
                <div className={cn("video-des")}>
                    <span className={cn("cap")}>
                        Huyền thoại vẫn luôn cháy như thế... {"  "}
                    </span>
                    <Button className={cn("hashtag")}>#lyrics</Button>
                    <Button className={cn("hashtag")}>#giacmocothat</Button>
                    <Button className={cn("hashtag")}>#nhachaymoingay</Button>
                    <Button className={cn("hashtag")}>#tinhyeu</Button>
                    <Button className={cn("hashtag")}>#tamtrang</Button>
                    <Button className={cn("hashtag")}>#tinhyeu</Button>
                    <Button className={cn("hashtag")}>
                        #voiceeffectsforyou
                    </Button>
                </div>
                <Button
                    className={cn("hashtag", "music")}
                    leftIcon={music}
                >
                    Timber LHT - 𝐿𝑒 𝐻𝑢𝑦𝑒𝑛 𝑇𝑟𝑎𝑛𝑔🐰
                </Button>
                <div className={cn("video-container")}>
                    <video
                        className={cn("video")}
                        controls
                        src='https://v16-webapp.tiktok.com/b79ada0af0b8f72e253b485e512b974b/6357bd01/video/tos/alisg/tos-alisg-pve-0037/85b2ad386e334aec98aa276cac2c576e/?a=1988&ch=0&cr=0&dr=0&lr=tiktok&cd=0%7C0%7C1%7C0&cv=1&br=3070&bt=1535&cs=0&ds=3&ft=kLO5qy-gZmo0P3rTBBkVQtqKViHKJdmC0&mime_type=video_mp4&qs=0&rc=NmhkOmg0N2Y1ZGZnaThlNEBpM2h1N2k6Zmk6ZjMzODgzNEAxYzUvYGIuXjUxLWEuLzMvYSNzM2xlcjRnNGBgLS1kLy1zcw%3D%3D&l=2022102504391501024401221613257FEB&btag=80000'
                    />
                    <div className={cn("actions")}>
                        <div className={cn("action")}>
                            <div
                                className={cn("act-btn")}
                                onClick={handleLike}
                            >
                                <motion.img
                                    alt='img'
                                    variants={animations}
                                    src={isLike ? pink_heart : black_heart}
                                    animate={isLike ? "like" : "unlike"}
                                />
                            </div>
                            <span className={cn("act-text")}>130K</span>
                        </div>
                        <div className={cn("action")}>
                            <div className={cn("act-btn")}>
                                <img
                                    alt='img'
                                    src={comment}
                                />
                            </div>
                            <span className={cn("act-text")}>2602</span>
                        </div>
                        <div className={cn("action")}>
                            <div className={cn("act-btn")}>
                                <img
                                    alt='img'
                                    src={share}
                                />
                            </div>
                            <span className={cn("act-text")}>20K</span>
                        </div>
                    </div>
                </div>
            </div>

            {isFollow ? (
                <Button
                    onClick={handleChangeFollower}
                    className={cn("following")}
                    outline
                >
                    <p className={cn("fling-text")}>Following</p>
                </Button>
            ) : (
                <Button
                    onClick={handleChangeFollower}
                    className={cn("follow")}
                    outline
                >
                    <p className={cn("fl-text")}>Follow</p>
                </Button>
            )}
        </FrameRecommendVideo>
    );
}

export default VideoInfor;