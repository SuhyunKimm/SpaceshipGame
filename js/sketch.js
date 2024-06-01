"use strict";
const LOADING = 1;
const MAIN_MENU = 2;
const MAIN_GAME = 3;
const LEADERBOARD = 4;

// design
let font;
let video;
let bg_music;

// screen configurating
let currentState = LOADING;
let nextState = MAIN_MENU;

// variables for loading page
let loading_box_width = 230;
let loading_frame_count = 1;
let loading_started = false;
let starImg;
let loading_sound_played = false;

// variables for background images
let star_background_img;
let background_img;
let starbg_img_y = 0;
let main_menu_bg_img; 

// variables for sound
let shooting_sound;
let loading_sound;
let game_over_sound;
let bonus_sound;
let plasm_sound;
let main_menu_audio;
let main_menu_audio_started = false;
let game_play_audio;
let game_play_audio_started = false;
let game_over_sound_started = false;

// variables for buttons
let button_to_main_menu;
let button_to_play_again;
let button_to_main_game;

// variables for inputs
let input;
let input_present = true;

// variables for enemies
let enemyGroup; // num enemy type -> 5
let enemy_life_arr = [1,2,2,4]; 
let enemy_img_arr = [];
let enemy_arr = [];
let enemy_score = [10,15,15,20];
let current_enemy_score = [];
let enemy_num = 0;
let insect1_img; // = 2
let insect2_img; // = 2
let asteroid_medium_img; // = 4
let asteroid_small_img; // = 1
let enemy_enabled_count=0;
let waveArr = [];
let enemy_speed = 2;

// variables for bonus effects
let bonus_life_img;
let bonus_shield_img;
let shieldSprite;
let bonus_shield;
let bonus_life;

// json file
let rank_data;
let rank_arr = new Array(10);

let leaderboard_updated = false;
let user_rank = -1;

// variables for user;
let user_score = 0;
let user_name="";
let user_life = 3;
let user_shield = 1;
let user_plasm = 1;
let user_time = 60;
let user_time_count = 0;
let plasm_enabled = false;
let plasm_enabled_count = 0;
let shield_enabled = false;
let shield_enabled_count = 0;

let userSprite;
let userSpriteImg;
let laserGroup;
let laserImg;
let plasmGroup;
let plasmImg;
let shieldImg;
let heartImg;
let bombImg;

// variables for game over;
let game_over_delay_count = 0;
let game_over = false;

// this function is to process the json data
// to a group element and add the profile elements into one array
function process_json_data() {
    for(let i = 0;i<10;i++) {
        let data = rank_data[i];
        let index = data.rank-1;
        var profile = {
            id:data.user_id,
            rank:data.rank,
            country: data.country,
            name:data.display_name,
            points: Number(data.points)
        }
        rank_arr[index] = profile;
    }
}

// this function is to update the leader board data
// when new data comes in after the game is finished

function update_leaderboard_data() {
    let cnt = 0
    while(user_score<rank_arr[cnt].points) {
        cnt++;
    }
    for(let i = 9;i>cnt;i--) {
        var new_profile = {
            id:rank_arr[i-1].id,
            rank:rank_arr[i-1].rank,
            country: rank_arr[i-1].country,
            name: rank_arr[i-1].name,
            points: rank_arr[i-1].points
        }
        rank_arr[i] = new_profile;
    }
    var user_profile = {
        id:"123456768",
        rank:cnt,
        country:"au",
        name:user_name,
        points:user_score
    }
    rank_arr[cnt] = user_profile;
    user_rank = user_profile.rank;
}

function enemy_image_setup() {
    append(enemy_img_arr,asteroid_small_img);
    append(enemy_img_arr,insect1_img);
    append(enemy_img_arr,insect2_img);
    append(enemy_img_arr,asteroid_medium_img);

    for(let i = 0;i<3;i++) {
        enemy_img_arr[i].resize(40,0);
    }
    enemy_img_arr[3].resize(0,70);
}

