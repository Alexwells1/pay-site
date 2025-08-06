import Footer from "../nav/footer";
import Header from "../nav/header";


export default function PaymentLayout({children}){
    return <main  className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-zinc-950 from-30% via-emerald-950 to-emerald-700">
        <Header />
        <section className="">
            {children}
        </section>
        <Footer/>
    </main>;
       
    
}