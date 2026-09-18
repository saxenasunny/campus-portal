import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bus, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function TransportPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const routes = [
    { route: 'Route 1: Huda City Centre - Campus', bus: 'HR-26-AB-1024', departure: '07:45 AM', driver: 'Ramesh Kumar (98112XXXXX)', stops: 'IFFCO Chowk, Huda City, Subhash Chowk, Campus' },
    { route: 'Route 2: Dwarka Mor - Campus', bus: 'HR-26-CD-2048', departure: '07:15 AM', driver: 'Sukhvinder Singh (98711XXXXX)', stops: 'Dwarka Mor, Uttam Nagar, Gurgaon Toll, Campus' },
    { route: 'Route 3: South Delhi (Dhaula Kuan) - Campus', bus: 'HR-26-EF-4096', departure: '07:30 AM', driver: 'Mohd. Rafiq (98991XXXXX)', stops: 'Dhaula Kuan, Mahipalpur, Rajokri, Campus' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="University Transport Fleet Management"
        description="Daily Commuter Bus Routes, GPS Telemetry & Digital Passes"
        breadcrumbs={[
          { label: 'Campus ERP', href: `/${tenantCode}` },
          { label: 'Transport' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Active Bus Fleet" value="28 Buses" subtitle="GPS Tracking Enabled" icon={Bus} color="blue" />
        <StatCard title="Subscribed Commuters" value="1,420" subtitle="Students & Staff" icon={CheckCircle2} color="green" />
        <StatCard title="Fleet Status" value="100% Operational" subtitle="Maintenance up to date" icon={CheckCircle2} color="indigo" />
      </div>

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Active Campus Bus Routes
        </h2>
        <div className="mt-4 divide-y divide-border/60">
          {routes.map((r, i) => (
            <div key={i} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">{r.route}</h3>
                <span className="font-mono text-xs font-bold text-primary flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Departs: {r.departure}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Stops: {r.stops}</p>
              <p className="text-[11px] text-slate-600">
                Vehicle: <strong>{r.bus}</strong> • Driver: {r.driver}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
