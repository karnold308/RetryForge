import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
import { useState } from "react";
import Footer from "./Footer";


export default function PrivacyPolicy() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        const pageTitle = document.title;
        trackPageView(location.pathname, pageTitle);
    }, [location]);

    
    return (
        <>
            <header>
                <title>RetryForge - Privacy Policy</title>
                <nav className="navbar">
                    <a href="/" className="logo">
                        <img className="headerLogo" loading="lazy" src="/letter_mark_white_bg.png" />
                    </a>

                    <div className="nav-links desktop-nav">
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
                        <a href="/demo">Book Demo</a>
                        <a href="/signup" className="nav-btn-primary">Get Started</a>
                    </div>
                )}
            </header>
            <main className="min-h-screen bg-gray-50 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-14 shadow-sm">
                        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                            Privacy Policy
                        </h1>

                        <p className="text-sm text-gray-500 mb-12">
                            Last updated: May 8, 2026
                        </p>

                        <div className="space-y-10 text-gray-600 leading-8">
                            <div>
                                <p>
                                    RetryForge (“RetryForge”, “we”, “our”, or “us”) respects your
                                    privacy and is committed to protecting the information you share
                                    with us.
                                </p>

                                <p className="mt-4">
                                    This Privacy Policy explains how we collect, use, store, and
                                    protect information when you use the RetryForge website and
                                    services.
                                </p>
                            </div>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    1. Information We Collect
                                </h2>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Information You Provide
                                </h3>

                                <p>
                                    We may collect information you voluntarily provide, including:
                                </p>

                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Name</li>
                                    <li>Email address</li>
                                    <li>Company name</li>
                                    <li>Billing information</li>
                                    <li>Account credentials</li>
                                    <li>
                                        Information submitted through contact forms, demos, or support
                                        requests
                                    </li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">
                                    Stripe Account Data
                                </h3>

                                <p>
                                    If you connect your Stripe account to RetryForge, we may access
                                    certain Stripe Billing and subscription data necessary to
                                    provide our services, including:
                                </p>

                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Subscription information</li>
                                    <li>Invoice status</li>
                                    <li>Failed payment events</li>
                                    <li>Customer billing metadata</li>
                                    <li>Payment recovery status</li>
                                    <li>Revenue analytics related to failed payments</li>
                                </ul>

                                <p className="mt-4">
                                    RetryForge does not store full payment card numbers or
                                    sensitive card authentication data.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">
                                    Automatically Collected Information
                                </h3>

                                <p>
                                    We may automatically collect technical and usage information,
                                    including:
                                </p>

                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>IP address</li>
                                    <li>Browser type</li>
                                    <li>Device information</li>
                                    <li>Pages visited</li>
                                    <li>Referring URLs</li>
                                    <li>Usage activity</li>
                                    <li>Cookies and analytics data</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    2. How We Use Information
                                </h2>

                                <p>We use collected information to:</p>

                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Provide and operate RetryForge services</li>
                                    <li>Recover failed subscription payments</li>
                                    <li>Improve payment recovery workflows</li>
                                    <li>Communicate with you</li>
                                    <li>Provide customer support</li>
                                    <li>Monitor product performance and reliability</li>
                                    <li>Improve website functionality and user experience</li>
                                    <li>Prevent fraud, abuse, and unauthorized access</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    3. Cookies and Analytics
                                </h2>

                                <p>
                                    RetryForge may use cookies and similar technologies to:
                                </p>

                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Keep users signed in</li>
                                    <li>Remember preferences</li>
                                    <li>Analyze traffic and product usage</li>
                                    <li>Improve service performance</li>
                                </ul>

                                <p className="mt-4">
                                    We may use third-party analytics providers to help understand
                                    website and product usage.
                                </p>

                                <p className="mt-4">
                                    You can control cookies through your browser settings.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    4. Data Sharing
                                </h2>

                                <p>We do not sell your personal information.</p>

                                <p className="mt-4">
                                    We may share information with trusted third-party providers only
                                    when necessary to operate our services, including:
                                </p>

                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Payment processors</li>
                                    <li>Hosting providers</li>
                                    <li>Analytics providers</li>
                                    <li>Infrastructure and monitoring services</li>
                                    <li>Customer support tools</li>
                                </ul>

                                <p className="mt-4">
                                    We may also disclose information if required by law or to
                                    protect our rights, users, or platform security.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    5. Data Retention
                                </h2>

                                <p>We retain information only as long as necessary to:</p>

                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Provide our services</li>
                                    <li>Comply with legal obligations</li>
                                    <li>Resolve disputes</li>
                                    <li>Enforce agreements</li>
                                </ul>

                                <p className="mt-4">
                                    You may request deletion of your account and associated data at
                                    any time.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    6. Security
                                </h2>

                                <p>
                                    We take reasonable administrative, technical, and
                                    organizational measures to protect your information.
                                </p>

                                <p className="mt-4">
                                    However, no method of electronic transmission or storage is
                                    completely secure, and we cannot guarantee absolute security.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    7. International Users
                                </h2>

                                <p>
                                    If you access RetryForge outside the United States, your
                                    information may be transferred to and processed in countries
                                    where data protection laws may differ from your jurisdiction.
                                </p>

                                <p className="mt-4">
                                    By using RetryForge, you consent to these transfers.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    8. Your Rights
                                </h2>

                                <p>
                                    Depending on your location, you may have rights regarding your
                                    personal information, including:
                                </p>

                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Accessing your data</li>
                                    <li>Correcting inaccurate information</li>
                                    <li>Requesting deletion</li>
                                    <li>Objecting to certain processing activities</li>
                                    <li>Requesting data portability</li>
                                </ul>

                                <p className="mt-4">
                                    To exercise these rights, contact us using the information
                                    below.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    9. Third-Party Services
                                </h2>

                                <p>
                                    RetryForge may contain links or integrations with third-party
                                    services, including Stripe.
                                </p>

                                <p className="mt-4">
                                    We are not responsible for the privacy practices of third-party
                                    services.
                                </p>

                                <p className="mt-4">
                                    Please review their privacy policies separately.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    10. Children’s Privacy
                                </h2>

                                <p>
                                    RetryForge is not intended for individuals under the age of 13,
                                    and we do not knowingly collect personal information from
                                    children.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    11. Changes to This Privacy Policy
                                </h2>

                                <p>
                                    We may update this Privacy Policy from time to time.
                                </p>

                                <p className="mt-4">
                                    If material changes are made, we will update the “Last updated”
                                    date above.
                                </p>

                                <p className="mt-4">
                                    Continued use of RetryForge after changes become effective
                                    constitutes acceptance of the updated policy.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
                                    12. Contact Us
                                </h2>

                                <p>
                                    If you have questions about this Privacy Policy or your data,
                                    contact:
                                </p>

                                <div className="mt-4">
                                    <p className="font-semibold text-gray-900">RetryForge</p>

                                    <a
                                        href="mailto:privacy@retryforge.com"
                                        className="text-indigo-600 hover:text-indigo-700"
                                    >
                                        privacy@retryforge.com
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}