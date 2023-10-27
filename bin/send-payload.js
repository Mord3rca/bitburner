import * as s from "lib/server.js"

const PAYLOAD_NAME="payload.js"

async function exec_payload(ns, server, extra_arg="") {
	let t = ( ns.getServerMaxRam(server.hostname) - ns.getServerUsedRam(server.hostname) ) / ns.getScriptRam(PAYLOAD_NAME)
	let msg = "Exec payload on " + server.hostname
	if(extra_arg != "")
		msg += " with arg: " + extra_arg

	if(t < 1)
		return

	ns.tprint(msg)
	await ns.scp(PAYLOAD_NAME, server.hostname)
	ns.exec(PAYLOAD_NAME, server.hostname, Math.floor(t), extra_arg)
}

/** @param {NS} ns **/
export async function main(ns) {
	let servers = await s.readList(ns)
	let targets = servers.filter(
		function(s) {
			return s.hacking_skill <= ns.getHackingLevel() && s.has_root && s.max_money > 0
			}
		)
	targets.sort(function(a, b){return b.hacking_skill - a.hacking_skill})
	let owned = servers.filter(
		function(s) {
			return s.has_root && s.max_money == 0
		}
	)
	let best = targets[0]

	for(let i in targets) {
		await exec_payload(ns, targets[i])
	}

	for( let i in owned ) {
		await exec_payload(ns, owned[i], best.hostname)
	}
}
