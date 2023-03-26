import { App, Plugin, PluginSettingTab, Setting, CachedMetadata, TFile, TFolder, View } from 'obsidian';

import { SettingsTab, ColorBorderSettings, DEFAULT_SETTINGS } from './settingsTab';

// Remember to rename these classes and interfaces!

// interface ColorfulNoteBordersSettings {
// 	mySetting: string;
// }

// const DEFAULT_SETTINGS: ColorfulNoteBordersSettings = {
// 	mySetting: 'default'
// }

export default class ColorfulNoteBordersPlugin extends Plugin {
	settings: ColorBorderSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));
	}

	// await onunload() {

	// }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: ColorfulNoteBordersPlugin;

// 	constructor(app: App, plugin: ColorfulNoteBordersPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					console.log('Secret: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
