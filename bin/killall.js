/*
    Killall PIDs from host / all servers
    args:
        * host (optional)  - All if not set.
*/

import {getServerList} from 'lib/server.js';

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    let servers = [ns.args[0]]
    if (!servers[0])
        servers = (await getServerList(ns)).map((e) => e.hostname);

    servers.forEach((i) => ns.killall(i, true));
}
