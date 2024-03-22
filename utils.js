function detectCollision({player, enemy}) {
    return (player.attackBox.position.x + player.attackBox.width >= enemy.position.x && 
            player.attackBox.position.x <= enemy.position.x + enemy.width) &&
            (player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
            player.attackBox.position.y <= enemy.position.y + enemy.height)
}

function determineWinner({player, enemy, timerId}) {
    const doc = document.querySelector("#result")
    doc.style.display = 'flex'
    if (player.health === enemy.health) {  
        doc.innerHTML = "Tie"  
    } else if (player.health > enemy.health) {
        doc.innerHTML = "Player 1 Wins"
    } else {
        doc.innerHTML = "Player 2 Wins"
    }
    clearTimeout(timerId)
}

let timer = 120
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}
