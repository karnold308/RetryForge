import Hero from "./Hero"
import Calculator from "./Calculator"
import Problem from "./Problem"
import Solution from "./Solution"
import HowItWorks from "./HowItWorks"
import Comparisons from "./Comparisons"
import SocialProof from "./SocialProof"
import FinalCall from "./FinalCall"
import MainPricing from "./MainPricing"
import { FAQ } from "./FAQ"


 export default function Main() {
    return (
        <main>
            <Hero />
            <Calculator />
            <Problem />
            <Solution />
            <HowItWorks />
            <Comparisons />
            <MainPricing />
            <FAQ />
            {/* <SocialProof /> */} 
            <FinalCall />
        </main>
    )
}

