# TweenFramework

A powerful web animation framework with familiar game-engine style tweening API. Create smooth, performant animations with an intuitive system inspired by popular game engines.

## Features

- 🎯 **Familiar API** - Game-engine inspired tweening interface
- 🚀 **High Performance** - Uses requestAnimationFrame for smooth 60fps animations
- 🎨 **Rich Easing** - Linear, Quad, Sine, Bounce, Back with In/Out/InOut directions
- 📱 **Responsive** - Works on all modern browsers and devices
- 🎭 **Transform Support** - Animate position, rotation, scale with proper CSS transforms
- 🎪 **Event System** - Complete event handling (completed, paused, resumed, stepped)
- 📦 **Zero Dependencies** - Lightweight and self-contained

## Installation

```bash
npm install tweenframework-web
```

## Quick Start

```javascript
// For Node.js/CommonJS
const TweenFramework = require('tweenframework-web');

// For ES6 modules (if using a bundler)
import TweenFramework from 'tweenframework-web';

// For browser (direct script tag)
// <script src="path/to/TweenFramework.js"></script>
// TweenFramework is available globally

// Get your element
const element = document.getElementById('myElement');

// Create a tween with familiar game-engine style API
const tween = TweenFramework.create(element, {
    duration: 2,
    easingStyle: 'Bounce',
    easingDirection: 'Out'
}, {
    x: 300,
    y: 100,
    rotation: 45,
    scale: 1.5
});

// Play the animation
tween.play();
```

## Supported Properties

### Transform Properties
- `x`, `y` - Position (pixels)
- `rotation` - Rotation (degrees)
- `scale` - Uniform scale
- `scaleX`, `scaleY` - Individual axis scaling

### CSS Properties
- `opacity` - Transparency (0-1)
- `width`, `height` - Dimensions (pixels)
- `backgroundColor` - Background color
- `color` - Text color

### Easing Styles
- `Linear` - Constant speed
- `Quad` - Quadratic easing
- `Sine` - Sinusoidal easing
- `Bounce` - Bouncing effect
- `Back` - Overshoot and return

### Easing Directions
- `In` - Ease into the animation
- `Out` - Ease out of the animation
- `InOut` - Ease both in and out

## API Reference

### TweenFramework.create(element, tweenInfo, goalProperties)

Creates a new tween object with a familiar game-engine style API.

**Parameters:**
- `element` - The DOM element to animate
- `tweenInfo` - Animation configuration object
- `goalProperties` - Object containing target property values

**TweenInfo Properties:**
```javascript
{
    duration: 1,              // Animation duration in seconds
    easingStyle: 'Quad',      // Easing function name
    easingDirection: 'Out',   // 'In', 'Out', or 'InOut'
    repeatCount: 0,           // Number of repeats (0 = no repeat)
    reverses: false,          // Whether to reverse on repeat
    delayTime: 0              // Delay before starting (seconds)
}
```

### Quick Methods

```javascript
// Quick tween with minimal setup
TweenFramework.to(element, { x: 100, opacity: 0.5 }, 1);
```

### Tween Methods

```javascript
tween.play()      // Start the animation
tween.pause()     // Pause the animation
tween.resume()    // Resume from pause
tween.cancel()    // Cancel the animation
```

### Properties

```javascript
tween.isPlaying   // Boolean - is currently playing
tween.isPaused    // Boolean - is currently paused
```

### Events

```javascript
// Listen for completion
const connection = tween.completed.connect(() => {
    console.log('Animation finished!');
});

// Other events
tween.paused.connect(() => console.log('Paused'));
tween.resumed.connect(() => console.log('Resumed'));
tween.stepped.connect((progress) => console.log('Progress:', progress));

// Disconnect when done
connection.disconnect();
```

## Examples

### Basic Position Animation
```javascript
const tween = TweenFramework.create(element, {
    duration: 1,
    easingStyle: 'Quad',
    easingDirection: 'Out'
}, {
    x: 200,
    y: 100
});

tween.play();
```

### Complex Multi-Property Animation
```javascript
const tween = TweenFramework.create(element, {
    duration: 2,
    easingStyle: 'Back',
    easingDirection: 'InOut'
}, {
    x: 300,
    y: 200,
    rotation: 360,
    scale: 1.5,
    opacity: 0.8,
    backgroundColor: '#ff6b6b'
});

tween.completed.connect(() => {
    console.log('Complex animation complete!');
});

tween.play();
```

### Quick Animation
```javascript
// Fade out quickly
TweenFramework.to(element, { opacity: 0 }, 0.5);

// Scale up with bounce
TweenFramework.to(element, { scale: 1.2 }, 1);
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- All modern mobile browsers

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Issues

Report bugs and feature requests at: https://github.com/Axl-Is-Coding/TweenFramework/issues
