import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
import Footer from "./Footer";
import '../styles/404.css'

export default function NoMatch() {
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        const pageTitle = document.title;
        trackPageView(location.pathname, pageTitle);
    }, [location]);

    
    return (
        <>
            <header className="four0Four-header">
                <title>RetryForge - 404</title>
                <Link to="/" className="four0Four-logo">
                    <img className="four0Four-header-logo" loading="lazy" src="/letter_mark_white_bg.png" />
                </Link>
            </header>
            <main>
                <p>Looks like you landed on a page we don't have. Click our header icon and go back to our home page</p>
            </main>
            <Footer />
        </>
    )
}