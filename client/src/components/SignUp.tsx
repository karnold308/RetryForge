import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
import { useActionState } from 'react';
import '../styles/SignUp.css'
import Footer from "./Footer";

type FormState = {
    loading: boolean;
    message: string;
    success: boolean;
    data: {
        company: string,
        email: string,
        pwd: string,
    };
}

async function submitAction(
    _prevState: FormState, 
    formData: FormData
): Promise<FormState> {
    const email = formData.get("email") as string;
    const company = formData.get("company") as string;
    const pwd = formData.get("password") as string;
    

    if (!email) {
        return {loading: false, message: "Email is required", success: false, 
            data: {company: company, email: email, pwd: pwd}};
    }

    if (!pwd) {
        return {loading: false, message: "Password is required", success: false, 
            data: {company: company, email: email, pwd: pwd}};
    }
    try {
        const response = await fetch("http://localhost:3500/register", {
            method: "POST",
            body: JSON.stringify({company, email, pwd}),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.status === 409) {
            // email already exists
            return { loading: false, message: 'Email already exists', 
                success: false,  data: {company: company, email: email, pwd: pwd}}
        }
        const result = await response.json();

        if (!response.ok) {
            return { loading: false, message: result.message || "Submission failed", 
                success: false, 
                data: {
                    company: result.data.company, 
                    email: result.data.email, 
                    pwd: result.data.pwd} }
        }
        
        return {loading: false, message: result.message , success: true, 
            data: result.data };
    } catch (err) {
        console.log(err)
        return {loading: false, message: "Network error occured", 
            success: false, data: {company: '', email: '', pwd: ''}}
    }
    
}

export default function SignUp() {
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        const pageTitle = document.title;
        trackPageView(location.pathname, pageTitle);
    }, [location]);
    
    const [state, formAction, isPending] = useActionState(submitAction, {
        loading: false, 
        message: "",
        success: false,
        data: {company: '', email: '', pwd: ''},
    });

    return (
        <>
            <main className="signup-page">
                <title>RetryForge - Sign Up</title>
                <header className="signup-header">
                    <Link to="/" className="signup-logo">
                        <img className="signup-header-logo" loading="lazy" src="/letter_mark_white_bg.png"/>
                    </Link>
                    {/* 
                    <div className="signup-header-links">
                        <span>Already have an account?</span>

                        <Link to="/login" className="signup-login-link">
                            Sign in
                        </Link>
                    </div>
                    */}
                </header>
                <section className="signup-layout">
                    {/* LEFT SIDE */}
                    <div className="signup-card">
                        <div className="signup-card-header">
                            <span className="signup-badge">
                                Start recovering failed payments
                            </span>
                            <h1>Create your account</h1>
                            <p>
                                Connect Stripe and start tracking recoverable revenue in
                                minutes.
                            </p>
                        </div>
                        <form className="signup-form" action={formAction} name="signup-form">
                            <div className="signup-field">
                                <label htmlFor="company">Company name</label>
                                <input
                                    name="company"
                                    id="company"
                                    type="text"
                                    placeholder="Acme Inc."
                                    defaultValue={
                                        (state.data?.company)
                                    }/>
                            </div>
                            <div className="signup-field">
                                <label htmlFor="email">Work email</label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com" 
                                    defaultValue={
                                        (state.data?.email)
                                    }/>
                            </div>
                            <div className="signup-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    name="password"
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    defaultValue={
                                        (state.data?.pwd)
                                    }/>
                            </div>
                            {state.success === false ? 
                                <p className='errMsg'>{state.message}</p> 
                                : 
                                <p className='successMsg'>{state.message}</p> 
                            }
                            <button type="submit" className="signup-btn">
                                {isPending === true ? 'Creating Account...' : 'Create Account' }
                            </button>
                        </form>
                        <p className="signup-footer-text">
                            By creating an account, you agree to our{" "}
                            <Link to="/terms">Terms</Link> and{" "}
                            <Link to="/privacy">Privacy Policy</Link>.
                        </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="signup-info-panel">
                        <div className="signup-info-card">
                            <h2>What happens next</h2>
                            <ul className="signup-checklist">
                                <li>Connect Stripe securely</li>
                                <li>RetryForge analyzes failed subscription payments</li>
                                <li>Configure retry timing and recovery workflows</li>
                                <li>Start recovering revenue automatically</li>
                            </ul>
                        </div>

                        <div className="signup-mini-card">
                            <span className="signup-mini-label">
                                Typical setup time
                            </span>
                            <strong>5–10 minutes</strong>
                            <p>
                                No billing migration or major code changes required.
                            </p>
                        </div>

                        <div className="signup-mini-card">
                            <span className="signup-mini-label">
                                Built for Stripe Billing
                            </span>
                            <p>
                                Works alongside your existing subscription setup and
                                payment workflows.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}