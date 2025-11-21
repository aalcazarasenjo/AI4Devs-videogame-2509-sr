/**
 * game.js
 * Motor de juego F1 Prototype - Versión Ricardo Tormo (Cheste)
 * * Arquitectura:
 * - InputHandler: Gestión de eventos de teclado.
 * - Track: Define el trazado (Path2D) y lógica de meta/colisión.
 * - Car: Física newtoniana y predicción de movimiento.
 * - Game: Bucle principal (Game Loop) y gestión de estado.
 */

// ==========================================
// 🛠️ CONFIGURACIÓN GENERAL
// ==========================================
const CONFIG = {
    CANVAS_ID: 'gameCanvas',
    TRACK_WIDTH: 85, // Ancho de la pista en píxeles
    FPS_TARGET: 60
};

// ==========================================
// 🎮 CLASE: INPUT HANDLER
// ==========================================
class InputHandler {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        
        // Bindings
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    handleKey(e, isPressed) {
        // Mapeo WASD y Flechas
        switch(e.key) {
            case 'ArrowUp': case 'w': case 'W':
                this.keys.forward = isPressed; break;
            case 'ArrowDown': case 's': case 'S':
                this.keys.backward = isPressed; break;
            case 'ArrowLeft': case 'a': case 'A':
                this.keys.left = isPressed; break;
            case 'ArrowRight': case 'd': case 'D':
                this.keys.right = isPressed; break;
        }
    }
}

// ==========================================
// 🛣️ CLASE: TRACK (Circuito Ricardo Tormo)
// ==========================================
class Track {
    constructor() {
        // Definición de la línea de meta (Zona recta superior)
        this.finishLine = {
            x: 480,
            yStart: 40, // Ajustado al trazado superior
            yEnd: 140
        };
        
        this.isCarCrossing = false;
        this.path = new Path2D();
        
        // Inicializamos la geometría del circuito
        this.buildTrackGeometry();
    }

    buildTrackGeometry() {
        // Diseño aproximado de Cheste (Valencia) adaptado a 800x600
        // Sentido antihorario (hacia la izquierda en la recta superior)
        
        // 1. Inicio: Recta de meta (Parte superior derecha)
        this.path.moveTo(680, 90); 
        
        // 2. Recta hacia curva 1 (Aspar)
        this.path.lineTo(200, 90);

        // 3. Curva 1 y 2 (Doohan) - Giro cerrado a la izquierda bajando
        // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        this.path.bezierCurveTo(50, 90, 50, 250, 160, 250);

        // 4. Zona técnica interior (Curvas enlazadas)
        this.path.lineTo(240, 250); 
        this.path.bezierCurveTo(340, 250, 340, 380, 240, 380); // La "S"

        // 5. Curva de la afición (Curva amplia a derecha abajo)
        this.path.bezierCurveTo(80, 380, 80, 520, 300, 520);

        // 6. Recta de atrás
        this.path.lineTo(520, 520);

        // 7. Curva final (Adrián Campos) - Parabólica larga subiendo
        // Conecta la parte inferior con la recta de meta
        this.path.bezierCurveTo(780, 520, 780, 90, 680, 90);
        
        this.path.closePath();
    }

    draw(ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 1. Bordillos (Pianos) - Dibujamos primero más ancho
        ctx.strokeStyle = '#e74c3c'; // Rojo
        ctx.lineWidth = CONFIG.TRACK_WIDTH + 10;
        ctx.setLineDash([15, 15]);
        ctx.stroke(this.path);
        
        ctx.strokeStyle = '#ecf0f1'; // Blanco
        ctx.lineDashOffset = 15;
        ctx.stroke(this.path);
        
        // Reset dash
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        // 2. Asfalto - Dibujamos encima
        ctx.strokeStyle = '#34495e'; // Gris oscuro azulado
        ctx.lineWidth = CONFIG.TRACK_WIDTH;
        ctx.stroke(this.path);

        // 3. Línea de Meta
        this.drawFinishLine(ctx);
    }

    drawFinishLine(ctx) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.beginPath();
        // Dibujamos la línea verticalmente en la recta superior
        ctx.moveTo(this.finishLine.x, 50); // Aproximado visualmente dentro del asfalto
        ctx.lineTo(this.finishLine.x, 130);
        ctx.stroke();

