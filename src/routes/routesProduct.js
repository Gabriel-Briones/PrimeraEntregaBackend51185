import { Router } from "express";
import { productGet, getProductById, productPost, productPut, productDelete } from './logicPRoutes.js'

const productRouter = Router()

productRouter.get('/', productGet)
productRouter.get('/:id', getProductById)
productRouter.post('/', productPost)
productRouter.put('/:id', productPut)
productRouter.delete('/:id', productDelete)

export default productRouter