const speeches = ["1AC", "1NC", "2AC", "2NC"];

const rows = [
  { id: 1, cells: ["Econ adv", "no internal link", "their ev is old", ""] },
  { id: 2, cells: ["Warming adv", "CO2 ag turn", "turn is empirics", ""] },
  { id: 3, cells: ["Solvency", "", "extend", ""] },
];

export default function Flow() {
  return (
    <table>
      <thead>
        <tr>
          {speeches.map((speech) => (
            <th key={speech}>{speech}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {row.cells.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}