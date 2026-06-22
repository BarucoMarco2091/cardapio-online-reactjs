
import { useContext } from "react"
import { CartContext } from "../../context/CartContext"
import { Link } from "react-router"
import { FaWhatsapp } from 'react-icons/fa'

export function Cart() {
    // consumir o contexto
    const { cart, addItem, removeItem, total, clearCart } = useContext(CartContext)

    const products = cart.map(item => `${item.name} (${item.amount}x)`).join(",")

    return (
        <div className="w-full max-w-7xl mx-auto">

            <h1 className="font-medium text-2xl text-center my-4">Meu carrinho</h1>

            {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                    <p className="font-medium">Ops seu carrinho está vazio...</p>
                    <Link className="bg-slate-600 my-3 p-1 text-white font-medium rounded px-3" to="/">Acessar produtos</Link>
                </div>
            )}

            {cart.map((item) => (
                <section key={item.id} className="flex flex-col items-center justify-between border-b-2 border-gray-300 md:flex-row">
                    <img src={item.images[0].url} alt={item.name}
                        className="w-28 rounded-xl"
                    />

                    <strong>Preço: {item.price}</strong>
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => removeItem(item)} className="bg-red-500 px-2 rounded text-white font-medium flex items-center justify-center cursor-pointer hover:bg-green-700 transition-discrete ">
                            -
                        </button>
                        {item.amount}
                        <button onClick={() => addItem(item)} className="bg-red-500 px-2 rounded text-white font-medium flex items-center justify-center cursor-pointer hover:bg-green-700 transition-discrete">
                            +
                        </button>
                    </div>
                    <strong className="float-right">
                        SubTotal: {item.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </strong>

                </section>
            ))}

            {cart.length > 0 && (
                <a
                    onClick={clearCart}
                    target="_blank"
                    href={`https://api.whatsapp.com/send?phone=5511996221043&text=Olá! Tenho interesse nos seguintes produtos: ${products}. Total do pedido: ${total}`}
                    className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer hover:bg-red-500 transition-discrete">
                    Enviar pedido
                    <FaWhatsapp size={26} color="#FFF" />
                </a>
            )}

            {cart.length !== 0 && <p className="font-bold mt-4">Total: {total}</p>}
        </div>
    )
}