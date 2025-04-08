const chime = document.getElementById("chime-sound");
    document.addEventListener('DOMContentLoaded', () => {
        //timeline
  const sections = document.querySelectorAll(".timeline-anchor");
  const timeline = document.getElementById("timeline");
  var currentDot;
  sections.forEach((section, index) => {
    const dot = document.createElement("div");
    dot.className = "timeline-dot";
    dot.dataset.index = index;
    dot.dataset.tooltip = section.dataset.title || `Section ${index + 1}`;

    dot.addEventListener("click", () => {
        if(dot.classList.contains("live")){
        section.scrollIntoView({ behavior: "smooth" });
       updateCurrentDot(dot);
    }
    });
    timeline.appendChild(dot);
  });
  function updateCurrentDot(dot){
    liveDot.classList.remove("current")
    liveDot = dot;
    liveDot.classList.add("current");
  }
  const dots = document.querySelectorAll(".timeline-dot");
  liveDot = dots[0];
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = [...sections].indexOf(entry.target);
        if (index !== -1) {
          dots[index].classList.add("live");
          updateCurrentDot(dots[index]);
        }
      }
    });
  }, {
    threshold: 0.3
  });

  sections.forEach(section => tlObserver.observe(section));
  /*end of timeline code*/
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
    let userInteracted = false;
    const firstContinueBtn = document.getElementById('first-continue');
    //interest calculator
    const overdraftInput = document.getElementById('overdraft');
    const overdraftRange = document.getElementById('overdraftRange');
    const daysInput = document.getElementById('days');
    const daysRange = document.getElementById('daysRange');
    const resultsBox = document.getElementById('results');
    const interestRate = 1.00092226677;

    firstContinueBtn.addEventListener('click', () => {
        userInteracted = true;
        //document.documentElement.classList.remove('no-scroll');
        //document.body.classList.remove('no-scroll');
        scrollToSection('screen2');
    });

    // Make sure all fade-in-delayed elements are initially hidden
    const delayedElements = document.querySelectorAll('.fade-in-delayed');
    delayedElements.forEach(el => {
        el.classList.remove('visible'); // Remove any pre-loaded visibility
        el.style.opacity = "0";  // Force it hidden in case CSS didn't apply correctly
    });

    // Intersection Observer to trigger fade-in at the right moment
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = "1"; // Force fade-in
                }, parseInt(entry.target.style.getPropertyValue('--fade-delay')) || 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 }); // 30% of element must be visible

    delayedElements.forEach(el => fadeObserver.observe(el));

    // Observer for other animations (videos, interactions, etc.)
    const animatedElements = document.querySelectorAll('.video-container, .interaction, .text-line');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    animatedElements.forEach(el => observer.observe(el));

    // Autoplay videos when in view
    const videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting && userInteracted) {
                video.pause();               // Pause just in case
                video.currentTime = 0;       // Reset
                video.play().catch(err => {
                    console.warn("Autoplay failed:", err);
                });
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.frameless-video').forEach(video => {
        videoObserver.observe(video);
    });
    document.querySelectorAll('.showPennies').forEach(input => {
      input.addEventListener('change', () => {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
          input.value = value.toFixed(2);
        }
      });
    });
    //interest calculator:
    function updateResults() {
        const amount = parseFloat(overdraftInput.value);
        const days = parseInt(daysInput.value);
        const total = amount * Math.pow(interestRate,days) - amount;
        resultsBox.textContent = `Total interest: £${total.toFixed(2)}`;
    }

    overdraftInput.addEventListener('input', () => {
        overdraftRange.value = overdraftInput.value;
        updateResults();
    });

    overdraftRange.addEventListener('input', () => {
        overdraftInput.value = overdraftRange.value;
        updateResults();
    });

    daysInput.addEventListener('input', () => {
        daysRange.value = daysInput.value;
        updateResults();
    });

    daysRange.addEventListener('input', () => {
        daysInput.value = daysRange.value;
        updateResults();
    });

    // Initial results update
    updateResults();
});
/*pro cons sorting*/
 const cards = [
        "Samuel will get the game at the same time as his friends.",
        "Samuel may see spoilers for the game during the week he doesn’t have it.",
        "If Samuel is paid next week, he will only be overdrawn for a short time.",
        "The game will still be available to buy next week.",
        "Samuel will be charged interest on the amount of money he overdraws."
    ];

    const pros = [];
    const cons = [];

    let currentCard = 0;
    const cardElem = document.getElementById('card');

    function updateCard() {
        if (currentCard < cards.length) {
            cardElem.textContent = cards[currentCard];
            cardElem.style.transform = 'translateX(0)';
            cardElem.style.backgroundColor = '#FEFCFD';
            cardElem.style.opacity = '1';
            cardElem.style.display = 'block';
        } else {
            cardElem.style.display = 'none';
            document.getElementById('screen13').style.display = 'none';
            displayResults();
        }
    }

    function animateSort(type) {
        cardElem.style.transition = 'transform 0.5s ease-out, background-color 0.5s ease-out';
        if (type === 'pro') {
            cardElem.style.transform = 'translateX(600px)';
            cardElem.style.backgroundColor = '#c8e6c9';
            pros.push(cards[currentCard]);
        } else {
            cardElem.style.transform = 'translateX(-600px)';
            cardElem.style.backgroundColor = '#ffccbc';
            cons.push(cards[currentCard]);
        }
        currentCard++;
        setTimeout(() => {
            cardElem.style.transition = '';
            if (currentCard >= cards.length) {
                cardElem.style.display = 'none';
                document.getElementById('screen13').style.display = 'none';
                displayResults();
            } else {
                updateCard();
            }
        }, 500);
    }

    function displayResults() {
        const prosList = document.getElementById('pros-list');
        const consList = document.getElementById('cons-list');

        pros.forEach(pro => {
            const li = document.createElement('li');
            li.textContent = pro;
            prosList.appendChild(li);
        });

        cons.forEach(con => {
            const li = document.createElement('li');
            li.textContent = con;
            consList.appendChild(li);
        });

        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }

    let isDragging = false;
    let startX;

    cardElem.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        cardElem.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        cardElem.style.transform = `translateX(${deltaX}px)`;
        const intensity = Math.min(Math.abs(deltaX) / 150, 1);
        cardElem.style.backgroundColor = deltaX > 0 ? `rgba(200,230,201,${intensity})` : `rgba(255,204,188,${intensity})`;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        cardElem.style.cursor = 'grab';
        const deltaX = e.clientX - startX;
        if (deltaX > 150) {
            animateSort('pro');
        } else if (deltaX < -150) {
            animateSort('con');
        } else {
            cardElem.style.transform = 'translateX(0)';
            cardElem.style.backgroundColor = '#FEFCFD';
        }
    });

    updateCard();
