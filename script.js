
/* =========================
   BACKEND API
========================= */

const API_URL = "http://localhost:8000/api";


/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {

    loadRooms();

    checkLogin();

});


/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("show");

}


/* =========================
   SCROLL TO ROOMS
========================= */

function scrollToRooms() {

    document.getElementById("rooms").scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   LOAD ROOMS
========================= */

async function loadRooms() {

    const container = document.getElementById("roomsContainer");

    container.innerHTML = `
        <div class="loading">
            Loading rooms...
        </div>
    `;

    try {

        const response = await fetch(`${API_URL}/rooms`);

        const data = await response.json();

        console.log("Rooms API:", data);

        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Failed to load rooms"
            );

        }

        displayRooms(data.rooms || data.data || []);

    } catch (error) {

        console.error("Room loading error:", error);

        container.innerHTML = `
            <div class="loading">
                <h3>Unable to load rooms</h3>
                <p>Make sure the backend is running on port 8000.</p>
            </div>
        `;

    }

}


/* =========================
   DISPLAY ROOMS
========================= */

function displayRooms(rooms) {

    const container =
        document.getElementById("roomsContainer");

    if (!rooms.length) {

        container.innerHTML = `
            <div class="loading">
                <h3>No rooms found</h3>
                <p>Please check your database.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = rooms.map(room => {

        const image =
            room.image ||
            room.imageUrl ||
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a";

        const name =
            room.name ||
            room.title ||
            room.roomType ||
            "Hotel Room";

        const type =
            room.type ||
            room.roomType ||
            "Room";

        const location =
            room.location ||
            room.city ||
            "India";

        const description =
            room.description ||
            "Comfortable room for your stay.";

        const price =
            room.price ||
            room.pricePerNight ||
            0;

        return `

            <div class="room-card">

                <img
                    class="room-image"
                    src="${image}"
                    alt="${name}"
                >

                <div class="room-info">

                    <span class="room-type">
                        ${type}
                    </span>

                    <h3>
                        ${name}
                    </h3>

                    <div class="room-location">
                        📍 ${location}
                    </div>

                    <p class="room-description">
                        ${description}
                    </p>

                    <div class="room-bottom">

                        <div class="room-price">
                            ₹${price}
                            <small>/ night</small>
                        </div>

                        <button
                            class="book-btn"
                            onclick='openBooking(${JSON.stringify(room)})'>
                            Book Now
                        </button>

                    </div>

                </div>

            </div>

        `;

    }).join("");

}


/* =========================
   SEARCH ROOMS
========================= */

async function searchRooms() {

    const location =
        document.getElementById("searchLocation")
        .value
        .toLowerCase()
        .trim();

    const type =
        document.getElementById("searchType")
        .value
        .toLowerCase()
        .trim();

    try {

        const response =
            await fetch(`${API_URL}/rooms`);

        const data =
            await response.json();

        if (!data.success) {

            throw new Error(
                data.message || "Unable to search rooms"
            );

        }

        let rooms =
            data.rooms || data.data || [];

        rooms = rooms.filter(room => {

            const roomLocation =
                String(
                    room.location ||
                    room.city ||
                    ""
                ).toLowerCase();

            const roomType =
                String(
                    room.type ||
                    room.roomType ||
                    ""
                ).toLowerCase();

            const locationMatch =
                !location ||
                roomLocation.includes(location);

            const typeMatch =
                !type ||
                roomType === type;

            return locationMatch && typeMatch;

        });

        displayRooms(rooms);

        document
            .getElementById("rooms")
            .scrollIntoView({
                behavior: "smooth"
            });

    } catch (error) {

        console.error(error);

        showToast("Unable to search rooms");

    }

}


/* =========================
   LOGIN MODAL
========================= */

function openLogin() {

    closeModal("registerModal");

    document
        .getElementById("loginModal")
        .classList
        .add("show");

}


function switchToLogin() {

    closeModal("registerModal");

    openLogin();

}


/* =========================
   REGISTER MODAL
========================= */

function openRegister() {

    closeModal("loginModal");

    document
        .getElementById("registerModal")
        .classList
        .add("show");

}


function switchToRegister() {

    closeModal("loginModal");

    openRegister();

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal(modalId) {

    document
        .getElementById(modalId)
        .classList
        .remove("show");

}


/* =========================
   REGISTER
========================= */

async function register(event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName")
        .value
        .trim();

    const email =
        document.getElementById("registerEmail")
        .value
        .trim();

    const password =
        document.getElementById("registerPassword")
        .value;

    try {

        const response = await fetch(
            `${API_URL}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        console.log("Register API:", data);

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Registration failed"
            );

        }

        showToast(
            "Account created successfully!"
        );

        document
            .getElementById("registerModal")
            .classList
            .remove("show");

        document
            .querySelector("#registerModal form")
            .reset();

        setTimeout(() => {

            openLogin();

        }, 800);

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        showToast(error.message);

    }

}


