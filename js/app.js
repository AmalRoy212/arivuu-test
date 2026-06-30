(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  window.Arivuu.initPage = function (page, params) {
    document.body.setAttribute('data-page', page);
    window.Arivuu.routerParams = params || new URLSearchParams();

    if (window.Arivuu.renderNavbar) window.Arivuu.renderNavbar(page);
    if (window.Arivuu.initStudentGuide) window.Arivuu.initStudentGuide(page);
    if (window.Arivuu.initSharedSections) window.Arivuu.initSharedSections(page);
    if (window.Arivuu.initMain) window.Arivuu.initMain(page);
    if (window.Arivuu.initContent) window.Arivuu.initContent(page);
    if (window.Arivuu.initServices) window.Arivuu.initServices(page);
    if (window.Arivuu.initContact) window.Arivuu.initContact(page);
  };
})();
