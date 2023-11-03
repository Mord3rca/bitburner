import {getServerByHostname} from 'lib/server.js';

export {getRoute};

async function getRoute(ns, hostname) {
    let r = [];

    let s = await getServerByHostname(ns, hostname);
    while(s) {
        r.push(s.hostname);
        s = await getServerByHostname(ns, s.prev);
    }

    return r.reverse();
}
