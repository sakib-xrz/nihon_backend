import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { ProductRoutes } from '../modules/Product/product.routes';
import { CategoryRoutes } from '../modules/Category/category.routes';
import { BrandRoutes } from '../modules/Brand/brand.routes';
import { UserRoutes } from '../modules/User/user.routes';
import { bKashRoutes } from '../modules/BKash/bKash.routes';
import { OrderRoutes } from '../modules/Order/order.routes';
import { ReviewRoutes } from '../modules/Review/review.routes';
import { CustomizationRoutes } from '../modules/Customization/customization.routes';
import { SubscribeRoutes } from '../modules/Subscribe/subscribe.routes';
import { ContactUsRoutes } from '../modules/ContactUs/contact_us.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/brand',
    route: BrandRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/bkash',
    route: bKashRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/customization',
    route: CustomizationRoutes,
  },
  {
    path: '/subscribe',
    route: SubscribeRoutes,
  },
  {
    path: '/contact_us',
    route: ContactUsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
