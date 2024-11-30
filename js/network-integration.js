document.addEventListener('DOMContentLoaded', function() {
    // Load network integration content
    fetch('../sections/section9.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('#network-integration');
            document.getElementById('network-integration-content').innerHTML = content.innerHTML;
        })
        .catch(error => {
            console.error('Error loading network integration content:', error);
            document.getElementById('network-integration-content').innerHTML = '<p class="text-danger">Error loading content. Please try again later.</p>';
        });
});
