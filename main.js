let cells = document.querySelectorAll('td')
let redPieces = document.querySelectorAll('p')
let blackPieces = document.querySelectorAll('span')
let pieces = blackPieces
let availableMoves = [] //Available moves for last selected piece
let promoted = new Set() //set to store ids of promoted pieces

let selectedPiece = null
let moved = false



/*
console.log(redPieces)
document.getElementById("0").remove();
console.log(redPieces)*/
//when i have to do a minimax call for each piece just iterate over board looking for vals between 0-11

//-1 = empty space
//100-111 = red pieces
//112-123 =  black pieces
//numbers are document id's
/*
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
]*/
/*
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
let board = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, 103, -1, 100, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, 102, -1, 101, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, 116, -1, 117, -1, 118, -1, 119],
    [120, -1, 121, -1, 122, -1, 123, -1]
]


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
    
    if(!selectedPiece){
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
                }
                if(cell.id == `${selectedCell.y}${selectedCell.x}`){ //add piece to new square
                    cell.innerHTML = `<span class="black-piece" id=${selectedPiece.id}></span>`
                }
            }
            if(move.captured){ //if captured a piece then remove capture piece
                removePiece(move.captured.y, move.captured.x)
                //check here to see if more moves available, ONLY IF USER CAPTURED 
            }
            //console.log(move)
            if(move.y == 0 || move.y == 7){
                promoted.add(parseInt(selectedPiece.id)) //parseInt since comparing to 2d array which is of type int
                //console.log(selectedPiece.id)
            }
            moved = true
            updateHTML()
        }
    }
    //console.log(selectedPiece.id)
    
    resetSelected()
    removeEventListeners()
    setEventListeners()
    selectedPiece = null
    
    //console.log(selectedCell)
    //console.log(board)
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

function getValidMoves(cell, board){ //returns array of possible moves for piece with given board, GIVE COLOR ASWELL
    let moves = []
    /*
        cell structure = {
            y: i,
            x: j,
            id: e.target.id
        }
    */
    //for player red
    /*
    console.log(cell.y)
    console.log(cell.x)
    console.log(board.length)
    console.log(board[0].length)
    if(cell.x < board[0].length-1 && cell.y < board.length-1 && board[cell.y+1][cell.x+1] == -1){ //if can move below and right
        moves.push({y: cell.y+1, x: cell.x+1})
    }
    
    if(cell.x < board[0].length-2 && cell.y < board.length-2 && board[cell.y+1][cell.x+1] >= 111 && board[cell.y+2][cell.x+2] == -1){//if can jump piece below and right
        moves.push({y: cell.y+2, x: cell.x+2})
        //WILL HAVE TO MAKE SURE I AM REMOVING THE PIECE IF I AM JUMPING IT, IF DURING MINIMAX JUST REMOVE FROM BOARD, IF BEST MOVE THEN .REMOVE() FROM DOCUMENT ASWELL
    }
    if(promoted.has(cell.id)){ //if promoted piece then also check backwards

    }*/

    //for player black
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
    //console.log(moves)

    return moves
}

function getCaptures(board, cell, ){

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
                    //console.log(getValidMoves(selectedPiece, board))
                    availableMoves = getValidMoves(selectedPiece, board)
                }
                break
            }
        }
    }
    showMoves(availableMoves)
    setEventListeners()
}
updateHTML()
setEventListeners()

