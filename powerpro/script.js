// ==================================================
//  FUNÇÕES GLOBAIS (chamadas diretamente no HTML)
// ==================================================

function menuShow() {
    const menuMobile = document.querySelector('.mobile-menu');
    if (!menuMobile) return;
    const icon = document.querySelector('.icon');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.body.classList.remove('menu-open');
        if (icon) icon.src = "css/imagens/icons/menu-abertoPreto.png";
    } else {
        menuMobile.classList.add('open');
        document.body.classList.add('menu-open');
        if (icon) icon.src = "css/imagens/icons/botao-fecharPreto.png";
    }
}

function toggleDropdown() {
    const dropdown = document.getElementById("myDropdown");
    if (dropdown) dropdown.classList.toggle("show");
}

function gerarCampos() {
    const input = document.getElementById('inputText');
    const resultado = document.getElementById('resultado');
    if (!input || !resultado) return;
    resultado.innerHTML = '';
    const linhas = input.value.split('\n');
    linhas.forEach((linha, index) => {
        if (!linha.trim() || !linha.includes(':')) return;
        const [textoLabel, definicao] = linha.split(':', 2).map(s => s.trim());
        const container = document.createElement('div');
        container.className = 'campo';
        container.setAttribute('draggable', 'true');
        container.dataset.index = index;

        const label = document.createElement('label');
        label.innerText = textoLabel;
        const campo = document.createElement('input');
        const inputId = `campo-${index}`;
        campo.id = inputId;
        label.htmlFor = inputId;

        if (definicao.includes('&')) {
            campo.type = 'text';
            campo.maxLength = definicao.length;
        } else if (definicao.includes('_')) {
            campo.type = 'text';
            campo.maxLength = definicao.length;
            campo.oninput = () => {
                campo.value = campo.value.replace(/\D/g, '');
                if (campo.value.length > campo.maxLength) {
                    campo.value = campo.value.slice(0, campo.maxLength);
                }
            };
        } else if (definicao.includes('#')) {
            campo.type = 'text';
            campo.placeholder = "dd/mm/aaaa";
            campo.maxLength = definicao.length;
            campo.oninput = () => {
                let v = campo.value.replace(/\D/g, '');
                if (v.length >= 5) v = v.replace(/^(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
                else if (v.length >= 3) v = v.replace(/^(\d{2})(\d+)/, '$1/$2');
                campo.value = v;
            };
        } else {
            return;
        }

        container.appendChild(label);
        container.appendChild(campo);
        resultado.appendChild(container);

        container.addEventListener('dragstart', () => container.classList.add('dragging'));
        container.addEventListener('dragend', () => container.classList.remove('dragging'));
    });
}

// ==================================================
//  INICIALIZAÇÃO APÓS O DOM CARREGADO
// ==================================================

document.addEventListener('DOMContentLoaded', function () {

    // ---- 1. Fechar menu mobile ao clicar em link ----
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('menu-open');
            const menu = document.querySelector('.mobile-menu');
            if (menu && menu.classList.contains('open')) {
                menu.classList.remove('open');
                const icon = document.querySelector('.icon');
                if (icon) icon.src = "css/imagens/icons/menu-abertoPreto.png";
            }
        });
    });

    // ---- 2. Fechar dropdown ao clicar fora ----
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            document.querySelectorAll('.dropdown-content.show').forEach(drop => drop.classList.remove('show'));
        }
    };

    // ---- 3. FAQ / Benefits toggle ----
    document.querySelectorAll('.benefits-list li').forEach(item => {
        const title = item.querySelector('.benefit-title');
        if (title) {
            title.addEventListener('click', () => item.classList.toggle('active'));
        }
    });

    // ---- 4. Animação do título (hero) ----
    const textElement = document.getElementById("home-title");
    if (textElement) {
        const text = "Descubra o PowerPro: Desenvolvimento de Aplicativos Simplificado para Todos.";
        let index = 0;
        let typingInterval;

        function type() {
            if (index < text.length) {
                textElement.textContent += text[index];
                index++;
            } else {
                textElement.innerHTML += '<span id="blinking-cursor">|</span>';
                clearInterval(typingInterval);
                setInterval(blinkCursor, 500);
            }
        }

        function blinkCursor() {
            const cursor = document.getElementById("blinking-cursor");
            if (cursor) cursor.style.visibility = (cursor.style.visibility === 'hidden') ? 'visible' : 'hidden';
        }

        typingInterval = setInterval(type, 90);
    }

    // ---- 5. Animação de revelação (scroll) ----
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));

    // ---- 6. Validação do checkbox de download (página download.html) ----
    const autorizarCheckbox = document.getElementById('autorizarCheckbox');
    const meuBotao = document.getElementById('meuBotao');
    if (autorizarCheckbox && meuBotao) {
        meuBotao.addEventListener('click', function (e) {
            if (!autorizarCheckbox.checked) {
                e.preventDefault();
                alert('Por favor, para continuar com o download, concorde com os termos.');
            }
        });
    }

    // ---- 7. Modal (se existir) ----
    const openModal = document.querySelector("#open-modal");
    const closeModal = document.querySelector("#close-modal");
    const modal = document.querySelector("#modal");
    const fade = document.querySelector("#fade");
    if (openModal && closeModal && modal && fade) {
        const toggleModal = () => {
            modal.classList.toggle("hide");
            fade.classList.toggle("hide");
        };
        [openModal, closeModal, fade].forEach(el => el.addEventListener("click", toggleModal));
    }

    // ---- 8. Cookies LGPD ----
    const msgCookies = document.getElementById('cookies-msg');
    if (msgCookies) {
        window.aceito = function () {
            localStorage.setItem('lgpd', 'sim');
            msgCookies.classList.remove('mostrar');
        };
        if (localStorage.getItem('lgpd') === 'sim') {
            msgCookies.classList.remove('mostrar');
        } else {
            msgCookies.classList.add('mostrar');
        }
    }

    // ---- 9. Drag & Drop do gerador de campos ----
    const dropzone = document.getElementById('resultado');
    if (dropzone) {
        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            const dragging = document.querySelector('.campo.dragging');
            if (!dragging) return;
            const afterElement = getDragAfterElement(dropzone, e.pageY);
            if (afterElement == null) dropzone.appendChild(dragging);
            else dropzone.insertBefore(dragging, afterElement);
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.campo:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // ---- 10. Menu lateral hamburger (se existir) ----
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('navList');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.getElementById('overlay');
    const dropbtn = document.getElementById('dropbtn');

    if (hamburger && navList && closeBtn && overlay) {
        function toggleMenu(open) {
            const isOpen = typeof open === 'boolean' ? open : !navList.classList.contains('active');
            navList.classList.toggle('active', isOpen);
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
            navList.setAttribute('aria-hidden', !isOpen);
            overlay.classList.toggle('show', isOpen);
        }

        hamburger.addEventListener('click', () => toggleMenu());
        closeBtn.addEventListener('click', () => toggleMenu(false));
        overlay.addEventListener('click', () => toggleMenu(false));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

        if (dropbtn) {
            dropbtn.addEventListener('click', e => {
                e.stopPropagation();
                const parent = dropbtn.closest('.dropdown');
                if (parent) {
                    const opened = parent.classList.toggle('open');
                    dropbtn.setAttribute('aria-expanded', opened);
                    const menu = parent.querySelector('.dropdown-content');
                    if (menu) menu.setAttribute('aria-hidden', !opened);
                }
            });
        }

        document.addEventListener('click', e => {
            const openDropdown = document.querySelector('.dropdown.open');
            if (openDropdown && !openDropdown.contains(e.target)) {
                openDropdown.classList.remove('open');
                const btn = openDropdown.querySelector('.dropbtn');
                const menu = openDropdown.querySelector('.dropdown-content');
                if (btn) btn.setAttribute('aria-expanded', 'false');
                if (menu) menu.setAttribute('aria-hidden', 'true');
            }
        });

        document.querySelectorAll('.nav-list a').forEach(a => {
            a.addEventListener('click', () => {
                if (window.matchMedia("(max-width: 768px)").matches) toggleMenu(false);
            });
        });
    }

    // ---- 11.1 Animação interativa da imagem do Hero (tilt 3D ao passar o mouse) ----
    const heroImage = document.getElementById('heroImage');
    const heroImageTilt = document.getElementById('heroImageTilt');

    if (heroImage && heroImageTilt && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        // Pose padrão: leve inclinação para a esquerda, bem sutil
        const BASE_RX = 1.5;
        const BASE_RY = -6;
        const MAX_DELTA = 3.5; // amplitude bem discreta ao redor da pose padrão

        let rafId = null;

        function applyTilt(clientX, clientY) {
            const rect = heroImage.getBoundingClientRect();
            const px = (clientX - rect.left) / rect.width;   // 0 a 1
            const py = (clientY - rect.top) / rect.height;   // 0 a 1

            const offsetX = (px - 0.5) * 2; // -1 a 1
            const offsetY = (py - 0.5) * 2; // -1 a 1

            const rx = BASE_RX - offsetY * MAX_DELTA;
            const ry = BASE_RY + offsetX * MAX_DELTA;

            heroImageTilt.style.setProperty('--rx', rx.toFixed(2) + 'deg');
            heroImageTilt.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        }

        heroImage.addEventListener('mouseenter', () => {
            heroImage.classList.add('is-hovering');
        });

        heroImage.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => applyTilt(e.clientX, e.clientY));
        });

        heroImage.addEventListener('mouseleave', () => {
            heroImage.classList.remove('is-hovering');
            heroImageTilt.style.setProperty('--rx', BASE_RX + 'deg');
            heroImageTilt.style.setProperty('--ry', BASE_RY + 'deg');
        });
    }

    // ---- 11. Bootstrap modal (se houver) ----
    const myModal = document.getElementById('myModal');
    const myInput = document.getElementById('myInput');
    if (myModal && myInput) {
        myModal.addEventListener('shown.bs.modal', () => myInput.focus());
    }
});