function maingame_setup() {
    video.hide();
    video.loop();
    user_life = 3;
    user_time = 60;
    user_score = 0;
    userSprite.x = width/2 - 25;
    userSprite.y = 600;
    userSprite.visible = false;
    user_rank = -1;
    shieldSprite.x = width/2 - 25;
    shieldSprite.visible = false;
    shieldSprite.collider = 'none';
    shield_enabled = false;
    shield_enabled_count = 0;
    user_shield = 1;
    input_present = true;

    for(let i = 0;i<waveArr.length;i++) {
        if(waveArr[i] != undefined) {
            waveArr[i].remove();
        }
    }
    waveArr = [];
    
    game_over_delay_count = 0;
    game_over = false;
    game_over_sound_started =false;

    main_menu_audio_started = false;
    game_play_audio_started = false;

    enemy_enabled_count = 0;
    enemy_arr = [];
    current_enemy_score = [];
    enemy_num = 0;

    plasm_enabled = false;
    user_plasm = 1;
    user_time_count = 0;
    plasm_enabled_count = 0;

    leaderboard_updated = false;

    laserGroup.removeAll();
    plasmGroup.removeAll();
    enemyGroup.removeAll();

    laserGroup.visible = true;
    plasmGroup.visiblee = true;
}

// functions for buttons
function back_to_main_menu() {
    game_play_audio.pause();
    main_menu_audio.pause();
    currentState = LOADING;
    nextState = MAIN_MENU;
    button_to_main_menu.hide();
    button_to_play_again.hide();
    maingame_setup();
    loading_sound_played = false;
    drawLoadingScreen();
}

function play_again() {
    game_play_audio.pause();
    main_menu_audio.pause();
    currentState = LOADING;
    nextState = MAIN_GAME;
    button_to_main_menu.hide();
    button_to_play_again.hide();
    button_to_main_game.hide();
    
    maingame_setup();

    loading_sound_played = false;
    drawLoadingScreen();
}

function play_game() {
    if(user_name == "") {
        input_present = false;
    } else {
        maingame_setup();
        currentState = LOADING;
        nextState = MAIN_GAME;
        input.hide();
        button_to_main_game.hide();
        loading_sound_played = false;
        game_play_audio.pause();
        main_menu_audio.pause();
        drawLoadingScreen();
    }
}

// function for input
function input_name() {
    user_name = input.value();
}

// function for detecting keyboard interactivity with the spaceship
function detect_keyboard_input() {
    if(kb.pressing('left')) { // move to left
        userSprite.x = constrain(userSprite.x-5,25,475);
    } else if(kb.pressing('right')) { // move to right
        userSprite.x = constrain(userSprite.x+5,25,475);
    }
    if(kb.presses('up') && user_plasm >0 && plasm_enabled == false) { // use item
        user_plasm--;
        plasm_enabled = true;
    } 
    if(kb.presses(' ')) { // shoot
        if(plasm_enabled) {
            let plasm = new plasmGroup.Sprite();
            plasm.collides(enemyGroup,remove_enemy);
            plasm_sound.play();
            plasm.x = userSprite.x;
        } else {
            let laser = new laserGroup.Sprite();
            laser.collides(enemyGroup,remove_enemy);
            shooting_sound.play();
            laser.x = userSprite.x;
        }
    }
}

function make_wave() {
    let num = floor(random(0,100 % 7));
    for(let i = 0;i<7;i++) {
        if( i != num) {
            let bomb = new Sprite();
            bomb.img = bombImg;
            bomb.x = 20 + 70*i;
            bomb.y = -50;
            bomb.visible = true;
            bomb.collides(laserGroup,bomb_collides_laser);
            bomb.collides(userSprite,bomb_collision);
            bomb.collides(shieldSprite, shield_bomb);
            append(waveArr,bomb);
        } else {
            if(num%2 == 0) { //bonus_shield
                bonus_shield = new Sprite();
                bonus_shield.img = bonus_shield_img;
                bonus_shield.x = 20 + 70*i;
                bonus_shield.y = -50;
                bonus_shield.collides(userSprite,get_bonus_shield);
                bonus_shield.collides(laserGroup,get_bonus_shield);
                bonus_shield.collides(plasmGroup,get_bonus_shield);
                bonus_shield.visible = true;
                append(waveArr,bonus_shield);
            } else { //bonus_life
                bonus_life = new Sprite();
                bonus_life.img = bonus_life_img;
                bonus_life.x = 20 + 70*i;
                bonus_life.y = -50;
                bonus_life.visible = true;
                bonus_life.collides(userSprite,get_bonus_life);
                bonus_life.collides(laserGroup,get_bonus_life);
                bonus_life.collides(plasmGroup,get_bonus_life);
                append(waveArr,bonus_life);
            }
        }
    }
}

function bomb_collides_laser(laser,bomb) {
    bomb.collider = 'none';
    bomb.visible = false;
    user_life--;
    laser.visible = false;
    laser.remove();
}

function get_bonus_life(user,life) {

    if(bonus_life != undefined) {
        bonus_life.visible = false;
        bonus_life.collider = 'none';
        bonus_life.remove();
    }
    user_life++;
    user.visible = false;
}

