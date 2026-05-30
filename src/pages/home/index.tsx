import { Container } from "../../components/container"
import bannerImg from "../../assets/bg (6).png"
import { BsCartPlus } from 'react-icons/bs'
import { useContext } from "react"
import { useState, useEffect } from "react"
import { CartContext } from "../../context/CartContext"

import { db } from "../../services/firebaseConnection"
import { collection, query, orderBy, getDocs } from "firebase/firestore"

export interface HamburgerProps {
    id: string;
    name: string;
    description: string;
    price: number;
    uid: string;
    images: ImageItemProps[];
}

interface ImageItemProps {
    uid: string;
    name: string;
    url: string;
}

export function Home() {

    const [hamburgers, setHamburgers] = useState<HamburgerProps[]>([])
    const [loadImages, setLoadImages] = useState<string[]>([])
    const { addItem } = useContext(CartContext)

    useEffect(() => {

        function loadHamburgers() {
            const hamburgerRef = collection(db, "hamburgers")
            const queryRef = query(hamburgerRef, orderBy("created", "desc"))
            getDocs(queryRef)
                .then((snapshot) => {
                    let listBurgers = [] as HamburgerProps[]
                    snapshot.forEach((doc) => {
                        listBurgers.push({
                            id: doc.id,
                            name: doc.data().name,
                            description: doc.data().description,
                            price: doc.data().price,
                            images: doc.data().images,
                            uid: doc.data().uid
                        })
                    })
                    setHamburgers(listBurgers)
                })
        }

        loadHamburgers()

    }, [])

    function handleImageLoad(id: string) {
        // mantém as imagens carregadas , se não tiver nenhuma carregada passa o novo id da imagem que carregou
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
    }

    function handleAddItem(product: HamburgerProps) {
        console.log(product)
        addItem(product)
    }

    return (
        <main className="flex flex-col">
            <div>
                <img src={bannerImg} alt="" />
            </div>
            <Container>
                <h1 className="mt-9 text-4xl font-bold text-center mb-5">Cardápio</h1>
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {hamburgers.map(burger => (
                        <div key={burger.id} className="w-full rounded-lg bg-white">
                            <div style={{display: loadImages.includes(burger.id) ? "none" : "block"}}>
                                
                            </div>
                            <img
                                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                                src={burger.images[0].url}
                                 onLoad={() => handleImageLoad(burger.id)}
                                style={{display: loadImages.includes(burger.id) ? "block" : "none"}} 
                                alt="cheeseburger" />
                            <p className="font-bold mt-1 mb-2 px-2">{burger.name}</p>
                            <div className="flex flex-col px-2">
                                <p className="text-zinc-700 mb-6">{burger.description}</p>
                                <strong className="text-black font-medium text-xl">R$ {burger.price}</strong>
                            </div>
                            <button onClick={() => handleAddItem(burger)}>
                                <BsCartPlus size={20} color="#ff2c2c"/>
                            </button>
                        </div>
                    ))}

                </section>
            </Container>
        </main>
    )
}