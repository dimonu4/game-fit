"use strict";

class game {
  constructor(targets) {
    this.gamePaused= true;
    this.score=0;
    this.targets=targets;
    this.size = config.size;
    this.board = this.renderTable();
    this.drawTable(this.board);
    this.createPlayer(this.targets);
    this.addControll();
    this.initScore();
    this.renderScore(this.score);
    this.renderButtonStatusGame();
  }

  renderButtonStatusGame(){
    if(this.gamePaused==true){
    this._initButtonStatusGame().innerText='Старт';
    }else{
      this._initButtonStatusGame().innerText='Пауза';
    }
  }

  _initButtonStatusGame(){
    return document.querySelector('.statusGame');
  }

  renderTable() {
    let row = '<table class="board"><tbody>';
    for (let r = 0; r < this.size; r++) {
      row += "<tr>";
      for (let c = 0; c < this.size; c++) {
        row += `<td date-row=${r} date-col=${c}></td>`;
      }
      row += "</tr>";
    }
    row += "</tbody></table>";
    return row;
  }
  drawTable(board) {
    document.querySelector('.game').innerHTML = board;
  }
  createPlayer(col){
    let arrCoor=[];
    while(arrCoor.length<col*2+1){
      let playerCoor = this.getRandomCoord();
          if(this._checkRandomArray(playerCoor,arrCoor)){
          arrCoor.push(playerCoor);
          }
    }    
    let [PositionX,PositionY]=arrCoor[0];
    this.player =new player(1,"player", PositionX, PositionY);
    [PositionX,PositionY]=arrCoor[1];
    this.animal = new animal(col,`animal${col}`, PositionX, PositionY, "cat");
    [PositionX,PositionY]=arrCoor[2];
    this.blackhole = new blackhole(col,`blackhole${col}`, PositionX, PositionY, "cat");
    // this.id=2;
    // this.animal = new animal(`${this.id}`,`animal${this.id}`, 2, 2, "dog");
    // this.blackhole = new blackhole(`${this.id}`,`blackhole${this.id}`, 3, 2, "dog");
  }

  _checkRandomArray(pc,ac){
    if(ac.length==0){
        return true;
    }else{
            let j=0;
            let check=0;
            for(let i=0;i<ac.length;i++){
              if(pc[j]==ac[i][j]&&pc[j+1]==ac[i][j+1]){
              check++;
              }
            }
            if(check>0){
                return false;
            }else{
              return true;
            }
          }
  }

  getRandomCoord(){
    let arr= [this.getRandNumber(),this.getRandNumber()];
    return arr;
  }

  getRandNumber(){
    return Math.floor(Math.random()*config.size);
  }

  addControll() {

    this._initButtonStatusGame().addEventListener('click', ()=>{
      this.gamePaused== true? this.gamePaused=false:this.gamePaused=true;
      this.renderButtonStatusGame();
    });

    window.addEventListener("keydown", (event) => {
      if(this.gamePaused==false){
        if (
          this._checkbutton(event) === config.move[0]||
          this._checkbutton(event) === config.move[1] ||
          this._checkbutton(event) === config.move[2] ||
          this._checkbutton(event) === config.move[3]
        ) {
          if (this.animal.grabed) {
            this.animal.changePosition(event);
          }
          if(this.gamePaused==false){this.player.changePosition(event);}
        } else if (this._checkbutton(event) === config.grab) {
          if (this.cangrabed()) {
            this.grub();
          }
        } else if (this._checkbutton(event) === config.rotate) {
          console.log("rotate");
        }
      }
    });
  }

  _checkbutton(event) {
    return event.key;
  }

  cangrabed() {
    let [playerPositionX, playerPositionY] = this.player._getPosition();
    let [animalPositionX, animalPositionY] = this.animal._getPosition();
    if (
      playerPositionX == animalPositionX &&
      playerPositionY == animalPositionY
    ) {
      return true;
    } else {
      return false;
    }
  }

  grub() {
    if (this.animal.grabed == false) {
      this.animal.grabed = true;
    } else {
      this.animal.grabed = false;
    }
  }

  initScore(){
    this.scoreBox=document.querySelector('.score');
  }

