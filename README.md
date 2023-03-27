# Colorful Note Borders Plugin for Obsidian

The Colorful Note Borders plugin for Obsidian is designed to help you visually distinguish your notes based on custom rules. By applying colored borders around your notes, you can easily recognize and categorize them based on their folder location or specific frontmatter metadata.

![](assets/ColorfulNoteBordersDemo800.gif?raw=true)

This plugin supports two types of rules:

1. **Folder-based rules**: Apply a colorful border to notes based on their folder location. For example, you can configure a green border to be displayed around notes located in the "Inbox" folder.
2. **Frontmatter metadata-based rules**: Apply a colorful border to notes based on their frontmatter metadata. For example, you can configure a red border to be displayed around notes that have "private: true" property in the frontmatter metadata.

By using the Colorful Note Borders plugin, you can create a more organized and visually appealing workspace in Obsidian. Customize your note appearance with an easy-to-configure settings page that allows you to define your color rules dynamically.

## Features

The Colorful Note Borders plugin for Obsidian offers the following features:

- Apply colorful borders to notes based on customizable rules
- Supports two types of rules:
  - Folder location
  - Frontmatter metadata
- Add and remove rules as needed

## Installation

To install the Colorful Borders plugin, follow these steps:

1. Open your Obsidian vault
2. Go to the Settings page (click the gear icon in the left sidebar)
3. Navigate to Third-party plugins and make sure the "Safe mode" toggle is off
4. Click "Browse" and search for "Colorful Note Borders"
5. Click "Install" on the Colorful Note Borders plugin
6. After the installation is complete, click "Enable" to activate the plugin

## Manual Installation using BRAT

BRAT (Beta Reviewers Auto-update Tester) is a plugin for Obsidian that allows you to install and manage plugins that are not yet approved and included in the Obsidian Plugin Directory. You can use BRAT to install the Colorful Borders plugin manually.

### Prerequisites

- Obsidian 0.9.7 or later

### Installation Steps

1. Open your Obsidian vault.
2. Go to the Settings page (click the gear icon in the left sidebar).
3. Navigate to Third-party plugins and make sure the "Safe mode" toggle is off.
4. Click "Browse" and search for "BRAT".
5. Click "Install" on the BRAT plugin.
6. After the installation is complete, click "Enable" to activate the BRAT plugin.
7. Navigate to Plugin Options and click on "BRAT".
8. In the "Plugin Repository URL" field, enter the GitHub repository URL for the Colorful Borders plugin (`https://github.com/rusi/obsidian-colorful-note-borders`).
9. Click "Add plugin".
10. Click "Update plugins" to download and install the Colorful Note Borders plugin.
11. Navigate to Third-party plugins in the Obsidian settings.
12. Find the Colorful Note Borders plugin in the "Installed plugins" list and click "Enable" to activate it.

Now the Colorful Note Borders plugin should be installed and activated. Follow the usage instructions in the previous sections to configure the plugin.

## Usage

To configure the Colorful Note Borders plugin, follow these steps:

1. Go to the Settings page in your Obsidian vault
2. Navigate to Plugin Options and click on "Colorful Note Borders"
3. In the settings page, you can add or remove rules by clicking the "Add new rule" button or the "Remove" button next to each rule
4. Configure each rule by providing:
    - A name for the rule
    - A value to match (e.g., folder name or frontmatter metadata value)
    - The rule type (either "Path" for folder location or "Frontmatter" for frontmatter metadata)
    - A color for the border (use the color picker or enter a color hex code)
5. Save your settings

The plugin will automatically apply the colorful borders to your notes based on the rules you've configured. If a note matches a rule, the border will be displayed around the note's content.

## Support

If you encounter any issues or have feature requests, please create an issue on the plugin's GitHub repository.

## License

This plugin is licensed under the MIT License. For more information, see the LICENSE file in the plugin's GitHub repository.






---

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`


## Adding your plugin to the community plugin list

- Check https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.


## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-colorful-note-borders/`.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code.
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

