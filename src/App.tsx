import 'react-csv-importer/dist/index.css';

import { Importer } from 'react-csv-importer';

function App() {
  return (
    <div>
      <Importer
        processChunk={() => {
          /* todo */
        }}
      />
    </div>
  );
}

export default App;
