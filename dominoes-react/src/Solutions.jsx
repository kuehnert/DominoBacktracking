import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './Solutions.css';

const piecesUrl = 'http://localhost:3001/DominoSteine.json';
const solutionsUrl = 'http://localhost:3001/Solutions.txt';

function Solutions() {
  const [solutions, setSolutions] = useState(null);
  const [pieces, setPieces] = useState(null);
  const [solutionIndex, setSolutionIndex] = useState(0);

  useEffect(() => {
    async function getPieces() {
      const responsePieces = await Axios.get(piecesUrl);
      const pieces = responsePieces.data;
      setPieces(pieces);
    }

    async function getSolutions() {
      const response = await Axios.get(solutionsUrl);
      const newSolutions = response.data
        .split('\n')
        .map(l => l.split(', '));
      setSolutions(newSolutions);
    }

    getPieces();
    getSolutions();
  }, []);

  const Piece = ({ index }) => {
    const piece = pieces[index];

    return (
      <div className="Piece">
        <div className="PieceString">{piece.string}</div>
        <div className="PieceRegex">{piece.regex}</div>
      </div>
    );
  };

  if (solutions == null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="slidecontainer">
        <input type="range" min="0" max={solutions.length - 1} className="slider" value={solutionIndex} onChange={(e) => setSolutionIndex(e.target.value)} />
        {solutionIndex}
      </div>

      <div className="Solutions">
        {solutions[solutionIndex].map(index => (
          <Piece key={index} index={String(index)} />
        ))}
      </div>
    </div>
  );
}

export default Solutions;
