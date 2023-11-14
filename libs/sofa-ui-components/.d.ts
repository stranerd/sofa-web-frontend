declare module '@editorjs/header';
declare module '@editorjs/simple-image';
declare module '@editorjs/checklist';
declare module '@editorjs/list';
declare module '@editorjs/embed';
declare module '@editorjs/quote';

/* eslint-disable @typescript-eslint/ban-types */
declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}