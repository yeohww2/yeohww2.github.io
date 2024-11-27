let navbarVisible = true; // Track navbar state

function toggleNavbar() {
    const navbar = document.getElementById('navbar');
    const toggleButton = document.querySelector('.nav-toggle-btn');

    if (navbarVisible) {
        navbar.classList.add('hidden'); 
        toggleButton.innerHTML = '<span class="material-icons">menu</span>';
    } else {
        navbar.classList.remove('hidden'); 
        toggleButton.innerHTML = '<span class="material-icons">close</span>';
    }

    navbarVisible = !navbarVisible; 
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior

        const targetId = this.getAttribute('href').substring(1); 
        const targetElement = document.getElementById(targetId);

        const offset = 120; 
        const elementPosition = targetElement.getBoundingClientRect().top; 
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth' 
        });
    });
});

function openModal(gameId) {
    var modal = document.getElementById(gameId);
    modal.style.display = "block";  
}

function closeModal(gameId) {
    var modal = document.getElementById(gameId);
    modal.style.display = "none";  
}

window.onclick = function(event) {
    var modals = document.querySelectorAll(".game-modal");
    modals.forEach(function(modal) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};
