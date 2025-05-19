document.addEventListener('DOMContentLoaded', function() {
    // Initialize the flipbook container
    const flipbook = document.getElementById('flipbook');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentPage = 1;
    const totalPages = 28; // Based on the count of page files
    let isAnimating = false; // Flag to prevent multiple animations
    
    // Check if the device is in portrait mode (single page view)
    function isPortraitMode() {
        return window.innerWidth <= 768 && window.innerWidth < window.innerHeight;
    }
    
    // Function to handle responsive layout changes
    function handleResponsiveLayout() {
        // If the page layout has changed, reload the current page
        loadPage();
    }
    
    // Add window resize listener to handle orientation changes
    window.addEventListener('resize', function() {
        if (!isAnimating) {
            handleResponsiveLayout();
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
            const isMobileDevice = isPortraitMode();
            
            if (currentPage === 1) {
                flipbook.innerHTML = '';
                // Create card wrapper
                const cardWrapper = document.createElement('div');
                cardWrapper.className = 'card';
                
                const frontCover = document.createElement('div');
                frontCover.className = 'pages-container fade-out';
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
                backCover.className = 'pages-container fade-out';
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
                
                // For mobile: show only one page at a time
                if (isMobileDevice) {
                    const singlePage = document.createElement('div');
                    singlePage.className = 'page-side';
                    const singleImg = document.createElement('img');
                    const pageNumber = currentPage.toString().padStart(3, '0');
                    singleImg.src = `pages/page_${pageNumber}.jpg`;
                    singleImg.alt = `Page ${currentPage}`;
                    singlePage.appendChild(singleImg);
                    pagesContainer.appendChild(singlePage);
                } 
                // For desktop: show two pages side by side
                else {
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
            // On mobile, always navigate one page at a time
            if (isPortraitMode()) {
                currentPage--;
            } 
            // When in two-page view on desktop, go back by 2 pages (except near the end)
            else if (currentPage > 2 && currentPage <= totalPages) {
                currentPage -= 2;
            } else {
                currentPage--;
            }
            loadPage();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (isAnimating) return; // Prevent button spam
        console.log("nextBtn clicked");
        if (currentPage < totalPages) {
            // On mobile, always navigate one page at a time
            if (isPortraitMode()) {
                currentPage++;
            }
            // When in two-page view on desktop, advance by 2 pages (except at the beginning)
            else if (currentPage > 1 && currentPage < totalPages - 1) {
                currentPage += 2;
            } else {
                currentPage++;
            }
            loadPage();
        }
    });

    // Load pages and initialize
    loadPage();
});
