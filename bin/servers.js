import {getServerList, discover} from 'lib/server.js'

var playerServers = null;

async function status(ns) {
    playerServers.forEach(function(srv) {
        ns.tprintf("%s with %i of RAM", srv.hostname, srv.max_ram)
    })
}

async function srvDel(ns) {
    let host = ns.args[1]
    ns.killall(host);
    if(!ns.deleteServer(host)) {
        ns.tprintf("Something went wrong will deleting server %s, aborting", host);
        return;
    }

    // Regenerate server cache
    await discover(ns)
}

export async function main(ns) {
    playerServers = (await getServerList(ns)).filter((srv) => srv.has_root && srv.hacking_skill == 1 && srv.max_money == 0 && !['home', 'darkweb'].includes(srv.hostname))
    // Sort by RAM usage
    playerServers.sort((a, b) =>b.max_ram - a.max_ram)
    let cmds = new Map()
        cmds.set('status', status);
        cmds.set('delete', srvDel);
    cmds.get(ns.args[0] || 'status')(ns)
}
