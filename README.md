# vscode-join-lines

Join lines by separator specified in settings, keybinding argument or entered by hand.

### Demo

![demo](./img/demo.gif)

### Demo with settings.json:

```js
"joinLines.defaultSeparator": "__",
```

![demo_settings](./img/demo_settings.gif)

### Demo with custom entered separator

![demo_enter_separator](./img/demo_provide_separator.gif)

### From a keybinding

```js
{
	"key": "ctrl+shift+9",
	"command": "joinLines.joinLines",
	"args": {
		"separator": "###",
		"wrapLeft": "'",
		"wrapRight": "'"
	}
}
```


<!-- COMMANDS_START -->
## Commands (2)

|Command|Description|
|-|-|
|joinLines.joinLines|Join Lines: Join|
|joinLines.joinLinesWithSeparator|Join Lines: Join With Separator|
<!-- COMMANDS_END -->

<!-- SETTINGS_START -->
## Settings (3)

|Setting|Default|Description|
|-|-|-|
|joinLines.defaultSeparator|"&nbsp;"|Symbol that is used when joining lines.|
|joinLines.wrapLeft|""|Symbol to wrap the line on the left.|
|joinLines.wrapRight|""|Symbol to wrap the line on the right.|
<!-- SETTINGS_END -->