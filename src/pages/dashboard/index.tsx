import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/panelHeader"
import { useEffect, useState } from "react"
import { db, storage } from "../../services/firebaseConnection"
import { ref, deleteObject } from "firebase/storage"
import { collection, query, orderBy, getDocs, doc, deleteDoc } from "firebase/firestore"
import { FiTrash2 } from "react-icons/fi"

interface HamburgerProps {
    id: string;
    name: string;
    description: string;
    price: number;
    uid: string;
    images: ImageItemProps[]
}

interface ImageItemProps {
    uid: string;
    name: string;
    url: string;
}

export function Dashboard() {

    const [hamburgers, setHamburgers] = useState<HamburgerProps[]>([])

    useEffect(() => {

        function loadHamburgers() {
            const hamburgerRef = collection(db, "hamburgers")
            const queryRef = query(hamburgerRef, orderBy("created", "desc"))
            getDocs(queryRef)
                .then((snapshot) => {
                    let listHamburgers = [] as HamburgerProps[]
                    snapshot.forEach((doc) => {
                        listHamburgers.push({
                            id: doc.id,
                            name: doc.data().name,
                            description: doc.data().description,
                            price: doc.data().price,
                            images: doc.data().images,
                            uid: doc.data().uid
                        })
                    })
                    setHamburgers(listHamburgers)
                })
        }

        loadHamburgers()

    }, [])

    async function handleDeleteHamburger(burger: HamburgerProps) {
        const itemBurger = burger
        const docRef = doc(db, "hamburgers", itemBurger.id)
        await deleteDoc(docRef)
        itemBurger.images.map(async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath)
            try {
                await deleteObject(imageRef)
                setHamburgers(hamburgers.filter(hamburger => hamburger.id !== itemBurger.id))
            } catch (err) {
                console.log("erro")
            }
        })
    }

    return (
        <Container>
            <DashboardHeader />
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hamburgers.map(burger => (
                    <div key={burger.id} className="w-full rounded-lg bg-white relative">
                        <button
                            onClick={() => handleDeleteHamburger(burger)}
                            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
                            <FiTrash2 size={26} color="#000" />
                        </button>
                        <img
                            className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                            src={burger.images[0].url}
                            alt="cheeseburger" />
                        <p className="font-bold mt-1 mb-2 px-2">{burger.name}</p>
                        <div className="flex flex-col px-2">
                            <p className="text-zinc-700 mb-6">{burger.description}</p>
                            <strong className="text-black font-medium text-xl">R$ {burger.price}</strong>
                        </div>
                    </div>
                ))}

            </section>
        </Container>
    )
}