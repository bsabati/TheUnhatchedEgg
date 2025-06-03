document.addEventListener('DOMContentLoaded', function() {
    // Auth Configuration
    const correctUsername = 'user';
    const correctPasswordHash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';
    
    // Login Elements
    const loginContainer = document.getElementById('login-container');
    const bookContainer = document.getElementById('book-container');
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    
    // Check if user is already logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        showBook();
    }
    
    // Function to hash a string using SHA-256
    async function hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    
    // Function to attempt login
    async function attemptLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            loginError.textContent = 'יש להזין שם משתמש וסיסמה';
            return;
        }
        
        // Hash the input password and compare with stored hash
        const passwordHash = await hashPassword(password);
        
        if (username === correctUsername && passwordHash === correctPasswordHash) {
            // Login successful
            sessionStorage.setItem('isLoggedIn', 'true');
            showBook();
        } else {
            // Login failed
            loginError.textContent = 'שם משתמש או סיסמה שגויים';
            passwordInput.value = '';
        }
    }
    
    // Login button event listener
    loginBtn.addEventListener('click', attemptLogin);
    
    // Add enter key support for login
    passwordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            attemptLogin();
        }
    });
    
    usernameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordInput.focus();
        }
    });
    
    // Function to handle login and show book
    function showBook() {
        loginContainer.style.display = 'none';
        bookContainer.style.display = 'flex';
        // Initialize book after login
        initializeBook();
        
        // Setup logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', function() {
            // Clear the session storage
            sessionStorage.removeItem('isLoggedIn');
            // Show login form and hide book
            loginContainer.style.display = 'flex';
            bookContainer.style.display = 'none';
            // Clear password field
            passwordInput.value = '';
            // Focus on username field
            usernameInput.focus();
        });
    }
    
    // Initialize the flipbook container
    function initializeBook() {
        const flipbook = document.getElementById('flipbook');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        let currentPage = 1;
        const totalPages = 28; // Based on the count of page files
        let isAnimating = false; // Flag to prevent multiple animations
        
        // Check if the device is in portrait mode (single page view)
        function isPortraitMode() {
            const isPortrait = window.matchMedia("(orientation: portrait)").matches;
            const isMobileWidth = window.innerWidth <= 768;
            console.log("Window width:", window.innerWidth, "Height:", window.innerHeight);
            console.log("Is portrait by media query:", isPortrait);
            console.log("Is mobile width:", isMobileWidth);
            
            // Use media query for more reliable orientation detection
            return isMobileWidth && isPortrait;
        }
        
        // Function to handle responsive layout changes
        function handleResponsiveLayout() {
            console.log("Layout change detected - reloading page");
            // If the page layout has changed, reload the current page
            loadPage();
        }
        
        // Add window resize listener to handle orientation changes
        window.addEventListener('resize', function() {
            if (!isAnimating) {
                console.log("Window resized - checking layout");
                handleResponsiveLayout();
            }
        });
        
        // Listen specifically for orientation changes
        window.addEventListener('orientationchange', function() {
            console.log("Orientation changed");
            if (!isAnimating) {
                // Small delay to ensure browser has updated dimensions
                setTimeout(handleResponsiveLayout, 100);
            }
        });
    
        // Function to animate page change
        function animatePageChange(callback) {
            if (isAnimating) return;
            isAnimating = true;
            
            // Get current card if it exists
            const currentCard = flipbook.querySelector('.card');
            if (currentCard) {
                currentCard.classList.add('flipping');
                
                // Wait for animation to complete
                setTimeout(() => {
                    // Remove animation class and execute callback
                    currentCard.classList.remove('flipping');
                    callback();
                    
                    // Add animation to the new content
                    const newCard = flipbook.querySelector('.card');
                    if (newCard) {
                        const pagesContainer = newCard.querySelector('.pages-container');
                        if (pagesContainer) {
                            pagesContainer.classList.add('fade-out');
                            setTimeout(() => {
                                pagesContainer.classList.remove('fade-out');
                                pagesContainer.classList.add('fade-in');
                                setTimeout(() => {
                                    pagesContainer.classList.remove('fade-in');
                                    isAnimating = false;
                                }, 300);
                            }, 10);
                        } else {
                            isAnimating = false;
                        }
                    } else {
                        isAnimating = false;
                    }
                }, 400);
            } else {
                callback();
                isAnimating = false;
            }
        }
    
        // Function to load pages
        function loadPage() {
            function createPageContent() {
                const isPortrait = isPortraitMode();
                console.log("Creating page content. Portrait mode:", isPortrait);
                
                if (currentPage === 1) {
                    flipbook.innerHTML = '';
                    // Create card wrapper
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'card';
                    
                    const frontCover = document.createElement('div');
                    frontCover.className = 'pages-container fade-out cover-page';
                    const frontImg = document.createElement('img');
                    const pageNumber = currentPage.toString().padStart(3, '0');
                    frontImg.src = `pages/page_${pageNumber}.jpg`;
                    frontImg.alt = 'Front Cover';
                    frontCover.appendChild(frontImg);
                    
                    // Append to card wrapper then to flipbook
                    cardWrapper.appendChild(frontCover);
                    flipbook.appendChild(cardWrapper);
                    
                    // Trigger fade-in animation
                    setTimeout(() => {
                        frontCover.classList.remove('fade-out');
                        frontCover.classList.add('fade-in');
                        setTimeout(() => {
                            frontCover.classList.remove('fade-in');
                        }, 300);
                    }, 10);
                } 
                else if (currentPage === totalPages) {
                    flipbook.innerHTML = '';
                    // Create card wrapper
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'card';
                    
                    const backCover = document.createElement('div');
                    backCover.className = 'pages-container fade-out cover-page';
                    const backImg = document.createElement('img');
                    const pageNumber = currentPage.toString().padStart(3, '0');
                    backImg.src = `pages/page_${pageNumber}.jpg`;
                    backImg.alt = 'Back Cover';
                    backCover.appendChild(backImg);
                    
                    // Append to card wrapper then to flipbook
                    cardWrapper.appendChild(backCover);
                    flipbook.appendChild(cardWrapper);
                    
                    // Trigger fade-in animation
                    setTimeout(() => {
                        backCover.classList.remove('fade-out');
                        backCover.classList.add('fade-in');
                        setTimeout(() => {
                            backCover.classList.remove('fade-in');
                        }, 300);
                    }, 10);
                }
                else {
                    // Create a container for the pages
                    flipbook.innerHTML = '';
                    
                    // Create card wrapper
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'card';
                    
                    const pagesContainer = document.createElement('div');
                    pagesContainer.id = 'pages-container';
                    pagesContainer.className = 'pages-container fade-out';
                    
                    // For portrait mode on mobile: show only one page at a time
                    if (isPortrait) {
                        console.log("Single page layout (portrait mode)");
                        const singlePage = document.createElement('div');
                        singlePage.className = 'page-side';
                        const singleImg = document.createElement('img');
                        const pageNumber = currentPage.toString().padStart(3, '0');
                        singleImg.src = `pages/page_${pageNumber}.jpg`;
                        singleImg.alt = `Page ${currentPage}`;
                        singlePage.appendChild(singleImg);
                        pagesContainer.appendChild(singlePage);
                    } 
                    // For landscape or desktop: show two pages side by side
                    else {
                        console.log("Two-page layout (landscape or desktop mode)");
                        const leftPage = document.createElement('div');
                        leftPage.id = 'left-page';
                        leftPage.className = 'page-side left-page';
                        const leftImg = document.createElement('img');
                        leftImg.id = 'left-img';
                        leftPage.appendChild(leftImg);
                        pagesContainer.appendChild(leftPage);
                        
                        const rightPage = document.createElement('div');
                        rightPage.id = 'right-page';
                        rightPage.className = 'page-side right-page';
                        const rightImg = document.createElement('img');
                        rightImg.id = 'right-img';
                        rightPage.appendChild(rightImg);
                        pagesContainer.appendChild(rightPage);
                        
                        const leftPageNumber = currentPage.toString().padStart(3, '0');
                        leftImg.src = `pages/page_${leftPageNumber}.jpg`;
                        leftImg.alt = `Page ${currentPage}`;
                        
                        // Right page (odd number)
                        if (currentPage + 1 <= totalPages) {
                            const rightPageNumber = (currentPage + 1).toString().padStart(3, '0');
                            rightImg.src = `pages/page_${rightPageNumber}.jpg`;
                            rightImg.alt = `Page ${currentPage + 1}`;
                        }
                    }
                    
                    // Append to card wrapper then to flipbook
                    cardWrapper.appendChild(pagesContainer);
                    flipbook.appendChild(cardWrapper);
                    
                    // Trigger fade-in animation
                    setTimeout(() => {
                        pagesContainer.classList.remove('fade-out');
                        pagesContainer.classList.add('fade-in');
                        setTimeout(() => {
                            pagesContainer.classList.remove('fade-in');
                        }, 300);
                    }, 10);
                }
            }
            
            // Use animation for page changes
            animatePageChange(createPageContent);
        }
    
        // Add event listeners for navigation buttons
        prevBtn.addEventListener('click', function() {
            if (isAnimating) return; // Prevent button spam
            console.log("prevBtn clicked");
            if (currentPage > 1) {
                // On mobile in portrait mode, always navigate one page at a time
                if (isPortraitMode()) {
                    console.log("Previous in portrait mode - moving back 1 page");
                    currentPage--;
                } 
                // In landscape mode or desktop, go back by 2 pages (except at the beginning)
                else if (currentPage > 2 && currentPage <= totalPages) {
                    console.log("Previous in landscape/desktop - moving back 2 pages");
                    currentPage -= 2;
                } else {
                    console.log("Previous at beginning of book - moving back 1 page");
                    currentPage--;
                }
                loadPage();
            }
        });
    
        nextBtn.addEventListener('click', function() {
            if (isAnimating) return; // Prevent button spam
            console.log("nextBtn clicked");
            if (currentPage < totalPages) {
                // On mobile in portrait mode, always navigate one page at a time
                if (isPortraitMode()) {
                    console.log("Next in portrait mode - moving forward 1 page");
                    currentPage++;
                }
                // In landscape mode or desktop, advance by 2 pages (except at the end)
                else if (currentPage > 1 && currentPage < totalPages - 1) {
                    console.log("Next in landscape/desktop - moving forward 2 pages");
                    currentPage += 2;
                } else {
                    console.log("Next at end of book - moving forward 1 page");
                    currentPage++;
                }
                loadPage();
            }
        });
        
        // Add event listeners for keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (isAnimating) return; // Prevent action during animation
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                // Previous page - right arrow in RTL layout
                if (currentPage > 1) {
                    if (isPortraitMode()) {
                        currentPage--;
                    } else if (currentPage > 2 && currentPage <= totalPages) {
                        currentPage -= 2;
                    } else {
                        currentPage--;
                    }
                    loadPage();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                // Next page - left arrow in RTL layout
                if (currentPage < totalPages) {
                    if (isPortraitMode()) {
                        currentPage++;
                    } else if (currentPage > 1 && currentPage < totalPages - 1) {
                        currentPage += 2;
                    } else {
                        currentPage++;
                    }
                    loadPage();
                }
            }
        });
        
        // Initial page load
        loadPage();
    }
});
