import { App, Plugin, PluginSettingTab, Setting, CachedMetadata, TFile, TFolder, View } from 'obsidian';

import { SettingsTab, ColorBorderSettings, DEFAULT_SETTINGS, ColorRule, RuleType } from './settingsTab';

export default class ColorfulNoteBordersPlugin extends Plugin {
	settings: ColorBorderSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", this.onActiveLeafChange.bind(this))
		);
		this.registerEvent(
			this.app.metadataCache.on("changed", this.onMetadataChange.bind(this))
		);
		this.registerEvent(
			this.app.vault.on("rename", this.onFileRename.bind(this))
		);
	}

	async onunload() {
		// cleanup all custom styles
		this.settings.colorRules.forEach((rule) => {
			this.removeStyle(rule);
		});
	}

	async removeStyle(rule: ColorRule){
		const style = this.makeStyleName(rule);
		const styleElement = document.getElementById(style);
		if (styleElement) {
			styleElement.remove();
		}
	}

	async onActiveLeafChange(activeLeaf) {
		if (!activeLeaf || !activeLeaf.view || !activeLeaf.view.file) {
			return;
		}
		this.applyRules(activeLeaf.view.file);
	}

	async onMetadataChange(file: TFile) {
		const activeLeaf = this.app.workspace.getLeaf();
		if (activeLeaf && activeLeaf.view && activeLeaf.view.file && file.path === activeLeaf.view.file.path) {
			this.applyRules(file);
		}
	}

	async onFileRename(file: TFile) {
		this.applyRules(file);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.updateStyles();
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.updateStyles();
		this.onFileRename(this.app.workspace.getActiveFile());
	}

	async updateStyles() {
		this.settings.colorRules.forEach((rule) => this.updateStyle(rule));
	}
	async updateStyle(rule: ColorRule) {
		const styleName = this.makeStyleName(rule);
		this.updateCustomCSS(styleName,`
			.${styleName} {
				border: 5px solid ${rule.color} !important;
			}
		`);
	}

	addCustomCSS(cssstylename: string, css: string) {
		const styleElement = document.createElement('style');
		styleElement.id = cssstylename;
		styleElement.innerText = css;
		document.head.appendChild(styleElement);
	}
	updateCustomCSS(cssstylename: string, css: string) {
		const styleElement = document.getElementById(cssstylename);
		if (styleElement) {
			styleElement.innerText = css;
		} else {
			this.addCustomCSS(cssstylename, css);
		}
	}

	async applyRules(file: TFile) {
		if (!file || file.extension !== "md") return;

		// console.log(file);

		const activeLeaf = this.app.workspace.getLeaf();
		if (!activeLeaf || !activeLeaf.view) return;

		const viewElement = activeLeaf.view.containerEl;
		const contentView = viewElement.querySelector(".view-content");

		this.unhighlightNote(contentView);
		this.settings.colorRules.forEach((rule) => {
			// console.log(rule);
			switch (rule.type) {
				case RuleType.Folder: {
					// console.log(file.path, rule.value);
					if (this.checkPath(file.path, rule.value)) {
						this.highlightNote(contentView, rule);
					}
					break;
				}
				case RuleType.Frontmatter: {
					const [key, value] = rule.value.split(":", 2);
					const frontMatterValue = this.app.metadataCache.getFileCache(file)?.frontmatter?.[key];
					const normalizedFrontMatterValue = frontMatterValue?.toString().toLowerCase().trim();
					const normalizedValueToHighlight = value?.toString().toLowerCase().trim();
					// console.log(`front matter: ${key}, ${value} :: ${normalizedFrontMatterValue} === ${normalizedValueToHighlight}`);
					if (normalizedFrontMatterValue === normalizedValueToHighlight) {
						this.highlightNote(contentView, rule);
						// console.log("content highlight")
					}
					break;
				}
			}
		});
	}

	highlightNote(element: Element, rule: ColorRule) {
		// console.log(`highlight: ${rule.id}`);
		element.classList.add(this.makeStyleName(rule));
		// console.log(element);
	}

	unhighlightNote(element: Element) {
		this.settings.colorRules.forEach((rule) => {
			element.classList.remove(this.makeStyleName(rule));
		});
		// console.log(`un highlight ---`);
		// console.log(element);
	}

	checkPath(currentPath: string, blacklistedPath: string): boolean {
		return currentPath.includes(blacklistedPath);
	}

	makeStyleName(rule: ColorRule): string {
		return `cnb-${rule.id}-style`;
	}
}

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
