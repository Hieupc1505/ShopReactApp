import React, { useEffect, useState } from "react";
// import ArowBackIosIcon from "@material-ui/icons/ArrowBackIos";
// import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
// import { ListAlt } from "@material-ui/icons";
import ImgData from "../helpers/Imgs";

const Carousel = () => {
    const [imgState, setImgState] = useState(ImgData);
    // const [index, setIndex] = useState(1);
    let container = React.createRef();
    let slide = React.createRef();
    let index = 1;
    let slideId;

    useEffect(() => {
        setImgState(ImgData);
    }, []);

    useEffect(() => {
        let wrap = container.current;
        let slideMain = slide.current;
        let listItemSlide = slideMain.querySelectorAll(".carousel-slide");
        // let wrap = container.current;
        // let listSlide = slide.current;
        let pre = document.querySelector(".pre");
        let next = document.querySelector(".next");
        // let list = listSlide.querySelectorAll(".carousel-slide");
        // // let slideWrap = container.querySelector(".carousel-inner");

        let firstSlide = listItemSlide[0].cloneNode(true);
        let lastSlide = listItemSlide[listItemSlide.length - 1].cloneNode(true);

        firstSlide.id = "first-id";
        lastSlide.id = "last-id";

        slideMain.appendChild(firstSlide);
        slideMain.insertBefore(lastSlide, listItemSlide[0]);
        // setImgState([imgState[imgState.length - 1], ...imgState, imgState[0]]);

        let WidthSlide = listItemSlide[index].clientWidth;

        slideMain.style.transform = `translateX(-${WidthSlide}px)`;

        const running = (n) => {
            // slideMain = slide.current;
            listItemSlide = slideMain.querySelectorAll(".carousel-slide");

            if (index >= listItemSlide.length - 1) return;
            if (index <= 0) return;
            index += n;
            slideMain.style.transform = `translateX(-${WidthSlide * index}px)`;
            slideMain.style.transition = ".8s";
        };

        const runSlide = () => {
            slideId = setInterval(() => {
                running(1);
            }, 2000);
        };

        slideMain.addEventListener("transitionend", () => {
            listItemSlide = slideMain.querySelectorAll(".carousel-slide");
            if (listItemSlide[index].id === firstSlide.id) {
                slideMain.style.transition = "none";
                index = 1;
                slideMain.style.transform = `translateX(-${
                    WidthSlide * index
                }px)`;
            } else if (listItemSlide[index].id === lastSlide.id) {
                slideMain.style.transition = "none";
                index = listItemSlide.length - 2;
                slideMain.style.transform = `translateX(-${
                    WidthSlide * index
                }px)`;
            }
        });

        wrap.addEventListener("mouseover", () => {
            clearInterval(slideId);
        });
        wrap.addEventListener("mouseleave", () => {
            runSlide(1);
        });

        next.addEventListener("click", () => {
            running(1);
        });
        pre.addEventListener("click", () => {
            running(-1);
        });
        runSlide();
    }, [imgState]);
    return (
        <div className="carousel" ref={container}>
            <div className="carousel-inner" ref={slide}>
                {imgState &&
                    imgState.map((item, index) => (
                        <div className="carousel-slide" key={index}>
                            <img src={item} alt="" />
                        </div>
                    ))}
            </div>
            <div className="carousel-control">
                <span className="ctl pre">
                    <i className="ctl-icon small fas fa-arrow-left"></i>
                </span>
                <span className="ctl next">
                    <i className="ctl-icon small fas fa-arrow-right"></i>
                </span>
            </div>
        </div>
    );
};
export default Carousel;
