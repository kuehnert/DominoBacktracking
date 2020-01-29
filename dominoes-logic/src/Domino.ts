const fs = require('fs');

interface Piece {
  index: string;
  regex: RegExp;
  string: string;
  matches: string[];
}

const arrayToObject = (arr: any[], keyField: string) =>
  Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

function removePieceAtIndex(array: any[], index: number): any {
  const piece = array.splice(index, 1)[0];

  if (piece != null) {
    return piece;
  } else {
    throw new Error('no index ' + index + ' on ' + array);
  }
}

function loadPieces(): Piece[] {
  const dominoTxt = fs.readFileSync('./lib/DominoSteine.txt').toString();
  const dominoRows = dominoTxt.trim().split('\n');
  const pieces = dominoRows.map((row: string, index: number) => {
    const [regex, string] = row.split(' ');
    return { regex: new RegExp('^(' + regex + ')$'), string, index: String(index) };
  });

  return pieces;
}

function findMatches(pieces: Piece[]): Piece[] {
  pieces.forEach((p, i) => {
    const matches = pieces.filter(p2 => p.regex.test(p2.string) && String(i) !== p2.index);
    p.matches = matches.map(p => p.index);
  });

  return pieces;
}

function formatSolution(chain: string[]): string {
  return chain.map(i => `[${pieceMap[i].string}|${pieceMap[i].regex}]`).join(' -- ');
}

function putTogether(chain: string[], remaining: string[]) {
  if (remaining.length === 0) {
    solutionCount += 1;
    solutions.push(chain.join(', '));

    if (solutionCount % 100 === 0) {
      process.stdout.write('.');
      // console.log(formatSolution(chain));
    }
  } else {
    const lastIndex = chain[chain.length - 1];
    let candidates = remaining.filter(p => pieceMap[lastIndex].matches.includes(p));

    // Jeden Kandidaten durchprobieren
    candidates.forEach(c => {
      let newRemaining = remaining.filter(r => r !== c);
      putTogether([...chain, c], newRemaining);
    });
  }
}

function findSolutions() {
  pieces.forEach((c, i) => {
    let newRemaining = JSON.parse(JSON.stringify(pieces));
    const candidate = removePieceAtIndex(newRemaining, i);
    console.log('\n####### Neuer 1. Stein:', candidate.index);

    putTogether(
      [candidate.index],
      newRemaining.map((p: Piece) => p.index)
    );
  });

  fs.writeFileSync('./Solutions.txt', solutions.join('\n'));
  console.log('Finiss! Found ' + solutions.length + ' solutions.');
}

function findCircular() {
  console.log('Suche Lösung');

  let count = 0;
  const solutions = fs
    .readFileSync('./lib/Solutions.txt')
    .toString()
    .trim()
    .split('\n');

  solutions.forEach((s: string) => {
    const a = s.split(', ');
    const first = a[0];
    const last = a[a.length - 1];

    // console.log('solution:', s);
    // console.log('first:', first);
    // console.log('last:', last);
    // console.log('matches:', pieceMap[last].matches);

    if (pieceMap[last].matches.includes(first)) {
      console.log('\nSuper-solution: ', s);
    }

    count += 1;
    if (count % 100 === 0) {
      process.stdout.write('.');
    }
  });
}

function savePieceMap() {
  const dominoTxt = fs.readFileSync('./lib/DominoSteine.txt').toString();
  const dominoRows = dominoTxt.trim().split('\n');
  let pieces = dominoRows.map((row: string, index: number) => {
    const [regex, string] = row.split(' ');
    return { regex, string, index: String(index) };
  });
  pieces = findMatches(pieces);
  let pieceMap = arrayToObject(pieces, 'index');

  console.log('pieceMap', pieceMap);
  fs.writeFileSync('./DominoSteine.json', JSON.stringify(pieceMap));
}

// Hauptprogramm
console.log('Starting...');
let solutionCount = 0;
let solutions: string[] = [];
let pieces = loadPieces();
pieces = findMatches(pieces);
let pieceMap = arrayToObject(pieces, 'index');

savePieceMap();

// Object.defineProperty(RegExp.prototype, "toJSON", {
//   value: RegExp.prototype.toString
// });

// findCircular();
