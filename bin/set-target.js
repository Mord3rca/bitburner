import {IniFile} from 'lib/config.js'
import {getServerList} from 'lib/server.js'

export async function main(ns) {
    var cfg = new IniFile('/etc/target.txt')
    var srv = (await getServerList(ns)).filter((s) => s.has_root && s.hacking_skill <= ns.getHackingLevel() && s.max_money > 0)
    srv.sort((a, b) => b.max_money - a.max_money)

    cfg.set('Payload', 'target', srv[0])
    cfg.save(ns)
}
