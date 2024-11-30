document.addEventListener('DOMContentLoaded', function() {
    // Array of all section IDs
    const sections = [
        'executive-summary',
        'project-introduction',
        'system-architecture',
        'technical-components',
        'power-management',
        'implementation-strategy',
        'cost-analysis',
        'project-timeline',
        'appendices'
    ];

    // Load all sections
    sections.forEach(sectionId => {
        loadSection(sectionId);
    });
});

function loadSection(sectionId) {
    fetch(`sections/${sectionId}.html`)
        .then(response => response.text())
        .then(content => {
            const sectionElement = document.getElementById(sectionId);
            if (sectionElement) {
                sectionElement.innerHTML = content;
            }
        })
        .catch(error => {
            console.error(`Error loading section ${sectionId}:`, error);
        });
}
