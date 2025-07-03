document.addEventListener('DOMContentLoaded', function() {
    // Auth Configuration
    const correctUsername = 'user';
    const correctPasswordHash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';
    
    // Login Elements
    const loginContainer = document.getElementById('login-container');
    const languageContainer = document.getElementById('language-container');
    const bookContainer = document.getElementById('book-container');
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    
    // Language selection elements
    const languageBtns = document.querySelectorAll('.language-btn');
    
    // Check if user is already logged in and has selected a language
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const selectedLanguage = sessionStorage.getItem('selectedLanguage');
    
    if (isLoggedIn && selectedLanguage) {
        showBook();
    } else if (isLoggedIn) {
        showLanguageSelection();
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
            showLanguageSelection();
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
    
    // Function to show language selection
    function showLanguageSelection() {
        loginContainer.style.display = 'none';
        languageContainer.style.display = 'flex';
        bookContainer.style.display = 'none';
        
        // Remove existing event listeners to prevent duplicates
        languageBtns.forEach(btn => {
            btn.removeEventListener('click', handleLanguageSelection);
        });
        
        // Add event listeners for language buttons
        languageBtns.forEach(btn => {
            btn.addEventListener('click', handleLanguageSelection);
        });
    }
    
    // Function to handle language selection
    function handleLanguageSelection() {
        const language = this.getAttribute('data-language');
        sessionStorage.setItem('selectedLanguage', language);
        
        // Clear any existing book state and reinitialize
        const flipbook = document.getElementById('flipbook');
        if (flipbook) {
            flipbook.innerHTML = '';
        }
        
        // Clear any existing event listeners by removing and re-adding the entire book container
        const bookContainer = document.getElementById('book-container');
        if (bookContainer) {
            const parent = bookContainer.parentNode;
            const nextSibling = bookContainer.nextSibling;
            parent.removeChild(bookContainer);
            parent.insertBefore(bookContainer, nextSibling);
        }
        
        showBook();
    }
    
    // Function to handle login and show book
    function showBook() {
        loginContainer.style.display = 'none';
        languageContainer.style.display = 'none';
        bookContainer.style.display = 'flex';
        
        // Update language indicator and document direction
        const selectedLanguage = sessionStorage.getItem('selectedLanguage') || 'hebrew';
        const currentLanguageSpan = document.getElementById('current-language');
        const changeLanguageBtn = document.getElementById('change-language-btn');
        
        // Update document direction based on language
        if (selectedLanguage === 'hebrew') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'he');
            currentLanguageSpan.textContent = 'עברית';
            changeLanguageBtn.innerHTML = '<i class="fas fa-language"></i> שנה שפה';
        } else if (selectedLanguage === 'english') {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
            currentLanguageSpan.textContent = 'English';
            changeLanguageBtn.innerHTML = '<i class="fas fa-language"></i> Change Language';
        }
        
        // Setup change language functionality
        changeLanguageBtn.addEventListener('click', function() {
            // Clear any existing event listeners to prevent duplicates
            const newChangeLanguageBtn = document.getElementById('change-language-btn');
            newChangeLanguageBtn.removeEventListener('click', arguments.callee);
            showLanguageSelection();
        });
        
        // Update navigation button icons based on language direction
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (selectedLanguage === 'hebrew') {
            // RTL: prev = right arrow, next = left arrow
            prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        } else if (selectedLanguage === 'english') {
            // LTR: prev = left arrow, next = right arrow
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
        
        // Initialize book after login
        initializeBook();
        
        // Update logout button text based on language
        const logoutBtn = document.getElementById('logout-btn');
        if (selectedLanguage === 'hebrew') {
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> יציאה';
        } else if (selectedLanguage === 'english') {
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        }
        
        // Setup logout functionality
        logoutBtn.addEventListener('click', function() {
            // Clear the session storage
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('selectedLanguage');
            // Show login form and hide book
            loginContainer.style.display = 'flex';
            languageContainer.style.display = 'none';
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
            // Always start from page 1 when initializing the book (especially when switching languages)
            let currentPage = 1;
            const totalPages = 28; // Based on the count of page files
            let isAnimating = false; // Flag to prevent multiple animations
        
        // Get selected language
        const selectedLanguage = sessionStorage.getItem('selectedLanguage') || 'hebrew';
        // Ensure we always start from page 1 when initializing
        currentPage = 1;
        console.log('Initializing book with language:', selectedLanguage, 'starting at page:', currentPage);
        
        // Update navigation button icons based on language direction
        if (selectedLanguage === 'hebrew') {
            // RTL: prev = right arrow, next = left arrow
            prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        } else if (selectedLanguage === 'english') {
            // LTR: prev = left arrow, next = right arrow
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
        
        // Function to get the correct page path based on language
        function getPagePath(pageNumber) {
            const paddedPageNumber = pageNumber.toString().padStart(3, '0');
            return `pages/${selectedLanguage}/page_${paddedPageNumber}.jpg`;
        }
        
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
                const selectedLanguage = sessionStorage.getItem('selectedLanguage') || 'hebrew';
                console.log("Creating page content. Portrait mode:", isPortrait, "Language:", selectedLanguage, "Current page:", currentPage);
                
                if (currentPage === 1) {
                    flipbook.innerHTML = '';
                    // Create card wrapper
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'card';
                    
                    const frontCover = document.createElement('div');
                    frontCover.className = 'pages-container fade-out cover-page';
                    const frontImg = document.createElement('img');
                    frontImg.src = getPagePath(currentPage);
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
                    backImg.src = getPagePath(currentPage);
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
                        singleImg.src = getPagePath(currentPage);
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
                        
                        // Calculate the left page number without modifying currentPage
                        let leftPageNumber = currentPage;
                        if (currentPage % 2 !== 0) {
                            leftPageNumber = currentPage - 1;
                        }
                        leftImg.src = getPagePath(leftPageNumber);
                        leftImg.alt = `Page ${leftPageNumber}`;
                        
                        // Right page (odd number)
                        if (leftPageNumber + 1 <= totalPages) {
                            rightImg.src = getPagePath(leftPageNumber + 1);
                            rightImg.alt = `Page ${leftPageNumber + 1}`;
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
    
        // Remove any existing event listeners by cloning the buttons
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        // Update references to the new buttons
        const updatedPrevBtn = document.getElementById('prev-btn');
        const updatedNextBtn = document.getElementById('next-btn');
        
        // Add event listeners for navigation buttons
        updatedPrevBtn.addEventListener('click', function() {
            if (isAnimating) return; // Prevent button spam
            console.log("prevBtn clicked, current page:", currentPage, "total pages:", totalPages);
            
            // Get current language to determine navigation direction
            const btnCurrentLanguage = sessionStorage.getItem('selectedLanguage') || 'hebrew';
            const btnIsRTL = btnCurrentLanguage === 'hebrew';
            console.log("Current language:", btnCurrentLanguage, "isRTL:", btnIsRTL);
            
            // For RTL: prev button goes to previous page (right direction)
            // For LTR: prev button goes to previous page (left direction)
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
                // Safety check to ensure currentPage never goes below 1
                if (currentPage < 1) {
                    currentPage = 1;
                }
                loadPage();
            }
        });
    
        updatedNextBtn.addEventListener('click', function() {
            if (isAnimating) return; // Prevent button spam
            console.log("nextBtn clicked, current page:", currentPage, "total pages:", totalPages);
            
            // Get current language to determine navigation direction
            const btnCurrentLanguage = sessionStorage.getItem('selectedLanguage') || 'hebrew';
            const btnIsRTL = btnCurrentLanguage === 'hebrew';
            console.log("Current language:", btnCurrentLanguage, "isRTL:", btnIsRTL);
            
            // For RTL: next button goes to next page (left direction)
            // For LTR: next button goes to next page (right direction)
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
                // Safety check to ensure currentPage never exceeds totalPages
                if (currentPage > totalPages) {
                    currentPage = totalPages;
                }
                loadPage();
            }
        });
        
        // Remove any existing keyboard event listeners by using a named function
        function handleKeyboardNavigation(e) {
            if (isAnimating) return; // Prevent action during animation
            
            // Get selected language to determine navigation direction
            const selectedLanguage = sessionStorage.getItem('selectedLanguage') || 'hebrew';
            const isRTL = selectedLanguage === 'hebrew';
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                // For RTL (Hebrew): Previous page - right arrow
                // For LTR (English): Next page - right arrow
                if (isRTL) {
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
                } else {
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
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                // For RTL (Hebrew): Next page - left arrow
                // For LTR (English): Previous page - left arrow
                if (isRTL) {
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
                } else {
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
                }
            }
        }
        
        // Remove existing keyboard event listener and add new one
        document.removeEventListener('keydown', handleKeyboardNavigation);
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Initial page load
        loadPage();
    }
});
