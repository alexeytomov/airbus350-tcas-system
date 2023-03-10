//Plane movement start

class Airbus {
    constructor(selector, number) {
        this.plane = document.querySelector(selector);
        this.isRight = number - 1; // 2: isRight = true,  1: isRight = false
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
    leftPlane.start(1300, 150, 100);
    rightPlane.start(1300, 150);
});


function createKeyframes(maxWidth, maxHeight, speed, isRight) {
    let frames = [];
    let currentWidth = 0,
        currentHeight = 0;

    while (currentWidth < maxWidth) {
        currentWidth += 25;
        currentHeight = Math.floor(Math.sqrt(currentWidth*speed));
    
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