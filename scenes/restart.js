add([text('GAME OVER'), pos(285, 100)])
add([text('press enter'), pos(280, 120)])

keyDown('enter', () => {
  go('main')
})