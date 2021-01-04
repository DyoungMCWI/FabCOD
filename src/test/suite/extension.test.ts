import * as path from 'path';
import * as vscode from 'vscode';
import { assert } from 'chai';
import * as entities from '../../support/entities';
import * as fs from 'fs-extra';
import * as parser from '../../support/parser';
//import * as documents from '../../support/document';

const complexPath = path.join(__dirname + '\\..\\..\\..\\test_cases\\complex.cod');
const massivePath = path.join(__dirname + '\\..\\..\\..\\test_cases\\massive.cod');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	let massives: Array<entities.Entity>; 
	let complexs: Array<entities.Entity>;
	let massive: string; 
	let complex: string;
	
	test('Read COD Test Files', () => {
		try {
			if (fs.statSync(complexPath).isFile()) {
				complex = fs.readFileSync(complexPath).toString();
			}	
			assert.isAbove(complex.length, 1);	
		} catch (error) {
			assert.fail('Failed to read "complex.cod"');
		}
		try {
			if (fs.statSync(massivePath).isFile()) {
				massive = fs.readFileSync(massivePath).toString();
			}
			assert.isAbove(massive.length, 1);
		} catch (error) {
			assert.fail('Failed to read "massive.cod"');
		}
	});
	test('Attempt Segmentation', () => {
		try {
			complexs = parser.CODParser.segmentation(complex);
			massives = parser.CODParser.segmentation(massive);
			assert.isAbove(complexs.length, 1);
			assert.isAbove(massives.length, 1);	
		} catch (error) {
			assert.fail('Segmentation Failed');
		}
	});
	test('Attempt Formulation', () => {
		const cids: parser.NameTracker = {
            creator: complexPath.toUpperCase(),
            variables: new Map<string, Array<entities.Entity>>(),
            functions: new Map<string, Array<entities.Entity>>(),
            importedFunctions: new Map<string, Array<entities.Entity>>(),
            includes: []
			};

		const mids: parser.NameTracker = {
			creator: massivePath.toUpperCase(),
			variables: new Map<string, Array<entities.Entity>>(),
			functions: new Map<string, Array<entities.Entity>>(),
			importedFunctions: new Map<string, Array<entities.Entity>>(),
			includes: []
			};

		try {
			const complexf = parser.CODParser.formulation(cids, complexs);
			const massivef = parser.CODParser.formulation(mids, massives);
			assert.isAbove(complexf[1].length, 1);
			assert.isAbove(massivef[1].length, 1);	
		} catch (error) {
			assert.fail('Formulation Failed');
		}
	});
	
});
