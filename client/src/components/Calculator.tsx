import { useState, ChangeEvent, useEffect } from "react";
import type { LostMMR } from '../models/types'



export default function Calculator() {
    const [inputMMRValue, setInputMMRValue] = useState<number>(50500);
    const [inputFailedRate, setInputFailedRate] = useState<number>(8);
    const [inputRecovRate, setInputRecovRate] = useState<number>(25);
    const [calcResult, setCalcResult] = useState<LostMMR | null>(null);
    const mmrMin = 5000;
    const mmrMax = 250000;
    const failMin = 5;
    const failMax = 15;
    const recovMin = 10;
    const recovMax = 30;

    const calc = () => {
        const failureRate = inputFailedRate / 100;
        const recoveryRate = inputRecovRate / 100;
        const feeRate = 0.05;
        const failRevenue = Number(inputMMRValue) * failureRate;
        const weRecov = failRevenue * recoveryRate;
        const ourFee = 49 + weRecov * feeRate;
        const totalGain = weRecov - ourFee;

        setCalcResult({
            ...calcResult,
            mrr: Number(inputMMRValue),
            failedRevenue: failRevenue,
            recoverable: weRecov,
            weRecover: weRecov,
            weCharge: ourFee,
            netGain: Math.round(totalGain)
        })
    }

    const handleMMRChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputMMRValue(Number(event.target.value));
        calc();
    }

    const handleFailedRateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputFailedRate(Number(event.target.value));
        calc();
    }

    const handleRecovRateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputRecovRate(Number(event.target.value));
        calc();
    }

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };



    const formatCompactNumber = (num: number) => {
        let newNum = null;
        if (num < 1000) {
            newNum = Intl.NumberFormat("en", {
                notation: "compact",
                maximumFractionDigits: 0,
            }).format(num);
        } else {
            newNum = Intl.NumberFormat("en", {
                notation: "compact",
                maximumFractionDigits: 1,
            }).format(num);
        }
        return newNum;
    }

    const formatLargeNumber = (num: number) => {
        let newNum = null;
        if (num < 1000) {
            newNum = Intl.NumberFormat("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(num);
        } else {
            newNum = Intl.NumberFormat("en", {
                maximumFractionDigits: 0,
            }).format(num);
        }
        return newNum;
    }


    useEffect(() => {
        calc();
    }, []);


    return (
        <>
            <section className="container calcContainer">
                <div>
                    <h2 className="section-title">See how much revenue you could recover</h2>
                    <p>Estimate lost subscription revenue and project how much RetryForge can recover automatically.</p>
                </div>
                <div id="calculator" className="px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="calculator-eyebrow">
                            Interactive Revenue Recovery Estimator
                        </p>
                        <div className="calc-control">
                            <div className="calc-control-header">
                                <label>Monthly Subscription Revenue</label>
                                <span>${formatCurrency(inputMMRValue)}</span>
                            </div>
                            <div className="slider-row">
                                <span className="slider-min">$5k</span>
                                <input
                                    id="mrr" type="range" min={mmrMin} max={mmrMax} step="100" value={inputMMRValue} onChange={handleMMRChange}
                                />
                                <span className="slider-max">$250k</span>
                            </div>
                        </div>
                        <div className="calc-control">
                            <div className="calc-control-header">
                                <label>Failed Payment Rate</label>
                                <span>{inputFailedRate}%</span>
                            </div>
                            <div className="slider-row">
                                <span className="slider-min">5%</span>
                                <input
                                    type="range" min={failMin} max={failMax} step="1" value={inputFailedRate} onChange={handleFailedRateChange}
                                />
                                <span className="slider-max">15%</span>
                            </div>
                        </div>
                        <div className="calc-control">
                            <div className="calc-control-header">
                                <label>Recovery Rate</label>
                                <span>{inputRecovRate}%</span>
                            </div>
                            <div className="slider-row">
                                <span className="slider-min">10%</span>
                                <input
                                    type="range" min={recovMin} max={recovMax} step="1" value={inputRecovRate} onChange={handleRecovRateChange}
                                />
                                <span className="slider-max">30%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {101 <= (null !== calcResult ? calcResult.netGain * 12 : 0) &&
                            <div className="heroProfitCard">

                                <div className="lossBadge">
                                    Silent revenue leak
                                </div>

                                <p className="lossLabel">
                                    Revenue lost to failed payments
                                </p>

                                <h3 className="lossValue">
                                    -${null != calcResult ? formatLargeNumber(calcResult.failedRevenue) : 0}<span>/yr</span>
                                </h3>

                                <p className="lossSubtext">
                                    Most SaaS companies never notice this revenue leak.
                                </p>

                                <div className="recoveryEstimate">
                                    <p className="recoveryLabel">
                                        RetryForge could automatically recover
                                    </p>

                                    <strong className="recoveryValue">
                                        +${null != calcResult ? formatCompactNumber(calcResult.recoverable) : 0}/yr
                                    </strong>

                                    <p className="recoveryProfit">
                                        ≈ +${null != calcResult ? formatCurrency(calcResult.netGain) : 0}/mo net after fees
                                    </p>
                                </div>

                            </div>
                        }
                        {101 > (null !== calcResult ? calcResult.netGain * 12 : 0) &&
                            <a href="/signup" className="nav-btn-primary cust-plan-btn"
                                style={{ width: "165px" }}>
                                See your custom recovery plan
                            </a>
                        }

                        <p className="calcFootnote">
                            Recovery rates vary depending on retry timing and customer behavior.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}