function get_bonus_shield(user,shield) {
    if(bonus_shield != undefined) {
        bonus_shield.collider = 'none';
        bonus_shield.visible = false;
        bonus_shield.remove();
    }
    shield_enabled = true;
    user.visibe = false;
}

function bomb_collision(bomb) {
    bomb.collider = 'none';
    bomb.visible = false;
    user_life--;
}

function update_bomb_loc() {
    for(let i = 0;i<waveArr.length;i++) {
        waveArr[i].y += enemy_speed;
    }
}

function update_laser_loc() {
    for(let i = 0;i<laserGroup.length;i++) {
        laserGroup[i].y -= 3;
    }
}

function update_plasm_loc() {
    for(let i = 0;i<plasmGroup.length;i++) {
        plasmGroup[i].y -= 3;
    }
}

function update_user_time() {
    if(user_time_count % 60 == 0) {
        user_time--;
    }
}

function check_game_over() {
    if(user_time == 0 || user_life == 0) {
        userSprite.visible = false;
        laserGroup.visible = false;
        plasmGroup.visible = false;

        enemyGroup.removeAll();
        enemyGroup.visible = false;
        enemy_arr = [];
        current_enemy_score = [];

        game_over = true;
        game_over_delay_count = 0;
    }
}

function make_enemy() {
    if(enemy_enabled_count % 600 == 0) {
        make_wave();
    }
    else if(enemy_enabled_count % 60 ==0) {
        let num = floor(random(0,100) % 4);
        let enemy = new enemyGroup.Sprite();
        enemy.x = random(30,470);
        enemy.index = enemy_num++;
        enemy.img = enemy_img_arr[num];
        enemy.visible = true;
        append(current_enemy_score,enemy_score[num]);
        append(enemy_arr,enemy_life_arr[num]);
    }
}

function check_enemy_reach_end() {
    for(let i = 0;i<enemyGroup.length;i++) {
        if(enemyGroup[i].y > height+20){
            user_life--;
        }
    }
}

function update_enemy_loc() {
    for(let i = 0;i<enemyGroup.length;i++) {
        enemyGroup[i].y += enemy_speed;
    }
}

function shield_user(shield,enemy) {
    print('shield and enemy');
    if(shield_enabled) {
        enemy.collider = 'none';
        enemy.visible = false;
    }
}

function shield_bomb(bomb) {
    print('shield and bomb');
    if(shield_enabled) {
        bomb.collider = 'none';
        bomb.visible = false;
    }
}

function remove_enemy(laser,enemy) {
    if(plasm_enabled) {
        enemy_arr[enemy.index] = 0;
    } else {
        enemy_arr[enemy.index]--;
    }
    if(enemy_arr[enemy.index]<=0){
        user_score += current_enemy_score[enemy.index];
        enemy.collider = 'none';
        enemy.visible = false;
    }
    laser.collider = 'none';
    laser.remove();
}

function enemy_attack(userSprite,enemy){
    user_life--;
    enemy.remove();
}

function drawLoadingScreen() {
    game_play_audio.stop();
    main_menu_audio.stop();

    if(!loading_sound_played) {
        loading_sound.play();
        loading_sound_played = true;
    }
    // loading... text
    noStroke();
    textAlign(LEFT);
    fill('white');
    textSize(30);
    text("LOADING...",width/2-120,height/2-15);

    stroke('white');
    strokeWeight(3);
    fill(0);
    rect(width/2-120,height/2+20,loading_box_width,30);

    fill('white');
    rect(width/2-120,height/2+20,loading_box_width*(loading_frame_count%120)/120,30);
    imageMode(CORNER);
    image(starImg,width/2-140+loading_box_width*(loading_frame_count%120)/120,height/2+10,50,50);
    if(loading_frame_count%120==0) {
        currentState = nextState;
    }
    loading_frame_count++;
}

function drawMainMenuScreen() {
    if(!main_menu_audio_started) {
        print("main menu audio");
        main_menu_audio.play();
        main_menu_audio.loop();
        main_menu_audio_started = true;
    }
    imageMode(CORNER);
    image(main_menu_bg_img,0,-height+starbg_img_y);
    image(main_menu_bg_img,0,starbg_img_y);
    button_to_main_game.show();
    input.show();

    let vid_to_img = video.get();
    imageMode(CENTER);
    image(vid_to_img,width/2,300);

    noStroke();
    fill('white');
    textSize(25);
    textAlign(CENTER);
    text('space shooter',width/2,100);

    textSize(20); 
    if(input_present) {
        fill('white');
    } else {
        fill('red');
    }
    text('Type your name here :',width/2,520);
    starbg_img_y = (starbg_img_y+5) % height;

    textAlign(RIGHT);
    textSize(12);
    fill('white');
    text('Made by : SUHYUN KIM',width-5,height-5);
}

