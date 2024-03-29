import { Range, TextEditor, TextEditorEdit } from 'vscode';
import { $config } from '../extension';

export async function joinLines(editor: TextEditor, edit?: TextEditorEdit, {
	separator = $config.defaultSeparator,
	wrapLeft = $config.wrapLeft,
	wrapRight = $config.wrapRight,
} = {}) {
	const allSelectedLines: number[] = [];

	if (editor.selections.length === 1 && editor.selection.isEmpty) {
		// one single cursor - join active and next lines
		allSelectedLines.push(editor.selection.active.line);
		const nextLineNumber = editor.selection.active.line + 1;
		if (nextLineNumber < editor.document.lineCount) {
			allSelectedLines.push(nextLineNumber);
		}
	} else {
		for (const selection of editor.selections) {
			for (let i = selection.start.line; i <= selection.end.line; i++) {
				allSelectedLines.push(i);
			}
		}
	}

	const allSelectedLinesUnique = [...new Set(allSelectedLines)];
	const allSelectedLinesSorted = allSelectedLinesUnique.sort((a, b) => a - b);

	let allSelectedLinesSubsequent: number[][] = [];
	let currentSequence = [allSelectedLinesSorted[0]];

	for (let i = 1, prev = allSelectedLinesSorted[0]; i <= allSelectedLinesSorted.length; i++) {
		if (allSelectedLinesSorted[i] - prev === 1) {
			currentSequence.push(allSelectedLinesSorted[i]);
		} else {
			allSelectedLinesSubsequent.push(currentSequence);
			currentSequence = [allSelectedLinesSorted[i]];
		}

		prev = allSelectedLinesSorted[i];
	}


	allSelectedLinesSubsequent = allSelectedLinesSubsequent.filter(item => item.length > 1);

	const ranges: Range[] = allSelectedLinesSubsequent.map(lines => {
		const firstLine = lines[0];
		const lastLine = lines[lines.length - 1];
		const lastLineRange = editor.document.lineAt(lastLine).range;
		return new Range(firstLine, 0, lastLine, lastLineRange.end.character);
	});

	await editor.edit(builder => {
		for (const range of ranges) {
			const textLines = [];
			for (let i = range.start.line; i <= range.end.line; i++) {
				textLines.push(editor.document.lineAt(i));
			}
			builder.replace(range, textLines.map((textLine, i) => {
				if (textLine.isEmptyOrWhitespace) {
					return '';
				}
				return `${wrapLeft}${textLine.text.slice(i === 0 ? 0 : textLine.firstNonWhitespaceCharacterIndex)}${wrapRight}`;
			}).filter(Boolean).join(separator));
		}
	});
}
