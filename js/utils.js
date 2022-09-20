

// attack checkbox collision
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

// win/lose conditions
function determineWinner({player, enemy}){
    clearTimeout(timerId)
    document.querySelectorAll('#displayText')[0].style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelectorAll('#displayText')[0].innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelectorAll('#displayText')[0].innerHTML = "Player 1 Win"
    } else if (player.health < enemy.health) {
        document.querySelectorAll('#displayText')[0].innerHTML = "Player 2 Win"
    }
}



let timer = 60
let timerId
// Timer 
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)  //clears timer
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({player, enemy, timerId})     
    }
}