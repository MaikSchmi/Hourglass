const canvas = document.querySelector(".screen");
const ctx = canvas.getContext("2d");
console.log(canvas);

window.onload = () => {
    ctx.beginPath();
    ctx.fillRect(0, 0, canvas.width, canvas.height, "red");
    ctx.closePath();
};

