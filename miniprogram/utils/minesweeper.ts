enum mineCellStatus{
  empty,
  reveal,
  flag,
  question
}

enum gameStatus{
  playing,
  win,
  fail,
}
export class mineCell{
    status:mineCellStatus;
    isMine:boolean;
    adjacenMines:number;
    constructor(status:mineCellStatus,isMine:boolean,adjacenMines:number){
      this.status = status;
      this.isMine = isMine
      this.adjacenMines = adjacenMines;
    }
}

type Board = mineCell[][];
type minesList = [number,number][];

export class mineBoard{
  rows:number;
  cols:number;
  minesCount:number;
  flagsCount:number;
  board:mineCell[][];
  status:gameStatus;
  time:number;
  minesList:[number,number][];

  constructor(rows:number,cols:number,clickRow:number,clickCol:number,minesCount:number){
    this.rows = rows;
    this.cols = cols;
    this.minesCount = minesCount;
    this.flagsCount = minesCount;
    this.status = 0;
    this.time = 0;
    this.board = [];

    for (let i = 0; i < rows; i++) {
        const row: mineCell[] = [];
        for (let j = 0; j < cols; j++) {
            row.push(new mineCell(mineCellStatus.empty, false, 0));
        }
        this.board.push(row);
    }
    
    for (let i = 0;i<minesCount;i++){
      minesList.pu
    }
    this.createGameBoard(clickRow,clickRow,minesCount);
  }

  createGameBoard(minesCount:number,clickRow:number,clickCol:number){
    
    while(minesCount>0){
      const randomRow = Math.random()*this.rows;
      const randomCol = Math.random()*this.cols;
    }
  }
}

