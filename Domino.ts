const fs = require('fs');

interface Piece {
  index: string;
  regex: RegExp;
  string: string;
  matches: string[];
}

const arrayToObject = (arr, keyField) => Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

function removeItemAtIndex(array: number[], index): Piece {
  return array.splice(index, 1)[0];
}

function makePieces(): Piece[] {
  const dominoTxt = fs.readFileSync('./DominoSteineSample.txt').toString();
  const dominoRows = dominoTxt.trim().split('\n');
  const pieces = dominoRows.map((row, index) => {
    const [regex, string] = row.split(' ');
    return { regex: new RegExp('^' + regex + '$'), string, index: String(index) };
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

function putTogether(chain: string[], remaining: string[]) {
  console.log(chain, remaining);

  if (remaining.length === 0) {
    console.log('LÖSUNG GEFUNDEN:', chain);
  } else {
    const lastIndex = chain[chain.length - 1];
    let candidates = remaining.filter(p => pieceMap[lastIndex].matches.includes(p));
    console.log('candidates', candidates);

    // Jeden Kandidaten durchprobieren
    candidates.forEach((c, i) => {
      let newRemaining = JSON.parse(JSON.stringify(candidates));
      const candidate = removeItemAtIndex(newRemaining, i);
      putTogether([...chain, candidate], newRemaining);
    });
  }
}

let pieces = makePieces();
pieces = findMatches(pieces);
let pieceMap = arrayToObject(pieces, 'index');
// console.log('pieceMap', pieceMap);

const first = pieces.shift();
putTogether(
  [first.index],
  pieces.map(p => p.index)
);
