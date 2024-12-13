'use strict';

// display only active tab
function showTab() {
    const tabs = document.querySelectorAll(".tabs > li");
    const URLs = document.querySelectorAll(".urlBar > p");
    const windows = document.querySelectorAll(".browserWindow");
    const chatTab = document.querySelector("#chatWindow");
    
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
       imgSlideshow();

        // now if the user clicks we want to switch 
        tabs.forEach((tab, i) => {
            tab.addEventListener("click", () => {
                displayTab(i);
                imgSlideshow();
                if (chatTab && chatTab.classList.contains("activeWindow")) {
                    helloJay();
                };
            });
        });
    };
};

// contact / chatbot AKA Jay
function helloJay(){ 
    // a place to store everything
    let conversationState = {
        step: "name", 
        userName: "",
        userAvatar: "",
        contactPref: "",
        contactInfo: "",
        message: "",
        verificationStep: "",
        prevStep: ""
    };
    
    // acquiring all of Jay's elements & such
    const chatContainer = document.getElementById("chatContainer");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendMsg");

    // setting up the functionality for Jay
        // event listener for the button
        sendBtn.addEventListener("click", () => {
            sendMessage();
            console.log("inside sendBtn event listener");
        });

        // event listener for when the user hits "Enter"
        userInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
            sendMessage();
            console.log("inside enter key event listener");
            };
        }); 

        // timestamping for messages
        function getTimestamp() {
            const now = new Date();
            return now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });
        };

        // validate email and phone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;

        function validateEmail(email) {
            emailRegex.test(email);
        };

        function validatePhone(phone) {
            phoneRegex.test(phone);
        };

        // format phone to be readable
        function formatPhone(phone){
            const cleanPhone = phone.replace(/\D/g, '');
            return `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}`;
        };

        // let the user say diff variations of yes for a more natural conversation
        function isAffirmative(input) {
            const affirmResponses = [ "yes", "yeah", "yea", "yup", "yes please", "please", "sure", "ok", "okay", "i guess so", "i do"];
            return affirmResponses.includes(input.toLowerCase().trim());
        };

        // typing dots!
        function showTypingIndicator() {
            console.log("inside typing indicator");
            // const chatContainer = document.getElementById("chatContainer");
            const wrapperDiv = document.createElement("div");
            wrapperDiv.className = "messageWrapper botWrapper";
            wrapperDiv.id = "typingIndicator";

            // create dots to animate with CSS
            const indicatorDiv = document.createElement("div");
            indicatorDiv.className = "typingIndicator";

            // make 3 dots
            for (let i = 0; i < 3; i++) {
                const typingDot = document.createElement("div");
                typingDot.className = "typingDot";
                indicatorDiv.appendChild(typingDot);
            };

            // create Jay's "avatar" -- J for Jay 
            const avatarDiv = document.createElement("div");
            avatarDiv.className = "avatar botAvatar";
            avatarDiv.textContent = "J";

            // display it all together now & scroll to show most recent message
            wrapperDiv.appendChild(avatarDiv);
            wrapperDiv.appendChild(indicatorDiv);
            chatContainer.appendChild(wrapperDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        };

        // typing dots stop when message is 'ready'
        function removeTypingIndicator() {
            const indicator = document.getElementById("typingIndicator");
            if (indicator) {
                indicator.remove();
            };
        };

        // now some typing dots for the user when they are typing pretty much the same as before
        let typingTimeout;
        userInput.addEventListener("input", function() {
            clearTimeout(typingTimeout);
            showUserTyping();
            typingTimeout = setTimeout(hideUserTyping, 1000);
        });

        function showUserTyping() {
            let typingDiv = document.getElementById("userTyping");
            if (!typingDiv) {
                typingDiv = document.createElement("div");
                typingDiv.id = "userTyping";
                typingDiv.className = "userTyping";

                for (let i = 0; i < 3; i++) {
                    const userTypingDot = document.createElement("div");
                    userTypingDot.className = "userTypingDot";
                    typingDiv.appendChild(userTypingDot);
                };

                chatContainer.appendChild(typingDiv);
            };
        };

        function hideUserTyping() {
            let typingDiv = document.getElementById("userTyping");
            if (typingDiv) {
                typingDiv.remove();
            };
        };
       
        hideUserTyping();

        // the chat messages have entered the chat lol
        async function addMessage(message, sender, delay = 1000) {
            console.log("inside addMessage");
            if (sender === "bot") {
                showTypingIndicator();
                // artificial 'thinking' time
                await new Promise(resolve => setTimeout(resolve, delay));
                removeTypingIndicator();
            };
            
            // create a new wrapper for the new message
            const wrapperDiv = document.createElement("div");
            wrapperDiv.className = `messageWrapper ${sender}Wrapper`;

            // make the sender's avatar
            const avatarDiv = document.createElement("div")
            avatarDiv.className = `avatar ${sender}Avatar`;
            // letter depends on sender
            if (sender === "user" && conversationState.step === "name") {
                avatarDiv.textContent = message.charAt(0).toUpperCase();
            } else {
                avatarDiv.textContent = sender === "bot" ? "J" : conversationState.userAvatar;
            };

            // create a container for the entire message
            const messageContainer = document.createElement("div");
            messageContainer.className = "messageContainer";

            // a div for the message bubble
            const messageDiv = document.createElement("div");
            messageDiv.className = `message ${sender}Message`;
            messageDiv.textContent = message;

            // attach the timestamp
            const timestampDiv = document.createElement("div");
            timestampDiv.className = "timestamp";
            timestampDiv.textContent = getTimestamp();

            // put it all together and auto scroll 
            messageContainer.appendChild(messageDiv);
            messageContainer.appendChild(timestampDiv);
            wrapperDiv.appendChild(avatarDiv);
            wrapperDiv.appendChild(messageContainer);
            chatContainer.appendChild(wrapperDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        };

        // core conversation steps / what Jay can say
        function processUserInput(input) {
            switch(conversationState.step) {
                case "name":
                    // update conversation state data
                    conversationState.userName = input.charAt(0).toUpperCase() + input.slice(1);
                    conversationState.userAvatar = input.charAt(0).toUpperCase();

                    if (conversationState.message) {
                        verifyInfo();
                    } else {
                        conversationState.step = "needContact";
                        addMessage(`Nice to meet you, ${input.charAt(0).toUpperCase() + input.slice(1)}. I want you to know that I'm pretty new at my job, but I can help you get in touch with Janessa.`, "bot");
                        setTimeout(() => {
                            addMessage("Would you like to send her a message?", "bot");
                        }, 1500);
                    };
                    break;
                
                case "needContact": 
                    if (isAffirmative(input) || input.toLowerCase() === "no") {
                        if (isAffirmative(input)) {
                            conversationState.step = "contactPreference";
                            addMessage("Would you prefer to chat with her via email or phone?", "bot");
                        } else {
                            converstation.step = "end";
                            addMessage("Okay, have a great day!", "bot");
                        };
                    } else {
                        addMessage("I have limited functionality. Please answer with a yes or no.", "bot");
                    };
                    break;

                case "contactPreference":
                    const preference = input.toLowerCase(); 
                    if (preference === "email" || preference === "phone") {
                        conversationState.contactPref = preference;
                        conversationState.step = "contactInfo";
                        if (preference === "email") {
                            addMessage("What is your email address?", "bot");
                        } else {
                            addMessage("What is your phone number?", "bot");
                        };
                    } else {
                        addMessage("I'm sorry, I have limited abilities. Please specify 'email' or 'phone'.", "bot");
                    };
                    break;

                case "contactInfo":
                    if (conversationState.contactPref === "phone") {
                        if (!validatePhone(input)) {
                            addMessage("Please enter a valid 10-digit phone number.", "bot");
                            return;
                        };
                        conversationState.contactInfo = formatPhone(input);
                    } else {
                        if(!validateEmail(input)) {
                            addMessage("Please enter a valid email address.", "bot");
                            return;
                        };
                        conversationState.contactInfo = input;
                    };

                    if (conversationState.message) {
                        verifyInfo();
                    } else {
                        conversationState.step = "message";
                        addMessage("What would you like to talk to Janessa about?", "bot");
                    };
                    break;

                case "message":
                    conversationState.message = input;
                    verifyInfo(); 
                    break;

                case "verify":
                    if (isAffirmative(input) || input.toLowerCase() === "no") {
                        if (isAffirmative(input)) {
                            conversationState.step = "end";
                            addMessage(`Great! It was nice talking to you, ${conversationState.userName}. I hope you have a great day. Goodbye!`, "bot");
                        } else {
                            conversationState.step = "correction";
                            addMessage("Which part would you like to change: your name, message, or contact information?", "bot");
                        };
                    } else {
                        addMessage("Please answer with 'yes' or 'no' only.", "bot");
                    };
                    break;

                case 'correction':
                    const choice = input.toLowerCase();
                    if (choice.includes('name')) {
                        conversationState.step = 'name';
                        addMessage("I'm so sorry about that! What is your correct name?", 'bot');
                    } else if (choice.includes('message')) {
                        conversationState.step = 'message';
                        addMessage("What would you like to tell Janessa instead?", 'bot');
                    } else if (choice.includes('contact')) {
                        conversationState.step = 'contactPreference';
                        addMessage("Would you prefer to chat via email or phone?", 'bot');
                    } else {
                        addMessage("Please specify either 'name', 'message', or 'contact information'.", 'bot');
                    };
                    break; 
                    
                case "end": 
                    addMessage("This conversation has ended. Please refresh the page to start over.");
                    break;
            };
        };

        // validation of the information to be relayed (even though I don't know how to relay it yet)
        function verifyInfo() {
            addMessage(`Ok. I'll tell Janessa to contact ${conversationState.userName} by ${conversationState.contactPref} at ${conversationState.contactInfo}.
                        I'll tell her you said "${conversationState.message}". Does this sound right?`, "bot");
            conversationState.step = "verify";
        };

        async function sendMessage() {
            console.log("inside sendMessage");
            const userMessage = userInput.value.trim();
            // ignore empty messages
            if (!userMessage) return;

            // hide dots, add what they said, and clear input field
            hideUserTyping();
            addMessage(userMessage, 'user');
            userInput.value = '';

            // artifical "thinking" time, then respond
            await new Promise(resolve => setTimeout(resolve, 500));
            processUserInput(userMessage);
        };
    
        // allows the initial message to display when the window loads
        addMessage("Hello! I'm Jay. Janessa made me to take messages. What is your name?", "bot");

        console.log("inside helloJay");
    };

    // project image slideshow
    function imgSlideshow() {
        // acquire elements{
        const currWindow = document.querySelector(".activeWindow");
        const slides = currWindow.querySelectorAll(".slide");
        const dots = currWindow.querySelector(".slideshowDots"); 
        
        // check for slides
        if (slides.length > 0) {
            let activeSlide = 0;
            let slideInterval;

            // add a dot for every image          
                dots.innerHTML = "";

                for (let i = 0; i < slides.length; ++i) {
                    const newDot = document.createElement("span");
                    newDot.classList.add("dots");
                    dots.appendChild(newDot);
                };

                const allDots = currWindow.querySelectorAll(".dots");
                allDots[0].classList.add("active");
                console.log(allDots);

            // functions
                function currSlide(n) {
                    slides.forEach(slide => {
                        slide.classList.remove("active");
                    });

                    allDots.forEach(dot => {
                        dot.classList.remove("active");
                    });

                    slides[n].classList.add("active");
                    allDots[n].classList.add("active");
                };

                function nextSlide() {
                    activeSlide++;

                    if (activeSlide >= slides.length) {
                        activeSlide = 0;
                    };  

                    currSlide(activeSlide);
                };

                // reseting interval 
                function resetInterval() {
                    if (slideInterval) {
                        clearInterval(slideInterval);
                    };

                    slideInterval = setInterval(nextSlide, 5500);
                };

                // start the intervals
                resetInterval();

                // make it so user can select dots
                allDots.forEach((dot, i) => {
                    dot.addEventListener("click", () => {
                        activeSlide = i;
                        currSlide(i);
                        resetInterval();
                    });
                });
           
        };
    };

// call functions on DOM load
document.addEventListener("DOMContentLoaded", function () {
    showTab();
});