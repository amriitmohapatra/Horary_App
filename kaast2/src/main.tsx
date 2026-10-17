import { render } from 'preact';
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import '@fontsource/atkinson-hyperlegible/latin-400-italic.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/marcellus/latin-400.css';
import './ui/design/tokens.css';
import './ui/styles.css';
import { App } from './ui/app';

render(<App />, document.getElementById('app')!);