  renderScore(score){
    this.scoreBox.innerText=`Scores: ${score}`;
    if(this.gamePaused==true){
      this.gamePaused= false;
    }
  }

  isWin(){
    if(document.querySelector(`.fa-${this.animal.iconName}`)!=null){
      let [blackholePositionX, blackholePositionY] = this.blackhole._getPosition();
       let [animalPositionX, animalPositionY] = this.animal._getPosition();
      if (
        blackholePositionX == animalPositionX &&
        blackholePositionY == animalPositionY
      ) {
        return true;
      }
    }else{
      return false;
    }
  }

}

class object {
  constructor(id,name, positionX, positionY, iconName) {
    this.id=id;
    this.iconName = iconName;
    this.name = name;
    this.positionX = positionX;
    this.positionY = positionY;
    this._objectInit(positionX, positionY);
  }
  positionNow() {
    return document.querySelector(`.${this.name}`);
  }

  changePosition(event) {
    let [objectPositionX, objectPositionY] = this._getPosition();
    let [newPositionX, newPositionY] = this._move(
      event.key,
      objectPositionX,
      objectPositionY
    );
    if (this._checkMove(newPositionX, newPositionY)) {
      this._clearInit();
      this._objectInit(newPositionX, newPositionY);
    }
    if (level.isWin()) {
      level.gamePaused=true;
      let icons=document.querySelectorAll('.fas');
      for(let icon of icons){
        icon.remove();
      }
      level.animal.grabed= false;
      document.querySelector('.blackhole1').classList.remove('blackhole1','animal1');
      document.querySelector('.player').classList.remove('player');
      level.createPlayer(1);
      level.score++;
      level.renderScore(level.score);
     
    }
  }
  _getPosition() {
    return [
      this.positionNow().getAttribute("date-col"),
      this.positionNow().getAttribute("date-row"),
    ];
  }
  _move(direction, objectPositionX, objectPositionY) {
    switch (direction) {
      case "ArrowDown":
        return [+objectPositionX, +objectPositionY + 1];
      case "ArrowUp":
        return [+objectPositionX, +objectPositionY - 1];
      case "ArrowRight":
        return [+objectPositionX + 1, +objectPositionY];
      case "ArrowLeft":
        return [+objectPositionX - 1, +objectPositionY];
    }
  }
  _checkMove(newPositionX, newPositionY) {
    if (
      newPositionX < 0 ||
      newPositionY < 0 ||
      newPositionX > config.size - 1 ||
      newPositionY > config.size - 1
    ) {
      return false;
    } else {
      return true;
    }
  }
  _clearInit() {
    
    if (this.name == `animal${this.id}`){
      let icons = document.querySelectorAll(`.fa-${this.iconName}`);
      icons.forEach((icon)=>{
        if(icon.parentNode.classList.contains(`${this.name}`))
        icon.remove();
      })
    }
   
      // document.querySelector(`.fa-${this.iconName}`).remove();
      this.positionNow().classList.remove(this.name);
  }
  
  _objectInit(positionX = this.positionX, positionY = this.positionY) {
    document
      .querySelector(`[date-col="${positionX}"][date-row="${positionY}"]`)
      .classList.add(this.name);
    if (this.name == `animal${this.id}`)
      this.positionNow().insertAdjacentHTML(
        "beforeend",
        `<i class="fas fa-${this.iconName}"></i>`
      );
    if (this.name == `blackhole${this.id}`)
      this.positionNow().insertAdjacentHTML(
        "beforeend",
        `<i class="fas fa-${this.iconName}"></i>`
      );
  }
}

class player extends object {
  constructor(id,name, positionX, positionY, iconName) {
    super(id,name, positionX, positionY, iconName);
  }
}

class animal extends object {
  constructor(id,name, positionX, positionY, iconName) {
    super(id,name, positionX, positionY, iconName);
    this.grabed = false;
  }
  }

class blackhole extends object {
  constructor(id,name, positionX, positionY, iconName) {
    super(id,name, positionX, positionY, iconName);
  }
}

// function startGame() {
//   let board = renderTable(size);
//   drawTable(board);
// playerInit();
// }
// startGame();
// const subj = new subject();
const level=new game(1);
