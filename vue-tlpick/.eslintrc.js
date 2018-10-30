module.exports = {
    root: true,
    extends: ['@vue/prettier', 'yelingfeng'],
    rules: {
        'prettier/prettier': [
            'waring',
            {
                singleQuote: true,
                semi: false,
                tabWidth: 4,
                'jsx-bracket-same-line': true
            }
        ],
        'no-inline-comments': 0,
        'no-console': 0,
        'no-debugger': 0
    }
}
