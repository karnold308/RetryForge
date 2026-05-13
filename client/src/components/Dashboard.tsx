import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import '../styles/Dashboard.css'

export default function Dashboard() {
    const failedPayments = [
        {
            customer: "Acme Inc.",
            amount: "$249",
            status: "Retrying",
            stage: "Email Sent",
        },
        {
            customer: "Northstar Labs",
            amount: "$89",
            status: "Recovered",
            stage: "Payment Captured",
        },
        {
            customer: "BrightPath",
            amount: "$499",
            status: "Failed",
            stage: "Card Expired",
        },
        {
            customer: "Flow Studios",
            amount: "$129",
            status: "Retrying",
            stage: "Retry Scheduled",
        },
    ];

    return (
        <div className="dashboard-wrapper bg-[#F8FAFC] min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F9FAFB] to-[#EEF2FF] text-[#111827] flex items-starttext-[#111827] flex items-start ">
            {/* SIDEBAR */}
            <aside className="w-[250px] border-r border-[#E5E7EB] bg-gradient-to-b from-white to-[#F8FAFF]/95 backdrop-blur sticky top-0 h-screen px-6 py-8 flex flex-col">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold tracking-tight">
                        <img alt="RetryForge logo" className="fullLogo" src="/full_logo_with_name_2.png" />
                    </h1>

                    <p className="text-sm text-[#6B7280] mt-1">
                        Revenue Recovery
                    </p>
                </div>

                <nav className="flex flex-col gap-2">
                    {[
                        "Dashboard",
                        "Payments",
                        "Recovery Flows",
                        "Customers",
                        "Analytics",
                        "Settings",
                    ].map((item, index) => (
                        <button
                            key={item}
                            className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${index === 0
                                ? "bg-[#111827] text-white"
                                : "text-[#4B5563] hover:bg-[#F3F4F6]"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto border border-[#E5E7EB] rounded-2xl p-4 bg-[#FAFAFA]">
                    <p className="text-xs uppercase tracking-wide text-[#9CA3AF] mb-2">
                        Stripe Status
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />

                        <span className="text-sm font-medium">
                            Connected
                        </span>
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 flex">
                <div className="flex-1 p-8">
                    {/* TOP BAR */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Dashboard
                            </h2>

                            <p className="text-[#6B7280] mt-1">
                                Monitor failed payments and recovered revenue.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="h-11 px-4 rounded-xl border border-[#E5E7EB] bg-gradient-to-b from-white to-[#F8FAFF] text-sm font-medium hover:bg-[#F9FAFB]">
                                Last 30 Days
                            </button>
                            <div className="h-11 px-4 rounded-xl bg-gradient-to-b from-white to-[#F8FAFF] border border-[#E5E7EB] flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                <span className="text-sm font-medium">
                                    Stripe Connected
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* HERO KPI */}
                    <section className="relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#1E293B] rounded-3xl p-8 mb-8 text-white bg-white/70 backdrop-blur border border-[#E5E7EB] rounded-3xl p-8 mb-8">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full" />
                        <p className="text-sm text-white/70 mb-3">
                            Revenue Recovered This Month
                        </p>
                        <div className="flex items-end gap-4">
                            <h1 className="text-6xl font-bold tracking-tight">
                                $14,882
                            </h1>
                            <span className="text-green-600 text-lg font-semibold mb-2">
                                +18.4%
                            </span>
                        </div>
                        <p className="text-white/70 mt-3 max-w-[700px] leading-7">
                            RetryForge has successfully recovered failed
                            subscription payments automatically through retry
                            scheduling and customer recovery flows.
                        </p>
                    </section>

                    {/* KPI GRID */}
                    <section className="grid grid-cols-4 gap-6 mb-8 bg-white/70 backdrop-blur border border-[#E5E7EB] rounded-3xl p-8 mb-8">
                        {[
                            {
                                label: "Recovery Rate",
                                value: "28.4%",
                                sub: "Recovered after failure",
                            },
                            {
                                label: "Failed Payments",
                                value: "128",
                                sub: "Currently retrying",
                            },
                            {
                                label: "Recovered Invoices",
                                value: "41",
                                sub: "Recovered this week",
                            },
                            {
                                label: "Monthly Revenue",
                                value: "$52.4k",
                                sub: "Tracked subscriptions",
                            },
                        ].map((card) => (
                            <div
                                key={card.label}
                                className="bg-white/80 backdrop-blur border border-[#E5E7EB] rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md"
                            >
                                <div className="w-10 h-1 rounded-full bg-indigo-500 mb-4" />
                                <p className="text-sm text-[#6B7280] mb-3">
                                    {card.label}
                                </p>
                                <h3 className="text-4xl font-bold tracking-tight mb-2">
                                    {card.value}
                                </h3>
                                <p className="text-sm text-[#9CA3AF]">
                                    {card.sub}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* CHART */}
                    <section className="bg-white border border-[#E5E7EB] rounded-3xl p-8 mb-8">
                        <div className="dashboard-chart-card">
                            <div className="chart-header">
                                <div>
                                    <h3>Recovered Revenue Over Time</h3>
                                    <p>Monthly recovered subscription revenue from failed payments</p>
                                </div>

                                <div className="chart-summary">
                                    <span>Total Recovered</span>
                                    <strong>$18,420</strong>
                                </div>
                            </div>

                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart
                                    data={[
                                        { month: "Jan", recovered: 1200 },
                                        { month: "Feb", recovered: 1450 },
                                        { month: "Mar", recovered: 1800 },
                                        { month: "Apr", recovered: 2100 },
                                        { month: "May", recovered: 2350 },
                                        { month: "Jun", recovered: 2600 },
                                        { month: "Jul", recovered: 2950 },
                                        { month: "Aug", recovered: 3100 },
                                        { month: "Sep", recovered: 2870 },
                                    ]}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 10,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E5E7EB"
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: "#6B7280", fontSize: 13 }}
                                        axisLine={{ stroke: "#D1D5DB" }}
                                        tickLine={false}
                                        label={{
                                            value: "Month",
                                            position: "insideBottom",
                                            offset: -5,
                                            fill: "#6B7280",
                                        }}
                                    />

                                    <YAxis
                                        tickFormatter={(value) => `$${value}`}
                                        width={70}
                                        domain={[0, 3500]}
                                        tick={{ fill: "#6B7280", fontSize: 13 }}
                                        axisLine={{ stroke: "#D1D5DB" }}
                                        tickLine={false}
                                        label={{
                                            value: "Recovered Revenue",
                                            angle: -90,
                                            position: "insideLeft",
                                            fill: "#6B7280",
                                        }}
                                    />

                                    <Tooltip
                                        formatter={(value: unknown) => {
                                            const num = Number(value ?? 0);

                                            return [`$${num.toLocaleString()}`, "Recovered"];
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="recovered"
                                        stroke="#10B981"
                                        strokeWidth={4}
                                        dot={{
                                            r: 4,
                                            strokeWidth: 2,
                                            fill: "#10B981",
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* TABLE */}
                    <section className="bg-gradient-to-b from-white to-[#F8FAFF] border border-[#E5E7EB] rounded-3xl overflow-hidden bg-white/70 backdrop-blur border border-[#E5E7EB] rounded-3xl p-8 mb-8">
                        <div className="px-8 py-6 border-b border-[#E5E7EB]">
                            <h3 className="text-xl font-semibold">
                                Failed Payments
                            </h3>

                            <p className="text-sm text-[#6B7280] mt-1">
                                Monitor retries and customer recovery status
                            </p>
                        </div>

                        <table className="w-full">
                            <thead className="bg-[#F9FAFB]">
                                <tr className="text-left">
                                    {[
                                        "Customer",
                                        "Amount",
                                        "Status",
                                        "Retry Stage",
                                        "Action",
                                    ].map((head) => (
                                        <th
                                            key={head}
                                            className="px-8 py-4 text-sm font-medium text-[#6B7280]"
                                        >
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {failedPayments.map((payment, i) => (
                                    <tr
                                        key={i}
                                        className="border-t border-[#F3F4F6]"
                                    >
                                        <td className="px-8 py-5 font-medium">
                                            {payment.customer}
                                        </td>

                                        <td className="px-8 py-5">
                                            {payment.amount}
                                        </td>

                                        <td className="px-8 py-5">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${payment.status === "Recovered"
                                                    ? "bg-green-100 text-green-700"
                                                    : payment.status === "Retrying"
                                                        ? "bg-[#F3F4F6] text-[#374151]"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {payment.status}
                                            </span>
                                        </td>

                                        <td className="px-8 py-5 text-[#6B7280]">
                                            {payment.stage}
                                        </td>

                                        <td className="px-8 py-5">
                                            <button className="text-sm font-medium text-[#111827] hover:opacity-70">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>

                {/* RIGHT PANEL */}
                <aside className="w-[320px] border-l border-[#E5E7EB] bg-gradient-to-b from-white to-[#F8FAFF] p-6">
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold">
                            Live Recovery Feed
                        </h3>

                        <p className="text-sm text-[#6B7280] mt-1">
                            Real-time recovery activity
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                title: "Payment recovered",
                                amount: "$49",
                                time: "2 min ago",
                            },
                            {
                                title: "Retry scheduled",
                                amount: "$129",
                                time: "8 min ago",
                            },
                            {
                                title: "Card updated",
                                amount: "$249",
                                time: "14 min ago",
                            },
                            {
                                title: "Invoice recovered",
                                amount: "$89",
                                time: "28 min ago",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="border border-[#E5E7EB] rounded-2xl p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium">
                                            {item.title}
                                        </p>

                                        <p className="text-sm text-[#6B7280] mt-1">
                                            {item.time}
                                        </p>
                                    </div>

                                    <span className="text-sm font-semibold text-green-600">
                                        {item.amount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
}