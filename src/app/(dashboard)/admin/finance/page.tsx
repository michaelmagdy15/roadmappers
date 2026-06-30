import { redirect } from 'next/navigation';
import { db, enrollments, courses, users } from '@/db';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ShieldAlert, DollarSign, ArrowDownToLine, Users, TrendingUp, BadgePercent } from 'lucide-react';
import Link from 'next/link';

export default async function AdminFinancePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  // Authorize: Admin only
  if (currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-4">
        <ShieldAlert className="h-16 w-16 text-red-500/20 border border-red-500/30 p-3 rounded-2xl bg-red-500/5 animate-pulse" />
        <div>
          <h1 className="font-headers text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-muted-lavender text-sm max-w-sm">
            Only administrators are authorized to access financial sheets and payouts.
          </p>
        </div>
        <Link href="/dashboard" className="btn-primary mt-2">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Fetch all active enrollments joined with course and users
  const activeSales = await db
    .select({
      id: enrollments.id,
      studentName: users.name,
      courseTitle: courses.title,
      coursePrice: courses.price,
      creatorName: users.name, // Will be updated by mapping logic below
      creatorId: courses.creatorId,
      createdAt: enrollments.createdAt,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .innerJoin(users, eq(enrollments.userId, users.id))
    .where(eq(enrollments.status, 'active'))
    .orderBy(desc(enrollments.createdAt));

  // Fetch all users to map course creator IDs to their names
  const allUsersList = await db.select().from(users);
  const userMap = new Map(allUsersList.map(u => [u.id, u.name]));

  // Process sales, calculating splits
  const processedSales = activeSales.map(sale => {
    const creatorName = userMap.get(sale.creatorId) || 'Unknown Mentor';
    const mentorCut = Math.round(sale.coursePrice * 0.7); // 70% split
    const platformCut = Math.round(sale.coursePrice * 0.3); // 30% split
    return {
      ...sale,
      creatorName,
      mentorCut,
      platformCut
    };
  });

  // Calculate Metrics
  const totalSalesCount = processedSales.length;
  const totalRevenue = processedSales.reduce((acc, sale) => acc + sale.coursePrice, 0);
  const totalPlatformShare = processedSales.reduce((acc, sale) => acc + sale.platformCut, 0);
  const totalMentorShare = processedSales.reduce((acc, sale) => acc + sale.mentorCut, 0);

  // Group by Mentor for offline payouts
  const mentorPayoutsMap = new Map<string, {
    name: string;
    salesCount: number;
    totalRevenue: number;
    mentorShare: number;
  }>();

  processedSales.forEach(sale => {
    const mentorId = sale.creatorId;
    const existing = mentorPayoutsMap.get(mentorId);
    if (existing) {
      existing.salesCount += 1;
      existing.totalRevenue += sale.coursePrice;
      existing.mentorShare += sale.mentorCut;
    } else {
      mentorPayoutsMap.set(mentorId, {
        name: sale.creatorName,
        salesCount: 1,
        totalRevenue: sale.coursePrice,
        mentorShare: sale.mentorCut
      });
    }
  });

  const mentorPayoutsList = Array.from(mentorPayoutsMap.entries()).map(([id, stats]) => ({
    id,
    ...stats
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan">
            Accounting Ledger
          </span>
          <h1 className="font-headers text-2xl md:text-3xl font-bold text-white mt-1">
            Mentor Revenue Splits
          </h1>
          <p className="text-sm text-muted-lavender mt-1">
            Track product access sales recorded via Whop, calculate platform splits (30%), and manage mentor payouts (70%).
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4 border-white/5 bg-[#0f172a]/10">
          <div className="h-12 w-12 rounded-xl bg-neon-cyan/15 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-lavender">Total Platform Sales</span>
            <h3 className="font-headers text-xl font-bold text-white mt-0.5">{totalSalesCount} units</h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 border-white/5 bg-[#0f172a]/10">
          <div className="h-12 w-12 rounded-xl bg-neon-violet/15 border border-neon-violet/20 flex items-center justify-center text-neon-violet shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-lavender">Total Gross Revenue</span>
            <h3 className="font-headers text-xl font-bold text-white mt-0.5">{totalRevenue} EGP</h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 border-white/5 bg-[#0f172a]/10">
          <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <BadgePercent className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-lavender">Platform share (30%)</span>
            <h3 className="font-headers text-xl font-bold text-white mt-0.5">{totalPlatformShare} EGP</h3>
          </div>
        </div>
      </div>

      {/* Mentor Splits Grouping */}
      <div>
        <h2 className="font-headers text-lg font-bold text-white mb-4">Mentor Payout Splits (70%)</h2>
        <div className="glass-card overflow-hidden border-white/5 bg-[#0f172a]/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/2.5 text-[10px] uppercase font-bold tracking-wider text-muted-lavender">
                  <th className="px-6 py-4">Mentor</th>
                  <th className="px-6 py-4">Units Sold</th>
                  <th className="px-6 py-4">Gross Revenue</th>
                  <th className="px-6 py-4">Mentor Share (70%)</th>
                  <th className="px-6 py-4 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-muted-lavender">
                {mentorPayoutsList.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-white/2.5 transition-all">
                    <td className="px-6 py-4 font-semibold text-white">{mentor.name}</td>
                    <td className="px-6 py-4">{mentor.salesCount} sales</td>
                    <td className="px-6 py-4">{mentor.totalRevenue} EGP</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-neon-cyan">{mentor.mentorShare} EGP</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                        Manual Pay
                      </span>
                    </td>
                  </tr>
                ))}

                {mentorPayoutsList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-lavender/50">
                      No sales records to calculate splits.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Transaction Logs */}
      <div>
        <h2 className="font-headers text-lg font-bold text-white mb-4">Fulfillment Transaction Logs</h2>
        <div className="glass-card overflow-hidden border-white/5 bg-[#0f172a]/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/2.5 text-[10px] uppercase font-bold tracking-wider text-muted-lavender">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Roadmap Course</th>
                  <th className="px-6 py-4">Mentor</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-muted-lavender">
                {processedSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/2.5 transition-all">
                    <td className="px-6 py-4 text-white font-medium">{sale.studentName}</td>
                    <td className="px-6 py-4">{sale.courseTitle}</td>
                    <td className="px-6 py-4">{sale.creatorName}</td>
                    <td className="px-6 py-4">{sale.coursePrice} EGP</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {processedSales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-lavender/50">
                      No transactions have been processed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
