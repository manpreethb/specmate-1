"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ng_bootstrap_1 = require('@ng-bootstrap/ng-bootstrap');
require('rxjs/add/operator/switchMap');
var config_1 = require('../../config/config');
var CEGModel_1 = require('../../model/CEGModel');
var specmate_data_service_1 = require('../../services/specmate-data.service');
var Id_1 = require('../../util/Id');
var Url_1 = require('../../util/Url');
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var RequirementsDetails = (function () {
    function RequirementsDetails(dataService, router, route, ngModal) {
        this.dataService = dataService;
        this.router = router;
        this.route = route;
        this.ngModal = ngModal;
    }
    RequirementsDetails.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .switchMap(function (params) { return _this.dataService.readElement(params['url']); })
            .subscribe(function (requirement) {
            _this.requirement = requirement;
            _this.dataService.readContents(requirement.url).then(function (contents) {
                _this.contents = contents;
            });
        });
    };
    RequirementsDetails.prototype.delete = function (model) {
        this.ngModal.open("asd").result.then(function (val) { return console.log(val); }).catch(function (val) { return console.log(val); });
        /*this.modal.confirm()
            .message('Really Delete?')
            .open()
            .then((val: DialogRef<JSNativeModalContext>) => val.result)
            .then(() => this.dataService.deleteElement(model.url))
            .then(() => this.dataService.readContents(this.requirement.url, true))
            .then((contents: IContainer[]) => this.contents = contents)
            .catch(() => { });;*/
    };
    RequirementsDetails.prototype.createModel = function () {
        var _this = this;
        if (!this.contents) {
            return;
        }
        var model = new CEGModel_1.CEGModel();
        model.id = Id_1.Id.generate(this.contents, config_1.Config.CEG_MODEL_BASE_ID);
        var modelUrl = Url_1.Url.build([this.requirement.url, model.id]);
        model.url = modelUrl;
        model.name = config_1.Config.CEG_NEW_MODEL_NAME;
        model.description = config_1.Config.CEG_NEW_NODE_DESCRIPTION;
        this.dataService.createElement(model)
            .then(function () { return _this.dataService.readContents(model.url, true); })
            .then(function (contents) { return _this.contents = contents; })
            .then(function () { return _this.dataService.commit(); })
            .then(function () { return _this.router.navigate(['/requirements', { outlets: { 'main': [modelUrl, 'ceg'] } }]); });
    };
    RequirementsDetails = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'requirements-details',
            templateUrl: 'requirement-details.component.html',
            styleUrls: ['requirement-details.component.css']
        }), 
        __metadata('design:paramtypes', [specmate_data_service_1.SpecmateDataService, router_1.Router, router_1.ActivatedRoute, ng_bootstrap_1.NgbModal])
    ], RequirementsDetails);
    return RequirementsDetails;
}());
exports.RequirementsDetails = RequirementsDetails;
//# sourceMappingURL=requirement-details.component.js.map