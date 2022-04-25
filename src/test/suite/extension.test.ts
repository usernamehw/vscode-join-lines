import { assert } from 'chai';
import { before, beforeEach, describe, it } from 'mocha';
import { commands, ConfigurationTarget, Selection, window, workspace } from 'vscode';
import { CommandId } from '../../extension';
import { delay, getActiveEditorText, openInUntitled, replaceActiveEditorDocumentContent } from './testUtils';

const simplestDocument =
`
one
two
`.trim();
const simplestDocumentSelection = new Selection(0, 0, 1, 0);
// ────────────────────────────────────────────────────────────
const withEmptySpaceInBetweenDocument =
`
one


two
`.trim();
const emptySpaceDocumentSelection = new Selection(0, 0, 3, 0);
// ────────────────────────────────────────────────────────────
const multipleSelectionsDocument =
`
one
two

three
four
`.trim();
const multipleSelections = [
	new Selection(0, 0, 1, 0),
	new Selection(3, 0, 4, 0),
];
// ────────────────────────────────────────────────────────────
const multipleCursorsWithEmptySelectionDocument =
`
one
two

three
four
`.trim();
const multipleCursorSelections = [
	new Selection(0, 0, 0, 0),
	new Selection(1, 0, 1, 0),
	new Selection(3, 0, 3, 0),
	new Selection(4, 0, 4, 0),
];
// ────────────────────────────────────────────────────────────
const withIndentDocument =
`    one
    two
    three`;
const withIndentSelection = new Selection(0, 0, 2, 0);
// ────────────────────────────────────────────────────────────

describe('Basic test', () => {
	before(async () => {
		await commands.executeCommand('workbench.action.closeEditorsInGroup');
		await openInUntitled(simplestDocument, 'plaintext');
	});

	it('Simple join 2 lines', async () => {
		window.activeTextEditor!.selection = simplestDocumentSelection;
		await commands.executeCommand(CommandId.joinLinesCommand);
		await delay(100);
		assert.equal(getActiveEditorText(), 'one two');
	});
});

describe('With empty lines', () => {
	before(async () => {
		await replaceActiveEditorDocumentContent(window.activeTextEditor!, withEmptySpaceInBetweenDocument);
	});

	it('Removes multiple empty lines', async () => {
		window.activeTextEditor!.selection = emptySpaceDocumentSelection;
		await commands.executeCommand(CommandId.joinLinesCommand);
		await delay(100);
		assert.equal(getActiveEditorText(), 'one two');
	});
});

describe('With changed separator', () => {
	beforeEach(async () => {
		await replaceActiveEditorDocumentContent(window.activeTextEditor!, simplestDocument);
	});

	it('Applies different line separator (from settings.json)', async () => {
		window.activeTextEditor!.selection = simplestDocumentSelection;
		const settings = workspace.getConfiguration('joinLines');
		await settings.update('defaultSeparator', '_', ConfigurationTarget.Global);
		await commands.executeCommand(CommandId.joinLinesCommand);
		await delay(100);
		assert.equal(getActiveEditorText(), 'one_two');
		await settings.update('defaultSeparator', ' ', ConfigurationTarget.Global);
	});

	it('Applies different line separator provided as an argument', async () => {
		await commands.executeCommand(CommandId.joinLinesCommand, { separator: '0000' });
		await delay(100);
		assert.equal(getActiveEditorText(), 'one0000two');
	});
});

describe('Multiple non-empty selections', () => {
	before(async () => {
		await replaceActiveEditorDocumentContent(window.activeTextEditor!, multipleSelectionsDocument);
	});

	it('Works on multiple selections', async () => {
		window.activeTextEditor!.selections = multipleSelections;
		await commands.executeCommand(CommandId.joinLinesCommand);
		await delay(100);
		assert.equal(getActiveEditorText(), 'one two\n\nthree four');
	});
});

describe('Multiple empty selections(cursors)', () => {
	before(async () => {
		await replaceActiveEditorDocumentContent(window.activeTextEditor!, multipleCursorsWithEmptySelectionDocument);
	});

	it('Joins multiple consequtive lines with empty selections(cursors)', async () => {
		window.activeTextEditor!.selections = multipleCursorSelections;
		await commands.executeCommand(CommandId.joinLinesCommand);
		await delay(100);
		assert.equal(getActiveEditorText(), 'one two\n\nthree four');
	});
});

describe('With indent', () => {
	before(async () => {
		await replaceActiveEditorDocumentContent(window.activeTextEditor!, withIndentDocument);
	});

	it('Removes indent (except first line)', async () => {
		window.activeTextEditor!.selection = withIndentSelection;
		await commands.executeCommand(CommandId.joinLinesCommand);
		await delay(100);
		assert.equal(getActiveEditorText(), '    one two three');
	});
});
