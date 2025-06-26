/**
 * TweenFramework - Roblox TweenService for the Web
 * Core implementation with basic tweening functionality
 */

class TweenFramework {
    static activeTweens = [];
    static isRunning = false;

    // Easing functions (Roblox-style)
    static easingFunctions = {
        Linear: {
            In: t => t,
            Out: t => t,
            InOut: t => t
        },
        Quad: {
            In: t => t * t,
            Out: t => t * (2 - t),
            InOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        },
        Sine: {
            In: t => 1 - Math.cos(t * Math.PI / 2),
            Out: t => Math.sin(t * Math.PI / 2),
            InOut: t => -(Math.cos(Math.PI * t) - 1) / 2
        },
        Bounce: {
            In: t => 1 - TweenFramework.easingFunctions.Bounce.Out(1 - t),
            Out: t => {
                if (t < 1/2.75) return 7.5625 * t * t;
                if (t < 2/2.75) return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
                if (t < 2.5/2.75) return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
                return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
            },
            InOut: t => t < 0.5 
                ? TweenFramework.easingFunctions.Bounce.In(t * 2) * 0.5
                : TweenFramework.easingFunctions.Bounce.Out(t * 2 - 1) * 0.5 + 0.5
        },
        Back: {
            In: t => 2.7 * t * t * t - 1.7 * t * t,
            Out: t => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2),
            InOut: t => t < 0.5
                ? (Math.pow(2 * t, 2) * (3.6 * 2 * t - 2.6)) / 2
                : (Math.pow(2 * t - 2, 2) * (3.6 * (2 * t - 2) + 2.6) + 2) / 2
        }
    };

    // Property mapping (friendly names to CSS)
    static propertyMap = {
        x: (value, element) => {
            const current = element._tweenTransform || {};
            current.x = value;
            element._tweenTransform = current;
            return TweenFramework.buildTransform(current);
        },
        y: (value, element) => {
            const current = element._tweenTransform || {};
            current.y = value;
            element._tweenTransform = current;
            return TweenFramework.buildTransform(current);
        },
        rotation: (value, element) => {
            const current = element._tweenTransform || {};
            current.rotation = value;
            element._tweenTransform = current;
            return TweenFramework.buildTransform(current);
        },
        scale: (value, element) => {
            const current = element._tweenTransform || {};
            current.scale = value;
            element._tweenTransform = current;
            return TweenFramework.buildTransform(current);
        },
        scaleX: (value, element) => {
            const current = element._tweenTransform || {};
            current.scaleX = value;
            element._tweenTransform = current;
            return TweenFramework.buildTransform(current);
        },
        scaleY: (value, element) => {
            const current = element._tweenTransform || {};
            current.scaleY = value;
            element._tweenTransform = current;
            return TweenFramework.buildTransform(current);
        },
        opacity: (value) => value,
        backgroundColor: (value) => value,
        color: (value) => value,
        width: (value) => `${value}px`,
        height: (value) => `${value}px`
    };

    // Build CSS transform string
    static buildTransform(transformObj) {
        let transform = '';
        
        if (transformObj.x !== undefined || transformObj.y !== undefined) {
            const x = transformObj.x || 0;
            const y = transformObj.y || 0;
            transform += `translate(${x}px, ${y}px) `;
        }
        
        if (transformObj.rotation !== undefined) {
            transform += `rotate(${transformObj.rotation}deg) `;
        }
        
        if (transformObj.scale !== undefined) {
            transform += `scale(${transformObj.scale}) `;
        } else if (transformObj.scaleX !== undefined || transformObj.scaleY !== undefined) {
            const scaleX = transformObj.scaleX || 1;
            const scaleY = transformObj.scaleY || 1;
            transform += `scale(${scaleX}, ${scaleY}) `;
        }
        
        return transform.trim();
    }

    // Main create method (Roblox TweenService.Create equivalent)
    static create(element, tweenInfo, goalProperties) {
        return new Tween(element, tweenInfo, goalProperties);
    }

    // Quick creation method
    static to(element, goalProperties, duration = 1) {
        return new Tween(element, { duration }, goalProperties);
    }

    // Start the animation loop
    static startAnimationLoop() {
        if (TweenFramework.isRunning) return;
        
        TweenFramework.isRunning = true;
        
        function loop() {
            const now = performance.now();
            
            // Update all active tweens
            TweenFramework.activeTweens = TweenFramework.activeTweens.filter(tween => {
                return tween.update(now);
            });
            
            // Continue loop if we have active tweens
            if (TweenFramework.activeTweens.length > 0) {
                requestAnimationFrame(loop);
            } else {
                TweenFramework.isRunning = false;
            }
        }
        
        requestAnimationFrame(loop);
    }

    // Add tween to active list
    static addActiveTween(tween) {
        TweenFramework.activeTweens.push(tween);
        TweenFramework.startAnimationLoop();
    }
}

// Event system (Roblox-style)
class TweenEvent {
    constructor() {
        this.connections = [];
    }

    connect(callback) {
        const connection = { callback, connected: true };
        this.connections.push(connection);
        
        return {
            disconnect: () => {
                connection.connected = false;
                this.connections = this.connections.filter(conn => conn.connected);
            }
        };
    }

