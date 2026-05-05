const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));

// 🔥 ROUTER FIX: Tell Express to serve the game when someone visits a private /r/ link
app.get('/r/:roomCode', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: "*", 
    methods: ["GET", "POST"] 
  }
});

// 🔥 THE PROFANITY FILTER (Keeps public rooms family-friendly)
const PROFANITY = [
  'fuck', 
  'shit', 
  'bitch', 
  'asshole', 
  'cunt', 
  'dick', 
  'faggot', 
  'nigger', 
  'bastard', 
  'slut', 
  'whore', 
  'kys', 
  'retard'
];

function cleanText(str) {
  if (!str) {
    return str;
  }
  let cleaned = str;
  PROFANITY.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '***');
  });
  return cleaned;
}

const WORD_BANK = [
  // Your Original Words
  {w:'jellyfish', e:'🪼'}, {w:'pizza', e:'🍕'}, {w:'cactus', e:'🌵'}, {w:'submarine', e:'🛥️'}, 
  {w:'popcorn', e:'🍿'}, {w:'rainbow', e:'🌈'}, {w:'microscope', e:'🔬'}, {w:'volcano', e:'🌋'}, 
  {w:'hamburger', e:'🍔'}, {w:'butterfly', e:'🦋'}, {w:'skeleton', e:'💀'}, {w:'skyscraper', e:'🏙️'}, 
  {w:'spaghetti', e:'🍝'}, {w:'astronaut', e:'👨‍🚀'}, {w:'octopus', e:'🐙'}, {w:'hurricane', e:'🌀'}, 
  {w:'keyboard', e:'⌨️'}, {w:'elephant', e:'🐘'}, {w:'telescope', e:'🔭'}, {w:'lighthouse', e:'🚨'}, 
  {w:'dragon', e:'🐉'}, {w:'bicycle', e:'🚲'}, {w:'avocado', e:'🥑'}, {w:'castle', e:'🏰'}, 
  {w:'magnet', e:'🧲'}, {w:'beehive', e:'🐝'}, {w:'mermaid', e:'🧜‍♀️'}, {w:'compass', e:'🧭'}, 
  {w:'tornado', e:'🌪️'}, {w:'diamond', e:'💎'}, {w:'penguin', e:'🐧'}, {w:'fireworks', e:'🎆'}, 
  {w:'guitar', e:'🎸'}, {w:'briefcase', e:'💼'}, {w:'hotdog', e:'🌭'}, {w:'sandwich', e:'🥪'}, 
  {w:'iceberg', e:'🧊'}, {w:'mushroom', e:'🍄'}, {w:'umbrella', e:'🌂'}, {w:'palette', e:'🎨'}, 
  {w:'camera', e:'📷'}, {w:'mailbox', e:'📫'}, {w:'staircase', e:'🪜'}, {w:'pineapple', e:'🍍'}, 
  {w:'waterfall', e:'🌊'}, {w:'rollercoaster', e:'🎢'}, {w:'sunflower', e:'🌻'}, {w:'treasure', e:'💰'},
  {w:'scarecrow', e:'🌾'}, {w:'snowflake', e:'❄️'}, {w:'parachute', e:'🪂'}, {w:'campfire', e:'🔥'}, 
  {w:'dinosaur', e:'🦖'}, {w:'windmill', e:'🎡'}, {w:'spaceship', e:'🚀'}, {w:'headphones', e:'🎧'}, 
  {w:'anchor', e:'⚓'}, {w:'squirrel', e:'🐿️'}, {w:'drum', e:'🥁'}, {w:'balloon', e:'🎈'},
  {w:'bridge', e:'🌉'}, {w:'toothbrush', e:'🪥'}, {w:'microchip', e:'💾'}, {w:'sushi', e:'🍣'}, 
  {w:'lightning', e:'⚡'}, {w:'statue', e:'🗽'}, {w:'suitcase', e:'🧳'}, {w:'koala', e:'🐨'}, 
  {w:'origami', e:'🦢'}, {w:'detective', e:'🕵️'}, {w:'pancake', e:'🥞'}, {w:'hourglass', e:'⌛'},
  {w:'yo-yo', e:'🪀'}, {w:'flamingo', e:'🦩'}, {w:'eyeball', e:'👁️'}, {w:'igloo', e:'❄️'}, 
  {w:'crown', e:'👑'}, {w:'battery', e:'🔋'}, {w:'ladder', e:'🪜'}, {w:'mirror', e:'🪞'},
  
  // 🔥 New Bonus Viral Words
  {w:'helicopter', e:'🚁'}, {w:'snowman', e:'⛄'}, {w:'microphone', e:'🎤'}, {w:'kangaroo', e:'🦘'}, 
  {w:'pyramid', e:'🔺'}, {w:'typewriter', e:'📠'}, {w:'chameleon', e:'🦎'}, {w:'boomerang', e:'🪃'}, 
  {w:'vampire', e:'🧛'}, {w:'unicorn', e:'🦄'}, {w:'thermometer', e:'🌡️'}, {w:'watermelon', e:'🍉'}, 
  {w:'toaster', e:'🍞'}, {w:'scissors', e:'✂️'}, {w:'carousel', e:'🎠'}, {w:'ferris wheel', e:'🎡'}, 
  {w:'hammock', e:'🏕️'}, {w:'trampoline', e:'🤸'}, {w:'stethoscope', e:'🩺'}, {w:'trophy', e:'🏆'}, 
  {w:'joystick', e:'🕹️'}, {w:'shopping cart', e:'🛒'}, {w:'binoculars', e:'🔭'}, {w:'lantern', e:'🏮'}, 
  {w:'sword', e:'⚔️'}, {w:'shield', e:'🛡️'}, {w:'meteor', e:'☄️'}, {w:'aliens', e:'👽'}, 
  {w:'robot', e:'🤖'}, {w:'satellite', e:'🛰️'}, {w:'tractor', e:'🚜'}, {w:'ambulance', e:'🚑'}, 
  {w:'firetruck', e:'🚒'}, {w:'motorcycle', e:'🏍️'}, {w:'scooter', e:'🛴'}, {w:'skateboard', e:'🛹'}, 
  {w:'surfboard', e:'🏄'}, {w:'snowboard', e:'🏂'}, {w:'brain', e:'🧠'}, {w:'ghost', e:'👻'}
];

