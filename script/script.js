const trafficPath = "./assets/sounds/traffic.mp3";
const claimPath = "./assets/sounds/claim.mp3";
const clearPath = "./assets/sounds/no-conflict.mp3";

const horizontTcasLineRed = document.querySelector("#line-tcas");

const buttonTA = document.querySelector("#ta-mode-button");
const buttonTCAP = document.querySelector(".tcap-mode-button");


//Plane movement start

class Airbus {
    constructor(selector) {
        this.plane = document.querySelector(selector);
        this.time = 30000;
        this.isRight = +this.plane.dataset.number - 1; // 2: isRight = true,  1: isRight = false
        this.width = 1700;
        this.height, this.speed;//поля для динамической настройки полета
    }

    changeSettings(height, speed) {
        this.height = height;
        this.speed = speed;
        
    }

    start() {
        this.animation = this.plane.animate(
            createKeyframes(this.width, this.height, this.speed, this.isRight),
            {
                duration: this.time,
                iteratuions: 1,
                fill: 'forwards'
            }
        );
    }

    pause() {
        this.animation.pause();
    }

    play() {
        this.animation.play();
    }
    
    end() {
        this.animation.cancel();
    }
}

class HeightSetter {
    constructor(wrapperSelector) {
        this.wrapper = document.querySelector(wrapperSelector);
        this.table = this.wrapper.querySelectorAll(".height-table-item");
        [this.firstDigit, this.secondDigit, this.thirdDigit] = this.wrapper.querySelectorAll(".height-table-item");
        this.height = this.firstDigit.dataset.digit + this.secondDigit.dataset.digit + this.thirdDigit.dataset.digit;

        this.increase = () => { //listener (для удаление нужен тот же объект)
            incrDigitHeight(this.firstDigit, this.secondDigit, this.thirdDigit, 3, this.table, 5);
        }

        this.decrease = () => {
            decrDigitHeight(this.firstDigit, this.secondDigit, this.thirdDigit, 0, this.table, 5);
        }
    }

    render() {
        circleHeightUp.addEventListener("click", this.increase);
        circleHeightDown.addEventListener("click", this.decrease);

        this.wrapper.style.display = "flex";
    }

