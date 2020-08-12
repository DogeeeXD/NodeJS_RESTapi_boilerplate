import passport from 'passport';
import config from '../config/config';
import { allowOnly } from '../services/routesHelper';
import {
    fetchProducts, 
    fetchProductImage
} from '../controllers/product.js';

module.exports = (app) => {
    // Use GET to fetch data without passing request body
    app.get(
        '/api/products',
        passport.authenticate('jwt', {
            session: false,
        }),
        fetchProducts
    )
    
    // Use POST if request body is needed
    app.post(
        '/api/productImage',
        passport.authenticate('jwt', {
            session: false,
        }),
        fetchProductImage,
    )

};