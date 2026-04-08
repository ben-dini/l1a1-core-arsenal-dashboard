document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('contentGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryList = document.getElementById('categoryList');
    const promptCount = document.getElementById('promptCount');
    const toast = document.getElementById('toast');
    const langEn = document.getElementById('lang-en');
    const langDe = document.getElementById('lang-de');

    let currentCategory = 'all';
    let searchTerm = '';
    let language = 'en'; // Standardmäßig Englisch

    const texts = {
        en: {
            searchPlaceholder: "Search in 700+ prompts...",
            categories: "Categories",
            all: "ALL",
            promptsFound: "PROMPTS FOUND",
            copyBtn: "COPY PROMPT",
            toast: "COPIED TO CLIPBOARD"
        },
        de: {
            searchPlaceholder: "Suche in über 700 Prompts...",
            categories: "Kategorien",
            all: "ALLE",
            promptsFound: "PROMPTS GEFUNDEN",
            copyBtn: "PROMPT KOPIEREN",
            toast: "IN ZWISCHENABLAGE KOPIERT"
        }
    };

    function updateLanguageUI() {
        const t = texts[language];
        searchInput.placeholder = t.searchPlaceholder;
        document.querySelector('.sidebar h3').textContent = t.categories;
        toast.textContent = t.toast;
        
        // Update Sidebar
        renderSidebar();
        render();
    }

    langEn.addEventListener('click', () => {
        language = 'en';
        langEn.classList.add('active');
        langDe.classList.remove('active');
        updateLanguageUI();
    });

    langDe.addEventListener('click', () => {
        language = 'de';
        langDe.classList.add('active');
        langEn.classList.remove('active');
        updateLanguageUI();
    });

    function renderSidebar() {
        const categories = ['all', ...new Set(arsenalData.map(item => item.category))].sort();
        categoryList.innerHTML = '';
        categories.forEach(cat => {
            const li = document.createElement('li');
            li.textContent = cat === 'all' ? texts[language].all : cat.toUpperCase();
            li.classList.toggle('active', cat === currentCategory);
            li.addEventListener('click', () => {
                document.querySelectorAll('.sidebar li').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                currentCategory = cat;
                render();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            categoryList.appendChild(li);
        });
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(showToast);
    }

    function render() {
        const filtered = arsenalData.filter(item => {
            const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
            const searchSource = (item.title_de + ' ' + item.prompt_de + ' ' + item.category + ' ' + item.title_en + ' ' + item.prompt_en).toLowerCase();
            const matchesSearch = searchSource.includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        promptCount.textContent = `${filtered.length} ${texts[language].promptsFound}`;
        grid.innerHTML = '';

        filtered.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const title = language === 'de' ? (item.title_de || item.title_en) : (item.title_en || item.title_de);
            const promptText = language === 'de' ? (item.prompt_de || item.prompt_en) : (item.prompt_en || item.prompt_de);

            card.innerHTML = `
                <div class="card-header">
                    <span class="category-tag">${item.category}</span>
                </div>
                <h4>${title}</h4>
                <p>${promptText}</p>
                <button class="copy-btn">${texts[language].copyBtn}</button>
            `;

            card.querySelector('.copy-btn').addEventListener('click', () => {
                copyToClipboard(promptText);
            });

            grid.appendChild(card);
        });
    }

    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        render();
    });

    updateLanguageUI(); // Initialer Aufruf
});
