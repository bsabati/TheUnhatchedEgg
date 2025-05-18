document.addEventListener('DOMContentLoaded', function() {
    // Initialize the flipbook container
    const flipbook = document.getElementById('flipbook');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentPage = 1;
    const totalPages = 28; // Based on the count of page files

    // Function to load pages
    function loadPage() {
        if (currentPage === 1) {
            flipbook.innerHTML = '';
            const frontCover = document.createElement('div');
            frontCover.className = 'pages-container';
            const frontImg = document.createElement('img');
            const pageNumber = currentPage.toString().padStart(3, '0');
            frontImg.src = `pages/page_${pageNumber}.jpg`;
            frontImg.alt = 'Front Cover';
            frontCover.appendChild(frontImg);
            flipbook.appendChild(frontCover);
        } 
        else if (currentPage === totalPages) {
            flipbook.innerHTML = '';
            const backCover = document.createElement('div');
            backCover.className = 'pages-container';
            const backImg = document.createElement('img');
            const pageNumber = currentPage.toString().padStart(3, '0');
            backImg.src = `pages/page_${pageNumber}.jpg`;
            backImg.alt = 'Back Cover';
            backCover.appendChild(backImg);
            flipbook.appendChild(backCover);
        }
        else {
            // Create a container for the two pages
            let pagesContainer = document.getElementById('pages-container');
            if (!pagesContainer) {
                flipbook.innerHTML = '';
                pagesContainer = document.createElement('div');
                pagesContainer.id = 'pages-container';
                pagesContainer.className = 'pages-container';
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
                flipbook.appendChild(pagesContainer);
            }
            
            const leftImg = pagesContainer.querySelector('#left-img');
            const leftPageNumber = currentPage.toString().padStart(3, '0');
            
            // Simple loading for left image - no animation
            leftImg.src = `pages/page_${leftPageNumber}.jpg`;
            leftImg.alt = `Page ${currentPage}`;
            
            // Right page (odd number)
            if (currentPage + 1 <= totalPages) {
                const rightImg = pagesContainer.querySelector('#right-img');
                const rightPageNumber = (currentPage + 1).toString().padStart(3, '0');
                rightImg.src = `pages/page_${rightPageNumber}.jpg`;
                rightImg.alt = `Page ${currentPage + 1}`;
            }
        }
    }

    // Add event listeners for navigation buttons
    prevBtn.addEventListener('click', function() {
        console.log("prevBtn clicked");
        if (currentPage > 1) {
            // When in two-page view, go back by 2 pages (except near the end)
            if (currentPage > 2 && currentPage <= totalPages) {
                currentPage -= 2;
            } else {
                currentPage--;
            }
            loadPage();
        }
    });

    nextBtn.addEventListener('click', function() {
        console.log("nextBtn clicked");
        if (currentPage < totalPages) {
            // When in two-page view, advance by 2 pages (except at the beginning)
            if (currentPage > 1 && currentPage < totalPages - 1) {
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
