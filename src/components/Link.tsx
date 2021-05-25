import React from 'react';
import { EuiLink } from '@elastic/eui';
import { useHistory } from 'react-router';

const isModifiedEvent = (event) =>
    !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const isLeftClickEvent = (event) => event.button === 0;

const isTargetBlank = (event) => {
    const target = event.target.getAttribute('target');
    return target && target !== '_self';
};

export default function Link({ to, ...rest }) {
    const history = useHistory();

    function onClick(event) {
        if (event.defaultPrevented) {
            return;
        }

        if (isModifiedEvent(event) || !isLeftClickEvent(event) || isTargetBlank(event)) {
            return;
        }

        event.preventDefault();

        history.push(to);
    }

    const href = history.createHref({ pathname: to });

    const props = { ...rest, href, onClick };
    return <EuiLink {...props} />;
}
