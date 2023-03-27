import { App, Plugin, PluginSettingTab, Setting, TextComponent, ButtonComponent, DropdownComponent, ColorComponent } from 'obsidian';
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
			color: "#ffb300"
		},
		{
			id: "frontmatter-private-499749",
			value: "category: public",
			type: RuleType.Frontmatter,
			color: "#499749"
		},
		{
			id: "frontmatter-private-c44545",
			value: "category: private",
			type: RuleType.Frontmatter,
			color: "#c44545"
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

		containerEl.createEl('h2', { text: 'Highlight Color Rules' });

		// Display existing rules
		this.plugin.settings.colorRules.forEach((rule) => this.addRuleSetting(containerEl, rule));

		// Add new rule button
		new ButtonComponent(containerEl)
			.setButtonText('Add new rule')
			.onClick(() => {
				const newRule: ColorRule = {
					id: Date.now().toString(),
					value: '',
					type: RuleType.Folder,
					color: '#000000',
				};
				this.plugin.settings.colorRules.push(newRule);
				this.addRuleSetting(containerEl, newRule);
				this.plugin.saveSettings();
			});
	}

	addRuleSetting(containerEl: HTMLElement, rule: ColorRule): void {
		const ruleSettingDiv = containerEl.createEl('div', { cls: 'rule-setting' });

		// const ruleSetting = new Setting(ruleSettingDiv);
		// ruleSetting.setName("Color Rule");

		new Setting(ruleSettingDiv)
			.setName('Type')
			.addDropdown((dropdown: DropdownComponent) => {
				dropdown.addOption(RuleType.Folder, 'Folder');
				dropdown.addOption(RuleType.Frontmatter, 'Frontmatter');
				dropdown.setValue(rule.type);
				dropdown.onChange((value) => {
					rule.type = value as RuleType;
					console.log(`${value} :: ${rule.type}`);
					this.plugin.saveSettings();
				});
				return dropdown;
			});

		new Setting(ruleSettingDiv)
			.setName('Value')
			.addText((text) => text
				.setPlaceholder('Enter rule value')
				.setValue(rule.value)
				.onChange((value) => {
					rule.value = value;
					this.plugin.saveSettings();
				}));

		const colorSetting = new Setting(ruleSettingDiv)
			.setName('Color')
			.addText((text) => text
				.setPlaceholder('Enter color hex code')
				.setValue(rule.color)
				.onChange((value) => {
					rule.color = value;
					this.plugin.saveSettings();
				}));

		colorSetting.addColorPicker((picker) => {
			picker.setValue(rule.color);
			picker.onChange((color) => {
				rule.color = color;
				this.plugin.saveSettings();
			});
		});

		new ButtonComponent(ruleSettingDiv)
			.setButtonText('Remove')
			.setCta().onClick(() => {
				this.plugin.settings.colorRules = this.plugin.settings.colorRules.filter((r) => r.id !== rule.id);
				this.plugin.saveSettings();
				this.plugin.removeStyle(rule);
				ruleSettingDiv.remove();
			});
	}
}