function drawMainGameScreen() {
    main_menu_audio.stop();
    if (game_over) {
        for(let i = 0;i<waveArr.length;i++) {
            waveArr[i].visible = false;
        }
        shieldSprite.visible = false;
        shieldSprite.collider = 'none';
        if(game_over_delay_count < 120) {
            if(!game_over_sound_started) {
                game_over_sound_started = true;
                game_over_sound.play();
            }
            fill('red');
            textAlign(CENTER);
            text('game over',width/2,height/2);
            game_over_delay_count++;
        } else {
            currentState = LOADING;
            nextState = LEADERBOARD;
            loading_sound_played = false;
            
            drawLoadingScreen();
        }
    }
    else {
        if(!game_play_audio_started) {
            game_play_audio.play();
            game_play_audio.loop();
            game_play_audio_started = true;
        }
        // score text
        imageMode(CORNER);
        image(background_img,0,0);
        image(star_background_img,0,-height+starbg_img_y);
        image(star_background_img,0,starbg_img_y);
        userSprite.visible = true;
        laserGroup.visible = true;
        plasmGroup.visible = true;

        fill('white');
        textSize(15);
        noStroke();
        textAlign(RIGHT);
        text('score : '+user_score,480,20);

        textAlign(CENTER);
        text(user_time,width/2,20);

        for(let i = 0;i<user_life;i++) {
            imageMode(CORNER);
            image(heartImg,465-20*i,35);
        }
        detect_keyboard_input();
        update_laser_loc();
        update_plasm_loc();

        starbg_img_y = (starbg_img_y + 5) % height;

        if(plasm_enabled) {
            plasm_enabled_count++;
            if(plasm_enabled_count%300 == 0) {
                plasm_enabled = false;
            }
        }
        
        if(shield_enabled) {
            shieldSprite.visible = true;
            shieldSprite.collider = 's';
            shieldSprite.gravity = 0;
            shield_enabled_count++;
            shieldSprite.x = userSprite.x;
            if(shield_enabled_count % 180 == 0) {
                shieldSprite.visible = false;
                shield_enabled = false;
                shieldSprite.collider = 'none';
            }
        }
        enemy_enabled_count++;
        user_time_count++;
        update_user_time();
        check_game_over();
        make_enemy();
        update_enemy_loc();
        update_bomb_loc();
    }
}

function drawLeaderBoardScreen() {
    button_to_main_menu.show();
    button_to_play_again.show();

    if(user_score >= rank_arr[9].points && !leaderboard_updated) {
        update_leaderboard_data();
        leaderboard_updated = true;
    }

    if(user_rank>=0) {
        strokeWeight(5);
        stroke('yellow');
        fill(0);
        rect(30,135+50*user_rank,400,40);
    }

    textSize(30);
    fill('white');
    noStroke();
    textAlign(CENTER);
    text("TOP 10 SCORES",width/2,60);

    textAlign(LEFT);
    textSize(20);
    text('Rank',40,120);
    text('name',200,120);
    text('score',340,120);

    for(let i = 0;i<rank_arr.length;i++) {
        textAlign(CENTER);
        text(i+1,80,160+50*i);
        textAlign(RIGHT);
        text(rank_arr[i].name,280,160+50*i);
        textAlign(CENTER);
        text(rank_arr[i].points,380,160+50*i);
    }
}

