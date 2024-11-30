'use strict';

// display only active tab
function showTab() {
    const tabs = document.querySelectorAll(".tabs > li");
    const URLs = document.querySelectorAll(".urlBar > p");
    const windows = document.querySelectorAll(".browserWindow");
    
    // just verifying they're there
    console.log(tabs);
    console.log(URLs);
    console.log(windows);

    // check for tabs & select the first one by default
    if (tabs.length > 0) {
        let activeTab = 0;

        function displayTab(n) {
            // remove active ids + class from our 3 elements
            tabs.forEach(tab => {
                tab.removeAttribute("id");
            });

            URLs.forEach(url => {
                url.removeAttribute("id");
            });

            windows.forEach(window => {
                window.classList.remove("activeWindow");
            });
            
            // make the correct ones active
            tabs[n].id = "activeTab";
            URLs[n].id = "activeURL";
            windows[n].classList.add("activeWindow");
        };

        displayTab(activeTab);
        
        // now if the user clicks we want to switch 
        tabs.forEach((tab, i) => {
            tab.addEventListener("click", () => {
                displayTab(i);
            });
        });

    };
};

// call functions on DOM load
document.addEventListener("DOMContentLoaded", function () {
    showTab();
});