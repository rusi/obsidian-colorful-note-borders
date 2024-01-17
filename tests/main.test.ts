
/**
 * @jest-environment jsdom
 */
import { describe, expect, test } from '@jest/globals';
import { checkPath } from '../src/main';


jest.mock('obsidian', () => {
    class MockPlugin {
        app: any;
        constructor(app: any) {
            this.app = app;
        }
        // Add any mock methods or properties as needed
    }

    return {
        Plugin: MockPlugin,
        PluginSettingTab: class {
            constructor(app: any, plugin: any) {
                // Mock properties and methods as needed
            }
        },
        // ... other Obsidian exports
    };
});


describe('utility functions', () => {
    it('ensure checkPath matches full folders', () => {
        expect(checkPath("Other/Two Rules.md", "Other")).toBe(true);
    });
    it('should not match filenames', () => {
        expect(checkPath("Obsidian/readme.md", "Obsidian")).toBe(true);
        // Issue #4 - https://github.com/rusi/obsidian-colorful-note-borders/issues/4
        expect(checkPath("Index/300-Obsidian-index.md", "Obsidian")).toBe(false);
    });
    it('should match Windows style paths', () => {
        expect(checkPath("Obsidian\\readme.md", "Obsidian")).toBe(true);
    });
    it('should match paths with spaces', () => {
        expect(checkPath("Inbox/Test Note/test note with spaces.md", "Test Note")).toBe(true);
    });
});
