import { Container } from "../../components/container"
import bannerImg from "../../assets/bg (6).png"
import burgerImg from "../../assets/hamb-6 (1).png"

export function Home() {
    return (
        <main className="flex flex-col">
            <div>
                <img src={bannerImg} alt="" />
            </div>
            <Container>
                <h1 className="mt-9 text-4xl font-bold text-center mb-5">Cardápio</h1>
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="w-full rounded-lg bg-white">
                        <img 
                        className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                        src={burgerImg} 
                        alt="cheeseburger" />
                        <p className="font-bold mt-1 mb-2 px-2">Cheeseburger</p>
                        <div className="flex flex-col px-2">
                            <p className="text-zinc-700 mb-6">Descrição</p>
                            <strong className="text-black font-medium text-xl">R$ 20.00</strong>
                        </div>
                    </div>

                </section>
            </Container>
        </main>
    )
}