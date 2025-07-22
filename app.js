// Aktif navbar linki göster
function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let index = sections.length;
    while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[index].classList.add('active');
    // navLinks.forEach(link => {
    //     link.addEventListener('click', function() {
    //         document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    //         this.classList.add('active');
    //     });
    // });
}
window.addEventListener('scroll', highlightActiveSection);

// Yukarı çık butonunu göster/gizle
const backToTop = document.getElementById('floating-butt');
window.addEventListener('scroll', () => {
    if(window.scrollY > 500){
        backToTop.style.visibility = 'visible';
    }else{
        backToTop.style.visibility = 'hidden';
    }
});

// (TODO) Projeleri JS array’den ekle
// (TODO) TSA releases’ı GitHub API’dan çek ve ekle