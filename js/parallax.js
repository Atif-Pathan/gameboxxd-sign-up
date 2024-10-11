// Create a PixiJS application.
const app = new PIXI.Application();

window.onload = async function() {
    await setup();
    await preload();
};

async function setup()
{
    // Intialize the application.
    await app.init({ background: '#a254a2', resizeTo: window });

    app.stage.sortableChildren = true;

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);
}

async function preload()
{
    // Create an array of asset data to load.
    const assets = [
        { alias: 'mountain', src: 'art/running/back.png' },
        { alias: 'police1', src: 'art/running/police1.png' },
        { alias: 'police2', src: 'art/running/police2.png' },
        { alias: 'buildings', src: 'art/running/buildings.png' },
        { alias: 'palms', src: 'art/running/palms.png' },
        { alias: 'palmtree', src: 'art/running/palm-tree.png' },
        { alias: 'highway', src: 'art/running/highway-1.png' },
        { alias: 'car1', src: 'art/running/car-running1.png' },
        { alias: 'car2', src: 'art/running/car-running2.png' },
        { alias: 'car3', src: 'art/running/car-running3.png' },
        { alias: 'car4', src: 'art/running/car-running4.png' },
        { alias: 'car5', src: 'art/running/car-running5.png' },
    ];

    // Load the assets defined above.
    await PIXI.Assets.load(assets);

    // Create separate containers for different layers
    backgroundContainer = new PIXI.Container();
    carContainer = new PIXI.Container();
    foregroundContainer = new PIXI.Container();

    // Add containers to the stage in the correct rendering order
    app.stage.addChild(backgroundContainer);  // Backgrounds will be behind everything
    app.stage.addChild(carContainer);         // Cars will be in the middle
    app.stage.addChild(foregroundContainer);  // Foreground elements will be in front

    addScrollingBackground(app, backgroundContainer, 'mountain', 0.05, 1.1, -0.12); // Mountain texture, slow speed, covers 110% of the screen height
    const car = addRandomCar(app, carContainer, { leftToRight: 'police1', rightToLeft: 'police2' }, 2.8, 7000, 0.25, app.screen.height*0.45);
    addScrollingBackground(app, backgroundContainer, 'buildings', 0.15, 1, -0.1); // Buildings texture, faster speed, covers 70% of the screen height
    addScrollingBackground(app, foregroundContainer, 'palms', 0.35, 0.90, -0.05); // Palm trees texture, medium speed, covers 50% of the screen height
    addHighway(app, foregroundContainer);
    addCars(app, foregroundContainer);
}

