export enum mineCellStatus {  // 地块状态
  init,       // 初始状态
  reveal,     // 翻开
  flag,       // 插旗
  question    // 问号
}

export enum gameStatus {    // 游戏状态
  playing,    // 游玩中
  win,        // 胜利
  fail,       // 失败
}

export class mineCell {  // 单个地块信息
  status: mineCellStatus;    // 状态
  isMine: boolean;           // 是否是雷
  adjacentMines: number;     // 周围雷的数量
  adjacentFlags: number;     // 周围旗子的数量

  // 构造函数
  constructor(status: mineCellStatus, isMine: boolean, adjacentMines: number, adjacentFlags: number) {
    this.status = status;
    this.isMine = isMine
    this.adjacentMines = adjacentMines;
    this.adjacentFlags = adjacentFlags;
  }
}

export class MineBoard { // 游戏盘
  rows: number;        // 行数
  cols: number;        // 列数
  minesCount: number;  // 雷数
  flagsCount: number;  // 旗子数
  revealedCell: number;// 未被打开的地块数
  board: mineCell[][]; // 地块信息
  status: gameStatus;  // 游戏状态
  time: number;        // 游玩时间
  minesList: Set<string>;   // 雷区集合
  direction: [number, number][] = [ // 方向向量
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  constructor(rows: number, cols: number, firstClickRow: number, firstClickCol: number, minesCount: number) {
    this.rows = rows;
    this.cols = cols;
    this.minesCount = minesCount;
    this.flagsCount = minesCount;
    this.revealedCell = this.rows * this.cols;
    this.status = 0;
    this.time = 0;
    this.board = [];
    this.minesList = new Set<string>();

    for (let i = 0; i < rows; i++) {
      const row: mineCell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(new mineCell(mineCellStatus.init, false, 0, 0));
      }
      this.board.push(row);
    }

    if (firstClickRow >= 0 && firstClickCol >= 0) {
      this.createGameBoard(firstClickRow, firstClickCol, minesCount);
    }
  }

  // 创建游戏
  createGameBoard(firstClickRow: number, firstClickCol: number, minesCount: number) {
    let placedMines = 0;

    while (placedMines < minesCount) {
      const randomRow = Math.floor(Math.random() * this.rows);
      const randomCol = Math.floor(Math.random() * this.cols);

      const deltaRow = Math.abs(randomRow - firstClickRow);
      const deltaCol = Math.abs(randomCol - firstClickCol);
      if (deltaRow <= 1 && deltaCol <= 1) {
        continue;
      }

      const coord = `${randomRow},${randomCol}`;

      if (!this.minesList.has(coord)) {
        this.minesList.add(coord);
        this.board[randomRow][randomCol].isMine = true;
        placedMines++;
      }
      console.log("this.minesList", this.minesList)
      //console.log("this.rows",this.rows,"this.cols",this.cols)
    }

    console.log("firstClickRow", firstClickRow, "firstClickCol", firstClickCol)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.calculateAdjacentMines(i, j);
      }
    }
    this.revealCell(firstClickRow, firstClickCol);
  }

  // 计算单个地块周围雷数
  calculateAdjacentMines(row: number, col: number) {
    this.board[row][col].adjacentMines = 0;
    for (let i = 0; i < this.direction.length; i++) {
      let targetX = row + this.direction[i][0];
      let targetY = col + this.direction[i][1];
      if (this.isVaildCoord(targetX, targetY) && this.board[targetX][targetY].isMine) {
        this.board[row][col].adjacentMines++;
      }
    }
    //console.log("row",row,"col",col,"adjacentMines", this.board[row][col].adjacentMines)
  }

  // 判断是否为有效坐标
  isVaildCoord(row: number, col: number) {
    return (row >= 0 && row < this.rows && col >= 0 && col < this.cols);
  }

  // 打开地块函数
  revealCell(targetRow: number, targetCol: number) {
    if (this.board[targetRow][targetCol].status !== mineCellStatus.init) {
      return; // 防止重复翻开
    }
    // console.log("before revealedCell",this.revealedCell)
    this.revealedCell--;
    // console.log("after revealedCell",this.revealedCell)
    this.board[targetRow][targetCol].status = mineCellStatus.reveal;

    // 判断输赢
    if (this.board[targetRow][targetCol].isMine === true) {
      this.status = gameStatus.fail;
      this.gameOver();
    }
    else if (this.revealedCell === this.minesCount) {
      //console.log("revealedCell",this.revealedCell)
      this.status = gameStatus.win;
      this.gameOver();
    }

    // 如果格子周围没有雷，将格子周围一圈的格子全部打开
    if (this.board[targetRow][targetCol].adjacentMines === 0) {
      for (let i = 0; i < this.direction.length; i++) {
        let targetX = targetRow + this.direction[i][0];
        let targetY = targetCol + this.direction[i][1];
        if (this.isVaildCoord(targetX, targetY) && !this.board[targetX][targetY].isMine) {
          this.revealCell(targetX, targetY);
        }
      }
    }
  }

  // 游戏结束
  gameOver() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j].status = mineCellStatus.reveal;
      }
    }
  }

  // 插旗
  addFlag(targetRow: number, targetCol: number) {
    if (this.board[targetRow][targetCol].status === mineCellStatus.init && this.flagsCount > 0) {
      this.board[targetRow][targetCol].status = mineCellStatus.flag;
      this.flagsCount--;
      for (let i = 0; i < this.direction.length; i++) {
        let targetX = targetRow + this.direction[i][0];
        let targetY = targetCol + this.direction[i][1];
        if (this.isVaildCoord(targetX, targetY)) {
          this.board[targetX][targetY].adjacentFlags++;
        }
      }
    }
  }

  // 取消插旗
  removeFlag(targetRow: number, targetCol: number) {
    if (this.board[targetRow][targetCol].status === mineCellStatus.flag) {
      this.board[targetRow][targetCol].status = mineCellStatus.init;
      this.flagsCount++;
      for (let i = 0; i < this.direction.length; i++) {
        let targetX = targetRow + this.direction[i][0];
        let targetY = targetCol + this.direction[i][1];
        if (this.isVaildCoord(targetX, targetY)) {
          this.board[targetX][targetY].adjacentFlags--;
        }
      }
    }
  }

  // 双击翻开周围地块
  doubleClickToReveal(targetRow: number, targetCol: number): { row: number, col: number } | null {
    const targetCell = this.board[targetRow][targetCol];
    if (
      targetCell.status === mineCellStatus.reveal &&
      targetCell.adjacentMines > 0 &&
      targetCell.adjacentFlags === targetCell.adjacentMines
    ) {
      for (let i = 0; i < this.direction.length; i++) {
        let targetX = targetRow + this.direction[i][0];
        let targetY = targetCol + this.direction[i][1];
        if (
          this.isVaildCoord(targetX, targetY) &&
          this.board[targetX][targetY].status === mineCellStatus.init
        ) {
          this.revealCell(targetX, targetY);
          if (this.status === gameStatus.fail && this.board[targetX][targetY].isMine) {
            return { row: targetX, col: targetY };
          }
        }
      }
    }
    return null;
  }
}
