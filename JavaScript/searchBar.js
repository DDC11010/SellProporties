document.getElementById("filterButton").addEventListener("click", function () {
    const filterOptions = document.getElementById("filterOptions");

    // Get the computed style of the filter options to check the current display value
    const currentDisplay = window.getComputedStyle(filterOptions).display;

    if (currentDisplay === "none") {
        filterOptions.style.display = "grid"; // Show filter options
    } else {
        filterOptions.style.display = "none"; // Hide filter options
    }
});
