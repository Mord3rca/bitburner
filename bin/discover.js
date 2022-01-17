/*
	Call on discover from libserver
	Used to refresh server cache
*/

import * as server from "lib/server.js"

/** @param {NS} ns **/
export async function main(ns) {
	await server.discover(ns);
}
