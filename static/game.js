(() => {
  "use strict";

  const DEBUG = new URLSearchParams(window.location.search).has("debug");
  const TILE_SIZE = 8;
  const PLAYER_WIDTH = 10;
  const PLAYER_HEIGHT = 12;
  const PLAYER_FRAME_SIZE = 16;
  const PLAYER_SPRITE_RENDER_OFFSET_Y = 0;
  const PLAYER_SHEET_URL = "/static/assets/game/chris.png";
  const PLAYER_SPEED = 42;
  const PLAYER_WALK_DURATION = 0.16;
  const DIALOG_CHARS_PER_LINE = 26;
  const DIALOG_LINES_PER_PAGE = 2;
  const DIALOG_PREVIEW_CHAR_LIMIT = DIALOG_CHARS_PER_LINE * DIALOG_LINES_PER_PAGE * 3;
  const POST_LIST_URL = "/posts/index.html";
  const HOUSE_TILESET_URL = "/static/assets/game/house_tiles.png";
  const HOUSE_OBJECT_SHEET_URL = "/static/assets/game/players_house.png";
  const PLAYERS_ROOM_TILESET_URL = "/static/assets/game/players_room.png";
  const PLAYERS_ROOM_METATILES_URL = "/static/assets/game/players_room_metatiles.bin";
  const N64_SPRITE_URL = "/static/assets/game/n64.png";
  const ROOM_OFFSET_X = 16;
  const ROOM_OFFSET_Y = 8;
  const ROOM_BLOCK_WIDTH = 4;
  const ROOM_BLOCK_HEIGHT = 4;
  const ROOM_BLOCK_SIZE = 32;
  const ROOM_TILESET_COLUMNS = 16;

  const START_TILE = { x: 8, y: 12 };

  const MAP = Array.from({ length: 18 }, (_, y) =>
    Array.from({ length: 20 }, (_, x) => {
      if (x === 0 || x === 19 || y === 0 || y < 5) {
        return "#";
      }
      return ".";
    }).join(""),
  );

  const PLAYER_FRAMES = {
    down: [
      { x: 0, y: 0 },
      { x: 0, y: 48 },
    ],
    up: [
      { x: 0, y: 16 },
      { x: 0, y: 64 },
    ],
    right: [
      { x: 0, y: 32, flip: true },
      { x: 0, y: 80, flip: true },
    ],
    left: [
      { x: 0, y: 32 },
      { x: 0, y: 80 },
    ],
  };

  const HOUSE_TILES = {
    floor: { x: 1, y: 0 },
    floorAlt: { x: 2, y: 0 },
    wallTop: { x: 0, y: 0 },
    wall: { x: 0, y: 1 },
    wallCornerLeft: { x: 0, y: 2 },
    wallCornerRight: { x: 1, y: 2 },
    shadow: { x: 0, y: 1 },
  };

  const HOUSE_OBJECTS = [
    {
      id: "tv",
      x: 16,
      y: 32,
      solid: true,
      sprite: { x: 48, y: 0, w: 16, h: 16 },
    },
    {
      id: "topCounter",
      x: 72,
      y: 32,
      solid: true,
      custom: "counter",
      sprite: { x: 0, y: 0, w: 48, h: 24 },
    },
    {
      id: "bookshelf",
      x: 128,
      y: 24,
      solid: true,
      interact: "bookshelf",
      hitbox: { x: 0, y: 8, w: 16, h: 32 },
      sprite: { x: 112, y: 0, w: 16, h: 32 },
      sprites: [
        { x: 112, y: 0, w: 16, h: 16, dx: 0, dy: 0 },
        { x: 112, y: 16, w: 16, h: 16, dx: 0, dy: 16 },
      ],
    },
    {
      id: "bed",
      x: 8,
      y: 96,
      solid: true,
      sprite: { x: 64, y: 16, w: 16, h: 32 },
      sprites: [
        { x: 64, y: 16, w: 16, h: 16, dx: 0, dy: 0 },
        { x: 64, y: 32, w: 16, h: 16, dx: 0, dy: 16 },
      ],
    },
    {
      id: "computer",
      x: 88,
      y: 72,
      solid: true,
      sprite: { x: 0, y: 16, w: 16, h: 16 },
    },
    {
      id: "chair",
      x: 88,
      y: 88,
      solid: true,
      sprite: { x: 16, y: 0, w: 16, h: 16 },
    },
  ];

  const PLAYER_ROOM_COLLISION = {
    0x01: ["wall", "wall", "wall", "wall"],
    0x02: ["wall", "staircase", "floor", "floor"],
    0x03: ["wall", "wall", "tv", "bookshelf"],
    0x04: ["wall", "wall", "floor", "floor"],
    0x05: ["floor", "floor", "floor", "floor"],
    0x06: ["floor", "floor", "floor", "floor"],
    0x07: ["wall", "wall", "floor", "floor"],
    0x1b: ["wall", "floor", "wall", "floor"],
    0x1f: ["town-map", "staircase", "floor", "floor"],
  };

  const WALKABLE_COLLISION = new Set(["floor", "staircase"]);
  const DECORATION_OBJECTS = [
    // Optional room decoration sprite from PlayersHouse2F_MapEvents.
    { id: "n64", x: 4, y: 2, w: 16, h: 16, solid: true },
  ];
  const INTERACTIONS = [
    {
      id: "tv",
      rect: { x: 0, y: 1, w: 16, h: 16 },
      title: "TV",
      text: "The TV isn't on...",
    },
    {
      id: "radio",
      rect: { x: 1, y: 1, w: 16, h: 16 },
      title: "Radio",
      text: "It's quiet. Maybe there's nothing good on right now.",
    },
    {
      id: "table",
      rect: { x: 4, y: 4, w: 32, h: 16 },
      title: "Table",
      text: "A sturdy table. It has probably seen a lot of snacks.",
    },
    {
      id: "chair",
      rect: { x: 3, y: 1, w: 16, h: 16 },
      title: "Chair",
      text: "A chair pulled out just enough to trip over.",
    },
    {
      id: "bookshelf",
      rect: { x: 5, y: 1, w: 16, h: 16 },
      front: { x: 5, y: 2, w: 16, h: 16 },
      facing: "up",
      action: "posts",
    },
    {
      id: "poster",
      rect: { x: 6, y: 0, w: 16, h: 16 },
      title: "Town Map",
      text: "It's a map of Johto. Home feels very small from here.",
    },
    {
      id: "bed",
      rect: { x: 0, y: 6, w: 16, h: 32 },
      title: "Bed",
      text: "I wish I could sleep in the bed right now.",
    },
    {
      id: "console",
      rect: { x: 4, y: 2, w: 16, h: 16 },
      title: "Game Console",
      text: "There's a game paused here. It looks kind of familiar.",
    },
  ];
  const REFERENCE_ROOM_BLOCKS = new Uint8Array([
    0x01, 0x04, 0x03, 0x1f,
    0x05, 0x05, 0x05, 0x05,
    0x05, 0x05, 0x07, 0x05,
    0x1b, 0x05, 0x05, 0x05,
  ]);

  const rgb5 = (r, g, b, a = 255) => [
    Math.round((r / 31) * 255),
    Math.round((g / 31) * 255),
    Math.round((b / 31) * 255),
    a,
  ];

  const toBackgroundPalette = ([light, midLight, midDark, dark]) => ({
    0: dark,
    85: midDark,
    170: midLight,
    255: light,
  });

  const toObjectPalette = ([light, midLight, midDark, dark]) => ({
    0: dark,
    85: midDark,
    170: midLight,
    255: [light[0], light[1], light[2], 0],
  });

  const BG_PALETTES = {
    GRAY: toBackgroundPalette([rgb5(30, 28, 26), rgb5(19, 19, 19), rgb5(13, 13, 13), rgb5(7, 7, 7)]),
    RED: toBackgroundPalette([rgb5(30, 28, 26), rgb5(31, 19, 24), rgb5(30, 10, 6), rgb5(7, 7, 7)]),
    GREEN: toBackgroundPalette([rgb5(18, 24, 9), rgb5(15, 20, 1), rgb5(9, 13, 0), rgb5(7, 7, 7)]),
    WATER: toBackgroundPalette([rgb5(30, 28, 26), rgb5(15, 16, 31), rgb5(9, 9, 31), rgb5(7, 7, 7)]),
    YELLOW: toBackgroundPalette([rgb5(30, 28, 26), rgb5(31, 31, 7), rgb5(31, 16, 1), rgb5(7, 7, 7)]),
    BROWN: toBackgroundPalette([rgb5(26, 24, 17), rgb5(21, 17, 7), rgb5(16, 13, 3), rgb5(7, 7, 7)]),
    ROOF: toBackgroundPalette([rgb5(30, 28, 26), rgb5(17, 19, 31), rgb5(14, 16, 31), rgb5(7, 7, 7)]),
    TEXT: toBackgroundPalette([rgb5(31, 31, 16), rgb5(31, 31, 16), rgb5(14, 9, 0), rgb5(0, 0, 0)]),
  };

  const OVERWORLD_PALETTES = {
    RED: toObjectPalette([rgb5(27, 31, 27), rgb5(31, 19, 10), rgb5(31, 7, 1), rgb5(0, 0, 0)]),
    BROWN: toObjectPalette([rgb5(27, 31, 27), rgb5(31, 19, 10), rgb5(15, 10, 3), rgb5(0, 0, 0)]),
  };

  const PLAYER_ROOM_TILE_PALETTES = [
    "BROWN", "BROWN", "BROWN", "GRAY", "GRAY", "GRAY", "GRAY", "GREEN",
    "GREEN", "RED", "RED", "GRAY", "GRAY", "RED", "RED", "RED",
    "BROWN", "BROWN", "BROWN", "GRAY", "GRAY", "GRAY", "GRAY", "GREEN",
    "GREEN", "RED", "RED", "GRAY", "GRAY", "WATER", "RED", "RED",
    "BROWN", "BROWN", "BROWN", "GRAY", "GRAY", "GRAY", "GRAY", "GREEN",
    "GREEN", "ROOF", "ROOF", "GRAY", "GRAY", "YELLOW", "RED", "RED",
    "BROWN", "BROWN", "BROWN", "GRAY", "GRAY", "GRAY", "GRAY", "GREEN",
    "GREEN", "ROOF", "ROOF", "WATER", "WATER", "GREEN", "RED", "RED",
    "GRAY", "GRAY", "GRAY", "GRAY", "BROWN", "BROWN", "BROWN", "GREEN",
    "GREEN", "YELLOW", "YELLOW", "WATER", "WATER", "BROWN", "YELLOW", "YELLOW",
    "GRAY", "GRAY", "GRAY", "GRAY", "BROWN", "BROWN", "BROWN", "GREEN",
    "GREEN", "YELLOW", "YELLOW", "GRAY", "GRAY", "BROWN", "YELLOW", "YELLOW",
  ];

  const FONT = {
    A: ["111", "101", "111", "101", "101"],
    B: ["110", "101", "110", "101", "110"],
    C: ["111", "100", "100", "100", "111"],
    D: ["110", "101", "101", "101", "110"],
    E: ["111", "100", "110", "100", "111"],
    F: ["111", "100", "110", "100", "100"],
    G: ["111", "100", "101", "101", "111"],
    H: ["101", "101", "111", "101", "101"],
    I: ["111", "010", "010", "010", "111"],
    J: ["001", "001", "001", "101", "111"],
    K: ["101", "101", "110", "101", "101"],
    L: ["100", "100", "100", "100", "111"],
    M: ["101", "111", "111", "101", "101"],
    N: ["101", "111", "111", "111", "101"],
    O: ["111", "101", "101", "101", "111"],
    P: ["111", "101", "111", "100", "100"],
    Q: ["111", "101", "101", "111", "001"],
    R: ["111", "101", "111", "110", "101"],
    S: ["111", "100", "111", "001", "111"],
    T: ["111", "010", "010", "010", "010"],
    U: ["101", "101", "101", "101", "111"],
    V: ["101", "101", "101", "101", "010"],
    W: ["101", "101", "111", "111", "101"],
    X: ["101", "101", "010", "101", "101"],
    Y: ["101", "101", "010", "010", "010"],
    Z: ["111", "001", "010", "100", "111"],
    0: ["111", "101", "101", "101", "111"],
    1: ["010", "110", "010", "010", "111"],
    2: ["111", "001", "111", "100", "111"],
    3: ["111", "001", "111", "001", "111"],
    4: ["101", "101", "111", "001", "001"],
    5: ["111", "100", "111", "001", "111"],
    6: ["111", "100", "111", "101", "111"],
    7: ["111", "001", "010", "010", "010"],
    8: ["111", "101", "111", "101", "111"],
    9: ["111", "101", "111", "001", "111"],
    ".": ["000", "000", "000", "000", "010"],
    ",": ["000", "000", "000", "010", "100"],
    ":": ["000", "010", "000", "010", "000"],
    ";": ["000", "010", "000", "010", "100"],
    "!": ["010", "010", "010", "000", "010"],
    "?": ["111", "001", "011", "000", "010"],
    "'": ["010", "010", "000", "000", "000"],
    "-": ["000", "000", "111", "000", "000"],
    "/": ["001", "001", "010", "100", "100"],
    "(": ["001", "010", "010", "010", "001"],
    ")": ["100", "010", "010", "010", "100"],
    "[": ["110", "100", "100", "100", "110"],
    "]": ["011", "001", "001", "001", "011"],
    " ": ["000", "000", "000", "000", "000"],
  };

  const player = {
    x: START_TILE.x * TILE_SIZE + TILE_SIZE / 2,
    y: START_TILE.y * TILE_SIZE + TILE_SIZE / 2,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT,
    moveX: 0,
    moveY: 0,
    lastFacing: "down",
    walkTime: 0,
    isMoving: false,
  };

  const input = new Set();
  const posts = {
    links: [],
    loading: false,
    cache: new Map(),
    cacheReady: false,
  };

  const ui = {
    isPopupOpen: false,
    loadingPost: false,
    dialogue: {
      title: "",
      href: "",
      isAtEnd: false,
      lines: [],
      page: 0,
    },
  };

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const postPopup = document.getElementById("post-popup");
  const postTitle = document.getElementById("post-title");
  const postExcerpt = document.getElementById("post-excerpt");
  const postLink = document.getElementById("post-link");
  const postClose = document.getElementById("post-close");
  const parser = new DOMParser();

  const mapHeight = MAP.length;
  const mapWidth = MAP[0].length;
  const mapColumnCount = mapWidth * TILE_SIZE;
  const mapRowCount = mapHeight * TILE_SIZE;

  const tileCache = new Map();
  const playerCache = new Map();
  const roomCache = new Map();
  const debugState = {
    overlay: null,
    label: null,
  };

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Unable to load image asset: ${url}`));
      image.src = url;
    });

  const loadBinary = async (url) => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unable to load binary asset: ${url}`);
    }

    return new Uint8Array(await response.arrayBuffer());
  };

  const applyPalette = (image, palette) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;
    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const shade = pixels[i] < 43 ? 0 : pixels[i] < 128 ? 85 : pixels[i] < 213 ? 170 : 255;
      const [r, g, b, a] = palette[shade] || palette[255];
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
      pixels[i + 3] = a;
    }

    context.putImageData(imageData, 0, 0);
    return canvas;
  };

  const getFrame = (source, sx, sy, sw, sh) => {
    const frame = document.createElement("canvas");
    const frameCtx = frame.getContext("2d");
    frame.width = sw;
    frame.height = sh;
    frameCtx.imageSmoothingEnabled = false;
    frameCtx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
    return frame;
  };

  const getPalettizedTile = (source, tileId) => {
    const paletteName = PLAYER_ROOM_TILE_PALETTES[tileId] || "GRAY";
    const cacheKey = `${tileId}:${paletteName}`;
    const cachedTile = tileCache.get("roomTiles")?.get(cacheKey);
    if (cachedTile) {
      return cachedTile;
    }

    const palette = BG_PALETTES[paletteName] || BG_PALETTES.GRAY;
    const tileCanvas = document.createElement("canvas");
    const tileCtx = tileCanvas.getContext("2d");
    const sx = (tileId % ROOM_TILESET_COLUMNS) * TILE_SIZE;
    const sy = Math.floor(tileId / ROOM_TILESET_COLUMNS) * TILE_SIZE;

    tileCanvas.width = TILE_SIZE;
    tileCanvas.height = TILE_SIZE;
    tileCtx.imageSmoothingEnabled = false;
    tileCtx.drawImage(source, sx, sy, TILE_SIZE, TILE_SIZE, 0, 0, TILE_SIZE, TILE_SIZE);

    const imageData = tileCtx.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const shade = pixels[i] < 43 ? 0 : pixels[i] < 128 ? 85 : pixels[i] < 213 ? 170 : 255;
      const [r, g, b, a] = palette[shade];
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
      pixels[i + 3] = a;
    }

    tileCtx.putImageData(imageData, 0, 0);
    tileCache.get("roomTiles")?.set(cacheKey, tileCanvas);
    return tileCanvas;
  };
  canvas.width = mapColumnCount;
  canvas.height = mapRowCount;

  const keyToDirection = new Map([
    ["w", "up"],
    ["W", "up"],
    ["ArrowUp", "up"],
    ["a", "left"],
    ["A", "left"],
    ["ArrowLeft", "left"],
    ["s", "down"],
    ["S", "down"],
    ["ArrowDown", "down"],
    ["d", "right"],
    ["D", "right"],
    ["ArrowRight", "right"],
  ]);

  const getTilePosition = (type) => HOUSE_TILES[type] || HOUSE_TILES.floor;

  const drawPlayersRoomBlock = (targetCtx, tileset, metatiles, blockId, destX, destY) => {
    const base = blockId * 16;
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const tileId = metatiles[base + row * 4 + col];
        targetCtx.drawImage(getPalettizedTile(tileset, tileId), destX + col * TILE_SIZE, destY + row * TILE_SIZE);
      }
    }
  };

  const buildPlayersRoomMap = (tileset, metatiles, blocks) => {
    const roomCanvas = document.createElement("canvas");
    const roomCtx = roomCanvas.getContext("2d");

    roomCanvas.width = ROOM_BLOCK_WIDTH * ROOM_BLOCK_SIZE;
    roomCanvas.height = ROOM_BLOCK_HEIGHT * ROOM_BLOCK_SIZE;
    roomCtx.imageSmoothingEnabled = false;

    blocks.forEach((blockId, index) => {
      const blockX = index % ROOM_BLOCK_WIDTH;
      const blockY = Math.floor(index / ROOM_BLOCK_WIDTH);
      drawPlayersRoomBlock(
        roomCtx,
        tileset,
        metatiles,
        blockId,
        blockX * ROOM_BLOCK_SIZE,
        blockY * ROOM_BLOCK_SIZE,
      );
    });

    return roomCanvas;
  };

  const applyReferenceRoomDecorations = () => new Uint8Array(REFERENCE_ROOM_BLOCKS);

  const createDebugOverlay = () => {
    if (!DEBUG) {
      return;
    }

    const overlay = document.createElement("pre");
    overlay.setAttribute("aria-live", "polite");
    overlay.style.position = "fixed";
    overlay.style.top = "0.5rem";
    overlay.style.left = "0.5rem";
    overlay.style.zIndex = "10";
    overlay.style.background = "rgba(12, 12, 14, 0.8)";
    overlay.style.color = "#cfd7ff";
    overlay.style.border = "1px solid #3b3f57";
    overlay.style.padding = "0.45rem";
    overlay.style.fontSize = "11px";
    overlay.style.lineHeight = "1.3";
    overlay.style.pointerEvents = "none";
    overlay.style.whiteSpace = "pre";
    overlay.style.maxWidth = "180px";
    overlay.style.wordBreak = "break-all";
    document.body.appendChild(overlay);

    debugState.overlay = overlay;
    debugState.label = overlay;
  };

  const updateDebugOverlay = () => {
    if (!DEBUG || !debugState.label) {
      return;
    }

    const tileX = Math.floor(player.x / TILE_SIZE);
    const tileY = Math.floor(player.y / TILE_SIZE);
    debugState.label.textContent = [
      `facing: ${player.lastFacing}`,
      `frame: ${player.isMoving ? Math.floor(player.walkTime / PLAYER_WALK_DURATION) % 2 : 0}`,
      `tile: ${tileX},${tileY}`,
      `px: ${player.x.toFixed(1)},${player.y.toFixed(1)}`,
      `walk: ${player.isMoving ? "on" : "off"}`,
      `spriteY:`,
      ` up [${PLAYER_FRAMES.up.map((frame) => frame.y).join(",")}]`,
      `down [${PLAYER_FRAMES.down.map((frame) => frame.y).join(",")}]`,
      `right [${PLAYER_FRAMES.right.map((frame) => frame.y).join(",")}]`,
      `left [${PLAYER_FRAMES.left.map((frame) => frame.y).join(",")}]`,
    ].join("\n");
  };

  const installDebugWindowAPI = () => {
    if (!DEBUG) {
      return;
    }

    window.__gameDebug = {
      setFacing: (direction) => {
        if (!PLAYER_FRAMES[direction]) {
          return;
        }
        player.lastFacing = direction;
      },
      setPosition: ({ x, y }) => {
        if (typeof x === "number") {
          player.x = x;
        }
        if (typeof y === "number") {
          player.y = y;
        }
      },
      setTilePosition: ({ x, y }) => {
        if (typeof x === "number") {
          player.x = x * TILE_SIZE + TILE_SIZE / 2;
        }
        if (typeof y === "number") {
          player.y = y * TILE_SIZE + TILE_SIZE / 2;
        }
      },
      getState: () => ({
        tileX: Math.floor(player.x / TILE_SIZE),
        tileY: Math.floor(player.y / TILE_SIZE),
        pxX: player.x,
        pxY: player.y,
        facing: player.lastFacing,
        walking: player.isMoving,
        walkTime: player.walkTime,
      }),
      pressDirection: async (direction, durationMs = 180) => {
        if (!PLAYER_FRAMES[direction]) {
          return;
        }

        player.lastFacing = direction;
        const axes = {
          up: [0, -1],
          down: [0, 1],
          left: [-1, 0],
          right: [1, 0],
        };
        const [dx, dy] = axes[direction];
        player.moveX = dx;
        player.moveY = dy;
        player.isMoving = true;
        const start = performance.now();

        return new Promise((resolve) => {
          const step = () => {
            const now = performance.now();
            update((now - start) / 1000);
            if (now - start < durationMs) {
              requestAnimationFrame(step);
              return;
            }

            player.moveX = 0;
            player.moveY = 0;
            player.isMoving = false;
            player.walkTime = 0;
            resolve();
          };
          step();
        });
      },
    };
  };

  const buildAssetPack = async () => {
    const [playerSheet, houseSheet, objectSheet, roomSheet, n64Sheet, roomMetatiles] = await Promise.all([
      loadImage(PLAYER_SHEET_URL),
      loadImage(HOUSE_TILESET_URL),
      loadImage(HOUSE_OBJECT_SHEET_URL),
      loadImage(PLAYERS_ROOM_TILESET_URL),
      loadImage(N64_SPRITE_URL),
      loadBinary(PLAYERS_ROOM_METATILES_URL),
    ]);
    tileCache.set("roomTiles", new Map());

    const spriteSource = applyPalette(playerSheet, OVERWORLD_PALETTES.RED);
    const houseSource = applyPalette(houseSheet, BG_PALETTES.BROWN);
    const objectSource = applyPalette(objectSheet, BG_PALETTES.BROWN);
    const n64Source = applyPalette(n64Sheet, OVERWORLD_PALETTES.BROWN);
    const decoratedRoomBlocks = applyReferenceRoomDecorations();
    const textures = new Map();
    const players = new Map();
    const objects = new Map();

    Object.keys(HOUSE_TILES).forEach((type) => {
      const { x, y } = getTilePosition(type);
      const tileCanvas = document.createElement("canvas");
      const tileCtx = tileCanvas.getContext("2d");
      tileCanvas.width = TILE_SIZE;
      tileCanvas.height = TILE_SIZE;
      tileCtx.imageSmoothingEnabled = false;
      tileCtx.drawImage(houseSource, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE, 0, 0, TILE_SIZE, TILE_SIZE);
      textures.set(type, tileCanvas);
    });

    HOUSE_OBJECTS.forEach((object) => {
      if (object.custom) {
        return;
      }

      const parts = object.sprites || [{ ...object.sprite, dx: 0, dy: 0 }];
      const composed = document.createElement("canvas");
      const composedCtx = composed.getContext("2d");

      composed.width = object.sprite.w;
      composed.height = object.sprite.h;
      composedCtx.imageSmoothingEnabled = false;

      parts.forEach((part) => {
        composedCtx.drawImage(
          objectSource,
          part.x,
          part.y,
          part.w,
          part.h,
          part.dx || 0,
          part.dy || 0,
          part.w,
          part.h,
        );
      });

      objects.set(object.id, composed);
    });

    ["up", "down", "left", "right"].forEach((direction) => {
      const sourceFrames = PLAYER_FRAMES[direction] || PLAYER_FRAMES.down;
      sourceFrames.forEach((sourceFrame, step) => {
        players.set(
          `${direction}:${step}`,
          getFrame(
            spriteSource,
            sourceFrame.x,
            sourceFrame.y,
            PLAYER_FRAME_SIZE,
            PLAYER_FRAME_SIZE,
          ),
        );
      });
    });

    tileCache.set("textures", textures);
    tileCache.set("objects", objects);
    roomCache.set("canvas", buildPlayersRoomMap(roomSheet, roomMetatiles, decoratedRoomBlocks));
    roomCache.set("blocks", decoratedRoomBlocks);
    roomCache.set("sprites", new Map([["n64", n64Source]]));
    playerCache.set("frames", players);
  };

  const tileAt = (tileX, tileY) => {
    if (tileX < 0 || tileY < 0 || tileY >= mapHeight || tileX >= mapWidth) {
      return "#";
    }

    return MAP[tileY]?.[tileX] || "#";
  };

  const objectAt = (tileX, tileY) =>
    HOUSE_OBJECTS.find((object) => {
      const hitbox = object.hitbox || { x: 0, y: 0, w: object.sprite.w, h: object.sprite.h };
      const left = Math.floor((object.x + hitbox.x) / TILE_SIZE);
      const top = Math.floor((object.y + hitbox.y) / TILE_SIZE);
      const right = Math.ceil((object.x + hitbox.x + hitbox.w) / TILE_SIZE);
      const bottom = Math.ceil((object.y + hitbox.y + hitbox.h) / TILE_SIZE);
      return tileX >= left && tileX < right && tileY >= top && tileY < bottom;
    });

  const roomCollisionAt = (x, y) => {
    const localX = x - ROOM_OFFSET_X;
    const localY = y - ROOM_OFFSET_Y;
    const roomWidth = ROOM_BLOCK_WIDTH * ROOM_BLOCK_SIZE;
    const roomHeight = ROOM_BLOCK_HEIGHT * ROOM_BLOCK_SIZE;

    if (localX < 0 || localY < 0 || localX >= roomWidth || localY >= roomHeight) {
      return "wall";
    }

    const blockX = Math.floor(localX / ROOM_BLOCK_SIZE);
    const blockY = Math.floor(localY / ROOM_BLOCK_SIZE);
    const blockId = roomCache.get("blocks")?.[blockY * ROOM_BLOCK_WIDTH + blockX] ?? 0x01;
    const quadrantX = Math.floor((localX % ROOM_BLOCK_SIZE) / 16);
    const quadrantY = Math.floor((localY % ROOM_BLOCK_SIZE) / 16);
    const collisions = PLAYER_ROOM_COLLISION[blockId] || PLAYER_ROOM_COLLISION[0x01];

    return collisions[quadrantY * 2 + quadrantX] || "wall";
  };

  const isWalkablePixel = (x, y) => WALKABLE_COLLISION.has(roomCollisionAt(x, y));

  const roomObjectAtPixel = (x, y) =>
    DECORATION_OBJECTS.find((object) => {
      if (!object.solid) {
        return false;
      }

      const left = ROOM_OFFSET_X + object.x * 16;
      const top = ROOM_OFFSET_Y + object.y * 16;
      return x >= left && x < left + object.w && y >= top && y < top + object.h;
    });

  const canStandAt = (x, y) => {
    const halfW = player.w / 2 - 1;
    const halfH = player.h / 2 - 1;
    const corners = [
      [x - halfW, y - halfH],
      [x + halfW, y - halfH],
      [x - halfW, y + halfH],
      [x + halfW, y + halfH],
    ];

    return corners.every(([cx, cy]) => isWalkablePixel(cx, cy) && !roomObjectAtPixel(cx, cy));
  };

  const getFacingPoint = () => {
    const reach = 12;
    const offsets = {
      up: [0, -reach],
      down: [0, reach],
      left: [-reach, 0],
      right: [reach, 0],
    };
    const [dx, dy] = offsets[player.lastFacing] || offsets.down;

    return { x: player.x + dx, y: player.y + dy };
  };

  const roomRectToPixels = (rect) => ({
    x: ROOM_OFFSET_X + rect.x * 16,
    y: ROOM_OFFSET_Y + rect.y * 16,
    w: rect.w,
    h: rect.h,
  });

  const pointInRect = (point, rect) =>
    point.x >= rect.x
      && point.x < rect.x + rect.w
      && point.y >= rect.y
      && point.y < rect.y + rect.h;

  const distanceToRect = (point, rect) => {
    const dx = Math.max(rect.x - point.x, 0, point.x - (rect.x + rect.w));
    const dy = Math.max(rect.y - point.y, 0, point.y - (rect.y + rect.h));
    return Math.hypot(dx, dy);
  };

  const findNearbyInteraction = () => {
    const facingPoint = getFacingPoint();
    const playerPoint = { x: player.x, y: player.y };
    const candidates = INTERACTIONS
      .map((interaction) => {
        const rect = roomRectToPixels(interaction.rect);
        const frontRect = interaction.front ? roomRectToPixels(interaction.front) : null;
        const isFacingFromFront = frontRect
          ? player.lastFacing === interaction.facing && pointInRect(playerPoint, frontRect)
          : false;
        return {
          interaction,
          rect,
          isFacingFromFront,
          facingDistance: pointInRect(facingPoint, rect) ? 0 : distanceToRect(facingPoint, rect),
          playerDistance: distanceToRect(playerPoint, rect),
        };
      })
      .filter(({ interaction, isFacingFromFront, facingDistance, playerDistance }) => {
        if (interaction.front) {
          return isFacingFromFront;
        }

        return facingDistance <= 8 || playerDistance <= 18;
      })
      .sort((a, b) => a.facingDistance - b.facingDistance || a.playerDistance - b.playerDistance);

    return candidates[0]?.interaction || null;
  };

  const setDirectionFromInput = () => {
    player.moveX = 0;
    player.moveY = 0;

    if (input.has("up")) {
      player.moveY -= 1;
      player.lastFacing = "up";
    }

    if (input.has("down")) {
      player.moveY += 1;
      player.lastFacing = "down";
    }

    if (input.has("left")) {
      player.moveX -= 1;
      player.lastFacing = "left";
    }

    if (input.has("right")) {
      player.moveX += 1;
      player.lastFacing = "right";
    }

    if (player.moveX !== 0 && player.moveY !== 0) {
      const magnitude = Math.hypot(player.moveX, player.moveY);
      player.moveX /= magnitude;
      player.moveY /= magnitude;
    }

    player.isMoving = player.moveX !== 0 || player.moveY !== 0;
  };

  const drawTile = (x, y, tileCode) => {
    const px = x * TILE_SIZE;
    const py = y * TILE_SIZE;
    let type = "floor";
    if (tileCode === "#") {
      type = y === 4 ? "wallTop" : "wall";
      if (y === mapHeight - 1) {
        type = x % 2 === 0 ? "wallCornerLeft" : "wallCornerRight";
      }
    } else if ((x + y) % 7 === 0) {
      type = "floorAlt";
    }
    const texture = tileCache.get("textures")?.get(type);

    if (!texture) {
      ctx.fillStyle = "#000";
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      return;
    }

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(texture, px, py);
  };

  const drawRoomShell = () => {
    ctx.fillStyle = "#a88f36";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#6f5d2c";
    for (let y = 42; y < canvas.height; y += 8) {
      ctx.fillRect(0, y, canvas.width, 3);
    }

    ctx.fillStyle = "#cfc078";
    for (let y = 45; y < canvas.height; y += 8) {
      ctx.fillRect(0, y, canvas.width, 2);
    }

    ctx.fillStyle = "#6f5d2c";
    ctx.fillRect(0, 0, canvas.width, 40);
    ctx.fillStyle = "#9c8434";
    for (let x = 8; x < canvas.width; x += 16) {
      ctx.fillRect(x, 0, 2, 40);
      ctx.fillRect(x + 7, 5, 2, 6);
      ctx.fillRect(x + 7, 23, 2, 6);
    }

    ctx.fillStyle = "#cfc078";
    ctx.fillRect(0, 40, canvas.width, 3);
    ctx.fillStyle = "#6b5521";
    ctx.fillRect(0, 43, canvas.width, 3);
    ctx.fillRect(0, canvas.height - 1, canvas.width, 1);
    ctx.fillRect(0, 40, 1, canvas.height - 40);
    ctx.fillRect(canvas.width - 1, 40, 1, canvas.height - 40);
  };

  const drawObject = (object) => {
    if (object.custom === "counter") {
      ctx.save();
      ctx.fillStyle = "#b79a3a";
      ctx.fillRect(object.x, object.y, object.sprite.w, object.sprite.h - 6);
      ctx.fillStyle = "#3a3424";
      ctx.fillRect(object.x - 1, object.y + object.sprite.h - 8, object.sprite.w + 2, 4);
      ctx.fillStyle = "#6f5d2c";
      ctx.fillRect(object.x + 4, object.y + object.sprite.h - 4, 5, 6);
      ctx.fillRect(object.x + object.sprite.w - 9, object.y + object.sprite.h - 4, 5, 6);
      ctx.fillStyle = "#ddcc7a";
      ctx.fillRect(object.x + 2, object.y + 2, object.sprite.w - 4, 2);
      ctx.restore();
      return;
    }

    const sprite = tileCache.get("objects")?.get(object.id);
    if (!sprite) {
      return;
    }

    ctx.drawImage(sprite, object.x, object.y);
  };

  const drawPlayer = () => {
    const x = player.x - player.w / 2;
    const y = player.y - player.h / 2 + 2;
    const frame = player.isMoving ? Math.floor(player.walkTime / PLAYER_WALK_DURATION) % 2 : 0;
    const frameKey = `${player.lastFacing}:${frame}`;
    const frameSprite = playerCache.get("frames")?.get(frameKey)
      || playerCache.get("frames")?.get(`down:0`);

    if (!frameSprite) {
      return;
    }

    ctx.imageSmoothingEnabled = false;
    const renderX = x - (PLAYER_FRAME_SIZE - player.w) / 2;
    const renderY = y - (PLAYER_FRAME_SIZE - player.h) + PLAYER_SPRITE_RENDER_OFFSET_Y;

    const shouldMirror = PLAYER_FRAMES[player.lastFacing]?.[frame]?.flip || false;

    ctx.imageSmoothingEnabled = false;
    ctx.save();
    if (shouldMirror) {
      ctx.translate(renderX + PLAYER_FRAME_SIZE, renderY);
      ctx.scale(-1, 1);
      ctx.drawImage(frameSprite, 0, 0, PLAYER_FRAME_SIZE, PLAYER_FRAME_SIZE);
    } else {
      ctx.drawImage(frameSprite, renderX, renderY, PLAYER_FRAME_SIZE, PLAYER_FRAME_SIZE);
    }
    ctx.restore();
  };

  const drawDecorationObjects = () => {
    const sprites = roomCache.get("sprites");
    if (!sprites) {
      return;
    }

    DECORATION_OBJECTS.forEach((object) => {
      const sprite = sprites.get(object.id);
      if (!sprite) {
        return;
      }

      ctx.drawImage(sprite, ROOM_OFFSET_X + object.x * 16, ROOM_OFFSET_Y + object.y * 16);
    });
  };

  const drawRoomBottomEdge = (roomCanvas) => {
    ctx.fillStyle = "#1f2228";
    ctx.fillRect(ROOM_OFFSET_X, ROOM_OFFSET_Y + roomCanvas.height - 1, roomCanvas.width, 1);
  };

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#b8d8ee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const roomCanvas = roomCache.get("canvas");
    if (roomCanvas) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(roomCanvas, ROOM_OFFSET_X, ROOM_OFFSET_Y);
      drawRoomBottomEdge(roomCanvas);
    }

    drawDecorationObjects();
    drawPlayer();
    drawDialogue();
    updateDebugOverlay();
  };

  const update = (delta) => {
    const distance = PLAYER_SPEED * delta;
    const nextX = player.x + player.moveX * distance;
    const nextY = player.y + player.moveY * distance;

    if (player.moveX !== 0 && canStandAt(nextX, player.y)) {
      player.x = nextX;
    }

    if (player.moveY !== 0 && canStandAt(player.x, nextY)) {
      player.y = nextY;
    }

    if (player.isMoving) {
      player.walkTime += delta;
    } else {
      player.walkTime = 0;
    }
  };

  const stripHtml = (value) => value.replace(/<[^>]*>/g, "");

  const parseParagraph = (postDoc) => {
    const body = postDoc.body || postDoc;
    const paragraphs = [...body.querySelectorAll("p")].filter((paragraph) => {
      if (!paragraph.textContent.trim()) {
        return false;
      }

      if (paragraph.closest("header") || paragraph.closest("footer")) {
        return false;
      }

      return paragraph.textContent.trim().length > 0;
    });

    const content = paragraphs[0]?.textContent.trim() || "";
    return content || "No preview text found.";
  };

  const extractPost = async (url) => {
    if (posts.cache.has(url)) {
      return posts.cache.get(url);
    }

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unable to load post ${url}`);
    }

    const html = await response.text();
    const doc = parser.parseFromString(html, "text/html");
    const isSiteHeading = (node) => /trev['’]s website/i.test(node.textContent || "");

    const titleCandidates = [...doc.querySelectorAll("h1, h2")].filter((heading) => {
      const text = heading.textContent?.trim();
      if (!text || isSiteHeading(heading)) {
        return false;
      }

      if (heading.closest("header") || heading.closest("footer")) {
        return false;
      }

      return true;
    });
    const titleCandidate = titleCandidates.find((heading) => heading.classList.contains("heading-element"))
      || titleCandidates[0]
      || doc.querySelector("title");
    const title = (titleCandidate?.textContent || titleCandidate?.value || "Untitled")
      .replace(/\s*[-|]\s*trev['’]s website$/i, "")
      .trim();
    const paragraph = parseParagraph(doc);
    const excerpt = stripHtml(paragraph.replace(/\s+/g, " "));

    const data = {
      title,
      excerpt: excerpt.length > 240 ? `${excerpt.slice(0, 240)}...` : excerpt,
      href: url,
    };

    posts.cache.set(url, data);
    return data;
  };

  const findPosts = async () => {
    if (posts.cacheReady) {
      return posts.links;
    }

    if (posts.loading) {
      while (!posts.cacheReady && posts.loading) {
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      return posts.links;
    }

    posts.loading = true;
    const response = await fetch(POST_LIST_URL, { cache: "no-store" });
    if (!response.ok) {
      posts.loading = false;
      return [];
    }

    const text = await response.text();
    const doc = parser.parseFromString(text, "text/html");
    const links = [...doc.querySelectorAll("a[href]")]
      .map((link) => link.getAttribute("href"))
      .filter((href) => href && href.startsWith("/posts/"))
      .filter((href) => href.endsWith(".html"))
      .filter((href) => href !== "/posts/index.html")
      .filter((href) => /[^/]+\.html$/.test(href));

    posts.links = [...new Set(links)];
    posts.cacheReady = true;
    posts.loading = false;
    return posts.links;
  };

  const showPopup = (open) => {
    ui.isPopupOpen = open;
    postPopup.classList.add("hidden");
    postPopup.setAttribute("aria-hidden", open ? "false" : "true");
  };

  const wrapTextToLines = (value, width) => {
    const words = value.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";

    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (next.length <= width) {
        line = next;
        return;
      }

      if (line) {
        lines.push(line);
      }

      if (word.length <= width) {
        line = word;
        return;
      }

      for (let i = 0; i < word.length; i += width) {
        lines.push(word.slice(i, i + width));
      }
      line = "";
    });

    if (line) {
      lines.push(line);
    }

    if (!lines.length) {
      lines.push("");
    }

    return lines;
  };

  const truncateDialoguePreview = (value) => {
    const cleanValue = value.replace(/\s+/g, " ").trim();
    if (cleanValue.length <= DIALOG_PREVIEW_CHAR_LIMIT) {
      return cleanValue || "No text available.";
    }

    const roomForEllipsis = DIALOG_PREVIEW_CHAR_LIMIT - 3;
    const sentenceEnd = cleanValue
      .slice(0, roomForEllipsis)
      .search(/[.!?](?=\s+[A-Z0-9])/);
    const hardCut = sentenceEnd > 24 ? sentenceEnd + 1 : roomForEllipsis;
    const preview = cleanValue
      .slice(0, hardCut)
      .replace(/[,.!?:;\s-]+$/g, "")
      .trim();

    return `${preview}...`;
  };

  const renderPostDialogue = () => {
    const { title, lines, href, page } = ui.dialogue;
    const pageStart = page * DIALOG_LINES_PER_PAGE;
    const pageLines = lines.slice(pageStart, pageStart + DIALOG_LINES_PER_PAGE);
    const hasNext = pageStart + DIALOG_LINES_PER_PAGE < lines.length;

    ui.dialogue.visibleTitle = title || "From the bookshelf...";
    ui.dialogue.visibleLines = pageLines.length ? pageLines : ["No text available."];
    ui.dialogue.isAtEnd = Boolean(href) && !hasNext;
    ui.dialogue.prompt = href && !hasNext ? "B to open" : "Space";
  };

  const drawDialogueText = (text, x, y) => {
    const cleanText = text.toUpperCase().replace(/[^\x20-\x7E]/g, "?");
    [...cleanText].forEach((char, charIndex) => {
      const glyph = FONT[char] || FONT["?"];
      glyph.forEach((row, rowIndex) => {
        [...row].forEach((pixel, colIndex) => {
          if (pixel === "1") {
            ctx.fillRect(x + charIndex * 4 + colIndex, y + rowIndex, 1, 1);
          }
        });
      });
    });
  };

  const drawDialogue = () => {
    if (!ui.isPopupOpen) {
      return;
    }

    const boxX = 7;
    const boxY = canvas.height - 49;
    const boxW = canvas.width - 14;
    const boxH = 42;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#f7f2d2";
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = "#1f2228";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);
    ctx.strokeStyle = "#6b775c";
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX + 3, boxY + 3, boxW - 6, boxH - 6);

    ctx.fillStyle = "#1f2228";

    const title = ui.dialogue.visibleTitle || "From the bookshelf...";
    drawDialogueText(title.slice(0, 27), boxX + 8, boxY + 7);
    (ui.dialogue.visibleLines || []).slice(0, 2).forEach((line, index) => {
      drawDialogueText(line, boxX + 8, boxY + 17 + index * 9);
    });

    if (ui.dialogue.prompt) {
      drawDialogueText(ui.dialogue.prompt, boxX + 72, boxY + 33);
    }
    ctx.restore();
  };

  const showPostDialogue = (postData) => {
    const preview = truncateDialoguePreview(postData.excerpt || "No text available.");
    const lines = wrapTextToLines(preview, DIALOG_CHARS_PER_LINE);

    ui.dialogue = {
      title: postData.title || "From the bookshelf...",
      href: postData.href || "",
      isAtEnd: false,
      lines,
      page: 0,
    };

    postLink.hidden = true;
    showPopup(true);
    renderPostDialogue();
  };

  const showFlavorDialogue = ({ title, text }) => {
    const lines = wrapTextToLines(text || "...", DIALOG_CHARS_PER_LINE);

    ui.dialogue = {
      title,
      href: "",
      isAtEnd: true,
      lines,
      page: 0,
    };

    showPopup(true);
    renderPostDialogue();
  };

  const advancePostDialogue = () => {
    const nextStart = (ui.dialogue.page + 1) * DIALOG_LINES_PER_PAGE;
    if (nextStart < ui.dialogue.lines.length) {
      ui.dialogue.page += 1;
      renderPostDialogue();
      return;
    }

    if (!ui.dialogue.href) {
      hidePost();
      return;
    }

    renderPostDialogue();
  };

  const showPost = async () => {
    if (ui.loadingPost) {
      return;
    }

    ui.loadingPost = true;
    showPostDialogue({
      title: "Checking bookshelf...",
      excerpt: "Pulling a random post...",
    });

    try {
      const links = await findPosts();
      if (!links.length) {
        showPostDialogue({
          title: "No posts found.",
          excerpt: "I couldn't find any posts to pull from /posts/.",
        });
        return;
      }

      const chosen = links[Math.floor(Math.random() * links.length)];
      const postData = await extractPost(chosen);
      showPostDialogue(postData);
    } catch (error) {
      showPostDialogue({
        title: "Could not open post.",
        excerpt: error?.message || "Failed to load a random post.",
      });
    } finally {
      ui.loadingPost = false;
    }
  };

  const hidePost = () => {
    ui.isPopupOpen = false;
    ui.dialogue = {
      title: "",
      href: "",
      isAtEnd: false,
      lines: [],
      page: 0,
    };
    showPopup(false);
  };

  const maybeInteract = () => {
    const interaction = findNearbyInteraction();
    if (!interaction) {
      return;
    }

    if (ui.isPopupOpen) {
      hidePost();
      return;
    }

    if (interaction.action === "posts") {
      showPost();
      return;
    }

    showFlavorDialogue(interaction);
  };

  const onKeyDown = (event) => {
    if (event.target && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) {
      return;
    }

    const key = event.key;
    const isSpace = key === " " || key === "Spacebar" || event.code === "Space";
    if (key === "Escape") {
      if (ui.isPopupOpen) {
        hidePost();
      }
      return;
    }

    if (isSpace) {
      event.preventDefault();
      if (ui.isPopupOpen) {
        advancePostDialogue();
        return;
      }

      return;
    }

    if (key === "b" || key === "B") {
      event.preventDefault();
      if (!ui.isPopupOpen) {
        return;
      }

      if (!ui.dialogue.isAtEnd) {
        return;
      }

      if (ui.dialogue.href) {
        window.open(ui.dialogue.href, "_blank", "noopener noreferrer");
        hidePost();
        return;
      }
    }

    if (key === "e" || key === "E") {
      event.preventDefault();
      if (!ui.isPopupOpen) {
        maybeInteract();
      }
      return;
    }

    const direction = keyToDirection.get(key);
    if (direction) {
      event.preventDefault();
      input.add(direction);
    }
  };

  const onKeyUp = (event) => {
    const direction = keyToDirection.get(event.key);
    if (!direction) {
      return;
    }

    input.delete(direction);
  };

  const preloadAssets = async () => {
    await buildAssetPack();
  };

  const bindControls = () => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    postClose.addEventListener("click", hidePost);
    postPopup.addEventListener("click", (event) => {
      if (event.target === postPopup) {
        hidePost();
      }
    });
  };

  const preloadPosts = () => {
    findPosts().catch(() => {
      posts.links = [];
      posts.cacheReady = true;
    });
  };

  const tick = (time) => {
    const now = time || 0;
    const delta = Math.min(0.05, (now - tick.last) / 1000 || 0);
    tick.last = now;

    if (!ui.isPopupOpen) {
      setDirectionFromInput();
      update(delta);
    } else {
      player.moveX = 0;
      player.moveY = 0;
      player.isMoving = false;
      player.walkTime = 0;
    }

    render();
    window.requestAnimationFrame(tick);
  };

  const init = async () => {
    tick.last = performance.now();
    createDebugOverlay();
    bindControls();
    installDebugWindowAPI();
    preloadPosts();
    await preloadAssets();
    render();
    window.requestAnimationFrame(tick);
  };

  tick.last = 0;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
