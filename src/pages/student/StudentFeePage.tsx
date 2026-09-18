import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { CreditCard, Download, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { formatCurrency } from '@/lib/utils'

export default function StudentFeePage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const fees = [
    { head: 'Tuition Fee (Semester 4)', due: 65000, paid: 65000, status: 'Paid', receipt: 'REC-2026-089' },
    { head: 'Examination & Assessment Fee', due: 3500, paid: 3500, status: 'Paid', receipt: 'REC-2026-092' },
    { head: 'Hostel & Mess Charges (Installment 2)', due: 24500, paid: 0, status: 'Pending', receipt: '—' },
  ]

  const handlePayNow = () => {
    alert('Razorpay payment gateway initialized for INR 24,500.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Ledger & Payment Portal"
        description="B.Tech CSE • Semester 4 Fee Dues & Receipts"
        breadcrumbs={[
          { label: 'Dashboard', href: `/${tenantCode}` },
          { label: 'Fee Management' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Dues (Annual)" value={formatCurrency(93000)} subtitle="B.Tech 2025-26" icon={CreditCard} color="blue" />
        <StatCard title="Total Paid" value={formatCurrency(68500)} subtitle="Receipts verified" icon={CheckCircle2} color="green" />
        <StatCard title="Outstanding Balance" value={formatCurrency(24500)} subtitle="Due: 30 Sep 2026" icon={AlertTriangle} color="amber" />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground">Semester 4 Fee Ledger</h2>
          <button onClick={handlePayNow} className="btn-primary text-xs flex items-center gap-1.5">
            <CreditCard className="h-4 w-4" /> Pay Outstanding (₹24,500)
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Fee Head</th>
                <th className="px-4 py-3 text-right">Amount Due</th>
                <th className="px-4 py-3 text-right">Amount Paid</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {fees.map((f, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="px-4 py-3.5 text-xs font-bold text-foreground">{f.head}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs">{formatCurrency(f.due)}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs font-bold text-emerald-600">{formatCurrency(f.paid)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        f.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs text-primary hover:underline cursor-pointer">
                    {f.receipt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
