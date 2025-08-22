// script.js - Mendukung Markdown (Marked.js) + ikon pesawat kertas pada tombol kirim

// Dapatkan elemen-elemen HTML yang dibutuhkan
const form = document.getElementById("chat-form")
const input = document.getElementById("user-input")
const chatBox = document.getElementById("chat-box")

// Ambil marked dari window (pastikan index.html memuat CDN Marked.js)
const marked = window.marked

/**
 * Appends a new message to the chat box with proper structure.
 * Creates the full message structure with avatar, name, bubble, and timestamp.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The content of the message (can be Markdown).
 * @param {boolean} isMarkdown - Flag to determine if the text should be parsed as Markdown.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(sender, text, isMarkdown = false) {
  // Create main message container
  const messageDiv = document.createElement("div")
  messageDiv.classList.add("message", sender)

  // Create message header with avatar and name
  const messageHeader = document.createElement("div")
  messageHeader.classList.add("message-header")

  // Create avatar
  const avatar = document.createElement("div")
  avatar.classList.add("avatar", sender)

  if (sender === "bot") {
    // Create robot icon structure
    const robotIcon = document.createElement("div")
    robotIcon.classList.add("robot-icon")

    const robotHead = document.createElement("div")
    robotHead.classList.add("robot-head")

    const robotEyes = document.createElement("div")
    robotEyes.classList.add("robot-eyes")

    const leftEye = document.createElement("div")
    leftEye.classList.add("robot-eye")
    const rightEye = document.createElement("div")
    rightEye.classList.add("robot-eye")

    robotEyes.appendChild(leftEye)
    robotEyes.appendChild(rightEye)

    const robotMouth = document.createElement("div")
    robotMouth.classList.add("robot-mouth")

    robotHead.appendChild(robotEyes)
    robotHead.appendChild(robotMouth)
    robotIcon.appendChild(robotHead)
    avatar.appendChild(robotIcon)
  } else {
    // Create user icon structure
    const userIcon = document.createElement("div")
    userIcon.classList.add("user-icon")

    const userHead = document.createElement("div")
    userHead.classList.add("user-head")

    const userBody = document.createElement("div")
    userBody.classList.add("user-body")

    userIcon.appendChild(userHead)
    userIcon.appendChild(userBody)
    avatar.appendChild(userIcon)
  }

  // Create sender name
  const senderName = document.createElement("div")
  senderName.classList.add("sender-name")
  senderName.textContent = sender === "bot" ? "Aiva AI" : "You"

  messageHeader.appendChild(avatar)
  messageHeader.appendChild(senderName)

  // Create message bubble
  const messageBubble = document.createElement("div")
  messageBubble.classList.add("message-bubble")

  if (isMarkdown && marked && typeof marked.parse === "function") {
    try {
      messageBubble.innerHTML = marked.parse(text)
    } catch {
      messageBubble.textContent = text
    }
  } else {
    messageBubble.textContent = text
  }

  // Create timestamp
  const messageTime = document.createElement("div")
  messageTime.classList.add("message-time")
  const now = new Date()
  const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  messageTime.textContent = timeString

  // Add action buttons for bot messages
  if (sender === "bot") {
    const messageActions = document.createElement("div")
    messageActions.classList.add("message-actions")

    // Speaker button
    const speakerBtn = document.createElement("button")
    speakerBtn.classList.add("action-btn")
    const speakerIcon = document.createElement("div")
    speakerIcon.classList.add("speaker-icon")
    speakerBtn.appendChild(speakerIcon)

    // Copy button
    const copyBtn = document.createElement("button")
    copyBtn.classList.add("action-btn")
    const copyIcon = document.createElement("div")
    copyIcon.classList.add("copy-icon")
    copyBtn.appendChild(copyIcon)

    // Refresh button
    const refreshBtn = document.createElement("button")
    refreshBtn.classList.add("action-btn")
    const refreshIcon = document.createElement("div")
    refreshIcon.classList.add("refresh-icon")
    refreshBtn.appendChild(refreshIcon)

    messageActions.appendChild(speakerBtn)
    messageActions.appendChild(copyBtn)
    messageActions.appendChild(refreshBtn)

    messageDiv.appendChild(messageHeader)
    messageDiv.appendChild(messageBubble)
    messageDiv.appendChild(messageActions)
    messageDiv.appendChild(messageTime)
  } else {
    messageDiv.appendChild(messageHeader)
    messageDiv.appendChild(messageBubble)
    messageDiv.appendChild(messageTime)
  }

  chatBox.appendChild(messageDiv)
  // Auto scroll ke pesan terbaru
  chatBox.scrollTop = chatBox.scrollHeight
  return messageDiv
}

/**
 * Menambahkan indikator "thinking..."
 */
