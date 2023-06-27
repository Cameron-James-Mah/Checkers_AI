let cells = document.querySelectorAll('td')
let redPieces = document.querySelectorAll('p')
let blackPieces = document.querySelectorAll('span')
let pieces = blackPieces
let availableMoves = [] //Available moves for last selected piece
let promoted = new Set() //set to store ids of promoted pieces
let selectedPiece = null
let playerTurn = true
let followUpPiece = null


document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyZ') {
    evalBoard(board)
  }
});
/*
console.log(redPieces)
document.getElementById("0").remove();
console.log(redPieces)*/
//when i have to do a minimax call for each piece just iterate over board looking for vals between 0-11

//-1 = empty space
//100-111 = red pieces
//112-123 =  black pieces
//numbers are document id's

//standard setup

let board = [
    [-1, 100, -1, 101, -1, 102, -1, 103],
    [104, -1, 105, -1, 106, -1, 107, -1],
    [-1, 108, -1, 109, -1, 110, -1, 111],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [112, -1, 113, -1, 114, -1, 115, -1],
    [-1, 116, -1, 117, -1, 118, -1, 119],
    [120, -1, 121, -1, 122, -1, 123, -1]
]
/*
//check black can promote
let board = [
    [-1, 100, -1, 101, -1, 102, -1, -1],
    [104, -1, 105, -1, 106, -1, -1, -1],
    [-1, 108, -1, 109, -1, 110, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [112, -1, 113, -1, 114, -1, 115, -1],
    [-1, 116, -1, 117, -1, 118, -1, 119],
    [120, -1, 121, -1, 122, -1, 123, -1]
]*/

//check red capture forwards, black capture properly normal and promoted
/*
let board = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, 103, -1, 100, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, 102, -1, 101, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 112, -1, -1, -1],
    [-1, 116, -1, 117, -1, 118, -1, 119],
    [120, -1, 121, -1, 122, -1, -1, -1]
]*/
/*
//blank
let board = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1]
]*/
//check red promotion capture backwards
/*
let board = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [120, -1, 100, -1, -1, -1, -1, -1]
]
promoted.add(100)*/

/*
//Test double jump
let board = [
    [-1, -1, -1, -1, -1, -1, -1, 102],
    [-1, -1, 101, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 100, -1, -1, -1],
    [-1, -1, -1, -1, -1, 120, -1, -1],
    [-1, , 103, -1, -1, -1, -1, -1],
    [-1, -1, -1, 115, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1]
]*/


//Convinient board init, no need to change board[[]] to match html values. Saves time/error when testing
/*
let currRed = 100
let currBlack = 112
for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){
        if(document.getElementById(`${i}${j}`).innerHTML == ''){//empty space
            board[i][j] = -1
        }
        else if(document.getElementById(`${i}${j}`).innerHTML.includes('red')){//red piece
            board[i][j] = currRed
            currRed++
        }
        else if(document.getElementById(`${i}${j}`).innerHTML.includes('black')){//black piece
            board[i][j] = currBlack
            currBlack++
        }
    }
}*/

//Probably more convenient to change the html to match my board arr, easier/less room for mistake to modify 2d array then whole html
//maybe use this for updating html so i can work purely with board array?
function updateHTML(){
    //console.log(board)
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(board[i][j] == -1){//empty space
                document.getElementById(`${i}${j}`).innerHTML = ''
            }
            else if(board[i][j] < 112 && promoted.has(board[i][j])){ //promoted red piece
                document.getElementById(`${i}${j}`).innerHTML = `<p class="red-piece king" id="${board[i][j]}"></p>`
            }
            else if(board[i][j] >= 112 && promoted.has(board[i][j])){ //promoted black piece
                document.getElementById(`${i}${j}`).innerHTML = `<span class="black-piece king" id="${board[i][j]}"></span>`
            }
            else if(board[i][j] < 112){//red piece
                document.getElementById(`${i}${j}`).innerHTML = `<p class="red-piece" id="${board[i][j]}"></p>`
            }
            else if(board[i][j] > 111){//black piece
                document.getElementById(`${i}${j}`).innerHTML = `<span class="black-piece" id="${board[i][j]}"></span>`
            }
        }
    }
}


