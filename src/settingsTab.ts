import { App, PluginSettingTab, Setting, TextComponent, ButtonComponent, DropdownComponent, ColorComponent } from 'obsidian';
import ColorfulNoteBordersPlugin from './main';

export enum RuleType {
    Folder = "folder",
    Frontmatter = "frontmatter"
}

export interface ColorRule {
    id: string;
    value: string;
    type: RuleType;
    color: string;
	width: string;
}

export class ColorBorderSettings {
    colorRules: ColorRule[] = [];
}

export const DEFAULT_SETTINGS: ColorBorderSettings = {
    colorRules: [
        {
            id: "inbox-ffb300",
            value: "Inbox",
            type: RuleType.Folder,
            color: "#ffb300",
			width: "5"
        },
        {
            id: "frontmatter-public-499749",
            value: "category: public",
            type: RuleType.Frontmatter,
            color: "#499749",
			width: "5"
        },
        {
            id: "frontmatter-private-c44545",
            value: "category: private",
            type: RuleType.Frontmatter,
            color: "#c44545",
			width: "5"
        }
    ],
};

export class SettingsTab extends PluginSettingTab {
    plugin: ColorfulNoteBordersPlugin;

    constructor(app: App, plugin: ColorfulNoteBordersPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h1', { text: 'Colorful Note Borders Settings' });

        // Create a header row
        const headerRow = containerEl.createEl('div', { cls: 'cnb-rule-settings-header-row' });

        // Add labels for each column
        headerRow.createEl('span', { text: 'Rule Type', cls: 'cnb-rule-settings-column-rule-type' });
        headerRow.createEl('span', { text: 'Value', cls: 'cnb-rule-settings-column-rule-value' });
		headerRow.createEl("span", { text: "Width", cls: "cnb-rule-settings-column-rule-width" });
        headerRow.createEl('span', { text: 'Color', cls: 'cnb-rule-settings-column-rule-color' });
        headerRow.createEl('span', { text: '', cls: 'cnb-rule-settings-column-rule-button' });

        const rulesContainer = containerEl.createEl('div', { cls: 'cnb-rules-container' });

        // Display existing rules
        this.plugin.settings.colorRules.forEach((rule, index) => this.addRuleSetting(rulesContainer, rule, index));

        // Add new rule button
        new ButtonComponent(containerEl)
            .setButtonText('Add new rule')
            .onClick(() => {
                const newRule: ColorRule = {
                    id: Date.now().toString(),
                    value: '',
                    type: RuleType.Folder,
                    color: '#000000',
					width: '5',
                };
                this.plugin.settings.colorRules.push(newRule);
                this.addRuleSetting(rulesContainer, newRule);
                this.plugin.saveSettings();
            });
    }

    addRuleSetting(
        containerEl: HTMLElement,
        rule: ColorRule,
        index: number = this.plugin.settings.colorRules.length - 1,
    ): void {
        const ruleSettingDiv = containerEl.createEl('div', { cls: 'cnb-rule-settings-row' });

        new Setting(ruleSettingDiv)
            // .setName('Type')
            .setClass('cnb-rule-setting-item')
            .addDropdown((dropdown: DropdownComponent) => {
                dropdown.addOption(RuleType.Folder, 'Folder');
                dropdown.addOption(RuleType.Frontmatter, 'Frontmatter');
                dropdown.setValue(rule.type);
                dropdown.onChange((value) => {
                    rule.type = value as RuleType;
                    this.plugin.saveSettings();
                });
                dropdown.selectEl.classList.add('cnb-rule-type-dropdown');
            });

        new Setting(ruleSettingDiv)
            // .setName('Value')
            .setClass('cnb-rule-setting-item')
            .addText((text) => {
                text.setPlaceholder('Enter rule value');
                text.setValue(rule.value);
                text.onChange((value) => {
                    rule.value = value;
                    this.plugin.saveSettings();
                });
                text.inputEl.classList.add('cnb-rule-value-input');
            });
			
		new Setting(ruleSettingDiv)
            // .setName('Width')
            .setClass('cnb-rule-setting-item')
            .addText((text) => {
				text.setPlaceholder("Enter width in pixel");
				text.setValue(rule.width);
				text.onChange((value) => {
					rule.width = value;
					this.plugin.saveSettings();
				});
				text.inputEl.classList.add("cnb-rule-width-input");
            });

        const colorSetting = new Setting(ruleSettingDiv)
            .setClass('cnb-rule-setting-item');
        // .setName('Color');
        // colorSetting.settingEl.style.gridColumn = '3';

        const colorInput = new TextComponent(colorSetting.controlEl)
            .setPlaceholder('Enter color hex code')
            .setValue(rule.color);
        colorInput.inputEl.classList.add('cnb-rule-setting-item-text-input');

        const picker = new ColorComponent(colorSetting.controlEl)
            .setValue(rule.color)
            .onChange((color) => {
                rule.color = color;
                colorInput.setValue(color);
                this.plugin.saveSettings();
            });

        colorInput.onChange((value: string) => {
            if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value)) {
                rule.color = value;
                picker.setValue(value);
                this.plugin.saveSettings();
            }
        });

        new ButtonComponent(ruleSettingDiv)
            .setButtonText('▲')
            // .setIcon("up-arrow")
            .setTooltip("Move Up")
            .setClass('cnb-rule-setting-item-up-button')
            .setDisabled(index == 0)
            .onClick(() => {
                if (index > 0) {
                    this.plugin.settings.colorRules.splice(index, 1);
                    this.plugin.settings.colorRules.splice(index - 1, 0, rule);
                    this.plugin.saveSettings();
                    this.display();
                }
            });

        new ButtonComponent(ruleSettingDiv)
            .setButtonText('▼')
            // .setIcon("down-arrow")
            .setTooltip("Move Down")
            .setClass('cnb-rule-setting-item-down-button')
            .setDisabled(index == this.plugin.settings.colorRules.length - 1)
            .onClick(() => {
                if (index < this.plugin.settings.colorRules.length - 1) {
                    this.plugin.settings.colorRules.splice(index, 1);
                    this.plugin.settings.colorRules.splice(index + 1, 0, rule);
                    this.plugin.saveSettings();
                    this.display();
                }
            });

        new ButtonComponent(ruleSettingDiv)
            .setButtonText('Remove')
            // .setIcon('remove')
            // .setTooltip("Remove")
            .setClass('cnb-rule-setting-item-remove-button')
            .setCta().onClick(() => {
                this.plugin.settings.colorRules = this.plugin.settings.colorRules.filter((r) => r.id !== rule.id);
                this.plugin.saveSettings();
                this.plugin.removeStyle(rule);
                ruleSettingDiv.remove();
            });
    }
}
