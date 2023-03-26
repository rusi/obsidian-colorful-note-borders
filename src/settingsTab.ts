import { App, Plugin, PluginSettingTab, Setting, TextComponent, ButtonComponent, DropdownComponent } from 'obsidian';
import ColorfulNoteBordersPlugin from './main';

enum RuleType {
	Folder,
	Metadata
}

interface ColorRule {
	id: string;
	name: string;
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
			id: "Inbox",
			name: "Inbox",
			value: "Inbox",
			type: RuleType.Folder,
			color: "#FF0000"
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
					name: '',
					value: '',
					type: 'path',
					color: '#000000',
				};
				this.plugin.settings.colorRules.push(newRule);
				this.addRuleSetting(containerEl, newRule);
				this.plugin.saveSettings();
			});
	}

	addRuleSetting(containerEl: HTMLElement, rule: ColorRule): void {
		const ruleSettingDiv = containerEl.createEl('div', { cls: 'rule-setting' });

		new Setting(ruleSettingDiv)
			.setName('Name')
			.addText((text) => text
				.setPlaceholder('Enter rule name')
				.setValue(rule.name)
				.onChange((value) => {
					rule.name = value;
					this.plugin.saveSettings();
				}));

		new Setting(ruleSettingDiv)
			.setName('Value')
			.addText((text) => text
				.setPlaceholder('Enter rule value')
				.setValue(rule.value)
				.onChange((value) => {
					rule.value = value;
					this.plugin.saveSettings();
				}));

		new Setting(ruleSettingDiv)
			.setName('Type')
			.addDropdown((dropdown: DropdownComponent) => {
				dropdown.addOption('path', 'Path');
				dropdown.addOption('frontmatter', 'Frontmatter');
				dropdown.setValue(rule.type);
				dropdown.onChange((value) => {
					rule.type = value;
					this.plugin.saveSettings();
				});
				return dropdown;
			});

		new Setting(ruleSettingDiv)
			.setName('Color')
			.addText((text) => text
				.setPlaceholder('Enter color hex code')
				.setValue(rule.color)
				.onChange((value) => {
					rule.color = value;
					this.plugin.saveSettings();
				}));

		new ButtonComponent(ruleSettingDiv)
			.setButtonText('Remove')
			.setCta().onClick(() => {
				this.plugin.settings.colorRules = this.plugin.settings.colorRules.filter((r) => r.id !== rule.id);
				this.plugin.saveSettings();
				ruleSettingDiv.remove();
			});
	}
}
