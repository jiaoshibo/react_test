import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/**
 * 这是一个组件类, 组件会接受一个名为 props 的参数
 */
class Demo extends React.Component{
  render(){
    return (
      { /* JSX */ }
    )
  }
}


/**
 * @param Square 'button' 即每个格子
 */
function Square(props){
  // 函数定义组件：只需简单的写一个以 props 为参数的 function 返回 jsx 元素就OK了
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(){
    super(); // 调用父类的构造函数
    this.state = {
      history:[{
        squares: Array(9).fill(null),
      }],
      setpNumber: 0,
      xIsNext: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.setpNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // concat 连接数组 不改变现有数组，仅仅返回一个被连接的数组副本
      history:history.concat([{
        squares:squares
      }]),
      setpNumber:history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step){
    this.setState({
      setpNumber:step,
      xIsNext:(step % 2) ? false : true,
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.setpNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move)=>{
      const desc = move ? "Move #" + move : "Game start";
      return (
        <li key={move}>
          <a href="#" onClick={()=>this.jumpTo(move)}>{desc}</a>
        </li>
      )
    })

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}