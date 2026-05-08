 import { useState } from "react";

 export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header>
            <nav className="navbar">
                <a href="/" className="logo">
                    <img className="headerLogo" loading="lazy" src="/letter_mark_white_bg.png"/>
                </a>

                <div className="nav-links desktop-nav">
                   {/*  <a href="/" className="nav-btn-ghost">Home</a> */}
                    <a href="#features" className="nav-btn-ghost">Features</a>
                    <a href="#howItWorks" className="nav-btn-ghost">How It Works</a>
                    <a href="#pricing" className="nav-btn-ghost">Pricing</a>
                    <a href="/demo" className="nav-btn-secondary">Book Demo</a> 
                    {/* <a href="/login" className="nav-btn-secondary">Login</a> */}
                    <a href="/signup" className="nav-btn-primary">Get Started</a>
                </div>
            

                {/* Mobile Hamburger */}
                <button
                        type="button"
                        className="mobile-menu-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}>
                            ☰
                </button>
            </nav>

            {/* Mobile Dropdown */}

            {mobileOpen && (
                <div className="mobile-menu">
                    <a href="#features">Features</a>
                    <a href="#howItWorks">How It Works</a>
                    <a href="#pricing">Pricing</a>
                    <a href="/demo">Book Demo</a>
                    <a href="/signup" className="nav-btn-primary">Get Started</a>
                </div>
            )}
        </header>
    )
}

