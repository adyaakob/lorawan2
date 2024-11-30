document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login.html';
        return;
    }

    // Initialize TinyMCE
    tinymce.init({
        selector: '#editor',
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        height: 500,
        promotion: false,
        branding: false,
        automatic_uploads: true,
        images_upload_url: '/api/upload-image',
        images_upload_handler: function (blobInfo, progress) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', '/api/upload-image');
                
                xhr.upload.onprogress = (e) => {
                    progress(e.loaded / e.total * 100);
                };
                
                xhr.onload = () => {
                    if (xhr.status === 403) {
                        reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
                        return;
                    }
                    if (xhr.status < 200 || xhr.status >= 300) {
                        reject('HTTP Error: ' + xhr.status);
                        return;
                    }
                    const json = JSON.parse(xhr.responseText);
                    if (!json || typeof json.location != 'string') {
                        reject('Invalid JSON: ' + xhr.responseText);
                        return;
                    }
                    resolve(json.location);
                };
                
                xhr.onerror = () => {
                    reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
                };
                
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                
                xhr.send(formData);
            });
        },
        verify_html: false,
        development: {
            browser_spellcheck: true,
            load_icons: true
        }
    });

    // Populate sections list
    const sectionsList = document.getElementById('sectionsList');
    const sections = [
        { id: 'executive-summary', title: '1. Executive Summary' },
        { id: 'introduction', title: '2. Introduction' },
        { id: 'site-analysis', title: '3. Site Analysis' },
        { id: 'technical-solution', title: '4. Technical Solution' },
        { id: 'implementation-plan', title: '5. Implementation Plan' },
        { id: 'system-components', title: '6. System Components' },
        { id: 'cost-analysis', title: '7. Cost Analysis' },
        { id: 'project-management', title: '8. Project Management' },
        { id: 'support-maintenance', title: '9. Support and Maintenance' },
        { id: 'appendices', title: '10. Appendices' }
    ];

    sections.forEach(section => {
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'list-group-item list-group-item-action';
        item.dataset.sectionId = section.id;
        item.innerHTML = `
            <div class="section-item">
                <span>${section.title}</span>
                <div class="actions">
                    <i class="bi bi-pencil-square"></i>
                </div>
            </div>
        `;
        sectionsList.appendChild(item);

        item.addEventListener('click', async function(e) {
            e.preventDefault();
            loadSection(section.id);
        });
    });

    // Save changes button
    const saveChanges = document.getElementById('saveChanges');
    saveChanges.addEventListener('click', async function() {
        const content = tinymce.activeEditor.getContent();
        const currentSection = document.getElementById('currentSection').dataset.sectionId;

        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    section: currentSection,
                    content: content
                })
            });

            if (response.ok) {
                alert('Changes saved successfully!');
            } else {
                alert('Failed to save changes. Please try again.');
            }
        } catch (error) {
            alert('An error occurred while saving changes.');
        }
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login.html';
    });

    // Load section content
    async function loadSection(sectionId) {
        try {
            const response = await fetch(`/api/content/${sectionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                tinymce.activeEditor.setContent(data.content || '');
                document.getElementById('currentSection').textContent = sections.find(s => s.id === sectionId).title;
                document.getElementById('currentSection').dataset.sectionId = sectionId;
                saveChanges.disabled = false;
            } else {
                alert('Failed to load section content.');
            }
        } catch (error) {
            alert('An error occurred while loading section content.');
        }
    }
});
