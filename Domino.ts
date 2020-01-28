const fs = require('fs');

interface Piece {
  index: string;
  regex: RegExp;
  string: string;
  matches: string[];
}

const arrayToObject = (arr, keyField) => Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

function removeItemAtIndex(array: Piece[], index): Piece {
  return array.splice(index, 1)[0];
}

function makePieces(): Piece[] {
  const dominoTxt = fs.readFileSync('./DominoSteine.txt').toString();
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
    // const matches = matchPieces.map(p => p.index).filter(j => j !== i);
    // console.log(p.regex, matches.length, matches);
    p.matches = matches.map(p => p.index);
  });

  return pieces;
}

/*
function putTogether(chain: Piece[], remaining: Piece[]) {
  console.log(chain, remaining);

  if (remaining.length === 0) {
    console.log('LÖSUNG GEFUNDEN:', chain);
  } else {
    let candidates;
    if (chain.length === 0) {
      candidates = [...remaining];
    } else {
      const lastIndex = chain[chain.length - 1];
      candidates = remaining.filter(p => last.matches.includes(p));
    }

    // Jeden Kandidaten durchprobieren
    candidates.forEach((c, i) => {
      let remaining = JSON.parse(JSON.stringify(candidates));
      const candidate = removeItemAtIndex(remaining, i);
      putTogether([...chain, candidate], remaining);
    });
  }
}
*/

let pieces = makePieces();
// let pieceMap = Object.assign(pieces.map(p => ({ p.index => p })));
pieces = findMatches(pieces);
// console.log('pieces', pieces);

let pieceMap = arrayToObject(pieces, 'index');
console.log('pieceMap', pieceMap);

// console.log('pieces', pieces);
// putTogether([], pieces);