    save() {
        this.height = this.firstDigit.dataset.digit + this.secondDigit.dataset.digit + this.thirdDigit.dataset.digit;
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

class Horizont {
    constructor() {
        this.heightSettings = document.querySelector(".horizont-height-settings");
        this.speedSettings = document.querySelector(".horizont-speed-settings");
        this.speedLines = {
            up: document.querySelector("#line-up"),
            center: document.querySelector("#line-center"),
            down: document.querySelector("#line-down"),
            "down-small" : document.querySelector("#line-down-small")
        };

        this.tcasMessage = {
            "alt": document.querySelector("#alt"),
            "alt-tcas" : document.querySelector("#alt-tcas"),
            "tcas-start" : document.querySelector("#tcas-start"),
            "tcas" : document.querySelector("#tcas"),
            "tcas-speed" : document.querySelector("#tcas-speed"),
            "tcas-speed-alt" : document.querySelector("#tcas-speed-alt"),
            "tcap-start" : document.querySelector("#tcap-start"),
            "tcap" : document.querySelector("#tcap")
        }

    }

    reloadHeight() {
        this.heightSettings.innerHTML = `<span>FL${leftHeightSetter.firstDigit.dataset.digit + leftHeightSetter.secondDigit.dataset.digit + leftHeightSetter.thirdDigit.dataset.digit}</span>`
    }

    reloadSpeed(){
        this.speedSettings.querySelector("#up-speed").textContent = `\u00A0${leftSpeedSetter.firstDigit.dataset.digit + leftSpeedSetter.secondDigit.dataset.digit}`; 
        this.speedSettings.querySelector("#down-speed").textContent = `-${leftSpeedSetter.firstDigit.dataset.digit + leftSpeedSetter.secondDigit.dataset.digit}`; 
    }

    changeSpeedLine(diraction) {
        for (let key in this.speedLines) {
            if (key == diraction) {
                this.speedLines[key].style.display = "block";
            } else {
                this.speedLines[key].style.display = "none";
            }
        }
    }

    changeTcasMessage(message) {
        for (let key in this.tcasMessage) {
            if (key == message) {
                this.tcasMessage[key].style.display = "block";
            } else {
                this.tcasMessage[key].style.display = "none";
            }
        }
    }
}

class Monitor {
    constructor() {
        this.marker = document.querySelector(".monitor-marker");
        this.markerText = document.querySelector(".marker-text");
        this.speed = document.querySelector(".horizont-speed-settings");
        this.markerShape = {
            "diamondNF": document.querySelector("#diamondNF"),
            "diamond": document.querySelector("#diamond"),
            "circle": document.querySelector("#circle"),
            "square": document.querySelector("#square")
        };
    }

    animateMarker(time, HEIGHT_END, RIGHT_END) {
        // const HEIGHT_END = 300,
        //       RIGHT_END = 190;


        let totalHeight = Math.abs(+this.marker.style.top.slice(0, -2) - HEIGHT_END);
        let totalRight = Math.abs(+this.marker.style.right.slice(0, -2) - RIGHT_END);
        const stepHeight = Math.ceil(totalHeight * 1000 / time);
        const stepRight = Math.ceil(totalRight * 1000/ time);

        let currentHeight = +(this.marker.style.top.slice(0, -2));
        let id = setTimeout( function repeat() {
            const leftMonitorMarker = document.querySelector(".monitor-marker")
            //hard-code for left planne ONLY
            leftMonitorMarker.style.top = +leftMonitorMarker.style.top.slice(0, -2) + stepHeight + "px";
            leftMonitorMarker.style.right = +leftMonitorMarker.style.right.slice(0, -2) + stepRight + "px";

            if (+leftMonitorMarker.style.top.slice(0, -2) > 380) {
                leftMonitorMarker.style.display = "none"
            }

            if ((+leftMonitorMarker.style.top.slice(0, -2) < HEIGHT_END) || (+leftMonitorMarker.style.right.slice(0, -2) < RIGHT_END)) {
                id = setTimeout(repeat, 1000);
            }      
        }, 1000);
    }

    reloadNumber(number, color="white", arrow = "none") {
        let text = `${number}`;
        this.markerText.style.color = color;
        
        
        if (arrow == "up") {
            this.markerText.innerHTML = `<span>${text}&#8593</span>`;
        } else if (arrow == "down") {
            this.markerText.innerHTML = `<span>${text}&#8595</span>`;
        } else {
            this.markerText.innerHTML = `<span>${text}</span>`;
        }

        
    }

    changeMarkerShape(shape) {
        for (let key in this.markerShape) {
            if (key == shape) {
                this.markerShape[key].style.display = "block";
            } else {
                this.markerShape[key].style.display = "none";
            }
        }
    }

    startSpeedChanging(time) {
        const speedTable = document.querySelectorAll(".monitor-speed-item");
        let counter = Math.ceil(time / 500);
        let randomDigit;
        let id = setTimeout( function repeat() {
            randomDigit = getRandomInt();
            speedTable.forEach((element) => {
                element.textContent = +element.textContent + randomDigit;
            });

            counter--;

            if (counter) {
                id = setTimeout(repeat, 500);
            }      
        }, 500);


    }

    // reloadSpeed(){
    //     this.speedSettings.querySelector("#up-speed").textContent = `\u00A0${leftSpeedSetter.firstDigit.dataset.digit + leftSpeedSetter.secondDigit.dataset.digit}`; 
    //     this.speedSettings.querySelector("#down-speed").textContent = `-${leftSpeedSetter.firstDigit.dataset.digit + leftSpeedSetter.secondDigit.dataset.digit}`; 
    // }


}


const leftMonitor = new Monitor();

const leftPlane = new Airbus(".left-plane");
const rightPlane = new Airbus(".right-plane");

const leftHorizont = new Horizont();

    //leftPlane.render(1300, 100, 2.5); // width | height | speed (0.5 long, 1 - center, 2 - start)
    //rightPlane.start(1300, 100, 2.5); //Height - высчитываем процент  высоты на пульте от настроенной высоты получеем коэф, на который умножим 150 (получим макс высоту)
    //исправить скорость движения (самолет при низкой скорости наборе высоты начинает ускорятся) 
    // инициализировать кнопку restart
// });

const flightDiraction = document.querySelector(".outside-horizont");
const horizontMode = document.querySelector(".tcas-panel");

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
        currentHeight = Math.floor(Math.sqrt(40*currentWidth));

        //выключил привязку к настроенным параметрам скорости
        //currentHeight = Math.floor(Math.sqrt(70*currentWidth * Math.abs(speed)));
    
        if (currentHeight > maxHeight)  {
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

h1.textContent = "FL" + 11500;  
h2.textContent = "FL" + 10500;

//настройка уровней высоты динамическая

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
    let k = 65 / 150; //добавочный коэффициент для преодоления блока buffer (разняться из-за модели самолета (хвост выше))
    if (heightSettings * 100 > heightLevel) {
        return ((heightSettings * 100) / heightLevel + k); //
    }
    
    
    return ((heightSettings * 100) / heightLevel); //находим какой процент от ровня высоты составляет текущая настройка
    // height settings X1000 (настройки исчисляются в КМ)
}

function calculateHeightPercentLeft(heightSettings, H1, H2) {
    let k = 55 / 150; //добавочный коэффициент для преодоления блока buffer
    if (heightSettings * 100 < H1) {
        return Math.abs(H1 + H2 - heightSettings * 100) / H2 + k; //
    }
    
    return Math.abs(H1 + H2 - heightSettings * 100) / H2; 
}    

//Кнопка TA mode
buttonTA.addEventListener("click", () => {
    if (leftPlane.animation?.playState == "running" || rightPlane.animation?.playState == "running" || 
        leftPlane.animation?.playState == "paused" || rightPlane.animation?.playState == "paused") { //если анимация запущена - не запускать по новой
        return;
    }


    if (buttonTA.dataset.state == "off") {
        document.querySelector("#ta-on-button").style.display = "block";
        document.querySelector("#ta-off-button").style.display = "none";
        buttonTA.setAttribute("data-state", "on");
    } else {
        document.querySelector("#ta-on-button").style.display = "none";
        document.querySelector("#ta-off-button").style.display = "block";
        buttonTA.setAttribute("data-state", "off");
    }
});

//Кнопка TCAP mode
buttonTCAP.addEventListener("click", () => {
    if (leftPlane.animation?.playState == "running" || rightPlane.animation?.playState == "running" || 
        leftPlane.animation?.playState == "paused" || rightPlane.animation?.playState == "paused") { //если анимация запущена - не запускать по новой
        return;
    }


    if (buttonTCAP.dataset.state == "off") {
        document.querySelector("#tcap-on").style.display = "block";
        document.querySelector("#tcap-off").style.display = "none";
        buttonTCAP.setAttribute("data-state", "on");
    } else {
        document.querySelector("#tcap-on").style.display = "none";
        document.querySelector("#tcap-off").style.display = "block";
        buttonTCAP.setAttribute("data-state", "off");
    }
});

//Кнопка Старт
document.querySelector("#start-button").addEventListener("mouseover", () => { //наведение мыши на START применяет новые параметры
    rightHeightSetter.save();
    rightSpeedSetter.save();
    leftHeightSetter.save();
    leftSpeedSetter.save();

    leftPlane.changeSettings(calculateHeightPercentLeft(leftHeightSetter.height, +h1.textContent.slice(2), +h2.textContent.slice(2) ) * 145, leftSpeedSetter.speed / 10);
    
    rightPlane.changeSettings(calculateHeightPercent(rightHeightSetter.height, +h2.textContent.slice(2) ) * 135, rightSpeedSetter.speed / 10);
});


//кнопка play
playButton = document.querySelector(".play-button");
document.querySelector("#start-button").addEventListener("click", () => {   
    if (leftPlane.animation?.playState == "running" || rightPlane.animation?.playState == "running" || 
        leftPlane.animation?.playState == "paused" || rightPlane.animation?.playState == "paused") { //если анимация запущена - не запускать по новой
        return;
    }

    if ((+leftHeightSetter.height * 100 >= +h1.textContent.slice(2) + +h2.textContent.slice(2)) && (+leftSpeedSetter.speed < 0) || //current > start but speed < 0
        (+leftHeightSetter.height * 100 <= +h1.textContent.slice(2) + +h2.textContent.slice(2)) && (+leftSpeedSetter.speed > 0) || //current < start but speed > 0
        (+leftHeightSetter.height * 100 != +h1.textContent.slice(2) + +h2.textContent.slice(2)) && (+leftSpeedSetter.speed == 0)){ //current = start but speed != 0
            throw "Error (leftPlane): Height and Speed don`t match each other";
    }

    if ((+rightSpeedSetter.speed < 0) || //start == 0 (default) but speed < 0
        (+rightHeightSetter.height == 0) && (+rightSpeedSetter.speed > 0) || //current == start but speed > 0
        (+rightHeightSetter.height != 0) && (+rightSpeedSetter.speed == 0)) { //current != start but speed == 0
            throw "Error (rightPlane): Height and Speed don`t match each other";
    }   

    leftPlane.start();
    rightPlane.start();
    
    changeHorizontDiraction("down");
    leftHorizont.changeSpeedLine("down");

    const TIME_FLIGHT_UP = leftPlane.time / 4;

    //Horizont height animation
    let horizontCurrentHeightText = document.querySelector(".horizont-height-current span");
    let horizontSettingsHeightText = document.querySelector(".horizont-height-settings span");

    changeHorizontCurrentHeightDown(horizontCurrentHeightText, horizontSettingsHeightText, TIME_FLIGHT_UP);

    setTimeout(() => {
        leftMonitor.changeMarkerShape("diamond");
        leftMonitor.reloadNumber(-12);
    }, leftPlane.time / 15);

    setTimeout(() => {
        if ((flightDiraction.dataset.position == "down") && (buttonTCAP.dataset.state == "off")) {
            changeHorizontDiraction("straight");
            leftHorizont.changeSpeedLine("center");
        } else if ((flightDiraction.dataset.position == "down") && (buttonTCAP.dataset.state == "on")) {
            setTimeout(() => {
                changeHorizontDiraction("straight");
                leftHorizont.changeSpeedLine("center");
            }, 8000);
        }
    }, TIME_FLIGHT_UP); //выравнивание горизонта



    if (Math.abs(leftHeightSetter.height - rightHeightSetter.height) * 100 == 1000) {
        
        if ((Math.abs(+leftSpeedSetter.speed) <= 15) && (+rightSpeedSetter.speed) <= 15) {

            leftMonitor.animateMarker(TIME_FLIGHT_UP + 5000, 400, 220);
            leftMonitor.startSpeedChanging(25000);

            setTimeout(() => {
                leftHorizont.changeTcasMessage("alt-tcas");
                playSound(trafficPath);
                leftMonitor.changeMarkerShape("circle");
                leftMonitor.reloadNumber(-11, "orange", "up");

            }, leftPlane.time / 5);
            
        } else if (buttonTCAP.dataset.state == "on" && ((Math.abs(+leftSpeedSetter.speed) > 15) || (+rightSpeedSetter.speed) > 15)) {

            //Monitor marker animation
            leftMonitor.animateMarker(TIME_FLIGHT_UP + 5000, 400, 220);
            leftMonitor.startSpeedChanging(25000);

            
            setTimeout(() => {
                // setTimeout(() => {
                    
                // }, 300)
                console.log("Trafic! Trafic! Claim! Claim!");

                const trafficPromise = new Promise( (resolve, reject) => {
                    playSound(trafficPath);
                    //меняется стрелка
                    leftHorizont.changeSpeedLine("down-small");

                    leftHorizont.changeTcasMessage("alt-tcas");
                    leftMonitor.changeMarkerShape("circle");
                    leftMonitor.reloadNumber(-11, "orange", "up");

                    //планирование
                    leftPlaneTcap();
                    rightPlaneTcap();
                    setTimeout(() => {
                        resolve();
                    }, 2900);
                });

                trafficPromise.then(() => {
                    
                    leftHorizont.changeTcasMessage("tcap-start");
                    //horizontTcasLineRed.style.display = "block";

                    //marker RED
                    // leftMonitor.reloadNumber(-10, "orange", "up");

                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve();
                        }, 1900);
                    });
                }).then(() => {
                    leftHorizont.changeTcasMessage("tcap");

                    setTimeout(() => {

                        }, 2000);

                    let fork = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve();
                        }, 2800);
                    });

                    fork.then(() => {
                        leftHorizont.changeTcasMessage("tcas-speed");
                        // playSound(clearPath);
                        return new Promise( (resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                            }, 1000);
                        });
                    }).then(() => {
                        leftHorizont.changeTcasMessage("tcas-speed-alt");
                        return new Promise( (resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                            }, 1000);
                        });
                    }).then(() => {
                        leftHorizont.changeTcasMessage("alt");
                    });
                });               

            }, leftPlane.time / 9);

        } else if (buttonTA.dataset.state == "on" && ((Math.abs(+leftSpeedSetter.speed) > 15) || (+rightSpeedSetter.speed))) {
            leftMonitor.animateMarker(TIME_FLIGHT_UP + 5000, 400, 220);
            leftMonitor.startSpeedChanging(25000);

            setTimeout(() => {
                leftHorizont.changeTcasMessage("alt-tcas");
                playSound(trafficPath);
                leftMonitor.changeMarkerShape("circle");
                leftMonitor.reloadNumber(-11, "orange", "up");

            }, leftPlane.time / 5);
        } else if ((Math.abs(+leftSpeedSetter.speed) > 15) || (+rightSpeedSetter.speed) > 15) {
            let currentLeftHeight = +leftHeightSetter.height * 100;
            let currentRightHeight = +rightHeightSetter.height * 100;

            //Monitor marker animation
            leftMonitor.animateMarker(TIME_FLIGHT_UP, 300, 190);
            leftMonitor.startSpeedChanging(TIME_FLIGHT_UP);

            
            setTimeout(() => {
                // setTimeout(() => {
                    
                // }, 300)
                console.log("Trafic! Trafic! Claim! Claim!");

                const trafficPromise = new Promise( (resolve, reject) => {
                    playSound(trafficPath);
                    leftHorizont.changeTcasMessage("alt-tcas");
                    leftMonitor.changeMarkerShape("circle");
                    leftMonitor.reloadNumber(-11, "orange", "up");
                    setTimeout(() => {
                        resolve();
                    }, 2900);
                });

                trafficPromise.then(() => {
                    playSound(claimPath);
                    leftHorizont.changeTcasMessage("tcas-start");
                    horizontTcasLineRed.style.display = "block";

                    //marker RED
                    leftMonitor.changeMarkerShape("square");
                    leftMonitor.reloadNumber(-10, "red", "up");

                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve();
                        }, 1900);
                    });
                }).then(() => {
                    leftPlane.pause();
                    rightPlane.pause();
                    leftHorizont.changeTcasMessage("tcas");

                    playButton.style.cssText = `
                        display: block;
                        cursor: pointer;
                    `;
                    
                    playButton.addEventListener("mouseover", () => {
                        leftHeightSetter.save();
                        leftSpeedSetter.save();    
                        rightHeightSetter.save();
                        rightSpeedSetter.save();
                    });    

                    playButton.addEventListener("click", () => {
                        if ((+rightSpeedSetter.speed * 100 > -3000) || (+rightHeightSetter.height * 100 >= currentRightHeight)) //(+rightHeightSetter.height == 0) //current == start but speed > 0 
                        {
                            throw "Error (rightPlane): Speed or Height are incorrect";
                        }   

                        if ((+leftSpeedSetter.speed * 100 < 3000) || (+leftHeightSetter.height * 100 <= currentLeftHeight)) {
                            throw "Error (leftPlane): Speed or Height are incorrect";
                        }

                        changeHorizontDiraction("up");
                        leftHorizont.changeSpeedLine("up");

                        let horizontSettingsHeightText = document.querySelector(".horizont-height-settings span");//переназначаем, тк обновляется все внутри, включая span
                        changeHorizontCurrentHeightUp(horizontCurrentHeightText, horizontSettingsHeightText, 2000);

                        leftMonitor.animateMarker(TIME_FLIGHT_UP, 385, 220);
                        leftMonitor.startSpeedChanging(TIME_FLIGHT_UP + 15000);

                        setTimeout(() => {
                            changeHorizontDiraction("straight");
                            leftHorizont.changeSpeedLine("center");

                            leftMonitor.reloadNumber(-13, "red", "down");
                        }, 2000);

                        playManualSettings();
                        horizontTcasLineRed.style.display = "none"; //выключить красную полосу
                        playButton.removeEventListener("click", () => playManualSettings());

                        let fork = new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                            }, 1800);
                        });

                        fork.then(() => {
                            leftHorizont.changeTcasMessage("tcas-speed");
                            playSound(clearPath);
                            return new Promise( (resolve, reject) => {
                                setTimeout(() => {
                                    resolve();
                                }, 1000);
                            });
                        }).then(() => {
                            leftHorizont.changeTcasMessage("tcas-speed-alt");
                            return new Promise( (resolve, reject) => {
                                setTimeout(() => {
                                    resolve();
                                }, 1000);
                            });
                        }).then(() => {
                            leftHorizont.changeTcasMessage("alt");
                        });
                    });
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                            }, 300);
                        });
                }).then(() => {
                    alert("Минимально допустимая вертикальная скорость для ухода от столкновения: 3000");
                });
                
                
    
            }, leftPlane.time / 9);

        }
    } else {
        leftMonitor.animateMarker(TIME_FLIGHT_UP + 5000, 400, 220);
        leftMonitor.startSpeedChanging(25000);
    }

});


