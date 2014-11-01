'use strict';

/*jslint browser: true*/
/* global navigator: true */
/* global jQuery: true */
/* global swal: true */
/* global App: true */
/* global io: true */

var socket,
    signInButton = jQuery('#sign-in-button'),
    stories = jQuery('#stories'),
    storyNew = jQuery('#story-new'),
    storyNewTextarea = jQuery('#story-new-textarea');

socket = io.connect('');

socket.on('update', function (data) {
    stories.append(jQuery(data));
    console.log(data);
    console.log('update');
});

function signIn(assertion) {
    var form = jQuery('<form action="/auth" method="post">' +
    '<input id="sign-in-assertion" type="hidden" name="assertion" />' +
    '<input id="sign-in-assertion-token" type="hidden" name="_csrf">' +
    '</form>');

    form.appendTo(document.body);

    jQuery('#sign-in-assertion').val(assertion);
    jQuery('#sign-in-assertion-token').val(App.token);

    form.submit();
}

function startAuthentication() {
    navigator.id.get(function assert(assertion) {
        if (!assertion) {
            swal('Authentication failed! :(');
            return;
        }

        signIn(assertion);
    });
}

function postMessage(message) {
    return jQuery.ajax({
        type: 'POST',
        url: '/message',
        data: {
            message: message
        }
    });
}

function storyNewListener(event) {
    var res;
    event.preventDefault();

    res = postMessage(storyNewTextarea.val());
    storyNewTextarea.prop('disabled', true);

    res.done(function() {
        storyNewTextarea.val('');
    }).fail(function() {
        swal('Message failed! :(');
    }).always(function() {
        storyNewTextarea.prop('disabled', false);
    });
}

function signInButtonListener(event) {
    event.preventDefault();
    startAuthentication();
}

// submit on enter (without a modifier)
storyNewTextarea.on('keyup', function(event) {
    if (event.keyCode !== 13) {
        return;
    }

    if (event.altKey || event.shiftKey || event.ctrlKey) {
        return;
    }

    storyNew.submit();
});

storyNew.on('submit', storyNewListener);
signInButton.on('click', signInButtonListener);