function preload() {
    // load json file
    rank_data = loadJSON('data/leaderboard_data.json');

    // load background image
    star_background_img = loadImage('images/Stars-A.png');
    background_img = loadImage('images/bg.png');

    // load star image for loading screen
    starImg = loadImage('images/star.png');

    // load main menu background images
    main_menu_bg_img = loadImage('images/Stars-B.png');

    // load main user sprite image
    userSpriteImg = loadImage('images/SpaceShip.png');

    // load heart image
    heartImg = loadImage('images/heart.png');

    // load user laser image
    laserImg = loadImage('images/laser.png');
    plasmImg = loadImage('images/plasm.png');

    // user bonus item image
    bonus_life_img = loadImage('images/bonus_life.png');
    bonus_shield_img = loadImage('images/bonus_shield.png');

    // load user shield image
    shieldImg = loadImage('images/shield.png');

    // load game enemies images
    insect1_img = loadImage('images/insect-1.png');
    insect2_img = loadImage('images/insect-2.png');
    asteroid_medium_img = loadImage('images/medium.png');
    asteroid_small_img = loadImage('images/small.png');
    bombImg = loadImage('images/bomb.png');

    // load sounds
    shooting_sound = loadSound('sound/short-laser-gun-shot.wav');
    loading_sound = loadSound('sound/repeating-arcade-beep.wav');
    game_over_sound = loadSound('sound/arcade-fast-game-over.wav');
    bonus_sound = loadSound('sound/arcade-video-game-bonus.wav');
    plasm_sound = loadSound('sound/laser-gun-shot.wav');
    main_menu_audio = loadSound('sound/loading.wav');
    game_play_audio = loadSound('sound/battle.wav');
    game_over_sound = loadSound('sound/game-over.wav');

    // load font
    font = loadFont('assets/zig.ttf');
}

function setup(){
    createCanvas(500,700);
    textFont(font);
    
    video = createVideo('video/playvideo.mov');
    video.size(200,350);
    video.loop();
    video.hide();

    starImg.resize(50,0);
    userSpriteImg.resize(50,50);
    laserImg.resize(0,50);
    plasmImg.resize(0,50);
    heartImg.resize(20,0);
    shieldImg.resize(70,0);
    bombImg.resize(70,0);
    bonus_shield_img.resize(50,0);
    bonus_life_img.resize(50,0);
    background_img.resize(500,700);
    background_img.filter(THRESHOLD);
    enemy_image_setup();

    // user sprite
    userSprite = new Sprite();
    userSprite.img = userSpriteImg;
    userSprite.x = width/2 - 25;
    userSprite.y = 600;
    userSprite.collider = 's';
    userSprite.gravity = 0;
    userSprite.visible = false;

    // laseer group
    laserGroup = new Group();
    laserGroup.img = laserImg;
    laserGroup.collider = 's';
    laserGroup.gravity = 0;
    laserGroup.y = userSprite.y-10;

    // plasm group
    plasmGroup = new Group();
    plasmGroup.img = plasmImg;
    plasmGroup.collider = 's';
    plasmGroup.gravity = 0;
    plasmGroup.y = userSprite.y-10;
    
    // enemy group
    enemyGroup = new Group();
    enemyGroup.collider = 'd';
    enemyGroup.y = -50;
    enemyGroup.direction = 0;
    enemyGroup.speed = 0;
    enemyGroup.gravity = 0;

    // shield
    shieldSprite = new Sprite();
    shieldSprite.visible = false;
    shieldSprite.img = shieldImg;
    shieldSprite.y = userSprite.y-20;
    shieldSprite.collider = 'none';
    shieldSprite.gravity = 0;
    shieldSprite.collides(enemyGroup,shield_user);
    

    // processing json file data
    process_json_data();

    // setting up buttons in the leaderboard page
    button_to_main_menu = createButton('Main Menu');
    button_to_main_menu.position(400,650);
    button_to_main_menu.mousePressed(back_to_main_menu);
    button_to_main_menu.hide();

    button_to_play_again = createButton('Play Again');
    button_to_play_again.position(20,650);
    button_to_play_again.mousePressed(play_again);
    button_to_play_again.hide();

    button_to_main_game = createButton('Play Game');
    button_to_main_game.position(width/2 - button_to_main_game.width/2,600);
    button_to_main_game.mousePressed(play_game);
    button_to_main_game.hide();

    // setting up input in the main menu page
    input = createInput('');
    input.position(width/2-input.width/2,550);
    input.input(input_name);
    input.hide();

    // setting up the sounds
    shooting_sound.setVolume(0.5);
    loading_sound.setVolume(0.5);
    game_over_sound.setVolume(0.5);
    bonus_sound.setVolume(0.5);
    plasm_sound.setVolume(0.5);
    main_menu_audio.setVolume(0.5);
    game_play_audio.setVolume(0.5);

    userSprite.collides(enemyGroup,enemy_attack);
}

function draw(){
    clear();
    background(0);
    switch(currentState) {
        case LOADING :
            if(!loading_started) {
                loading_frame_count = 1;
                loading_started = true;
            }
            drawLoadingScreen();
            break;
        case MAIN_MENU :
            drawMainMenuScreen();
            break;
        case MAIN_GAME :
            drawMainGameScreen();
            break;
        case LEADERBOARD :
            drawLeaderBoardScreen();
            break;
    }
}