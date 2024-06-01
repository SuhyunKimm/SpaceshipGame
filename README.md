# Spaceship Game

## Description
This program is a space shooter game created using the p5.js library, enhanced with the p5.play extension for easier sprite handling. The game features multiple states including a loading screen, main menu, main game, and leaderboard.

## Game Play Video


https://github.com/SuhyunKimm/SpaceshipGame/assets/126440237/aad23b58-919c-421f-b71d-136f0251a6f1



**Key Features:**
1. **Loading Screen**: Displays a loading animation with sound.
2. **Main Menu**: Allows the player to input their name and start the game. Background animations and music are included.
3. **Main Game**: The player controls a spaceship, shooting enemies and avoiding bombs. Various items like bonus shields and lives appear. Player actions are controlled via keyboard input.
4. **Leaderboard**: Displays the top 10 scores, updating with the player's score if it's high enough.

**Gameplay Elements:**
- **Enemies**: Various types of enemies with different images and scores. Enemies drop from the top of the screen.
- **Player**: The player has lives, a shield, and plasma shots as special weapons.
- **Items**: Bonus items appear periodically, providing extra lives or shields.
- **Sounds**: Includes background music, shooting sounds, game-over sound effects, and more.

**Game Loop**: The game loop updates the positions of all game elements, checks for collisions, and transitions between different states based on the game logic.

**User Interface**: Buttons are used for navigating between the main menu, game, and leaderboard, and an input field is used for entering the player's name.
