const chime = document.getElementById("chime-sound");
    document.addEventListener('DOMContentLoaded', () => {
        //timeline
  const sections = document.querySelectorAll(".timeline-anchor");
  const timelineDotsContainer = document.getElementById("timeline-dots");
  var currentDot;
  var liveDotCount = 0;
  var currentSectionId = null;
  sections.forEach((section, index) => {
    const dot = document.createElement("div");
    dot.className = "timeline-dot";
    dot.dataset.index = index;
    dot.id=section.id;
    dot.dataset.tooltip = section.dataset.title || `Section ${index + 1}`;

    dot.addEventListener("click", () => {
        if(dot.classList.contains("live")){
            updateScreenOnScrollTo(dot.id)
        section.scrollIntoView({ behavior: "smooth" });
       updateCurrentDot(dot);
    }
    });
    timelineDotsContainer.appendChild(dot);
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
          if(dots[index].classList.contains("live")){
            //no change to live status
          } else{
            //another dot unlocked
            dots[index].classList.add("live");
          updateCurrentDot(dots[index]);
          liveDotCount++;
      }
        }
      }
    });
  }, {
    threshold: 0.3
  });
  let activeDotIndex = -1;
const timelineDots = document.querySelectorAll('.timeline-dot');
const timelineAnchors = document.querySelectorAll('.timeline-anchor');

function scrollToDot(index) {
  if (liveDotCount>index && index >= 0 && index < timelineAnchors.length) {
    timelineAnchors[index].scrollIntoView({ behavior: 'smooth' });
    activeDotIndex = index;
  updateCurrentDot(dots[index])
    }
}

// Assign up/down buttons
document.getElementById('timeline-up').addEventListener('click', () => {
  scrollToDot(activeDotIndex - 1);
});
document.getElementById('timeline-down').addEventListener('click', () => {
  scrollToDot(activeDotIndex + 1);
});

// Watch which section is in view to update activeDotIndex
const updateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activeDotIndex = [...timelineAnchors].indexOf(entry.target);
    }
  });
}, { threshold: 0.5 });

timelineAnchors.forEach(section => updateObserver.observe(section));

// Keyboard control
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    scrollToDot(activeDotIndex - 1);
  } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    scrollToDot(activeDotIndex + 1);
  }
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
    const resultsBox = document.getElementById('calculatorResult');
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
        resultsBox.textContent = `£${total.toFixed(2)}`;
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
/*pro cons sorting
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
    function showHints(){
        document.querySelectorAll(".hint").forEach(hint =>{hint.classList.add("showing")});
    }
    function hideHints(){
        document.querySelectorAll(".hint").forEach(hint =>{hint.classList.remove("showing")});

    }
        function scrollToSection(id){
            updateScreenOnScrollTo(id)
            document.getElementById(id).scrollIntoView({behavior:'smooth'});
        }
        function updateScreenOnScrollTo(id){
            currentSectionId = id;
            //special cases:
            switch(id){
                case "screen16":
                    var calculator = document.getElementById('interestCalculator');
                    var target = document.getElementById('SamCalcTarget');
                    target.insertAdjacentElement('afterend', calculator);

                break;
                case "screen17":
                    showHints();
                break;
                case "screen18":
                    hideHints();
                    break;
                case "final3":
                    var calculator = document.getElementById('interestCalculator');
                    var target = document.getElementById('final3Target');
                    target.insertAdjacentElement('afterend', calculator);
                break;
            }
        }
        function checkAnswer(button, nextSection,correct,incorrectSection){
            var destination;
            var delay = correct?750:500;
            if(correct){
                if(!button.classList.contains("correct")){
                    //we only reward a correct button once
                    chime.currentTime = 0; // rewind to start
                    chime.play();
                    button.classList.remove("incorrect");
                    button.classList.add("correct");
                }
                destination = nextSection;
            } else{
                if(!button.classList.contains("reusable")){
                button.classList.add("incorrect");
            }
                destination = incorrectSection || nextSection;
            }
            //alert(correct ? "Correct!" : "Try again.");
            if(nextSection=="retry"){
                //display a wrong answer and ask to try again?
            } else{
            setTimeout(function(){scrollToSection(destination)},delay);
            }
            button.disabled = !correct && !button.classList.contains("reusable");
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
        /**/
function scaleAllSections() {
  document.querySelectorAll('.section').forEach(section => {
    const content = section.querySelector('.video-container');
    //if (!content) return;
    //content.style.transform = 'scale(1)';
    //content.style.transformOrigin = 'top center';

    const available = section.clientHeight;
    const actual = section.scrollHeight+100;

    if (actual > available) {
      const scale = available / actual;
      section.style.transform = `scale(${scale})`;
      if(content){
        content.style.transform = `scale(${scale})`;
        }
    }
  });

  // Scroll back to current section after scaling
  if (currentSectionId) {
    const target = document.getElementById(currentSectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'auto' });
    }
  }
}

Promise.all([
  document.fonts.ready,
  new Promise(resolve => window.addEventListener('load', resolve))
]).then(scaleAllSections);

window.addEventListener('resize', scaleAllSections);


/**/