    fire(...args) {
        this.connections.forEach(connection => {
            if (connection.connected) {
                connection.callback(...args);
            }
        });
    }
}

// Main Tween class
class Tween {
    constructor(element, tweenInfo, goalProperties) {
        this.element = element;
        this.tweenInfo = {
            duration: tweenInfo.duration || 1,
            easingStyle: tweenInfo.easingStyle || 'Quad',
            easingDirection: tweenInfo.easingDirection || 'Out',
            repeatCount: tweenInfo.repeatCount || 0,
            reverses: tweenInfo.reverses || false,
            delayTime: tweenInfo.delayTime || 0
        };
        this.goalProperties = goalProperties;
        
        // State
        this.playbackState = 'Begin';
        this.startTime = 0;
        this.pausedTime = 0;
        this.currentRepeat = 0;
        
        // Events (Roblox-style)
        this.completed = new TweenEvent();
        this.paused = new TweenEvent();
        this.resumed = new TweenEvent();
        this.stepped = new TweenEvent();
        
        // Store initial values
        this.startValues = {};
        this.setupStartValues();
    }

    setupStartValues() {
        const computedStyle = window.getComputedStyle(this.element);
        
        for (const property in this.goalProperties) {
            switch (property) {
                case 'x':
                    this.startValues.x = this.element._tweenTransform?.x || 0;
                    break;
                case 'y':
                    this.startValues.y = this.element._tweenTransform?.y || 0;
                    break;
                case 'rotation':
                    this.startValues.rotation = this.element._tweenTransform?.rotation || 0;
                    break;
                case 'scale':
                    this.startValues.scale = this.element._tweenTransform?.scale || 1;
                    break;
                case 'scaleX':
                    this.startValues.scaleX = this.element._tweenTransform?.scaleX || 1;
                    break;
                case 'scaleY':
                    this.startValues.scaleY = this.element._tweenTransform?.scaleY || 1;
                    break;
                case 'opacity':
                    this.startValues.opacity = parseFloat(computedStyle.opacity) || 1;
                    break;
                case 'width':
                    this.startValues.width = this.element.offsetWidth;
                    break;
                case 'height':
                    this.startValues.height = this.element.offsetHeight;
                    break;
                default:
                    this.startValues[property] = computedStyle[property] || '';
            }
        }
    }

    play() {
        if (this.playbackState === 'Playing') return;
        
        this.playbackState = 'Playing';
        this.startTime = performance.now() + (this.tweenInfo.delayTime * 1000);
        
        TweenFramework.addActiveTween(this);
        
        if (this.pausedTime > 0) {
            this.resumed.fire();
        }
    }

    pause() {
        if (this.playbackState !== 'Playing') return;
        
        this.playbackState = 'Paused';
        this.pausedTime = performance.now();
        this.paused.fire();
    }

    cancel() {
        this.playbackState = 'Cancelled';
    }

    resume() {
        if (this.playbackState !== 'Paused') return;
        
        const pauseDuration = performance.now() - this.pausedTime;
        this.startTime += pauseDuration;
        this.pausedTime = 0;
        
        this.play();
    }

    update(currentTime) {
        if (this.playbackState !== 'Playing') {
            return this.playbackState !== 'Cancelled';
        }

        if (currentTime < this.startTime) {
            return true; // Still in delay phase
        }

        const elapsed = currentTime - this.startTime;
        const duration = this.tweenInfo.duration * 1000;
        let progress = Math.min(elapsed / duration, 1);

        // Apply easing
        const easingFunc = TweenFramework.easingFunctions[this.tweenInfo.easingStyle]?.[this.tweenInfo.easingDirection];
        if (easingFunc) {
            progress = easingFunc(progress);
        }

        // Update properties
        this.updateProperties(progress);
        
        // Fire stepped event
        this.stepped.fire(progress);

        // Check if completed
        if (elapsed >= duration) {
            this.handleCompletion();
            return false; // Remove from active tweens
        }

        return true; // Keep in active tweens
    }

    updateProperties(progress) {
        for (const property in this.goalProperties) {
            const startValue = this.startValues[property];
            const goalValue = this.goalProperties[property];
            
            let currentValue;
            
            if (typeof startValue === 'number' && typeof goalValue === 'number') {
                currentValue = startValue + (goalValue - startValue) * progress;
            } else {
                // For non-numeric properties, just use goal value at the end
                currentValue = progress >= 1 ? goalValue : startValue;
            }
            
            // Apply the property using the property map
            const mapper = TweenFramework.propertyMap[property];
            if (mapper) {
                if (property === 'x' || property === 'y' || property === 'rotation' || property === 'scale' || property === 'scaleX' || property === 'scaleY') {
                    this.element.style.transform = mapper(currentValue, this.element);
                } else {
                    this.element.style[property] = mapper(currentValue, this.element);
                }
            } else {
                // Fallback for unmapped properties
                this.element.style[property] = currentValue;
            }
        }
    }

    handleCompletion() {
        this.playbackState = 'Completed';
        this.completed.fire();
    }

    // Getters for state checking (Roblox-style)
    get isPlaying() {
        return this.playbackState === 'Playing';
    }

    get isPaused() {
        return this.playbackState === 'Paused';
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TweenFramework;
} else if (typeof window !== 'undefined') {
    window.TweenFramework = TweenFramework;
              }
