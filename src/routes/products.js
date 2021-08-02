const router = require("express").Router();
const proControl = require("../app/controller/proController");
const categoryCtrl = require("../app/controller/categoryCtrl");
const cartControler = require("../app/controller/cartCtrl");
const auth = require("../app/middleware/authToken");

router
    .route("/products")
    .get(proControl.getPros)
    .post(auth.authToken, auth.authAdmin, proControl.postPros);
router.get("/products/search", proControl.searchPro);
router.get("/page/search", proControl.pageSearch);
// router.get("/getpros/:categoryId", proControl.getProByCateId);
router.get("/slide", proControl.getSlide);
router.route("/products/:id").get(proControl.getSinglePro);
router
    .route("/categories")
    .get(auth.authToken, auth.authAdmin, categoryCtrl.getCategory)
    .post(auth.authToken, auth.authAdmin, categoryCtrl.postCategory);
router.route("/cart").get(auth.authToken, cartControler.getCarts);
router.post("/cart/add", auth.authToken, cartControler.postCart);
// router.post("/order", auth.authToken, proControl.userOrder);
module.exports = router;
