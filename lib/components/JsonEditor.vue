<template>
    <div class="JsonEditor">
        <CodeEditor
            v-bind="{
                ...$props,
                modelValue: stringValue,
                language: 'json',
            }"
            @update:modelValue="onUpdate($event)" />
        <div
            v-if="error"
            class="Error">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script>
import { InputBase } from 'nightshade';

import CodeEditor from './CodeEditor.vue';

export default {

    components: {
        CodeEditor,
    },

    props: {
        ...InputBase.props,
        modelValue: {},
        label: { type: String },
    },

    emits: [
        'update:modelValue',
        'error:modelValue',
    ],

    data() {
        return {
            stringValue: JSON.stringify(this.modelValue, null, 2),
            error: null,
        };
    },

    computed: {

        errorMessage() {
            const { error } = this;
            return error?.message ?? error ?? '';
        }

    },

    methods: {

        onUpdate(value) {
            try {
                this.$emit('update:modelValue', JSON.parse(value));
                this.error = null;
            } catch (error) {
                this.error = error;
                this.$emit('error:modelValue', error);
            }
        },

    },

};
</script>

<style scoped>
.JsonEditor {
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.Error {
    display: flex;
    padding: var(--sp);
    color: var(--color-danger);
}
</style>