function setEventListeners(){
    pieces = document.querySelectorAll('span')
    cells = document.querySelectorAll('td')
    for(let i = 0; i < cells.length; i++){
        //cells[i].addEventListener("click", clickCell)
        if(cells[i].innerHTML == '' || cells[i].innerHTML == `<p class="available-move" id="-1"></p>`){
            cells[i].addEventListener("click", clickCell)
        }
        else{
            cells[i].removeEventListener('click', clickCell)
        }
        
    }
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener("click", clickPiece)
        //console.log(pieces[i])
    }
}

function removeEventListeners(){
    pieces = document.querySelectorAll('span')
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].removeEventListener("click", clickPiece)
        //console.log(pieces[i])
    }
}



function resetSelected(){
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].style.border = "none";
    }
}

function clickCell(e){ //Handles moving pieces
    //NEED TO ALSO CHECK IF MOVE IS VALID
    if(!selectedPiece || !playerTurn){
        return
    }
    
    let selectedCell = {
        y: parseInt(e.target.id[0]),
        x: parseInt(e.target.id[1])
    }
    for(let move of availableMoves){
        if(move.y == selectedCell.y && move.x == selectedCell.x){
            //console.log(`${selectedPiece.y}${selectedPiece.x}`)
            if(canCapture(board, 'black') && !move.captured){ //if a capture available and move is not a capture
                //console.log('Forced Capture')
                alert('Forced Capture Available')
                return
            }
            for(let cell of cells){
                if(cell.id == `${selectedPiece.y}${selectedPiece.x}`){ //remove piece from previous square
                    cell.innerHTML = ``;
                    board[selectedCell.y][selectedCell.x] = parseInt(selectedPiece.id)
                    board[selectedPiece.y][selectedPiece.x] = -1
                    playerTurn = false
                }
                if(cell.id == `${selectedCell.y}${selectedCell.x}`){ //add piece to new square
                    cell.innerHTML = `<span class="black-piece" id=${selectedPiece.id}></span>`
                }
            }
            if(move.captured){ //if captured a piece then remove capture piece
                removePiece(move.captured.y, move.captured.x)
                if(checkFollowUp(board, move.y, move.x, 'black')){//CHANGE THIS TO CHECK IF SPECIFIC PIECE CAN CAPTURE
                    playerTurn = true
                    followUpPiece = board[move.y][move.x]
                }
                else{
                    followUpPiece = null
                }
                
            }
            //console.log(move)
            if(move.y == 0 || move.y == 7){
                promoted.add(parseInt(selectedPiece.id)) //parseInt since comparing to 2d array which is of type int
                //console.log(selectedPiece.id)
            }
        }
    }

    //console.log(selectedPiece.id)
    updateHTML()
    resetSelected()
    removeEventListeners()
    setEventListeners()
    selectedPiece = null
    if(!playerTurn){
        //ai turn
        minimaxHelper()
        console.log('AI turn')
    }
    else{
        
    }
    //console.log(selectedCell)
    //console.log(board)
}

//check if specific piece has a followup capture
function checkFollowUp(board, i, j, player){
    if(board[i][j] >= 112 && player == 'black'){ //if black to move then check if they can capture
        if(j < board[0].length-2 && i > 1 && board[i-1][j+1] >= 100 && board[i-1][j+1] <= 111  && board[i-2][j+2] == -1 || j > 1 && i > 1 && board[i-1][j-1] >= 100 && board[i-1][j-1] <= 111  && board[i-2][j-2] == -1){
            return true
        }
        //if promoted
        if(promoted.has(board[i][j])){
            if(j < board[0].length-2 && i < board.length-2 && board[i+1][j+1] >= 100 && board[i+1][j+1] <= 111 && board[i+2][j+2] == -1 || j > 1 && i < board.length-2 && board[i+1][j-1] >= 100 && board[i+1][j-1] <= 111 && board[i+2][j-2] == -1){
                return true
            }
        }

    }
    else if(board[i][j] >= 100 && board[i][j] <= 111 && player== 'red'){ //if red to move then check if they can capture
        if(j < board[0].length-2 && i < board.length-2 && board[i+1][j+1] >= 112 && board[i+2][j+2] == -1 || j > 1 && i < board.length-2 && board[i+1][j-1] >= 112 && board[i+2][j-2] == -1){
                return true
        }
        if(promoted.has(board[i][j])){
            if(j < board[0].length-2 && i > 1 && board[i-1][j+1] >= 112 && board[i-2][j+2] == -1 || j > 1 && i > 1 && board[i-1][j-1] >= 112  && board[i-2][j-2] == -1){
                return true
            }
        }
    }
}