const rooms = {};

// 🔀 NEW: Professional-grade Fisher-Yates Shuffler
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function getRoom(roomId, settings) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      players: [],
      gameInProgress: false,
      strokeHistory: [],
      baseCanvasImage: null,
      timerInt: null,
      currentPhase: 'lobby',
      timeLeft: 0,
      currentWord: '',
      currentChoices: [],
      currentDrawerId: null,
      round: 1,
      turnsThisRound: 0,
      
      totalRounds: settings?.rounds || 3,
      drawTime: settings?.drawTime || 85,
      hintIntensity: settings?.hints || 'medium', // 🔥 Replaced maxHints
      maxPlayers: settings?.maxPlayers || 8,
      
      hintsFired: 0,
      revealedIdx: [],
      kickVotes: {},               
      bannedSessions: new Set(),   
      wordBank: null,
      shuffleBag: [] // 🔥 NEW: A unique deck of cards for every single room!
    };
  }
  return rooms[roomId];
}
function getActivePlayers(room) {
  return room.players.filter(p => p.connected);
}

function getNextDrawerId(room) {
  const active = getActivePlayers(room);
  if (active.length === 0) {
    return null;
  }
  const idx = active.findIndex(p => p.id === room.currentDrawerId);
  if (idx === -1) {
    return active[0].id;
  }
  return active[(idx + 1) % active.length].id;
}

function broadcastState(room) {
  io.to(room.id).emit('gameState', {
    phase: room.currentPhase,
    time: room.timeLeft,
    word: room.currentWord,
    drawerId: room.currentDrawerId,
    round: room.round,
    totalRounds: room.totalRounds,
    players: getActivePlayers(room),
    revealedIdx: room.revealedIdx
  });
}

function startWordSelection(room) {
  const active = getActivePlayers(room);
  if (active.length < 2) {
    room.gameInProgress = false;
    room.currentPhase = 'lobby';
    io.to(room.id).emit('gameAborted');
    return;
  }
  
  room.currentPhase = 'picking';
  room.timeLeft = 15;
  room.currentWord = '';
  room.revealedIdx = [];
  room.hintsFired = 0;
  room.strokeHistory = [];
  room.baseCanvasImage = null;
  
  room.players.forEach(p => {
    p.guessed = false;
  });
  
  const activeBank = room.wordBank || WORD_BANK;
  
  // 1. If the bag is empty or has fewer than 3 words, grab a fresh deck and shuffle it!
  if (!room.shuffleBag || room.shuffleBag.length < 3) {
      room.shuffleBag = shuffleArray([...activeBank]);
  }

  // 2. Draw 3 words from the "top" of the deck and completely remove them from the bag
  room.currentChoices = [
      room.shuffleBag.pop(),
      room.shuffleBag.pop(),
      room.shuffleBag.pop()
  ];
  const drawer = room.players.find(p => p.id === room.currentDrawerId);
  
  broadcastState(room);
  
  if (drawer && drawer.socketId) {
    io.to(drawer.socketId).emit('yourTurn', room.currentChoices);
  }

  clearInterval(room.timerInt);
  
  room.timerInt = setInterval(() => {
    room.timeLeft--;
    io.to(room.id).emit('timeTick', { time: room.timeLeft, phase: room.currentPhase });
    
    if (room.timeLeft <= 0) {
      handleWordPicked(room, room.currentChoices[0].w); 
    }
  }, 1000);
}

