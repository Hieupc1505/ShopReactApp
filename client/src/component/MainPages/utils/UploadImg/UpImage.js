import React, { useState, useEffect } from "react";
import axios from "axios";
import "./upImage.css";
import { v4 as uuid4 } from "uuid";
import { SERVER } from "../../helpers/key";
import { convertNum } from "../../helpers/handleNum";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../../Redux/ProductRedux/actionProduct";

const UpImage = () => {
    // const [fileInputSate, setFileInputState] = React.useState("");
    // const [selectedFile, setSelectedFile] = React.useState("");

    // const {
    //     api: { getCategory },
    // } = useContext(userContext);

    const dispatch = useDispatch();
    const { user, isLoad, error } = useSelector((state) => state.userAuth);

    const [category, setCategory] = useState([]);

    // useEffect(() => {
    //     const data = dispatch(getCategory());
    // });

    const [images, setImages] = useState({
        main: null,
        imgArr: [],
    });
    const { main, imgArr } = images;
    // const [mainImg, setmainImg] = useState("");
    const [loading, setLoading] = useState(false);
    const [formValue, setFormValue] = useState({
        name: "",
        prize: "",
        promo: "",
        categoryId: "",
    });
    // const [category, setCategory] = useState([]);

    const refreshState = () => {
        setFormValue({
            name: "",
            prize: "",
            promo: "",
            categoryId: "",
        });

        setImages({
            main: "",
            imgArr: [],
        });
        hanldeClickSelect();
    };

    // console.log(formValue);
    useEffect(() => {
        (async () => {
            try {
                const res = await dispatch(getCategory());
                if (res.success) {
                    setCategory(res.categories);
                    setFormValue({
                        ...formValue,
                        categoryId: res.categories[0]._id,
                    });
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const handleFileInputChange = async (e) => {
        // if (images) deleteImage(images.public_id);

        try {
            const file = e.target.files;
            let ins = file.length;
            let formData = new FormData();

            for (let x = 0; x < ins; x++) {
                formData.append("files", file[x]);
            }
            // =================================///==================
            // if (!file) return alert("File is not exist");
            // if (file.size > 1024 * 1024) return alert("Size too large!!");
            // if (file.type !== "image/jpeg" && file.type !== "image/png")
            //     return alert("File format is incorrect");
            // formData.append("file", file);
            // =========================================================
            setLoading(true);
            const res = await axios.post(`${SERVER}/service/upload`, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            });
            setLoading(false);
            if (res.data.success)
                setImages({
                    main: res.data.imgs[0],
                    imgArr: res.data.imgs,
                });
        } catch (err) {
            console.log(err);
        }

        // previewFile(file);
    };

    const deleteImage = async (img) => {
        setLoading(true);
        const res = await axios.post(`${SERVER}/service/destroy`, {
            public_id: img.public_id,
        });

        setLoading(false);
        let newImgArr = [...imgArr];
        newImgArr.forEach((item, index) => {
            if (item.public_id === img.public_id) newImgArr.splice(index, 1);
            return newImgArr;
        });
        console.log(newImgArr);
        if (newImgArr.length > 0)
            setImages({
                main: newImgArr[0],
                imgArr: newImgArr,
            });
        else
            setImages({
                main: null,
                imgArr: [],
            });
        // setImages({
        //     main: null,
        //     imgArr: imgArr.forEach( (item, index) => {
        //         if( item.public_id === img.public_id ) imgArr.splice(0,1);
        //         return imgArr;
        //     }),
        // });
    };

    const handleClickImg = (item) => {
        setImages({ ...images, main: item });
    };

    const handleInput = (e) => {
        const text = e.target.value;
        setFormValue({ ...formValue, [e.target.name]: text });
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        let data = { ...formValue, images: images };

        data = {
            ...data,
            prize: convertNum(data.prize),
            promo: convertNum(data.promo),
        };

        const res = await axios.post(`${SERVER}/api/products`, data);
        if (res.data.success) {
            refreshState();
        } else {
            alert("have a error when post this product");
        }
    };

    const hanldeClickSelect = () => {
        (async () => {
            try {
                const res = await getCategory();
                if (res.success) {
                    setCategory(res.categories);
                }
            } catch (err) {
                setCategory(category);
            }
        })();
    };

    let imgStyle = images.imgArr.length
        ? { display: "block" }
        : { display: "none" };

    // const handleSubmitFile = (e) => {
    //     e.preventDefault();
    //     if (!previewSource) return;
    //     uploadImage(previewSource);
    // };

    // const uploadImage = async (base64EncodedImage) => {
    //     console.log(base64EncodedImage);
    //     try {
    //         await axios('http://localhost:5000/api/upload', )
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    return (
        <>
            <h1 className="text-center">Upload</h1>
            <div className="main d-flex">
                <div className="upimg l-4 px-4 flex-fill">
                    <div className="form-group img-upload h-100 position-relative">
                        <label
                            htmlFor="img"
                            className={
                                imgArr.length
                                    ? "d-none"
                                    : `l-12
                            w-100 h-100 border 
                            border-info d-flex 
                            justify-content-center 
                            align-items-center 
                            cursor-pointer`
                            }
                        >
                            <i className="fas fa-plus fs-1 text-warning"></i>
                        </label>
                        <input
                            className="d-none"
                            type="file"
                            multiple
                            name="file"
                            id="img"
                            onChange={handleFileInputChange}
                        />
                        <img
                            style={imgStyle}
                            src={imgArr.length ? main.url : ""}
                            alt="choosen"
                        />

                        {main && (
                            <i
                                className="far fa-times-circle img-close cursor-pointer text-danger"
                                onClick={() => deleteImage(main)}
                            ></i>
                        )}
                        <div className="list-img d-flex justify-content-between mt-4">
                            {imgArr.length !== 0 &&
                                imgArr.map((item) => (
                                    <div
                                        key={uuid4()}
                                        className="list-img-item cursor-pointer"
                                        style={{
                                            backgroundImage: `url('${item.url}')`,
                                        }}
                                        onClick={() => handleClickImg(item)}
                                    ></div>
                                ))}
                            {/* <div className="list-img-item border"></div>
                            <div className="list-img-item border"></div>
                            <div className="list-img-item border"></div> */}
                        </div>
                    </div>
                </div>
                <div className="form-wrap l-8 ps-2 pe-4">
                    <form
                        name="form-products"
                        className="form-products"
                        onSubmit={handleSubmitForm}
                    >
                        <div className="form-group form-control-product">
                            <label htmlFor="name">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formValue.name}
                                onChange={handleInput}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group form-control-product">
                            <label htmlFor="prize">Product Prize</label>
                            <input
                                type="text"
                                name="prize"
                                id="prize"
                                value={formValue.prize}
                                onChange={handleInput}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group form-control-product">
                            <label htmlFor="promo">Product Promotion</label>
                            <input
                                type="text"
                                name="promo"
                                value={formValue.promo}
                                onChange={handleInput}
                                id="promo"
                                className="form-control"
                            />
                        </div>
                        {/* <div className="form-group form-control-product">
                            <label htmlFor="status">Product Status</label>
                            <input
                                type="text"
                                name="status"
                                id="status"
                                value={formValue.status}
                                onChange={handleInput}
                                className="form-control"
                            />
                        </div> */}

                        <div className="form-group">
                            <label htmlFor="sel">Product Category</label>
                            <select
                                className="form-select"
                                id="sel"
                                onChange={handleInput}
                                value={formValue.categoryId}
                                name="categoryId"
                                onClick={hanldeClickSelect}
                            >
                                {category.length &&
                                    category.map((item, index) => (
                                        <option key={uuid4()} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                {/* <option value="1">Quần áo</option>
                                <option value="2">Giày dép</option>
                                <option value="3">Phụ kiện</option> */}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mt-4"
                        >
                            Đăng
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpImage;