function removePiece(y, x){
    board[y][x] = -1
    for(let cell of cells){
        if(cell.id == `${y}${x}`){
            cell.innerHTML = ''
            break
        }
    }
    //console.log(1)
}

function getValidMoves(cell, board, player){ //returns array of possible moves for piece with given board, GIVE COLOR ASWELL
    let moves = []
    /*
        cell structure = {
            y: i,
            x: j,
            id: e.target.id
        }
    */
    //for player black
    if(player == 'black'){
        if(cell.x < board[0].length-1 && cell.y > 0 && board[cell.y-1][cell.x+1] == -1){ //if can move above and right
            moves.push({y: cell.y-1, x: cell.x+1, captured: null})
        }

        if(cell.x < board[0].length-2 && cell.y > 1 && board[cell.y-1][cell.x+1] >= 100 && board[cell.y-1][cell.x+1] <= 111  && board[cell.y-2][cell.x+2] == -1){//if can jump piece above and right
            moves.push({y: cell.y-2, x: cell.x+2, captured: {y: cell.y-1, x: cell.x+1}})
        }
        if(cell.x > 0 && cell.y > 0 && board[cell.y-1][cell.x-1] == -1){ //if can move above and left
            moves.push({y: cell.y-1, x: cell.x-1, captured: null})
        }
        if(cell.x > 1 && cell.y > 1 && board[cell.y-1][cell.x-1] >= 100 && board[cell.y-1][cell.x-1] <= 111  && board[cell.y-2][cell.x-2] == -1){//if can jump piece above and left
            moves.push({y: cell.y-2, x: cell.x-2, captured: {y: cell.y-1, x: cell.x-1}})
        }
        if(promoted.has(cell.id)){ //if promoted piece then also check backwards
            if(cell.x < board[0].length-1 && cell.y < board.length-1 && board[cell.y+1][cell.x+1] == -1){ //if can move below and right
                moves.push({y: cell.y+1, x: cell.x+1, captured: null})
            }
            if(cell.x < board[0].length-2 && cell.y < board.length-2 && board[cell.y+1][cell.x+1] >= 100 && board[cell.y+1][cell.x+1] <= 111 && board[cell.y+2][cell.x+2] == -1){//if can jump piece below and right
                moves.push({y: cell.y+2, x: cell.x+2, captured: {y: cell.y+1, x: cell.x+1}})
            }
            if(cell.x > 0 && cell.y < board.length-1 && board[cell.y+1][cell.x-1] == -1){ //if can move below and left
                moves.push({y: cell.y+1, x: cell.x-1, captured: null})
            }
            if(cell.x > 1 && cell.y < board.length-2 && board[cell.y+1][cell.x-1] >= 100 && board[cell.y+1][cell.x-1] <= 111 && board[cell.y+2][cell.x-2] == -1){//if can jump piece below and left
                moves.push({y: cell.y+2, x: cell.x-2, captured: {y: cell.y+1, x: cell.x-1}})
            }
        }
    }
    else if(player == 'red'){
        if(cell.x < board[0].length-1 && cell.y < board.length-1 && board[cell.y+1][cell.x+1] == -1){ //if can move below and right
            moves.push({y: cell.y+1, x: cell.x+1, captured: null})
        }
        if(cell.x < board[0].length-2 && cell.y < board.length-2 && board[cell.y+1][cell.x+1] >= 112 && board[cell.y+2][cell.x+2] == -1){//if can jump piece below and right
            moves.push({y: cell.y+2, x: cell.x+2, captured: {y: cell.y+1, x: cell.x+1}})
        }
        if(cell.x > 0 && cell.y < board.length-1 && board[cell.y+1][cell.x-1] == -1){ //if can move below and left
            moves.push({y: cell.y+1, x: cell.x-1, captured: null})
        }
        if(cell.x > 1 && cell.y < board.length-2 && board[cell.y+1][cell.x-1] >= 112 && board[cell.y+2][cell.x-2] == -1){//if can jump piece below and left
            moves.push({y: cell.y+2, x: cell.x-2, captured: {y: cell.y+1, x: cell.x-1}})
        }
        if(promoted.has(cell.id)){
            if(cell.x < board[0].length-1 && cell.y > 0 && board[cell.y-1][cell.x+1] == -1){ //if can move above and right
                moves.push({y: cell.y-1, x: cell.x+1, captured: null})
            }

            if(cell.x < board[0].length-2 && cell.y > 1 && board[cell.y-1][cell.x+1] >= 112  && board[cell.y-2][cell.x+2] == -1){//if can jump piece above and right
                moves.push({y: cell.y-2, x: cell.x+2, captured: {y: cell.y-1, x: cell.x+1}})
            }
            if(cell.x > 0 && cell.y > 0 && board[cell.y-1][cell.x-1] == -1){ //if can move above and left
                moves.push({y: cell.y-1, x: cell.x-1, captured: null})
            }
            if(cell.x > 1 && cell.y > 1 && board[cell.y-1][cell.x-1] >= 112  && board[cell.y-2][cell.x-2] == -1){//if can jump piece above and left
                moves.push({y: cell.y-2, x: cell.x-2, captured: {y: cell.y-1, x: cell.x-1}})
            }
        }
    }
    return moves
}