//Кнопка Рестарт
document.querySelector("#restart-button").addEventListener("click", () => {
    leftPlane.end();
    leftPlane.plane.style.top = "0";

    rightPlane.end();
    rightPlane.plane.style.bottom = "0";
});

//tcas functions
function playManualSettings() {
    playButton.style.cssText = `
    display: none;
    cursor: default;
    `;

    leftPlaneUp();
    rightPlaneUp();
    leftPlane.play();
    rightPlane.play();
}


function leftPlaneUp() {
    let pos = +leftPlane.plane.style.top.slice(0, -2) - 1;

    leftPlane.plane.style.top = pos + "px";

    if (Math.abs(pos) < 100) {
        requestAnimationFrame(leftPlaneUp);
    }
}


function rightPlaneUp() {
    let pos = +rightPlane.plane.style.bottom.slice(0, -2) - 1;

    rightPlane.plane.style.bottom = pos + "px";

    if (Math.abs(pos) < 100) {
        requestAnimationFrame(rightPlaneUp);
    }
}

let leftPlaneTcapCounter = 0;
let leftPlaneTcapReturn = false;
function leftPlaneTcap() {

    if (leftPlaneTcapReturn) {
        let pos = +leftPlane.plane.style.top.slice(0, -2) + 1;

        if ((leftPlaneTcapCounter % 30 == 0)) {
            leftPlane.plane.style.top = pos + "px";
        }
        
        leftPlaneTcapCounter++;
        
    } else {
        let pos = +leftPlane.plane.style.top.slice(0, -2) - 1;

        if (leftPlaneTcapCounter % 10 == 0) {
            leftPlane.plane.style.top = pos + "px";
        }
    
        leftPlaneTcapCounter++;
    }



    if (leftPlaneTcapCounter < 300) {
        requestAnimationFrame(leftPlaneTcap);
    } else if (leftPlaneTcapCounter < 1000){
        leftPlaneTcapReturn = true;
        requestAnimationFrame(leftPlaneTcap);
    }
}

