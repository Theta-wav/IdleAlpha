document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('article-grid');
    
    // Asynchronously fetch articles from the AI-generated JSON file
    try {
        const response = await fetch('data/articles.json');
        const allArticles = await response.json();

        // ── Populate Stats Bar ────────────────────────────────────────────
        const realArticles = allArticles.filter(a => a.content); // exclude placeholder
        const articleCount = realArticles.length;

        // Parse read time strings like "8 min read", "9-10 minutes", etc.
        let totalMins = 0;
        realArticles.forEach(a => {
            const match = (a.readTime || '').match(/(\d+)/);
            if (match) totalMins += parseInt(match[1]);
        });
        const totalHrs = (totalMins / 60).toFixed(1);

        // Animate counter numbers
        function animateCounter(el, target, duration = 1200) {
            let start = 0;
            const step = Math.ceil(target / (duration / 16));
            const timer = setInterval(() => {
                start += step;
                if (start >= target) { el.textContent = target; clearInterval(timer); }
                else el.textContent = start;
            }, 16);
        }

        const statArticles = document.getElementById('stat-articles');
        const statReadtime = document.getElementById('stat-readtime');
        if (statArticles) animateCounter(statArticles, articleCount);
        if (statReadtime && statReadtime) statReadtime.textContent = totalHrs + 'h';

        // ── Populate Article Grid ─────────────────────────────────────────
        // Slice to 12 for DOM performance on mass scale
        allArticles.slice().reverse().slice(0, 12).forEach((article, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animation = `fadeUp 0.6s ease forwards ${index * 0.15 + 0.2}s`;
            card.style.opacity = '0';
            
            card.innerHTML = `
                <span class="card-tag">${article.tag}</span>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="card-footer">
                    <span>${article.date}</span>
                    <span>${article.readTime}</span>
                </div>
            `;
            
            // Add click listener
            card.addEventListener('click', () => {
                window.location.href = `article.html?title=${encodeURIComponent(article.title)}`;
            });
            
            grid.appendChild(card);
        });

    } catch (e) {
        console.error("Content API fetching error: ", e);
    }

    // Form submission mock
    const form = document.getElementById('newsletter');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-primary');
        const input = form.querySelector('input');
        
        const originalText = btn.innerText;
        btn.innerText = 'Access Granted ✓';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        input.value = '';
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'linear-gradient(135deg, var(--col-primary), var(--col-secondary))';
        }, 3000);
    });
});
