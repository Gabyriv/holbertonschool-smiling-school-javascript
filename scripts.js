$(document).ready(function () {
    // Load quotes dynamically when page loads
    loadQuotes();
});

/**
 * Load quotes from the API and populate the carousel
 */
function loadQuotes() {
    // Show loader while fetching data
    const quotesCarousel = $('#carouselExampleControls .carousel-inner');
    quotesCarousel.html('<div class="carousel-item active d-flex justify-content-center align-items-center" style="min-height: 200px;"><div class="loader"></div></div>');

    // Make Ajax request to fetch quotes
    $.ajax({
        url: 'https://smileschool-api.hbtn.info/quotes',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Clear the loader
            quotesCarousel.empty();

            // Populate carousel with quotes data
            if (data && data.length > 0) {
                data.forEach(function (quote, index) {
                    const isActive = index === 0 ? 'active' : '';
                    const carouselItem = `
                        <div class="carousel-item ${isActive}">
                            <div class="row mx-auto align-items-center">
                                <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                                    <img src="${quote.pic_url}" class="d-block align-self-center"
                                        alt="Profile Picture" />
                                </div>
                                <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                                    <div class="quote-text">
                                        <p class="text-white">
                                            « ${quote.text}
                                        </p>
                                        <h4 class="text-white font-weight-bold">${quote.name}</h4>
                                        <span class="text-white">${quote.title}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    quotesCarousel.append(carouselItem);
                });

                // Reinitialize the carousel after adding content
                $('#carouselExampleControls').carousel('dispose').carousel();
            } else {
                // Handle case when no quotes are returned
                quotesCarousel.html(`
                    <div class="carousel-item active">
                        <div class="row mx-auto align-items-center">
                            <div class="col-12 text-center">
                                <p class="text-white">No quotes available at the moment.</p>
                            </div>
                        </div>
                    </div>
                `);
            }
        },
        error: function (xhr, status, error) {
            // Handle error case
            console.error('Error loading quotes:', error);
            quotesCarousel.html(`
                <div class="carousel-item active">
                    <div class="row mx-auto align-items-center">
                        <div class="col-12 text-center">
                            <p class="text-white">Error loading quotes. Please try again later.</p>
                        </div>
                    </div>
                </div>
            `);
        }
    });
}