/*end of pro cons sorting*/
        function scrollToSection(id){
            //special cases:
            switch(id){
                case "SamCalc":
                   var calculator = document.getElementById('interestCalculator');
                   var target = document.getElementById('SamCalcTarget');
                    target.insertAdjacentElement('afterend', calculator);

                break;
                case "final3":
                    var calculator = document.getElementById('interestCalculator');
                    var target = document.getElementById('final3Target');
                    target.insertAdjacentElement('afterend', calculator);
                break;
            }
            document.getElementById(id).scrollIntoView({behavior:'smooth'});


        }
        function checkAnswer(button, nextSection,correct,incorrectSection){
            var destination;
            var delay = correct?750:500;
            if(correct){
                chime.currentTime = 0; // rewind to start
                chime.play();
                button.classList.remove("incorrect");
                button.classList.add("correct");
                destination = nextSection;
            } else{
                button.classList.add("incorrect");
                destination = incorrectSection || nextSection;
            }
            //alert(correct ? "Correct!" : "Try again.");
            if(nextSection=="retry"){
                //display a wrong answer and ask to try again?
            } else{
            setTimeout(function(){scrollToSection(destination)},delay);
            }
        }
        // Function to handle image change and scroll
            function changeImageAndScroll(imageId, newImageSrc, nextSectionId) {
            const img = document.getElementById(imageId);
            if (img) {
                 img.src = newImageSrc;
            }
            setTimeout(() => scrollToSection(nextSectionId), 500);
}
        document.addEventListener('DOMContentLoaded',()=>{
            document.querySelectorAll('.fade-in, .text-line').forEach(el=>{
                const observer=new IntersectionObserver(entries=>{
                    entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');});
                },{threshold:0.2});observer.observe(el);
            });
        });
        //scaling:
        /*
function scaleSections() {
  const viewportHeight = window.innerHeight;
  document.querySelectorAll('.section').forEach(section => {
    const content = section;//.querySelector('.content-wrapper');
    
    // Reset transform to measure natural height
    content.style.transform = 'scale(1) translateY(0)';
    const contentHeight = content.offsetHeight;
    
    // Calculate scale factor if content is taller than the viewport
    let scaleFactor = 1;
    if (contentHeight > viewportHeight) {
      scaleFactor = viewportHeight / contentHeight;
    }
    
    // Calculate the height of the content after scaling
    const scaledHeight = contentHeight * scaleFactor;
    // Compute vertical offset to center the scaled content within the viewport
    const verticalOffset = (viewportHeight - scaledHeight)/2;
    
    // Apply the scaling and vertical offset
    content.style.transform = `scale(${scaleFactor}) translateY(${verticalOffset}px)`;
    // Ensure each section takes up the full viewport height
    //section.style.height = `${viewportHeight}px`;
  });
}

window.addEventListener('resize', scaleSections);
window.addEventListener('load', () => {
  scaleSections();
  if (document.fonts) {
    document.fonts.ready.then(scaleSections);
  }
});

// Run on initial load and on window resize
window.addEventListener('resize', scaleSections);
*/