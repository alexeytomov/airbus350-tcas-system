//Plane movement start

const rightPlane = document.querySelector(".right-plane");
const leftPlane = document.querySelector(".left-plane");

document.querySelector("button").addEventListener("click", () => {
    const rightPlaneAnimation = rightPlane.animate(
        createPoints(0, 0, 1300, 130, false), //END Y = 200PX - PLANE-MODEL-HEIGHT
        {
            duration: 5000,
            iteratuions: 1
        }
    );

    const leftPlaneAnimation = leftPlane.animate(
        createPoints(0, 0, 1300, 130, true), //END Y = 200PX - PLANE-MODEL-HEIGHT
        {
            duration: 5000,
            iteratuions: 1
        }
    );
    
});


function createPoints(startX, startY, endX, endY, isLeft) { //create points for movements like sqrt-graph
    let points = [];
    while (startX < endX) {
        startX += 25;
        startY = Math.floor(Math.sqrt(startX*25));
        
        if (startY > endY) {
            startY = endY;
        }
        if (isLeft){
            points.push({transform: `translate(${startX}px, ${startY}px)`});
        } else {
            points.push({transform: `translate(-${startX}px, -${startY}px)`});
        }
    }
    return points;
}







//Plane movement end