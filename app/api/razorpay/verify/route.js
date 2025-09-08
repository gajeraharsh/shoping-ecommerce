import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { ok: false, message: 'Method not allowed. Use POST with JSON body to verify Razorpay payment.' },
    { status: 405 }
  )
}

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      payment_collection_id,
      session_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      data,
    } = body || {}

    if (!payment_collection_id || !session_id) {
      return NextResponse.json(
        { ok: false, message: 'payment_collection_id and session_id are required' },
        { status: 400 }
      )
    }

    const payload = data || {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }

    if (!payload?.razorpay_payment_id || !payload?.razorpay_order_id || !payload?.razorpay_signature) {
      return NextResponse.json(
        { ok: false, message: 'Missing Razorpay fields: razorpay_payment_id, razorpay_order_id, razorpay_signature' },
        { status: 400 }
      )
    }

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000'
    // Normalize base and ensure exactly one /store segment
    const baseNoSlash = base.replace(/\/$/, '')
    const url = /\/store$/.test(baseNoSlash)
      ? `${baseNoSlash}/razorpay/verify`
      : `${baseNoSlash}/store/razorpay/verify`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Forward publishable key expected by Medusa store API
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({
        payment_collection_id,
        session_id,
        ...payload,
      }),
      // include credentials if your Medusa uses cookie auth for store
      credentials: 'include',
    })

    // Safely parse response as JSON, fallback to text
    const raw = await resp.text()
    let dataResp = null
    try {
      dataResp = raw ? JSON.parse(raw) : null
    } catch (_) {
      // Not JSON from upstream; return a clear error
      if (!resp.ok) {
        return NextResponse.json(
          {
            ok: false,
            message: `Upstream verify failed with status ${resp.status}. URL: ${url}. Response was not JSON: ${raw?.slice(0, 200) || ''}`,
          },
          { status: 502 }
        )
      }
      return NextResponse.json(
        {
          ok: false,
          message: 'Unexpected non-JSON response from upstream verification service.',
        },
        { status: 502 }
      )
    }

    if (!resp.ok) {
      return NextResponse.json({ ok: false, message: dataResp?.message || 'Verify failed' }, { status: resp.status })
    }

    return NextResponse.json({ ok: true, payment_collection: dataResp?.payment_collection })
  } catch (e) {
    const msg = e?.message || 'Failed to verify Razorpay payment'
    return NextResponse.json({ ok: false, message: msg }, { status: 500 })
  }
}
