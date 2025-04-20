// Enhanced functionality for the music player
const titleEl = document.getElementById("song-title")
const artEl = document.getElementById("album-art")
const timerEl = document.getElementById("song-timer")
const playBtn = document.getElementById("play-pause")
const progressEl = document.getElementById("progress")
const playingIndicator = document.getElementById("playing-indicator")
const moodBtns = document.querySelectorAll(".emoji")
const chatArea = document.getElementById("chat-area")
const inputEl = document.getElementById("chat-input")
const sendBtn = document.getElementById("send-message")
const themeBtn = document.getElementById("toggle-theme")
const playlistItems = document.querySelectorAll(".playlist-item")
const volumeSlider = document.getElementById("volume-slider")
const likeBtn = document.getElementById("like-btn")
const shuffleBtn = document.getElementById("shuffle-btn")
const repeatBtn = document.getElementById("repeat-btn")

// Audio element for playback
const audio = new Audio()
let currentTrackIndex = 0

// Sample user names for random messages
const users = ["Rocky", "Bobby", "Kiara", "Ajay", "Mouna"]
const randomMessages = [
  "This track is fire! 🔥",
  "Love the beat on this one",
  "Perfect for my morning commute",
  "The bass is incredible",
  "Anyone else dancing right now?",
  "This artist is so talented!",
  "Can't get enough of this song",
  "This reminds me of summer vibes",
]

let isPlaying = false
let isShuffleOn = false
let isRepeatOn = false
let isLiked = false
let timerInterval

// Initialize with album art rotation animation
function toggleAlbumRotation() {
  if (isPlaying) {
    artEl.classList.add("rotate-animation")
    playingIndicator.classList.add("active")
  } else {
    artEl.classList.remove("rotate-animation")
    playingIndicator.classList.remove("active")
  }
}

// Load and play track
function loadTrack(index) {
  const track = playlistItems[index]
  titleEl.textContent = track.dataset.title
  artEl.src = track.dataset.image
  audio.src = track.dataset.audio
  audio.load()

  if (isPlaying) {
    audio.play()
  }

  // Update chat
  const p = document.createElement("p")
  p.textContent = `Now playing: ${track.dataset.title}`
  p.style.color = "#1DB954"
  p.style.fontWeight = "bold"
  chatArea.appendChild(p)
  chatArea.scrollTop = chatArea.scrollHeight
}

// Play button functionality
playBtn.onclick = () => {
  isPlaying = !isPlaying
  playBtn.textContent = isPlaying ? "Pause" : "Play"
  toggleAlbumRotation()

  if (isPlaying) {
    audio.play()
    startTimer()

    // Add a random chat message occasionally
    setTimeout(
      () => {
        if (isPlaying) {
          addRandomChatMessage()
        }
      },
      Math.random() * 5000 + 3000,
    )
  } else {
    audio.pause()
    clearInterval(timerInterval)
  }
}

// Update progress bar and timer
function startTimer() {
  clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    const currentTime = Math.floor(audio.currentTime)
    const duration = Math.floor(audio.duration)

    // Update timer display
    const minutes = Math.floor(currentTime / 60)
    const seconds = currentTime % 60
    timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

    // Update progress bar
    const progress = (currentTime / duration) * 100
    progressEl.style.width = `${progress}%`

    // End song when it reaches duration
    if (currentTime >= duration) {
      clearInterval(timerInterval)
      if (isRepeatOn) {
        audio.currentTime = 0
        audio.play()
      } else {
        playNextTrack()
      }
    }
  }, 1000)
}

// Play next track
function playNextTrack() {
  if (isShuffleOn) {
    currentTrackIndex = Math.floor(Math.random() * playlistItems.length)
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % playlistItems.length
  }

  loadTrack(currentTrackIndex)
  updateActivePlaylistItem()

  if (isPlaying) {
    audio.play()
    startTimer()
  }
}

