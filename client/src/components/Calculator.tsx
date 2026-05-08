import { useState, ChangeEvent } from "react";
import type { LostMMR } from '../models/types'


export default function Calculator() {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState(0);
    const [calcResult, setCalcResult] = useState<LostMMR | null>(null);

    const calc = () => {
        const failureRate = 0.08;
        const recoveryRate = 0.3;
        const feeRate = 0.05;
        const failRevenue = Number(inputValue) * failureRate;
        const weRecov = failRevenue * recoveryRate;
        const ourFee = 49 + weRecov * feeRate;
        const totalGain = weRecov - ourFee;

        setCalcResult({
            ...calcResult,
            mrr: Number(inputValue),
            failedRevenue: failRevenue,
            recoverable: weRecov,
            weRecover: weRecov,
            weCharge: ourFee,
            netGain: Math.round(totalGain)
        })
        setOutputValue(totalGain);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        setOutputValue(0);
    }

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <>
            <section id="calculator" className="calculator">
                <div className="container px-8 grid">
                    <h3 style={{ justifySelf: "start" }}>Estimate Your Lost Revenue</h3>
                    <input id="mrr" type="number" pattern="[0-9]*" value={inputValue} onChange={handleChange} placeholder="Monthly revenue (e.g. 20000)" />
                    <button type="button" className="calcBtn border border-gray-300 px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100" onClick={calc}>Calculate</button>
                    {0 !== outputValue &&
                        <div className="calc-results">
                            {1 < outputValue && <div className="calc-stat">
                                <span>MRR</span>
                                <strong>${null != calcResult ? formatCurrency(calcResult.mrr) : null}</strong>
                            </div>}
                            <div className="calc-stat">
                                <span>Failed revenue (8%)</span>
                                <strong>${null != calcResult ? formatCurrency(calcResult.failedRevenue) : null}</strong>
                            </div>
                            <div className="calc-stat">
                                <span>Recoverable (30%)</span>
                                <strong>${null != calcResult ? formatCurrency(calcResult.recoverable) : null}</strong>
                            </div>
                            <div className="calc-stat">
                                <span>We recover</span>
                                {1 < outputValue ? <strong>${null != calcResult ? formatCurrency(calcResult.weRecover) : null}/month</strong>
                                    : <strong>${null != calcResult ? formatCurrency(calcResult.weRecover * 12) : null}/year</strong>}
                            </div>
                            {1 < outputValue && <div className="calc-stat">
                                <span>We charge ($49 + 5%)</span>
                                <strong>${null != calcResult ? formatCurrency(calcResult.weCharge) : null}/month</strong>
                            </div>}
                            {1 < outputValue && <div className={1 < outputValue ? 'calc-stat greenGain' : 'calc-stat redGain'}>
                                <span>Net gain</span>
                                <strong>+${null != calcResult ? formatCurrency(calcResult.netGain) : null}/month</strong>
                            </div>
                            }
                            {1 < outputValue && 
                                <p>Even if this estimate is off by 50%, this is still meaningful revenue.</p>}
                            {1 > outputValue &&
                                <a href="/signup" className="nav-btn-primary"
                                    style={{ width: "165px" }}>
                                    See your custom recovery plan
                                </a>

                            }

                        </div>
                    }

                </div>
            </section>
        </>
    )
}