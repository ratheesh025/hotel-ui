function scrollToBooking() {
    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });
}

function selectRoom(roomName) {
    document.getElementById("room").value = roomName;

    scrollToBooking();
}

function bookRoom(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const room = document.getElementById("room").value;
    const date = document.getElementById("date").value;

    document.getElementById("message").textContent =
        `Thank you, ${name}! Your ${room} booking request for ${date} has been received.`;

    document.querySelector("form").reset();
}