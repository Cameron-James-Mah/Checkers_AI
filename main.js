let cells = document.querySelectorAll('td')
let redPieces = document.querySelectorAll('p')
let blackPieces = document.querySelectorAll('span')
let pieces = blackPieces
/*
console.log(redPieces)
document.getElementById("0").remove();
console.log(redPieces)*/
//when i have to do a minimax call for each piece just iterate over board looking for vals between 0-11

//-1 = empty space
//100-111 = red pieces
//112-123 =  black pieces
//numbers are document id's
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
for(let i = 0; i < cells.length; i++){
    cells[i].addEventListener("click", clickCell)
}
for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener("click", clickPiece)
}

let promoted = new Set() //set to store ids of promoted pieces

let selectedPiece = null
/*
for (let i = 0; i < blackPieces.length; i++) {
    blackPieces[i].addEventListener("click", showMoves);
}*/

function resetSelected(){
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].style.border = "none";
    }
}

function clickCell(e){
    //console.log(e.target.id)
    let selectedCell = {
        y: parseInt(e.target.id[0]),
        x: parseInt(e.target.id[1])
    }
    //console.log(selectedCell)
    
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
        moves.push({y: cell.y-1, x: cell.x+1})
    }
    
    if(cell.x < board[0].length-2 && cell.y > 1 && board[cell.y-1][cell.x+1] >= 100 && board[cell.y-1][cell.x+1] <= 111  && board[cell.y-2][cell.x+2] == -1){//if can jump piece above and right
        moves.push({y: cell.y-2, x: cell.x+2})
        //WILL HAVE TO MAKE SURE I AM REMOVING THE PIECE IF I AM JUMPING IT, IF DURING MINIMAX JUST REMOVE FROM BOARD, IF BEST MOVE THEN .REMOVE() FROM DOCUMENT ASWELL
    }
    if(cell.x > 0 && cell.y > 0 && board[cell.y-1][cell.x-1] == -1){ //if can move above and left
        moves.push({y: cell.y-1, x: cell.x-1})
    }
    if(cell.x > 1 && cell.y > 1 && board[cell.y-1][cell.x-1] >= 100 && board[cell.y-1][cell.x-1] <= 111  && board[cell.y-2][cell.x-2] == -1){//if can jump piece above and left
        moves.push({y: cell.y-2, x: cell.x-2})
        //WILL HAVE TO MAKE SURE I AM REMOVING THE PIECE IF I AM JUMPING IT, IF DURING MINIMAX JUST REMOVE FROM BOARD, IF BEST MOVE THEN .REMOVE() FROM DOCUMENT ASWELL
    }
    if(promoted.has(cell.id)){ //if promoted piece then also check backwards
        if(cell.x < board[0].length-1 && cell.y < board.length-1 && board[cell.y+1][cell.x+1] == -1){ //if can move below and right
            moves.push({y: cell.y+1, x: cell.x+1})
        }
        if(cell.x < board[0].length-2 && cell.y < board.length-2 && board[cell.y+1][cell.x+1] >= 100 && board[cell.y+1][cell.x+1] <= 111 && board[cell.y+2][cell.x+2] == -1){//if can jump piece below and right
            moves.push({y: cell.y+2, x: cell.x+2})
        }
        if(cell.x > 0 && cell.y < board.length-1 && board[cell.y+1][cell.x+1] == -1){ //if can move below and left
            moves.push({y: cell.y+1, x: cell.x-1})
        }
        if(cell.x > 1 && cell.y < board.length-2 && board[cell.y+1][cell.x-1] >= 100 && board[cell.y+1][cell.x-1] <= 111 && board[cell.y+2][cell.x+2] == -1){//if can jump piece below and left
            moves.push({y: cell.y+2, x: cell.x-2})
        }
    }

    return moves
}

function clickPiece(e){
    resetSelected()
    document.getElementById(e.target.id).style.border = "3px solid green";
    console.log(e.target.id)
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            if(parseInt(e.target.id) == board[i][j]){ //id of selected piece
                //console.log(board[i][j])
                selectedPiece = {
                    y: i,
                    x: j,
                    id: e.target.id
                }
                if(selectedPiece){
                    console.log(getValidMoves(selectedPiece, board))
                }
            }
        }
    }
}