//assuming player black is always the human player
function canCapture(board, player){ //player == 'black' or 'red'
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            if(board[i][j] >= 112 && player == 'black'){ //if black to move then check if they can capture
                if(j < board[0].length-2 && i > 1 && board[i-1][j+1] >= 100 && board[i-1][j+1] <= 111  && board[i-2][j+2] == -1 || j > 1 && i > 1 && board[i-1][j-1] >= 100 && board[i-1][j-1] <= 111  && board[i-2][j-2] == -1){
                    return true
                }
                //if promoted
                if(promoted.has(board[i][j])){
                    if(j < board[0].length-2 && i < board.length-2 && board[i+1][j+1] >= 100 && board[i+1][j+1] <= 111 && board[i+2][j+2] == -1 || j > 1 && i < board.length-2 && board[i+1][j-1] >= 100 && board[i+1][j-1] <= 111 && board[i+2][j-2] == -1){
                        return true
                    }
                }

            }
            else if(board[i][j] >= 100 && board[i][j] <= 111 && player== 'red'){ //if red to move then check if they can capture
                if(j < board[0].length-2 && i < board.length-2 && board[i+1][j+1] >= 112 && board[i+2][j+2] == -1 || j > 1 && i < board.length-2 && board[i+1][j-1] >= 112 && board[i+2][j-2] == -1){
                        return true
                }
                if(promoted.has(board[i][j])){
                    if(j < board[0].length-2 && i > 1 && board[i-1][j+1] >= 112 && board[i-2][j+2] == -1 || j > 1 && i > 1 && board[i-1][j-1] >= 112  && board[i-2][j-2] == -1){
                        return true
                    }
                }
            }
        }
    }
    return false
}

function showMoves(moves){
    for(let move of moves){
        document.getElementById(`${move.y}${move.x}`).innerHTML = `<p class="available-move" id="-1"></p>`
    }
}

function clickPiece(e){
    if(followUpPiece && findPieceCord(parseInt(e.target.id), board) != followUpPiece){
        return
    }
    
    resetSelected()
    updateHTML()
    document.getElementById(e.target.id).style.border = "3px solid green";
    //console.log(e.target.id)
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            if(parseInt(e.target.id) == board[i][j]){ //id of selected piece
                //console.log(board[i][j])
                selectedPiece = {
                    y: i,
                    x: j,
                    id: parseInt(e.target.id)
                }
                if(selectedPiece){
                    availableMoves = getValidMoves(selectedPiece, board, 'black')
                }
                break
            }
        }
    }
    showMoves(availableMoves)
    setEventListeners()
}