        // Texto GRID
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.fillText("FINISH", this.finishLine.x + 5, 80);
        ctx.restore();
    }

    // Chequeo de colisión: ¿Está el punto dentro del asfalto?
    isPointOnTrack(ctx, x, y) {
        // Importante: Establecer el lineWidth igual al asfalto antes de preguntar
        // Usamos un ctx temporal o cambiamos y restauramos el actual si fuera necesario,
        // pero aquí asumimos que el ctx viene configurado o lo configuramos explícitamente.
        const previousWidth = ctx.lineWidth;
        ctx.lineWidth = CONFIG.TRACK_WIDTH;
        const isInside = ctx.isPointInStroke(this.path, x, y);
        ctx.lineWidth = previousWidth; // Restaurar por seguridad
        return isInside;
    }

    checkLap(car) {
        // Detección de cruce de meta
        // Cheste es antihorario (izquierda en recta de meta) -> Cos(angle) negativo
        const hitX = Math.abs(car.x - this.finishLine.x) < 15;
        const hitY = car.y > this.finishLine.yStart && car.y < this.finishLine.yEnd;
        const correctDirection = Math.cos(car.angle) < 0; 

        if (hitX && hitY && correctDirection) {
            if (!this.isCarCrossing) {
                this.isCarCrossing = true;
                return true; // ¡Nueva vuelta!
            }
        } else {
            this.isCarCrossing = false;
        }
        return false;
    }
}

// ==========================================
// 🏎️ CLASE: CAR
// ==========================================
// ==========================================
// 🏎️ CLASE: CAR (Manejo mejorado y Gráficos F1)
// ==========================================
// ==========================================
// 🏎️ CLASE: CAR (Corregida orientación y manejo)
// ==========================================
class Car {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        // Cambiamos nombres para que sea menos confuso
        this.length = 34; // Largo del coche (Eje X)
        this.width = 18;  // Ancho del coche (Eje Y)
        
        // Math.PI significa mirar a la IZQUIERDA (180 grados)
        // Como el dibujo base ahora mira a la derecha, esto lo girará correctamente.
        this.angle = Math.PI; 

        // --- FÍSICA AJUSTADA (Suave y pesada) ---
        this.speed = 0;
        this.maxSpeed = 7.0;
        this.acceleration = 0.10; // Aceleración progresiva
        this.friction = 0.05;     // Buen agarre
        this.turnSpeed = 0.035;   // Giro suave (poca sensibilidad)
    }

    update(input, track, ctx) {
        // 1. Velocidad
        if (input.keys.forward) this.speed += this.acceleration;
        if (input.keys.backward) this.speed -= this.acceleration;

        // Fricción y Stop
        if (this.speed > 0) this.speed -= this.friction;
        else if (this.speed < 0) this.speed += this.friction;
        if (Math.abs(this.speed) < this.friction) this.speed = 0;

        // Límites
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed/3) this.speed = -this.maxSpeed/3;

        // 2. Giro (Solo si se mueve y supera un umbral de velocidad)
        if (Math.abs(this.speed) > 0.3) {
            const flip = this.speed > 0 ? 1 : -1;
            if (input.keys.left) this.angle -= this.turnSpeed * flip;
            if (input.keys.right) this.angle += this.turnSpeed * flip;
        }

        // 3. Movimiento
        const nextX = this.x + Math.cos(this.angle) * this.speed;
        const nextY = this.y + Math.sin(this.angle) * this.speed;

        if (track.isPointOnTrack(ctx, nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        } else {
            // Rebote suave al chocar
            this.speed = -this.speed * 0.5;
        }
    }

    // --- DIBUJADO ORIENTADO AL EJE X (Mirando a la derecha) ---
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Colores
        const mainColor = '#c0392b'; // Rojo F1
        const secondaryColor = '#2c3e50'; // Negro/Azul
        const detailColor = '#ecf0f1'; // Blanco

        const l = this.length; // 34
        const w = this.width;  // 18

        // 1. Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 2, l/1.8, w/1.8, 0, 0, Math.PI*2);
        ctx.fill();

        // 2. Chasis (Dibujado horizontalmente: Nariz a la derecha)
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.moveTo(l/2, 0);       // Punta nariz (Derecha)
        ctx.lineTo(l/4, -w/4);    // Lado sup
        ctx.lineTo(0, -w/2);      // Pontón sup
        ctx.lineTo(-l/2.5, -w/2.5); // Trasera sup
        ctx.lineTo(-l/2.5, w/2.5);  // Trasera inf
        ctx.lineTo(0, w/2);       // Pontón inf
        ctx.lineTo(l/4, w/4);     // Lado inf
        ctx.closePath();
        ctx.fill();

        // 3. Cockpit (Centro)
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(-l/6, -w/4, l/3, w/2);

        // 4. Alerón Delantero (En la derecha extrema)
        ctx.fillStyle = detailColor;
        ctx.beginPath();
        ctx.moveTo(l/2 + 2, -w/2 - 2);
        ctx.lineTo(l/2 + 2, w/2 + 2);
        ctx.lineTo(l/2 + 5, w/2 + 2);
        ctx.lineTo(l/2 + 5, -w/2 - 2);
        ctx.fill();
        // Bigotes alerón
        ctx.fillStyle = mainColor;
        ctx.fillRect(l/2, -w/3, 2, w/1.5);

        // 5. Alerón Trasero (En la izquierda extrema)
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(-l/2, -w/2 + 2, 5, w - 4); // Soporte
        ctx.fillStyle = mainColor;
        ctx.fillRect(-l/2 - 3, -w/2, 4, w);     // Ala principal

        // 6. Ruedas (Negras)
        ctx.fillStyle = '#151515';
        const wheelL = 10; // Largo rueda
        const wheelW = 5;  // Ancho rueda
        
        // Delanteras (Derecha)
        ctx.fillRect(l/3, -w/2 - wheelW, wheelL, wheelW); // Sup
        ctx.fillRect(l/3, w/2, wheelL, wheelW);           // Inf

        // Traseras (Izquierda - Más gordas)
        ctx.fillRect(-l/2 + 5, -w/2 - wheelW - 1, wheelL+2, wheelW+1); // Sup
        ctx.fillRect(-l/2 + 5, w/2, wheelL+2, wheelW+1);               // Inf

        // 7. Casco Piloto
        ctx.fillStyle = '#f1c40f'; // Amarillo
        ctx.beginPath();
        ctx.arc(-2, 0, 3.5, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
    }
}

