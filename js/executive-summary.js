document.addEventListener('DOMContentLoaded', function() {
    const executiveContent = document.getElementById('executive-content');
    if (!executiveContent) return;

    fetch('../sections/executive-summary.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('#executive-summary');
            if (content) {
                // Remove the outer section and h2 as we don't need them in the content div
                const mainContent = Array.from(content.children)
                    .filter(child => !child.matches('h2'))
                    .map(child => child.outerHTML)
                    .join('');
                executiveContent.innerHTML = mainContent;
            }
        })
        .catch(error => {
            console.error('Error loading executive summary content:', error);
            executiveContent.innerHTML = '<p>Error loading executive summary content. Please try again later.</p>';
        });
});
