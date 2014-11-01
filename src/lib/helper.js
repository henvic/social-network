'use strict';

module.exports = function(modules) {
    var soynode = modules.soynode;

    /**
     * soynode's rendering wrapper
     */
    module.exports.render = function(templatename, data, req) {
        var content;

        if (req) {
            data.sessionUser = req.user;
            // data.sessionToken = req.csrfToken();
        }

        try {
            content = soynode.render(templatename, data);

            if (content.content) {
                content = content.content;
            }
        } catch (error) {
            console.error('Error rendering template: %s', error);
            content = 'Internal Server Error.';
        } finally {
            return content;
        }
    };

    return module.exports;
};