// ==========================================
// 🕹️ CLASE: GAME (Main Loop)
// ==========================================
class Game {
    constructor() {
        this.canvas = document.getElementById(CONFIG.CANVAS_ID);
        this.ctx = this.canvas.getContext('2d');
        
        this.input = new InputHandler();
        this.track = new Track();
        
        // Posición inicial: En la recta de meta, delante de la línea, mirando a izq.
        this.car = new Car(550, 90);

        this.lastTime = 0;
        
        // Estado del juego
        this.lapStartTime = 0;
        this.currentLapTime = 0;
        this.bestLapTime = Infinity;
        this.lapCount = 0; // Empezamos en vuelta 0 (Outlap)
        
        // UI References
        this.uiElements = {
            speed: document.getElementById('speed'),
            time: document.getElementById('current-time'),
            best: document.getElementById('best-time'),
            lap: document.getElementById('lap-count')
        };
    }

    start() {
        this.lapStartTime = performance.now();
        requestAnimationFrame((ts) => this.loop(ts));
    }

    formatTime(ms) {
        if (ms === Infinity) return "--:--.--";
        const totalSecs = Math.floor(ms / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const centis = Math.floor((ms % 1000) / 10);
        return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}.${centis.toString().padStart(2,'0')}`;
    }

    update(deltaTime) {
        // Actualizar física del coche (Pasamos ctx y track para colisiones)
        this.car.update(this.input, this.track, this.ctx);

        // Timer
        this.currentLapTime = performance.now() - this.lapStartTime;

        // Chequear Vuelta
        if (this.track.checkLap(this.car)) {
            this.handleLapFinish();
        }

        // Actualizar HUD
        this.updateHUD();
    }

    handleLapFinish() {
        if (this.lapCount > 0) { // Ignorar la primera vez que aparecemos (vuelta de calentamiento)
            if (this.currentLapTime < this.bestLapTime) {
                this.bestLapTime = this.currentLapTime;
                this.uiElements.best.innerText = this.formatTime(this.bestLapTime);
                this.uiElements.best.style.color = '#f1c40f'; // Resaltar en dorado
            }
        }
        
        this.lapCount++;
        this.uiElements.lap.innerText = this.lapCount;
        this.lapStartTime = performance.now(); // Reset timer
        console.log(`🏁 Vuelta ${this.lapCount} completada`);
    }

    updateHUD() {
        // Velocidad "Fake" visual (multiplicador arbitrario para parecer km/h)
        const speedDisplay = Math.abs(Math.round(this.car.speed * 40));
        this.uiElements.speed.innerText = speedDisplay;
        this.uiElements.time.innerText = this.formatTime(this.currentLapTime);
    }

    draw() {
        // Limpiar fondo (Césped)
        this.ctx.fillStyle = '#27ae60'; // Verde césped
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar Capas
        this.track.draw(this.ctx);
        this.car.draw(this.ctx);

        // TODO: Dibujar partículas o efectos visuales extra
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((ts) => this.loop(ts));
    }
}

// ==========================================
// 🚀 ARRANQUE
// ==========================================
window.onload = () => {
    const game = new Game();
    game.start();
    document.getElementById('game-status').innerText = "🟢 Pista libre - ¡A correr!";
};