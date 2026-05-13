import Hero from "./Hero"
import Calculator from "./Calculator"
import Problem from "./Problem"
import Solution from "./Solution"
import HowItWorks from "./HowItWorks"
import Comparisons from "./Comparisons"
import FinalCall from "./FinalCall"
import MainPricing from "./MainPricing"
import { FAQ } from "./FAQ"
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
import RecoveryFlow from "./RecoveryFlow"


export default function Main() {
    const location = useLocation();


    useEffect(() => {
        // Track page view on route change
        const pageTitle = document.title;
        trackPageView(location.pathname, pageTitle);
    }, [location]);

    return (
        <main>
            <Hero />
            <Calculator />
            <Problem />
            <Solution />
            <HowItWorks />
            <RecoveryFlow />
            <Comparisons />
            <MainPricing />
            <FAQ />
            {/* <SocialProof /> */}
            <FinalCall />
        </main>
    )
}

