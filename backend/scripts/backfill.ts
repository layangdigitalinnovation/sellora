import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ include: { Store: true } });
  
  for (const user of users) {
    if (!user.Store || user.Store.length === 0) continue;
    const store = user.Store[0];
    
    // Clear existing customers to recalculate cleanly
    await prisma.customer.deleteMany({ where: { storeId: store.id } });
    
    // Recalculate balance from PAID/SETTLED orders
    const orders = await prisma.order.findMany({
      where: { storeId: store.id, status: { in: ['PAID'] } } // schema only has PENDING, PAID, FAILED, REFUNDED
    });
    
    let totalBalance = 0;
    for (const order of orders) {
      totalBalance += order.amount;
      
      // Upsert Customer
      const existingCustomer = await prisma.customer.findFirst({
        where: { storeId: store.id, email: order.buyerEmail }
      });
      
      if (existingCustomer) {
        await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            totalSpent: { increment: order.amount },
            totalOrders: { increment: 1 },
            lastOrderAt: order.createdAt,
            name: order.buyerName,
            phone: order.buyerPhone || existingCustomer.phone
          }
        });
      } else {
        await prisma.customer.create({
          data: {
            storeId: store.id,
            email: order.buyerEmail,
            name: order.buyerName,
            phone: order.buyerPhone,
            totalSpent: order.amount,
            totalOrders: 1,
            lastOrderAt: order.createdAt
          }
        });
      }
    }
    
    // Update user balance
    await prisma.user.update({
      where: { id: user.id },
      data: { balance: totalBalance }
    });
    
    console.log(`Updated user ${user.email} with balance ${totalBalance}, created customers for ${orders.length} orders`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
