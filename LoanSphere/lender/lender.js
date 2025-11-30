// lender.js — Logic for creating and publishing loan offers

// Home redirect
document.getElementById("homeBtn").addEventListener("click", () => {
  location.href = "../index.html";
});

// Render all offers by lender
async function renderOffers() {
  const offers = await MockAPI.list("offers");
  const container = document.getElementById("offers");
  container.innerHTML = "";

  if (!offers.length) {
    container.innerHTML = "<p>No offers created yet.</p>";
    return;
  }

  offers.forEach(o => {
    const div = document.createElement("div");
    div.classList.add("item", "fade-in");

    div.innerHTML = `
      <strong>${o.title}</strong>
      <div class="offer-details">
        <small>₹${o.principal} @ ${o.rate}% for ${o.term} months</small>
      </div>
      <button class="publish-btn" data-id="${o.id}">Publish</button>
    `;

    container.appendChild(div);
  });

  // Handle publish button clicks
  document.querySelectorAll(".publish-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      publishOffer(e.target.dataset.id);
    });
  });
}

// Creating an offer
document.getElementById("create").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const principal = Number(document.getElementById("principal").value);
  const rate = Number(document.getElementById("rate").value);
  const term = Number(document.getElementById("term").value);

  if (!title || !principal || !rate || !term) {
    alert("Please fill all fields before submitting.");
    return;
  }

  const offer = {
    id: Date.now(),
    title,
    principal,
    rate,
    term,
    createdAt: Date.now()
  };

  await MockAPI.create("offers", offer);

  alert("Loan Offer Created!");
  renderOffers();
});

// Publish offer to marketplace
async function publishOffer(id) {
  const offer = await MockAPI.get("offers", id);
  const market = LS.get("market") || [];

  market.push(offer);
  LS.set("market", market);

  alert("Offer Published to Marketplace!");
}

// Initial render
renderOffers();
