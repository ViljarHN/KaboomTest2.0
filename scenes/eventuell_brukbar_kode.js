function addSlicer() {
    let array = []
    for (let i = 0; i < slicer.length; i++) {
        const element_angle = slicer[i].angle;
        array.push(element_angle)
    }
    console.log(array)
}
addSlicer();

for (const obj of objs) {
    loadSprite(obj, `/sprites/${obj}.png`)
}

loop(0.08, () => {
    if (roofspike[0].pos.y <= 280) {
        roofspike[0].pos.y += 20
    }
})


if (Math.round(player.pos.x) === roofspike[0].pos.x) {
    wait(1, () => {
        roofspike[0].pos.y = 280
    })
}
const roofspike = get('roofSpike')
console.log(roofspike[0].pos.x)
console.log(roofspike[0])
