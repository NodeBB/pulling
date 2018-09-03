# Pulling

Flexible slideout menu for mobile webapps

```js
const panel = document.querySelector('#panel');
const toggle = document.querySelectorAll('#toggle');
const menu = document.querySelector('#menu');

const pullin = Pulling.create({
  menu,
  panel,
});

toggle.addEventListener('click', () => pullin.toggle());
```

## Installation

Pulling is available on npm. 

 - `npm install pulling`
 - `yarn add pulling`

## Features

- Flicking gesture support
- Supports multiple slideout menus
- Standalone, dependency-free
- Simple markup
- Native scrolling
- Easy customization
- CSS transforms & transitions
- Two different display modes
- Just 10 Kb!

## Usage

You just need a panel for your main content and a menu element:

```html
<nav id="menu">
  <header>
    <h2>Menu</h2>
  </header>
</nav>

<main id="panel">
  <header>
    <h2>Panel</h2>
  </header>
</main>
```

Styling is simple, too. The library handles most things for you, so just add a background on your panel and menu, and add a `min-height` on the panel if you're using the reveal mode.

Then include Pulling and set up the menu.

```js
const panel = document.querySelector('#panel');
const menu = document.querySelector('#menu');

const pullin = Pulling.create({
  menu,
  panel,
});
```

See [test.html](test.html) for a full example.

### Browser Support

- Chrome (IOS, Android, desktop)
- Firefox (Android, desktop)
- Safari (IOS, Android, desktop)
- Opera (desktop)
- IE 10+ (desktop and mobile)

# API

## `Pulling.create(options)`
Creates a new `Pulling` instance

### `options`

+ **menu** - `Element`

  DOM element of menu

+ **panel** - `Element`

  DOM element of panel

+ **side** - `"left" | "right"` (default: `left`)

  side menu should display on

+ **mode** - `"drawer" | "reveal"` (default: `drawer`)

  whether the menu slide over the panel (`drawer`)
or the panel should slide to reveal the menu (`reveal`)

+ **margin** - `number` (default: `25`)

  the number of pixels from the edge of the viewport 
in which a touch event will be accepted

+ **timing** - `number` (default: `200`)

  milliseconds of the transition animation for opening and closing,
in the case where it isn't pulled out manually

+ **timingFunction** - `string` (default: `ease`)

  CSS3 transition timing function

+ **width** - `number` (default: `256`)

  width of menu in pixels

+ **sensitivity** - `number` (default: `0.25`)

  the speed needed to activate a flick

+ **slope** - `number` (default: `0.5`)

  maximum ratio of vertical touch movement to horizontal touch
movement that should be accepted

+ **touch** - `boolean` (default: `true`)

  Enable touch functionality

+ **ignoreScrollables** - `boolean` (default: `true`)

  Ignore horizontally scrollable elements

## Instance Methods

All methods are chainable

### `#open()`

Opens the menu. Emits `beforeopen` and `opened` events.

### `#close()`

Closes the menu. Emits `beforeclose` and `closed` events.

### `#toggle(condition?: boolean)`

Toggles the state of the menu (closed -> open, open -> closed). 

  + If `condition === true`, it opens the menu
  + If `condition === false`, it closes the menu

### `#on(eventName: string, handler: Function)`

Add an event handler for the event

### `#off(eventName: string, handler?: Function)`

Remove an event handler for the event, or remove all handlers for the event

### `#ignore(selector: string)`

Ignore touch events from a specific selector

### `#unignore(selector: string)`

Remove selector from ignore list. Will not override ignored selectors.

### `#disable()`

Disable all functionality of the menu

### `#enable()`

Enable the menu's functionality

### `#disableTouch()`

Disable touch event functionality for this menu

### `#enableTouch()`

Enable touch event functionality for this menu

## Events

+ `beforeclose`  
  Emitted before close begins, including when dragging closed with touch
+ `closed`  
  Emitted after close completes
+ `beforeopen`  
  Emitted before open begins, including when dragging open with touch
+ `opened`  
  Emitted after open completes
+ `touchstart`  
  Emitted when a touch movement begins
+ `touchmove`  
  Emitted on every movement due to touch
+ `touchend`  
  Emitted when a touch movement ends

You can use these to support multiple menus by disabling one when the other opens:
```js
pullinLeft.on('beforeopen', () => pullinRight.disableTouch());
pullinLeft.on('closed', () => pullinRight.enableTouch());
pullinRight.on('beforeopen', () => pullinLeft.disableTouch());
pullinRight.on('closed', () => pullinLeft.enableTouch());
```

## State

+ **`.state.closed`** - `boolean`
+ **`.state.closing`** - `boolean`
+ **`.state.open`** - `boolean`
+ **`.state.opening`** - `boolean`

## FAQ

### How do I prevent it from opening when scrolling through a carousel?

You can either use `.ignore(selector)` to add the specific element selector to the ignore list, or you can do `.ignore('[data-pullin-ignore]')` to add that selector the the list and then just add the `data-pullin-ignore` attribute to every element you want ignored.

### How do I add a toggle button?

```js
// vanilla js
document.querySelector('.toggle-menu').addEventListener('click', () => pullin.toggle());

// jQuery
$('.toggle-menu').on('click', () => pullin.toggle());
```

## How do I use two menus, one on each side?

You'll want to use events to keep one menu disabled while the other is open.

```js
pullinLeft.on('beforeopen', () => {
  pullinRight.close().disableTouch();
});
pullinLeft.on('closed', () => pullinRight.enableTouch());
pullinRight.on('beforeopen', () => {
  pullinLeft.close().disableTouch();
});
pullinRight.on('closed', () => pullinLeft.enableTouch());
```
