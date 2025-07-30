$(document).ready(function () {
  // Load quotes dynamically when page loads
  loadQuotes();

  // Load popular tutorials dynamically when page loads
  loadPopularTutorials();

  // Load latest videos dynamically when page loads
  loadLatestVideos();

  // Load courses dynamically when page loads (if on courses page)
  if (window.location.pathname.includes('courses.html')) {
    loadCourses();
    initializeCoursesFilters();
  }

  // Initialize custom carousel controls
  initializeCustomCarousel();

  // Initialize latest videos carousel controls
  initializeLatestVideosCarousel();
});

/**
 * Load quotes from the API and populate the carousel
 */
function loadQuotes() {
  // Show loader while fetching data
  const quotesCarousel = $("#carouselExampleControls .carousel-inner");
  quotesCarousel.html(
    '<div class="carousel-item active d-flex justify-content-center align-items-center" style="min-height: 200px;"><div class="loader"></div></div>'
  );

  // Make Ajax request to fetch quotes
  $.ajax({
    url: "https://smileschool-api.hbtn.info/quotes",
    method: "GET",
    dataType: "json",
    success: function (data) {
      // Clear the loader
      quotesCarousel.empty();

      // Populate carousel with quotes data
      if (data && data.length > 0) {
        data.forEach(function (quote, index) {
          const isActive = index === 0 ? "active" : "";
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
        $("#carouselExampleControls").carousel("dispose").carousel();
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
      console.error("Error loading quotes:", error);
      quotesCarousel.html(`
                <div class="carousel-item active">
                    <div class="row mx-auto align-items-center">
                        <div class="col-12 text-center">
                            <p class="text-white">Error loading quotes. Please try again later.</p>
                        </div>
                    </div>
                </div>
            `);
    },
  });
}

/**
 * Load popular tutorials from the API and populate the custom carousel
 */
function loadPopularTutorials() {
  // Show loader while fetching data
  const carouselInner = $("#popularTutorialsCarousel .carousel-inner");
  carouselInner.html(
    '<div class="carousel-item active d-flex justify-content-center align-items-center" style="min-height: 300px;"><div class="loader"></div></div>'
  );

  // Make Ajax request to fetch popular tutorials
  $.ajax({
    url: "https://smileschool-api.hbtn.info/popular-tutorials",
    method: "GET",
    dataType: "json",
    success: function (data) {
      // Clear the loader
      carouselInner.empty();

      // Populate custom carousel with tutorials data
      if (data && data.length > 0) {
        // Store tutorials data globally for carousel navigation
        window.popularTutorials = data;
        window.currentIndex = 0;

        // Create initial carousel items
        updateCarouselDisplay();
      } else {
        // Handle case when no tutorials are returned
        carouselInner.html(`
                    <div class="carousel-item active">
                        <div class="row mx-auto align-items-center">
                            <div class="col-12 text-center">
                                <p class="text-muted">No popular tutorials available at the moment.</p>
                            </div>
                        </div>
                    </div>
                `);
      }
    },
    error: function (xhr, status, error) {
      // Handle error case
      console.error("Error loading popular tutorials:", error);
      carouselInner.html(`
                <div class="carousel-item active">
                    <div class="row mx-auto align-items-center">
                        <div class="col-12 text-center">
                            <p class="text-muted">Error loading popular tutorials. Please try again later.</p>
                        </div>
                    </div>
                </div>
            `);
    },
  });
}

/**
 * Initialize custom carousel controls for card-by-card navigation
 */
function initializeCustomCarousel() {
  // Next button click handler
  $("#popularNextBtn").on("click", function (e) {
    e.preventDefault();
    if (window.popularTutorials && window.popularTutorials.length > 0) {
      // Move to next card (circular)
      slideToNext();
    }
  });

  // Previous button click handler
  $("#popularPrevBtn").on("click", function (e) {
    e.preventDefault();
    if (window.popularTutorials && window.popularTutorials.length > 0) {
      // Move to previous card (circular)
      slideToPrevious();
    }
  });
}

/**
 * Slide to next card with animation
 */
function slideToNext() {
  const carouselInner = $("#popularTutorialsCarousel .carousel-inner");
  const currentCards = carouselInner.find(".card");

  // Animate current leftmost card sliding out to the left
  const leftmostCard = currentCards.first();
  leftmostCard.addClass("slide-out-left");

  // Move to next index
  window.currentIndex =
    (window.currentIndex + 1) % window.popularTutorials.length;

  // After animation completes, update the display
  setTimeout(() => {
    updateCarouselDisplay("from-right");
  }, 250);
}

/**
 * Slide to previous card with animation
 */
function slideToPrevious() {
  const carouselInner = $("#popularTutorialsCarousel .carousel-inner");
  const currentCards = carouselInner.find(".card");

  // Animate current rightmost card sliding out to the right
  const rightmostCard = currentCards.last();
  rightmostCard.addClass("slide-out-right");

  // Move to previous index
  window.currentIndex =
    (window.currentIndex - 1 + window.popularTutorials.length) %
    window.popularTutorials.length;

  // After animation completes, update the display
  setTimeout(() => {
    updateCarouselDisplay("from-left");
  }, 250);
}

/**
 * Update carousel display based on current index and screen size
 * @param {string} direction - 'from-left', 'from-right', or undefined for initial load
 */
function updateCarouselDisplay(direction) {
  if (!window.popularTutorials || window.popularTutorials.length === 0) return;

  const carouselInner = $("#popularTutorialsCarousel .carousel-inner");
  const tutorials = window.popularTutorials;
  const currentIdx = window.currentIndex;

  // Determine how many cards to show based on screen size
  let cardsToShow = 4; // Desktop: 4 cards
  if ($(window).width() <= 576) {
    cardsToShow = 1; // Mobile: 1 card
  } else if ($(window).width() <= 768) {
    cardsToShow = 2; // Tablet: 2 cards
  } else if ($(window).width() <= 991) {
    cardsToShow = 3; // Medium: 3 cards
  }

  // Generate cards HTML
  let carouselHTML =
    '<div class="carousel-item active"><div class="row align-items-center mx-auto">';

  for (let i = 0; i < cardsToShow; i++) {
    const tutorialIndex = (currentIdx + i) % tutorials.length;
    const tutorial = tutorials[tutorialIndex];

    // Generate star rating HTML
    let starsHTML = "";
    for (let j = 0; j < 5; j++) {
      if (j < tutorial.star) {
        starsHTML +=
          '<img src="images/star_on.png" alt="star on" width="15px" />';
      } else {
        starsHTML +=
          '<img src="images/star_off.png" alt="star off" width="15px" />';
      }
    }

    // Determine column classes based on cards to show
    let colClasses = "";
    if (cardsToShow === 1) {
      colClasses = "col-12 d-flex justify-content-center";
    } else if (cardsToShow === 2) {
      colClasses =
        i === 0
          ? "col-12 col-sm-6 d-flex justify-content-center justify-content-md-end"
          : "col-sm-6 d-flex justify-content-md-start justify-content-center";
    } else if (cardsToShow === 3) {
      if (i === 0)
        colClasses =
          "col-12 col-sm-6 col-md-4 d-flex justify-content-center justify-content-md-end";
      else if (i === 1)
        colClasses = "col-sm-6 col-md-4 d-flex justify-content-center";
      else
        colClasses =
          "col-md-4 d-flex justify-content-md-start justify-content-center";
    } else {
      if (i === 0)
        colClasses =
          "col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center";
      else if (i === 1)
        colClasses =
          "col-sm-6 col-md-6 col-lg-3 d-none d-sm-flex justify-content-md-start justify-content-lg-center";
      else if (i === 2)
        colClasses = "col-md-3 d-none d-lg-flex justify-content-center";
      else colClasses = "col-md-3 d-none d-lg-flex justify-content-center";
    }

    carouselHTML += `
            <div class="${colClasses}">
                <div class="card">
                    <img src="${tutorial.thumb_url}" class="card-img-top" alt="Video thumbnail" />
                    <div class="card-img-overlay text-center">
                        <img src="images/play.png" alt="Play" width="64px"
                            class="align-self-center play-overlay" />
                    </div>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">
                            ${tutorial.title}
                        </h5>
                        <p class="card-text text-muted">
                            ${tutorial["sub-title"]}
                        </p>
                        <div class="creator d-flex align-items-center">
                            <img src="${tutorial.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
                            <h6 class="pl-3 m-0 main-color">${tutorial.author}</h6>
                        </div>
                        <div class="info pt-3 d-flex justify-content-between">
                            <div class="rating">
                                ${starsHTML}
                            </div>
                            <span class="main-color">${tutorial.duration}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  carouselHTML += "</div></div>";

  // Update carousel with sliding animation
  if (direction === "from-right") {
    // New card slides in from the right
    carouselInner.html(carouselHTML);
    const newRightmostCard = carouselInner.find(".card").last();
    newRightmostCard.addClass("slide-in-right");
    setTimeout(() => {
      newRightmostCard
        .removeClass("slide-in-right")
        .addClass("slide-in-active");
    }, 50);
  } else if (direction === "from-left") {
    // New card slides in from the left
    carouselInner.html(carouselHTML);
    const newLeftmostCard = carouselInner.find(".card").first();
    newLeftmostCard.addClass("slide-in-left");
    setTimeout(() => {
      newLeftmostCard.removeClass("slide-in-left").addClass("slide-in-active");
    }, 50);
  } else {
    // Initial load or resize - no animation
    carouselInner.html(carouselHTML);
  }
}

/**
 * Load latest videos from the API and populate the custom carousel
 */
function loadLatestVideos() {
  // Show loader while fetching data
  const carouselInner = $("#latestVideosCarousel .carousel-inner");
  carouselInner.html(
    '<div class="carousel-item active d-flex justify-content-center align-items-center" style="min-height: 300px;"><div class="loader"></div></div>'
  );

  // Make Ajax request to fetch latest videos
  $.ajax({
    url: "https://smileschool-api.hbtn.info/latest-videos",
    method: "GET",
    dataType: "json",
    success: function (data) {
      // Clear the loader
      carouselInner.empty();

      // Populate custom carousel with latest videos data
      if (data && data.length > 0) {
        // Store latest videos data globally for carousel navigation
        window.latestVideos = data;
        window.latestCurrentIndex = 0;

        // Create initial carousel items
        updateLatestVideosCarouselDisplay();
      } else {
        // Handle case when no videos are returned
        carouselInner.html(`
          <div class="carousel-item active">
            <div class="row mx-auto align-items-center">
              <div class="col-12 text-center">
                <p class="text-muted">No latest videos available at the moment.</p>
              </div>
            </div>
          </div>
        `);
      }
    },
    error: function (xhr, status, error) {
      // Handle error case
      console.error("Error loading latest videos:", error);
      carouselInner.html(`
        <div class="carousel-item active">
          <div class="row mx-auto align-items-center">
            <div class="col-12 text-center">
              <p class="text-muted">Error loading latest videos. Please try again later.</p>
            </div>
          </div>
        </div>
      `);
    },
  });
}

/**
 * Initialize custom carousel controls for latest videos
 */
function initializeLatestVideosCarousel() {
  // Next button click handler
  $("#latestNextBtn").on("click", function (e) {
    e.preventDefault();
    if (window.latestVideos && window.latestVideos.length > 0) {
      // Move to next card (circular)
      slideLatestToNext();
    }
  });

  // Previous button click handler
  $("#latestPrevBtn").on("click", function (e) {
    e.preventDefault();
    if (window.latestVideos && window.latestVideos.length > 0) {
      // Move to previous card (circular)
      slideLatestToPrevious();
    }
  });
}

/**
 * Slide to next card with animation for latest videos
 */
function slideLatestToNext() {
  const carouselInner = $("#latestVideosCarousel .carousel-inner");
  const currentCards = carouselInner.find(".card");

  // Animate current leftmost card sliding out to the left
  const leftmostCard = currentCards.first();
  leftmostCard.addClass("slide-out-left");

  // Move to next index
  window.latestCurrentIndex =
    (window.latestCurrentIndex + 1) % window.latestVideos.length;

  // After animation completes, update the display
  setTimeout(() => {
    updateLatestVideosCarouselDisplay("from-right");
  }, 250);
}

/**
 * Slide to previous card with animation for latest videos
 */
function slideLatestToPrevious() {
  const carouselInner = $("#latestVideosCarousel .carousel-inner");
  const currentCards = carouselInner.find(".card");

  // Animate current rightmost card sliding out to the right
  const rightmostCard = currentCards.last();
  rightmostCard.addClass("slide-out-right");

  // Move to previous index
  window.latestCurrentIndex =
    (window.latestCurrentIndex - 1 + window.latestVideos.length) %
    window.latestVideos.length;

  // After animation completes, update the display
  setTimeout(() => {
    updateLatestVideosCarouselDisplay("from-left");
  }, 250);
}

/**
 * Update latest videos carousel display based on current index and screen size
 * @param {string} direction - 'from-left', 'from-right', or undefined for initial load
 */
function updateLatestVideosCarouselDisplay(direction) {
  if (!window.latestVideos || window.latestVideos.length === 0) return;

  const carouselInner = $("#latestVideosCarousel .carousel-inner");
  const videos = window.latestVideos;
  const currentIdx = window.latestCurrentIndex;

  // Determine how many cards to show based on screen size
  let cardsToShow = 4; // Desktop: 4 cards
  if ($(window).width() <= 576) {
    cardsToShow = 1; // Mobile: 1 card
  } else if ($(window).width() <= 768) {
    cardsToShow = 2; // Tablet: 2 cards
  } else if ($(window).width() <= 991) {
    cardsToShow = 3; // Medium: 3 cards
  }

  // Generate cards HTML
  let carouselHTML =
    '<div class="carousel-item active"><div class="row align-items-center mx-auto">';

  for (let i = 0; i < cardsToShow; i++) {
    const videoIndex = (currentIdx + i) % videos.length;
    const video = videos[videoIndex];

    // Generate star rating HTML
    let starsHTML = "";
    for (let j = 0; j < 5; j++) {
      if (j < video.star) {
        starsHTML +=
          '<img src="images/star_on.png" alt="star on" width="15px" />';
      } else {
        starsHTML +=
          '<img src="images/star_off.png" alt="star off" width="15px" />';
      }
    }

    // Determine column classes based on cards to show
    let colClasses = "";
    if (cardsToShow === 1) {
      colClasses = "col-12 d-flex justify-content-center";
    } else if (cardsToShow === 2) {
      colClasses =
        i === 0
          ? "col-12 col-sm-6 d-flex justify-content-center justify-content-md-end"
          : "col-sm-6 d-flex justify-content-md-start justify-content-center";
    } else if (cardsToShow === 3) {
      if (i === 0)
        colClasses =
          "col-12 col-sm-6 col-md-4 d-flex justify-content-center justify-content-md-end";
      else if (i === 1)
        colClasses = "col-sm-6 col-md-4 d-flex justify-content-center";
      else
        colClasses =
          "col-md-4 d-flex justify-content-md-start justify-content-center";
    } else {
      if (i === 0)
        colClasses =
          "col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center";
      else if (i === 1)
        colClasses =
          "col-sm-6 col-md-6 col-lg-3 d-none d-sm-flex justify-content-md-start justify-content-lg-center";
      else if (i === 2)
        colClasses = "col-md-3 d-none d-lg-flex justify-content-center";
      else colClasses = "col-md-3 d-none d-lg-flex justify-content-center";
    }

    carouselHTML += `
      <div class="${colClasses}">
        <div class="card">
          <img src="${video.thumb_url}" class="card-img-top" alt="Video thumbnail" />
          <div class="card-img-overlay text-center">
            <img src="images/play.png" alt="Play" width="64px"
                class="align-self-center play-overlay" />
          </div>
          <div class="card-body">
            <h5 class="card-title font-weight-bold">
              ${video.title}
            </h5>
            <p class="card-text text-muted">
              ${video["sub-title"]}
            </p>
            <div class="creator d-flex align-items-center">
              <img src="${video.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
              <h6 class="pl-3 m-0 main-color">${video.author}</h6>
            </div>
            <div class="info pt-3 d-flex justify-content-between">
              <div class="rating">
                ${starsHTML}
              </div>
              <span class="main-color">${video.duration}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  carouselHTML += "</div></div>";

  // Update carousel with sliding animation
  if (direction === "from-right") {
    // New card slides in from the right
    carouselInner.html(carouselHTML);
    const newRightmostCard = carouselInner.find(".card").last();
    newRightmostCard.addClass("slide-in-right");
    setTimeout(() => {
      newRightmostCard
        .removeClass("slide-in-right")
        .addClass("slide-in-active");
    }, 50);
  } else if (direction === "from-left") {
    // New card slides in from the left
    carouselInner.html(carouselHTML);
    const newLeftmostCard = carouselInner.find(".card").first();
    newLeftmostCard.addClass("slide-in-left");
    setTimeout(() => {
      newLeftmostCard.removeClass("slide-in-left").addClass("slide-in-active");
    }, 50);
  } else {
    // Initial load or resize - no animation
    carouselInner.html(carouselHTML);
  }
}

// Handle window resize to update carousel display
$(window).on("resize", function () {
  if (window.popularTutorials && window.popularTutorials.length > 0) {
    updateCarouselDisplay();
  }
  if (window.latestVideos && window.latestVideos.length > 0) {
    updateLatestVideosCarouselDisplay();
  }
});

// Global variables for courses functionality
window.coursesData = {
  topics: [],
  sorts: [],
  currentQuery: '',
  currentTopic: '',
  currentSort: ''
};

/**
 * Load courses from the API and populate the page
 * @param {string} query - Search query (optional)
 * @param {string} topic - Topic filter (optional)
 * @param {string} sort - Sort option (optional)
 */
function loadCourses(query = '', topic = '', sort = '') {
  // Show loader while fetching data
  const resultsContainer = $('.results .row');
  const videoCountElement = $('.video-count');
  
  resultsContainer.html(
    '<div class="col-12 d-flex justify-content-center align-items-center" style="min-height: 300px;"><div class="loader"></div></div>'
  );
  videoCountElement.text('Loading...');

  // Build query parameters
  const params = {};
  if (query) params.q = query;
  if (topic) params.topic = topic;
  if (sort) params.sort = sort;

  // Make Ajax request to fetch courses
  $.ajax({
    url: "https://smileschool-api.hbtn.info/courses",
    method: "GET",
    data: params,
    dataType: "json",
    success: function (data) {
      // Store data globally for reference
      window.coursesData.topics = data.topics || [];
      window.coursesData.sorts = data.sorts || [];
      window.coursesData.currentQuery = data.q || '';
      window.coursesData.currentTopic = topic;
      window.coursesData.currentSort = sort;

      // Update dropdowns with API data
      updateDropdowns();
      
      // Update search input with API value
      $('.search-text-area').val(data.q || '');

      // Clear the loader
      resultsContainer.empty();

      // Update video count
      const videoCount = data.courses ? data.courses.length : 0;
      videoCountElement.text(`${videoCount} video${videoCount !== 1 ? 's' : ''}`);

      // Populate page with courses data
      if (data.courses && data.courses.length > 0) {
        data.courses.forEach(function (course) {
          const courseCard = createCourseCard(course);
          resultsContainer.append(courseCard);
        });
      } else {
        resultsContainer.html(
          '<div class="col-12 text-center"><p class="text-muted">No courses found.</p></div>'
        );
      }
    },
    error: function (xhr, status, error) {
      console.error('Error loading courses:', error);
      resultsContainer.html(
        '<div class="col-12 text-center"><p class="text-danger">Error loading courses. Please try again.</p></div>'
      );
      videoCountElement.text('Error');
    }
  });
}

/**
 * Create a course card HTML element
 * @param {Object} course - Course data object
 * @returns {string} HTML string for the course card
 */
function createCourseCard(course) {
  // Generate star rating HTML
  const stars = generateStarRating(course.star);
  
  return `
    <div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">
      <div class="card">
        <img src="${course.thumb_url}" class="card-img-top" alt="Video thumbnail" />
        <div class="card-img-overlay text-center">
          <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay" />
        </div>
        <div class="card-body">
          <h5 class="card-title font-weight-bold">${course.title}</h5>
          <p class="card-text text-muted">${course['sub-title']}</p>
          <div class="creator d-flex align-items-center">
            <img src="${course.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
            <h6 class="pl-3 m-0 main-color">${course.author}</h6>
          </div>
          <div class="info pt-3 d-flex justify-content-between">
            <div class="rating">
              ${stars}
            </div>
            <span class="main-color">${course.duration}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string for star rating
 */
function generateStarRating(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<img src="images/star_on.png" alt="star on" width="15px" />';
    } else {
      stars += '<img src="images/star_off.png" alt="star off" width="15px" />';
    }
  }
  return stars;
}

/**
 * Update dropdowns with data from API
 */
function updateDropdowns() {
  // Update topics dropdown
  const topicsDropdown = $('.box2 .dropdown-menu');
  topicsDropdown.empty();
  
  window.coursesData.topics.forEach(function(topic) {
    topicsDropdown.append(`<a class="dropdown-item" href="#" data-value="${topic}">${topic}</a>`);
  });
  
  // Update sorts dropdown
  const sortsDropdown = $('.box3 .dropdown-menu');
  sortsDropdown.empty();
  
  window.coursesData.sorts.forEach(function(sort) {
    sortsDropdown.append(`<a class="dropdown-item" href="#" data-value="${sort}">${sort}</a>`);
  });
  
  // Set initial dropdown values
  if (window.coursesData.currentTopic) {
    $('.box2 .dropdown-toggle span').text(window.coursesData.currentTopic);
  }
  if (window.coursesData.currentSort) {
    $('.box3 .dropdown-toggle span').text(window.coursesData.currentSort);
  }
}

/**
 * Initialize courses filters and event handlers
 */
function initializeCoursesFilters() {
  // Search input event handler with debouncing
  let searchTimeout;
  $('.search-text-area').on('input', function() {
    clearTimeout(searchTimeout);
    const query = $(this).val();
    
    searchTimeout = setTimeout(function() {
      loadCourses(query, window.coursesData.currentTopic, window.coursesData.currentSort);
    }, 500); // 500ms debounce
  });
  
  // Topic dropdown event handler
  $(document).on('click', '.box2 .dropdown-item', function(e) {
    e.preventDefault();
    const selectedTopic = $(this).data('value');
    $('.box2 .dropdown-toggle span').text($(this).text());
    
    loadCourses(
      $('.search-text-area').val(),
      selectedTopic,
      window.coursesData.currentSort
    );
  });
  
  // Sort dropdown event handler
  $(document).on('click', '.box3 .dropdown-item', function(e) {
    e.preventDefault();
    const selectedSort = $(this).data('value');
    $('.box3 .dropdown-toggle span').text($(this).text());
    
    loadCourses(
      $('.search-text-area').val(),
      window.coursesData.currentTopic,
      selectedSort
    );
  });
}