// Function to add cars to the stage
// Function to add cars to the stage
function addCars(app, container) {
    // Create a container for cars
    const carContainer = new PIXI.Container();

    // Set the zIndex 
    // carContainer.zIndex = zIndex;

    container.addChild(carContainer); // Add the car container to the stage

    const carAssets = ['car1', 'car2', 'car3', 'car4', 'car5']; // List of preloaded car assets

    // Create the car sprite using the first asset
    const car = PIXI.Sprite.from(carAssets[0]); // Use 'car1' as initial frame

    // Set the anchor point to the bottom center of the sprite
    car.anchor.set(0.5, 1); // Center horizontally, bottom for vertical positioning

    // Scale the car based on screen height to keep it proportional
    const desiredCarHeight = app.screen.height / 7.5; // Make the car cover about 1/5th of the screen height
    const carScaleRatio = desiredCarHeight / car.texture.height;
    const carWidth = car.texture.width * carScaleRatio;

    car.width = carWidth;
    car.height = desiredCarHeight;

    // Position the car in the middle of the screen, just above the bottom
    car.x = app.screen.width * 0.25;
    car.y = app.screen.height * 0.91; // 50px above the bottom of the screen

    // Add the car sprite to the container
    carContainer.addChild(car);

    // Animation state variables
    let currentFrame = 0; // To track which image we're on
    const totalFrames = carAssets.length; // Total number of frames

    // Control frame rate
    let animationSpeed = 45; // Change frame every 17 ticks
    let frameCounter = 0; // To track the number of ticks

    // Use PIXI's ticker to create a loop for the animation
    app.ticker.add(() => {
        // Increment the frameCounter
        frameCounter++;

        // Change the car texture only if frameCounter reaches the animationSpeed
        if (frameCounter % animationSpeed === 0) {
            currentFrame = (currentFrame + 1) % totalFrames; // Loop through frames
            car.texture = PIXI.Texture.from(carAssets[currentFrame]); // Update texture
            car.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
    });
}

function addScrollingBackground(app, container, asset, scrollSpeed, desiredRatio, bottomOffsetRatio) {
    // Create containers for the two sets of background groups for seamless scrolling
    const group1 = new PIXI.Container();
    const group2 = new PIXI.Container();

    // Set the zIndex for both groups
    // group1.zIndex = zIndex;
    // group2.zIndex = zIndex;

    // Add both groups to the stage, behind other elements
    container.addChild(group1, group2);

    // Load the texture from the provided asset alias
    const texture = PIXI.Texture.from(asset);

    // Calculate the required scaling to cover the desired ratio of the screen height
    const desiredHeight = app.screen.height * desiredRatio;
    const scaleRatio = desiredHeight / texture.height;

    // Calculate the scaled width of the background sprite (after scaling by height)
    const scaledWidth = texture.width * scaleRatio;

    // Calculate how many sprites are needed to cover the screen width
    const exactNumSprites = app.screen.width / scaledWidth;

    // Round up to get the full number of sprites, and add one for overflow
    const numSprites = Math.ceil(exactNumSprites) + 1;

    // Calculate the total width of the group (including overflow)
    const totalGroupWidth = numSprites * scaledWidth;

    // Calculate the vertical position using the bottom offset ratio
    const bottomOffset = app.screen.height * bottomOffsetRatio;

    // Create the sprites for both groups
    for (let i = 0; i < numSprites; i++) {
        // Create sprite for group 1
        const sprite1 = new PIXI.Sprite(texture);
        sprite1.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // Disable smoothing
        sprite1.anchor.set(0, 1); // Anchor to bottom-left for better positioning
        sprite1.scale.set(scaleRatio); // Scale to maintain aspect ratio
        sprite1.x = i * scaledWidth;
        sprite1.y = app.screen.height - bottomOffset; // Position based on bottomOffset ratio

        // Create sprite for group 2
        const sprite2 = new PIXI.Sprite(texture);
        sprite2.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // Disable smoothing
        sprite2.anchor.set(0, 1); // Anchor to bottom-left for better positioning
        sprite2.scale.set(scaleRatio); // Scale to maintain aspect ratio
        sprite2.x = i * scaledWidth;
        sprite2.y = app.screen.height - bottomOffset; // Position based on bottomOffset ratio

        // Add the sprites to their respective groups
        group1.addChild(sprite1);
        group2.addChild(sprite2);
    }

    // Position the second group exactly after the first group, accounting for overflow
    group1.x = 0;
    group2.x = totalGroupWidth;

    // Use PIXI's ticker to animate the groups
    app.ticker.add(() => {
        // Move both groups to the left by the scroll speed
        group1.x -= scrollSpeed;
        group2.x -= scrollSpeed;

        // When group1 moves off screen, reset its position to the right of group2
        if (group1.x <= -totalGroupWidth) {
            group1.x = group2.x + totalGroupWidth;
        }

        // When group2 moves off screen, reset its position to the right of group1
        if (group2.x <= -totalGroupWidth) {
            group2.x = group1.x + totalGroupWidth;
        }
    });
}

function addRandomCar(app, container, policeAliases, scrollSpeed, minSpawnInterval, scaleRatio, spawnYPosition) {
    const cars = [];
    let lastSpawnTime = 0;
    let counter = 0;

    // Function to move the cars across the screen
    function moveCars() {
        cars.forEach((carContainer, index) => {
            // Adjust speed if the car is moving from right to left
            const speed = carContainer.direction === 'left' ? scrollSpeed * 1.5 : scrollSpeed; // 1.5x speed for left direction
            // Move the car based on its direction
            carContainer.x += carContainer.direction === 'left' ? -speed : speed;

            // Check if the car has gone off-screen (based on direction)
            if (
                (carContainer.direction === 'left' && carContainer.x + carContainer.width < 0) ||
                (carContainer.direction === 'right' && carContainer.x > app.screen.width)
            ) {
                // Remove the car once it moves off the screen
                container.removeChild(carContainer);
                cars.splice(index, 1); // Remove the car from the array

                // Start the spawn timer again after the car is removed
                lastSpawnTime = Date.now();
            }
        });
    }

    // Function to randomly spawn a car
    async function spawnCar() {
        // Create a new car container
        const carContainer = new PIXI.Container();

        // carContainer.zIndex = zIndex;

        // Randomly choose the direction (left to right or right to left)
        const direction = Math.random() < 0.5 ? 'left' : 'right';

        // Load the car texture based on the direction (using the alias)
        const carTexture = PIXI.Texture.from(direction === 'left' ? policeAliases.rightToLeft : policeAliases.leftToRight);
        const carSprite = new PIXI.Sprite(carTexture);  // Create a sprite from the loaded texture
        carSprite.anchor.set(0.5, 0.5); // Center the car

        // Set the scale of the car
        carSprite.scale.set(scaleRatio);

        // Set the car's initial position based on direction
        if (direction === 'left') {
            carContainer.x = app.screen.width + carSprite.width; // Start from the right and move left
        } else {
            carContainer.x = -carSprite.width; // Start from the left and move right
        }

        // Randomize a small vertical offset within a certain range
        const randomOffset = Math.random() * 40 - 40; // Small random offset (-10 to +10)

        // Set the car's Y position based on the given spawnYPosition and add a random offset
        carContainer.y = spawnYPosition + randomOffset;

        // Add the car sprite to the container
        carContainer.addChild(carSprite);

        // Store the direction in the container
        carContainer.direction = direction === 'left' ? 'left' : 'right';

        // Add the car container to the stage and store it in the array of cars
        container.addChild(carContainer);
        cars.push(carContainer);
    }

    // Function to handle spawning of cars based on time
    function checkSpawn() {
        const currentTime = Date.now();
        const timeSinceLastSpawn = currentTime - lastSpawnTime;

        // Ensure at least 5 seconds have passed since the last car was removed from the screen
        if (timeSinceLastSpawn >= minSpawnInterval) {
            spawnCar();
            lastSpawnTime = currentTime; // Reset the last spawn time when a car is spawned
        }
    }

    // PIXI ticker to check for spawning and move the cars
    app.ticker.add(() => {
        moveCars();    // Move the cars if they exist
        checkSpawn();  // Check if we should spawn a new car
    });
}

function addHighway(app, container) {
    // Create two background sprites for a seamless looping effect
    const background1 = PIXI.Sprite.from('highway');
    const background2 = PIXI.Sprite.from('highway');

    // background1.zIndex = zIndex;
    // background2.zIndex = zIndex;

    // Set the anchor to the bottom center of both sprites
    background1.anchor.set(0.5, 1);
    background2.anchor.set(0.5, 1);

    background1.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    background2.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Get the screen dimensions
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    // Scale the background to cover the screen height from the bottom up while maintaining aspect ratio
    const desiredHeight = screenHeight * 0.8; // Cover the full screen height
    const scaleRatio = desiredHeight / background1.texture.height;

    // Calculate the scaled width of the background after scaling by height
    const scaledBackgroundWidth = background1.texture.width * scaleRatio;

    // Calculate how many sprites are needed to cover the screen width
    const numBackgroundSprites = Math.ceil(screenWidth / scaledBackgroundWidth) + 1; // +1 for off-screen

    // Set the scaled width and height for both backgrounds
    background1.width = scaledBackgroundWidth;
    background1.height = desiredHeight;
    background1.scale.set(scaleRatio); // Maintain aspect ratio

    background2.width = scaledBackgroundWidth;
    background2.height = desiredHeight;
    background2.scale.set(scaleRatio); // Maintain aspect ratio

    // Position the first background in the center horizontally and at the bottom
    background1.x = screenWidth / 2;
    background1.y = screenHeight; // Align bottom of image with bottom of the screen

    // Position the second background immediately to the right of the first one
    background2.x = screenWidth / 2 + scaledBackgroundWidth;
    background2.y = screenHeight; // Align bottom of image with bottom of the screen

    // Add both backgrounds to the stage
    container.addChild(background1, background2);

    // Define the scroll speed for the background animation
    const scrollSpeed = 5;

    // Use PIXI's ticker to create the scrolling effect
    app.ticker.add(() => {
        // Move both backgrounds to the left by the scrollSpeed
        background1.x -= scrollSpeed;
        background2.x -= scrollSpeed;

        // When background1 moves off screen, reset it to the right of background2
        if (background1.x <= -scaledBackgroundWidth / 2) {
            background1.x = background2.x + scaledBackgroundWidth;
        }

        // When background2 moves off screen, reset it to the right of background1
        if (background2.x <= -scaledBackgroundWidth / 2) {
            background2.x = background1.x + scaledBackgroundWidth;
        }
    });
}
