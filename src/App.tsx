import 'react-csv-importer/dist/index.css';

import { Radio, RadioGroup } from '@mantine/core';
import React from 'react';
import { Importer, ImporterField } from 'react-csv-importer';

import { CsvRow, ProfileName, profiles } from './lib/common';
import getMt940FromTransactions from './lib/getMt940FromTransactions';
import getTransactionsFromCsv from './lib/getTransactionsFromCsv';

function App() {
  const [profileName, setProfileName] = React.useState<ProfileName>();
  const [rows, setRows] = React.useState<CsvRow[]>([]);
  const [mt940, setMt940] = React.useState<unknown>();

  const profile = profileName && profiles[profileName];

  return (
    <div>
      {!profile ? (
        <div>
          <RadioGroup
            label="Select the source of your CSV"
            required
            onChange={(nextProfile) =>
              setProfileName(nextProfile as ProfileName)
            }
          >
            {Object.keys(profiles).map((profile) => (
              <Radio key={profile} value={profile} label={profile} />
            ))}
          </RadioGroup>
        </div>
      ) : !mt940 ? (
        <Importer<CsvRow>
          onStart={() => {
            setRows([]);
            setMt940(undefined);
          }}
          processChunk={(newRows) => {
            // optimise for large files? maybe later.
            setRows((rows) => [...rows, ...newRows]);
          }}
          onComplete={() => {
            setMt940(
              getMt940FromTransactions(getTransactionsFromCsv(rows), {
                thisIban: 'TODO',
              }),
            );
          }}
        >
          {Object.entries(profile.fields).map(([name, props], index) => (
            <ImporterField key={index} name={name} {...props} />
          ))}
        </Importer>
      ) : (
        <div>TODO</div>
      )}
    </div>
  );
}

export default App;
