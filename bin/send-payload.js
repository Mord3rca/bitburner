import {getServerList} from 'lib/server.js'

const PAYLOAD_NAME="payload.js"

// Have to be >1 or it will only do weaken() call
const MIN_SEC_MULT=1.2
// Have to be <1 or it will only do grow() call
const MAX_MONEY_MULT=0.8

async function exec_payload(ns, server, extra_arg) {
    let t = ( ns.getServerMaxRam(server.hostname) - ns.getServerUsedRam(server.hostname) ) / ns.getScriptRam(PAYLOAD_NAME)
    if(t < 1)
        return

    ns.tprintf("Exec payload on %s", server.hostname)
    await ns.scp(PAYLOAD_NAME, server.hostname)
    ns.exec(PAYLOAD_NAME, server.hostname, Math.floor(t), ...extra_arg)
}

/** @param {NS} ns **/
export async function main(ns) {
    let servers = await getServerList(ns)
    let targets = servers.filter(
        (srv) => srv.hacking_skill <= ns.getHackingLevel() && srv.has_root && srv.max_money > 0
    )
    targets.sort((a, b) => b.max_money - a.max_money)
    let owned = servers.filter((srv) => srv.has_root && srv.max_money == 0);
    let best = servers.find((srv) => srv.hostname == ns.args[0]) || targets[0];

    targets.concat(owned).forEach(async (i) =>
        await exec_payload(ns, i, [
            best.hostname,
            ns.getServerMinSecurityLevel(best.hostname) * MIN_SEC_MULT,
            ns.getServerMaxMoney(best.hostname) * MAX_MONEY_MULT
        ])
    );
}
