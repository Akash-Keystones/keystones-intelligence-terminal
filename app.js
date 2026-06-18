const SUPABASE_URL = "https://rnffeqagizrajazptttk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZmZlcWFnaXpyYWphenB0dHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MTExMTUsImV4cCI6MjA5NzI4NzExNX0.WrcqLTbixklKkM9rfdxuLSbVtC3sne-JFflUK8Qsgb0";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const WHATSAPP_NUMBER = "919632311518";

const adminToggle = document.getElementById("adminToggle");
const adminPanel = document.getElementById("adminPanel");
const postForm = document.getElementById("postForm");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const hotList = document.getElementById("hotList");
const feedList = document.getElementById("feedList");

let feedItems = [];

if (adminPanel) {
  adminPanel.classList.add("hidden");
}

if (adminToggle) {
  adminToggle.addEventListener("click", () => {
    openWhatsApp("Hi Keystones, I want access to private market intelligence.");
  });
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function openWhatsApp(message = "Hi Keystones, I want to know more about an opportunity.") {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function formatType(type) {
  return {
    hot: "A+ Conviction",
    market: "Market Signal",
    rera: "RERA Signal",
    builder: "Builder Movement"
  }[type] || "Signal";
}

function cleanSummary(text = "") {
  return text
    .replace(/•/g, "")
    .replace(/✅/g, "")
    .replace(/⚠️/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractRating(text = "") {
  const match = text.match(/(\d+(\.\d+)?)\s*\/\s*10/);
  return match ? `${match[1]} / 10` : "Under Review";
}

function extractFirstSignal(text = "") {
  const cleaned = cleanSummary(text);
  const sentence = cleaned.split(".")[0];
  return sentence.length > 120 ? sentence.slice(0, 120) + "..." : sentence;
}

function cardTemplate(item, mode = "feed", index = 0) {
  const signalNumber = String(index + 1).padStart(3, "0");
  const rating = extractRating(item.summary);
  const thesis = extractFirstSignal(item.summary);
  const message = `Hi Keystones, I want intelligence access for ${item.title} in ${item.location}`;

  return `
    <article class="${mode === "hot" ? "hot-card signal-card" : "feed-card signal-card"}">
      <div class="signal-header">
        <span>SIGNAL ${signalNumber}</span>
        <small>${formatType(item.type)}</small>
      </div>

      <h4>${item.title}</h4>

      <div class="signal-matrix">
        <div>
          <small>Corridor</small>
          <strong>${item.location || "Under Review"}</strong>
        </div>
        <div>
          <small>Conviction</small>
          <strong>${rating}</strong>
        </div>
        <div>
          <small>Horizon</small>
          <strong>5–7 Years</strong>
        </div>
      </div>

      <div class="keystones-view">
        <small>Keystones View</small>
        <p>${thesis}</p>
      </div>

      <div class="signal-tags">
        <span>Growth Corridor</span>
        <span>Infrastructure Signal</span>
        <span>Private Intelligence</span>
      </div>

      <div class="card-meta">
        <span>${item.builder || "Keystones Desk"}</span>
        ${item.budget ? `<strong>${item.budget}</strong>` : ""}
      </div>

      <button class="ask-btn" onclick="openWhatsApp('${message.replace(/'/g, "\\'")}')">
        Request Intelligence
      </button>
    </article>
  `;
}

function render() {
  const q = (searchInput?.value || "").toLowerCase();
  const category = categoryFilter?.value || "all";

  const filtered = feedItems.filter((item) => {
    const text = [item.title, item.location, item.builder, item.summary, item.budget]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(q) && (category === "all" || item.type === category);
  });

  const hotItems = filtered.filter((item) => item.type === "hot");

  if (hotList) {
    hotList.innerHTML = hotItems.length
      ? hotItems.map((item, index) => cardTemplate(item, "hot", index)).join("")
      : `<p class="empty">No A+ conviction signals yet.</p>`;
  }

  if (feedList) {
    feedList.innerHTML = filtered.length
      ? filtered.map((item, index) => cardTemplate(item, "feed", index)).join("")
      : `<p class="empty">No signals found.</p>`;
  }
}

async function loadFeed() {
  const { data, error } = await supabaseClient
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (feedList) {
      feedList.innerHTML = `
        <article class="feed-card signal-card">
          <div class="signal-header">
            <span>SIGNAL 001</span>
            <small>Market Signal</small>
          </div>

          <h4>North Bangalore Growth Corridor</h4>

          <div class="signal-matrix">
            <div>
              <small>Corridor</small>
              <strong>North Bangalore</strong>
            </div>
            <div>
              <small>Conviction</small>
              <strong>Under Review</strong>
            </div>
            <div>
              <small>Horizon</small>
              <strong>5–7 Years</strong>
            </div>
          </div>

          <div class="keystones-view">
            <small>Keystones View</small>
            <p>
              Private intelligence is being curated by Keystones.
              Request access to receive early opportunity signals before they become public conversations.
            </p>
          </div>

          <div class="signal-tags">
            <span>Growth Corridor</span>
            <span>Infrastructure Signal</span>
            <span>Private Intelligence</span>
          </div>

          <div class="card-meta">
            <span>Keystones Desk</span>
            <strong>Private Access</strong>
          </div>

          <button class="ask-btn"
            onclick="openWhatsApp('Hi Keystones, I want access to private market intelligence.')">
            Request Intelligence
          </button>
        </article>
      `;
    }
    return;
  }

  feedItems = data || [];
  render();
}

if (postForm) {
  postForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    alert("Admin publishing is disabled on the public website.");
  });
}

if (searchInput) {
  searchInput.addEventListener("input", render);
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", render);
}

loadFeed();
