# @qbane/sveltekit-template

My opinionated SvelteKit template in pure JavaScript.

This template is derived from [the official template](https://github.com/sveltejs/kit-template-default).

Some notable customizations are:

0. `package-lock.json` is NOT committed on purpose
1. The included adapter is changed from `auto` to `@sveltejs/adapter-node`, assuming that you are not targeting [any specific deployment target](https://svelte.dev/docs/kit/adapter-auto).
2. Split tsconfig of web/test/node environments via cascading `tsconfig.*.json` to avoid lib pollution while maintaining reasonable IDE/LSP expectations.
   - tsbuildinfos are always deleted after a `svelte-kit sync` run. This is intended to convince tsc to write new ones.

## Instructions

```bash
git clone https://github.com/qbane/sveltekit-template.git --depth=1
cd sveltekit-template
rm -rf .git .github LICENSE
git init
npm i
```
