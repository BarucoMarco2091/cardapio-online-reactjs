import { createContext, type ReactNode, useState } from "react";
import { type HamburgerProps } from "../pages/home";

interface CartContextData {
    cart: CartProps[];
    cartAmount: number;
    addItem: (newItem: HamburgerProps) => void;
    removeItem: (product: CartProps) => void;
    total: string;
}

interface CartProps {
    id: string;
    name: string;
    description: string;
    price: number;
    uid: string;
    images: ImageItemProps[];
    amount: number;
    total: number;
}

interface ImageItemProps {
    uid: string;
    name: string;
    url: string;
}

interface CartProviderProps {
    children: ReactNode;
}

export const CartContext = createContext({} as CartContextData)

function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartProps[]>([])
    const [total, setTotal] = useState("")

    function addItem(newItem: HamburgerProps) {
        const indexItem = cart.findIndex(cart => cart.id === newItem.id)
        if (indexItem !== -1) {
            let cartList = cart
            cartList[indexItem].amount = cartList[indexItem].amount + 1
            cartList[indexItem].total = cartList[indexItem].price * cartList[indexItem].amount
            setCart(cartList)
            totalResultCart(cartList)
            return
        }

        let data = {
            ...newItem,
            amount: 1,
            total: newItem.price
        }

        setCart(products => [...products, data])
        totalResultCart([...cart, data])
    }

    function removeItem(product: CartProps) {
        const indexItem = cart.findIndex((item) => item.id === product.id)
        if (cart[indexItem]?.amount > 1) {
            let cartList = cart
            cartList[indexItem].amount = cartList[indexItem].amount - 1
            cartList[indexItem].total = cartList[indexItem].total - cartList[indexItem].price
            setCart(cartList)
            totalResultCart(cartList)
            return
        }

        const cartItem = cart.filter((item) => item.id !== product.id)
        setCart(cartItem)
        totalResultCart(cartItem)
    }

    function totalResultCart(items: CartProps[]) {
        let myCart = items
        // percorre o array pegando o subtotal adicionando aos outros subtotais
        //reduce((acumulador, objeto : que é o item) 
        let result = myCart.reduce((acc, obj) => { return acc + obj.total }, 0)
        const formatedResult = result.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        setTotal(formatedResult)
    }

    return (
        <CartContext.Provider value={{ cart, cartAmount: cart.length, addItem, removeItem, total }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider