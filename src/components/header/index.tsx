
import { FiShoppingCart } from 'react-icons/fi'
import { Link } from 'react-router'
import logo from '../../assets/logo.svg'
import { useContext } from 'react'
import { CartContext } from '../../context/CartContext'

export function Header() {

    const { cartAmount } = useContext(CartContext)

    return (
        <header className='flex bg-white'>
            <nav className='w-full max-w-7xl h-14 flex justify-between m-auto py-4 px-4 md:px-2 mb-2'>
                <Link className='font-bold text-2xl' to="/">
                    <img src={logo} alt="logo"/>
                </Link>
                <Link className='relative' to="/cart">
                    <FiShoppingCart size={24} color='#121212' />
                    {cartAmount > 0 && (
                        <span className='absolute -right-3 -top-3 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs'>
                            {cartAmount}
                        </span>
                    )}
                </Link>
            </nav>

        </header>
    )
}