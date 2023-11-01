import {IniFile} from 'lib/config.js'
import {getServerList} from 'lib/server.js'

// Have to be >1 or it will only do weaken() call
const MIN_SEC_MULT=1.2
// Have to be <1 or it will only do grow() call
const MAX_MONEY_MULT=0.8

async function exec_default_payload(ns, server, payload, extra_arg) {
    let t = ( ns.getServerMaxRam(server.hostname) - ns.getServerUsedRam(server.hostname) ) / ns.getScriptRam(payload)
    if(t < 1)
        return

    ns.tprintf("Exec payload on %s", server.hostname)
    await ns.scp(payload, server.hostname)
    ns.exec(payload, server.hostname, Math.floor(t), ...extra_arg)
}

/** @param {NS} ns **/
export async function main(ns) {
    let cfg = new IniFile('/etc/target.txt')
    cfg.parse(ns)
    let target = cfg.get('Payload', 'target')
    let payload = cfg.get('Payload', 'name', '/bin/payloads/default.js')
    let servers = (await getServerList(ns)).filter((s) => s.has_root)
    for(const i of servers) {
        await exec_default_payload(ns, i, payload, [
            target,
            ns.getServerMinSecurityLevel(target) * MIN_SEC_MULT,
            ns.getServerMaxMoney(target) * MAX_MONEY_MULT
        ])
    }
}
