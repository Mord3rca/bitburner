/*
	Utility to hack servers based on skill, program available, ...
*/

import getServerList from 'lib/server.js';

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	let servers = await getServerList(ns);
	let maxport = 0;
	let modified = false;
	var hackDict = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject,
	};

	for(let i in hackDict) {
		if(ns.fileExists(i))
			maxport++;
	}

	for(let i in servers) {
		let server = servers[i];
		let portToHack = server.required_port;

		if(server.has_root)
			continue;

		if(portToHack > maxport)
			continue;

		ns.tprint("* Cracking " + server.hostname);
		for(let i in hackDict) {
			if(ns.fileExists(i)) {
				ns.tprint("  Using " + i);
				await hackDict[i](server.hostname);
				portToHack--;
			}
			if(portToHack <= 0)
				break;
		}

		ns.tprint("  Nuking server...");
		ns.nuke(server.hostname);
		modified = true;

		/*
		if(ns.getServerRequiredHackingLevel(server.hostname) <= ns.getHackingLevel()) {
			ns.tprint("Installing backdoor");
			await ns.singularity.installBackdoor();
		}
		*/
	}

	if(modified) {
		ns.tprint("* New entries, regenerating cache...");
		await server.discover(ns);
	}
}
