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
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var config_1 = require('../../../config/config');
var specmate_data_service_1 = require('../../../services/specmate-data.service');
var CEGNode_1 = require('../../../model/CEGNode');
var CEGCauseNode_1 = require('../../../model/CEGCauseNode');
var CEGEffectNode_1 = require('../../../model/CEGEffectNode');
var CEGConnection_1 = require('../../../model/CEGConnection');
var delete_tool_1 = require('./tools/delete-tool');
var Url_1 = require('../../../util/Url');
var connection_tool_1 = require('./tools/connection-tool');
var move_tool_1 = require('./tools/move-tool');
var node_tool_1 = require('./tools/node-tool');
var Type_1 = require("../../../util/Type");
var CEGEditor = (function () {
    function CEGEditor(formBuilder, dataService, router, route, location, changeDetector, modal) {
        this.formBuilder = formBuilder;
        this.dataService = dataService;
        this.router = router;
        this.route = route;
        this.location = location;
        this.changeDetector = changeDetector;
        this.modal = modal;
        this.rows = config_1.Config.CEG_EDITOR_DESCRIPTION_ROWS;
        this.editorHeight = (isNaN(window.innerHeight) ? window['clientHeight'] : window.innerHeight) * 0.75;
        this.causeNodeType = CEGCauseNode_1.CEGCauseNode;
        this.nodeType = CEGNode_1.CEGNode;
        this.effectNodeType = CEGEffectNode_1.CEGEffectNode;
        this.connectionType = CEGConnection_1.CEGConnection;
        this.createForm();
    }
    CEGEditor.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.clearCommits();
        this.route.params
            .switchMap(function (params) {
            return _this.dataService.readElement(params['url']);
        })
            .subscribe(function (model) {
            _this.model = model;
            _this.dataService.readContents(_this.model.url).then(function (contents) {
                _this.contents = contents;
                _this.setFormValues();
                _this.initTools();
            });
        });
    };
    CEGEditor.prototype.initTools = function () {
        this.tools = [
            new move_tool_1.MoveTool(),
            // new CauseNodeTool(this.container, this.contents, this.dataService),
            // new EffectNodeTool(this.container, this.contents, this.dataService),
            new node_tool_1.NodeTool(this.model, this.contents, this.dataService),
            new connection_tool_1.ConnectionTool(this.model, this.contents, this.dataService),
            new delete_tool_1.DeleteTool(this.contents, this.dataService)
        ];
        this.activate(this.tools[0]);
    };
    CEGEditor.prototype.createForm = function () {
        this.cegForm = this.formBuilder.group({
            name: ['', forms_1.Validators.required],
            description: ''
        });
    };
    CEGEditor.prototype.updateModel = function () {
        var name = this.cegForm.controls['name'].value;
        var description = this.cegForm.controls['description'].value;
        if (!description) {
            description = '';
        }
        if (name) {
            this.model.name = name;
            this.model.description = description;
        }
    };
    CEGEditor.prototype.setFormValues = function () {
        this.cegForm.setValue({
            name: this.model.name,
            description: this.model.description
        });
    };
    CEGEditor.prototype.save = function () {
        this.updateModel();
        this.dataService.updateElement(this.model, true);
        // We need to update all nodes to save new positions.
        for (var i = 0; i < this.contents.length; i++) {
            var currentElement = this.contents[i];
            if (Type_1.Type.is(currentElement, CEGNode_1.CEGNode) || Type_1.Type.is(currentElement, CEGCauseNode_1.CEGCauseNode) || Type_1.Type.is(currentElement, CEGEffectNode_1.CEGEffectNode)) {
                this.dataService.updateElement(this.contents[i], true);
            }
        }
        this.dataService.commit();
    };
    CEGEditor.prototype.delete = function () {
        /*this.modal.confirm()
            .message('Really Delete?')
            .open()
            .then((val: DialogRef<JSNativeModalContext>) => val.result)
            .then(() => this.dataService.clearCommits())
            .then(() => this.dataService.deleteElement(this.model.url))
            .then(() => {
                return this.dataService.commit();
            })
            .then(() => {
                this.router.navigate(['/requirements', { outlets: { 'main': [Url.parent(this.model.url)] } }]);
            }).catch(() => { });*/
    };
    CEGEditor.prototype.discard = function () {
        var _this = this;
        return Promise.resolve().then(function () { return _this.dataService.clearCommits(); })
            .then(function () { return _this.dataService.readElement(_this.model.url); })
            .then(function (model) {
            _this.model = model;
            _this.setFormValues();
        })
            .then(function () {
            return _this.dataService.readContents(_this.model.url);
        })
            .then(function (contents) {
            _this.contents = contents;
        }).catch(function () { });
        /*return this.modal.confirm()
            .message('Really discard unsaved changes?')
            .open()
            .then((val: DialogRef<JSNativeModalContext>) => val.result)
            .then(() => this.dataService.clearCommits())
            .then(() => this.dataService.readElement(this.model.url))
            .then((model: IContainer) => {
                this.model = model;
                this.setFormValues();
            })
            .then(() => {
                return this.dataService.readContents(this.model.url);
            })
            .then((contents: IContainer[]) => {
                this.contents = contents;
            }).catch(() => { });*/
    };
    CEGEditor.prototype.close = function () {
        var _this = this;
        this.discard().then(function () { return _this.router.navigate(['/requirements', { outlets: { 'main': [Url_1.Url.parent(_this.model.url)] } }]); }).catch(function () { });
    };
    Object.defineProperty(CEGEditor.prototype, "ready", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * =================================
     * EDITOR HANDLING
     * =================================
     */
    CEGEditor.prototype.activate = function (tool) {
        if (!tool) {
            return;
        }
        if (this.activeTool) {
            this.activeTool.deactivate();
        }
        this.activeTool = tool;
        this.activeTool.activate();
    };
    CEGEditor.prototype.isActive = function (tool) {
        return this.activeTool === tool;
    };
    Object.defineProperty(CEGEditor.prototype, "selectedNodes", {
        get: function () {
            if (this.activeTool) {
                return this.activeTool.selectedElements;
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    CEGEditor.prototype.isSelected = function (element) {
        return this.selectedNodes.indexOf(element) >= 0;
    };
    CEGEditor.prototype.select = function (element) {
        if (this.activeTool) {
            this.activeTool.select(element);
        }
        this.navigateToSelectedElement();
    };
    CEGEditor.prototype.click = function (evt) {
        if (this.activeTool) {
            this.activeTool.click(evt);
        }
        this.navigateToSelectedElement();
    };
    CEGEditor.prototype.navigateToSelectedElement = function () {
        if (this.selectedNodes && this.selectedNodes.length > 0) {
            var selectedNode = this.selectedNodes[this.selectedNodes.length - 1];
            this.router.navigate([{ outlets: { 'ceg-node-details': [selectedNode.url, 'ceg-node-details'] } }], { relativeTo: this.route });
        }
    };
    CEGEditor = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ceg-editor',
            templateUrl: 'ceg-editor.component.html'
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, specmate_data_service_1.SpecmateDataService, router_1.Router, router_1.ActivatedRoute, common_1.Location, core_1.ChangeDetectorRef, ng_bootstrap_1.NgbModal])
    ], CEGEditor);
    return CEGEditor;
}());
exports.CEGEditor = CEGEditor;
//# sourceMappingURL=ceg-editor.component.js.map