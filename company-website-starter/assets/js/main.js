
// Konstanta endpoint form: pilih salah satu
// Default: PHP (server/php/contact.php)
const FORM_ENDPOINT = 'server/php/contact.php';
// Jika ingin Node/Express, ubah ke '/api/contact' dan jalankan server di server/node

// Tahun dinamis
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Tema
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'light' || (!savedTheme && prefersLight)){
    document.documentElement.classList.add('light');
  }
  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', ()=>{
    const open = mobileMenu.hasAttribute('hidden') ? false : true;
    if(open){ mobileMenu.setAttribute('hidden',''); menuToggle.setAttribute('aria-expanded','false'); }
    else { mobileMenu.removeAttribute('hidden'); menuToggle.setAttribute('aria-expanded','true'); }
  });
}

// Scroll halus
Array.from(document.querySelectorAll('a[href^="#"]')).forEach(a=>{
  a.addEventListener('click', function(e){
    const id = this.getAttribute('href').slice(1);
    if(!id) return;
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  })
});

// Validasi & kirim form
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');
  const showError = (id) => { const el = document.getElementById(id); if (el) el.style.display = 'block'; };
  const hideErrors = () => document.querySelectorAll('.error').forEach(el=> el.style.display='none');

  form.addEventListener('submit', async (e)=>{
    // Biarkan fallback non-JS tetap bisa submit (action=server/php/contact.php)
    e.preventDefault();

    hideErrors();
    let valid = true;
    const nama = document.getElementById('nama');
    const email = document.getElementById('email');
    const pesan = document.getElementById('pesan');

    if(!nama.value.trim()) { valid=false; showError('errNama'); }
    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if(!emailOK) { valid=false; showError('errEmail'); }
    if(!pesan.value.trim()) { valid=false; showError('errPesan'); }

    if(!valid){
      if (status) status.textContent = 'Periksa kembali input Anda.';
      return;
    }

    try{
      if (status) status.textContent = 'Mengirim...';
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ nama: nama.value.trim(), email: email.value.trim(), pesan: pesan.value.trim() })
      });

      // Tanggapan bisa JSON (AJAX) atau HTML (fallback)
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          if (status) status.textContent = 'Terima kasih! Pesan Anda telah terkirim.';
          form.reset();
        } else {
          if (status) status.textContent = data.message || 'Maaf, terjadi kesalahan saat mengirim pesan.';
        }
      } else {
        // Jika server mengembalikan HTML, anggap berhasil
        if (status) status.textContent = 'Terima kasih! Pesan Anda telah terkirim.';
        form.reset();
      }
    } catch(err){
      if (status) status.textContent = 'Gagal mengirim. Coba lagi nanti.';
      console.error(err);
    }
  });
}
