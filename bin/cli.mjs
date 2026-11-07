#!/usr/bin/env node
import { PixelGuardEngine } from '../src/engine.mjs';

const engine = new PixelGuardEngine();
const code = process.argv[2] || '<div className="text-blue-600 bg-white">Hello</div>';
console.log(JSON.stringify(engine.lintDesignTokens(code), null, 2));
