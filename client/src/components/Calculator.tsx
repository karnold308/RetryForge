import { useState, ChangeEvent, useEffect } from "react";
import type { LostMMR } from '../models/types'



export default function Calculator() {
    const [inputMMRValue, setInputMMRValue] = useState<number>(50500);
    const [inputFailedRate, setInputFailedRate] = useState<number>(8);
    const [inputRecovRate, setInputRecovRate] = useState<number>(25);
    const [calcResult, setCalcResult] = useState<LostMMR | null>(null);


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
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatCompactNumber = (num: number) =>
        Intl.NumberFormat("en", {
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(num);



    useEffect(() => {
        calc();
    }, []);


    return (
        <>
            <section className="container">
                <div>
                    <h2>SaaS companies typically lose 5-15% of subscription revenue to failed payments.</h2>
                    <p>Estimate how much RetryForge could recover.</p>
                </div>
                <div id="calculator" className="px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="calculator-eyebrow">
                            Interactive Revenue Recovery Estimator
                        </p>
                        <div className="calc-control">
                            <div className="calc-control-header">
                                <label>Monthly Subscription Revenue</label>
                                <span>${inputMMRValue}</span>
                            </div>
                            <div className="slider-row">
                                <span className="slider-min">$5k</span>
                                <input
                                    id="mrr"
                                    type="range"
                                    min="5000"
                                    max="250000"
                                    step="100"
                                    value={inputMMRValue}
                                    onChange={handleMMRChange}
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
                                    type="range"
                                    min="5"
                                    max="15"
                                    step=".01"
                                    value={inputFailedRate}
                                    onChange={handleFailedRateChange}
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
                                    type="range"
                                    min="10"
                                    max="30"
                                    step=".01"
                                    value={inputRecovRate}
                                    onChange={handleRecovRateChange}
                                />
                                <span className="slider-max">30%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {/*
                            bar char widths explained:
                             lostRevenue = yearlyFailedPayments;
                             recoveredRevenue = yearlyRecoveredRevenue;
                             retainedProfit = yearlyNetProfit;

                             total = lostRevenue + recoveredRevenue + retainedProfit;

                             lostWidth = (lostRevenue / total) * 100;
                             recoveredWidth = (recoveredRevenue / total) * 100;
                             profitWidth = (retainedProfit / total) * 100;
                            
                        */}
                        <div className="heroProfitCard">
                            <span>Projected Yearly Profit</span>
                            <strong>+${null !== calcResult ? (formatCompactNumber(calcResult.netGain * 12)) : 0}/yr</strong>
                            <p>Pays for itself after one recovered invoice.</p>
                        </div>
                        <div className="revenue-chart">
                            <div className="stackedChart">
                                <div className="stack lostSegment" style={{
                                    "width":
                                        `${null !== calcResult
                                            ? (((calcResult.failedRevenue * 12) /
                                                ((calcResult.failedRevenue * 12)
                                                    + (calcResult.recoverable * 12)
                                                    + (calcResult.netGain * 12)))
                                                * 100)
                                            : 0}%`
                                }}>
                                </div>

                                <div className="stack recoveredSegment" style={{
                                    "width":
                                        `${null !== calcResult
                                            ? (((calcResult.recoverable * 12) /
                                                ((calcResult.failedRevenue * 12)
                                                    + (calcResult.recoverable * 12)
                                                    + (calcResult.netGain * 12)))
                                                * 100)
                                            : 0}%`
                                }}>
                                </div>

                                <div className="stack profitSegment" style={{
                                    "width":
                                        `${null !== calcResult
                                            ? (((calcResult.netGain * 12) /
                                                ((calcResult.failedRevenue * 12)
                                                    + (calcResult.recoverable * 12)
                                                    + (calcResult.netGain * 12)))
                                                * 100)
                                            : 0}%`
                                }}>
                                </div>
                            </div>

                            <div className="chartLegend">
                                <div className="legendItem">
                                    <span className="legendDot lostDot"></span>
                                    <span>Lost Revenue</span>
                                    <strong>${(null !== calcResult ? (formatCompactNumber(calcResult.failedRevenue * 12)) : 0)}</strong>
                                </div>

                                <div className="legendItem">
                                    <span className="legendDot recoveredDot"></span>
                                    <span>Recovered Revenue</span>
                                    <strong>${(null !== calcResult ? formatCompactNumber(calcResult.recoverable * 12) : 0)}</strong>
                                </div>

                                <div className="legendItem">
                                    <span className="legendDot profitDot"></span>
                                    <span>Retained Profit</span>
                                    <strong>${(null !== calcResult ? formatCompactNumber(calcResult.netGain * 12) : 0)}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="miniMetrics">
                            <div className="miniMetric">
                                <span>Failed Payments</span>
                                <strong>${null !== calcResult ? (formatCompactNumber(calcResult.failedRevenue * 12)) : 0}/yr</strong>
                            </div>

                            <div className="miniMetric">
                                <span>Recovered Revenue</span>
                                <strong>${null !== calcResult ? (formatCompactNumber(calcResult.recoverable * 12)) : 0}/yr</strong>
                            </div>

                            <div className="miniMetric">
                                <span>RetryForge Fees</span>
                                <strong>${null !== calcResult ? (calcResult.weCharge * 12).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }) : 0}/yr</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <p>Recovery rates vary depending on retry strategy and customer behavior.</p>
            </section>
        </>
    )
}