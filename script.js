/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("show");

}


/* =========================
   DARK MODE
========================= */

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    const icon = themeToggle.querySelector("i");

    if (document.body.classList.contains("dark")) {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

        localStorage.setItem("theme", "dark");

    } else {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

        localStorage.setItem("theme", "light");

    }

});


/* RESTORE THEME */

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeToggle.querySelector("i").classList.remove("fa-moon");

    themeToggle.querySelector("i").classList.add("fa-sun");

}


/* =========================
   HOTEL FILTER
========================= */

function filterHotels(category, button) {

    const cards = document.querySelectorAll(".hotel-card");

    const buttons = document.querySelectorAll(".filter");

    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    let visibleCount = 0;

    cards.forEach(card => {

        if (
            category === "all" ||
            card.dataset.category === category
        ) {

            card.style.display = "block";
            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });

    document.getElementById("noResults").style.display =
        visibleCount === 0 ? "block" : "none";

}


/* =========================
   FAVORITE BUTTON
========================= */

function toggleFavorite(button) {

    button.classList.toggle("favorited");

    const icon = button.querySelector("i");

    if (button.classList.contains("favorited")) {

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");

        showToast("❤️ Added to your favorites");

    } else {

        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

        showToast("Removed from favorites");

    }

}


/* =========================
   HOTEL SEARCH
========================= */

function searchHotels() {

    const location = document
        .getElementById("location")
        .value
        .trim()
        .toLowerCase();

    const checkin = document.getElementById("checkin").value;

    const checkout = document.getElementById("checkout").value;

    if (checkin && checkout && checkout <= checkin) {

        showToast("Check-out must be after check-in.");

        return;

    }

    const cards = document.querySelectorAll(".hotel-card");

    let count = 0;

    cards.forEach(card => {

        const hotelLocation = card.dataset.location;

        const locationText = card
            .querySelector(".hotel-location")
            .textContent
            .toLowerCase();

        if (
            !location ||
            hotelLocation.includes(location) ||
            locationText.includes(location)
        ) {

            card.style.display = "block";
            count++;

        } else {

            card.style.display = "none";

        }

    });

    document.getElementById("noResults").style.display =
        count === 0 ? "block" : "none";

    document.getElementById("hotels").scrollIntoView({
        behavior: "smooth"
    });

    showToast(
        count > 0
            ? `Found ${count} hotel(s) for your search`
            : "No matching hotels found"
    );

}


/* =========================
   VIEW ALL HOTELS
========================= */

function showAllHotels() {

    const cards = document.querySelectorAll(".hotel-card");

    cards.forEach(card => {
        card.style.display = "block";
    });

    document.getElementById("noResults").style.display = "none";

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
    });

    document.querySelector(".filter").classList.add("active");

    showToast("Showing all available hotels");

}


/* =========================
   BOOK HOTEL
========================= */

function bookHotel(hotelName) {

    document.getElementById("selectedHotel").textContent =
        "You are booking: " + hotelName;

    document.getElementById("bookingModal").classList.add("show");

}


/* =========================
   CONFIRM BOOKING
========================= */

function confirmBooking() {

    const name = document.getElementById("guestName").value.trim();

    const email = document.getElementById("guestEmail").value.trim();

    if (!name || !email) {

        showToast("Please enter your name and email.");

        return;

    }

    closeModal("bookingModal");

    showToast("🎉 Booking request submitted successfully!");

    document.getElementById("guestName").value = "";

    document.getElementById("guestEmail").value = "";

}


/* =========================
   LOGIN MODAL
========================= */

function showLogin() {

    document.getElementById("loginModal").classList.add("show");

}


/* =========================
   LOGIN MESSAGE
========================= */

function loginMessage() {

    showToast("Demo login: Backend authentication required.");

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal(modalId) {

    document.getElementById(modalId).classList.remove("show");

}


/* =========================
   CLOSE MODAL OUTSIDE
========================= */

document.querySelectorAll(".modal").forEach(modal => {

    modal.addEventListener("click", function(event) {

        if (event.target === modal) {

            modal.classList.remove("show");

        }

    });

});


/* =========================
   TOAST MESSAGE
========================= */

let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================
   NEWSLETTER
========================= */

function subscribe(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;

    showToast("🎉 Thank you for subscribing!");

    console.log("Demo subscription:", email);

    event.target.reset();

}


/* =========================
   DATE VALIDATION
========================= */

const today = new Date().toISOString().split("T")[0];

document.getElementById("checkin").min = today;

document.getElementById("checkout").min = today;

document.getElementById("checkin").addEventListener("change", function() {

    const checkout = document.getElementById("checkout");

    checkout.min = this.value;

    if (checkout.value && checkout.value <= this.value) {

        checkout.value = "";

    }

});