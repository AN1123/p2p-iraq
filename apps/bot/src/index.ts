import { Bot, session, InlineKeyboard } from 'grammy'
import { conversations, createConversation } from '@grammyjs/conversations'
import dotenv from 'dotenv'
import { buyConversation } from './conversations/buy'
import { sellConversation } from './conversations/sell'
import { isAdmin } from './lib/auth'
import { MESSAGES } from './lib/messages'
import { registerAdminHandlers } from './admin/panel'

dotenv.config()

const bot = new Bot(process.env.BOT_TOKEN!)

// ─── Session & Conversations ──────────────────────────────────────────────────
bot.use(session({ initial: () => ({}) }))
bot.use(conversations())
bot.use(createConversation(buyConversation, 'buy'))
bot.use(createConversation(sellConversation, 'sell'))

// ─── /start ───────────────────────────────────────────────────────────────────
bot.command('start', async (ctx) => {
  const param = ctx.match // Order ref if coming from deep link
  if (param && param.startsWith('BUY-') || param?.startsWith('SELL-')) {
    return ctx.reply(
      `📋 رقم طلبك: <code>${param}</code>\n\nاختر من القائمة:`,
      {
        parse_mode: 'HTML',
        reply_markup: new InlineKeyboard()
          .text('📤 رفع إثبات الدفع', `proof:${param}`)
          .row()
          .text('📊 حالة الطلب', `track:${param}`)
          .text('❌ إلغاء', `cancel:${param}`),
      }
    )
  }

  await ctx.reply(MESSAGES.WELCOME, {
    parse_mode: 'HTML',
    reply_markup: new InlineKeyboard()
      .text('🟢 شراء USDT', 'start_buy')
      .text('🔴 بيع USDT', 'start_sell')
      .row()
      .text('💱 أسعار اليوم', 'rates')
      .text('❓ مساعدة', 'help'),
  })
})

// ─── Commands ─────────────────────────────────────────────────────────────────
bot.command('buy', (ctx) => ctx.conversation.enter('buy'))
bot.command('sell', (ctx) => ctx.conversation.enter('sell'))
bot.command('rates', async (ctx) => {
  const { data } = await import('./lib/api').then(m => m.getRates())
  await ctx.reply(
    `💱 <b>أسعار اليوم</b>\n━━━━━━━━━━━━━━━\n` +
    `🟢 شراء USDT: <b>${data.buyRate.toLocaleString()} IQD</b>\n` +
    `🔴 بيع USDT: <b>${data.sellRate.toLocaleString()} IQD</b>\n` +
    `📊 السبريد: ${data.spread.toLocaleString()} IQD\n` +
    `⏱ آخر تحديث: ${new Date(data.updatedAt).toLocaleTimeString('ar-IQ')}`,
    { parse_mode: 'HTML' }
  )
})
bot.command('help', (ctx) => ctx.reply(MESSAGES.HELP, { parse_mode: 'HTML' }))

// ─── Callbacks ────────────────────────────────────────────────────────────────
bot.callbackQuery('start_buy', (ctx) => {
  ctx.answerCallbackQuery()
  return ctx.conversation.enter('buy')
})
bot.callbackQuery('start_sell', (ctx) => {
  ctx.answerCallbackQuery()
  return ctx.conversation.enter('sell')
})
bot.callbackQuery('rates', async (ctx) => {
  ctx.answerCallbackQuery()
  ctx.reply('جاري جلب الأسعار...')
})

// Track order callback
bot.callbackQuery(/^track:(.+)$/, async (ctx) => {
  const ref = ctx.match[1]
  const { getOrder } = await import('./lib/api')
  const { data } = await getOrder(ref)
  const statusMap: Record<string, string> = {
    pending: '⏳ في الانتظار',
    proof_submitted: '📤 إثبات مُرسَل — قيد المراجعة',
    proof_approved: '✅ إثبات مقبول',
    processing: '⚙️ جاري المعالجة',
    completed: '🎉 مكتمل',
    cancelled: '❌ ملغى',
    frozen: '❄️ مجمّد',
    disputed: '⚠️ نزاع مفتوح',
  }
  await ctx.answerCallbackQuery()
  await ctx.reply(
    `📋 <b>حالة الطلب</b>\n━━━━━━━━━━━━━━━\n` +
    `رقم الطلب: <code>${data.orderRef}</code>\n` +
    `الحالة: ${statusMap[data.status] || data.status}\n` +
    `المبلغ: ${data.amountUsdt} USDT\n` +
    `الشبكة: ${data.network}`,
    { parse_mode: 'HTML' }
  )
})

// ─── Admin commands ───────────────────────────────────────────────────────────
bot.command('admin', async (ctx) => {
  if (!isAdmin(ctx.from?.id)) return ctx.reply('⛔ غير مصرح')
  await ctx.reply(
    '🛠 <b>لوحة المشرف</b>',
    {
      parse_mode: 'HTML',
      reply_markup: new InlineKeyboard()
        .text('📋 الطلبات المعلقة', 'admin:pending')
        .row()
        .text('💱 تحديث السعر', 'admin:rates')
        .text('📊 إحصائيات', 'admin:stats'),
    }
  )
})

// ─── Admin Handlers ───────────────────────────────────────────────────────────
registerAdminHandlers(bot)

// ─── Start bot ────────────────────────────────────────────────────────────────
bot.start({
  onStart: (info) => console.log(`✅ Bot @${info.username} started`),
  allowed_updates: ['message', 'callback_query'],
})

process.on('SIGINT', () => bot.stop())
process.on('SIGTERM', () => bot.stop())
