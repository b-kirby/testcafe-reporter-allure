module.exports = {
  plugins: [
    // https://github.com/semantic-release/commit-analyzer/
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        // https://github.com/semantic-release/commit-analyzer/#releaserules
        // https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js
        // These rules extend the default rules, uses the Convential Commit types
        releaseRules: [
          { type: 'build', release: 'patch' },
          { type: 'ci', release: 'patch' },
          { type: 'chore', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'test', release: 'patch' },
        ],
      },
    ],

    // https://github.com/semantic-release/release-notes-generator
    '@semantic-release/release-notes-generator',

    // https://github.com/semantic-release/changelog
    // Must be called before npm and git plugins
    // Uses the result of the release-notes-generator to generate the CHANGELOG.md.
    [
      '@semantic-release/changelog',
      {
        changelogTitle:
          '# Changelog\n\nAll notable changes to this project will be documented in this file. See\n[Conventional Commits](https://conventionalcommits.org) for commit guidelines.',
      },
    ],

    // https://github.com/semantic-release/npm
    '@semantic-release/npm',

    // https://github.com/semantic-release/git
    '@semantic-release/git',

    // ["@semantic-release/release-notes-generator", {
    //   "preset": "angular",
    //   "writerOpts": {
    //     "commitsSort": ["subject", "scope"]
    //   }
    // }]
  ],
  branches: ['master', 'feature/semantic-release'],
  ci: false,
  dryRun: true,
};
