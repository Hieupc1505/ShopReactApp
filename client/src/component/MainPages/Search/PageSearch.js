import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import ProductItem from "../utils/ProductItem/ProductItem";
import { pageSearch } from "../../../Redux/ProductRedux/actionProduct";
import { useLocation } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import Loading2 from "../utils/Loading/Loading2";
import Slide from "../utils/Slide/Slide";
// import { sortPros } from "../../../Redux/ProductRedux/actionProduct";
import LoadSvg from "../utils/Loading/LoadSvg";

const PageSearch = () => {
    const { search } = useLocation();
    // const { isLoad, error, products } = useSelector((state) => state.products);
    const products = useRef();
    const [Loading, setLoading] = useState(true);
    const [showSvg, setShowSvg] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(15);
    const dispatch = useDispatch();

    const [currentPost, setCurrentPost] = useState([]);
    let indexOfLastPost = currentPage * postPerPage;
    let indexOfFirstPost = indexOfLastPost - postPerPage;
    useEffect(
        () =>
            (async () => {
                setLoading(true);
                const data = await dispatch(pageSearch(search));
                if (data && data.success) {
                    console.log(data);
                    products.current = data.pros;
                    setCurrentPost([]);
                    currentPage !== 1 && setCurrentPage(1);
                    setLoading(false);
                }
            })(),
        [search]
    );

    useEffect(() => {
        if (products.current)
            setCurrentPost([
                ...currentPost,
                ...products.current.slice(indexOfFirstPost, indexOfLastPost),
            ]);
    }, [currentPage]);
    useEffect(() => {
        if (products.current)
            setCurrentPost([
                ...products.current.slice(indexOfFirstPost, indexOfLastPost),
            ]);
    }, [Loading]);

    const sortPros = async (type) => {
        let pros;
        switch (type) {
            case "prizeaz":
                setLoading(true);
                pros = currentPost.sort((a, b) =>
                    a.proPrize > b.proPrize ? 1 : -1
                );
                setCurrentPost([...pros]);
                setLoading(false);
                break;
            case "prizeza":
                setLoading(true);
                pros = currentPost.sort((a, b) =>
                    a.proPrize < b.proPrize ? 1 : -1
                );
                setCurrentPost([...pros]);
                setLoading(false);
                break;
            case "new":
                setLoading(true);
                let newpros = currentPost.map((item) => {
                    item.updateAt = Date.parse(item.updateAt);
                    return item;
                });
                pros = newpros.sort((a, b) =>
                    a.updateAt > b.updateAt ? 1 : -1
                );
                setCurrentPost([...pros]);
                setLoading(false);
                break;
            default:
        }
    };
    useEffect(() => {
        if (!Loading && products.length !== 0) {
            const listItem = document.querySelectorAll(
                "ul .list-item-search:not(:first-child)"
            );
            function resetButton() {
                for (let i = 0; i < listItem.length; i++) {
                    listItem[i].classList.replace("btn-active", "btn-white");
                }
            }
            for (let i = 0; i < listItem.length; i++) {
                listItem[i].addEventListener("click", function (e) {
                    resetButton();
                    this.classList.add("btn-active");
                    // const text = e.target.getAttribute("sort");
                    // sortPros(text);
                });
            }
        }
    });
    const [prizeSort, setPrizeSort] = useState(null);
    const changePrizeSort = (text, sort) => {
        setPrizeSort(text);
        sortPros(sort);
    };

    useEffect(() => {
        if (!Loading) {
            let paginate = Math.ceil(products.current.length / postPerPage);
            let re = document.querySelector(".alkdajlasdk");
            console.log(paginate);
            window.onscroll = () => {
                let top = document.documentElement.scrollTop;
                let body = document.body.scrollHeight;
                let bottom = body - top - window.innerHeight;
                if (bottom < 15 && currentPage < paginate) {
                    setShowSvg(true);
                    setTimeout(() => setCurrentPage(currentPage + 1), 2200);
                    if (re) re.click();
                    setTimeout(() => setShowSvg(false), 2300);
                }
            };
        }
    });
    // console.log(products.current);
    return (
        <div className="grid wide">
            {Loading && <Loading2 mid={true} />}
            {!Loading && products.current.length === 0 && (
                <>
                    <h1 className="text-center text-muted mb-4 mt-4">
                        Không có kết quả tìm kiếm phù hợp
                    </h1>
                    <Slide title={"Bạn sẽ thích"} />
                </>
            )}
            {!Loading && products.current.length !== 0 && (
                <>
                    <div className="row bg-light my-3 py-2">
                        <ul className="list-search d-flex align-items-center mb-0 ps-0">
                            <li className="list-item-search px-3 btn-sm">
                                Sắp xếp theo
                            </li>
                            <li className="list-item-search px-3 btn btn-sm me-2 btn btn-active alkdajlasdk">
                                Liên Quan
                            </li>
                            <li
                                className="list-item-search px-3 btn btn-sm btn-white me-2"
                                onClick={() => sortPros("new")}
                            >
                                Mới nhất
                            </li>
                            <li
                                className="list-item-search px-3 btn btn-sm btn-white me-2"
                                sort="new"
                            >
                                Bán Chạy
                            </li>
                            <li
                                className="btn list-item-search list-item-search-prize d-flex justify-content-between btn-white position-relative"
                                style={{ width: "200px" }}
                            >
                                {!prizeSort && (
                                    <span className="search-text">Giá</span>
                                )}
                                {prizeSort && (
                                    <span className="search-text">
                                        {prizeSort}
                                    </span>
                                )}
                                <span className="search-text-icon">
                                    <i className="fas fa-arrow-down"></i>
                                </span>
                                <div
                                    className="list-search-wrap position-absolute list-group w-100 bridge"
                                    onClick={(e) => {
                                        let tar = e.currentTarget.parentElement;
                                        tar.classList.add("btn-active");
                                    }}
                                >
                                    <div
                                        className="list-group-item"
                                        onClick={() =>
                                            changePrizeSort(
                                                "Giá : Từ cao đến thấp",
                                                "prizeaz"
                                            )
                                        }
                                    >
                                        Giá : Từ thấp đến cao
                                    </div>
                                    <div
                                        className="list-group-item"
                                        onClick={() =>
                                            changePrizeSort(
                                                "Giá : Từ thấp đến cao",
                                                "prizeza"
                                            )
                                        }
                                        sort="prize-za"
                                    >
                                        Giá : Từ cao đến thấp
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul className="pagination-group ms-auto ps-0 mb-0 d-flex">
                            <li className="list-item-search pe-0">
                                <span className="pagination-search-page text-danger">
                                    {currentPage}
                                </span>
                                /
                                <span className="pagination-search-total">
                                    {products.current &&
                                        Math.ceil(
                                            products.current.length /
                                                postPerPage
                                        )}
                                </span>
                            </li>
                            <li className="list-item-search d-flex">
                                <span className="page-pre btn-sm bg-white">
                                    <i className="fas fa-arrow-left text-secondary"></i>
                                </span>
                                <span className="page-next btn-sm bg-white">
                                    <i className="fas fa-arrow-right text-secondary"></i>
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="row container-mid">
                        {currentPost &&
                            currentPost.map((item) => (
                                <div
                                    key={uuid4()}
                                    className="col mid-product l-2-5"
                                >
                                    <ProductItem item={item} />
                                </div>
                            ))}
                    </div>
                    {showSvg && <LoadSvg />}
                </>
            )}
        </div>
    );
};

export default PageSearch;
