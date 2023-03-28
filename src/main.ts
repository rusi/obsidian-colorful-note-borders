import { App, Plugin, PluginSettingTab, Setting, CachedMetadata, TFile, TFolder, View, WorkspaceLeaf } from 'obsidian';

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

	async onActiveLeafChange(activeLeaf: WorkspaceLeaf) {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeLeaf || !activeLeaf.view || !activeFile) {
			return;
		}
		this.applyRules(activeFile);
	}

	async onMetadataChange(file: TFile) {
		const activeLeaf = this.app.workspace.getLeaf();
		const activeFile = this.app.workspace.getActiveFile();
		if (activeLeaf && activeLeaf.view && activeFile && file.path === activeFile.path) {
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
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
			this.onFileRename(activeFile);
		}
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

		const activeLeaf = this.app.workspace.getLeaf();
		if (!activeLeaf || !activeLeaf.view) return;

		const viewElement = activeLeaf.view.containerEl;
		const contentView = viewElement.querySelector(".view-content");

		if (!contentView) {
			return;
		}
		this.unhighlightNote(contentView);
		this.settings.colorRules.some((rule) => {
			return this.applyRule(file, rule, contentView);
		});
	}

	applyRule(file: TFile, rule: ColorRule, contentView: Element): boolean {
		switch (rule.type) {
			case RuleType.Folder: {
				if (this.checkPath(file.path, rule.value)) {
					this.highlightNote(contentView, rule);
					return true;
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
					return true;
				}
				break
			}
		}
		return false;
	}

	highlightNote(element: Element, rule: ColorRule) {
		element.classList.add(this.makeStyleName(rule));
	}

	unhighlightNote(element: Element) {
		this.settings.colorRules.forEach((rule) => {
			element.classList.remove(this.makeStyleName(rule));
		});
	}

	checkPath(currentPath: string, blacklistedPath: string): boolean {
		return currentPath.includes(blacklistedPath);
	}

	makeStyleName(rule: ColorRule): string {
		return `cnb-${rule.id}-style`;
	}
}
