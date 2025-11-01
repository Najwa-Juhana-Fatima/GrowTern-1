// Smooth Parallax Scroll Effect
window.addEventListener("scroll", function () {
    const hero = document.querySelector(".hero");
    let offset = window.pageYOffset;
    hero.style.backgroundPositionY = offset * 0.7 + "px";
});
