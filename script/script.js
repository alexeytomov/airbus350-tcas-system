//Plane movement start

class Airbus {
    constructor(selector, number) {
        this.plane = document.querySelector(selector);
        this.isRight = +this.plane.dataset.number - 1; // 2: isRight = true,  1: isRight = false
    }

    start(maxWidth, maxHeight, speed=25) {
        this.plane.animate(
            createKeyframes(maxWidth, maxHeight, speed, this.isRight),
            {
                duration: 5000,
                iteratuions: 1,
                fill: 'forwards'
            }
        )
    }
};

const leftPlane = new Airbus(".left-plane", 1);
const rightPlane = new Airbus(".right-plane", 2);



document.querySelector("button").addEventListener("click", () => {
    leftPlane.start(1300, 150, 1); // width | height | speed
    rightPlane.start(1300, 150, 1);
});


function createKeyframes(maxWidth, maxHeight, speed, isRight) {
    let frames = [];
    let currentWidth = 0,
        currentHeight = 0;

    while ((currentWidth < maxWidth) || (currentHeight < maxHeight)) {
        currentWidth += 25;
        currentHeight = Math.floor(Math.sqrt(currentWidth*speed));
        console.log(speed);
    
        if (currentHeight > maxHeight) {
            currentHeight = maxHeight;
        }
        if (isRight){
            frames.push({transform: `translate(-${currentWidth}px, -${currentHeight}px)`});
        } else {
            frames.push({transform: `translate(${currentWidth}px, ${currentHeight}px)`});
        }
    }
    return frames;
}


//Plane movement end


//Set Heigth levels start

const [h1, h2] = document.querySelectorAll(".height");
getDynamicInformation("#h1");
getDynamicInformation("#h2");

function getDynamicInformation(selector) {
    const input = document.querySelector(selector);
    input.addEventListener('input', () => {
        switch(input.getAttribute('data-height')) {
            case "1":
                h1.textContent = "FL" + input.value;
                break;
            case "2":
                h2.textContent = "FL" + input.value;
                break;
        }
    });
}

//Set Heigth levels end