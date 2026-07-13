import * as XLSX from 'xlsx';
import type { Subscription } from '@/types/subscription';

function toMonthly(sub: Subscription) {
  return sub.billingCycle === 'Monthly' ? sub.cost : sub.cost / 12;
}

function daysUntil(dateStr: string) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / msPerDay);
}

export function downloadSubscriptionsReport(subscriptions: Subscription[]) {
  const rows = subscriptions.map((s) => {
    const monthly = toMonthly(s);
    const days = daysUntil(s.nextRenewalDate);
    return {
      Name: s.name,
      Category: s.category,
      'Billing Cycle': s.billingCycle,
      Cost: Number(s.cost.toFixed(2)),
      'Monthly Cost': Number(monthly.toFixed(2)),
      'Annual Cost': Number((monthly * 12).toFixed(2)),
      'Next Renewal': s.nextRenewalDate,
      'Days Until Renewal': days,
      Status: days < 0 ? `Overdue by ${Math.abs(days)} days` : days === 0 ? 'Renews today' : `In ${days} days`,
      'Alerts Enabled': s.alertsEnabled ? 'Yes' : 'No',
    };
  });

  const totalMonthly = subscriptions.reduce((sum, s) => sum + toMonthly(s), 0);
  const totalAnnual = totalMonthly * 12;

  const summary = [
    { Metric: 'Total Subscriptions', Value: subscriptions.length },
    { Metric: 'Total Monthly Spend', Value: Number(totalMonthly.toFixed(2)) },
    { Metric: 'Total Annual Spend', Value: Number(totalAnnual.toFixed(2)) },
    { Metric: 'Report Generated', Value: new Date().toLocaleString() },
  ];

  const wb = XLSX.utils.book_new();
  const wsSummary = XLSX.utils.json_to_sheet(summary);
  const wsRows = XLSX.utils.json_to_sheet(rows);

  // Column widths
  wsRows['!cols'] = [
    { wch: 22 }, { wch: 12 }, { wch: 14 }, { wch: 10 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 20 }, { wch: 24 }, { wch: 14 },
  ];
  wsSummary['!cols'] = [{ wch: 24 }, { wch: 24 }];

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
  XLSX.utils.book_append_sheet(wb, wsRows, 'Subscriptions');

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `subsentry-report-${today}.xlsx`);
}
