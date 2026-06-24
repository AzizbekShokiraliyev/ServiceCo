import UserModal from "@/components/Users/UserModal"
import OrderCard, { type Order } from "./OrderCard"
import OrderStats from "./OrderStats"

const orders: Order[] = [
  {
    id: "1",
    title: "Login qilolmayapman",
    category: "other",
    status: "in_progress",
    duration: "2.5 soat",
    createdAt: "2026-06-20",
  },
  {
    id: "2",
    title: "To'lov amalga oshmadi",
    category: "payment",
    status: "pending",
    duration: "4 soat",
    createdAt: "2026-06-22",
  },
  {
    id: "3",
    title: "Buyurtma kelmadi",
    category: "delivery",
    status: "resolved",
    duration: "1.5 soat",
    createdAt: "2026-06-15",
  },
  {
    id: "4",
    title: "Internet ulanmayapti",
    category: "internet",
    status: "rejected",
    duration: "3 soat",
    createdAt: "2026-06-10",
  },
]

const User = () => {
  const open = orders.filter((o) => o.status !== "resolved").length
  const resolved = orders.filter((o) => o.status === "resolved").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mening buyurtmalarim
          </h1>
          <p className="text-sm text-muted-foreground">
            Yuborilgan muammolaringiz va ularning holati
          </p>
        </div>
        <UserModal />
      </div>

      <OrderStats total={orders.length} open={open} resolved={resolved} />

      <div className="rounded-xl border">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold">So'nggi murojaatlar</h2>
        </div>
        <div className="space-y-2 p-3">
          {orders.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              Hozircha buyurtmalar yo'q.
            </div>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </div>
    </div>
  )
}

export default User