let rightPlaneTcapCounter = 0;
let rightPlaneTcapReturn = false;
function rightPlaneTcap() {

    if (rightPlaneTcapReturn) {
        let pos = +rightPlane.plane.style.bottom.slice(0, -2) + 1;

        if ((rightPlaneTcapCounter % 30 == 0)){
            rightPlane.plane.style.bottom = pos + "px";
        }
        
        rightPlaneTcapCounter++;
        
    } else if (!rightPlaneTcapReturn) {
        let pos = +rightPlane.plane.style.bottom.slice(0, -2) - 1;

        if (rightPlaneTcapCounter % 10 == 0) {
            rightPlane.plane.style.bottom = pos + "px";
        }
    
        rightPlaneTcapCounter++;
    }

    if (rightPlaneTcapCounter < 200) {
        requestAnimationFrame(rightPlaneTcap);
    } else if (rightPlaneTcapCounter < 1000) {
        rightPlaneTcapReturn = true;
        requestAnimationFrame(rightPlaneTcap);
    }
}

//sounds
function playSound(source) {
    let audio = new Audio(); // Создаём новый элемент Audio
    audio.src = source; // Указываем путь к звуку "клика"
    audio.autoplay = true; // Автоматически запускаем
  }

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

        leftHorizont.reloadSpeed();
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
    leftHorizont.reloadSpeed();

}

