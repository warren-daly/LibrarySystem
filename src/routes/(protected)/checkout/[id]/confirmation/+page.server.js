import { db } from '$lib/server/db';
import { order, orderItem, book } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe.js';
import { sendPaymentConfirmationEmail } from '$lib/server/email/email-service.js';

export async function load({ url, locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) throw error(400, 'Missing session ID');

  try {
    // Get Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw error(400, 'Payment not completed');
    }

    const orderId = Number(session.metadata?.orderId);
    if (!orderId) throw error(400, 'No order found');

    // Get the order
    const orderResult = await db
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderResult.length) {
      throw error(404, 'Order not found');
    }

    const orderData = orderResult[0];

    // Verify user owns this order
    if (orderData.userId !== locals.user.id) {
      throw error(403, 'Access denied');
    }

    // Update order status to completed
    await db.update(order)
      .set({ status: 'completed' })
      .where(eq(order.id, orderId));

    sendPaymentConfirmationEmail({
      to: locals.user.email,
      amount: orderData.total,
      paymentType: 'Book purchase'
    }).catch((err) => {
      console.error('Payment confirmation email failed:', err);
    });

    // Get order items with book titles
    const items = await db
      .select()
      .from(orderItem)
      .where(eq(orderItem.orderId, orderId));

    const itemsWithTitles = await Promise.all(
      items.map(async (item) => {
        const bookData = await db
          .select()
          .from(book)
          .where(eq(book.id, item.bookId))
          .limit(1);
        
        return {
          bookTitle: bookData[0]?.title || 'Unknown Book',
          type: item.type === 'rent' ? 'Rental' : 'Purchase',
          quantity: item.quantity,
          price: `€${(item.unitPrice / 100).toFixed(2)}`
        };
      })
    );

    // Format order data
    const formattedOrder = {
      id: orderData.id,
      status: 'completed',
      date: orderData.createdAt 
        ? new Date(orderData.createdAt).toLocaleDateString('en-IE')
        : 'N/A',
      total: `€${(orderData.total / 100).toFixed(2)}`,
      items: itemsWithTitles
    };

    return {
      order: formattedOrder
    };
  } catch (err) {
    console.error('Error loading order:', err);
    throw error(500, 'Failed to load order');
  }
}