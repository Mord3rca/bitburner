/*
	Library use to manage servers
*/

export const SERVER_LIST_TXT="/etc/server-list.txt"

export class Server {

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

export async function readList(ns) {
    var r = [];
    var lines = await ns.read(SERVER_LIST_TXT).split("\n");

    lines.forEach(function(line) {
        if (line.length <= 0)
            return;

        r.push(Server.fromJSON(line))
    })
    return r;
}

export async function discover(ns, hosts=['home']) {
    if (! ns.fileExists(SERVER_LIST_TXT)) {
        ns.write(SERVER_LIST_TXT, '')
    }
    ns.clear(SERVER_LIST_TXT);
    for(let i=0; i < hosts.length; i++) {
        let host = hosts[i];
        await ns.write(SERVER_LIST_TXT,
            JSON.stringify({
                hostname: host,
                has_root: ns.hasRootAccess(host),
                hacking_skill: ns.getServerRequiredHackingLevel(host),
                required_port: ns.getServerNumPortsRequired(host),
                ram: ns.getServerMaxRam(host),
                max_money: ns.getServerMaxMoney(host),
            }) + "\n"
        )

        var newscan = ns.scan(host);
        for(let j=0; j < newscan.length; j++) {
            if(hosts.indexOf(newscan[j]) == -1) {
                hosts.push(newscan[j])
            }
        }
    }
}
