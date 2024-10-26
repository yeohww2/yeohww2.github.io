window.addEventListener('scroll', function() {
    let elements = document.querySelectorAll('.home, .about, .skills, .contact');
    let scrollTop = document.documentElement.scrollTop;

    elements.forEach((element) => {
        let offset = element.offsetTop - window.innerHeight / 1.2;
        if (scrollTop > offset) {
            element.classList.add('is-visible');
        }
    });
});
