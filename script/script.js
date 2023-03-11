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

//Set Height levels end

//Speed and height settings throught circles start

const [circleHeightDown, circleHeightUp] = document.querySelectorAll(".circle-height-pic"),
      [circleSpeedDown, circleSpeedUp] = document.querySelectorAll(".circle-speed-pic");

      
// Class for speed and height panel start

class HeightSetter {
    constructor(wrapperSelector) {
        this.wrapper = document.querySelector(wrapperSelector);
        this.table = this.wrapper.querySelectorAll(".height-table-item");
        [this.firstDigit, this.secondDigit] = this.wrapper.querySelectorAll(".height-table-item");

        this.increase = () => { //listener (для удаление нужен тот же объект)
            incrDigit(this.firstDigit, this.secondDigit, 3, this.table, 1);
        }

        this.decrease = () => {
            decrDigit(this.firstDigit, this.secondDigit, 0, this.table, 1);
        }
    }

    render() {
        circleHeightUp.addEventListener("click", this.increase);
        circleHeightDown.addEventListener("click", this.decrease);

        this.wrapper.style.display = "flex";
    }

    save() {
        this.height = this.firstDigit.dataset.digit + this.secondDigit.dataset.digit;
    }

    delete() {
        circleHeightUp.removeEventListener("click", this.increase);
        circleHeightDown.removeEventListener("click", this.decrease);

        this.wrapper.style.display = "none";
    }
}

class SpeedSetter {
    constructor(wrapperSelector) {
        this.wrapper = document.querySelector(wrapperSelector);
        [this.sign, ...this.table] = this.wrapper.querySelectorAll(".speed-table-item");
        [this.firstDigit, this.secondDigit] = this.table;

        this.increase = () => { //listener (для удаление нужен тот же объект)
            if (this.sign.dataset.sign == "+") {
                incrDigit(this.firstDigit, this.secondDigit, 5, this.table, 5);
            } 
            else if (this.sign.dataset.sign == "0") {
                incrDigit(this.firstDigit, this.secondDigit, 5, this.table, 5);
                this.sign.setAttribute("data-sign", "+");
                this.sign.innerHTML = `<img src="assets/images/nums/${this.sign.dataset.sign}.png" alt="sign">`;
            } else {
                decrDigit(this.firstDigit, this.secondDigit, -5, this.table, 5);
                if ((this.firstDigit.dataset.digit == "0") && (this.secondDigit.dataset.digit == "0")) {
                    this.sign.setAttribute("data-sign", 0);
                    this.sign.innerHTML = '';
                }
            }
        }

        this.decrease = () => {
            if (this.sign.dataset.sign == "+") {
                decrDigit(this.firstDigit, this.secondDigit, 0, this.table, 5);
                if ((this.firstDigit.dataset.digit == "0") && (this.secondDigit.dataset.digit == "0")) {
                    this.sign.setAttribute("data-sign", 0);
                    this.sign.innerHTML = '';
                } 
            } else if (this.secondDigit.dataset.digit == "0") {
                incrDigit(this.firstDigit, this.secondDigit, 5, this.table, 5);
                this.sign.setAttribute("data-sign", "-");
                this.sign.innerHTML = `<img src="assets/images/nums/${this.sign.dataset.sign}.png" alt="sign">`;
            } else {
                incrDigit(this.firstDigit, this.secondDigit, 5, this.table, 5);
            }
        }
    }

    render() {
        circleSpeedUp.addEventListener("click", this.increase);
        circleSpeedDown.addEventListener("click", this.decrease);

        this.wrapper.style.display = "flex";
    }

    save() {
        this.speed = this.firstDigit.dataset.digit + this.secondDigit.dataset.digit;
    }

    delete() {
        circleSpeedUp.removeEventListener("click", this.increase);
        circleSpeedDown.removeEventListener("click", this.decrease);

        this.wrapper.style.display = "none";
    }
}

// Chosing airbus (left| right) 
const choiceLeft = document.querySelector("#planeChoice1"),
      choiceRight = document.querySelector("#planeChoice2");

const leftHeightSetter = new HeightSetter("#heightLeft");
const leftSpeedSetter = new SpeedSetter("#speedLeft");
const rightHeightSetter = new HeightSetter("#heightRight");
const rightSpeedSetter = new SpeedSetter("#speedRight");

const leftControlSetter = {
    height: leftHeightSetter,
    speed: leftSpeedSetter
};

const rightControlSetter = {
    height: rightHeightSetter,
    speed: rightSpeedSetter
}

for (let setter of Object.values(leftControlSetter)) { //render default value (left)
    console.log(Object.values(leftControlSetter));
    console.log(setter);
    setter.render();
}


choiceRight.addEventListener("change", () => {
    console.log(2);
    changeAirbuses(rightControlSetter, leftControlSetter);
});

choiceLeft.addEventListener("change", () => {
    console.log(1);
    changeAirbuses(leftControlSetter, rightControlSetter);
});

function changeAirbuses(newControlSetter, oldControlSetter) { 
    for (setter of Object.values(oldControlSetter)) {
        setter.save();
        setter.delete();
    }
    
    for (setter of Object.values(newControlSetter)) {
        setter.render();
    }
}

//Function for dynamic height and speed setting

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
        table[i].innerHTML = `<img src="assets/images/nums/${table[i].dataset.digit}.png" alt="digit"></img>`;
    }
}

