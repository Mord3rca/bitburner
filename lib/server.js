/*
	Library use to manage servers
*/

export {discover, getServerByHostname, getServerList, Server};


const SERVER_LIST_TXT="/etc/server-list.txt";

class Server {

    constructor(host, hasroot, hacking_skill, required_port, ram, money, backdoor, purchased, previous) {
        this.hostname = host;
        this.has_root = hasroot;
        this.hacking_skill = hacking_skill;
        this.required_port = required_port;
        this.max_ram = ram;
        this.max_money = money;
        this.backdoored = backdoor;
        this.purchased = purchased;
        this.prev = previous;
    }

    toString() {
        return this.hostname;
    }
}

var servers_cache = null;
async function getServerList(ns, cache=true) {
    if (!servers_cache || !cache)
        servers_cache = Array.from(
            JSON.parse(await ns.read(SERVER_LIST_TXT)),
            (obj) => Object.assign(new Server, obj)
        );

    return servers_cache;
}

async function getServerByHostname(ns, hostname) {
    return (await getServerList(ns)).filter((s) => s.hostname == hostname)[0];
}

async function discover(ns, hosts=['home'], limit=15) {
    // Force creation & clear
    ns.write(SERVER_LIST_TXT, '');
    ns.clear(SERVER_LIST_TXT);

    let servers = [];
    function scan_server(ns, host, pstack=0) {
        // Avoid infinite loop
        if(pstack > limit)
            return;

        let nscan = ns.scan(host);
        for(const h of nscan) {
            // Skip if already known
            if (Array.from(servers, (it) => it.host).includes(h))
                continue;

            servers.push({host: h, prev: host});
            scan_server(ns, h, pstack + 1);
        }
    }

    for(const h of hosts) {
        servers.push({host: h, prev: null});
        scan_server(ns, h);
    }

    let result = [];
    for(const h of servers) {
        let srv = ns.getServer(h.host);
        result.push(new Server(
            h.host,
            srv.hasAdminRights,
            srv.requiredHackingSkill || 0,
            srv.numOpenPortsRequired || 0,
            srv.maxRam || 0,
            srv.moneyMax || 0,
            srv.backdoorInstalled || false,
            srv.purchasedByPlayer,
            h.prev,
        ));
    }
    servers_cache = result;
    await ns.write(SERVER_LIST_TXT, JSON.stringify(result));
}
