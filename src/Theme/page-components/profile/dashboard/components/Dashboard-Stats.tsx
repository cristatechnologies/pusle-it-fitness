// app/profile/dashboard/_components/Dashboard-Stats.tsx
import { Package, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Orders",
    icon: Package,
    link: "/profile/orders",
    color: "bg-gray-100",
  },
  {
    title: "Completed Orders",
    icon: CheckCircle,
    link: "/profile/orders?status=completed",
    color: "bg-green-50",
  },
  {
    title: "Pending Orders",
    icon: Clock,
    link: "/profile/orders?status=pending",
    color: "bg-yellow-50",
  },
  {
    title: "Declined Orders",
    icon: XCircle,
    link: "/profile/orders?status=declined",
    color: "bg-red-50",
  },
];

export default function DashboardStats({
  totalOrder,
  completeOrder,
  pendingOrder,
  declinedOrder,
}: {
  totalOrder: number;
  completeOrder: number;
  pendingOrder: number;
  declinedOrder: number;
}) {
  const values = [totalOrder, completeOrder, pendingOrder, declinedOrder];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold uppercase">Order Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Link
            key={stat.title}
            href={stat.link}
            className={`${stat.color} p-6 rounded border border-transparent hover:border-gray-300 transition-colors`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{values[index]}</p>
              </div>
              <stat.icon className="h-8 w-8 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
