'use strict'
const init = require('../helpers/init')
const sauce = require('./sauce')
// 99266d6da54cc12f37f11586e8171546c7700d67

const gistid = 'ceb44cee32b2073e4d0d5ec5729cc9d2';

module.exports = {
	before: function (browser, done) {
		init(browser, done);
	},
	'From Gist': function (browser) {
		browser
			.waitForElementVisible('#icon-panel', 10000)
			.scrollAndClick('.file .btn-group button:nth-of-type(1)') // this selector is a bit dangeours
			.waitForElementVisible('#modal-footer-ok', 4000)
			.setValue('input[id="prompt_text"]', `https://gist.github.com/jernejc/${gistid}`)
			.modalFooterOKClick()
			.switchFile('browser/gists')
			.switchFile(`browser/gists/${gistid}`)
			.switchFile(`browser/gists/${gistid}/SimpleStorage.sol`)
			.end();
	},
	tearDown: sauce
}
