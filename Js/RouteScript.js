const routeLinks = document.querySelectorAll('.route-list li a');

routeLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Route ${index + 1} selected!`);
    });
});