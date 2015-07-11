(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['react/addons', 'ramda', 'reflux'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('react/addons'), require('ramda'), require('reflux'));
    } else {
        root.contextConnect = factory(root.React, root.R, root.Reflux);
    }
}(this, function (React, R, Reflux) {
    return function (storeName, stateKeyName, getter) {
        if (!stateKeyName) {
            stateKeyName = storeName;
        }
        if (!getter) {
            getter = function (store) {
                return store.getInitialState();
            };
        }
        return R.merge(Reflux.ListenerMethods, {
            contextTypes: {
                stores: React.PropTypes.object
            },
            getInitialState: function () {
                var state = {};
                state[stateKeyName] = getter.call(this,
                    this.context.stores[storeName]);
                return state;
            },
            componentDidMount: function () {
                var store = this.context.stores[storeName];
                this.listenTo(store, function (v) {
                    var state = {};
                    state[stateKeyName] = getter.call(this,
                        this.context.stores[storeName]);
                    this.setState(state);
                }.bind(this));
            },
            componentWillUnmount: Reflux.ListenerMixin.componentWillUnmount
        });
    };
}));
