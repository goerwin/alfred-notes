import alfy, { ScriptFilterItem } from 'alfy';
import fs from 'fs';
import path from 'path';

const defaultNoteFilename = process.env.defaultNoteFilename;
const notesFolderPath = process.env.notesFolderPath;
const homePath = process.env.HOME;

if (!homePath) throw new Error('No env HOME set');
if (notesFolderPath === undefined)
  throw new Error('No env notesFolderPath set');
if (!defaultNoteFilename) throw new Error('No env defaultNoteFilename set');

const notesFolderParsedPath = notesFolderPath.replace('~', homePath);

let files: ScriptFilterItem[] | undefined = alfy.cache.get('files');

if (!files) {
  files = fs
    .readdirSync(notesFolderParsedPath)
    .filter((file) => /\.md$/.test(file))
    .map((file) => {
      const noteFilePath = path.resolve(notesFolderParsedPath, file);

      return {
        title: file,
        type: 'file:skipcheck',
        arg: noteFilePath,
        variables: { action: 'openFile', noteFilePath },
      };
    });

  alfy.cache.set('files', files, { maxAge: 1000 * 60 * 60 * 24 * 30 });
}

const userInput = alfy.input;
const matches = alfy.matches(userInput, files, 'title');
const defaultNoteFilePath = path.resolve(
  notesFolderParsedPath,
  defaultNoteFilename
);

if (!userInput)
  matches.unshift(
    {
      title: `Open ${defaultNoteFilename}`,
      variables: {
        action: 'openFile',
        noteFilePath: defaultNoteFilePath,
      },
    },
    { title: 'Remove cache', variables: { action: 'removeCache' } }
  );
else {
  const previewText =
    userInput.length > 30 ? `${userInput.slice(0, 30)}...` : userInput;

  matches.push({
    title: 'Add new note',
    subtitle: `"${previewText}" to ${notesFolderParsedPath}`,
    arg: userInput,
    variables: { noteFilePath: defaultNoteFilePath },
  });
}

alfy.output(matches);
