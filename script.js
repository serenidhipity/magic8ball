const answers = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];

const ball = document.getElementById('ball');
const answerDisplay = document.getElementById('answer');
const permissionBtn = document.getElementById('permission-btn');
const shakeBtn = document.getElementById('shake-btn');

let isShaking = false;
let lastUpdate = 0;
let x, y, z, lastX, lastY, lastZ;
const threshold = 15; // Shake threshold

function getAnswer() {
    if (isShaking) return;
    
    isShaking = true;
    ball.classList.add('shaking');
    answerDisplay.style.opacity = '0';

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * answers.length);
        answerDisplay.textContent = answers[randomIndex];
        answerDisplay.style.opacity = '1';
        ball.classList.remove('shaking');
        isShaking = false;
    }, 500);
}

function handleMotion(event) {
    const acceleration = event.accelerationIncludingGravity;
    const curTime = new Date().getTime();

    if ((curTime - lastUpdate) > 100) {
        const diffTime = curTime - lastUpdate;
        lastUpdate = curTime;

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > threshold) {
            getAnswer();
        }

        lastX = x;
        lastY = y;
        lastZ = z;
    }
}

async function requestPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
            const permissionState = await DeviceMotionEvent.requestPermission();
            if (permissionState === 'granted') {
                window.addEventListener('devicemotion', handleMotion, true);
                permissionBtn.classList.add('hidden');
            } else {
                alert("Permission denied. You can still use the button!");
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        // For non-iOS devices or older browsers
        window.addEventListener('devicemotion', handleMotion, true);
        permissionBtn.classList.add('hidden');
    }
}

permissionBtn.addEventListener('click', requestPermission);
shakeBtn.addEventListener('click', getAnswer);

// Check if motion is supported but doesn't require permission (Chrome Android)
window.addEventListener('devicemotion', (e) => {
    if (e.accelerationIncludingGravity.x !== null) {
        permissionBtn.classList.add('hidden');
    }
}, { once: true });
