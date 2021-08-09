import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import io from "socket.io-client";
import "./chatbox.css";
import axios from "axios";
import { useSelector } from "react-redux";

const socket = io("https://serverchat69.herokuapp.com");
// https://serverchat69.herokuapp.com
const ChatBox = () => {
    const { user, isAuth, isLoad } = useSelector((state) => state.userAuth);
    let [mes, setMes] = useState("");
    const [chat, setChat] = useState({
        chats: [],
        onl: 0,
    });
    let text = useRef();

    useEffect(() => {
        socket.on("usercn", (payload) => {
            setChat({
                ...chat,
                onl: payload.onl,
            });
        });
        socket.on("client", (payload) => {
            setChat({
                ...chat,
                onl: payload.onl,
            });
        });
        socket.on("res", (payload) => {
            setChat({
                chats: [...chat.chats, payload.chat],
                onl: payload.onl,
            });
        });

        // socket.on("con", (payload) => {
        //     console.log(payload);
        //     setChat({
        //         ...chat,
        //         onl: payload.onl,
        //     });
        // });
        socket.on("dis", (payload) => {
            setChat({
                ...chat,
                onl: payload.onl,
            });
        });
    });
    useEffect(
        () =>
            (async () => {
                const { data } = await axios
                    .get("/chat/read")
                    .catch((err) => console.log(err));
                if (data && data.success) {
                    setChat({
                        ...chat,
                        chats: [...data.chat],
                    });
                }
            })(),

        []
    );
    const handleChangeInput = (e) => {
        setMes(e.target.value);
    };

    const validMes = (mes) => {
        // let check = null;
        // const arrTx = mes.split(" ");
        const ban = /(boài|lồn|địt|đ!t)/gi;
        // check = arrTx.some((item) => {
        //     console.log(item);
        //     let reg = new RegExp(item, "gi");
        //     return reg.test(ban);
        // });
        const check = ban.test(mes);
        return !!check;
    };

    const sendMess = async (text) => {
        const check = validMes(text);
        if (text && !check && isAuth) {
            const createdAt = new Date().toISOString();
            const payload = {
                name: user.userName,
                mes: text,
                avata: user.avata,
                createdAt,
                userId: user.userId,
            };
            socket.emit("message", payload);

            await axios.post("/chat/add", {
                mes: text,
            });
        } else {
            alert("Cái Loại mất dạy!!");
        }
        setShow({ ...show, send: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        document.querySelector("input.input-chat").blur();
        text.current = mes;
        setMes("");
        await sendMess(text.current);
    };

    const chatRender = () => {
        // const handleTime = (tar) => {
        //     const real = new Date();
        //     const time = new Date(tar);
        //     if (real.getDay() === time.getDay())
        //         return `${time.getHours()}:${time.getMinutes()}`;
        //     else
        //         return `T${time.getDay() + 1} ${
        //             time.getHours
        //         }:${time.getMinutes()}`;
        // };
        return chat.chats.map(
            ({ name, mes, avata, createdAt, userId }, index) =>
                userId !== user.userId ? (
                    <li
                        className="list-chat-item d-flex align-items-end"
                        key={index}
                    >
                        <img
                            src={
                                user.avata
                                    ? user.avata.url
                                    : "https://res.cloudinary.com/develope-app/image/upload/v1626161751/images_j0qqj4.png"
                            }
                            alt="avatar"
                            className="list-chat-img me-2"
                        />
                        <div className="list-chat-me flex-fill">
                            {/* {createdAt && (
                        <small className="text-secondary">
                            {handleTime(createdAt)}
                        </small>
                    )} */}
                            <div className="list-chat-name small">{name}</div>
                            <div className="list-chat-content">{mes}</div>
                        </div>
                    </li>
                ) : (
                    <li
                        className="list-chat-item d-flex align-items-end justify-content-end"
                        key={index}
                    >
                        <div className="list-chat-me">
                            {/* {createdAt && (
                        <small className="text-secondary">
                            {handleTime(createdAt)}
                        </small>
                    )} */}

                            <div className="list-chat-content bg-primary text-white">
                                {mes}
                            </div>
                        </div>
                    </li>
                )
        );
    };
    const [show, setShow] = useState({
        box: false,
        send: false,
    });
    useLayoutEffect(() => {
        const wrap = document.querySelector(".chat-box-body");
        const list = document.querySelector(".list-chat");
        if (show.box && list) {
            wrap.scrollTo(0, list.scrollHeight);
            document
                .querySelector("input.form-control")
                .addEventListener("focus", function () {
                    setShow({ ...show, send: true });
                });
            document
                .querySelector("input.form-control")
                .addEventListener("blur", function () {
                    const text = this.value;
                    if (!text) setShow({ ...show, send: false });
                });
        }
    }, [chat.chats.length, show.box]);

    return (
        <>
            {!show.box && (
                <div
                    className="chat-icon position-fixed"
                    onClick={() => setShow({ ...show, box: true })}
                >
                    <svg
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    >
                        <defs>
                            <linearGradient id="gradient">
                                <stop offset="0%" stopColor="#098eff" />
                                <stop offset="50%" stopColor="#9a35ff" />

                                <stop offset="100%" stopColor="#ff5f73" />
                            </linearGradient>
                        </defs>
                        <path
                            id="chat-icon-mess"
                            d="M12 0c-6.627 0-12 4.975-12 11.111 0 3.497 1.745 6.616 4.472 8.652v4.237l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111 0-6.136-5.373-11.111-12-11.111zm1.193 14.963l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"
                        />
                    </svg>
                </div>
            )}
            {show.box && (
                <div className="chat-box  border rounded">
                    <div className="chat-box-header d-flex justify-content-between border-bottom py-2 px-3 align-items-center">
                        <div className="show-onl d-flex align-items-center ">
                            <h3>Chat</h3>

                            {chat.onl !== 0 && (
                                <span className="user-onl ms-2 position-relative">
                                    {chat.onl}
                                </span>
                            )}
                        </div>
                        <i
                            className="fas fa-times cursor-pointer"
                            onClick={() => setShow({ box: false, send: false })}
                        ></i>
                    </div>
                    <div className="chat-box-body pe-2">
                        {chat.chats.length === 0 && (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                <span className="text-secondary">
                                    Test đi nhìn cái gì!!
                                </span>
                            </div>
                        )}
                        {chat.chats.length !== 0 && (
                            <ul className="list-chat px-2">{chatRender()}</ul>
                        )}
                    </div>
                    <div className="chat-box-footer p-2">
                        <form
                            className="chat-contetn form-inline"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group d-flex align-items-center">
                                <i className="fas fa-plus-circle me-2"></i>
                                <input
                                    type="text"
                                    name="mes"
                                    id="mes"
                                    placeholder="Aa"
                                    className="form-control form-control-sm input-chat"
                                    value={mes}
                                    onChange={handleChangeInput}
                                    autoComplete="off"
                                />
                                {!show.send && (
                                    <i className="far fa-thumbs-up mx-2 cursor-pointer"></i>
                                )}
                                {show.send && (
                                    <i
                                        className="far fa-paper-plane cursor-pointer mx-2"
                                        onClick={sendMess}
                                    ></i>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;
