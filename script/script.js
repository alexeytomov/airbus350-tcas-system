
//Plane movement start

class Airbus {
    constructor(selector) {
        this.plane = document.querySelector(selector);
        this.isRight = +this.plane.dataset.number - 1; // 2: isRight = true,  1: isRight = false
        this.width = 1700;
        this.height, this.speed;//поля для динамической настройки полета
    }

    changeSettings(height, speed) {
        this.height = height;
        this.speed = speed;
        
    }

    start() {
        if (this.height)
        this.animation = this.plane.animate(
            createKeyframes(this.width, this.height, this.speed, this.isRight),
            {
                duration: 18000,
                iteratuions: 1,
                fill: 'forwards'
            }
        );
    //    document.querySelector("#start-button").removeEventListener("click", this.listener);
    }
    
    end() {
        this.animation.cancel();
    }
}

class HeightSetter {
    constructor(wrapperSelector) {
        this.wrapper = document.querySelector(wrapperSelector);
        this.table = this.wrapper.querySelectorAll(".height-table-item");
        [this.firstDigit, this.secondDigit] = this.wrapper.querySelectorAll(".height-table-item");
        this.height = this.firstDigit.dataset.digit + this.secondDigit.dataset.digit;

        this.increase = () => { //listener (для удаление нужен тот же объект)
            incrDigit(this.firstDigit, this.secondDigit, 3, this.table, 5);
        }

        this.decrease = () => {
            decrDigit(this.firstDigit, this.secondDigit, 0, this.table, 5);
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
        this.speed = this.sign.dataset.sign + this.firstDigit.dataset.digit + this.secondDigit.dataset.digit;

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
        this.speed = this.sign.dataset.sign + this.firstDigit.dataset.digit + this.secondDigit.dataset.digit;
    }

    delete() {
        circleSpeedUp.removeEventListener("click", this.increase);
        circleSpeedDown.removeEventListener("click", this.decrease);

        this.wrapper.style.display = "none";
    }
}

const leftPlane = new Airbus(".left-plane");
const rightPlane = new Airbus(".right-plane");


    //leftPlane.render(1300, 100, 2.5); // width | height | speed (0.5 long, 1 - center, 2 - start)
    //rightPlane.start(1300, 100, 2.5); //Height - высчитываем процент  высоты на пульте от настроенной высоты получеем коэф, на который умножим 150 (получим макс высоту)
    //исправить скорость движения (самолет при низкой скорости наборе высоты начинает ускорятся) 
    // инициализировать кнопку restart
// });


function createKeyframes(maxWidth, maxHeight, speed, isRight) {
    let frames = [];
    let currentWidth = 0,
        currentHeight = 0;

    if ((speed == 0) && (isRight)) {
        frames.push({transform: `translateX(-${maxWidth}px)`});
        return frames;
    } else if ((speed == 0) && !(isRight)) {
        frames.push({transform: `translateX(${maxWidth}px)`});
        return frames;
    }
    
    while ((currentWidth < maxWidth)) {
        currentWidth += 15;
        currentHeight = Math.floor(Math.sqrt(70*currentWidth * Math.abs(speed)));
    
        if (currentHeight > maxHeight) {
            currentHeight = maxHeight;
        }

        //put frame to array for plane(1 | 2)
        if (isRight){
            if (speed > 0) {
                frames.push({transform: `translate(-${currentWidth}px, -${currentHeight}px)`});
            } else if (speed < 0){
                frames.push({transform: `translate(-${currentWidth}px, ${currentHeight}px)`});
            }
        } else {
            if (speed > 0){
                frames.push({transform: `translate(${currentWidth}px, -${currentHeight}px)`});
            } else if (speed < 0) {
                frames.push({transform: `translate(${currentWidth}px, ${currentHeight}px)`});
            }
        }
    }
    return frames;
}


//Plane movement end


//Set Heigth levels start

const [h1, h2] = document.querySelectorAll(".height");

h1.textContent = "FL" + 11000;  
h2.textContent = "FL" + 10000;

//настройка уровней высоты динамическая

// getDynamicInformation("#h1");
// getDynamicInformation("#h2");

// function getDynamicInformation(selector) {
//     const input = document.querySelector(selector);
//     input.addEventListener('input', () => {
//         switch(input.getAttribute('data-height')) {
//             case "1":
//                 h1.textContent = "FL" + input.value;
//                 break;
//             case "2":
//                 h2.textContent = "FL" + input.value;
//                 break;
//         }
//     });
// }

//Set Height levels end

//Speed and height settings throught circles start

const [circleHeightDown, circleHeightUp] = document.querySelectorAll(".circle-height-pic"),
      [circleSpeedDown, circleSpeedUp] = document.querySelectorAll(".circle-speed-pic");

      
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


// flight with current settings

function calculateHeightPercent(heightSettings, heightLevel) {
    return ((heightSettings * 1000) / heightLevel); //находим какой процент от ровня высоты составляет текущая настройка
    // height settings X1000 (настройки исчисляются в КМ)
}

function calculateHeightPercentLeft(heightSettings, H1, H2) {
    return Math.abs(H1 + H2 - heightSettings * 1000) / H2; 
    // return (1 - ((heightSettings * 1000) / heightLevel) % 1); //тк точка отсчета выше чем уровень высоты указываем текущую высоту в другой СС (сверху)
}    // формула: 1 - ( currentHeight / hieghtLevel) % 1


//Кнопка Старт
document.querySelector("#start-button").addEventListener("mouseover", () => { //наведение мыши на START применяет новые параметры
    rightHeightSetter.save();
    rightSpeedSetter.save();
    leftHeightSetter.save();
    leftSpeedSetter.save();

    leftPlane.changeSettings(calculateHeightPercentLeft(leftHeightSetter.height, +h1.textContent.slice(2), +h2.textContent.slice(2) ) * 150, leftSpeedSetter.speed / 10);
    
    rightPlane.changeSettings(calculateHeightPercent(rightHeightSetter.height, +h2.textContent.slice(2) ) * 135, rightSpeedSetter.speed / 10);
});

document.querySelector("#start-button").addEventListener("click", () => {   
    if (leftPlane.animation?.playState == "running" || rightPlane.animation?.playState == "running") { //если анимация запущена - не запускать по новой
        return;
    }
    leftPlane.start();
    rightPlane.start();
});


//Кнопка Рестарт
document.querySelector("#restart-button").addEventListener("click", () => {
    leftPlane.end();
    rightPlane.end();
});




// controlSetter function (dynamic digit changes)

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
            deleteZeroes(table);
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

function deleteZeroes(table) {
    for (let i = 1; i < table.length - 1; i++){
        table[i].innerHTML = '';
    }
}

function createZeroes(table) {
    for (let i = 1; i < table.length - 1; i++){
        table[i].innerHTML = `<img src="assets/images/nums/${table[i].dataset.digit}.png" alt="digit"></img>`;
    }
}
