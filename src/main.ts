import './style.css'

const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth
canvas.height = window.innerHeight


// let gradient = ctx?.createLinearGradient(0, canvas.height, canvas.width, canvas.height)

let gradient = ctx?.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, canvas.width / 2)

gradient?.addColorStop(0, 'red');
gradient?.addColorStop(0.2, 'yellow');
gradient?.addColorStop(0.4, 'green');
gradient?.addColorStop(0.6, 'cyan');
gradient?.addColorStop(0.8, 'blue');
gradient?.addColorStop(1, 'magenta');

class Symbol {
    characters: string;
    x: number;
    y: number;
    fontSize: number;
    text: string;
    canvasHeight: number

    constructor(x: number, y: number, fontSize: number, canvasHeight: number) {
        this.characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        this.x = x
        this.y = y
        this.fontSize = fontSize
        this.text = ''
        this.canvasHeight = canvasHeight
    }

    draw(context: CanvasRenderingContext2D) {
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize)
        if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.95) {
            this.y = 0;
        } else {
            this.y += 1
        }
    }

}

class Effect {
    canvasWidth: number;
    canvasHeight: number;
    fontSize: number;
    columns: number;
    symbols: [Symbol] | []

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.fontSize = 25;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = []
        this.#initialize()
    }

    #initialize() {
        for (let i = 0; i < this.columns; i++) {
            this.symbols[i] = new Symbol(i, 0 - Math.floor(Math.random() * 120), this.fontSize, this.canvasHeight)
        }
    }
    resize(width: number, height: number) {
        this.canvasWidth = width
        this.canvasHeight = height
        this.columns = this.canvasWidth / this.fontSize
        this.symbols = []
        this.#initialize()
    }
}


const effect = new Effect(canvas.width, canvas.height)
let lastTime = 0;
const fps = 15;
const nextFrame = 1000 / fps;
let timer = 0;


const animate: FrameRequestCallback = (timeStamp) => {
    if (ctx !== null) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp

        if (timer > nextFrame) {
            ctx.fillStyle = 'rgba(0,0,0,0.05)'
            ctx.textAlign = "center"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = gradient!
            // ctx.fillStyle = "#00ff00" // for constant color of text
            ctx.font = effect.fontSize + 'px monospace';
            effect.symbols.forEach(symbol => symbol.draw(ctx));
            timer = 0
        } else {
            timer += deltaTime
        }

        requestAnimationFrame(animate)

    }
}

animate(0)

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    effect.resize(canvas.width, canvas.height)
})