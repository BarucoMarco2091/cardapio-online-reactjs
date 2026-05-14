import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '../../components/container'
import { Input } from '../../components/input'
import logoImg from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router'
import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { useEffect } from 'react'

const schema = z.object({
    name: z.string().nonempty("Campo obrigatório"),
    email: z.string().email("Insira um email válido").nonempty("campo obrigatório"),
    password: z.string().min(8).nonempty("campo obrigatório")
})

type FormData = z.infer<typeof schema>

export function Register() {

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    useEffect(() => {

        async function handleLogout() {
            await signOut(auth)
        }

        handleLogout()

    }, [])

    async function onSubmit(data: FormData) {
        console.log(data)
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user) => {
            await updateProfile(user.user, {
                displayName: data.name
            })
            console.log("Cadastrado com sucesso!")
            navigate("/dashboard", { replace: true })
        })
        .catch(err => {
            console.log(err)
            console.log("Erro ao cadastrar")
        })
    }

    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <Link to="/" className="mb-6 max-w-sm w-full">
                    <img
                        className="w-full"
                        src={logoImg}
                        alt="" />
                </Link>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-xl w-full rounded-lg">
                    <div className="mb-3">
                        <Input
                            type="name"
                            name="name"
                            placeholder="Digite seu nome..."
                            register={register}
                            error={errors.name?.message}
                        />
                    </div>

                    <div className="mb-3">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Digite seu email..."
                            register={register}
                            error={errors.email?.message}
                        />
                    </div>

                    <div className="mb-3">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Digite sua senha..."
                            register={register}
                            error={errors.password?.message}
                        />
                    </div>
                    <button type="submit" className='bg-zinc-900 w-full runded-md text-white h-10 font-medium'>Cadastrar</button>
                </form>
                <Link to="/login">
                    Já possui uma conta? Faça o login!
                </Link>
            </div>
        </Container>
    )
}