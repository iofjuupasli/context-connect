(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['react', 'ramda', 'reflux'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory('react', 'ramda', 'reflux');
    } else {
        root.contextConnect = factory(root.React, root.R, root.Reflux);
    }
}(this, function (React, R, Reflux) {
    return function (storeName, stateKeyName) {
        if (!stateKeyName) {
            stateKeyName = storeName;
        }
        return R.merge(Reflux.ListenerMethods, {
            contextTypes: {
                stores: React.PropTypes.object
            },
            getInitialState: function () {
                var state = {};
                state[stateKeyName] = this.context.stores[storeName].getInitialState();
                return state;
            },
            componentDidMount: function () {
                var store = this.context.stores[storeName];
                this.listenTo(store, function (v) {
                    var state = {};
                    state[stateKeyName] = v;
                    this.setState(state);
                }.bind(this));
            },
            componentWillUnmount: Reflux.ListenerMixin.componentWillUnmount
        });
    };
}));
