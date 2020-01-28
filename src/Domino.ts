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

function makePieces(): Piece[] {
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

console.log('Starting...');
let solutionCount = 0;
let solutions: string[] = [];
let pieces = makePieces();
pieces = findMatches(pieces);
let pieceMap = arrayToObject(pieces, 'index');
console.log('pieceMap', pieceMap);
// process.exit(0);

// Hauptprogramm
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
