class MobileChatbot {
  constructor() {
    this.chatBox = document.getElementById("chat-box")
    this.userInput = document.getElementById("user-input")
    this.chatForm = document.getElementById("chat-form")

    this.init()
  }

  init() {
    // Add welcome message
    this.addWelcomeMessage()

    // Event listeners
    this.chatForm.addEventListener("submit", (e) => this.handleSubmit(e))

    // Auto-focus input
    this.userInput.focus()
  }

  addWelcomeMessage() {
    const welcomeText = "Halo! Saya Alfi. Bagaimana saya dapat membantu Anda hari ini?"
    this.appendMessage("bot", welcomeText, "Aiva AI")
  }

  async handleSubmit(e) {
    e.preventDefault()

    const message = this.userInput.value.trim()
    if (!message) return

    // Add user message
    this.appendMessage("user", message, "You")
    this.userInput.value = ""

    // Play send sound
    this.playSound("send")

    // Show thinking indicator
    const thinkingId = this.showThinking()

    try {
      // Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from server")
      }

      const data = await response.json()

      // Remove thinking indicator
      this.removeThinking(thinkingId)

      // Add bot response
      this.appendMessage("bot", data.response, "Aiva AI")

      // Play receive sound
      this.playSound("receive")
    } catch (error) {
      console.error("Error:", error)
      this.removeThinking(thinkingId)
      this.appendMessage("bot", "Maaf, terjadi kesalahan. Silakan coba lagi.", "Aiva AI")
    }
  }

  appendMessage(sender, content, name) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}`

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    const avatar = sender === "bot" ? "🤖" : "👤"

    messageDiv.innerHTML = `
            <div class="message-header">
                <div class="avatar ${sender}">${avatar}</div>
                <span class="sender-name">${name}</span>
            </div>
            <div class="message-bubble">
                ${this.formatMessage(content)}
            </div>
            <div class="message-time">${currentTime}</div>
            ${sender === "bot" ? this.getActionButtons() : ""}
        `

    this.chatBox.appendChild(messageDiv)
    this.scrollToBottom()
  }

  formatMessage(content) {
    // Use marked.js for markdown if available
    const marked = window.marked // Declare the variable before using it
    if (typeof marked !== "undefined") {
      return marked.parse(content)
    }
    return content.replace(/\n/g, "<br>")
  }

  getActionButtons() {
    return `
            <div class="message-actions">
                <button class="action-btn" onclick="this.closest('.message').querySelector('.message-bubble').innerHTML">🔊</button>
                <button class="action-btn" onclick="navigator.clipboard.writeText(this.closest('.message').querySelector('.message-bubble').textContent)">📋</button>
                <button class="action-btn" onclick="location.reload()">🔄</button>
            </div>
        `
  }

  showThinking() {
    const thinkingDiv = document.createElement("div")
    const thinkingId = "thinking-" + Date.now()
    thinkingDiv.id = thinkingId
    thinkingDiv.className = "message bot"

    thinkingDiv.innerHTML = `
            <div class="message-header">
                <div class="avatar bot">🤖</div>
                <span class="sender-name">Aiva AI</span>
            </div>
            <div class="message-bubble">
                <div class="thinking">
                    <span>Thinking</span>
                    <div class="thinking-dots">
                        <div class="thinking-dot"></div>
                        <div class="thinking-dot"></div>
                        <div class="thinking-dot"></div>
                    </div>
                </div>
            </div>
        `

    this.chatBox.appendChild(thinkingDiv)
    this.scrollToBottom()
    return thinkingId
  }

  removeThinking(thinkingId) {
    const thinkingElement = document.getElementById(thinkingId)
    if (thinkingElement) {
      thinkingElement.remove()
    }
  }

  scrollToBottom() {
    this.chatBox.scrollTop = this.chatBox.scrollHeight
  }

  playSound(type) {
    try {
      const audio = new Audio(`/public/sounds/${type}.mp3`)
      audio.volume = 0.3
      audio.play().catch((e) => console.log("Sound play failed:", e))
    } catch (error) {
      console.log("Sound not available:", error)
    }
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MobileChatbot()
})
