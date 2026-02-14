
<?php
// server/php/contact.php
// Konfigurasi – ganti sesuai domain & email Anda
$TO_EMAIL   = 'you@example.com';      // tujuan email Anda
$FROM_EMAIL = 'no-reply@yourdomain.com'; // alamat pengirim (disarankan domain sendiri)
$SUBJECT    = 'Pesan Baru dari Form Kontak Website';

// Helper: tangkap body JSON jika ada
function get_json_body(){
  $input = file_get_contents('php://input');
  if ($input) {
    $data = json_decode($input, true);
    if (json_last_error() === JSON_ERROR_NONE) return $data;
  }
  return null;
}

// Ambil data dari JSON (AJAX) atau POST form biasa
$data = get_json_body();
$nama = $data['nama'] ?? ($_POST['nama'] ?? '');
$email = $data['email'] ?? ($_POST['email'] ?? '');
$pesan = $data['pesan'] ?? ($_POST['pesan'] ?? '');

// Validasi dasar
$errors = [];
$nama = trim($nama);
$email = trim($email);
$pesan = trim($pesan);

if ($nama === '') $errors[] = 'Nama wajib diisi.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email tidak valid.';
if ($pesan === '') $errors[] = 'Pesan wajib diisi.';

// Deteksi AJAX
$is_ajax = strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'xmlhttprequest';

if (!empty($errors)) {
  if ($is_ajax) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
  } else {
    http_response_code(400);
    echo '<!doctype html><meta charset="utf-8"><title>Form Error</title><p>'.implode('<br>', $errors).'</p>';
    exit;
  }
}

// Sanitasi sederhana untuk mencegah injection di header
$clean_email = str_replace(["", "
", "%0a", "%0d"], '', $email);
$headers   = [];
$headers[] = 'From: '.$FROM_EMAIL;
$headers[] = 'Reply-To: '.$clean_email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$body  = "Anda menerima pesan baru dari form kontak website:

";
$body .= "Nama: $nama
";
$body .= "Email: $email
";
$body .= "Pesan:
$pesan
";
$body .= "
— Dikirim otomatis pada ".date('Y-m-d H:i:s');

$sent = @mail($TO_EMAIL, $SUBJECT, $body, implode("
", $headers));

if ($is_ajax) {
  header('Content-Type: application/json');
  if ($sent) echo json_encode(['success' => true]);
  else echo json_encode(['success' => false, 'message' => 'Gagal mengirim email. Periksa konfigurasi server Anda.']);
  exit;
} else {
  if ($sent) {
    echo '<!doctype html><meta charset="utf-8"><title>Terima kasih</title><p>Terima kasih! Pesan Anda telah terkirim.</p>';
  } else {
    http_response_code(500);
    echo '<!doctype html><meta charset="utf-8"><title>Gagal</title><p>Gagal mengirim email. Silakan coba lagi nanti.</p>';
  }
  exit;
}
