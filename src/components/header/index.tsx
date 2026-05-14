import logoImg from '../../assets/logo.svg'
import { FiShoppingCart } from 'react-icons/fi'
import { Link } from 'react-router'

export function Header() {
    return (
        <header className='flex bg-white'>
            <nav className='w-full max-w-7xl h-14 flex justify-between m-auto py-3 mb-2'>
                <Link className='font-bold text-2xl' to="/">
                    <img src={logoImg} alt="logo" />
                </Link>
                <Link className='relative' to="/cart">
                    <FiShoppingCart size={24} color='#121212' />
                    <span className='absolute -right-3 -top-3 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs'>
                        2
                    </span>
                </Link>
            </nav>

        </header>
    )
}