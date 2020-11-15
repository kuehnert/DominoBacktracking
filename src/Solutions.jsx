import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './Solutions.css';

function Solutions() {
  const [solutions, setSolutions] = useState(null);
  const [pieces, setPieces] = useState(null);
  const [solutionIndex, setSolutionIndex] = useState(0);

  useEffect(() => {
    async function getPieces() {
      const responsePieces = await Axios({
        url: 'DominoSteine.json',
        baseURL: process.env.REACT_APP_BASE_URL,
      });
      const pieces = responsePieces.data;
      setPieces(pieces);
    }

    async function getSolutions() {
      const response = await Axios({
        url: 'Solutions.txt',
        baseURL: process.env.REACT_APP_BASE_URL,
      });
      const newSolutions = response.data
        .toString()
        .trim()
        .split('\n')
        .map(l => l.split(', '));
      setSolutions(newSolutions);
    }

    getPieces();
    getSolutions();
  }, []);

  const Piece = ({ index }) => {
    const piece = pieces[index];

    if (piece == null) {
      return <div>Fehler {index}</div>;
    }

    return (
      <div className='Piece'>
        <div className='PieceString'>{piece.string}</div>
        <div className='PieceRegex'>{piece.regex}</div>
      </div>
    );
  };

  if (solutions == null || pieces == null) {
    return <div>Loading...</div>;
  }

  const renderSolution = solution => {
    if (solution == null) {
      return <div>Fehler</div>;
    }

    return solution.map(index => <Piece key={index} index={String(index)} />);
  };

  return (
    <div>
      <div className='slidecontainer'>
        <input
          type='range'
          min='0'
          max={solutions.length - 1}
          className='slider'
          value={solutionIndex}
          onChange={e => setSolutionIndex(e.target.value)}
        />
      </div>
      <div>Lösung Nr. {solutionIndex}</div>

      <div className='Solutions'>{renderSolution(solutions[solutionIndex])}</div>
    </div>
  );
}

export default Solutions;
