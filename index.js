import alfy from 'alfy';
import fs from 'fs';
import path from 'path';

const defaultNoteFilename = process.env.defaultNoteFilename;
let notesFolderPath = process.env.notesFolderPath;
let homePath = process.env.HOME;

if (!homePath) throw new Error('No env HOME set');
if (!notesFolderPath) throw new Error('No env notesFolderPath set');
if (!defaultNoteFilename) throw new Error('No env defaultNoteFilename set');

notesFolderPath = notesFolderPath.replace('~', homePath);

const files = fs
  .readdirSync(notesFolderPath)
  .filter((file) => /\.md$/.test(file))
  .map((file) => ({
    title: file,
    type: 'file:skipcheck',
    variables: { noteFilePath: path.resolve(notesFolderPath, file) },
  }));

const userInput = alfy.input;
const matches = alfy.matches(userInput, files, 'title');
const defaultNoteFilePath = path.resolve(notesFolderPath, defaultNoteFilename);

if (!userInput)
  matches.unshift({
    title: `Open ${defaultNoteFilename}`,
    type: 'file:skipcheck',
    variables: { noteFilePath: defaultNoteFilePath },
  });
else {
  const previewText =
    userInput.length > 30 ? `${userInput.slice(0, 30)}...` : userInput;

  matches.push({
    title: 'Add new note',
    subtitle: `"${previewText}" to ${notesFolderPath}`,
    arg: userInput,
    variables: { noteFilePath: defaultNoteFilePath },
  });
}

alfy.output(matches);
