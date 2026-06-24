import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import UserModal from "@/components/Users/UserModal"
import OrderCard, { type Order } from "./OrderCard"
import OrderStats from "./OrderStats"

const MOCK_ORDERS: Order[] = [
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
    status: "on_way",
    duration: "4 soat",
    createdAt: "2026-06-22",
  },
  {
    id: "3",
    title: "Buyurtma kelmadi",
    category: "delivery",
    status: "completed",
    duration: "1.5 soat",
    createdAt: "2026-06-15",
  },
  {
    id: "4",
    title: "Internet ulanmayapti",
    category: "internet",
    status: "in_progress",
    duration: "3 soat",
    createdAt: "2026-06-10",
  },
]

export default function User() {
  const open = MOCK_ORDERS.filter((o) => o.status !== "completed").length
  const resolved = MOCK_ORDERS.filter((o) => o.status === "completed").length

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mening buyurtmalarim
          </h1>
          <p className="mt-1 text-muted-foreground">
            Yuborilgan muammolaringiz va ularning holati
          </p>
        </div>
        <UserModal />
      </div>

      <OrderStats total={MOCK_ORDERS.length} open={open} resolved={resolved} />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>So'nggi murojaatlar</CardTitle>
          <CardDescription>
            Barcha yuborilgan so'rovlaringiz tarixi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_ORDERS.length === 0 ? (
            <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
              Hozircha buyurtmalar yo'q.
            </div>
          ) : (
            MOCK_ORDERS.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
