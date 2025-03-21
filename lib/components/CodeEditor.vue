<template>
    <InputBase
        class="CodeEditor"
        :fixedHeight="false"
        :label="label">
        <div
            ref="editor"
            class="Editor"
            role="textbox" />
    </InputBase>
</template>

<script>
import { InputBase } from 'nightshade';

import { loadCodeMirror } from '../codemirror.ts';

export default {

    components: {
        InputBase,
    },

    props: {
        modelValue: { type: String },
        label: { type: String },
        language: { type: String, default: 'javascript' },
        zoom: { type: Number, default: 1 },
        placeholder: { type: String, default: '' },
        lineWrapping: { type: Boolean },
        focus: { type: Boolean, default: true },
    },

    emits: [
        'update:modelValue'
    ],

    data() {
        return {
            loading: false,
            // Hack to avoid infinite dispatch loops when the modelValue
            // is changed externally
            justDispatched: false,
        };
    },

    watch: {

        modelValue(newValue) {
            const { editorView } = this;
            if (!editorView) {
                return;
            }
            const currentValue = editorView.state.doc.toString();
            if (currentValue !== newValue) {
                this.justDispatched = true;
                editorView.dispatch({
                    changes: {
                        from: 0,
                        to: currentValue.length,
                        insert: newValue,
                    },
                });
            }
        },

    },

    mounted() {
        this.init();
    },

    methods: {

        async init() {
            try {
                this.loading = true;
                await this.initEditor();
            } finally {
                this.loading = false;
            }
        },

        async initEditor() {
            const { EditorView, extensions } = await loadCodeMirror({
                language: this.language,
                placeholder: this.placeholder,
                lineWrapping: this.lineWrapping,
            });
            this.editorView = new EditorView({
                doc: this.modelValue,
                extensions: [
                    ...extensions,
                    EditorView.updateListener.of(v => {
                        if (v.docChanged && !this.justDispatched) {
                            this.$emit('update:modelValue', v.state.doc.toString());
                        }
                        this.justDispatched = false;
                    }),
                ].filter(Boolean),
                parent: this.$refs.editor,
            });
        }

    }

};
</script>

<style>
:root {
    --code-mono-1: #383a42;
    --code-mono-2: #686b77;
    --code-mono-3: #a0a1a7;
    --code-active-line: #0000000d;
    --code-hue-1: #0184bb;
    --code-hue-2: #4078f2;
    --code-hue-3: #a626a4;
    --code-hue-4: #50a14f;
    --code-hue-5: #e45649;
    --code-hue-5-2: #c91243;
    --code-hue-6: #986801;
    --code-hue-6-2: #c18401;
}

.theme-dark {
    --code-mono-1: #abb2bf;
    --code-mono-2: #818896;
    --code-mono-3: #5c6370;
    --code-active-line: #fafafa0d;
    --code-hue-1: #56b6c2;
    --code-hue-2: #61aeee;
    --code-hue-3: #c678dd;
    --code-hue-4: #98c379;
    --code-hue-5: #e06c75;
    --code-hue-5-2: #be5046;
    --code-hue-6: #d19a66;
    --code-hue-6-2: #e6c07b;
}
</style>

<style scoped>
.Editor {
    flex: 1;
    position: relative;
    overflow: auto;
    display: flex;
    min-height: 0;
    min-width: 0;
    margin: 0 calc(-1 * var(--InputBase-padding));
}
</style>

<style>
.cm-editor {
    flex: 1;
    color: var(--code-mono-1);
}

.cm-editor.cm-focused {
    outline: 0 !important;
}

.cm-editor .cm-content {
    padding: var(--sphalf) 0;
}

.cm-editor .cm-gutters {
    display: none;
}

.cm-editor .cm-scroller {
    font-family: var(--font-monospace);
    font-variant-ligatures: none;
    font-size: 12px;
    line-height: 16px;
}

.cm-editor .cm-activeLine {
    background: transparent;
}

.cm-editor.cm-focused .cm-activeLine {
    background: var(--code-active-line);
}

.cm-editor .cm-cursor {
    border-color: var(--color-text-2);
    border-width: 2px;
}

.cm-editor .cm-matchingBracket {
    background: hsl(200deg, 50%, 50%, 0.25);
}

.cm-editor .cm-selectionBackground {
    background: rgba(0, 0, 0, 0.05);
}

.cm-editor.cm-focused .cm-selectionBackground {
    background: hsl(200deg, 50%, 50%, 0.25);
}

.tok-link {
    color: var(--code-hue-1);
}

.tok-heading {
    font-weight: var(--font-weight-bold);
}

.tok-emphasis {
    font-style: italic;
}

.tok-strong {
    font-weight: var(--font-weight-bold);
}

.tok-keyword {
    color: var(--code-hue-3);
}

.tok-atom {
    color: var(--code-hue-2);
}

.tok-bool {
    color: var(--code-hue-2);
}

.tok-url {
    color: var(--code-hue-1);
}

.tok-labelName {
    color: var(--code-mono-2);
}

.tok-inserted {
    color: var(--code-hue-4);
}

.tok-deleted {
    color: var(--code-hue-5);
}

.tok-literal {
    color: var(--code-hue-2);
}

.tok-string {
    color: var(--code-hue-4);
}

.tok-number {
    color: var(--code-hue-6);
}

.tok-variableName {
    color: var(--code-mono-1);
}

.tok-typeName {
    color: var(--code-hue-6);
}

.tok-namespace {
    color: var(--code-hue-6-2);
}

.tok-className {
    color: var(--code-hue-6-2);
}

.tok-macroName {
    color: var(--code-hue-6);
}

.tok-propertyName {
    color: var(--code-hue-5);
}

.tok-operator {
    color: var(--code-mono-2);
}

.tok-comment {
    color: var(--code-mono-3);
}

.tok-meta {
    color: var(--code-hue-2);
}

.tok-punctuation {
    color: var(--code-mono-1);
}

.tok-invalid {
    color: var(--code-hue-5);
}
</style>
