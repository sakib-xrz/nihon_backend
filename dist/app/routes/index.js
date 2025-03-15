"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const product_routes_1 = require("../modules/Product/product.routes");
const category_routes_1 = require("../modules/Category/category.routes");
const brand_routes_1 = require("../modules/Brand/brand.routes");
const user_routes_1 = require("../modules/User/user.routes");
const bKash_routes_1 = require("../modules/BKash/bKash.routes");
const order_routes_1 = require("../modules/Order/order.routes");
const review_routes_1 = require("../modules/Review/review.routes");
const customization_routes_1 = require("../modules/Customization/customization.routes");
const subscribe_routes_1 = require("../modules/Subscribe/subscribe.routes");
const contact_us_routes_1 = require("../modules/ContactUs/contact_us.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: '/user',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/category',
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: '/brand',
        route: brand_routes_1.BrandRoutes,
    },
    {
        path: '/product',
        route: product_routes_1.ProductRoutes,
    },
    {
        path: '/review',
        route: review_routes_1.ReviewRoutes,
    },
    {
        path: '/bkash',
        route: bKash_routes_1.bKashRoutes,
    },
    {
        path: '/order',
        route: order_routes_1.OrderRoutes,
    },
    {
        path: '/customization',
        route: customization_routes_1.CustomizationRoutes,
    },
    {
        path: '/subscribe',
        route: subscribe_routes_1.SubscribeRoutes,
    },
    {
        path: '/contact_us',
        route: contact_us_routes_1.ContactUsRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