function handleWordPicked(room, word) {
  clearInterval(room.timerInt);
  room.currentPhase = 'drawing';
  room.currentWord = word;
  room.timeLeft = room.drawTime;
  
  broadcastState(room);
  io.to(room.id).emit('wordPicked', word);

  room.timerInt = setInterval(() => {
    room.timeLeft--;
    io.to(room.id).emit('timeTick', { time: room.timeLeft, phase: room.currentPhase });
    
    // 🔥 NEW: Dynamic Hint Intensity Logic
    let hintTriggers = [];
    if (room.hintIntensity === 'slow') hintTriggers = [0.5]; 
    else if (room.hintIntensity === 'medium') hintTriggers = [0.66, 0.33]; 
    else if (room.hintIntensity === 'fast') hintTriggers = [0.75, 0.50, 0.25]; 

    // Calculate the exact seconds those percentages happen
    const triggerSeconds = hintTriggers.map(multiplier => Math.floor(room.drawTime * multiplier));

    if (triggerSeconds.includes(room.timeLeft)) {
         // Find letters that haven't been revealed and aren't spaces
         const unrevealed = room.currentWord.split('').map((_,i) => i).filter(i => !room.revealedIdx.includes(i) && room.currentWord[i] !== ' ');
         
         if (unrevealed.length > 1) { // Always leave at least 1 letter hidden!
            const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
            room.revealedIdx.push(idx);
            io.to(room.id).emit('hintRevealed', idx);
         }
    }

    if (room.timeLeft <= 0) {
      endTurn(room, false);
    }
  }, 1000);
} // 🔥 THIS BRACKET WAS MISSING!
function endTurn(room, allGuessed) {
  clearInterval(room.timerInt);
  room.currentPhase = 'roundEnd';
  room.timeLeft = 4;
  
  const active = getActivePlayers(room);
  io.to(room.id).emit('timeUp', { phase: 'drawing', word: room.currentWord, allGuessed: allGuessed, players: active });

  room.timerInt = setInterval(() => {
    room.timeLeft--;
    io.to(room.id).emit('timeTick', { time: room.timeLeft, phase: room.currentPhase });
    
    if (room.timeLeft <= 0) {
      clearInterval(room.timerInt);
      
      const currentActive = getActivePlayers(room);
      if (currentActive.length < 2) {
        room.gameInProgress = false;
        room.currentPhase = 'lobby';
        io.to(room.id).emit('gameAborted');
        return;
      }

      room.turnsThisRound++;
      if (room.turnsThisRound >= currentActive.length) {
        room.round++;
        room.turnsThisRound = 0;
      }

      const isLastTurn = (room.round > room.totalRounds) || (room.turnsThisRound >= currentActive.length && room.round === room.totalRounds);
      
      if (isLastTurn) {
        room.currentPhase = 'gameOver';
        room.gameInProgress = false;
        io.to(room.id).emit('timeUp', { phase: 'gameOver', players: currentActive }); 
      } else {
        room.currentDrawerId = getNextDrawerId(room);
        startWordSelection(room);
      }
    }
  }, 1000);
}

