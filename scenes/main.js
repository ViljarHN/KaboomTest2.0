kaboom({
  ...{ "fullscreen": true, "width": 240, "height": 240, "scale": 2, "startScene": "main", "debug": true, "clearColor": [0.611764705882353, 0.611764705882353, 0.611764705882353, 1], "version": "0.5.0" },
  global: true,
  plugins: [peditPlugin, asepritePlugin, kbmspritePlugin],
});

loadKbmsprite("brick", "sprites/brick.kbmsprite");
loadSprite("bur", "sprites/bur.png");
loadKbmsprite("burger", "sprites/burger.kbmsprite");
loadKbmsprite("burt", "sprites/burt.kbmsprite");
loadKbmsprite("dirt", "sprites/dirt.kbmsprite");
loadKbmsprite("dog", "sprites/dog.kbmsprite");
loadKbmsprite("flag", "sprites/flag.kbmsprite");
loadKbmsprite("goblin", "sprites/goblin.kbmsprite");
loadSprite("goblin_attack", "sprites/goblin_attack.png");
loadKbmsprite("grass", "sprites/grass.kbmsprite");
loadKbmsprite("jetpack", "sprites/jetpack.kbmsprite");
loadSprite("left_jetpack_burst", "sprites/left_jetpack_burst.png");
loadKbmsprite("maal", "sprites/maal.kbmsprite");
loadKbmsprite("player", "sprites/player.kbmsprite");
loadSprite("player_jetpack", "sprites/player_jetpack.png");
loadKbmsprite("player_left", "sprites/player_left.kbmsprite");
loadSprite("player_left_jetpack", "sprites/player_left_jetpack.png");
loadKbmsprite("player_right", "sprites/player_right.kbmsprite");
loadSprite("player_right_jetpack", "sprites/player_right_jetpack.png");
loadSprite("right_jetpack_burst", "sprites/right_jetpack_burst.png");
loadKbmsprite("spike", "sprites/spike.kbmsprite");
loadKbmsprite("start", "sprites/start.kbmsprite");
loadKbmsprite("stein", "sprites/stein.kbmsprite");
loadSprite("stein_gulv", "sprites/stein_gulv.png");
loadSound("Danger-Zone", "sounds/Danger-Zone.mp3");
loadSound("dog-bark", "sounds/dog-bark.wav");
scene("main", (args = {}) => {
  //import kaboom from "kaboom";
  //kaboom();

  layers(['obj', 'ui'], 'obj')

  const MOVE_SPEED = 200
  const JUMP_FORCE = 250
  const FALL_DEATH = 600
  const ENEMY_SPEED = 25

  //player
  const player = add([
    sprite('player'),
    scale(0.95),
    pos(20, 20),
    body(),
  ])


  //level

  const maps = [
    [
      '££££££££££££££££££££££££££££££££££££££££££££',
      '£                                          £',
      '£                                         $£',
      '££££££                               £££££££',
      '£     ££  ££  ££  ££  ££  ££  ££  ££       £',
      '£                                          £',
      '£                                          £',
      '£                              $           £',
      '£  ££  ££  ££  ££  ££  ££  ££  ££  ££  ££  £',
      '£                                          £',
      '£                                          £',
      '£                                          £',
      '£                                          £',
      '££   ££  ££  ££  ££  ££  ££  ££  ££  ££   ££',
      '£ £                                      £ £',
      '£  £               _                    £  £',
      '£   £    0  0      :   :    0     0    £   £',
      '£    £             :   :              £    £',
      '£------------------------------------------£',
    ], [
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      '!                               !',
      '!                               !',
      '!     / $  ^    ^ ¤¤¤¤¤     !   !',
      '!!!!!!!!!!!!!!!!!!#####     !   !',
      '!                           !   !',
      '!                           !   !',
      '!  ¤¤¤¤     ^    ^          !   !',
      '!  ####!!!!!!!!!!!!!!!!!!!!!!   !',
      '!              !                !',
      '! /           $!&               !',
      '!!!!!!!!!!!!!!!!%!!!!!!!!!!!!!!!!',
      '                                 ',
    ], [
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      '!                                 ',
      '!                ¤¤¤¤¤¤¤¤         ',
      '!     ¤¤¤^¤¤¤¤   ########         ',
      '!     ########                  ! ',
      '!!!  !        !                !  ',
      '!  !!     ^    ! ^ ^ ^$^ ^ ^  !   ',
      '!        !!!!   !!!!!!!!!!!!!!    ',
      '!       !    !                    ',
      '!     !!      !                   ',
      '!              !!!!!!!!!!!!!!!!!! ',
      '!&      $                         ',
      '!%!   !!!!!!                      ',
      '                                  ',
    ], [
      '!!!!!!!!!!                        ',
      '!        !                        ',
      '!        !                        ',
      '!   +    !                        ',
      '!!!!!!!!!!                        ',
    ], [
      '                                              ',
      '                                              ',
      '                                              ',
      '!!!!!!!!                                      ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
      '                                              ',
    ]
  ]

  const levelconf = {
    width: 25,
    height: 25,
    '@': [sprite('start'), solid()],
    '!': [sprite('brick'), solid()],
    '#': [sprite('dirt'), solid()],
    '^': [sprite('spike'), body(), 'danger'],
    '¤': [sprite('grass'), body()],
    '%': [sprite('maal'), solid(), 'next'],
    '&': [sprite('flag'), body()],
    '/': [sprite('jetpack'), 'jet'],
    '$': [sprite('burger'), 'nam'],
    '+': [sprite('dog'), body(), 'bark', scale(0.8)],
    '£': [sprite('stein'), solid(), 'wall'],
    ':': [sprite('bur'), solid()],
    '_': [sprite('burt'), solid(), body()],
    '0': [sprite('goblin'), body(), 'goblin', 'dangerous', { dir: -1, timer: 0 }],
    '-': [sprite('stein_gulv'), solid()]
  };
  const level = args.level ?? 1
  const gameLevel = addLevel(maps[level], levelconf)

  //lydeffekter
  /*
  const music = play('Danger-Zone', {
      volume: 0.8,
      loop: true
  });
  */

  //const voff = play('dog-bark')

  //player.use(sprite('spriteName'))

  //bevegelser
  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
    player.changeSprite('player_right')
  })

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
    player.changeSprite('player_left')
  })

  keyDown('up', () => {
    if (player.grounded())
      player.jump(JUMP_FORCE)
  })

  player.collides('jet', (jety) => {
    destroy(jety)
    let timeR = 1;
    timeR -= dt();
    if (timeR <= 0) {
      player.changeSprite('player')
    } else {
      player.changeSprite('player_jetpack')
      keyDown('space', () => {
        player.jump(JUMP_FORCE)
      })
      keyDown('left', () => {
        player.changeSprite('player_left_jetpack')
        keyDown('space', () => {
          player.changeSprite('left_jetpack_burst')
        })
      })
      keyDown('right', () => {
        player.changeSprite('player_right_jetpack')
        keyDown('space', () => {
          player.changeSprite('right_jetpack_burst')
        })
      })
    }
  })

  player.action(() => {
    camPos(player.pos)
    if (player.pos.y >= FALL_DEATH) {
      go('restart', { score: scoreLabel.value })
    }
  })


  action('goblin', (d) => {
    d.move(d.dir * ENEMY_SPEED, 0)
    d.timer -= dt()
    if (d.timer <= 0) {
      d.dir = - d.dir
      d.timer = rand(10)
    }
  })

  collides('goblin', 'wall', (d) => {
    d.dir = - d.dir
  })

  player.collides('goblin', (obj) => {
    obj.changeSprite('goblin_attack')
  })

  //liv
  let healthGlobal = args.health ?? 3
  const healthLabel = add([
    text('Health:' + healthGlobal),
    pos(170, 6),
    layer('ui'),
    {
      value: healthGlobal,
    }
  ])

  //effekter
  player.collides('danger', (obj) => {
    destroy(obj)
    if (healthLabel.value < 2) {
      destroy(player)
      go('restart')
    }
    else {
      healthLabel.value--
      healthLabel.text = `Health:${healthLabel.value}`
    }
  })

  player.collides('nam', (obj) => {
    destroy(obj)
    if (healthLabel.value < 3) {
      healthLabel.value++
      healthLabel.text = `Health:${healthLabel.value}`
    }
    else {
      scoreLabel.value++
      scoreLabel.text = `Burger:${scoreLabel.value}`
    }
  })

  player.collides('bark', (obj) => {
    add([text('Vil du hjelpe meg?'), pos(70, 40), scale(0.7)])
    add([text(' JA: press "enter"'), pos(70, 50), scale(0.5)])
    add([text(' NEI: press "backspace"'), pos(70, 58), scale(0.5)])
    keyPress('enter', () => {
      go('main', {
        level: (level - 3) % maps.length,
        score: scoreLabel.value
      })
    })
    keyPress('backspace', () => {
      go('main', {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
        //health: healthLabel.value
      })
    })
  })

  player.collides('next', () => {
    add([text('PRESS DOWN')])
    keyPress('down', () => {
      go('main', {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
        //health: healthLabel.value
      })
    })
  })

  //poeng og level
  const scoreGlobal = args.score ?? 0
  const scoreLabel = add([
    text('Burger:' + scoreGlobal),
    pos(10, 6),
    layer('ui'),
    {
      value: scoreGlobal,
    }
  ])

  add([text('Level:' + parseInt(level + 1)), pos(90, 6)])


  //music.play();
});
scene("restart", (args = {}) => {
  add([text('GAME OVER'), pos(285, 100)])
  add([text('press enter'), pos(280, 120)])

  keyDown('enter', () => {
    go('main')
  })
});
start("main");
