/*
	Library use to manage servers
*/

export {getServerList, Server, discover}


const SERVER_LIST_TXT="/etc/server-list.txt"

class Server {

    constructor(host, hasroot, hacking_skill, required_port, ram, money) {
        this.hostname = host;
        this.has_root = hasroot;
        this.hacking_skill = hacking_skill;
        this.required_port = required_port;
        this.max_ram = ram;
        this.max_money = money;
    }

    toJson() {
        return JSON.stringify({
            hostname: this.hostname,
            has_root: this.has_root,
            hacking_skill: this.hacking_skill,
            required_port: this.required_port,
            max_ram: this.max_ram,
            max_money: this.max_money,
        });
    }

    static fromJSON(d) {
        var data = JSON.parse(d);
        return new Server(
            data.hostname,
            data.has_root,
            data.hacking_skill,
            data.required_port,
            data.max_ram,
            data.max_money
        );
    }

    toString() {
        return this.hostname;
    }
}

async function getServerList(ns) {
    var r = [];
    var lines = await ns.read(SERVER_LIST_TXT).split("\n");

    lines.forEach(function(line) {
        if (line.length <= 0)
            return;

        r.push(Server.fromJSON(line))
    })
    return r;
}

async function discover(ns, hosts=['home'], limit=15) {
    // Force creation & clear
    ns.write(SERVER_LIST_TXT, '')
    ns.clear(SERVER_LIST_TXT);

    let servers = []
    function scan_server(ns, host, pstack=0) {
        // Avoid infinite loop
        if(pstack > limit)
            return

        let nscan = ns.scan(host)
        for(const h of nscan) {
            // Skip if already known
            if (Array.from(servers, (it) => it.host).includes(h))
                continue

            servers.push({host: h, prev: host})
            scan_server(ns, h, pstack + 1)
        }
    }

    for(const h of hosts) {
        servers.push({host: h, prev: null})
        scan_server(ns, h)
    }

    let result = []
    for(const h of servers) {
        let srv = ns.getServer(h.host)
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
        ))
    }
    await ns.write(SERVER_LIST_TXT, JSON.stringify(result))
}
