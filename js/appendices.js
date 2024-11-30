document.addEventListener('DOMContentLoaded', function() {
    // Load appendices content
    fetch('../sections/section8.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('#section8');
            document.getElementById('appendices-content').innerHTML = content.innerHTML;
        })
        .catch(error => {
            console.error('Error loading appendices content:', error);
            document.getElementById('appendices-content').innerHTML = '<p class="text-danger">Error loading content. Please try again later.</p>';
        });
});