function findPieceCord(pieceID, board){
    for(let i = 0; i < board.length; i++){
        for(let j =0; j < board[0].length; j++){
            if(board[i][j] == pieceID){
                return board[i][j].toString()
            }
        }
    }
}

//Positive for AI, Negative for player
/*Things I am considering:
    - How many pieces ai/player has, bonus points for promoted piece
    - How far up the board a piece is(how close to promoting) //make sure to check piece is not already promoted when checking this, i dont care how far up the board a promoted piece is
    First eval: 
        +1 for each row up the board a piece is 
        +4 for each non promoted piece
        +10 for each promoted piece
    Thoughts: Maybe a piece moving to lets say the second last rank(close to promote) should be weighed more than a piece moving to the second rank(further to promote)
z
*/

//ONLY USING IN MINIMAX, WILL INCLUDE FOLLOWUP CAPTURES
function getPlayerMoves(board, player){ //use this function to check if player or ai is lost, also in minimax helper for iterating over possible moves 
    let moves = []
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            if(player == 'black' && board[i][j] >= 112 ){
                let move = {
                    y: i,
                    x: j,
                    moves: getValidMoves({y: i, x: j, id: board[i][j]}, board,'black')
                }
                moves.push(move)
            }
            else if(player == 'red' && board[i][j] != -1 && board[i][j] < 112){
                let move = {
                    y: i,
                    x: j,
                    moves: getValidMoves({y: i, x: j, id: board[i][j]}, board,'red')
                }
                moves.push(move)
            }
        }
    }

    return moves
}


/*
    CHECKERS BOT FUNCTIONS BELOW
*/
//assume ai is red
//need to return new position and captured piece position
function getFollowUpAI(board, i, j, player){
    let res = []
    if(player == 'red'){
        if(j < board[0].length-2 && i < board.length-2 && board[i+1][j+1] >= 112 && board[i+2][j+2] == -1){
            res.push({x: j+2, y: i+2, captured: {x: j+1, y: i+1}})
        }
        if(j > 1 && i < board.length-2 && board[i+1][j-1] >= 112 && board[i+2][j-2] == -1){
            res.push({x: j-2, y: i+2, captured: {x: j-1, y: i+1}})
        }
        if(promoted.has(board[i][j])){
            if(j < board[0].length-2 && i > 1 && board[i-1][j+1] >= 112 && board[i-2][j+2] == -1){
                res.push({x: j+2, y: i-2, captured: {x: j+1, y: i-1}})
            }
            if(j > 1 && i > 1 && board[i-1][j-1] >= 112  && board[i-2][j-2] == -1){
                res.push({x: j-2, y: i-2, captured: {x: j-1, y: i-1}})
            }
        }
    }
    else if(player == 'black'){
        if(j < board[0].length-2 && i > 1 && board[i-1][j+1] >= 100 && board[i-1][j+1] <= 111  && board[i-2][j+2] == -1){
            res.push({x: j+2, y: i-2, captured: {x: j+1, y: i-1}})
        }
        if(j > 1 && i > 1 && board[i-1][j-1] >= 100 && board[i-1][j-1] <= 111  && board[i-2][j-2] == -1){
            res.push({x: j-2, y: i-2, captured: {x: j-1, y: i-1}})
        }
        //if promoted
        if(promoted.has(board[i][j])){
            if(j < board[0].length-2 && i < board.length-2 && board[i+1][j+1] >= 100 && board[i+1][j+1] <= 111 && board[i+2][j+2] == -1){
                res.push({x: j+2, y: i+2, captured: {x: j+1, y: i+1}})
            }
            if(j > 1 && i < board.length-2 && board[i+1][j-1] >= 100 && board[i+1][j-1] <= 111 && board[i+2][j-2] == -1){
                res.push({x: j-2, y: i+2, captured: {x: j-1, y: i+1}})
            }
        }
    }
    
    return res
}

