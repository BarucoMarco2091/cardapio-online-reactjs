import { createContext, type ReactNode, useState, useEffect } from "react";
import { type HamburgerProps } from "../pages/home";
import { toast } from "react-toastify"

interface CartContextData {
    cart: CartProps[];
    cartAmount: number;
    addItem: (newItem: HamburgerProps) => void;
    removeItem: (product: CartProps) => void;
    clearCart: () => void;
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
    // 1 salvar a lista
    // 2 listar
    // 3 editar 
    function saveLocalStorage(list: CartProps[]) {
        localStorage.setItem("hamburguercart", JSON.stringify(list))
    }

    function getLocalStorage() {
        const response = localStorage.getItem("hamburguercart")
        if(!response) return null
        const responseJson = JSON.parse(response)
        setCart(responseJson)
        totalResultCart(responseJson)
    }

    useEffect(() => {

        getLocalStorage()
    }, [])

    function addItem(newItem: HamburgerProps) {
        const indexItem = cart.findIndex(cart => cart.id === newItem.id)
        if (indexItem !== -1) {

            let cartList = cart
            cartList[indexItem].amount = cartList[indexItem].amount + 1
            cartList[indexItem].total = cartList[indexItem].price * cartList[indexItem].amount
            setCart(cartList)
            saveLocalStorage(cartList)
            totalResultCart(cartList)
            return
        }

        let data = {
            ...newItem,
            amount: 1,
            total: newItem.price
        }

        saveLocalStorage([...cart, data])
        setCart(products => [...products, data])
        totalResultCart([...cart, data])
        toast.success("Item adicionado no carrinho!")
    }

    function removeItem(product: CartProps) {
        const indexItem = cart.findIndex((item) => item.id === product.id)
        if (cart[indexItem]?.amount > 1) {
            let cartList = cart
            cartList[indexItem].amount = cartList[indexItem].amount - 1
            cartList[indexItem].total = cartList[indexItem].total - cartList[indexItem].price
            setCart(cartList)
            totalResultCart(cartList)
            saveLocalStorage(cartList)
            return
        }

        const cartItem = cart.filter((item) => item.id !== product.id)
        saveLocalStorage(cartItem)
        setCart(cartItem)
        totalResultCart(cartItem)
          toast.success("Item removido do carrinho!")
    }

    function totalResultCart(items: CartProps[]) {
        let myCart = items
        // percorre o array pegando o subtotal adicionando aos outros subtotais
        //reduce((acumulador, objeto : que é o item) 
        let result = myCart.reduce((acc, obj) => { return acc + obj.total }, 0)
        const formatedResult = result.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        setTotal(formatedResult)
    }

    function clearCart() {
        setCart([])
        setTotal("R$ 0,00")
        localStorage.removeItem("hamburguercart")
    }

    return (
        <CartContext.Provider value={{ cart, cartAmount: cart.length, addItem, removeItem, total, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider