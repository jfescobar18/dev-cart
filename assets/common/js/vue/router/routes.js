import home from '../components/home.js'
import shop from '../components/shop.js'
import search_result from '../components/search-result.js'
import about from '../components/about.js'
import privacy_notice from '../components/privacy-notice.js'
import navbar from '../components/navbar.js'
import search from '../components/search.js'
import slider from '../components/slider.js'
import product_display from '../components/product-display.js'
import product_card from '../components/product-card.js'
import ranking from '../components/ranking.js'
import buy_product from '../components/buy-product.js'
import product_information from '../components/product-information.js'
import cart from '../components/cart.js'
import off_banner from '../components/off-banner.js'
import all_products from '../components/all-products.js'
import cart_card from '../components/cart-card.js'
import checkout from '../components/checkout.js'
import payment from '../components/payment.js'
import coming_soon from '../components/coming-soon.js'
import cart_footer from '../components/cart-footer.js'

const routes = [
    {
        path: '/coming-soon',
        name: 'coming-soon',
        component: coming_soon
    },
    {
        path: '/',
        name: 'home',
        component: home
    },
    {
        path: '/shop/:category?/',
        name: 'shop',
        component: shop
    },
    {
        path: '/search-result/:SearchWord/',
        name: 'search-result',
        component: search_result
    },
    {
        path: '/about',
        name: 'about',
        component: about
    },
    {
        path: '/privacy-notice',
        name: 'privacy-notice',
        component: privacy_notice
    },
    {
        path: '/buy/:Product_Id',
        name: 'buy',
        component: buy_product
    },
    {
        path: '/cart',
        name: 'cart',
        component: cart
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: checkout
    },
    {
        path: '/payment',
        name: 'payment',
        component: payment
    }
];

const router = new VueRouter({
    routes
});

export default router;