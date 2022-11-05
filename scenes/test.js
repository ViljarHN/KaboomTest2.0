const k = kaboom({
    background: [131, 161, 214],
    scale: 1.65
})

debug.inspect = false

loadSprite("brick", "sprites/brick.png");
loadSprite("bur", "sprites/bur.png");
loadSprite("burger", "sprites/burger.png");
loadSprite("burt", "sprites/burt.png");
loadSprite("dirt", "sprites/dirt.png");
loadSprite("dog", "sprites/dog.png");
loadSprite("flag", "sprites/flag.png");
loadSprite("goblin", "sprites/goblin.png");
loadSprite("goblin_attack", "sprites/goblin_attack.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("jetpack", "sprites/jetpack.png");
loadSprite("maal", "sprites/maal.png");
loadSprite("player", "sprites/player_sheet.png", {
    sliceY: 7.98,
    anims: {
        'run': {
            from: 0,
            to: 4,
            speed: 10,
            loop: true,
        },
        'idle': {
            from: 5,
            to: 6,
            speed: 5,
            loop: true,
        },
        'jump': 7
    }
});
loadSprite("spike", "sprites/spike.png");
loadSprite("start", "sprites/start.png");
loadSprite("stein", "sprites/stein.png");
loadSprite("stein_gulv", "sprites/stein_gulv.png");
loadSprite('invisblock', 'sprites/invisible_block.png')
loadSprite('rotaSlicer', 'sprites/slice_rotater.png')
loadSprite('rocks', 'sprites/rocks.png')
loadSprite('roof_spike', 'sprites/roof_spike.png')
loadSprite('dungeonSpike', 'sprites/dungeonSpike.png')
loadSprite('enemy', 'sprites/enemy_sheet.png', {
    sliceY: 7,
    anims: {
        'move': {
            from: 0,
            to: 3,
            speed: 5,
            loop: true,
        },
        'destroyed': {
            from: 4,
            to: 6,
            speed: 30,
        }
    }
})

loadSound('backgroundMusic', 'sounds/Music.mp3')

function enemy_patrol(speed = 60, dir = 1) {
    return {
        add() {
            this.on("collide", (obj, col) => {
                if (col.isLeft() || col.isRight()) {
                    dir = -dir
                }
            })
        },
        update() {
            this.move(speed * dir, 0)
        },
    }
}

/*
const bMusic = play('backgroundMusic', {
    volume: 0.5,
    loop: true
})
*/

const MOVE_SPEED = 225
const JUMP_FORCE = 400
const FALL_DEATH = 450
const ENEMY_SPEED = 25

scene('start_screen', () => {
    //bMusic.pause();
    add([text('Adventure'), pos(230, 100), scale(0.5)])
    add([text('press enter'), pos(260, 140), scale(0.3)])

    onKeyDown('enter', () => {
        go('game', {
            levelId: 0,
            coins: 0,
        })
    })
})

scene('game_over', () => {
    //bMusic.pause();
    add([text('Game Over'), pos(230, 100), scale(0.5)])
    add([text('press enter'), pos(260, 140), scale(0.3)])

    onKeyDown('enter', () => {
        go('game', {
            levelId: 0,
            coins: 0,
        })
    })
})

scene('game', ({ levelId, coins } = { levelId: 0, coins: 0 }) => {
    //bMusic.play();

    const levelMap = [
        [
            '',
            '                                                                                                        ^^^^^^^^^^^^^^^^^^^',
            '                                                                                      BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
            '                                                                                   BB   B                                    B',
            '                                                                             BB         b                                    B',
            '                                                      Q                        bb       b                                    B',
            '                                                                                  BB    B                                    B',
            '                                                                                        B                                    B',
            '                                BB        ¤¤¤                                         B B               Q                    B',
            '                            BB  BB        Bbb        B                                  B                                    B',
            '                        BB  BB  BB                          ¤¤¤                    B    B                                    B',
            '       ¤¤¤         ¤BB¤¤BB¤¤BB¤¤BB¤¤              ^ B  ^ ^^ GGG ^^^¤¤¤^^p^^  ^^^     ^^^B                                    B',
            'BBBBBBBBBBBBB    BBBBBBBBBBBBBBBBBbb    BBBbbBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB  B   B   B   B   B  B',
            'BBBBBBBBBBBBB    BBBBBBBBBBBBBBBBBbb    BBBbbBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB  B   B   B   B   B  B',
            '                                                                                                                   MMM    ',
        ], [
            'S   SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS SSSSSSSSSSSSSSSSSSSSSSSS   S',
            'S                                 Q             ttttTTttttt                                            tttTTtTTTttTTtT S   S',
            'S                                                                                                                      S   S',
            'S                                                           SSSSS      SSS      SSS      SSS      SSS                  S   S',
            'S                                                               S   #  S S   #  S S   #  S S  #   S                    S   S',
            'S                   C     C                                     SSSSSSSS SSSSSSSS SSSSSSSS SSSSSSSS                    S   S',
            'S                   S     S    C     C                                                                                 S   S',
            'S               C   S     S    S     S                                                                                 S   S',
            'S               S   S     S    S     S                                                                                 S   S',
            'S           C   S   S     S    S     S                                |     |     |     |                              S   S',
            'S       C   S   S   S     S    S     S                                                                                     S',
            'S       S***S***S***S     S****S*****S         S_ _       _#  S                     _ __ _                        _    _   S',
            'SCCCCCCCSCCCSCCCSCCCS     SCCCCSCCCCCS       CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMS',
            'SSSSSSSSSSSSSSSSSSSSS     SSSSSSSSSSSS       SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
        ],
    ]

    const levelOpt = {
        width: 25,
        height: 25,
        /* murstein */         'B': () => [sprite('brick'), area(), solid()],
        /* murstein (fake) */  'b': () => [sprite('brick')],
        /* Endre */            'O': () => [sprite('brick'), area(), solid(), 'fallspike'],
        /* vanleg jord */      'G': () => [sprite('dirt'), area(), solid()],
        /* USYNELEG BLOKK */   'Q': () => [sprite('invisblock'), area(), 'invisibleblock'],
        /* pigg */             '^': () => [sprite('spike'), area(), body(), 'danger'],
        /* pigg (fake) */      'p': () => [sprite('spike'), area(), body(),],
        /* pigg (tak) */       'T': () => [sprite('roof_spike'), area(), 'danger', 'roofSpike', { velocity: 0 }],
        /* pigg (tak) (fake) */'t': () => [sprite('roof_spike'), area(), 'danger'],
        /* pigg (dungeon) */   '*': () => [sprite('dungeonSpike'), area(), 'danger'],
        /* grass */            '¤': () => [sprite('grass')],
        /* MÅL */              'M': () => [sprite('maal'), area(), solid(), 'next'],
        /* flagg */            '&': () => [sprite('flag')],
        /* BURGER (score) */   '$': () => [sprite('burger')],
        /* steinblokk */       'S': () => [sprite('stein'), area(), solid()],
        /* steinblokk (fake) */'s': () => [sprite('stein')],
        /* steinblokk (golv) */'C': () => [sprite('stein_gulv'), area(), solid()],
        /* småstein */         '_': () => [sprite('rocks')],
        /* roterande kniv */   '|': () => [sprite('rotaSlicer'), area(), k.origin("center"), rotate(0), 'danger', 'slicer'],
        /* fiende */           '#': () => [sprite('enemy', { anim: 'move' }), area(), body(), enemy_patrol(), 'enemy']
    }

    addLevel(levelMap[levelId ?? 0], levelOpt)

    const player = add([
        sprite('player'),
        scale(1.5),
        pos(38, 250),
        area(),
        body(),
    ])

    every('slicer', (obj) => obj.angle -= 10)

    const gravity = { y: 0.1 };
    const ground = 300

    every('roofSpike', (obj) => {
        onUpdate(() => {
            if (Math.round(player.pos.x) >= obj.pos.x - obj.width && Math.round(player.pos.x) <= obj.pos.x + obj.width / 2) {
                onUpdate(() => {
                    if (obj.pos.y >= ground) {
                        obj.pos.y = ground
                        destroy(obj)
                    } else {
                        obj.velocity += gravity.y;
                        obj.pos.y += obj.velocity;
                    }
                })
            }
        })
    })

    player.onCollide("next", () => {
        keyPress('down', () => {
            if (levelId + 1 < levelMap.length) {
                go("game", {
                    levelId: levelId + 1,
                    coins: coins,
                })
            } else {
                go("start_screen")
            }
        })
    })

    player.onCollide('invisibleblock', (obj) => {
        const x = obj.pos.x;
        const y = obj.pos.y;
        if (levelId === 0) {
            add([
                pos(x, y),
                sprite("brick"),
                area(),
                solid(),
            ])
        } else {
            add([
                pos(x, y),
                sprite("stein"),
                area(),
                solid(),
            ])
        }
        obj.destroy()
    })

    player.onGround((l) => {
        if (l.is("enemy")) {
            player.jump(JUMP_FORCE * 2.5)
            l.play('destroyed')
            wait(0.2, () => {
                destroy(l)
            })
        }
    })
    player.onCollide("enemy", (e, col) => {
        // if it's not from the top, die
        if (!col.isBottom()) {
            go('game_over')
        }
    })

    //player events
    onKeyDown('right', () => {
        player.flipX(false)
        player.move(MOVE_SPEED, 0)
        // .play() will reset to the first frame of the anim, so we want to make sure it only runs when the current animation is not "run"
        if (player.isGrounded() && player.curAnim() !== "run") {
            player.play("run")
        }
    })
    onKeyDown('left', () => {
        player.flipX(true)
        player.move(-MOVE_SPEED, 0)
        if (player.isGrounded() && player.curAnim() !== "run") {
            player.play("run")
        }
    })
    onKeyDown('up', () => {
        if (player.isGrounded())
            player.jump(JUMP_FORCE)
        player.play('jump')
    })
    onKeyDown('d', () => {
        player.move(900, 0)
    })
    onKeyDown('a', () => {
        player.move(-900, 0)
    })
    player.onGround(() => {
        if (!isKeyDown("left") && !isKeyDown("right")) {
            player.play("idle")
        } else {
            player.play("run")
        }
    })
    onKeyRelease(["left", "right"], () => {
        // Only reset to "idle" if player is not holding any of these keys
        if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
            player.play("idle")
        }
    })



    //devolopment
    onKeyDown('space', () => {
        player.jump(200)
    })
    onKeyDown('down', () => {
        //go('game_over')
    })


    //events
    player.onCollide('danger', () => {
        shake(10)
        wait(0.1, () => {
            //go('game_over')
        })
    })
    player.onCollide('fallspike', () => {
        const fall_spike = add([
            sprite('spike'),
            area(),
            body(),
            'danger',
            pos(player.pos.x, player.pos.y - 100)
        ])
        fall_spike.flipY(true)
    })

    const startCamPos = camPos();

    player.onUpdate(() => {
        if (player.pos.x > startCamPos.x) {
            camPos(player.pos.x, startCamPos.y)
        }
        if (player.pos.y >= FALL_DEATH) {
            //go('game_over')
        }
    });
});

go('game')