io.on('connection', (socket) => {
  console.log('⚡ Connected! Socket:', socket.id);

  socket.on('joinGame', (userData) => {
    let roomId = userData.roomId;
    
    if (!roomId) {
      let found = false;
      for (const key in rooms) {
        if (key.startsWith('public-')) {
          const roomObj = rooms[key];
          const activeCount = getActivePlayers(roomObj).length;
          if (activeCount < roomObj.maxPlayers) { 
            roomId = key;
            found = true;
            break;
          }
        }
      }
      if (!found) {
        roomId = 'public-' + Math.random().toString(36).substr(2, 6);
      }
    }

    const room = getRoom(roomId, userData.settings);

    if (room.bannedSessions.has(userData.sessionId)) {
      socket.emit('kicked');
      socket.disconnect();
      return;
    }
    
    if (userData.customWords && userData.customWords.length > 0) {
      if (!room.wordBank) { 
        let uniqueWords = [...new Set(userData.customWords)];
        let customObjs = uniqueWords.map(w => ({ w: w, e: '✨' }));
        
        // If the host provides less than 3 words, borrow from the main bank to prevent breaking the 3-choice menu
        if (customObjs.length < 3) {
           customObjs = customObjs.concat(WORD_BANK).slice(0, 3);
        }
        
        room.wordBank = customObjs; 
        room.shuffleBag = []; // 🔥 Instantly empty the bag so it perfectly shuffles the new custom words!
      }
    }

    socket.roomId = roomId;
    socket.join(roomId);

    let p = room.players.find(p => p.id === userData.sessionId);
    
    if (p) {
      p.socketId = socket.id;
      p.connected = true;
      p.name = userData.name;
      p.avatarDef = userData.avatarDef;
    } else {
      p = { 
        id: userData.sessionId, 
        socketId: socket.id,
        name: userData.name, 
        avatarDef: userData.avatarDef,
        score: 0,
        guessed: false,
        connected: true
      };
      room.players.push(p);
    }

    const active = getActivePlayers(room);
    socket.broadcast.to(room.id).emit('playerJoined', { id: p.id, name: p.name, avatarDef: p.avatarDef, score: p.score, guessed: p.guessed });
    
    if (active.length > room.maxPlayers) {
        socket.emit('kicked'); 
        socket.disconnect();
        return;
    }

    if (room.gameInProgress) {
      socket.emit('gameState', {
        phase: room.currentPhase,
        time: room.timeLeft,
        word: room.currentWord,
        drawerId: room.currentDrawerId,
        round: room.round,
        totalRounds: room.totalRounds,
        players: active, 
        revealedIdx: room.revealedIdx
      });
      
      if (room.currentPhase === 'picking' && room.currentDrawerId === p.id) {
          socket.emit('yourTurn', room.currentChoices);
      }
      
      if (room.currentPhase === 'drawing') {
        socket.emit('catchUpSync', {
          drawerId: room.currentDrawerId,
          baseCanvasImage: room.baseCanvasImage,
          strokes: room.strokeHistory
        });
      }
    } else {
      socket.emit('currentPlayers', active);
    }

    if (active.length >= 2 && !room.gameInProgress && room.currentPhase === 'lobby') {
      room.gameInProgress = true;
      room.round = 1;
      room.turnsThisRound = 0;
      room.currentDrawerId = active[0].id;
      room.players.forEach(p => { 
        p.score = 0; 
        p.guessed = false; 
      });
      
      clearInterval(room.timerInt); 
      
      setTimeout(() => { 
        io.to(room.id).emit('forceStartGame'); 
        startWordSelection(room);
      }, 2000);
    } 
  });

  socket.on('wordPicked', (word) => {
    if (!socket.roomId) {
      return;
    }
    const room = rooms[socket.roomId];
    if (!room) {
      return;
    }

    let p = room.players.find(p => p.socketId === socket.id);
    if (p && room.currentPhase === 'picking' && p.id === room.currentDrawerId) {
      handleWordPicked(room, word);
    }
  });

  socket.on('drawing', (drawData) => {
    if (!socket.roomId) {
      return;
    }
    const room = rooms[socket.roomId];
    if (!room) {
      return;
    }

    if (room.currentPhase === 'drawing') {
      room.strokeHistory.push(drawData);
      socket.broadcast.to(room.id).emit('drawing', drawData);

      if (room.strokeHistory.length >= 150) {
        let p = room.players.find(player => player.socketId === socket.id);
        if (p && p.id === room.currentDrawerId) {
            socket.emit('requestSync');
        }
      }
    }
  });

  socket.on('canvasCommand', (cmd) => {
    if (!socket.roomId) {
      return;
    }
    const room = rooms[socket.roomId];
    if (!room) {
      return;
    }

    if (cmd && cmd.cmd === 'playAgain') {
      room.gameInProgress = false;
      room.currentPhase = 'lobby';
      clearInterval(room.timerInt);
      room.strokeHistory = [];
      room.baseCanvasImage = null;
      
      io.to(room.id).emit('gameAborted');
      
      const active = getActivePlayers(room);
      if (active.length >= 2) {
        room.gameInProgress = true;
        room.round = 1;
        room.turnsThisRound = 0;
        room.currentDrawerId = active[0].id;
        room.players.forEach(p => { 
          p.score = 0; 
          p.guessed = false; 
        });
        
        setTimeout(() => { 
          io.to(room.id).emit('forceStartGame'); 
          startWordSelection(room);
        }, 2000);
      }
    }
    else if (cmd && cmd.cmd === 'sync' && room.currentPhase === 'drawing') {
      room.baseCanvasImage = cmd.data;
      room.strokeHistory = [];
      socket.broadcast.to(room.id).emit('canvasCommand', cmd);
    }
  });

  // 🔥 BUG FIX: Ensure the exact player Name is sent back in the broadcast
  socket.on('rateArt', (rating) => {
    if (!socket.roomId) return;
    const room = rooms[socket.roomId];
    if (!room) return;
    
    let p = room.players.find(player => player.socketId === socket.id);
    if (p) {
        io.to(socket.roomId).emit('artRated', { id: p.id, name: p.name, rating: rating });
    }
  });

  socket.on('chatMessage', (data) => {
    if (!socket.roomId) {
      return;
    }
    data.text = cleanText(data.text);
    socket.broadcast.to(socket.roomId).emit('receiveChat', data);
  });

  socket.on('correctGuess', (data) => {
    if (!socket.roomId) {
      return;
    }
    const room = rooms[socket.roomId];
    if (!room) {
      return;
    }

    let guesser = room.players.find(p => p.id === data.guesserId);
    if (guesser && !guesser.guessed) { 
      guesser.score += data.pts; 
      guesser.guessed = true; 
    }
    
    let drawer = room.players.find(p => p.id === room.currentDrawerId);
    if (drawer) { 
      drawer.score += 50; 
    }

    const active = getActivePlayers(room);
    io.to(room.id).emit('scoreUpdate', active);
    io.to(room.id).emit('correctGuess', data);

    const nonDrawers = active.filter(p => p.id !== drawer?.id);
    if (nonDrawers.length > 0 && nonDrawers.every(p => p.guessed)) {
       endTurn(room, true);
    }
  });

  socket.on('voteKick', (targetId) => {
    if (!socket.roomId) {
      return;
    }
    const room = rooms[socket.roomId];
    if (!room) {
      return;
    }

    let p = room.players.find(p => p.socketId === socket.id);
    if (!p) {
      return;
    }
    if (p.id === targetId) {
      return;
    }

    if (!room.kickVotes[targetId]) {
      room.kickVotes[targetId] = new Set();
    }
    room.kickVotes[targetId].add(p.id);

    const activeCount = getActivePlayers(room).length;
    const requiredVotes = Math.max(2, Math.ceil(activeCount / 2)); 

    const targetPlayer = room.players.find(tp => tp.id === targetId);
    const targetName = targetPlayer ? targetPlayer.name : 'A player';

    if (room.kickVotes[targetId].size >= requiredVotes) {
      room.bannedSessions.add(targetId);
      io.to(room.id).emit('receiveChat', { type: 'system', name: '', text: `🛑 ${targetName} was kicked by a democratic vote.` });
      
      if (targetPlayer && targetPlayer.socketId) {
        io.to(targetPlayer.socketId).emit('kicked');
        io.in(targetPlayer.socketId).disconnectSockets(true);
      }
    } else {
      io.to(room.id).emit('receiveChat', { type: 'system', name: '', text: `🗳️ Kick vote against ${targetName} (${room.kickVotes[targetId].size}/${requiredVotes})` });
    }
  });

  socket.on('disconnect', () => {
    if (!socket.roomId) {
      return;
    }
    const room = rooms[socket.roomId];
    if (!room) {
      return;
    }

    let p = room.players.find(p => p.socketId === socket.id);
    if (p) {
      p.connected = false;
      io.to(room.id).emit('playerLeft', p.id); 
      
      const active = getActivePlayers(room);
      if (active.length === 0) {
        clearInterval(room.timerInt);
        delete rooms[socket.roomId]; 
      } else if (active.length < 2) {
        room.gameInProgress = false;
        clearInterval(room.timerInt);
        room.currentPhase = 'lobby';
        room.strokeHistory = [];
        room.baseCanvasImage = null;
        io.to(room.id).emit('gameAborted');
      } else if (room.gameInProgress && p.id === room.currentDrawerId && (room.currentPhase === 'drawing' || room.currentPhase === 'picking')) {
        endTurn(room, false);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Picazo God-Server is running on port ${PORT}\n`);
});
