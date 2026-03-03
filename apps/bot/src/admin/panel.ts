import { Bot, InlineKeyboard } from 'grammy'
import { isAdmin } from '../lib/auth'
import {
  approveOrder,
  rejectOrder,
  completeOrder,
  freezeOrder,
} from '../lib/api'
import axios from 'axios'

export function registerAdminHandlers(bot: Bot) {

  // ─── Pending orders list ─────────────────────────────────────────────────
  bot.callbackQuery('admin:pending', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCallbackQuery('⛔ غير مصرح')
    await ctx.answerCallbackQuery()

    const { data: orders } = await axios.get(
      `${process.env.API_URL}/api/admin/orders?status=proof_submitted`,
      { headers: { 'x-admin-token': process.env.API_SECRET } }
    )

    if (!orders.length) {
      return ctx.reply('✅ لا توجد طلبات معلقة حالياً.')
    }

    for (const order of orders.slice(0, 5)) {
      await ctx.reply(
        `📋 <b>${order.orderRef}</b>\n` +
        `${order.type === 'BUY' ? '🟢 شراء' : '🔴 بيع'} ${order.amountUsdt} USDT\n` +
        `💳 ${order.paymentMethod} | 📍 ${order.governorate}\n` +
        `👤 @${order.user?.telegramUsername || order.user?.telegramId}\n` +
        `⏱ ${new Date(order.createdAt).toLocaleTimeString('ar-IQ')}`,
        {
          parse_mode: 'HTML',
          reply_markup: new InlineKeyboard()
            .text('✅ قبول الإثبات', `adm:approve:${order.id}`)
            .text('❌ رفض', `adm:reject:${order.id}`)
            .row()
            .text('❄️ تجميد', `adm:freeze:${order.id}`)
            .text('⚠️ تصعيد', `adm:escalate:${order.id}`)
            .row()
            .text('👁 عرض الإثبات', `adm:proof:${order.id}`),
        }
      )
    }
  })

  // ─── Approve ─────────────────────────────────────────────────────────────
  bot.callbackQuery(/^adm:approve:(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCallbackQuery('⛔')
    const orderId = ctx.match[1]
    await approveOrder(orderId)
    await ctx.answerCallbackQuery('✅ تم القبول')
    await ctx.editMessageReplyMarkup({
      reply_markup: new InlineKeyboard()
        .text('✅ مقبول — أدخل TX Hash', `adm:complete:${orderId}`),
    })
  })

  // ─── Complete (after sending USDT) ───────────────────────────────────────
  bot.callbackQuery(/^adm:complete:(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCallbackQuery('⛔')
    const orderId = ctx.match[1]
    await ctx.answerCallbackQuery()
    await ctx.reply(`📤 أدخل TX Hash لإتمام الطلب ${orderId}:`)

    // Store pending completion in a simple map (production: use DB)
    pendingCompletions.set(ctx.from.id, orderId)
  })

  // ─── Handle TX hash input ────────────────────────────────────────────────
  bot.on('message:text', async (ctx, next) => {
    if (!isAdmin(ctx.from?.id)) return next()
    const orderId = pendingCompletions.get(ctx.from!.id)
    if (!orderId) return next()

    const txHash = ctx.message.text.trim()
    if (txHash.length < 20) return ctx.reply('❌ TX Hash غير صالح')

    pendingCompletions.delete(ctx.from!.id)
    await completeOrder(orderId, txHash)
    await ctx.reply(`🎉 تم إتمام الطلب!\nTX: <code>${txHash}</code>`, { parse_mode: 'HTML' })
  })

  // ─── Reject ───────────────────────────────────────────────────────────────
  bot.callbackQuery(/^adm:reject:(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCallbackQuery('⛔')
    const orderId = ctx.match[1]
    await ctx.answerCallbackQuery()
    await ctx.reply(`❌ أدخل سبب الرفض للطلب ${orderId}:`)
    pendingRejections.set(ctx.from.id, orderId)
  })

  bot.on('message:text', async (ctx, next) => {
    if (!isAdmin(ctx.from?.id)) return next()
    const orderId = pendingRejections.get(ctx.from!.id)
    if (!orderId) return next()
    pendingRejections.delete(ctx.from!.id)
    await rejectOrder(orderId, ctx.message.text.trim())
    await ctx.reply('✅ تم الرفض وإشعار المستخدم.')
  })

  // ─── Freeze ───────────────────────────────────────────────────────────────
  bot.callbackQuery(/^adm:freeze:(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCallbackQuery('⛔')
    const orderId = ctx.match[1]
    await freezeOrder(orderId, 'تجميد من قِبل المشرف — قيد التحقق')
    await ctx.answerCallbackQuery('❄️ تم التجميد')
    await ctx.editMessageText(ctx.callbackQuery.message?.text + '\n\n❄️ <b>مجمّد</b>', { parse_mode: 'HTML' })
  })

  // ─── Admin stats ─────────────────────────────────────────────────────────
  bot.callbackQuery('admin:stats', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCallbackQuery('⛔')
    await ctx.answerCallbackQuery()
    const { data: orders } = await axios.get(
      `${process.env.API_URL}/api/admin/orders?status=completed`,
      { headers: { 'x-admin-token': process.env.API_SECRET } }
    )
    const total = orders.length
    const todayOrders = orders.filter((o: any) =>
      new Date(o.completedAt).toDateString() === new Date().toDateString()
    )
    await ctx.reply(
      `📊 <b>إحصائيات سريعة</b>\n━━━━━━━━━━━━━━━\n` +
      `✅ صفقات اليوم: ${todayOrders.length}\n` +
      `📦 إجمالي الصفقات: ${total}`,
      { parse_mode: 'HTML' }
    )
  })

  // ─── Update rates ─────────────────────────────────────────────────────────
  bot.callbackQuery('admin:rates', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCallbackQuery('⛔')
    await ctx.answerCallbackQuery()
    await ctx.reply(
      '💱 أدخل السعر الجديد بالصيغة:\n<code>شراء/بيع</code>\nمثال: <code>1490/1470</code>',
      { parse_mode: 'HTML' }
    )
    pendingRates.set(ctx.from.id, true)
  })

  bot.on('message:text', async (ctx, next) => {
    if (!isAdmin(ctx.from?.id)) return next()
    if (!pendingRates.get(ctx.from!.id)) return next()
    pendingRates.delete(ctx.from!.id)

    const parts = ctx.message.text.split('/')
    if (parts.length !== 2) return ctx.reply('❌ صيغة خاطئة. مثال: 1490/1470')

    const [buyRate, sellRate] = parts.map(Number)
    if (!buyRate || !sellRate || sellRate >= buyRate) {
      return ctx.reply('❌ الأرقام غير صالحة. سعر الشراء يجب أن يكون أعلى من البيع.')
    }

    await axios.post(
      `${process.env.API_URL}/api/rates`,
      { buyRate, sellRate },
      { headers: { 'x-admin-token': process.env.API_SECRET } }
    )
    await ctx.reply(
      `✅ تم تحديث السعر!\n🟢 شراء: ${buyRate.toLocaleString()} IQD\n🔴 بيع: ${sellRate.toLocaleString()} IQD`
    )
  })
}

// Simple in-memory stores (replace with Redis in production)
const pendingCompletions = new Map<number, string>()
const pendingRejections  = new Map<number, string>()
const pendingRates       = new Map<number, boolean>()
