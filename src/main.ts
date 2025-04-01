import { Plugin, TFile, MarkdownView, WorkspaceLeaf } from 'obsidian';

import { SettingsTab, ColorBorderSettings, DEFAULT_SETTINGS, ColorRule, RuleType } from './settingsTab';

export const checkPath = (currentPath: string, folder: string): boolean => {
    // return currentPath.includes(folder);
    const parts = currentPath.split(/[/\\]/);
    return parts.includes(folder);
}

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

    async removeStyle(rule: ColorRule) {
        const style = this.makeStyleName(rule);
        const styleElement = document.getElementById(style);
        if (styleElement) {
            styleElement.remove();
        }
    }

    async onActiveLeafChange(activeLeaf: WorkspaceLeaf) {
        // console.log("+ active leaf change: ", activeLeaf);
        this.applyRules();
    }

    async onMetadataChange(file: TFile) {
        // console.log("+ metadata change");
        this.applyRules(file);
    }

    async onFileRename(file: TFile) {
        // console.log("+ filename change");
        this.applyRules();
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
        this.updateCustomCSS(styleName, `
			.${styleName} {
				border: ${rule.width}px solid ${rule.color} !important;
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

    async applyRules(file: TFile | null = null) {
        this.app.workspace.getLeavesOfType("markdown").forEach((value: WorkspaceLeaf) => {
            if (!(value.view instanceof MarkdownView)) return;
            const activeView = value.view as MarkdownView;
            const viewFile = activeView.file;
            if (file && file !== viewFile) return;
            const contentView = activeView.containerEl.querySelector(".view-content");
            if (!contentView) return;

            this.unhighlightNote(contentView);
            this.settings.colorRules.some((rule) => {
                return this.applyRule(viewFile, rule, contentView);
            });
        });
    }

    applyRule(file: TFile, rule: ColorRule, contentView: Element): boolean {
        switch (rule.type) {
            case RuleType.Folder: {
                if (checkPath(file.path, rule.value)) {
                    // console.log("- folder -", file);
                    // console.log(file.path);
                    // console.log(rule.value);
                    this.highlightNote(contentView, rule);
                    return true;
                }
                break;
            }
            case RuleType.Frontmatter: {
                // console.log("- front-matter -", file);
                // console.log(rule.value);
                const [key, value] = rule.value.split(":", 2);
                const frontMatterValue = this.app.metadataCache.getFileCache(file)?.frontmatter?.[key];
                const normalizedFrontMatterValue = frontMatterValue?.toString().toLowerCase().trim();
                const normalizedValueToHighlight = value?.toString().toLowerCase().trim();
                // console.log(`++ front matter: ${key}, ${value} :: ${normalizedFrontMatterValue} === ${normalizedValueToHighlight}`);
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

    makeStyleName(rule: ColorRule): string {
        return `cnb-${rule.id}-style`;
    }
}