function updateBoard(board, startY, startX, endY, endX, captured){ //used in minimax(AND ONLY minimax), update a given board based on a move
    let temp = []
    let startVal = board[startY][startX]
    for(let i = 0; i < board.length; i++){
        let tempArr = []
        for(let j = 0; j < board[0].length; j++){
            if(i == startY && j == startX){
                tempArr.push(-1)
            }
            else if(i == endY && j == endX){
                tempArr.push(startVal)
            }
            else if(captured && captured.y == i && captured.x == j){
                tempArr.push(-1)
            }
            else{
                tempArr.push(board[i][j])
            }
            
        }
        temp.push(tempArr)
    }
    return temp
}


function minimaxHelper(){
    let pieces = getPlayerMoves(board, 'red')
    let bestValue = -2001
    let bestBoard = []
    let bestMove = [{}]
    let depth = 7
    //let board = [...board]
    if(canCapture(board, 'red')){
        //console.log(1)
        for(let piece of pieces){
            //piece structure: {y: int, x: int, moves: [{y: int, x: int, captured: y: ,x: OR null}]} 
            for(let move of piece.moves){
                let followUp = false
                //console.log(updateBoard(board, piece.y, piece.x, move.y, move.x, move.captured))
                if(move.captured){
                    //might have to make new struct push only the capture move with original square too
                    //actually maybe do minimax call here pass whatever params i need
                    //console.log(piece)
                    let curr = null
                    if(piece.board){
                        curr = updateBoard(piece.board, piece.y, piece.x, move.y, move.x, move.captured)
                    }
                    else{
                        curr = updateBoard(board, piece.y, piece.x, move.y, move.x, move.captured)
                    }
                    let additionalJumps = getFollowUpAI(curr, move.y, move.x, 'red') //follow up jumps
                    for(let jump of additionalJumps){ //add follow up jumps\
                        pieces.push({board: curr, y: move.y, x: move.x, moves: [{y: jump.y, x: jump.x, captured: jump.captured}]})
                        followUp = true
                    }
                    if(!followUp){ //Don't count incomplete possible multi jumps
                        let temp = minimax(curr, false, 6, -1000, 1000, null)
                        if(temp > bestValue){
                            bestBoard = [...curr]
                            bestValue = temp
                            bestMove = move
                        }
                    }
                }
            }
        } 
    }
    else{
        for(let piece of pieces){
            //piece structure: {y: int, x: int, moves: [{y: int, x: int, captured: y: ,x: OR null}]} 
            for(let move of piece.moves){
                let curr = updateBoard(board, piece.y, piece.x, move.y, move.x, move.captured)
                let temp = minimax(curr, false, depth, -1000, 1000)
                if(temp > bestValue){
                    bestBoard = [...curr]
                    bestValue = temp
                    bestMove = move
                }
                
            }
        } 
    }
    console.log(bestValue)
    board = bestBoard
    if(bestMove.y == 7){
        promoted.add(board[bestMove.y][bestMove.x])
    }
    updateHTML()
    resetSelected()
    removeEventListeners()
    setEventListeners()
    playerTurn = true
    //check if ai won after making optimal move
    //console.log(pieces)
}




