app.filter('capitalizeeachword', function () {
    return function (input) {
        if (input != null)
            return input
                .toLowerCase()
                .split(' ')
                .map(function (word) {
                    return word[0].toUpperCase() + word.substr(1);
                })
                .join(' ');

    }

});

app.filter('onlyengletters', function () {
    return function (input) {
        if (input != null)       
            return input.replace(/[^a-z0-9\s]+/ig, '');
    }
});

app.filter('pagination', function () {
    return function (input, start) {
        start =+ start;
        return input.slice(start);
    };
});