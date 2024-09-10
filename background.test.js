const { expect } = require('chai');
const sinon = require('sinon');

global.chrome = {
  tabs: {
    query: sinon.stub()
  },
  runtime: {
    lastError: null
  },
  storage: {
    local: {
      set: sinon.stub()
    }
  }
};

const { storeActiveTabs } = require('./background');

describe('storeActiveTabs', () => {

  it('should save active tabs when multiple tabs are open', () => {
    const tabs = [
      { title: 'Tab 1', url: 'http://example.com' },
      { title: 'Tab 2', url: 'http://example.org' }
    ];
  
    chrome.tabs.query.yields(tabs);
  
    storeActiveTabs();
  
    expect(chrome.storage.local.set.calledOnce).to.be.true;
    expect(chrome.storage.local.set.calledWith({ activeTabs: [
      { title: 'Tab 1', url: 'http://example.com' },
      { title: 'Tab 2', url: 'http://example.org' }
    ] })).to.be.true;
  });
});