function incrDigitHeight(firstDigit, secondDigit, thirdDigit, maxDigit, table, step) {
    if ((firstDigit.dataset.digit == "0") && (secondDigit.dataset.digit == "0") && (thirdDigit.dataset.digit == "0")) {
        //create zeroes
        for (let i = 3; i < table.length; i++){
            table[i].innerHTML = `<img src="assets/images/nums/${table[i].dataset.digit}.png" alt="digit"></img>`;
        }
    }

    if (firstDigit.dataset.digit < maxDigit) {

        if (thirdDigit.dataset.digit == `${10 - step}`) {
            thirdDigit.setAttribute("data-digit", 0);
            thirdDigit.innerHTML = `<img src="assets/images/nums/${thirdDigit.dataset.digit}.png" alt="digit"></img>`;
            
            if (secondDigit.dataset.digit == `${10 - 1}`) {
                // перенос единицы в первый разряд
                secondDigit.setAttribute("data-digit", 0);
                secondDigit.innerHTML = `<img src="assets/images/nums/${secondDigit.dataset.digit}.png" alt="digit"></img>`;

                //добавление едининцы в старший разряд
                firstDigit.setAttribute("data-digit", +firstDigit.dataset.digit + 1);
                firstDigit.innerHTML = `<img src="assets/images/nums/${firstDigit.dataset.digit}.png" alt="digit"></img>`;
            } else {
                secondDigit.setAttribute("data-digit", +secondDigit.dataset.digit + 1);
                secondDigit.innerHTML = `<img src="assets/images/nums/${secondDigit.dataset.digit}.png" alt="digit"></img>`;
            }
            
        } else {
            thirdDigit.setAttribute("data-digit", +thirdDigit.dataset.digit + step);
            thirdDigit.innerHTML = `<img src="assets/images/nums/${thirdDigit.dataset.digit}.png" alt="digit"></img>`;
        }

    }
    leftHorizont.reloadHeight();

}

