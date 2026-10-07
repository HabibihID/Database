<!-- ============================================
  INTEGRASI SUPABASE - HABIBI STORE
  Cara pakai:
  1. Tempel script ini sebelum </body> di website kamu
  2. Ganti SUPABASE_URL & SUPABASE_ANON_KEY kalau beda project
  3. Panggil saveOrder() saat checkout, trackOrder() untuk lacak
============================================= -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
const SUPABASE_URL = 'https://ttbpiljhrgxdlllyran.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kD9ynZx4ETdDtMeChBWKQQ_wmHi6Mgc';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- SIMPAN ORDER ---
// Panggil: saveOrder({ customer_name, whatsapp, product_name, panel_username,
//          payment_method, voucher_code, subtotal, discount, total })
async function saveOrder(data) {
  const invoice = 'HBS-' + new Date().toISOString().slice(0,10).replace(/-/g,'')
    + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
  const { data: result, error } = await supabase
    .from('orders')
    .insert([{ invoice_number: invoice, status: 'menunggu_pembayaran', ...data }])
    .select()
    .single();
  if (error) { console.error('Gagal simpan order:', error); return { ok: false, error }; }
  return { ok: true, invoice_number: invoice, order: result };
}

// --- LACAK PESANAN ---
// Panggil: trackOrder('HBS-20261007-AB12')
async function trackOrder(invoiceNumber) {
  const { data, error } = await supabase
    .from('orders')
    .select('invoice_number, product_name, total, status, created_at')
    .eq('invoice_number', invoiceNumber.trim().toUpperCase())
    .single();
  if (error || !data) return { ok: false, message: 'Invoice tidak ditemukan' };
  const statusLabel = {
    'menunggu_pembayaran': 'Menunggu Pembayaran',
    'diproses': 'Diproses',
    'selesai': 'Selesai',
    'dibatalkan': 'Dibatalkan'
  };
  return { ok: true, order: { ...data, status_label: statusLabel[data.status] || data.status } };
}

// --- CONTOH PAKAI DI CHECKOUT ---
// const hasil = await saveOrder({
//   customer_name: 'Budi',
//   whatsapp: '628123456789',
//   product_name: 'Panel 4GB',
//   panel_username: 'budi123',
//   payment_method: 'QRIS',
//   voucher_code: 'HEMAT10',
//   subtotal: 5000,
//   discount: 500,
//   total: 4500
// });
// if (hasil.ok) tampilkanStruk(hasil.invoice_number);
</script>
