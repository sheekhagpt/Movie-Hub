let APIkey = "5da22362";
let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let movieContainer = document.querySelector(".movie-container");
let wishlistContainer = document.getElementById("wishlist");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Function to save wishlist to localStorage
const saveWishlist = () => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

// Function to render the wishlist
const renderWishlist = () => {
    wishlistContainer.innerHTML = "";
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<li>Your wishlist is empty.</li>";
        return;
    }

    wishlist.forEach(movie => {
        let li = document.createElement("li");
        li.innerHTML = `${movie.Title} 
            <button class="removeWishlistBtn" data-id="${movie.imdbID}">Remove</button>`;
        wishlistContainer.appendChild(li);
    });
};


// Add to wishlist function
const addToWishlist = (movie) => {
    if (!wishlist.some(item => item.imdbID === movie.imdbID)) {
        wishlist.push(movie);
        saveWishlist();
        renderWishlist();
    }
};

// Remove from wishlist function
const removeFromWishlist = (id) => {
    wishlist = wishlist.filter(movie => movie.imdbID !== id);
    saveWishlist();
    renderWishlist();
};

// Get data from API
const getData = async (movie) => {
    try {
        let encodedMovie = encodeURIComponent(movie);
        let fetchData = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=${APIkey}`);
        let jsonData = await fetchData.json();

        if (jsonData.Response === "False") {
            movieContainer.innerHTML = `<h1>${jsonData.Error || "Movie not found! Try again."}</h1>`;
            return;
        }

        let div = document.createElement("div");
        div.classList.add("movieCardContainer");
        movieContainer.innerHTML = "";  // Clear previous content

        jsonData.Search.map(key => {
            div.innerHTML += `
                <div class="movieCard">
                    <img src="${key.Poster}" alt="${key.Title}" />
                    <div class="cardText">
                        <h1>${key.Title}</h1>
                        <h3>Year: ${key.Year}</h3>
                        <h3>ImdbId: ${key.imdbID}</h3>
                        <a href="https://www.imdb.com/title/${key.imdbID}" target="_blank">View on IMDb</a>
                        <button class="wishlistBtn" data-id="${key.imdbID}" data-title="${key.Title}" data-poster="${key.Poster}">Add to Wishlist</button>
                    </div>
                </div>
            `;
        });

        movieContainer.appendChild(div);

        // Scroll to the movie container
        movieContainer.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error("Error fetching movie data:", error);
        movieContainer.innerHTML = `<h1>Error fetching data! Please try again later.</h1>`;
    }
};

// Event listener for search button
searchBtn.addEventListener("click", function () {
    let movieName = searchInput.value.trim();
    if (movieName !== "") {
        getData(movieName);
    } else {
        movieContainer.innerHTML = "<h1>Please enter a movie name to search</h1>";
    }
});

// Add event listener for adding/removing wishlist items
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("wishlistBtn")) {
        let movie = {
            imdbID: e.target.dataset.id,
            Title: e.target.dataset.title,
            Poster: e.target.dataset.poster
        };
        addToWishlist(movie);
    }

    if (e.target.classList.contains("removeWishlistBtn")) {
        let movieId = e.target.dataset.id;
        removeFromWishlist(movieId);
    }
});

// Render wishlist on page load
renderWishlist();
