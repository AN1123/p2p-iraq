import axios from 'axios'

const BOT_TOKEN = process.env.BOT_TOKEN!
const ADMIN_GROUP_ID = process.env.ADMIN_GROUP_ID!

async function sendMessage(chatId: string | number, text: string) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    })
  } catch (e) {
    console.error('Telegram send error:', e)
  }
}

export async function notifyAdmins(order: any, user: any) {
  const text = `
🆕 <b>طلب جديد</b>
━━━━━━━━━━━━━━━
📋 رقم الطلب: <code>${order.orderRef}</code>
💱 النوع: ${order.type === 'BUY' ? '🟢 شراء' : '🔴 بيع'} USDT
💰 المبلغ: ${order.amountUsdt} USDT
🌐 الشبكة: ${order.network}
💳 طريقة الدفع: ${order.paymentMethod}
📍 المحافظة: ${order.governorate}
👤 المستخدم: @${user.telegramUsername || user.telegramId}
━━━━━━━━━━━━━━━
`
  await sendMessage(ADMIN_GROUP_ID, text)
}

export async function notifyUser(order: any, message: string) {
  // Bot handles user notifications — this is for API-triggered messages
  // The bot's telegramId is stored in the order's user relation
  // Fetch user and send
  const { prisma } = await import('./prisma')
  const user = await prisma.user.findUnique({ where: { id: order.userId } })
  if (user) {
    await sendMessage(user.telegramId.toString(), message)
  }
}