//ai maximizing, player minimizing
//evaluate wins as 1000/-1000
//make sure im passing the updated board
function minimax(board, maximizing, depth, alpha, beta){
    if(depth == 0){
        return evalBoard(board)
    }
    if(maximizing){
        /*
        if(checkWin(board, 'black')){ //player won before this node
            return -2000
        }*/
        let value = -1000
        let pieces = getPlayerMoves(board, 'red')
        if(!pieces){
            return -1000
        }
        if(canCapture(board, 'red')){
            //console.log(1)
            for(let piece of pieces){
                //piece structure: {y: int, x: int, moves: [{y: int, x: int, captured: y: ,x: OR null}]} 
                for(let move of piece.moves){
                    let followUp = false
                    if(move.captured){
                        let curr = null
                        if(piece.board){
                            curr = updateBoard(piece.board, piece.y, piece.x, move.y, move.x, move.captured)
                        }
                        else{
                            curr = updateBoard(board, piece.y, piece.x, move.y, move.x, move.captured)
                        }
                        let temp = minimax(curr, false, depth-1, alpha, beta)
                        let additionalJumps = getFollowUpAI(curr, move.y, move.x, 'red')
                        for(let jump of additionalJumps){
                            pieces.push({board: curr, y: move.y, x: move.x, moves: [{y: jump.y, x: jump.x, captured: jump.captured}]})
                            followUp = true
                        }
                        if(!followUp){
                            value = Math.max(value, temp)
                            alpha = Math.max(alpha, temp)
                            if(beta <= alpha){
                                break
                            }
                        }
                        
                    }
                }
            } 
        }
        else{
            for(let piece of pieces){
            //piece structure: {y: int, x: int, moves: [{y: int, x: int, captured: y: ,x: OR null}]} 
                for(let move of piece.moves){
                    let curr = updateBoard(board, piece.y, piece.x, move.y, move.x, move.captured)
                    let temp = minimax(curr, false, depth-1, alpha, beta)
                    value = Math.max(value, temp)
                    alpha = Math.max(alpha, temp)
                    if(beta <= alpha){
                        break
                    }
                }
            }
        }
        
        return value 
    }
    else{
        /*
        if(checkWin(board, 'red')){ //player won before this node
            return 1000
        }*/
        let value = 1000
        let pieces = getPlayerMoves(board, 'black')
        if(!pieces){
            return 1000
        }
        if(canCapture(board, 'black')){
            //console.log(1)
            for(let piece of pieces){
                //piece structure: {y: int, x: int, moves: [{y: int, x: int, captured: y: ,x: OR null}]} 
                for(let move of piece.moves){
                    let followUp = false
                    if(move.captured){
                        let curr = null
                        if(piece.board){
                            curr = updateBoard(piece.board, piece.y, piece.x, move.y, move.x, move.captured)
                        }
                        else{
                            curr = updateBoard(board, piece.y, piece.x, move.y, move.x, move.captured)
                        }
                       
                        let temp = minimax(curr, true, depth-1, alpha, beta)
                        let additionalJumps = getFollowUpAI(curr, move.y, move.x, 'black')
                        for(let jump of additionalJumps){
                            pieces.push({board: curr, y: move.y, x: move.x, moves: [{y: jump.y, x: jump.x, captured: jump.captured}]})
                            followUp = true
                        }
                        if(!followUp){
                            value = Math.min(value, temp)
                            beta = Math.min(beta, temp)
                            if(beta <= alpha){
                                break
                            }
                        }
                        
                    }
                }
            } 
        }
        for(let piece of pieces){
            //piece structure: {y: int, x: int, moves: [{y: int, x: int, captured: y: ,x: OR null}]} 
            for(let move of piece.moves){
                let curr = updateBoard(board, piece.y, piece.x, move.y, move.x, move.captured)
                let temp = minimax(curr, true, depth-1, alpha, beta)
                value = Math.min(value, temp)
                beta = Math.min(beta, temp)
                if(beta <= alpha){
                    break
                }
            }
        }
        return value 
    }

}


//maybe don't use this function, instead keep a running total on number of pieces instead?
function checkWin(board, player){ //returns true if specified player is winning else false
    if(player == 'red'){ //check if red is winning(no more black pieces)
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[0].length; j++){
                if(board[i][j] >= 112){
                    return false
                }
            }
        }
        return true
    }
    else if(player == 'black'){ //check if black is winning(no more red pieces)
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[0].length; j++){
                if(board[i][j] != -1 && board[i][j] < 112){
                    return false
                }
            }
        }
        return true
    }
}

function evalBoard(board){
    let aiEval = 0
    let playerEval = 0
    let pieceWeight = 4
    let promotedWeight = 10
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            if(board[i][j] == -1){
                continue
            }
            else if(board[i][j] < 112){ //red piece, player
                if(promoted.has(board[i][j])){ //promoted red piece
                    aiEval += promotedWeight
                }
                else{ //normal red piece
                    aiEval += i
                }
                aiEval += pieceWeight
            }
            else if(board[i][j] >= 112){ //black piece, ai
                if(promoted.has(board[i][j])){ //promoted black piece
                    playerEval += promotedWeight
                }
                else{ //normal black piece
                    playerEval += 7-i
                } 
                playerEval += pieceWeight
            }
        }
    }
    //console.log(`AI: ${aiEval}  Player: ${playerEval}`)
    return aiEval-playerEval
}


updateHTML()
setEventListeners()

