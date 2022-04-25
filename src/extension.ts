import { commands, ExtensionContext, window, workspace } from 'vscode';
import { joinLines } from './commands/joinLines';
import { ExtensionConfig } from './types';

export const enum CommandId {
	joinLinesCommand = 'joinLines.joinLines',
	joinLinesWithSeparator = 'joinLines.joinLinesWithSeparator',
}

export const enum Constants {
	extensionConfigSection = 'joinLines',
}

export let $config: ExtensionConfig;

export function activate(context: ExtensionContext) {
	updateConfig();

	context.subscriptions.push(commands.registerTextEditorCommand(CommandId.joinLinesCommand, async (editor, edit, ...args) => {
		await joinLines(editor, edit, args[0]);
	}));
	context.subscriptions.push(commands.registerTextEditorCommand(CommandId.joinLinesWithSeparator, async editor => {
		const userSeparator = await window.showInputBox({
			title: 'Enter the separator',
			value: ' ',
			valueSelection: [0, 1],
		});
		if (userSeparator === undefined) {
			return;
		}
		await joinLines(editor, undefined, { separator: userSeparator });
	}));

	context.subscriptions.push(workspace.onDidChangeConfiguration(e => {
		if (!e.affectsConfiguration(Constants.extensionConfigSection)) {
			return;
		}
		updateConfig();
	}));
}

function updateConfig() {
	$config = workspace.getConfiguration(Constants.extensionConfigSection) as any as ExtensionConfig;
}

export function deactivate() {}
