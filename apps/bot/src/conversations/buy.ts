import { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import { Context, InlineKeyboard } from 'grammy'
import { GOVERNORATES, NETWORK_FEES, calcBuyTotal } from '@p2p-iraq/shared'
import { createOrder, getRates } from '../lib/api'

type MyContext = Context & ConversationFlavor

export async function buyConversation(conversation: Conversation<MyContext>, ctx: MyContext) {
  // Step 1: Amount
  await ctx.reply(
    '🟢 <b>شراء USDT</b>\n━━━━━━━━━━━━━━━\n💵 كم USDT تريد شراء؟\n\nاكتب المبلغ بالدولار (مثال: 100)',
    { parse_mode: 'HTML' }
  )
  const amountCtx = await conversation.wait()
  const amountUsdt = parseFloat(amountCtx.message?.text || '0')
  if (isNaN(amountUsdt) || amountUsdt < 10 || amountUsdt > 5000) {
    return ctx.reply('❌ مبلغ غير صالح. يجب أن يكون بين 10 و 5000 دولار.')
  }

  // Step 2: Network
  const networkKb = new InlineKeyboard()
    .text('TRC20 ✅ (موصى به)', 'net:TRC20').row()
    .text('BEP20', 'net:BEP20').row()
    .text('ERC20 ⚠️ (رسوم عالية)', 'net:ERC20')

  await ctx.reply('🌐 اختر شبكة USDT:', { reply_markup: networkKb })
  const netCtx = await conversation.waitForCallbackQuery(/^net:/)
  const network = netCtx.callbackQuery.data.split(':')[1] as any
  await netCtx.answerCallbackQuery()

  if (NETWORK_FEES[network].warning) {
    await ctx.reply(`⚠️ تنبيه: ${NETWORK_FEES[network].warning}`)
  }

  // Step 3: Wallet address
  await ctx.reply(`📬 أدخل عنوان محفظتك (${network}):`)
  const walletCtx = await conversation.wait()
  const walletAddress = walletCtx.message?.text?.trim()
  if (!walletAddress || walletAddress.length < 20) {
    return ctx.reply('❌ عنوان محفظة غير صالح.')
  }

  // Step 4: Payment method
  const payKb = new InlineKeyboard()
    .text('🏦 FIB', 'pay:FIB')
    .text('📱 ZainCash', 'pay:ZAINCASH')
    .text('💳 Qi Card', 'pay:QICARD')

  await ctx.reply('💳 اختر طريقة دفعك (IQD):', { reply_markup: payKb })
  const payCtx = await conversation.waitForCallbackQuery(/^pay:/)
  const paymentMethod = payCtx.callbackQuery.data.split(':')[1] as any
  await payCtx.answerCallbackQuery()

  // Step 5: Governorate
  const govKb = new InlineKeyboard()
  GOVERNORATES.slice(0, 6).forEach((g, i) => {
    govKb.text(g, `gov:${g}`)
    if (i % 2 === 1) govKb.row()
  })
  govKb.row().text('أخرى', 'gov:أخرى')

  await ctx.reply('📍 اختر محافظتك:', { reply_markup: govKb })
  const govCtx = await conversation.waitForCallbackQuery(/^gov:/)
  const governorate = govCtx.callbackQuery.data.split(':')[1]
  await govCtx.answerCallbackQuery()

  // Step 6: Summary + confirm
  const { data: rates } = await getRates()
  const calc = calcBuyTotal(amountUsdt, rates.buyRate)
  const networkFeeIqd = Math.round(NETWORK_FEES[network].approxUsd * rates.buyRate)

  const summary = `
✅ <b>ملخص الطلب</b>
━━━━━━━━━━━━━━━
💵 المبلغ: ${amountUsdt} USDT
🌐 الشبكة: ${network}
💳 طريقة الدفع: ${paymentMethod}
📬 المحفظة: <code>${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}</code>
━━━━━━━━━━━━━━━
💰 السعر: ${rates.buyRate.toLocaleString()} IQD/USDT
📊 المبلغ الأساسي: ${calc.baseIqd.toLocaleString()} IQD
💸 العمولة (1%): ${calc.commission.toLocaleString()} IQD
🔗 رسوم الشبكة: ~${networkFeeIqd.toLocaleString()} IQD
━━━━━━━━━━━━━━━
<b>المجموع: ${(calc.total + networkFeeIqd).toLocaleString()} IQD</b>
<b>تستلم: ~${(amountUsdt - NETWORK_FEES[network].approxUsd).toFixed(1)} USDT</b>
`
  const confirmKb = new InlineKeyboard()
    .text('✅ تأكيد الطلب', 'confirm:yes')
    .text('❌ إلغاء', 'confirm:no')

  await ctx.reply(summary, { parse_mode: 'HTML', reply_markup: confirmKb })
  const confirmCtx = await conversation.waitForCallbackQuery(/^confirm:/)
  await confirmCtx.answerCallbackQuery()

  if (confirmCtx.callbackQuery.data === 'confirm:no') {
    return ctx.reply('❌ تم إلغاء الطلب.')
  }

  // Create order via API
  const { data: order } = await createOrder({
    type: 'BUY',
    amountUsdt,
    network,
    paymentMethod,
    walletAddress,
    governorate,
    telegramId: ctx.from!.id,
    telegramUsername: ctx.from?.username,
  })

  await ctx.reply(
    `🎉 <b>تم إنشاء طلبك!</b>\n━━━━━━━━━━━━━━━\n` +
    `📋 رقم الطلب: <code>${order.orderRef}</code>\n\n` +
    `سيتواصل معك المشرف خلال 5 دقائق بتعليمات الدفع.\n\n` +
    `⏱ الطلب صالح لـ 30 دقيقة.`,
    { parse_mode: 'HTML' }
  )
}
