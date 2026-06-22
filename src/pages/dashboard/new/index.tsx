import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/panelHeader"
import { FiUpload, FiTrash } from "react-icons/fi"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../../../components/input"
import { type ChangeEvent, useContext, useState } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { db } from "../../../services/firebaseConnection"
import { addDoc, collection } from "firebase/firestore"
import { v4 as uuidV4 } from 'uuid'
import { storage } from "../../../services/firebaseConnection"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    price: z.number(),
    description: z.string().nonempty("O campo descrição é obrigatório")
}).strict()

type FormData = z.infer<typeof schema>

interface ImageItemProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export function New() {

    const [hamburgerImages, setHamburgerImages] = useState<ImageItemProps[]>([])
    const { user } = useContext(AuthContext)
    const { handleSubmit, register, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),

        mode: "onChange"
    })

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUploadImage(image)
            } else {
                alert("Envie uma imagem jpeg ou png!")
                return
            }
        }
    }

    function handleUploadImage(image: File) {
        if (!user?.uid) {
            return
        }

        const currentUid = user.uid
        const uidImage = uuidV4()
        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)
        uploadBytes(uploadRef, image)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadUrl) => {
                    console.log(downloadUrl)
                    const imageItem = {
                        uid: currentUid,
                        name: uidImage,
                        previewUrl: URL.createObjectURL(image),
                        url: downloadUrl,
                    }

                    setHamburgerImages((images) => [...images, imageItem])
                })
            })
    }

    async function handleDelete(item: ImageItemProps) {
        const imagePath = `images/${item.uid}/${item.name}`
        const imageRef = ref(storage, imagePath)
        try {
            await deleteObject(imageRef)
            setHamburgerImages(hamburgerImages.filter((hamburger) => hamburger.url !== item.url))
        } catch (err) {
            console.log("erro")
        }
    }

    function onSubmit(data: FormData) {
        console.log(data)
        if (hamburgerImages.length === 0) {
            alert("Envie uma imagem do lanche")
            return
        }

        const hamburgerListImages = hamburgerImages.map((car) => {
            return {
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })

        addDoc(collection(db, "hamburgers"), {
            name: data.name,
            description: data.description,
            price: data.price,
            created: new Date(),
            user: user?.uid,
            owner: user?.name,
            images: hamburgerListImages
        })
            .then(() => {
                reset()
                setHamburgerImages([])
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Container>
            <DashboardHeader/>
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer">
                        <input className="opacity-0 cursor-pointer" type="file" accept="image/*" onChange={handleFile} />
                    </div>
                </button>

                {hamburgerImages.map(item => (
                    <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
                        <button className="absolute" onClick={() => handleDelete(item)}>
                            <FiTrash size={24} color="#FFF" />
                        </button>
                        <img
                            src={item.previewUrl}
                            className="rounded-lg w-full h-32 object-cover"
                            alt="foto" />
                    </div>
                ))}
            </div>
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form
                    className="w-full"
                    onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <p>Nome do lanche</p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Ex: Cheeseburger"
                        />
                    </div>

                    <div className="mb-3">
                        <p>Preço do lanche</p>
                        <Input
                            type="number"
                            register={register}
                            
                            error={errors.price?.message}
                            placeholder="Ex: R$ 25.90"
                            {...register("price", {
                                valueAsNumber: true
                            })}
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea
                            className="border-2 w-full rounded-md h-24 px-2"
                            {...register("description")}
                            name="description"
                            id="description"
                            placeholder="Digite a descrição completa sobre o lanche..."
                        />

                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                    </div>
                    <button type="submit" className="rounded-md bg-zinc-900 text-white font-medium w-full cursor-pointer h-10">
                        Cadastrar
                    </button>
                </form>
            </div>
        </Container>
    )
}