// Update active playlist item
function updateActivePlaylistItem() {
  playlistItems.forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })
}

// Playlist item functionality
playlistItems.forEach((item, index) => {
  item.onclick = () => {
    currentTrackIndex = index
    loadTrack(currentTrackIndex)
    updateActivePlaylistItem()

    if (isPlaying) {
      audio.play()
      startTimer()
    }
  }
})

// Volume slider
volumeSlider.oninput = () => {
  const value = volumeSlider.value
  audio.volume = value / 100

  // Visual feedback
  if (value < 5) {
    volumeSlider.previousElementSibling.textContent = "🔇"
  } else if (value < 40) {
    volumeSlider.previousElementSibling.textContent = "🔈"
  } else if (value < 70) {
    volumeSlider.previousElementSibling.textContent = "🔉"
  } else {
    volumeSlider.previousElementSibling.textContent = "🔊"
  }
}

// Like button
likeBtn.onclick = () => {
  isLiked = !isLiked
  if (isLiked) {
    likeBtn.innerHTML = '<i class="fas fa-heart"></i>'
    likeBtn.classList.add("active")

    // Add to chat
    const p = document.createElement("p")
    p.textContent = `You liked ${titleEl.textContent}`
    p.style.color = "#1DB954"
    chatArea.appendChild(p)
    chatArea.scrollTop = chatArea.scrollHeight
  } else {
    likeBtn.innerHTML = '<i class="far fa-heart"></i>'
    likeBtn.classList.remove("active")
  }
}

// Shuffle button
shuffleBtn.onclick = () => {
  isShuffleOn = !isShuffleOn
  shuffleBtn.classList.toggle("active", isShuffleOn)
}

// Repeat button
repeatBtn.onclick = () => {
  isRepeatOn = !isRepeatOn
  repeatBtn.classList.toggle("active", isRepeatOn)
}

// Emoji reactions
moodBtns.forEach((btn) => {
  btn.onclick = () => {
    const reaction = document.createElement("p")
    reaction.textContent = `Someone reacted: ${btn.dataset.emoji}`
    reaction.className = "reaction-message"
    chatArea.appendChild(reaction)
    chatArea.scrollTop = chatArea.scrollHeight
  }
})

// Chat functionality
sendBtn.onclick = () => {
  const txt = inputEl.value.trim()
  if (!txt) return

  const p = document.createElement("p")
  p.textContent = `You: ${txt}`
  p.style.alignSelf = "flex-end"
  p.style.marginLeft = "auto"
  p.style.background = "#1DB954"
  chatArea.appendChild(p)
  chatArea.scrollTop = chatArea.scrollHeight

  inputEl.value = ""

  // Chance for random response
  if (Math.random() > 0.6) {
    setTimeout(
      () => {
        addRandomChatMessage()
      },
      Math.random() * 1500 + 500,
    )
  }
}

// Enter key to send message
inputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click()
  }
})

// Random chat messages
function addRandomChatMessage() {
  const user = users[Math.floor(Math.random() * users.length)]
  const message = randomMessages[Math.floor(Math.random() * randomMessages.length)]

  const p = document.createElement("p")
  p.textContent = `${user}: ${message}`
  chatArea.appendChild(p)
  chatArea.scrollTop = chatArea.scrollHeight
}

// Theme toggle
themeBtn.onclick = () => {
  document.body.classList.toggle("light-mode")

  if (document.body.classList.contains("light-mode")) {
    themeBtn.textContent = "Switch to Dark Mode"
  } else {
    themeBtn.textContent = "Switch to Light Mode"
  }
}

// Audio event listeners
audio.addEventListener("ended", () => {
  if (!isRepeatOn) {
    playNextTrack()
  }
})

// Initialize first track
loadTrack(0)
updateActivePlaylistItem()

// Generate initial chat messages
setTimeout(() => {
  addRandomChatMessage()
  setTimeout(() => {
    addRandomChatMessage()
  }, 1500)
}, 1000)

