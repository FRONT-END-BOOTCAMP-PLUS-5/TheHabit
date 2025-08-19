module.exports = {
	extends: ['@commitlint/config-conventional'],
	// 템플릿: "<type> : <subject>" (콜론 앞뒤 공백 허용)
	parserPreset: {
		parserOpts: {
			headerPattern: /^(\w*)(?:\((.*)\))?!?\s*:\s*(.*)$/,
			headerCorrespondence: ['type', 'scope', 'subject'],
		},
	},
	rules: {
		// .gitmessage.txt 타입 반영
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'docs', 'test', 'refact', 'style', 'chore', 'build', 'ci', 'perf', 'revert'],
		],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'subject-empty': [2, 'never'],
		// 제목 50자, 끝 마침표 금지
		'subject-max-length': [2, 'always', 50],
		'subject-full-stop': [2, 'never', '.'],
		// 헤더 전체 길이 72자 권장
		'header-max-length': [2, 'always', 72],
		// scope는 선택
		'scope-case': [0],
		'scope-empty': [0],
	},
};
