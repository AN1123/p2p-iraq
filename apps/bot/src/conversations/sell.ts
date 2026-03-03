import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { Context, InlineKeyboard } from 'grammy'
import { GOVERNORATES, NETWORK_FEES, calcSellReceive } from '@p2p-iraq/shared'
import { createOrder, getRates } from '../lib/api'

type MyContext = Context & ConversationFlavor

export async function sellConversation(conversation: Conversation<MyContext>, ctx: MyContext) {
  // Step 1: Amount
  await ctx.reply(
    '🔴 <b>بيع USDT</b>\n━━━━━━━━━━━━━━━\n💵 كم USDT تريد بيعه؟\n\nاكتب المبلغ بالدولار (مثال: 200)',
    { parse_mode: 'HTML' }
  )
  const amountCtx = await conversation.wait()
  const amountUsdt = parseFloat(amountCtx.message?.text || '0')
  if (isNaN(amountUsdt) || amountUsdt < 10 || amountUsdt > 5000) {
    return ctx.reply('❌ مبلغ غير صالح. يجب أن يكون بين 10 و 5000 دولار.')
  }

  // Step 2: Network
  const networkKb = new InlineKeyboard()
    .text('TRC20 ✅ (موصى به)', 'snet:TRC20').row()
    .text('BEP20', 'snet:BEP20').row()
    .text('ERC20 ⚠️ (رسوم عالية)', 'snet:ERC20')

  await ctx.reply('🌐 على أي شبكة ستُرسل USDT؟', { reply_markup: networkKb })
  const netCtx = await conversation.waitForCallbackQuery(/^snet:/)
  const network = netCtx.callbackQuery.data.split(':')[1] as any
  await netCtx.answerCallbackQuery()

  if (NETWORK_FEES[network].warning) {
    await ctx.reply(`⚠️ تنبيه: ${NETWORK_FEES[network].warning}`)
  }

  // Step 3: Payment method for receiving IQD
  const payKb = new InlineKeyboard()
    .text('🏦 FIB', 'spay:FIB')
    .text('📱 ZainCash', 'spay:ZAINCASH')
    .text('💳 Qi Card', 'spay:QICARD')

  await ctx.reply('💳 كيف تريد استلام الدينار (IQD)؟', { reply_markup: payKb })
  const payCtx = await conversation.waitForCallbackQuery(/^spay:/)
  const paymentMethod = payCtx.callbackQuery.data.split(':')[1] as any
  await payCtx.answerCallbackQuery()

  // Step 4: Local account number
  const accountLabel: Record<string, string> = {
    FIB: 'رقم حساب FIB',
    ZAINCASH: 'رقم هاتف ZainCash',
    QICARD: 'رقم بطاقة Qi Card',
  }
  await ctx.reply(`📬 أدخل ${accountLabel[paymentMethod]} لاستلام IQD:`)
  const accountCtx = await conversation.wait()
  const localAccount = accountCtx.message?.text?.trim()
  if (!localAccount || localAccount.length < 8) {
    return ctx.reply('❌ رقم الحساب غير صالح.')
  }

  // Step 5: Governorate
  const govKb = new InlineKeyboard()
  GOVERNORATES.slice(0, 6).forEach((g, i) => {
    govKb.text(g, `sgov:${g}`)
    if (i % 2 === 1) govKb.row()
  })
  govKb.row().text('أخرى', 'sgov:أخرى')

  await ctx.reply('📍 اختر محافظتك:', { reply_markup: govKb })
  const govCtx = await conversation.waitForCallbackQuery(/^sgov:/)
  const governorate = govCtx.callbackQuery.data.split(':')[1]
  await govCtx.answerCallbackQuery()

  // Step 6: Summary + escrow address
  const { data: rates } = await getRates()
  const calc = calcSellReceive(amountUsdt, rates.sellRate)
  const networkFeeIqd = Math.round(NETWORK_FEES[network].approxUsd * rates.sellRate)

  const escrowAddresses: Record<string, string> = {
    TRC20: process.env.ESCROW_WALLET_TRC20 || 'TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ERC20: process.env.ESCROW_WALLET_ERC20 || '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    BEP20: process.env.ESCROW_WALLET_BEP20 || '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  }

  const summary = `
🔴 <b>ملخص طلب البيع</b>
━━━━━━━━━━━━━━━
💵 المبلغ: ${amountUsdt} USDT
🌐 الشبكة: ${network}
💳 استلام عبر: ${paymentMethod}
📬 الحساب: <code>${localAccount}</code>
📍 المحافظة: ${governorate}
━━━━━━━━━━━━━━━
💰 السعر: ${rates.sellRate.toLocaleString()} IQD/USDT
📊 المبلغ الأساسي: ${calc.baseIqd.toLocaleString()} IQD
💸 العمولة (1%): ${calc.commission.toLocaleString()} IQD
━━━━━━━━━━━━━━━
<b>تستلم: ${calc.receive.toLocaleString()} IQD</b>
`

  const confirmKb = new InlineKeyboard()
    .text('✅ تأكيد وإنشاء الطلب', 'sconfirm:yes')
    .text('❌ إلغاء', 'sconfirm:no')

  await ctx.reply(summary, { parse_mode: 'HTML', reply_markup: confirmKb })
  const confirmCtx = await conversation.waitForCallbackQuery(/^sconfirm:/)
  await confirmCtx.answerCallbackQuery()

  if (confirmCtx.callbackQuery.data === 'sconfirm:no') {
    return ctx.reply('❌ تم إلغاء الطلب.')
  }

  // Create order
  const { data: order } = await createOrder({
    type: 'SELL',
    amountUsdt,
    network,
    paymentMethod,
    localAccount,
    governorate,
    telegramId: ctx.from!.id,
    telegramUsername: ctx.from?.username,
  })

  // Send escrow instructions
  await ctx.reply(
    `✅ <b>تم إنشاء طلب البيع!</b>
━━━━━━━━━━━━━━━
📋 رقم الطلب: <code>${order.orderRef}</code>

<b>الخطوة التالية: أرسل USDT لمحفظة الضمان</b>
━━━━━━━━━━━━━━━
🌐 الشبكة: <b>${network}</b>
📬 العنوان:
<code>${escrowAddresses[network]}</code>

💵 المبلغ بالضبط: <b>${amountUsdt} USDT</b>

⚠️ <b>مهم:</b>
• أرسل على شبكة ${network} فقط
• لا ترسل أي شبكة أخرى — ستخسر أموالك
• بعد الإرسال اضغط "تأكيد الإرسال"

⏱ الطلب صالح لـ 30 دقيقة`,
    {
      parse_mode: 'HTML',
      reply_markup: new InlineKeyboard()
        .text('✅ أرسلت USDT — تأكيد', `sent:${order.orderRef}`)
        .row()
        .text('❌ إلغاء', `cancel:${order.orderRef}`),
    }
  )
}
