import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivacyPolicy from "./components/PrivacyPolicy";
import NoMatch from "./components/404";
import Dashboard from "./components/Dashboard";
import Demo from "./components/Demo";
import SignUp from "./components/SignUp";
import TermsAndConditions from "./components/Terms";
import App from "./App";
import Cookies from "./components/Cookies";



function Root() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Root