// script.js - Mendukung Markdown (Marked.js) + ikon pesawat kertas pada tombol kirim

// Dapatkan elemen-elemen HTML yang dibutuhkan
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Ambil marked dari window (pastikan index.html memuat CDN Marked.js)
const marked = window.marked;

/**
 * Appends a new message to the chat box.
 * This function now handles Markdown formatting using Marked.js.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The content of the message (can be Markdown).
 * @param {boolean} isMarkdown - Flag to determine if the text should be parsed as Markdown.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(sender, text, isMarkdown = false) {
  const msg = document.createElement('div');
  msg.classList.add('chat-bubble', sender); // sesuai CSS Anda

  if (isMarkdown && marked && typeof marked.parse === 'function') {
    try {
      msg.innerHTML = marked.parse(text);
    } catch {
      msg.textContent = text;
    }
  } else {
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  // Auto scroll ke pesan terbaru
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
/**
 * Menambahkan indikator "thinking..."
 */
function showThinking(text = 'Alfi...') {
  return appendMessage('bot', text, false);
}

/**
 * SVG ikon pesawat kertas (inline) agar tanpa dependensi eksternal.
 * Param size untuk ukuran ikon (px).
 */
function getPaperPlaneSVG(size = 16) {
  // Bentuk sederhana "paper-plane" (diisi currentColor agar mengikuti warna teks tombol)
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"
         focusable="false" xmlns="http://www.w3.org/2000/svg"
         style="display:inline-block;vertical-align:-2px">
      <path d="M22 3L2 12l9.8 1.6L13 22l9-19z" fill="currentColor"></path>
      <path d="M22 3L11.8 13.6" stroke="currentColor" stroke-width="1.6"
            stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;
}

/**
 * Pasang ikon pesawat kertas ke tombol submit.
 * - Jika layar kecil, tampilkan hanya ikon
 * - Jika layar lebar, ikon + teks (ambil teks eksisting tombol)
 */
function renderSendButtonIcon() {
  const btn =
    form?.querySelector('button[type="submit"]') ||
    document.querySelector('#chat-form button[type="submit"]');
  if (!btn) return;

  // Ambil label dari isi tombol saat ini (fallback "Kirim")
  const currentLabel = (btn.textContent || '').trim() || 'Kirim';

  // Tampilkan hanya ikon di layar kecil, ikon + teks di layar besar
  const compact = window.matchMedia('(max-width: 640px)').matches;
  if (compact) {
    btn.setAttribute('aria-label', currentLabel);
    btn.innerHTML = getPaperPlaneSVG(18);
  } else {
    btn.removeAttribute('aria-label');
    btn.innerHTML = `${getPaperPlaneSVG(16)} <span style="margin-left:8px">${currentLabel}</span>`;
  }
}

// Pesan sambutan awal
appendMessage('bot', 'Halo! Saya Alfi. Bagaimana saya dapat membantu Anda hari ini?', false);
const sendSound = new Audio('/sounds/send.mp3');
const receiveSound = new Audio('/sounds/receive.mp3');

// Dengarkan event submission pada form
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1) Tambahkan pesan user
  appendMessage('user', userMessage, false);
  sendSound.play().catch(console.error); // Mainkan suara kirim
  input.value = '';

  // 2) Tampilkan indikator thinking
  const thinkingMessageElement = showThinking('Alfi...');

  try {
    // 3) Panggil API backend Anda
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Payload tetap seperti yang Anda gunakan
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
        model: 'gemini-2.5-flash',
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Asumsi server mengembalikan { reply: "markdown or string" }
    const data = await response.json();

    // 4) Ganti "thinking" dengan jawaban AI
    if (data && typeof data.reply !== 'undefined') {
      if (thinkingMessageElement && thinkingMessageElement.parentNode) {
        chatBox.removeChild(thinkingMessageElement);
      }
      appendMessage('bot', String(data.reply), true);
      receiveSound.play() // parse Markdown
    } else {
      if (thinkingMessageElement) {
        thinkingMessageElement.textContent = 'Sorry, no response received.';
      }
    }
  } catch (error) {
    console.error('Failed to fetch chat response:', error);
    if (thinkingMessageElement) {
      thinkingMessageElement.textContent = 'Failed to get response from server.';
    }
  }
});

// Render ikon saat pertama kali load dan saat resize agar responsif
window.addEventListener('DOMContentLoaded', renderSendButtonIcon);
window.addEventListener('resize', renderSendButtonIcon);