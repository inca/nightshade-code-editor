export async function loadCodeMirror(opts: {
    language: string;
    placeholder: string;
    lineWrapping: boolean;
}): Promise<{
    EditorView: any;
    extensions: any[];
}> {
    const [
        { EditorView, highlightActiveLine, keymap, placeholder },
        { defaultKeymap, history, historyKeymap, indentWithTab },
        { closeBrackets, closeBracketsKeymap },
        { bracketMatching, defaultHighlightStyle, indentOnInput, syntaxHighlighting },
        { javascript },
        { json },
        { html },
        { markdown },
        { classHighlighter },
    ] = await Promise.all([
        import('@codemirror/view'),
        import('@codemirror/commands'),
        import('@codemirror/autocomplete'),
        import('@codemirror/language'),
        import('@codemirror/lang-javascript'),
        import('@codemirror/lang-json'),
        import('@codemirror/lang-html'),
        import('@codemirror/lang-markdown'),
        import('@lezer/highlight'),
    ]);
    const lang = opts.language === 'javascript' ?
        javascript() :
        opts.language === 'json' ?
            json() :
            opts.language === 'html' ?
                html({ selfClosingTags: true }) :
                opts.language === 'markdown' ?
                    markdown({ completeHTMLTags: false }) :
                    undefined;
    return {
        EditorView,
        extensions: [
            history(),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            bracketMatching(),
            closeBrackets(),
            highlightActiveLine(),
            syntaxHighlighting(classHighlighter),
            placeholder(opts.placeholder),
            opts.lineWrapping ? EditorView.lineWrapping : undefined,
            lang,
            keymap.of([
                ...defaultKeymap,
                indentWithTab,
                ...closeBracketsKeymap,
                ...historyKeymap,
            ]),
        ]
    };
}
