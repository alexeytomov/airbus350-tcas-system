//Plane movement start

class Airbus {
    constructor(selector, number) {
        this.plane = document.querySelector(selector);
        this.isRight = +this.plane.dataset.number - 1; // 2: isRight = true,  1: isRight = false
    }

    start(maxWidth, maxHeight, speed=1) {
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
    leftPlane.start(1300, 150, 0.5); // width | height | speed (0.5 long, 1 - center, 2 - start)
    rightPlane.start(1300, 150, 2); 
});


function createKeyframes(maxWidth, maxHeight, speed, isRight) {
    let frames = [];
    let currentWidth = 0,
        currentHeight = 0;

    while ((currentWidth < maxWidth) || (currentHeight < maxHeight)) {
        currentWidth += 25;
        currentHeight = Math.floor(Math.sqrt(30*currentWidth*speed));
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

//Speed and height settings throught circles start

const [circleHeightDown, circleHeightUp] = document.querySelectorAll(".circle-height-pic"),
      [circleSpeedDown, circleSpeedUp] = document.querySelectorAll(".circle-speed-pic");

const heightTable = document.querySelectorAll(".height-table-item"),
      [heightFirstDigit, heightSecondDigit] = heightTable;

const speedSymbols = document.querySelectorAll(".speed-table-item"),
      [speedSign, ...speedTable] = speedSymbols,
      [speedFirstDigit, speedSecondDigit] = speedTable;
console.log(speedFirstDigit.innerHTML);
      



circleHeightUp.addEventListener("click", () => {
    incrDigit(heightFirstDigit, heightSecondDigit, 3, heightTable, 1);
});

circleHeightDown.addEventListener("click", () => {
    decrDigit(heightFirstDigit, heightSecondDigit, 0, heightTable, 1);
});

circleSpeedUp.addEventListener("click", () => {
    if (speedSign.dataset.sign == "+") {
        incrDigit(speedFirstDigit, speedSecondDigit, 5, speedTable, 5);
    } 
    else if (speedSign.dataset.sign == "0") {
        incrDigit(speedFirstDigit, speedSecondDigit, 5, speedTable, 5);
        speedSign.setAttribute("data-sign", "+");
        speedSign.innerHTML = `<img src="assets/images/nums/${speedSign.dataset.sign}.png" alt="sign">`;
    } else {
        decrDigit(speedFirstDigit, speedSecondDigit, -5, speedTable, 5);
        if ((speedFirstDigit.dataset.digit == "0") && (speedSecondDigit.dataset.digit == "0")) {
            speedSign.setAttribute("data-sign", 0);
            speedSign.innerHTML = '';
        }
    }
});

circleSpeedDown.addEventListener("click", () => {
    if (speedSign.dataset.sign == "+") {
        decrDigit(speedFirstDigit, speedSecondDigit, 0, speedTable, 5);
        if ((speedFirstDigit.dataset.digit == "0") && (speedSecondDigit.dataset.digit == "0")) {
            speedSign.setAttribute("data-sign", 0);
            speedSign.innerHTML = '';
        } 
    } else if (speedSecondDigit.dataset.digit == "0") {
        incrDigit(speedFirstDigit, speedSecondDigit, 5, speedTable, 5);
        speedSign.setAttribute("data-sign", "-");
        speedSign.innerHTML = `<img src="assets/images/nums/${speedSign.dataset.sign}.png" alt="sign">`;
    } else {
        incrDigit(speedFirstDigit, speedSecondDigit, 5, speedTable, 5);
    }
});

function decrDigit(firstDigit, secondDigit, minDigit, table, step) {
    if ((secondDigit.dataset.digit > minDigit) || (firstDigit.dataset.digit > minDigit)){

        if (secondDigit.dataset.digit == '0') {
            secondDigit.setAttribute("data-digit", 10 - step);
            secondDigit.innerHTML = `<img src="assets/images/nums/${secondDigit.dataset.digit}.png" alt="digit"></img>`;
    
            firstDigit.setAttribute("data-digit", +firstDigit.dataset.digit - 1);
            
            if (firstDigit.dataset.digit == "0") {
                firstDigit.innerHTML = ``;    
            } else {
                firstDigit.innerHTML = `<img src="assets/images/nums/${firstDigit.dataset.digit}.png" alt="digit"></img>`;
            }
            
        } else {
            secondDigit.setAttribute("data-digit", +secondDigit.dataset.digit - step);
            secondDigit.innerHTML = `<img src="assets/images/nums/${secondDigit.dataset.digit}.png" alt="digit"></img>`;
        }
        // check if |00000| then del
        if ((firstDigit.dataset.digit == "0") && (secondDigit.dataset.digit == "0")) {
            deleteZeros(table);
        }

    }
}


function incrDigit(firstDigit, secondDigit, maxDigit, table, step) {
    if ((firstDigit.dataset.digit == "0") && (secondDigit.dataset.digit == "0")) {
        createZeroes(table);
    }

    if (firstDigit.dataset.digit < maxDigit) {

        if (secondDigit.dataset.digit == `${10 - step}`) {
            secondDigit.setAttribute("data-digit", 0);
            secondDigit.innerHTML = `<img src="assets/images/nums/${secondDigit.dataset.digit}.png" alt="digit"></img>`;
    
            firstDigit.setAttribute("data-digit", +firstDigit.dataset.digit + 1);
            firstDigit.innerHTML = `<img src="assets/images/nums/${firstDigit.dataset.digit}.png" alt="digit"></img>`;
        } else {
            secondDigit.setAttribute("data-digit", +secondDigit.dataset.digit + step);
            secondDigit.innerHTML = `<img src="assets/images/nums/${secondDigit.dataset.digit}.png" alt="digit"></img>`;
        }
    }

}

function deleteZeros(table) {
    for (let i = 1; i < table.length - 1; i++){
        table[i].innerHTML = '';
    }
}

function createZeroes(table) {
    for (let i = 1; i < table.length - 1; i++){
        console.log(table[i]);
        table[i].innerHTML = `<img src="assets/images/nums/${table[i].dataset.digit}.png" alt="digit"></img>`;
    }
}

//Speed and height settings throught circles end