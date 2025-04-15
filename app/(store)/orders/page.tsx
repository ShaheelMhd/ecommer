import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OrderItemCard from "@/components/OrderItemCard";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";

const OrdersPage = async () => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });

  const order = await prisma.order.findMany({
    where: { userId: user?.id },
    include: { orderItems: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-5">Your Orders</h1>
      {order.map((item) => (
        <div className="mb-7">
          <div className="mb-3 flex justify-between align-middle">
            <h2>
              {(() => {
                const parts = item.createdAt.toDateString().split(" ");
                return `${parts[1]} ${parts[2]}, ${parts[3]}`;
              })()}
            </h2>
            <p className="capitalize">{item.status}</p>
          </div>
          {item.orderItems.map((item) => (
            <OrderItemCard
              key={item.orderId}
              id={item.productId}
              className="mb-3"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
