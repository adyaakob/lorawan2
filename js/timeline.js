document.addEventListener('DOMContentLoaded', function() {
    const timelineContent = document.getElementById('timeline-content');
    if (!timelineContent) return;

    fetch('../sections/project-timeline.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('#project-timeline');
            if (content) {
                // Remove the outer section and h2 as we don't need them in the content div
                const mainContent = Array.from(content.children)
                    .filter(child => !child.matches('h2'))
                    .map(child => child.outerHTML)
                    .join('');
                timelineContent.innerHTML = mainContent;
            }
        })
        .catch(error => {
            console.error('Error loading timeline content:', error);
            timelineContent.innerHTML = '<p>Error loading timeline content. Please try again later.</p>';
        });
});
