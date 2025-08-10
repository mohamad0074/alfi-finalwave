// Dapatkan elemen-elemen HTML yang dibutuhkan
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

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
  msg.classList.add('chat-bubble', sender); // Ubah 'message' menjadi 'chat-bubble' sesuai dengan CSS Anda

  if (isMarkdown) {
    // Proses teks dengan Marked.js untuk mengubah Markdown ke HTML
    msg.innerHTML = marked.parse(text);
  } else {
    // Jika bukan Markdown, tampilkan teks biasa
    msg.textContent = text;
  }
  
  chatBox.appendChild(msg);
  
  // Secara otomatis scroll ke pesan terbaru
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Dengarkan event submission pada form
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Tambahkan pesan pengguna ke chat box
  // Pesan pengguna tidak perlu diproses sebagai Markdown
  appendMessage('user', userMessage);
  input.value = '';

  // 2. Tampilkan pesan sementara "Thinking..." dan dapatkan referensi ke elemen tersebut
  // Pesan "Thinking..." juga tidak diproses sebagai Markdown
  const thinkingMessageElement = appendMessage('bot', 'Alfi...');

  try {
    // 3. Kirim pesan pengguna ke API backend
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
    messages: [{ role: 'user', content: userMessage }],
    model: 'gemini-2.5-flash'
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // 4. Ganti pesan "Thinking..." dengan respons AI yang sebenarnya
    if (data && data.reply) {
      // Hapus pesan "Thinking..." yang lama
      chatBox.removeChild(thinkingMessageElement);

      // Tambahkan pesan AI yang baru, dengan memprosesnya sebagai Markdown
      appendMessage('bot', data.reply, true);
    } else {
      // Tangani kasus di mana server merespons tetapi tanpa hasil
      thinkingMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Failed to fetch chat response:', error);
    // 5. Tangani error jaringan atau masalah lain saat memanggil fetch
    // Ganti pesan "Thinking..." dengan pesan error
    thinkingMessageElement.textContent = 'Failed to get response from server.';
  }
});