function decrDigitHeight(firstDigit, secondDigit, thirdDigit, minDigit, table, step) {
    if ((thirdDigit.dataset.digit > minDigit) || (secondDigit.dataset.digit > minDigit) || (firstDigit.dataset.digit > minDigit)){

        if (thirdDigit.dataset.digit == '0') {
            thirdDigit.setAttribute("data-digit", 10 - step);
            thirdDigit.innerHTML = `<img src="assets/images/nums/${thirdDigit.dataset.digit}.png" alt="digit"></img>`;
            
            //уменьшаем старший разряд #2
            if (secondDigit.dataset.digit == '0') {
                secondDigit.setAttribute("data-digit", 10 - 1);
                secondDigit.innerHTML = `<img src="assets/images/nums/${secondDigit.dataset.digit}.png" alt="digit"></img>`;
                
                firstDigit.setAttribute("data-digit", +firstDigit.dataset.digit - 1);
                
                if (firstDigit.dataset.digit == "0") {
                    firstDigit.innerHTML = ``; //убираем элемент
                } else {
                    firstDigit.innerHTML = `<img src="assets/images/nums/${firstDigit.dataset.digit}.png" alt="digit"></img>`;
                }
                
            } else {
                secondDigit.setAttribute("data-digit", +secondDigit.dataset.digit - 1);

                if ((secondDigit.dataset.digit == "0") && (firstDigit.dataset.digit == "0")){
                    secondDigit.innerHTML = ``;
                } else {
                    secondDigit.innerHTML = `<img src="assets/images/nums/${secondDigit.dataset.digit}.png" alt="digit"></img>`;
                }
                
            }
        }

        else {
            thirdDigit.setAttribute("data-digit", +thirdDigit.dataset.digit - step);
            thirdDigit.innerHTML = `<img src="assets/images/nums/${thirdDigit.dataset.digit}.png" alt="digit"></img>`;
        }

        // check if |00000| then del
        if ((firstDigit.dataset.digit == "0") && (secondDigit.dataset.digit == "0") && (thirdDigit.dataset.digit == "0")) {
            for (let i = 0; i < table.length - 1; i++){
                table[i].innerHTML = '';
            }
        } else if (firstDigit.dataset.digit == "0") {
            firstDigit.innerHTML = '';
        } 

        leftHorizont.reloadHeight();
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


//restart
function restart(){
    window.location.reload();
} 

//reload horizont
function changeHorizontDiraction(diraction){
    flightDiraction.setAttribute("data-position", diraction);
    flightDiraction.innerHTML = `<img src="assets/images/horizont-inside-${flightDiraction.dataset.position}.png" alt="horizont panel"></img>`
}

//currentHeightAnimation
function changeHorizontCurrentHeightDown(currentHeight, settingsHeight, time) {
    let totalHeight = Math.abs(+currentHeight.textContent - +settingsHeight.textContent.slice(2));
    const timeInterval = time / totalHeight;
    let id = setTimeout( function repeat() {
        currentHeight.textContent = +currentHeight.textContent - 1;
        if (+currentHeight.textContent != +settingsHeight.textContent.slice(2) ) {
            id = setTimeout(repeat, timeInterval);
        }      
    }, timeInterval);
}

function changeHorizontCurrentHeightUp(currentHeight, settingsHeight, time) {
    let totalHeight = Math.abs(+currentHeight.textContent - +settingsHeight.textContent.slice(2));
    const timeInterval = time / totalHeight;
    let id = setTimeout( function repeat() {
        currentHeight.textContent = +currentHeight.textContent + 1;
        if (+currentHeight.textContent != +settingsHeight.textContent.slice(2) ) {
            id = setTimeout(repeat, timeInterval);
        }      
    }, timeInterval);
}

//random [-3: 3]
function getRandomInt() {
    return Math.floor(Math.random() * 3) - 1;
}