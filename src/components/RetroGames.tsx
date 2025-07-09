
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type GameType = 'menu' | 'snake' | 'pong' | 'tetris';

interface Position {
  x: number;
  y: number;
}

export default function RetroGames() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Snake Game State
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);

  // Pong Game State
  const [paddle1Y, setPaddle1Y] = useState(150);
  const [paddle2Y, setPaddle2Y] = useState(150);
  const [ballPos, setBallPos] = useState({ x: 200, y: 150 });
  const [ballVel, setBallVel] = useState({ x: 3, y: 2 });
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  // Tetris Game State
  const [tetrisBoard, setTetrisBoard] = useState<number[][]>(
    Array(20).fill(null).map(() => Array(10).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState({ x: 4, y: 0, shape: [[1, 1], [1, 1]] });

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 300;

  // Snake Game Logic
  const moveSnake = useCallback(() => {
    if (gameOver || currentGame !== 'snake') return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 15) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 15)
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, currentGame]);

  // Pong Game Logic
  const updatePong = useCallback(() => {
    if (currentGame !== 'pong') return;

    setBallPos(prev => {
      let newX = prev.x + ballVel.x;
      let newY = prev.y + ballVel.y;
      let newVelX = ballVel.x;
      let newVelY = ballVel.y;

      // Ball collision with top/bottom walls
      if (newY <= 0 || newY >= CANVAS_HEIGHT - 10) {
        newVelY = -newVelY;
      }

      // Ball collision with paddles
      if (newX <= 20 && newY >= paddle1Y && newY <= paddle1Y + 60) {
        newVelX = -newVelX;
      }
      if (newX >= CANVAS_WIDTH - 30 && newY >= paddle2Y && newY <= paddle2Y + 60) {
        newVelX = -newVelX;
      }

      // Score points
      if (newX < 0) {
        setPlayer2Score(prev => prev + 1);
        newX = CANVAS_WIDTH / 2;
        newY = CANVAS_HEIGHT / 2;
      }
      if (newX > CANVAS_WIDTH) {
        setPlayer1Score(prev => prev + 1);
        newX = CANVAS_WIDTH / 2;
        newY = CANVAS_HEIGHT / 2;
      }

      setBallVel({ x: newVelX, y: newVelY });
      return { x: newX, y: newY };
    });
  }, [ballVel, paddle1Y, paddle2Y, currentGame]);

  // Game loops
  useEffect(() => {
    if (currentGame === 'snake') {
      const gameLoop = setInterval(moveSnake, 150);
      return () => clearInterval(gameLoop);
    }
  }, [moveSnake, currentGame]);

  useEffect(() => {
    if (currentGame === 'pong') {
      const gameLoop = setInterval(updatePong, 16);
      return () => clearInterval(gameLoop);
    }
  }, [updatePong, currentGame]);

  // Input handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentGame === 'snake') {
        switch (e.key) {
          case 'ArrowUp':
            if (direction.y === 0) setDirection({ x: 0, y: -1 });
            break;
          case 'ArrowDown':
            if (direction.y === 0) setDirection({ x: 0, y: 1 });
            break;
          case 'ArrowLeft':
            if (direction.x === 0) setDirection({ x: -1, y: 0 });
            break;
          case 'ArrowRight':
            if (direction.x === 0) setDirection({ x: 1, y: 0 });
            break;
        }
      } else if (currentGame === 'pong') {
        switch (e.key) {
          case 'w':
            setPaddle1Y(prev => Math.max(0, prev - 20));
            break;
          case 's':
            setPaddle1Y(prev => Math.min(CANVAS_HEIGHT - 60, prev + 20));
            break;
          case 'ArrowUp':
            setPaddle2Y(prev => Math.max(0, prev - 20));
            break;
          case 'ArrowDown':
            setPaddle2Y(prev => Math.min(CANVAS_HEIGHT - 60, prev + 20));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGame, direction]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (currentGame === 'snake') {
      // Draw snake
      ctx.fillStyle = '#0f0';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
      });

      // Draw food
      ctx.fillStyle = '#f00';
      ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

      // Game over text
      if (gameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Game Over!', 140, 150);
        ctx.fillText(`Score: ${score}`, 160, 180);
      }
    } else if (currentGame === 'pong') {
      // Draw paddles
      ctx.fillStyle = '#fff';
      ctx.fillRect(10, paddle1Y, 10, 60);
      ctx.fillRect(CANVAS_WIDTH - 20, paddle2Y, 10, 60);

      // Draw ball
      ctx.fillRect(ballPos.x, ballPos.y, 10, 10);

      // Draw center line
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Draw scores
      ctx.font = '24px Arial';
      ctx.fillText(player1Score.toString(), CANVAS_WIDTH / 4, 40);
      ctx.fillText(player2Score.toString(), (3 * CANVAS_WIDTH) / 4, 40);
    } else if (currentGame === 'tetris') {
      // Draw tetris board
      ctx.fillStyle = '#333';
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          ctx.fillRect(col * 20, row * 15, 18, 13);
        }
      }

      // Draw current piece
      ctx.fillStyle = '#0ff';
      currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            ctx.fillRect(
              (currentPiece.x + colIndex) * 20,
              (currentPiece.y + rowIndex) * 15,
              18,
              13
            );
          }
        });
      });
    }
  }, [currentGame, snake, food, gameOver, score, ballPos, paddle1Y, paddle2Y, player1Score, player2Score, currentPiece, tetrisBoard]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: -1 });
    setPlayer1Score(0);
    setPlayer2Score(0);
    setBallPos({ x: 200, y: 150 });
    setBallVel({ x: 3, y: 2 });
    setPaddle1Y(150);
    setPaddle2Y(150);
  };

  const startGame = (game: GameType) => {
    resetGame();
    setCurrentGame(game);
  };

  if (currentGame === 'menu') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
              🎮 Retro Games Arcade
            </CardTitle>
            <CardDescription className="text-lg">
              Classic arcade games recreated with modern web technologies. Choose your adventure!
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => startGame('snake')}>
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🐍</div>
              <CardTitle>Snake</CardTitle>
              <CardDescription>The classic snake game. Eat food, grow longer, don't hit the walls!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Play Snake</Button>
              <div className="mt-2 text-sm text-muted-foreground">
                <strong>Controls:</strong> Arrow keys
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => startGame('pong')}>
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🏓</div>
              <CardTitle>Pong</CardTitle>
              <CardDescription>The original video game. Two paddles, one ball, endless fun!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Play Pong</Button>
              <div className="mt-2 text-sm text-muted-foreground">
                <strong>Controls:</strong> W/S vs ↑/↓
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => startGame('tetris')}>
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🧩</div>
              <CardTitle>Tetris (Demo)</CardTitle>
              <CardDescription>The legendary puzzle game. Stack blocks and clear lines!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">View Demo</Button>
              <div className="mt-2 text-sm text-muted-foreground">
                <strong>Status:</strong> Visual demo only
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-sm">Retro Gaming Experience</Badge>
              <p className="text-sm text-muted-foreground">
                Built with HTML5 Canvas and modern React. Pixel-perfect graphics and authentic gameplay mechanics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentGame('menu')}>
              ← Back to Games
            </Button>
            <CardTitle className="text-2xl">
              {currentGame === 'snake' && '🐍 Snake'}
              {currentGame === 'pong' && '🏓 Pong'}
              {currentGame === 'tetris' && '🧩 Tetris Demo'}
            </CardTitle>
            <Button variant="outline" onClick={resetGame}>
              Reset Game
            </Button>
          </div>
          {currentGame === 'snake' && (
            <CardDescription>Score: {score} {gameOver && '- Game Over!'}</CardDescription>
          )}
          {currentGame === 'pong' && (
            <CardDescription>Player 1: {player1Score} | Player 2: {player2Score}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-border rounded-lg bg-black"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="mt-4 text-center">
            {currentGame === 'snake' && (
              <p className="text-sm text-muted-foreground">
                Use arrow keys to control the snake. Eat red food to grow and score points!
              </p>
            )}
            {currentGame === 'pong' && (
              <p className="text-sm text-muted-foreground">
                Player 1: W/S keys | Player 2: ↑/↓ keys
              </p>
            )}
            {currentGame === 'tetris' && (
              <p className="text-sm text-muted-foreground">
                This is a visual demo of the Tetris board. Full game mechanics coming soon!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
