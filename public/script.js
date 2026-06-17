document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');

    // Typewriter animation
    const typedWordEl = document.getElementById('typed-word');
    const words = ['Code', 'Apps', 'Solutions', 'Websites'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typedWordEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedWordEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 80 : 120;

        if (!isDeleting && charIndex === currentWord.length) {
            delay = 1800; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400; // Pause before next word
        }

        setTimeout(typeWriter, delay);
    }

    typeWriter();

    // Fetch projects from the backend API
    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const projects = await response.json();
            renderProjects(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            projectsContainer.innerHTML = '<p style="color: #ef4444; text-align: center; grid-column: 1/-1;">Failed to load projects. Please try again later.</p>';
        }
    };

    // Render projects to the DOM
    const liveDemoLinks = {
        'Style Hive': 'https://style-hive-murex.vercel.app/'
    };

    const renderProjects = (projects) => {
        projectsContainer.innerHTML = ''; // Clear loading spinner
        
        projects.forEach((project, index) => {
            const delay = index * 0.15; // Staggered animation delay
            
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = `${delay}s`;
            
            const techTags = project.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');

            const liveUrl = liveDemoLinks[project.title];
            const liveDemoBtn = liveUrl
                ? `<a href="${liveUrl}" class="live-demo-btn" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Live Demo
                   </a>`
                : '';

            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="card-footer">
                    <div class="tech-stack">
                        ${techTags}
                    </div>
                    ${liveDemoBtn}
                </div>
            `;
            
            projectsContainer.appendChild(card);
        });
    };

    // Fetch profile data
    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            if (!response.ok) throw new Error('Network response was not ok');
            const profile = await response.json();
            if (profile && profile.profileImage) {
                const profileImg = document.getElementById('profile-img');
                profileImg.src = profile.profileImage;
                profileImg.classList.remove('loading-pulse');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // Initialize fetch
    fetchProjects();
    fetchProfile();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    // Scroll animations - replay every time
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-fade-in').forEach(section => {
        sectionObserver.observe(section);
    });
});