function showThinking(text = "Alfi sedang mengetik...") {
  const thinkingDiv = document.createElement("div")
  thinkingDiv.classList.add("message", "bot")
  thinkingDiv.id = "thinking-message"

  const messageHeader = document.createElement("div")
  messageHeader.classList.add("message-header")

  const avatar = document.createElement("div")
  avatar.classList.add("avatar", "bot")

  const robotIcon = document.createElement("div")
  robotIcon.classList.add("robot-icon")

  const robotHead = document.createElement("div")
  robotHead.classList.add("robot-head")

  const robotEyes = document.createElement("div")
  robotEyes.classList.add("robot-eyes")

  const leftEye = document.createElement("div")
  leftEye.classList.add("robot-eye")
  const rightEye = document.createElement("div")
  rightEye.classList.add("robot-eye")

  robotEyes.appendChild(leftEye)
  robotEyes.appendChild(rightEye)

  const robotMouth = document.createElement("div")
  robotMouth.classList.add("robot-mouth")

  robotHead.appendChild(robotEyes)
  robotHead.appendChild(robotMouth)
  robotIcon.appendChild(robotHead)
  avatar.appendChild(robotIcon)

  const senderName = document.createElement("div")
  senderName.classList.add("sender-name")
  senderName.textContent = "Aiva AI"

  messageHeader.appendChild(avatar)
  messageHeader.appendChild(senderName)

  const thinkingBubble = document.createElement("div")
  thinkingBubble.classList.add("message-bubble", "thinking")

  const thinkingText = document.createElement("span")
  thinkingText.textContent = text

  const thinkingDots = document.createElement("div")
  thinkingDots.classList.add("thinking-dots")

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div")
    dot.classList.add("thinking-dot")
    thinkingDots.appendChild(dot)
  }

  thinkingBubble.appendChild(thinkingText)
  thinkingBubble.appendChild(thinkingDots)

  thinkingDiv.appendChild(messageHeader)
  thinkingDiv.appendChild(thinkingBubble)

  chatBox.appendChild(thinkingDiv)
  chatBox.scrollTop = chatBox.scrollHeight
  return thinkingDiv
}

// Pesan sambutan awal
appendMessage("bot", "Halo! Saya Alfi. Bagaimana saya dapat membantu Anda hari ini?", false)

const sendSound = new Audio("/sounds/send.mp3")
const receiveSound = new Audio("/sounds/receive.mp3")

// Handle audio loading errors gracefully
sendSound.addEventListener("error", () => console.log("Send sound not available"))
receiveSound.addEventListener("error", () => console.log("Receive sound not available"))

// Dengarkan event submission pada form
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const userMessage = input.value.trim()
  if (!userMessage) return

  // 1) Tambahkan pesan user
  appendMessage("user", userMessage, false)
  sendSound.play().catch(() => {}) // Mainkan suara kirim (ignore errors)
  input.value = ""

  // 2) Tampilkan indikator thinking
  const thinkingMessageElement = showThinking()

  try {
    // 3) Panggil API backend Anda
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Payload tetap seperti yang Anda gunakan
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage }],
        model: "gemini-2.5-flash",
      }),
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`)
    }

    // Asumsi server mengembalikan { reply: "markdown or string" }
    const data = await response.json()

    // 4) Ganti "thinking" dengan jawaban AI
    if (data && typeof data.reply !== "undefined") {
      if (thinkingMessageElement && thinkingMessageElement.parentNode) {
        chatBox.removeChild(thinkingMessageElement)
      }
      appendMessage("bot", String(data.reply), true) // parse Markdown
      receiveSound.play().catch(() => {}) // ignore errors
    } else {
      if (thinkingMessageElement && thinkingMessageElement.parentNode) {
        chatBox.removeChild(thinkingMessageElement)
      }
      appendMessage("bot", "Sorry, no response received.", false)
    }
  } catch (error) {
    console.error("Failed to fetch chat response:", error)
    if (thinkingMessageElement && thinkingMessageElement.parentNode) {
      chatBox.removeChild(thinkingMessageElement)
    }
    appendMessage("bot", "Failed to get response from server.", false)
  }
})
