import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProductItem from "../utils/ProductItem/ProductItem";
import { pageSearch } from "../../../Redux/ProductRedux/actionProduct";
import { useLocation } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import Loading2 from "../utils/Loading/Loading2";
import Slide from "../utils/Slide/Slide";
const PageSearch = () => {
    const { search } = useLocation();

    // const { isLoad, error, products } = useSelector((state) => state.products);
    const [products, setProducts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(
        () =>
            (async () => {
                setLoading(true);
                const data = await dispatch(pageSearch(search));
                if (data.success) {
                    setProducts(data.pros);
                    setLoading(false);
                }
            })(),
        [search]
    );

    return (
        <div className="grid wide">
            {Loading && <Loading2 mid={true} />}
            {!Loading && products.length === 0 && (
                <>
                    <h1 className="text-center text-muted mb-4 mt-4">
                        Không có kết quả tìm kiếm phù hợp
                    </h1>
                    <Slide title={"Bạn sẽ thích"} />
                </>
            )}
            {!Loading && products.length !== 0 && (
                <>
                    <div className="row bg-light my-3 py-2">
                        <ul className="list-search d-flex align-items-center mb-0 ps-0">
                            <li className="list-item-search px-3 btn-sm">
                                Sắp xếp theo
                            </li>
                            <li className="list-item-search px-3 btn btn-sm  me-2 btn btn-active">
                                Liên Quan
                            </li>
                            <li className="list-item-search px-3 btn btn-sm btn-white me-2">
                                Mới nhất
                            </li>
                            <li className="list-item-search px-3 btn btn-sm btn-white me-2">
                                Bán Chạy
                            </li>
                            <li
                                className="list-item-search list-item-search-prize d-flex justify-content-between btn-white position-relative"
                                style={{ width: "200px" }}
                            >
                                <span className="search-text">Giá</span>
                                <span className="search-text-icon">
                                    <i className="fas fa-arrow-down text-secondary"></i>
                                </span>
                                <div className="list-search-wrap position-absolute list-group w-100 bridge">
                                    <div className="list-group-item">
                                        Giá : Từ thấp đến cao
                                    </div>
                                    <div className="list-group-item">
                                        Giá : Từ cao đến thấp
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul className="pagination-group ms-auto ps-0 mb-0 d-flex">
                            <li className="list-item-search pe-0">
                                <span className="pagination-search-page text-danger">
                                    1
                                </span>
                                /
                                <span className="pagination-search-total">
                                    10
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
                        {products.map((item) => (
                            <div
                                key={uuid4()}
                                className="col mid-product l-2-5"
                            >
                                <ProductItem item={item} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PageSearch;
