(function (Module) {
    'use strict';

    var database = require('./database');

    Module.setup = function (params, callback) {
        var router      = params.router,
            middleware  = params.middleware,
            controllers = params.controllers,
            pluginUri   = '/admin/plugins/custom-fields',
            apiUri      = '/api' + pluginUri;

        router.get(pluginUri, middleware.admin.buildHeader, Module.renderAdmin);
        router.get(apiUri, Module.renderAdmin);

        router.get(apiUri + '/fields', Module.getFields);
        router.put(apiUri + '/fields', Module.updateField);
        router.put(apiUri + '/fields/:fieldId/swap', Module.swapFields);
        router.delete(apiUri + '/fields/:fieldId', Module.deleteField);

        callback();
    };

    Module.renderAdmin = function (req, res, next) {
        res.render(
            'admin/plugins/custom-fields', {}
        );
    };

    var handleCriticalError = function (req, res, error) {
        return res.status(500).json(error);
    };

    //Public API
    Module.deleteField = function (req, res, next) {
        database.deleteField(req.params.fieldId, function (error) {
            if (error) {
                return handleCriticalError(req, res, error);
            }
            res.json({status: 'OK'});
        });
    };

    Module.getFields = function (req, res, next) {
        database.getFields(function (error, fields) {
            if (error) {
                return handleCriticalError(req, res, error);
            }
            res.json(fields);
        });
    };

    Module.swapFields = function (req, res, next) {
        //Returns same result as 'getFields'
        database.swapFields(req.params.fieldId, req.body.id, function (error, fields) {
            if (error) {
                return handleCriticalError(req, res, error);
            }
            res.json(fields);
        });
    };

    Module.updateField = function (req, res, next) {
        database.updateField(req.body.id, req.body.fieldKey, req.body.fieldName, function (error, field) {
            if (error) {
                return handleCriticalError(req, res, error);
            }
            res.json(field);
        });
    };

})(module.exports);