/* =========================
   LOGIN
========================= */

async function login(event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail")
        .value
        .trim();

    const password =
        document.getElementById("loginPassword")
        .value;

    try {

        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        console.log("Login API:", data);

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Login failed"
            );

        }

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        showToast(
            `Welcome ${data.user.name}!`
        );

        document
            .getElementById("loginModal")
            .classList
            .remove("show");

        document
            .querySelector("#loginModal form")
            .reset();

        updateNavbar();

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showToast(error.message);

    }

}


/* =========================
   CHECK LOGIN
========================= */

function checkLogin() {

    const token =
        localStorage.getItem("token");

    if (token) {

        updateNavbar();

    }

}


/* =========================
   UPDATE NAVBAR
========================= */

function updateNavbar() {

    const userData =
        localStorage.getItem("user");

    if (!userData) {
        return;
    }

    const user =
        JSON.parse(userData);

    const nav =
        document.getElementById("navMenu");

    nav.innerHTML = `

        <a href="#home">
            Home
        </a>

        <a href="#rooms">
            Rooms
        </a>

        <a href="#about">
            About
        </a>

        <span class="welcome-user">
            👤 ${user.name}
        </span>

        <button
            class="nav-login"
            onclick="logout()">
            Logout
        </button>

    `;

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    showToast("Logged out successfully");

    setTimeout(() => {

        location.reload();

    }, 700);

}


/* =========================
   BOOKING
========================= */

function openBooking(room) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        showToast(
            "Please login before booking"
        );

        openLogin();

        return;

    }

    document.getElementById(
        "bookingRoomId"
    ).value =
        room._id || room.id;

    document.getElementById(
        "bookingRoomName"
    ).textContent =
        room.name ||
        room.title ||
        room.roomType ||
        "Selected Room";

    document
        .getElementById("bookingModal")
        .classList
        .add("show");

}


/* =========================
   CREATE BOOKING
========================= */

async function createBooking(event) {

    event.preventDefault();

    const token =
        localStorage.getItem("token");

    if (!token) {

        showToast(
            "Please login first"
        );

        return;

    }

    const roomId =
        document.getElementById("bookingRoomId")
        .value;

    const checkIn =
        document.getElementById("checkIn")
        .value;

    const checkOut =
        document.getElementById("checkOut")
        .value;

    const guests =
        Number(
            document.getElementById("guests")
            .value
        );

    try {

        const response = await fetch(
            `${API_URL}/bookings`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    roomId,
                    checkIn,
                    checkOut,
                    guests
                })
            }
        );

        const data =
            await response.json();

        console.log(
            "Booking API:",
            data
        );

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Booking failed"
            );

        }

        showToast(
            "Booking created successfully!"
        );

        closeModal("bookingModal");

        document
            .querySelector("#bookingModal form")
            .reset();

    } catch (error) {

        console.error(
            "Booking error:",
            error
        );

        showToast(error.message);

    }

}


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================
   CLOSE MODALS ON BACKDROP
========================= */

window.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains("modal")
        ) {

            event.target.classList.remove("show");

        }

    }
);
